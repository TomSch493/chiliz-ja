/**
 * Authentication Helper Functions
 * Handles wallet-based authentication with JWT sessions
 */

import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'
import { User } from '@prisma/client'
import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_THIS_SECRET_IN_PRODUCTION'
const SESSION_COOKIE_NAME = 'auth_session'
const SESSION_DURATION_DAYS = 7

/**
 * Generate a random nonce for wallet authentication
 */
export function generateNonce(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Create an authentication message for wallet signing
 */
export function createAuthMessage(nonce: string, address: string): string {
  return `Sign this message to authenticate with your wallet.

Address: ${address}
Nonce: ${nonce}

This request will not trigger a blockchain transaction or cost any gas fees.`
}

/**
 * Create a JWT session token
 */
export function createSessionToken(userId: string): string {
  const expiresIn = `${SESSION_DURATION_DAYS}d`
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn })
}

/**
 * Verify a JWT session token
 */
export function verifySessionToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Store a session in the database and set cookie
 */
export async function createSession(userId: string): Promise<string> {
  const token = createSessionToken(userId)
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS)

  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  })

  // Set HTTP-only cookie
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
    path: '/',
  })

  return token
}

/**
 * Get current user from session cookie
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (!sessionToken) {
      return null
    }

    // Verify JWT
    const decoded = verifySessionToken(sessionToken)
    if (!decoded) {
      return null
    }

    // Find session in DB
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    })

    if (!session) {
      return null
    }

    // Check if session expired
    if (session.expiresAt < new Date()) {
      await prisma.session.delete({ where: { id: session.id } })
      return null
    }

    return session.user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Destroy current session
 */
export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (sessionToken) {
      // Delete from database
      await prisma.session.deleteMany({
        where: { token: sessionToken },
      })
    }

    // Clear cookie
    cookieStore.delete(SESSION_COOKIE_NAME)
  } catch (error) {
    console.error('Error destroying session:', error)
  }
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized - Please connect your wallet')
  }
  return user
}

/**
 * Clean up expired sessions (can be called periodically)
 */
export async function cleanupExpiredSessions(): Promise<void> {
  await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  })
}

/**
 * POST /api/auth/verify
 * Verify wallet signature and create session
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ethers } from 'ethers'
import { prisma } from '@/lib/prisma'
import { createSession, createAuthMessage } from '@/lib/auth'
import { isValidAddress } from '@/lib/ethers'

const RequestSchema = z.object({
  address: z.string().min(42).max(42),
  signature: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address, signature } = RequestSchema.parse(body)

    // Validate Ethereum address
    if (!isValidAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address' },
        { status: 400 }
      )
    }

    // Normalize address to lowercase
    const normalizedAddress = address.toLowerCase()

    // Find user and retrieve nonce
    const user = await prisma.user.findUnique({
      where: { address: normalizedAddress },
    })

    if (!user || !user.nonce) {
      return NextResponse.json(
        { error: 'No nonce found. Please request a nonce first.' },
        { status: 400 }
      )
    }

    // Recreate the message that was signed
    const message = createAuthMessage(user.nonce, normalizedAddress)

    // Verify the signature
    let recoveredAddress: string
    try {
      recoveredAddress = ethers.verifyMessage(message, signature)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Check if recovered address matches the claimed address
    if (recoveredAddress.toLowerCase() !== normalizedAddress) {
      return NextResponse.json(
        { error: 'Signature verification failed' },
        { status: 401 }
      )
    }

    // Clear the nonce (prevent replay attacks)
    await prisma.user.update({
      where: { id: user.id },
      data: { nonce: null },
    })

    // Create session
    await createSession(user.id)

    return NextResponse.json({
      success: true,
      address: normalizedAddress,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error verifying signature:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

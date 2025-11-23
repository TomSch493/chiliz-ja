/**
 * POST /api/auth/nonce
 * Generate a nonce for wallet authentication
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { generateNonce, createAuthMessage } from '@/lib/auth'
import { isValidAddress } from '@/lib/ethers'

const RequestSchema = z.object({
  address: z.string().min(42).max(42),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address } = RequestSchema.parse(body)

    // Validate Ethereum address
    if (!isValidAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address' },
        { status: 400 }
      )
    }

    // Normalize address to lowercase
    const normalizedAddress = address.toLowerCase()

    // Generate nonce
    const nonce = generateNonce()

    // Store nonce in user record (create user if doesn't exist)
    await prisma.user.upsert({
      where: { address: normalizedAddress },
      update: { nonce },
      create: {
        address: normalizedAddress,
        nonce,
      },
    })

    // Create message to sign
    const message = createAuthMessage(nonce, normalizedAddress)

    return NextResponse.json({
      message,
      nonce,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error generating nonce:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

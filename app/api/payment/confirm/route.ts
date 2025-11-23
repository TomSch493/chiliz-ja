/**
 * POST /api/payment/confirm
 * Verify and record a payment transaction
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { verifyPaymentTransaction } from '@/lib/ethers'

const RequestSchema = z.object({
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash'),
})

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth()

    const body = await request.json()
    const { txHash } = RequestSchema.parse(body)

    // Check if payment already exists
    const existingPayment = await prisma.payment.findUnique({
      where: { txHash },
    })

    if (existingPayment) {
      if (existingPayment.status === 'CONFIRMED') {
        return NextResponse.json({
          success: true,
          status: 'CONFIRMED',
          message: 'Payment already confirmed',
        })
      }
      // If pending or failed, we'll re-verify
    }

    // Verify the transaction on-chain
    const verification = await verifyPaymentTransaction(txHash)

    if (!verification.valid) {
      // Update or create payment record as FAILED
      await prisma.payment.upsert({
        where: { txHash },
        update: {
          status: 'FAILED',
          updatedAt: new Date(),
        },
        create: {
          userId: user.id,
          txHash,
          amount: '0',
          status: 'FAILED',
        },
      })

      return NextResponse.json(
        { error: verification.error || 'Transaction verification failed' },
        { status: 400 }
      )
    }

    // Verify the payer matches the authenticated user
    if (verification.payerAddress && verification.payerAddress.toLowerCase() !== user.address.toLowerCase()) {
      return NextResponse.json(
        { error: 'Transaction payer does not match authenticated user' },
        { status: 403 }
      )
    }

    // Create or update payment record as CONFIRMED
    const payment = await prisma.payment.upsert({
      where: { txHash },
      update: {
        status: 'CONFIRMED',
        amount: verification.paymentAmount || '0',
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        txHash,
        amount: verification.paymentAmount || '0',
        status: 'CONFIRMED',
      },
    })

    return NextResponse.json({
      success: true,
      status: 'CONFIRMED',
      payment: {
        id: payment.id,
        txHash: payment.txHash,
        amount: payment.amount,
        createdAt: payment.createdAt,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized - Please connect your wallet' },
        { status: 401 }
      )
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error confirming payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

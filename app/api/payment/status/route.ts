/**
 * GET /api/payment/status
 * Check if current user has made a confirmed payment
 */

import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Require authentication
    const user = await requireAuth()

    // Find confirmed payments for this user
    const confirmedPayment = await prisma.payment.findFirst({
      where: {
        userId: user.id,
        status: 'CONFIRMED',
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      hasPaid: !!confirmedPayment,
      payment: confirmedPayment ? {
        id: confirmedPayment.id,
        txHash: confirmedPayment.txHash,
        amount: confirmedPayment.amount,
        createdAt: confirmedPayment.createdAt,
      } : null,
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized - Please connect your wallet' },
        { status: 401 }
      )
    }

    console.error('Error checking payment status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

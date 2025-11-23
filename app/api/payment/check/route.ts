import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get current user from session
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const userId = user.id

    // Check if user has any confirmed payments
    const payment = await prisma.payment.findFirst({
      where: {
        userId: userId,
        status: 'CONFIRMED',
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      hasPaid: !!payment,
      payment: payment ? {
        txHash: payment.txHash,
        amount: payment.amount,
        createdAt: payment.createdAt,
      } : null,
    })
  } catch (error: any) {
    console.error('Check payment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

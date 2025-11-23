import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    // Get JWT from cookie
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Verify JWT
    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const userId = decoded.userId

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

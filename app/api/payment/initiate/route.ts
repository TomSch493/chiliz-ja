/**
 * POST /api/payment/initiate
 * Get payment contract details for frontend to initiate transaction
 */

import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

export async function POST() {
  try {
    // Require authentication
    await requireAuth()

    // Return contract configuration for frontend
    const paymentConfig = {
      chzTokenAddress: process.env.CHZ_TOKEN_ADDRESS,
      paymentContractAddress: process.env.PAYMENT_CONTRACT_ADDRESS,
      fixedChzAmount: process.env.FIXED_CHZ_AMOUNT,
    }

    // Validate all required env vars are present
    if (!paymentConfig.chzTokenAddress || !paymentConfig.paymentContractAddress || !paymentConfig.fixedChzAmount) {
      console.error('Missing payment configuration environment variables')
      return NextResponse.json(
        { error: 'Payment system is not configured properly' },
        { status: 500 }
      )
    }

    return NextResponse.json(paymentConfig)
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized - Please connect your wallet' },
        { status: 401 }
      )
    }

    console.error('Error initiating payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

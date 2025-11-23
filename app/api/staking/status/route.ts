/**
 * GET /api/staking/status
 * Check staking status for current authenticated user
 */

import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getStakedAmount } from '@/lib/ethers'

export async function GET() {
  try {
    // Require authentication
    const user = await requireAuth()

    // Get minimum staked amount from env (50 USD worth of CHZ)
    const minStakedAmountStr = process.env.MIN_STAKED_AMOUNT_CHZ
    if (!minStakedAmountStr) {
      console.error('MIN_STAKED_AMOUNT_CHZ environment variable not set')
      return NextResponse.json(
        { error: 'Staking system is not configured properly' },
        { status: 500 }
      )
    }

    const minStakedAmount = BigInt(minStakedAmountStr)

    // Get user's staked amount from blockchain
    const stakedAmount = await getStakedAmount(user.address)

    // Determine status
    const hasStaked = stakedAmount >= minStakedAmount
    const status = hasStaked ? 'has_staked' : 'waiting_for_staking'

    return NextResponse.json({
      status,
      hasStaked,
      stakedAmount: stakedAmount.toString(),
      minStakedAmount: minStakedAmount.toString(),
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized - Please connect your wallet' },
        { status: 401 }
      )
    }

    console.error('Error checking staking status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Custom React Hook for Staking Status
 * Fetches and displays user's staking status
 */

'use client'

import { useState, useEffect } from 'react'

interface StakingStatus {
  status: 'has_staked' | 'waiting_for_staking' | 'loading' | 'error'
  hasStaked: boolean
  stakedAmount: string | null
  minStakedAmount: string | null
  error: string | null
}

export function useStakingStatus() {
  const [status, setStatus] = useState<StakingStatus>({
    status: 'loading',
    hasStaked: false,
    stakedAmount: null,
    minStakedAmount: null,
    error: null,
  })

  const fetchStakingStatus = async () => {
    try {
      setStatus(prev => ({ ...prev, status: 'loading' }))

      const response = await fetch('/api/staking/status')
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please connect your wallet first')
        }
        throw new Error('Failed to fetch staking status')
      }

      const data = await response.json()

      setStatus({
        status: data.status,
        hasStaked: data.hasStaked,
        stakedAmount: data.stakedAmount,
        minStakedAmount: data.minStakedAmount,
        error: null,
      })
    } catch (error: any) {
      console.error('Error fetching staking status:', error)
      setStatus({
        status: 'error',
        hasStaked: false,
        stakedAmount: null,
        minStakedAmount: null,
        error: error.message || 'Failed to fetch staking status',
      })
    }
  }

  useEffect(() => {
    fetchStakingStatus()
  }, [])

  return {
    ...status,
    refetch: fetchStakingStatus,
  }
}

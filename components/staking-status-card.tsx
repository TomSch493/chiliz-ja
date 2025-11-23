/**
 * Example: Staking Status Component
 * Displays user's staking status with a badge
 */

'use client'

import { useStakingStatus } from '@/hooks/useStakingStatus'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Shield, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function StakingStatusCard() {
  const { status, hasStaked, stakedAmount, minStakedAmount, error, refetch } = useStakingStatus()

  const formatChzAmount = (amount: string | null) => {
    if (!amount) return '0'
    // Convert from wei-like to CHZ (assuming 18 decimals)
    const value = BigInt(amount)
    const chz = Number(value) / 1e18
    return chz.toFixed(2)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Staking Status
        </CardTitle>
        <CardDescription>
          Your CHZ staking status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'loading' ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : status === 'error' ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
            <Button onClick={refetch} variant="outline" size="sm">
              Retry
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <Badge variant={hasStaked ? 'default' : 'secondary'}>
                {hasStaked ? 'Has staked' : 'Waiting for staking'}
              </Badge>
            </div>

            <div className="rounded-lg bg-muted p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Your Staked Amount</span>
                <span className="text-sm font-mono">
                  {formatChzAmount(stakedAmount)} CHZ
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Minimum Required</span>
                <span className="text-sm font-mono">
                  {formatChzAmount(minStakedAmount)} CHZ
                </span>
              </div>
            </div>

            {!hasStaked && (
              <p className="text-xs text-muted-foreground">
                Please stake at least {formatChzAmount(minStakedAmount)} CHZ to unlock full features
              </p>
            )}

            <Button onClick={refetch} variant="outline" size="sm" className="w-full">
              Refresh Status
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

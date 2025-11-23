/**
 * Example: Payment Component
 * Handles the CHZ payment flow with user feedback
 */

'use client'

import { useChzPayment } from '@/hooks/useChzPayment'
import { useWalletAuth } from '@/hooks/useWalletAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle2, XCircle, CreditCard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function PaymentCard() {
  const { isAuthenticated } = useWalletAuth()
  const { isProcessing, step, txHash, error, executePayment, resetPayment } = useChzPayment()
  const router = useRouter()

  // Redirect to /memories on successful payment
  useEffect(() => {
    if (step === 'success') {
      setTimeout(() => {
        router.push('/memories')
      }, 2000)
    }
  }, [step, router])

  const handlePayment = async () => {
    await executePayment()
  }

  const getStepMessage = () => {
    switch (step) {
      case 'approving':
        return 'Approving CHZ tokens...'
      case 'paying':
        return 'Processing payment...'
      case 'confirming':
        return 'Confirming on blockchain...'
      case 'success':
        return 'Payment successful! Redirecting...'
      case 'error':
        return 'Payment failed'
      default:
        return ''
    }
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Required</CardTitle>
          <CardDescription>Please connect your wallet first</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Pay to Access
        </CardTitle>
        <CardDescription>
          Pay 100 USD in CHZ to unlock the memories page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 'success' ? (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Payment successful! Redirecting to memories...
            </AlertDescription>
          </Alert>
        ) : step === 'error' ? (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        ) : null}

        {txHash && (
          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
            <p className="font-mono text-xs truncate">{txHash}</p>
          </div>
        )}

        <Button
          onClick={step === 'error' ? resetPayment : handlePayment}
          disabled={isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {getStepMessage()}
            </>
          ) : step === 'error' ? (
            'Try Again'
          ) : step === 'success' ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Payment Complete
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay 100 USD in CHZ
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          The payment will be split: 80% to wallet 1, 20% to wallet 2
        </p>
      </CardContent>
    </Card>
  )
}

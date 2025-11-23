/**
 * Example: Connect Wallet Component
 * Integrates wallet authentication into your app
 */

'use client'

import { useWalletAuth } from '@/hooks/useWalletAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Wallet } from 'lucide-react'

export function WalletConnectCard() {
  const { isAuthenticated, address, isConnecting, error, connectWallet, disconnectWallet } = useWalletAuth()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Connection
        </CardTitle>
        <CardDescription>
          Connect your MetaMask wallet to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isAuthenticated ? (
          <>
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              className="w-full"
              size="lg"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect MetaMask
                </>
              )}
            </Button>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </>
        ) : (
          <div className="space-y-3">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground mb-1">Connected Address</p>
              <p className="font-mono text-sm truncate">{address}</p>
            </div>
            <Button
              onClick={disconnectWallet}
              variant="outline"
              className="w-full"
            >
              Disconnect
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

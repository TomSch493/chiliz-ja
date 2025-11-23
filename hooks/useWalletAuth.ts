/**
 * Custom React Hook for Wallet Authentication
 * Handles MetaMask connection, nonce signing, and session management
 */

'use client'

import { useState, useEffect, useCallback } from 'react'

declare global {
  interface Window {
    ethereum?: any
  }
}

interface WalletAuthState {
  isAuthenticated: boolean
  address: string | null
  isConnecting: boolean
  error: string | null
}

export function useWalletAuth() {
  const [state, setState] = useState<WalletAuthState>({
    isAuthenticated: false,
    address: null,
    isConnecting: false,
    error: null,
  })

  /**
   * Check if user is already authenticated on mount
   */
  useEffect(() => {
    checkAuthStatus()
  }, [])

  /**
   * Check current authentication status
   */
  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setState({
          isAuthenticated: true,
          address: data.address,
          isConnecting: false,
          error: null,
        })
      }
    } catch (error) {
      // User is not authenticated, which is fine
      console.log('Not authenticated')
    }
  }

  /**
   * Connect wallet and authenticate
   */
  const connectWallet = async () => {
    if (!window.ethereum) {
      setState(prev => ({
        ...prev,
        error: 'MetaMask is not installed. Please install MetaMask to continue.',
      }))
      return
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }))

    try {
      // Step 1: Request accounts from MetaMask
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const address = accounts[0]

      // Step 2: Request nonce from backend
      const nonceResponse = await fetch('/api/auth/nonce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      })

      if (!nonceResponse.ok) {
        const errorData = await nonceResponse.json()
        throw new Error(errorData.error || 'Failed to get nonce')
      }

      const { message } = await nonceResponse.json()

      // Step 3: Request signature from MetaMask
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      })

      // Step 4: Verify signature with backend
      const verifyResponse = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, signature }),
      })

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json()
        throw new Error(errorData.error || 'Signature verification failed')
      }

      // Success! Update state
      setState({
        isAuthenticated: true,
        address: address.toLowerCase(),
        isConnecting: false,
        error: null,
      })
    } catch (error: any) {
      console.error('Wallet connection error:', error)
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Failed to connect wallet',
      }))
    }
  }

  /**
   * Disconnect wallet
   */
  const disconnectWallet = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setState({
        isAuthenticated: false,
        address: null,
        isConnecting: false,
        error: null,
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    checkAuthStatus,
    // Aliases for convenience
    connect: connectWallet,
    disconnect: disconnectWallet,
  }
}

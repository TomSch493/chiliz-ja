/**
 * Custom React Hook for Native CHZ Payment Flow
 * Handles native CHZ payments (no token approval needed!)
 */

'use client'

import { useState, useCallback } from 'react'
import { ethers, BrowserProvider, Contract } from 'ethers'

interface PaymentState {
  isProcessing: boolean
  isPaying: boolean
  paymentStatus: 'idle' | 'paying' | 'confirming' | 'confirmed' | 'error'
  txHash: string | null
  error: string | null
  balance: string | null
  isLoadingBalance: boolean
}

const PAYMENT_CONTRACT_ABI = [
  'function pay() external payable',
  'function getRequiredAmount() external view returns (uint256)',
]

// Environment variables
const PAYMENT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS || '0x02278441aa8acf07E9c1aEa074d3A36E1Dd4F4FD'
const FIXED_CHZ_AMOUNT = process.env.NEXT_PUBLIC_FIXED_CHZ_AMOUNT || '1000000000000000000' // 1 CHZ

export function useNativeChzPayment(authenticatedAddress?: string | null) {
  const [state, setState] = useState<PaymentState>({
    isProcessing: false,
    isPaying: false,
    paymentStatus: 'idle',
    txHash: null,
    error: null,
    balance: null,
    isLoadingBalance: false,
  })

  /**
   * Verify that the current MetaMask account matches the authenticated address
   */
  const verifyWalletMatch = async (): Promise<string> => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed')
    }

    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const currentAddress = await signer.getAddress()

    console.log('🔐 Authenticated address:', authenticatedAddress)
    console.log('💳 Current MetaMask address:', currentAddress)

    // Verify addresses match (case-insensitive)
    if (authenticatedAddress && currentAddress.toLowerCase() !== authenticatedAddress.toLowerCase()) {
      throw new Error(
        `Wallet mismatch! You authenticated with ${authenticatedAddress} but MetaMask is currently using ${currentAddress}. Please switch to the correct account in MetaMask.`
      )
    }

    return currentAddress
  }

  /**
   * Fetch user's native CHZ balance
   * Debounced to prevent spamming MetaMask RPC
   */
  const fetchBalance = useCallback(async () => {
    if (!window.ethereum || !authenticatedAddress) {
      return
    }

    // Prevent multiple simultaneous calls
    setState(prev => {
      if (prev.isLoadingBalance) {
        console.log('⏳ Balance fetch already in progress, skipping...')
        return prev
      }
      return { ...prev, isLoadingBalance: true }
    })

    try {
      const provider = new BrowserProvider(window.ethereum)
      
      console.log('🔍 Checking native CHZ balance...')
      console.log('🔍 Wallet address:', authenticatedAddress)
      
      const balance = await provider.getBalance(authenticatedAddress)
      
      console.log('📊 Raw balance:', balance.toString())
      
      // Format balance to human-readable format (2 decimal places)
      const balanceInChz = Number(balance) / 1e18
      const formattedBalance = balanceInChz.toFixed(2)
      
      setState(prev => ({
        ...prev,
        balance: formattedBalance,
        isLoadingBalance: false,
      }))

      console.log('💰 Native CHZ balance:', formattedBalance, 'CHZ')
    } catch (error: any) {
      // Silently ignore errors caused by navigation/unmount
      const errorMessage = error.message || '';
      const isNavigationError = 
        errorMessage.includes('Block tracker destroyed') ||
        errorMessage.includes('circuit breaker') ||
        errorMessage.includes('user rejected') ||
        error.code === 'ACTION_REJECTED';
      
      if (isNavigationError) {
        console.log('⚠️ Balance fetch interrupted (page navigation or MetaMask reset)');
      } else {
        console.error('❌ Failed to fetch balance:', error);
      }
      
      setState(prev => ({
        ...prev,
        balance: null,
        isLoadingBalance: false,
      }))
    }
  }, [authenticatedAddress])

  /**
   * Execute payment with native CHZ (no approval needed!)
   */
  const pay = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed')
    }

    setState(prev => ({
      ...prev,
      isPaying: true,
      isProcessing: true,
      paymentStatus: 'paying',
      error: null,
    }))

    try {
      // Verify wallet match first
      const userAddress = await verifyWalletMatch()
      
      console.log('💳 Executing payment for address:', userAddress)
      
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      // Check balance before paying
      let balance;
      try {
        balance = await provider.getBalance(userAddress)
        console.log('💰 Native CHZ balance:', ethers.formatEther(balance), 'CHZ')
      } catch (balanceError: any) {
        // If balance check fails, try to proceed anyway
        console.warn('⚠️ Could not verify balance, proceeding with payment:', balanceError.message)
        balance = BigInt(FIXED_CHZ_AMOUNT) * BigInt(2); // Assume sufficient balance
      }
      
      const requiredAmount = BigInt(FIXED_CHZ_AMOUNT)
      
      if (balance < requiredAmount) {
        throw new Error(
          `Insufficient CHZ balance. You have ${ethers.formatEther(balance)} CHZ but need ${ethers.formatEther(requiredAmount)} CHZ`
        )
      }
      
      const paymentContract = new Contract(PAYMENT_CONTRACT_ADDRESS, PAYMENT_CONTRACT_ABI, signer)

      // Execute payment - send native CHZ with the transaction
      console.log('⏳ Sending native CHZ payment...')
      console.log('💵 Amount:', ethers.formatEther(FIXED_CHZ_AMOUNT), 'CHZ')
      
      const payTx = await paymentContract.pay({ value: FIXED_CHZ_AMOUNT })
      console.log('📝 Payment transaction sent:', payTx.hash)
      
      setState(prev => ({
        ...prev,
        paymentStatus: 'confirming',
      }))

      // Wait for transaction to be mined
      const receipt = await payTx.wait()
      const txHash = receipt.hash
      console.log('✅ Payment confirmed! TX:', txHash)

      setState(prev => ({
        ...prev,
        txHash,
      }))

      // Confirm payment on backend
      console.log('🔄 Confirming payment with backend...')
      console.log('📤 Sending txHash:', txHash)
      console.log('📤 Authenticated address:', userAddress)
      
      const confirmResponse = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ Ensure cookies are sent
        body: JSON.stringify({ txHash }),
      })

      console.log('📡 Confirmation response status:', confirmResponse.status)
      console.log('📡 Response headers:', Object.fromEntries(confirmResponse.headers.entries()))
      
      if (!confirmResponse.ok) {
        let errorData;
        try {
          errorData = await confirmResponse.json();
        } catch (e) {
          errorData = { error: `HTTP ${confirmResponse.status}: ${confirmResponse.statusText}` };
        }
        console.error('❌ Backend confirmation failed:', errorData)
        console.error('❌ Response status:', confirmResponse.status)
        console.error('❌ Response statusText:', confirmResponse.statusText)
        throw new Error(errorData.error || `Payment confirmation failed with status ${confirmResponse.status}`)
      }

      const confirmData = await confirmResponse.json()
      console.log('✅ Backend confirmation successful:', confirmData)

      // Success!
      setState(prev => ({
        ...prev,
        isProcessing: false,
        isPaying: false,
        paymentStatus: 'confirmed',
        txHash,
        error: null,
      }))

      return { success: true, txHash }
    } catch (error: any) {
      console.error('❌ Payment error:', error)
      const errorMessage = error.message || 'Payment failed'
      
      setState(prev => ({
        ...prev,
        isPaying: false,
        isProcessing: false,
        paymentStatus: 'error',
        error: errorMessage,
      }))

      throw new Error(errorMessage)
    }
  }

  /**
   * Reset payment state
   */
  const resetPayment = () => {
    setState({
      isProcessing: false,
      isPaying: false,
      paymentStatus: 'idle',
      txHash: null,
      error: null,
      balance: null,
      isLoadingBalance: false,
    })
  }

  return {
    ...state,
    pay,
    resetPayment,
    fetchBalance,
  }
}

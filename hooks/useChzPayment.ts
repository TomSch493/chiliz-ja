/**
 * Custom React Hook for CHZ Payment Flow
 * Handles token approval and payment contract interaction
 */

'use client'

import { useState, useCallback } from 'react'
import { ethers, BrowserProvider, Contract } from 'ethers'

interface PaymentState {
  isProcessing: boolean
  isApproving: boolean
  isPaying: boolean
  paymentStatus: 'idle' | 'approving' | 'paying' | 'confirming' | 'confirmed' | 'error'
  txHash: string | null
  error: string | null
  balance: string | null
  isLoadingBalance: boolean
}

const ERC20_ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
]

const PAYMENT_CONTRACT_ABI = [
  'function pay() external',
]

// Environment variables
const CHZ_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_CHZ_TOKEN_ADDRESS || '0x721ef6871f1c4efe730dce047d40d1743b886946'
const PAYMENT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS || '0x02278441aa8acf07E9c1aEa074d3A36E1Dd4F4FD'
const FIXED_CHZ_AMOUNT = process.env.NEXT_PUBLIC_FIXED_CHZ_AMOUNT || '1000000000000000000' // 1 CHZ

export function useChzPayment(authenticatedAddress?: string | null) {
  const [state, setState] = useState<PaymentState>({
    isProcessing: false,
    isApproving: false,
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
   * Fetch user's CHZ token balance
   */
  const fetchBalance = useCallback(async () => {
    if (!window.ethereum || !authenticatedAddress) {
      return
    }

    setState(prev => ({ ...prev, isLoadingBalance: true }))

    try {
      const provider = new BrowserProvider(window.ethereum)
      const chzToken = new Contract(CHZ_TOKEN_ADDRESS, ERC20_ABI, provider)
      
      console.log('🔍 Checking balance for token:', CHZ_TOKEN_ADDRESS)
      console.log('🔍 Wallet address:', authenticatedAddress)
      
      const balance = await chzToken.balanceOf(authenticatedAddress)
      
      console.log('📊 Raw balance:', balance.toString())
      
      // Format balance to human-readable format (2 decimal places)
      const balanceInChz = Number(balance) / 1e18
      const formattedBalance = balanceInChz.toFixed(2)
      
      setState(prev => ({
        ...prev,
        balance: formattedBalance,
        isLoadingBalance: false,
      }))

      console.log('💰 Fetched token balance:', formattedBalance, 'CHZ')
      
      // Also check native CHZ balance for comparison
      const nativeBalance = await provider.getBalance(authenticatedAddress)
      console.log('💵 Native CHZ balance:', ethers.formatEther(nativeBalance), 'CHZ (gas)')
    } catch (error: any) {
      console.error('❌ Failed to fetch balance:', error)
      setState(prev => ({
        ...prev,
        balance: null,
        isLoadingBalance: false,
      }))
    }
  }, [authenticatedAddress]) // Only recreate if authenticatedAddress changes

  /**
   * Check current allowance
   */
  const checkAllowance = async (): Promise<bigint> => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed')
    }

    try {
      const userAddress = await verifyWalletMatch()

      const provider = new BrowserProvider(window.ethereum)
      const chzToken = new Contract(CHZ_TOKEN_ADDRESS, ERC20_ABI, provider)
      const allowance = await chzToken.allowance(userAddress, PAYMENT_CONTRACT_ADDRESS)
      
      return BigInt(allowance.toString())
    } catch (error: any) {
      console.error('Check allowance error:', error)
      throw error
    }
  }

  /**
   * Approve CHZ tokens
   */
  const approve = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed')
    }

    setState(prev => ({
      ...prev,
      isApproving: true,
      isProcessing: true,
      paymentStatus: 'approving',
      error: null,
    }))

    try {
      // Verify wallet match first
      const userAddress = await verifyWalletMatch()
      
      console.log('🔐 Approving tokens for address:', userAddress)
      
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const chzToken = new Contract(CHZ_TOKEN_ADDRESS, ERC20_ABI, signer)

      const approveTx = await chzToken.approve(PAYMENT_CONTRACT_ADDRESS, FIXED_CHZ_AMOUNT)
      console.log('⏳ Approval transaction sent:', approveTx.hash)
      await approveTx.wait()
      console.log('✅ Approval confirmed')

      setState(prev => ({
        ...prev,
        isApproving: false,
        isProcessing: false,
      }))

      return { success: true }
    } catch (error: any) {
      console.error('❌ Approval error:', error)
      const errorMessage = error.message || 'Token approval failed'
      
      setState(prev => ({
        ...prev,
        isApproving: false,
        isProcessing: false,
        paymentStatus: 'error',
        error: errorMessage,
      }))

      throw new Error(errorMessage)
    }
  }

  /**
   * Execute payment
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
      const chzToken = new Contract(CHZ_TOKEN_ADDRESS, ERC20_ABI, provider)
      const balance = await chzToken.balanceOf(userAddress)
      console.log('💰 CHZ Token balance:', balance.toString(), '(' + (Number(balance) / 1e18) + ' CHZ)')
      
      if (BigInt(balance.toString()) < BigInt(FIXED_CHZ_AMOUNT)) {
        throw new Error(`Insufficient CHZ balance. You have ${Number(balance) / 1e18} CHZ but need ${Number(FIXED_CHZ_AMOUNT) / 1e18} CHZ`)
      }
      
      const paymentContract = new Contract(PAYMENT_CONTRACT_ADDRESS, PAYMENT_CONTRACT_ABI, signer)

      // Execute payment
      console.log('⏳ Sending payment transaction...')
      const payTx = await paymentContract.pay()
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
      const confirmResponse = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash }),
      })

      if (!confirmResponse.ok) {
        throw new Error('Payment confirmation failed')
      }

      // Success!
      setState(prev => ({
        ...prev,
        isProcessing: false,
        isApproving: false,
        isPaying: false,
        paymentStatus: 'confirmed',
        txHash,
        error: null,
      }))

      return { success: true, txHash }
    } catch (error: any) {
      console.error('Payment error:', error)
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
      isApproving: false,
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
    approve,
    pay,
    checkAllowance,
    resetPayment,
    fetchBalance,
  }
}

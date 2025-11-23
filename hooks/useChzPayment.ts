/**
 * Custom React Hook for CHZ Payment Flow
 * Handles token approval and payment contract interaction
 */

'use client'

import { useState } from 'react'
import { ethers, BrowserProvider, Contract } from 'ethers'

interface PaymentState {
  isProcessing: boolean
  isApproving: boolean
  isPaying: boolean
  paymentStatus: 'idle' | 'approving' | 'paying' | 'confirming' | 'confirmed' | 'error'
  txHash: string | null
  error: string | null
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

export function useChzPayment() {
  const [state, setState] = useState<PaymentState>({
    isProcessing: false,
    isApproving: false,
    isPaying: false,
    paymentStatus: 'idle',
    txHash: null,
    error: null,
  })

  /**
   * Check current allowance
   */
  const checkAllowance = async (): Promise<bigint> => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed')
    }

    try {
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const userAddress = await signer.getAddress()

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
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const chzToken = new Contract(CHZ_TOKEN_ADDRESS, ERC20_ABI, signer)

      const approveTx = await chzToken.approve(PAYMENT_CONTRACT_ADDRESS, FIXED_CHZ_AMOUNT)
      await approveTx.wait()

      setState(prev => ({
        ...prev,
        isApproving: false,
        isProcessing: false,
      }))

      return { success: true }
    } catch (error: any) {
      console.error('Approval error:', error)
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
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const paymentContract = new Contract(PAYMENT_CONTRACT_ADDRESS, PAYMENT_CONTRACT_ABI, signer)

      // Execute payment
      const payTx = await paymentContract.pay()
      
      setState(prev => ({
        ...prev,
        paymentStatus: 'confirming',
      }))

      // Wait for transaction to be mined
      const receipt = await payTx.wait()
      const txHash = receipt.hash

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
      setState({
        isProcessing: false,
        isApproving: false,
        isPaying: false,
        paymentStatus: 'confirmed',
        txHash,
        error: null,
      })

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
    })
  }

  return {
    ...state,
    approve,
    pay,
    checkAllowance,
    resetPayment,
  }
}

/**
 * Custom React Hook for CHZ Payment Flow
 * Handles token approval and payment contract interaction
 */

'use client'

import { useState } from 'react'
import { ethers, BrowserProvider, Contract } from 'ethers'

interface PaymentState {
  isProcessing: boolean
  step: 'idle' | 'approving' | 'paying' | 'confirming' | 'success' | 'error'
  txHash: string | null
  error: string | null
}

const ERC20_ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
]

const PAYMENT_CONTRACT_ABI = [
  'function pay() external',
]

export function useChzPayment() {
  const [state, setState] = useState<PaymentState>({
    isProcessing: false,
    step: 'idle',
    txHash: null,
    error: null,
  })

  /**
   * Execute the full payment flow
   */
  const executePayment = async () => {
    if (!window.ethereum) {
      setState(prev => ({
        ...prev,
        error: 'MetaMask is not installed',
        step: 'error',
      }))
      return { success: false }
    }

    setState({
      isProcessing: true,
      step: 'idle',
      txHash: null,
      error: null,
    })

    try {
      // Step 1: Get payment configuration from backend
      setState(prev => ({ ...prev, step: 'idle' }))
      const configResponse = await fetch('/api/payment/initiate', {
        method: 'POST',
      })

      if (!configResponse.ok) {
        throw new Error('Failed to get payment configuration')
      }

      const config = await configResponse.json()
      const { chzTokenAddress, paymentContractAddress, fixedChzAmount } = config

      // Step 2: Connect to MetaMask
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const userAddress = await signer.getAddress()

      // Step 3: Check and approve CHZ tokens
      setState(prev => ({ ...prev, step: 'approving' }))
      const chzToken = new Contract(chzTokenAddress, ERC20_ABI, signer)

      // Check current allowance
      const currentAllowance = await chzToken.allowance(userAddress, paymentContractAddress)
      
      // If allowance is insufficient, request approval
      if (BigInt(currentAllowance.toString()) < BigInt(fixedChzAmount)) {
        const approveTx = await chzToken.approve(paymentContractAddress, fixedChzAmount)
        await approveTx.wait()
      }

      // Step 4: Call pay() function on payment contract
      setState(prev => ({ ...prev, step: 'paying' }))
      const paymentContract = new Contract(paymentContractAddress, PAYMENT_CONTRACT_ABI, signer)
      const payTx = await paymentContract.pay()
      
      // Wait for transaction to be mined
      const receipt = await payTx.wait()
      const txHash = receipt.hash

      setState(prev => ({ ...prev, step: 'confirming', txHash }))

      // Step 5: Confirm payment on backend
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
        step: 'success',
        txHash,
        error: null,
      })

      return { success: true, txHash }
    } catch (error: any) {
      console.error('Payment error:', error)
      const errorMessage = error.message || 'Payment failed'
      
      setState({
        isProcessing: false,
        step: 'error',
        txHash: null,
        error: errorMessage,
      })

      return { success: false, error: errorMessage }
    }
  }

  /**
   * Reset payment state
   */
  const resetPayment = () => {
    setState({
      isProcessing: false,
      step: 'idle',
      txHash: null,
      error: null,
    })
  }

  return {
    ...state,
    executePayment,
    resetPayment,
  }
}

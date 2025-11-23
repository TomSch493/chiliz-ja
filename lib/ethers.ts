/**
 * Ethereum / Blockchain Helper Functions
 * Provides ethers.js utilities for interacting with smart contracts
 */

import { ethers, Contract, JsonRpcProvider } from 'ethers'

// Initialize provider for reading blockchain data
let provider: JsonRpcProvider | null = null

export function getProvider(): JsonRpcProvider {
  if (!provider) {
    const rpcUrl = process.env.CHAIN_RPC_URL
    if (!rpcUrl) {
      throw new Error('CHAIN_RPC_URL environment variable is not set')
    }
    provider = new ethers.JsonRpcProvider(rpcUrl)
  }
  return provider
}

// ERC20 Token ABI (minimal interface for CHZ token)
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
]

// Payment Contract ABI
const PAYMENT_CONTRACT_ABI = [
  'event PaymentDone(address indexed payer, uint256 amount)',
  'function pay() external',
  'function fixedAmount() view returns (uint256)',
  'function wallet1() view returns (address)',
  'function wallet2() view returns (address)',
]

// Staking Contract ABI (minimal interface)
const STAKING_CONTRACT_ABI = [
  'function stakedBalanceOf(address user) external view returns (uint256)',
]

/**
 * Get CHZ Token Contract instance
 */
export function getChzTokenContract(): Contract {
  const tokenAddress = process.env.CHZ_TOKEN_ADDRESS
  if (!tokenAddress) {
    throw new Error('CHZ_TOKEN_ADDRESS environment variable is not set')
  }
  return new ethers.Contract(tokenAddress, ERC20_ABI, getProvider())
}

/**
 * Get Payment Contract instance
 */
export function getPaymentContract(): Contract {
  const contractAddress = process.env.PAYMENT_CONTRACT_ADDRESS
  if (!contractAddress) {
    throw new Error('PAYMENT_CONTRACT_ADDRESS environment variable is not set')
  }
  return new ethers.Contract(contractAddress, PAYMENT_CONTRACT_ABI, getProvider())
}

/**
 * Get Staking Contract instance
 */
export function getStakingContract(): Contract {
  const contractAddress = process.env.STAKING_CONTRACT_ADDRESS
  if (!contractAddress) {
    throw new Error('STAKING_CONTRACT_ADDRESS environment variable is not set')
  }
  return new ethers.Contract(contractAddress, STAKING_CONTRACT_ABI, getProvider())
}

/**
 * Get staked amount for a given user address
 * @param userAddress - Ethereum wallet address
 * @returns Staked amount in CHZ (smallest unit)
 */
export async function getStakedAmount(userAddress: string): Promise<bigint> {
  try {
    const stakingContract = getStakingContract()
    const stakedBalance = await stakingContract.stakedBalanceOf(userAddress)
    return BigInt(stakedBalance.toString())
  } catch (error) {
    console.error('Error fetching staked amount:', error)
    throw new Error('Failed to fetch staked amount from blockchain')
  }
}

/**
 * Verify a transaction and check if it's a valid payment
 * @param txHash - Transaction hash
 * @returns Transaction receipt if valid, null otherwise
 */
export async function verifyPaymentTransaction(txHash: string) {
  try {
    const provider = getProvider()
    const receipt = await provider.getTransactionReceipt(txHash)

    if (!receipt) {
      return { valid: false, error: 'Transaction not found' }
    }

    // Check if transaction succeeded
    if (receipt.status !== 1) {
      return { valid: false, error: 'Transaction failed' }
    }

    // Verify the transaction was sent to the payment contract
    const paymentContractAddress = process.env.PAYMENT_CONTRACT_ADDRESS?.toLowerCase()
    if (receipt.to?.toLowerCase() !== paymentContractAddress) {
      return { valid: false, error: 'Transaction not sent to payment contract' }
    }

    // Try to decode the PaymentDone event
    const paymentContract = getPaymentContract()
    let paymentAmount = '0'
    let payerAddress = ''

    for (const log of receipt.logs) {
      try {
        const parsedLog = paymentContract.interface.parseLog({
          topics: [...log.topics],
          data: log.data,
        })

        if (parsedLog?.name === 'PaymentDone') {
          payerAddress = parsedLog.args.payer
          paymentAmount = parsedLog.args.amount.toString()
          break
        }
      } catch (e) {
        // Skip logs that don't match
        continue
      }
    }

    return {
      valid: true,
      receipt,
      payerAddress,
      paymentAmount,
    }
  } catch (error) {
    console.error('Error verifying transaction:', error)
    throw new Error('Failed to verify transaction')
  }
}

/**
 * Helper to check if an address is valid
 */
export function isValidAddress(address: string): boolean {
  return ethers.isAddress(address)
}

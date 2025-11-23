/**
 * POST /api/auth/logout
 * Destroy current session and set isLoggedIn to false
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Get wallet address from cookie
    const walletAddress = request.cookies.get('auth_session')?.value

    if (walletAddress) {
      console.log('🔓 Logging out user:', walletAddress)

      // Update user's login status in database
      await prisma.user.update({
        where: { address: walletAddress.toLowerCase() },
        data: { isLoggedIn: false },
      })

      console.log('✅ User logged out successfully')
    }

    // Clear the auth cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

    response.cookies.delete('auth_session')

    return response
  } catch (error) {
    console.error('❌ Logout error:', error)
    
    // Still clear cookie even if database update fails
    const response = NextResponse.json({
      success: true,
      message: 'Logged out'
    })
    
    response.cookies.delete('auth_session')
    
    return response
  }
}

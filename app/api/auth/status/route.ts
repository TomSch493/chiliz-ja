/**
 * GET /api/auth/status
 * Check if user is logged in (has paid)
 */

import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({
        isAuthenticated: false,
        isLoggedIn: false,
      })
    }

    return NextResponse.json({
      isAuthenticated: true,
      isLoggedIn: user.isLoggedIn,
      user: {
        id: user.id,
        address: user.address,
      },
    })
  } catch (error) {
    console.error('Error checking auth status:', error)
    return NextResponse.json({
      isAuthenticated: false,
      isLoggedIn: false,
    })
  }
}

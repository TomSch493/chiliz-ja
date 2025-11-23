# Redirect Fix After Payment

## Problem
After successful payment, users were being redirected back to the payment page instead of accessing the app at `/app`.

## Root Cause
1. **Race Condition**: The redirect happened too quickly (2 seconds) before the backend had fully confirmed the payment
2. **Timing Issue**: The `/app` page's access check was running before the payment was confirmed in the database
3. **No Retry Logic**: If the payment check failed once, it immediately redirected back without retrying

## Solution Implemented

### 1. Extended Redirect Delay (onboarding-flow.tsx)
```typescript
// Changed from 2000ms to 3000ms to give backend more time
setTimeout(() => {
  console.log("🚀 Redirecting to /app after successful payment");
  router.replace("/app"); // Use replace to prevent back button issues
}, 3000);
```

### 2. Added Retry Logic (/app/app/page.tsx)
```typescript
// Now retries once if payment isn't immediately confirmed
if (paymentsData.hasPaid) {
  setHasAccess(true);
} else {
  if (attempt === 0) {
    console.log("⏳ Payment not confirmed yet, retrying in 2 seconds...");
    setTimeout(() => checkAccess(1), 2000);
  } else {
    // Only redirect back after retry fails
    router.replace("/");
  }
}
```

### 3. Improved Logging
Added comprehensive console logging throughout the payment flow:
- Payment hook: Logs transaction confirmation and backend sync
- Onboarding flow: Logs payment status and redirect timing
- App page: Logs authentication and payment verification steps

### 4. Better Error Handling
- Backend confirmation errors are now caught and logged
- Access check uses `router.replace()` instead of `router.push()` to prevent back button issues
- Added small delays before redirects to prevent redirect loops

## Testing the Fix

1. **Connect Wallet**: Ensure MetaMask is connected to Chiliz Spicy testnet
2. **Make Payment**: Click "Pay 1 CHZ" button
3. **Observe Console**: Check browser console for payment flow logs
4. **Wait for Redirect**: Should see "Moving to step 3" → "Redirecting to /app"
5. **Access Granted**: Should land on `/app` dashboard with premium access

## Expected Console Flow
```
⏳ Sending native CHZ payment...
📝 Payment transaction sent: 0x...
✅ Payment confirmed! TX: 0x...
🔄 Confirming payment with backend...
✅ Backend confirmation successful
✅ Payment confirmed, moving to step 3
🚀 Redirecting to /app after successful payment
🔍 Checking access (attempt 1)...
✅ User authenticated
💰 Payment status: { hasPaid: true }
✅ User has paid, granting access
```

## If Issues Persist

### Check Payment Backend
```bash
# Check if payment is in database
curl http://localhost:3000/api/payment/check \
  -H "Cookie: auth_token=YOUR_TOKEN"
```

### Check Transaction on Explorer
- Visit: https://testnet.chiliscan.com/tx/YOUR_TX_HASH
- Verify transaction is confirmed on-chain

### Clear Browser State
```javascript
// In browser console
localStorage.clear();
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
location.reload();
```

## Architecture Flow

```
[User Pays] 
    ↓
[Smart Contract Executes] (on-chain)
    ↓
[Frontend Waits for TX Confirmation] (useNativeChzPayment.ts)
    ↓
[Backend Verifies & Records Payment] (/api/payment/confirm)
    ↓
[Frontend Sets paymentStatus = 'confirmed']
    ↓
[Onboarding Flow Moves to Step 3] (onboarding-flow.tsx)
    ↓
[3 Second Delay]
    ↓
[Redirect to /app]
    ↓
[App Page Checks Payment Status] (app/app/page.tsx)
    ↓
[If Not Confirmed, Retry After 2s]
    ↓
[Grant Access or Redirect Back]
```

## Key Changes Summary

| File | Change | Reason |
|------|--------|--------|
| `onboarding-flow.tsx` | Increased redirect delay to 3s | Give backend time to confirm |
| `onboarding-flow.tsx` | Use `router.replace()` | Prevent back button issues |
| `app/app/page.tsx` | Add retry logic | Handle timing delays |
| `app/app/page.tsx` | Add console logging | Debug payment flow |
| `useNativeChzPayment.ts` | Enhanced error logging | See backend confirmation status |

## Next Steps

1. **Test the full flow** from wallet connection → payment → app access
2. **Monitor console logs** to ensure all steps complete successfully
3. **Verify payment records** in database after successful payment
4. **(Optional)** Add persistent storage of payment status to avoid re-checking every time

## Troubleshooting

### "Payment not confirmed after retry"
- Check if backend confirmation succeeded (look for backend logs)
- Verify transaction hash in Chiliscan explorer
- Check database for payment record

### "Wallet mismatch" error
- Ensure the MetaMask account matches the authenticated account
- Try disconnecting and reconnecting wallet

### Stuck on "Verifying access..."
- Check browser console for errors
- Verify auth token is valid (check /api/auth/me)
- Clear cookies and try again

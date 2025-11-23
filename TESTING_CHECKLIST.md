# Testing Checklist: Payment Redirect Fix

## Pre-Flight Check
- [ ] MetaMask installed and unlocked
- [ ] Connected to Chiliz Spicy Testnet (Chain ID: 88882)
- [ ] Have at least 1.5 CHZ in wallet (1 for payment + gas)
- [ ] Browser console open (F12) to view logs
- [ ] Development server running (`pnpm dev`)

## Test Scenario 1: Fresh Payment Flow

### Steps:
1. [ ] Navigate to `http://localhost:3000`
2. [ ] Click "Connect MetaMask"
3. [ ] Approve MetaMask connection
4. [ ] Verify you see Step 2 (Payment page)
5. [ ] Check console for: `✅ User authenticated`
6. [ ] Verify balance displays correctly
7. [ ] Click "Pay 1 CHZ (Native)"
8. [ ] Approve transaction in MetaMask
9. [ ] Wait for transaction confirmation

### Expected Console Output:
```
⏳ Sending native CHZ payment...
💵 Amount: 1.0 CHZ
📝 Payment transaction sent: 0x...
✅ Payment confirmed! TX: 0x...
🔄 Confirming payment with backend...
✅ Backend confirmation successful: { success: true, ... }
✅ Payment confirmed, moving to step 3
🚀 Redirecting to /app after successful payment
```

### Expected UI Flow:
1. [ ] Step 2 → Shows "Processing Payment..." button
2. [ ] Step 3 → Shows "Payment Successful! Redirecting..."
3. [ ] After 3 seconds → Redirects to `/app`
4. [ ] Shows "Verifying access..." briefly
5. [ ] Lands on dashboard with "✓ Premium Access" badge

## Test Scenario 2: Direct Access to /app

### Steps:
1. [ ] After successful payment, note your auth token
2. [ ] Close tab and reopen `http://localhost:3000/app`
3. [ ] Should immediately show dashboard (no redirect)

### Expected Console Output:
```
🔍 Checking access (attempt 1)...
✅ User authenticated: { id: ..., address: ... }
💰 Payment status: { hasPaid: true, payment: { ... } }
✅ User has paid, granting access
```

## Test Scenario 3: Retry Logic (Simulated Delay)

### Steps:
1. [ ] Complete payment
2. [ ] If redirect happens before backend confirms
3. [ ] Should see retry message

### Expected Console Output:
```
🔍 Checking access (attempt 1)...
✅ User authenticated
💰 Payment status: { hasPaid: false }
⏳ Payment not confirmed yet, retrying in 2 seconds...
🔍 Checking access (attempt 2)...
💰 Payment status: { hasPaid: true }
✅ User has paid, granting access
```

## Test Scenario 4: Without Payment

### Steps:
1. [ ] Clear cookies and local storage
2. [ ] Connect wallet (Step 1 → Step 2)
3. [ ] DO NOT pay
4. [ ] Manually navigate to `http://localhost:3000/app`

### Expected Behavior:
- [ ] Should redirect back to `/` (onboarding page)
- [ ] Console shows: `❌ Payment not confirmed after retry`

## Test Scenario 5: Back Button Behavior

### Steps:
1. [ ] Complete full payment flow
2. [ ] Land on `/app` dashboard
3. [ ] Click browser back button

### Expected Behavior:
- [ ] Should NOT go back to payment page
- [ ] Should stay on `/app` dashboard
- [ ] (Because we use `router.replace()`)

## Debugging Checklist

If payment succeeds but redirect fails:

### Check Transaction Status
```bash
# Replace TX_HASH with your transaction hash
curl "https://spicy-testnet.chiliscan.com/api/v2/transactions/TX_HASH"
```

### Check Backend Payment Status
```bash
# Replace AUTH_TOKEN with your cookie value
curl http://localhost:3000/api/payment/check \
  -H "Cookie: auth_token=AUTH_TOKEN"
```

### Check Authentication
```bash
curl http://localhost:3000/api/auth/me \
  -H "Cookie: auth_token=AUTH_TOKEN"
```

### Verify Smart Contract
- Contract Address: `0x02278441aa8acf07E9c1aEa074d3A36E1Dd4F4FD`
- Verify on: https://testnet.chiliscan.com/address/0x02278441aa8acf07E9c1aEa074d3A36E1Dd4F4FD

## Common Issues & Solutions

### Issue: "Wallet mismatch" error
**Solution**: Ensure same MetaMask account is used throughout

### Issue: "Insufficient CHZ balance"
**Solution**: Get testnet CHZ from https://spicy-faucet.chiliz.com

### Issue: Redirect loops
**Solution**: Clear browser storage and try again
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Issue: "Payment confirmation failed"
**Solution**: Check if backend API is running and accessible

### Issue: Stuck on "Verifying access..."
**Solution**: 
1. Check browser console for errors
2. Verify auth token in cookies
3. Check database for payment record

## Success Criteria

✅ **All Tests Pass If:**
1. Payment completes without errors
2. Redirect to `/app` happens after ~3 seconds
3. Dashboard displays "Premium Access" badge
4. Back button doesn't break the flow
5. Direct navigation to `/app` works after payment
6. No redirect loops occur
7. Console logs show complete payment flow

## Performance Metrics

- **Payment Transaction**: ~5-15 seconds (Chiliz testnet)
- **Backend Confirmation**: ~1-2 seconds
- **Redirect Delay**: 3 seconds (intentional)
- **Access Check**: <1 second (or 2s with retry)
- **Total Time**: ~10-20 seconds from payment to dashboard

## Files Modified

1. ✅ `/components/onboarding-flow.tsx` - Extended redirect delay, added logging
2. ✅ `/app/app/page.tsx` - Added retry logic, better error handling
3. ✅ `/hooks/useNativeChzPayment.ts` - Enhanced logging for debugging

## Next Actions After Testing

- [ ] Verify all scenarios pass
- [ ] Document any edge cases discovered
- [ ] Consider adding payment status to localStorage for faster checks
- [ ] Add analytics to track payment completion rate
- [ ] (Optional) Add "Skip payment check" for testing/development

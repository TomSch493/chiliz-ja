# Payment Redirect Fix - Enhanced Debugging

## What Was Changed

### 1. Added Credentials to Payment Confirmation
```typescript
// hooks/useNativeChzPayment.ts
const confirmResponse = await fetch('/api/payment/confirm', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // ✅ NEW: Ensures auth cookies are sent
  body: JSON.stringify({ txHash }),
})
```

### 2. Added Visual Countdown
- Shows 4, 3, 2, 1 countdown on success screen
- Lets you see the redirect is about to happen
- Confirms the timer is working

### 3. Enhanced Logging
- Logs payment status and current step
- Logs current URL before redirect
- Logs when redirect is called
- Logs confirmation response status

## How to Test

### IMPORTANT: Clear Browser First!
```javascript
// Paste in console (F12):
localStorage.clear();
sessionStorage.clear();
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
location.reload();
```

### Then Test:
1. Go to `localhost:3000/login`
2. Connect wallet
3. Pay 1 CHZ
4. **Watch console for logs**
5. **Watch screen for countdown: 4... 3... 2... 1...**
6. Should redirect to `/` dashboard

## Expected Console Output

```
💳 Executing payment for address: 0x...
⏳ Sending native CHZ payment...
📝 Payment transaction sent: 0x...
✅ Payment confirmed! TX: 0x...
🔄 Confirming payment with backend...
📡 Confirmation response status: 200
✅ Backend confirmation successful: {...}
✅ Payment confirmed, moving to step 3
🔍 Payment status: confirmed
🔍 Current step: 2
🚀 NOW REDIRECTING to dashboard after successful payment
⏰ Waited 4 seconds to ensure backend sync completed
🌐 Current URL before redirect: http://localhost:3000/login
🌐 Redirect called, should navigate to: http://localhost:3000/
🔍 Checking access (attempt 1/5)...
✅ User authenticated: {...}
💰 Payment status: { hasPaid: true }
✅ User has paid, granting access
```

## If Still Not Working

### Check These Things:

1. **Does countdown appear on screen?**
   - YES → useEffect is working, timer is running
   - NO → Something wrong with payment status

2. **Do you see "🚀 NOW REDIRECTING" log?**
   - YES → Router is being called
   - NO → setTimeout is not firing

3. **Does page URL change after redirect?**
   - YES but goes back to /login → Access check failing
   - NO → Router or navigation issue

4. **Check cookies:**
```javascript
// In console:
console.log(document.cookie);
// Should contain: auth_token=...
```

## Alternative Fix

If router.replace() doesn't work, try force redirect:

Replace the setTimeout in `onboarding-flow.tsx` with:

```typescript
setTimeout(() => {
  console.log("🚀 FORCE REDIRECT");
  window.location.href = "/";
}, 4000);
```

## Files Changed

- ✅ `hooks/useNativeChzPayment.ts` - Added credentials to fetch
- ✅ `components/onboarding-flow.tsx` - Added countdown and enhanced logs
- ✅ `app/page.tsx` - Increased retries to 5, added credentials

## Summary

The issue is likely one of these:
1. **Backend not saving payment** → Check `/api/payment/confirm` logs
2. **Cookie not persisting** → Check if auth_token exists
3. **Access check failing** → Check retry logs on `/` page

**Run the flow with console open and share the logs!**

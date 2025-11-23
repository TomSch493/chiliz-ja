# App Routing Structure

## 🏗️ New Architecture

The app has been restructured to follow a cleaner routing pattern:

### Routes

| Route | Purpose | Access |
|-------|---------|--------|
| `localhost:3000/login` | Wallet connection & payment onboarding | Public |
| `localhost:3000/` | Main app dashboard | Protected (requires auth + payment) |

## 📋 Flow Overview

```
User visits site
    ↓
Not authenticated? → Redirect to /login
    ↓
/login - Connect Wallet
    ↓
/login - Pay 1 CHZ
    ↓
Payment confirmed
    ↓
Redirect to / (root)
    ↓
Dashboard with premium features
```

## 🔐 Protected Routes

The root route (`/`) is protected and will:
1. Check if user is authenticated
2. Check if user has paid
3. If either check fails → redirect to `/login`
4. If both pass → show dashboard

### Access Check Logic

```typescript
// On page load:
1. Fetch /api/auth/me (check authentication)
2. Fetch /api/payment/check (check payment status)
3. If not authenticated OR not paid:
   - Redirect to /login after 500ms delay
4. If payment just completed:
   - Retry once after 2 seconds (handles race conditions)
5. If all checks pass:
   - Render dashboard
```

## 📁 File Structure

```
app/
├── page.tsx              # Root route (/) - Protected Dashboard
├── login/
│   └── page.tsx          # Login route (/login) - Onboarding Flow
├── app/                  # Legacy route (can be deleted)
│   └── page.tsx
└── api/
    ├── auth/
    │   └── me/
    │       └── route.ts  # Check authentication
    └── payment/
        └── check/
            └── route.ts  # Check payment status

components/
└── onboarding-flow.tsx   # Wallet connection + payment UI
```

## 🎯 User Journey

### First-Time User

1. **Visit `localhost:3000/`**
   - Not authenticated
   - Redirected to `/login`

2. **On `/login`**
   - Step 1: Connect MetaMask wallet
   - Step 2: Pay 1 CHZ (native)
   - Step 3: Success screen (3 second countdown)

3. **Automatic Redirect to `/`**
   - Access check verifies payment
   - Shows dashboard with premium features

### Returning User

1. **Visit `localhost:3000/`**
   - Already authenticated (JWT cookie exists)
   - Already paid (confirmed in database)
   - Shows dashboard immediately

## 🔄 Redirect Logic

### After Successful Payment

```typescript
// onboarding-flow.tsx
useEffect(() => {
  if (paymentStatus === "confirmed" && currentStep === 2) {
    setCurrentStep(3); // Show success screen
    setTimeout(() => {
      router.replace("/"); // Redirect to root after 3s
    }, 3000);
  }
}, [paymentStatus, currentStep, router]);
```

### Protected Route Check

```typescript
// app/page.tsx (root)
const checkAccess = async (attempt = 0) => {
  const authResponse = await fetch("/api/auth/me");
  const paymentsResponse = await fetch("/api/payment/check");
  
  if (!authenticated || !hasPaid) {
    if (attempt === 0) {
      // Retry once after 2 seconds
      setTimeout(() => checkAccess(1), 2000);
    } else {
      // Redirect to login
      router.replace("/login");
    }
  } else {
    setHasAccess(true); // Show dashboard
  }
};
```

## 🧪 Testing the New Flow

### Test 1: First-Time User
```bash
# Clear cookies and local storage
# In browser console:
localStorage.clear();
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});

# Navigate to root
window.location.href = '/';

# Expected: Redirect to /login
```

### Test 2: Payment Flow
```bash
# On /login:
1. Connect wallet → Should auto-advance to Step 2
2. Click "Pay 1 CHZ" → Transaction confirms
3. Wait for success screen → Shows for 3 seconds
4. Redirect to / → Shows dashboard

# Console logs should show:
✅ Payment confirmed, moving to step 3
🚀 Redirecting to dashboard after successful payment
🔍 Checking access (attempt 1)...
✅ User authenticated
💰 Payment status: { hasPaid: true }
✅ User has paid, granting access
```

### Test 3: Direct Dashboard Access
```bash
# After payment, visit root directly
window.location.href = '/';

# Expected: 
- Brief loading screen
- Access check passes
- Dashboard renders
```

### Test 4: Unauthorized Access
```bash
# Without payment, try to access dashboard
# In browser console:
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
window.location.href = '/';

# Expected: Redirect to /login
```

## 🎨 Dashboard Features

The main dashboard (`/`) includes:

- **Header**: App title and "Premium Access" badge
- **Welcome Section**: Personalized greeting
- **Feature Cards**: 6 clickable feature cards
  - Challenges
  - Shop
  - Leaderboard
  - Community
  - Inventory
  - Profile
- **Stats Section**: User statistics display

## 🔧 Configuration

### Environment Variables (.env.local)
```bash
NEXT_PUBLIC_CHZ_TOKEN_ADDRESS=0x721ef6871f1c4efe730dce047d40d1743b886946
NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=0xa22Db3C769f26945144958A1b9Fa7Ed37c063101
NEXT_PUBLIC_FIXED_CHZ_AMOUNT=1000000000000000000
NEXT_PUBLIC_CHAIN_RPC_URL=https://spicy-rpc.chiliz.com
NEXT_PUBLIC_CHAIN_ID=88882
```

### Key Routes
- **Login**: `/login`
- **Dashboard**: `/` (root)
- **Auth Check**: `/api/auth/me`
- **Payment Check**: `/api/payment/check`
- **Payment Confirm**: `/api/payment/confirm`

## 🐛 Debugging

### Check Authentication Status
```bash
curl http://localhost:3000/api/auth/me \
  -H "Cookie: auth_token=YOUR_TOKEN" \
  -v
```

### Check Payment Status
```bash
curl http://localhost:3000/api/payment/check \
  -H "Cookie: auth_token=YOUR_TOKEN" \
  -v
```

### View Console Logs
Open browser DevTools (F12) and check console for:
- `🔍 Checking access...` - Access verification
- `✅ User authenticated` - Auth success
- `💰 Payment status` - Payment check result
- `🚀 Redirecting to dashboard` - Post-payment redirect

## ⚠️ Common Issues

### "Redirecting back to /login after payment"
- Check console logs for payment status
- Verify transaction confirmed on Chiliscan
- Try refreshing after payment completes

### "Stuck on 'Verifying access...'"
- Check network tab for API errors
- Verify auth token exists (check cookies)
- Clear cookies and re-authenticate

### "Payment confirmed but no access"
- Check database for payment record
- Verify `status: 'CONFIRMED'` in database
- Try logging out and back in

## 📦 What's Next?

Optional improvements:
1. Add logout button to dashboard header
2. Make feature cards clickable with real routes
3. Add user profile section
4. Implement actual stats tracking
5. Add loading states for feature cards

## 🗑️ Cleanup

You can now safely delete the old `/app` route:
```bash
rm -rf /Users/ethan/Desktop/chiliz-ja/app/app
```

## 📊 Summary

✅ **Login page**: `localhost:3000/login`  
✅ **Dashboard**: `localhost:3000/`  
✅ **Protected routes**: Authentication + payment checks  
✅ **Automatic redirects**: Post-payment and unauthorized access  
✅ **Retry logic**: Handles payment confirmation delays  
✅ **Clean URLs**: Simple and intuitive routing

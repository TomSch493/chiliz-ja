# Quick Start - Updated Routing

## 🎯 What Changed

The app routing has been simplified:

| Before | After |
|--------|-------|
| `localhost:3000/` → Onboarding | `localhost:3000/login` → Onboarding |
| `localhost:3000/app` → Dashboard | `localhost:3000/` → Dashboard |

## 🚀 How to Use

### 1. Start Your Development Server
```bash
cd /Users/ethan/Desktop/chiliz-ja
pnpm dev
```

### 2. Access the Login Page
Open your browser and navigate to:
```
http://localhost:3000/login
```

### 3. Complete Onboarding
- **Step 1**: Connect your MetaMask wallet
- **Step 2**: Pay 1 CHZ (native token)
- **Step 3**: Wait for success confirmation

### 4. Automatic Redirect
After 3 seconds, you'll be redirected to:
```
http://localhost:3000/
```

This is your main dashboard!

## 🔄 Testing the Flow

### Test Complete Flow
```bash
# 1. Clear browser state
# Open browser console (F12) and run:
localStorage.clear();
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});

# 2. Navigate to root
window.location.href = 'http://localhost:3000/';

# 3. Should redirect to /login

# 4. Complete wallet connection and payment

# 5. Should redirect to / (dashboard)
```

## 📋 Expected Console Output

### On Login Page
```
🔐 Authenticated address: 0x...
💳 Current MetaMask address: 0x...
💰 Native CHZ balance: 10.00 CHZ
⏳ Sending native CHZ payment...
📝 Payment transaction sent: 0x...
✅ Payment confirmed! TX: 0x...
🔄 Confirming payment with backend...
✅ Backend confirmation successful
✅ Payment confirmed, moving to step 3
🚀 Redirecting to dashboard after successful payment
```

### On Dashboard Page
```
🔍 Checking access (attempt 1)...
✅ User authenticated: { id: ..., address: 0x... }
💰 Payment status: { hasPaid: true, payment: {...} }
✅ User has paid, granting access
```

## 🎨 What You'll See

### Login Page (`/login`)
- Clean onboarding UI
- Wallet connection
- Payment interface
- Success celebration

### Dashboard (`/`)
- App header with premium badge
- Welcome message
- 6 feature cards:
  - Challenges
  - Shop
  - Leaderboard
  - Community
  - Inventory
  - Profile
- Your stats section

## 🔒 Security

The dashboard (`/`) is protected:
- ✅ Requires authentication (JWT token)
- ✅ Requires payment confirmation
- ✅ Automatically redirects unauthorized users to `/login`

## 📝 URLs Summary

```
Login/Onboarding:     http://localhost:3000/login
Main Dashboard:       http://localhost:3000/
API Auth Check:       http://localhost:3000/api/auth/me
API Payment Check:    http://localhost:3000/api/payment/check
```

## 🎉 You're All Set!

Your app now has:
- ✅ Clean routing structure
- ✅ Separate login page
- ✅ Protected dashboard
- ✅ Automatic redirects
- ✅ Payment verification with retry logic

Visit `http://localhost:3000/login` to start!

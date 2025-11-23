# 🔌 API Reference - Quick Guide

## Authentication Endpoints

### POST /api/auth/nonce
Generate a nonce for wallet authentication.

**Request:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

**Response:**
```json
{
  "message": "Sign this message to authenticate...",
  "nonce": "abc123..."
}
```

---

### POST /api/auth/verify
Verify signature and create session.

**Request:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "signature": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "address": "0x742d35cc6634c0532925a3b844bc9e7595f0beb"
}
```

**Side Effect:** Sets HTTP-only session cookie

---

### GET /api/auth/me
Get current authenticated user.

**Response (Authenticated):**
```json
{
  "id": "clx...",
  "address": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
  "createdAt": "2025-11-22T10:00:00.000Z"
}
```

**Response (Not Authenticated):**
```json
{
  "error": "Not authenticated"
}
```
**Status:** 401

---

### POST /api/auth/logout
Destroy session and logout.

**Response:**
```json
{
  "success": true
}
```

**Side Effect:** Clears session cookie

---

## Payment Endpoints

### POST /api/payment/initiate
Get payment contract configuration.

**Auth Required:** ✅ Yes

**Response:**
```json
{
  "chzTokenAddress": "0x...",
  "paymentContractAddress": "0x...",
  "fixedChzAmount": "1000000000000000000000"
}
```

---

### POST /api/payment/confirm
Verify and record a payment transaction.

**Auth Required:** ✅ Yes

**Request:**
```json
{
  "txHash": "0x1234567890abcdef..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "status": "CONFIRMED",
  "payment": {
    "id": "clx...",
    "txHash": "0x1234567890abcdef...",
    "amount": "1000000000000000000000",
    "createdAt": "2025-11-22T10:00:00.000Z"
  }
}
```

**Response (Failed):**
```json
{
  "error": "Transaction verification failed"
}
```
**Status:** 400

---

### GET /api/payment/status
Check if user has made a confirmed payment.

**Auth Required:** ✅ Yes

**Response (Has Paid):**
```json
{
  "hasPaid": true,
  "payment": {
    "id": "clx...",
    "txHash": "0x...",
    "amount": "1000000000000000000000",
    "createdAt": "2025-11-22T10:00:00.000Z"
  }
}
```

**Response (Not Paid):**
```json
{
  "hasPaid": false,
  "payment": null
}
```

---

## Staking Endpoint

### GET /api/staking/status
Check user's staking status.

**Auth Required:** ✅ Yes

**Response (Has Staked):**
```json
{
  "status": "has_staked",
  "hasStaked": true,
  "stakedAmount": "500000000000000000000",
  "minStakedAmount": "500000000000000000000"
}
```

**Response (Not Staked Enough):**
```json
{
  "status": "waiting_for_staking",
  "hasStaked": false,
  "stakedAmount": "100000000000000000000",
  "minStakedAmount": "500000000000000000000"
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized - Please connect your wallet"
}
```

### 400 Bad Request
```json
{
  "error": "Invalid request data",
  "details": [...]
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Authentication

All authenticated endpoints require:
- Valid session cookie (automatically set after `/api/auth/verify`)
- Session must not be expired (7 days default)

### Checking Authentication
```typescript
// Frontend example
const response = await fetch('/api/auth/me')
if (response.ok) {
  // User is authenticated
} else {
  // User needs to connect wallet
}
```

---

## Rate Limiting

**Recommended (not implemented by default):**
- Auth endpoints: 10 requests/minute per IP
- Payment endpoints: 5 requests/minute per user
- Staking endpoints: 30 requests/minute per user

Add rate limiting middleware before production.

---

## CORS

Currently allows all origins in development. Configure for production:

```typescript
// Add to next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'your-domain.com' },
        ],
      },
    ]
  },
}
```

---

## Testing APIs

### Using curl

```bash
# 1. Request nonce
curl -X POST http://localhost:3000/api/auth/nonce \
  -H "Content-Type: application/json" \
  -d '{"address":"0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"}'

# 2. Get current user (with session cookie)
curl http://localhost:3000/api/auth/me \
  -H "Cookie: auth_session=YOUR_TOKEN"

# 3. Check payment status
curl http://localhost:3000/api/payment/status \
  -H "Cookie: auth_session=YOUR_TOKEN"
```

### Using Postman/Thunder Client

1. Import collection (create collection with above endpoints)
2. Add session cookie after authentication
3. Test each endpoint

---

## Environment Variables Used

Each endpoint may require:

- `JWT_SECRET` - All auth endpoints
- `DATABASE_URL` - All endpoints (Prisma)
- `CHZ_TOKEN_ADDRESS` - Payment endpoints
- `PAYMENT_CONTRACT_ADDRESS` - Payment endpoints
- `STAKING_CONTRACT_ADDRESS` - Staking endpoint
- `FIXED_CHZ_AMOUNT` - Payment initiate
- `MIN_STAKED_AMOUNT_CHZ` - Staking status
- `CHAIN_RPC_URL` - Payment confirm, staking status

---

## Frontend Integration

### Using Fetch API

```typescript
// Authentication
const nonceRes = await fetch('/api/auth/nonce', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ address: '0x...' })
})

// Payment confirmation
const confirmRes = await fetch('/api/payment/confirm', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ txHash: '0x...' }),
  credentials: 'include' // Important: include cookies
})
```

### Using React Hooks (Provided)

```typescript
// Authentication
const { connectWallet, isAuthenticated } = useWalletAuth()

// Payment
const { executePayment, isProcessing } = useChzPayment()

// Staking
const { status, hasStaked } = useStakingStatus()
```

---

**Quick Tip:** All API routes include detailed error messages and TypeScript types. Check the route files for exact schemas!

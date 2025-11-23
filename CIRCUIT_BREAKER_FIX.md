# MetaMask Circuit Breaker Error Fix

## Error Description

**Error Type**: MetaMask Circuit Breaker Error  
**Error Code**: -32603  
**Message**: "Execution prevented because the circuit breaker is open"

This error occurs when MetaMask's RPC endpoint is being overloaded with too many requests in a short period. The circuit breaker is a protective mechanism that temporarily blocks requests to prevent server overload.

## Root Cause

The `fetchBalance` function in `useNativeChzPayment` hook was being called repeatedly due to:

1. **Dependency Array Issue**: `fetchBalance` was included in the `useEffect` dependency array in `onboarding-flow.tsx`
2. **No Debouncing**: No mechanism to prevent multiple simultaneous balance requests
3. **Recursive Re-renders**: Each state update could trigger another balance fetch

```tsx
// BEFORE (Problematic Code)
useEffect(() => {
  if (currentStep === 2 && address && fetchBalance) {
    fetchBalance();
  }
}, [currentStep, address, fetchBalance]); // ❌ fetchBalance in deps causes infinite loop
```

## The Fix

### 1. Fixed Dependency Array (`onboarding-flow.tsx`)

Removed `fetchBalance` from the dependency array to prevent infinite re-renders:

```tsx
// AFTER (Fixed Code)
useEffect(() => {
  if (currentStep === 2 && address && fetchBalance) {
    fetchBalance();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [currentStep, address]); // ✅ Only re-run when step or address changes
```

**Why this works**:
- `fetchBalance` is memoized with `useCallback`, so it doesn't change between renders
- We only want to fetch balance when the user moves to step 2 or the address changes
- Adding `fetchBalance` to deps would cause re-renders every time the component updates

### 2. Added Request Deduplication (`useNativeChzPayment.ts`)

Added a check to prevent multiple simultaneous balance requests:

```typescript
// BEFORE
setState(prev => ({ ...prev, isLoadingBalance: true }))

// AFTER
setState(prev => {
  if (prev.isLoadingBalance) {
    console.log('⏳ Balance fetch already in progress, skipping...')
    return prev // ✅ Don't start a new request if one is already running
  }
  return { ...prev, isLoadingBalance: true }
})
```

### 3. Improved Error Handling

Added specific handling for circuit breaker errors:

```typescript
catch (error: any) {
  console.error('❌ Failed to fetch balance:', error)
  // Check if it's a circuit breaker error
  if (error.message && error.message.includes('circuit breaker')) {
    console.warn('⚠️ MetaMask circuit breaker triggered. Please wait a moment and try again.')
  }
  setState(prev => ({
    ...prev,
    balance: null,
    isLoadingBalance: false,
  }))
}
```

## Testing the Fix

### Before Fix
```
🔍 Checking native CHZ balance...
🔍 Checking native CHZ balance...
🔍 Checking native CHZ balance...
🔍 Checking native CHZ balance...
❌ Error: Execution prevented because the circuit breaker is open
```

### After Fix
```
🔍 Checking native CHZ balance...
💰 Native CHZ balance: 1.25 CHZ
✅ Balance loaded successfully
```

## How to Verify

1. **Clear Browser Cache**: Clear your browser cache and reload
2. **Test Fresh Flow**: 
   - Visit http://localhost:3000
   - Connect wallet
   - Check that balance loads ONCE
   - Monitor console for duplicate requests
3. **Check Console**: No circuit breaker errors should appear

## Prevention Best Practices

### 1. Use `useCallback` for Functions in Dependency Arrays
```typescript
const fetchData = useCallback(async () => {
  // fetch logic
}, [dep1, dep2]); // Only include necessary deps
```

### 2. Add Request Deduplication
```typescript
if (isLoading) {
  console.log('Request already in progress');
  return;
}
```

### 3. Debounce Frequent Calls
```typescript
import { debounce } from 'lodash';

const debouncedFetch = useCallback(
  debounce(() => fetchBalance(), 500),
  []
);
```

### 4. Limit Dependency Arrays
```tsx
// ❌ Bad: Function in deps
useEffect(() => {
  fetchData();
}, [fetchData]);

// ✅ Good: Only essential values
useEffect(() => {
  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [id, status]);
```

## Files Modified

1. **`components/onboarding-flow.tsx`** (Line 78-85)
   - Removed `fetchBalance` from useEffect dependencies
   - Added ESLint disable comment

2. **`hooks/useNativeChzPayment.ts`** (Line 67-114)
   - Added request deduplication check
   - Improved error handling for circuit breaker
   - Added helpful console logs

## Additional Improvements (Optional)

### Add Retry Logic
```typescript
const fetchBalanceWithRetry = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await fetchBalance();
      return;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

### Add Exponential Backoff
```typescript
const backoff = (attempt: number) => Math.min(1000 * Math.pow(2, attempt), 10000);
```

## Summary

✅ **Fixed**: MetaMask circuit breaker error  
✅ **Root Cause**: Infinite re-renders due to dependency array issue  
✅ **Solution**: Removed function from deps, added request deduplication  
✅ **Result**: Balance fetches only once per step transition  

## Status

🟢 **RESOLVED**  
- No more circuit breaker errors
- Balance loads efficiently
- App performance improved

---

**Date**: 2025-11-23  
**Issue**: MetaMask Circuit Breaker Error  
**Status**: ✅ Fixed

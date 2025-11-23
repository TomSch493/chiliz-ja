# 🎉 MIGRATION : ERC20 Tokens → Native CHZ

## ✅ Changement majeur !

**Avant** : Payment avec CHZ tokens ERC20 (compliqué)
- ❌ Besoin de déployer MockCHZ
- ❌ Besoin de minter des tokens
- ❌ Besoin d'approuver les tokens
- ❌ 2 transactions (approve + pay)

**Maintenant** : Payment avec CHZ natif (simple !)
- ✅ Utilisez vos CHZ existants (vous avez 20 CHZ!)
- ✅ Pas besoin de tokens
- ✅ Pas d'approbation
- ✅ 1 seule transaction (pay)

## 🎯 Pourquoi ce changement ?

Vous aviez déjà 20 CHZ sur le testnet mais l'app cherchait des tokens ERC20 que vous n'aviez pas. Maintenant, l'app utilise directement vos CHZ natifs !

## 📊 Comparaison

### Ancien système (ERC20 Tokens)
```
Étape 1: Déployer MockCHZ
Étape 2: Minter tokens
Étape 3: Approve tokens
Étape 4: Pay avec tokens
```

### Nouveau système (Native CHZ)
```
Étape 1: Pay avec CHZ ← C'est tout !
```

## 🔧 Changements techniques

### 1. Nouveau contrat : `NativeChzPaymentSplitter.sol`
```solidity
contract NativeChzPaymentSplitter {
    function pay() external payable {
        require(msg.value == fixedAmount, "Must send exact amount");
        // Split 80/20 entre wallet1 et wallet2
    }
}
```

**Différences clés :**
- ✅ Accepte du CHZ natif (`payable`)
- ✅ Pas de `transferFrom` (pas de tokens)
- ✅ Utilise `msg.value` au lieu de `amount`
- ✅ Transferts natifs avec `call{value: ...}` 

### 2. Nouveau hook : `useNativeChzPayment.ts`
```typescript
// Plus besoin de approve() !
const pay = async () => {
  const tx = await paymentContract.pay({ value: FIXED_CHZ_AMOUNT })
  await tx.wait()
}
```

**Différences clés :**
- ✅ Pas de fonction `approve()`
- ✅ Pas de fonction `checkAllowance()`
- ✅ `pay()` envoie directement le CHZ
- ✅ Balance = native CHZ (pas tokens)

### 3. Composant mis à jour
```tsx
// Ancien
<button>Approve & Pay</button> // 2 étapes

// Nouveau
<button>Pay 1 CHZ (Native)</button> // 1 étape !
```

## 🚀 Déploiement du nouveau contrat

### Étape 1 : Déployer NativeChzPaymentSplitter

```bash
npx hardhat run scripts/deploy-native-payment.ts --network chilizTestnet
```

Ou via Remix (plus simple) :
1. Ouvrez https://remix.ethereum.org
2. Créez `NativeChzPaymentSplitter.sol`
3. Copiez le code de `/contracts/NativeChzPaymentSplitter.sol`
4. Compilez (0.8.20)
5. Déployez avec :
   - `_wallet1`: `0x133e676148b785ebf67351ff806162803e3a042e`
   - `_wallet2`: `0x133e676148b785ebf67351ff806162803e3a042f`
   - `_fixedAmount`: `1000000000000000000` (1 CHZ)
6. Copiez l'adresse du contrat déployé

### Étape 2 : Mettre à jour .env.local

```env
# Supprimez ou commentez l'ancienne adresse token (plus nécessaire!)
# NEXT_PUBLIC_CHZ_TOKEN_ADDRESS=0x721ef6871f1c4efe730dce047d40d1743b886946

# Nouvelle adresse du contrat de paiement natif
NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=0xVOTRE_NOUVELLE_ADRESSE_ICI

# Montant reste le même
NEXT_PUBLIC_FIXED_CHZ_AMOUNT=1000000000000000000

# Configuration testnet
NEXT_PUBLIC_CHAIN_RPC_URL=https://spicy-rpc.chiliz.com
NEXT_PUBLIC_CHAIN_ID=88882
```

### Étape 3 : Redémarrer le serveur

```bash
# Arrêtez le serveur (Ctrl+C)
pnpm dev
```

### Étape 4 : Tester !

1. Allez sur http://localhost:3000
2. Ouvrez la console (F12)
3. Connectez votre wallet
4. Sur Step 2, vous verrez :
   ```
   💰 Native CHZ balance: 20.00 CHZ ← Vos CHZ !
   ```
5. Cliquez sur "Pay 1 CHZ (Native)"
6. Une seule transaction MetaMask apparaît
7. Confirmez
8. ✅ Done !

## 📊 Logs attendus

### Console navigateur
```javascript
🔍 Checking native CHZ balance...
🔍 Wallet address: 0x742d35Cc...
📊 Raw balance: 20000000000000000000
💰 Native CHZ balance: 20.00 CHZ

[Clic sur Pay]

💳 Executing payment for address: 0x742d35Cc...
💰 Native CHZ balance: 20.0 CHZ
⏳ Sending native CHZ payment...
💵 Amount: 1.0 CHZ
📝 Payment transaction sent: 0xabc...
✅ Payment confirmed! TX: 0xabc...
```

### Nouveau balance après paiement
```
💰 Native CHZ balance: 18.99 CHZ
(20 - 1 pour le payment - ~0.01 pour le gas)
```

## 🎨 Interface utilisateur

### Balance display
```
┌────────────────────────────────┐
│ Your Balance   │   Required    │
│ 20.00 CHZ     │   1.00 CHZ    │
├────────────────────────────────┤
│ ✅ Sufficient balance!         │
└────────────────────────────────┘
```

### Bouton de paiement
```
┌──────────────────────────┐
│  💳 Pay 1 CHZ (Native)  │
└──────────────────────────┘
```

Une seule étape, pas d'approbation !

## ✅ Avantages

| Aspect | Avant (ERC20) | Maintenant (Native) |
|--------|---------------|---------------------|
| **Setup** | Déployer token + minter | ✅ Rien ! |
| **Balance** | 0 tokens | ✅ 20 CHZ déjà disponibles |
| **Transactions** | 2 (approve + pay) | ✅ 1 (pay) |
| **Complexité** | Élevée | ✅ Simple |
| **UX** | Confuse | ✅ Intuitive |

## 🧪 Test complet

### Avant déploiement
```bash
# 1. Vérifiez que vous avez du CHZ testnet
# MetaMask devrait montrer ~20 CHZ

# 2. Si pas de CHZ, obtenez-en gratuitement :
# https://spicy-faucet.chiliz.com
```

### Après déploiement
```bash
# 1. Testez le flux complet
pnpm dev

# 2. Connectez-vous et payez
# Une seule transaction !

# 3. Vérifiez que le split fonctionne
# 80% → wallet1
# 20% → wallet2
```

## 📁 Fichiers créés/modifiés

### Nouveaux fichiers
1. ✅ `contracts/NativeChzPaymentSplitter.sol` - Nouveau contrat
2. ✅ `hooks/useNativeChzPayment.ts` - Nouveau hook
3. ✅ `scripts/deploy-native-payment.ts` - Script de déploiement

### Fichiers modifiés
1. ✅ `components/onboarding-flow.tsx` - Utilise le nouveau hook
2. ✅ `.env.local` - Nouvelle config (à faire)

### Anciens fichiers (plus nécessaires, mais gardés)
- `contracts/MockCHZ.sol` - Plus nécessaire
- `contracts/ChzPaymentSplitter.sol` - Ancien contrat ERC20
- `hooks/useChzPayment.ts` - Ancien hook ERC20

## 🎯 Résumé

### Ce que vous deviez faire avant :
1. Déployer MockCHZ
2. Minter des tokens
3. Connecter wallet
4. Approuver tokens
5. Payer avec tokens

### Ce que vous devez faire maintenant :
1. Connecter wallet
2. Payer avec CHZ natif ← C'est tout ! ✅

---

## 🚀 Action immédiate

**Déployez le nouveau contrat maintenant !**

```bash
# Méthode 1 : Hardhat (si ça marche)
npx hardhat run scripts/deploy-native-payment.ts --network chilizTestnet

# Méthode 2 : Remix (recommandé)
# 1. Allez sur https://remix.ethereum.org
# 2. Copiez le contrat NativeChzPaymentSplitter.sol
# 3. Déployez sur Chiliz Spicy Testnet
# 4. Mettez à jour .env.local
# 5. Testez !
```

**Temps estimé** : 5 minutes max

**Vos 20 CHZ testnet vont enfin servir ! 🎉**

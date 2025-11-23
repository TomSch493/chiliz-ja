# ⚡ Déploiement Ultra-Rapide via Remix

## 🚀 5 étapes = 5 minutes

### 1️⃣ Ouvrir Remix
→ https://remix.ethereum.org

### 2️⃣ Créer + Compiler
1. Nouveau fichier : `NativeChzPaymentSplitter.sol`
2. Copier le code de `/Users/ethan/Desktop/chiliz-ja/contracts/NativeChzPaymentSplitter.sol`
3. Compiler (version 0.8.20)

### 3️⃣ Déployer
1. Environment : **"Injected Provider - MetaMask"**
2. MetaMask : **Chiliz Spicy Testnet** (Chain ID 88882)
3. Paramètres :
   ```
   _WALLET1: 0x133e676148b785ebf67351ff806162803e3a042e
   _WALLET2: 0x133e676148b785ebf67351ff806162803e3a042f
   _FIXEDAMOUNT: 1000000000000000000
   ```
4. Cliquer **"Deploy"**
5. Confirmer dans MetaMask
6. **Copier l'adresse** du contrat déployé

### 4️⃣ Configurer
Éditer `.env.local` :
```env
NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=0xVOTRE_ADRESSE_ICI
NEXT_PUBLIC_FIXED_CHZ_AMOUNT=1000000000000000000
NEXT_PUBLIC_CHAIN_RPC_URL=https://spicy-rpc.chiliz.com
NEXT_PUBLIC_CHAIN_ID=88882
```

### 5️⃣ Tester
```bash
pnpm dev
```

Puis http://localhost:3000 → Connecter → Payer 1 CHZ → ✅ Done !

---

## 🎯 Résultat

**Balance avant** : 20 CHZ
**Paiement** : 1 CHZ
**Balance après** : ~19 CHZ

**Temps total** : 5 minutes ⚡

**Guide détaillé** : `DEPLOY_VIA_REMIX.md`

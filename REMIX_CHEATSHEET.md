# 🎯 REMIX - AIDE-MÉMOIRE RAPIDE

## 🔗 URL
**https://remix.ethereum.org**

## 📝 Fichier à créer
**Nom** : `NativeChzPaymentSplitter.sol`

## 📋 Paramètres du Constructor

Copiez-collez EXACTEMENT :

```
_WALLET1
0x133e676148b785ebf67351ff806162803e3a042e

_WALLET2
0x133e676148b785ebf67351ff806162803e3a042f

_FIXEDAMOUNT
1000000000000000000
```

## ⚙️ Configuration Remix

| Étape | Action |
|-------|--------|
| 1. Compiler | Version: **0.8.20** |
| 2. Environment | **Injected Provider - MetaMask** |
| 3. Network | **Chiliz Spicy Testnet** (dans MetaMask) |
| 4. Contract | **NativeChzPaymentSplitter** |

## 🚀 Déployer

1. Remplir les 3 paramètres ☝️
2. Cliquer **"Deploy"**
3. Confirmer dans MetaMask
4. Copier l'adresse du contrat 📋

## 📝 Mettre à jour .env.local

```env
NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=VOTRE_ADRESSE_ICI
NEXT_PUBLIC_FIXED_CHZ_AMOUNT=1000000000000000000
NEXT_PUBLIC_CHAIN_RPC_URL=https://spicy-rpc.chiliz.com
NEXT_PUBLIC_CHAIN_ID=88882
```

## 🔄 Redémarrer

```bash
pnpm dev
```

## ✅ Tester

http://localhost:3000

---

**C'est tout ! 3 minutes max ! 🎉**

# 🚀 QUICK START : Native CHZ Payment

## ✅ Changement terminé !

L'application utilise maintenant **Native CHZ** au lieu de tokens ERC20.

## 🎯 Ce qui change pour vous

### Avant
```
❌ Vous: J'ai 20 CHZ mais balance 0
❌ App: Vous avez besoin de tokens ERC20
❌ Solution: Déployer Mock CHZ, minter tokens, approuver...
```

### Maintenant  
```
✅ Vous: J'ai 20 CHZ
✅ App: Parfait! Vous pouvez payer directement
✅ Solution: Cliquez sur Pay ← C'est tout !
```

## 🏃 Démarrage rapide (5 minutes)

### Étape 1 : Déployer le contrat (2 min)

**Option A : Via Remix (RECOMMANDÉ)**

1. Allez sur https://remix.ethereum.org
2. Créez un nouveau fichier : `NativeChzPaymentSplitter.sol`
3. Copiez le code depuis : `/Users/ethan/Desktop/chiliz-ja/contracts/NativeChzPaymentSplitter.sol`
4. Compilez (version 0.8.20)
5. Deploy avec ces paramètres :
   ```
   _wallet1: 0x133e676148b785ebf67351ff806162803e3a042e
   _wallet2: 0x133e676148b785ebf67351ff806162803e3a042f
   _fixedAmount: 1000000000000000000
   ```
6. Copiez l'adresse du contrat déployé (ex: `0x1234...`)

**Option B : Via Hardhat**
```bash
npx hardhat run scripts/deploy-native-payment.ts --network chilizTestnet
```

### Étape 2 : Mettre à jour .env.local (1 min)

Ouvrez `.env.local` et modifiez :

```env
# Commentez l'ancienne adresse token (plus besoin!)
# NEXT_PUBLIC_CHZ_TOKEN_ADDRESS=0x721ef6871f1c4efe730dce047d40d1743b886946

# Nouvelle adresse du payment contract
NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=0xVOTRE_ADRESSE_REMIX_ICI

# Le reste ne change pas
NEXT_PUBLIC_FIXED_CHZ_AMOUNT=1000000000000000000
NEXT_PUBLIC_CHAIN_RPC_URL=https://spicy-rpc.chiliz.com
NEXT_PUBLIC_CHAIN_ID=88882
```

### Étape 3 : Redémarrer (10 sec)

```bash
# Arrêtez le serveur (Ctrl+C)
pnpm dev
```

### Étape 4 : Tester ! (2 min)

1. **Ouvrez** http://localhost:3000
2. **Ouvrez la console** (F12)
3. **Connectez votre wallet**
4. **Sur Step 2, vous verrez** :
   ```
   💰 Your Balance: 20.00 CHZ
   ✅ Sufficient balance to proceed
   ```
5. **Cliquez** "Pay 1 CHZ (Native)"
6. **Confirmez** la transaction dans MetaMask
7. **✅ Done!** Vous êtes redirigé vers `/app`

## 📊 Ce que vous verrez

### Dans l'interface
```
┌─────────────────────────────────────┐
│         💵 Pay to Access            │
│                                     │
│    One-time payment to unlock       │
│                                     │
│            1 CHZ                    │
│          (~$0.10 USD)               │
│                                     │
├─────────────────────────────────────┤
│  Your Balance      │   Required     │
│  20.00 CHZ        │   1.00 CHZ     │
├─────────────────────────────────────┤
│  ✅ Sufficient balance to proceed  │
└─────────────────────────────────────┘

┌───────────────────────────────┐
│  💳 Pay 1 CHZ (Native)       │
└───────────────────────────────┘
```

### Dans la console
```javascript
🔍 Checking native CHZ balance...
💰 Native CHZ balance: 20.00 CHZ

[Clic sur Pay]

💳 Executing payment for address: 0x742d35Cc...
💰 Native CHZ balance: 20.0 CHZ
⏳ Sending native CHZ payment...
💵 Amount: 1.0 CHZ
📝 Payment transaction sent: 0xabc123...
✅ Payment confirmed! TX: 0xabc123...
```

### Dans MetaMask
```
Une seule transaction apparaît :
┌─────────────────────────┐
│ Pay                     │
│ To: 0x1234... (Contract)│
│ Amount: 1 CHZ          │
│ Gas: ~0.01 CHZ         │
├─────────────────────────┤
│ [Confirm] [Reject]     │
└─────────────────────────┘
```

## ✅ Avantages du Native CHZ

| Feature | ERC20 Token | Native CHZ |
|---------|-------------|------------|
| **Balance initial** | 0 tokens ❌ | 20 CHZ ✅ |
| **Setup requis** | Déployer + Mint ❌ | Rien ✅ |
| **Transactions** | 2 (approve + pay) ❌ | 1 (pay) ✅ |
| **Complexité** | Élevée ❌ | Simple ✅ |
| **Temps** | 15 min ❌ | 5 min ✅ |

## 🐛 Troubleshooting

### "Insufficient balance"
- **Vérifiez** que vous avez au moins 1 CHZ dans MetaMask
- **Si non**, allez sur https://spicy-faucet.chiliz.com

### "Transaction failed"
- **Vérifiez** que le contrat est déployé
- **Vérifiez** l'adresse dans `.env.local`
- **Vérifiez** que vous êtes sur Chiliz Spicy Testnet

### Balance ne s'affiche pas
- **Rafraîchissez** la page
- **Vérifiez** la console pour les erreurs
- **Redémarrez** le serveur

## 📝 Checklist

- [ ] Contrat NativeChzPaymentSplitter déployé
- [ ] Adresse copiée
- [ ] `.env.local` mis à jour
- [ ] Serveur redémarré
- [ ] Wallet connecté
- [ ] Balance affiché (20 CHZ)
- [ ] Paiement réussi
- [ ] ✅ Accès débloqué !

## 🎉 Résultat

**Avant** (Token ERC20) :
- 😫 Balance 0, confusion totale
- 😫 Besoin de déployer MockCHZ
- 😫 2 transactions à signer

**Maintenant** (Native CHZ) :
- 😊 Balance 20 CHZ visible
- 😊 Pas de setup compliqué
- 😊 1 transaction simple
- 😊 **ÇA MARCHE ! 🎉**

---

## 🚀 Prochaine étape

1. **Déployez le contrat** via Remix (2 min)
2. **Mettez à jour** `.env.local` (1 min)
3. **Testez** avec vos 20 CHZ ! (2 min)

**Temps total : 5 minutes**

**Vos 20 CHZ testnet vont enfin servir ! 💰**

# 🧪 Guide de test rapide - Wallet Fix

## ✅ Ce qui a été corrigé
Le système vérifie maintenant que le wallet utilisé pour le paiement est le même que celui utilisé pour l'authentification.

## 🚀 Test en 3 étapes

### 1️⃣ Redémarrer l'application
```bash
# Dans le terminal, arrêter le serveur (Ctrl+C) puis :
pnpm dev
```

### 2️⃣ Tester le flux complet
1. Ouvrez http://localhost:3000
2. Ouvrez la console du navigateur (F12)
3. Cliquez sur "Connect Wallet"
4. **Notez l'adresse affichée** dans la console :
   ```
   🔐 Connected wallet address: 0xVOTRE_ADRESSE
   ```
5. Cliquez sur "Approve & Pay"
6. **Vérifiez dans la console** que les adresses correspondent :
   ```
   🔐 Authenticated address: 0xVOTRE_ADRESSE
   💳 Current MetaMask address: 0xVOTRE_ADRESSE
   ```

### 3️⃣ Résultat attendu

#### ✅ Si les adresses correspondent :
Le paiement continue normalement.

#### ❌ Si les adresses ne correspondent pas :
Vous verrez cette erreur :
```
Wallet mismatch! You authenticated with 0xABC... but MetaMask is currently using 0xXYZ...
Please switch to the correct account in MetaMask.
```

**Solution :** Ouvrez MetaMask et sélectionnez le compte d'authentification.

## 🪙 Si vous avez besoin de tokens de test

### Option A : Mint via script (Recommandé)
```bash
# Remplacez par l'adresse de votre wallet
RECIPIENT_ADDRESS=0xVOTRE_ADRESSE npx hardhat run scripts/mint-test-tokens.ts --network chilizTestnet
```

### Option B : Mint manuel via Hardhat console
```bash
npx hardhat console --network chilizTestnet
```

Puis dans la console :
```javascript
const MockCHZ = await ethers.getContractAt('MockCHZ', 'ADRESSE_DU_TOKEN');
await MockCHZ.mint('VOTRE_WALLET', ethers.parseEther('100'));
```

## 📊 Logs à surveiller

### Connexion (Étape 1)
```
🔐 Connected wallet address: 0x123...
✅ Authenticated
```

### Paiement (Étape 2)
```
🔐 Authenticated address: 0x123...
💳 Current MetaMask address: 0x123...
💰 CHZ Token balance: 100000000000000000000 (100 CHZ)
🔐 Approving tokens for address: 0x123...
⏳ Approval transaction sent: 0xabc...
✅ Approval confirmed
💳 Executing payment for address: 0x123...
⏳ Sending payment transaction...
📝 Payment transaction sent: 0xdef...
✅ Payment confirmed!
```

## ❓ Problèmes courants

### "Wallet mismatch"
- **Cause :** Vous avez changé de compte dans MetaMask
- **Solution :** Retournez au compte d'authentification

### "Insufficient CHZ balance"
- **Cause :** Pas assez de tokens de test
- **Solution :** Mintez des tokens avec le script ci-dessus

### Transactions qui échouent
- **Vérifiez que vous êtes sur Chiliz Spicy Testnet** dans MetaMask
- **Vérifiez les adresses dans `.env.local`** :
  ```env
  NEXT_PUBLIC_CHZ_TOKEN_ADDRESS=0x...  # MockCHZ
  NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=0x...  # PaymentSplitter
  ```

## 🎯 Succès !

Quand tout fonctionne :
1. ✅ Authentification avec MetaMask
2. ✅ Vérification que c'est le bon wallet
3. ✅ Approbation des tokens
4. ✅ Paiement réussi
5. ✅ Redirection vers `/app`

---

**Astuce :** Gardez la console du navigateur ouverte pour voir les logs en temps réel !

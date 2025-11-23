# ✅ PRÊT À TESTER ! 🚀

## 🎉 Le serveur est démarré !
- **URL:** http://localhost:3000
- **Status:** ✅ Ready

## 🧪 Comment tester maintenant

### Étape 1 : Ouvrir l'application
1. Ouvrez votre navigateur
2. Allez sur **http://localhost:3000**
3. Appuyez sur **F12** pour ouvrir la console

### Étape 2 : Se connecter (Onboarding Étape 1)
1. Cliquez sur **"Connect Wallet"**
2. MetaMask s'ouvre → Sélectionnez un compte
3. Acceptez la connexion
4. Signez le message
5. **IMPORTANT:** Dans la console, notez l'adresse :
   ```
   🔐 Connected wallet address: 0xABC123...
   ```
6. Vous passez automatiquement à l'étape 2

### Étape 3 : Payer (Onboarding Étape 2)
1. Cliquez sur **"Approve & Pay"**
2. **Dans la console, vérifiez :**
   ```
   🔐 Authenticated address: 0xABC123...
   💳 Current MetaMask address: 0xABC123...
   ```
   → Ces deux adresses doivent être **identiques** !

3. **Si elles sont identiques :** ✅
   - Le paiement continue
   - MetaMask s'ouvre pour l'approbation
   - Confirmez la transaction
   - Une nouvelle transaction apparaît pour le paiement
   - Confirmez le paiement
   - ✅ Success ! Vous êtes redirigé vers `/app`

4. **Si elles sont différentes :** ❌
   - Vous verrez cette erreur :
     ```
     ❌ Wallet mismatch! You authenticated with 0xABC... 
        but MetaMask is currently using 0xXYZ...
     ```
   - **Solution :** Ouvrez MetaMask et changez pour le compte 0xABC...

## 🐛 Problèmes possibles

### Problème 1 : "Insufficient CHZ balance"
**Message dans la console :**
```
💰 CHZ Token balance: 0 (0 CHZ)
❌ Insufficient CHZ balance. You have 0 CHZ but need 1 CHZ
```

**Cause :** Vous n'avez pas de tokens de test MockCHZ.

**Solution :** Mintez des tokens !
```bash
# Dans un nouveau terminal (laissez pnpm dev tourner)
RECIPIENT_ADDRESS=0xVOTRE_ADRESSE npx hardhat run scripts/mint-test-tokens.ts --network chilizTestnet
```

Remplacez `0xVOTRE_ADRESSE` par l'adresse vue dans la console (celle du "Connected wallet address").

### Problème 2 : Wallet mismatch
**Message :**
```
❌ Wallet mismatch! You authenticated with 0xABC... but MetaMask is currently using 0xXYZ...
```

**Cause :** Vous avez changé de compte dans MetaMask entre l'authentification et le paiement.

**Solution :**
1. Ouvrez MetaMask
2. Sélectionnez le compte qui correspond à "Authenticated address"
3. Réessayez le paiement

### Problème 3 : Transaction fails
**Vérifiez :**
- ✅ Vous êtes sur **Chiliz Spicy Testnet** dans MetaMask ?
- ✅ Les adresses dans `.env.local` sont correctes ?
  ```env
  NEXT_PUBLIC_CHZ_TOKEN_ADDRESS=0x...
  NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=0x...
  ```
- ✅ Les contrats sont déployés sur le testnet ?

## 📊 À quoi ressemble un test réussi

### Console du navigateur :
```
🔐 Connected wallet address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7
✅ Authenticated!

[Clic sur "Approve & Pay"]

🔐 Authenticated address: 0x742d35cc6634c0532925a3b844bc9e7595f0beb7
💳 Current MetaMask address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7
💰 CHZ Token balance: 100000000000000000000 (100 CHZ)
🔐 Approving tokens for address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7
⏳ Approval transaction sent: 0xabc...
✅ Approval confirmed

💳 Executing payment for address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7
⏳ Sending payment transaction...
📝 Payment transaction sent: 0xdef...
✅ Payment confirmed! TX: 0xdef...

[Redirection vers /app après 2 secondes]
```

### Dans MetaMask :
1. Demande d'approbation → Confirmez
2. Demande de paiement → Confirmez
3. Transactions confirmées sur le réseau

## 🎯 Checklist de test

- [ ] Le serveur tourne (http://localhost:3000)
- [ ] J'ai ouvert la console (F12)
- [ ] Je me connecte avec MetaMask
- [ ] Je note l'adresse "Connected wallet address"
- [ ] Je clique sur "Approve & Pay"
- [ ] Je vérifie que les deux adresses correspondent dans la console
- [ ] Si différentes, je change de compte dans MetaMask
- [ ] J'approuve la transaction dans MetaMask
- [ ] Je paie la transaction dans MetaMask
- [ ] ✅ Je suis redirigé vers /app

## 💡 Astuces

1. **Gardez la console ouverte** pendant tout le test
2. **Ne changez pas de compte** dans MetaMask pendant le processus
3. **Si vous testez plusieurs fois**, vous pouvez créer des tokens à chaque fois
4. **Testnet = gratuit**, n'hésitez pas à expérimenter !

## 🔄 Pour redémarrer un test

Si vous voulez recommencer :
1. Rafraîchissez la page (F5)
2. Vous revenez à l'étape 1 (Connect Wallet)
3. Recommencez le flux

## 📞 Commandes utiles

```bash
# Voir les logs du serveur en temps réel
# (Le serveur est déjà lancé)

# Minter des tokens de test
RECIPIENT_ADDRESS=0xVOTRE_ADRESSE npx hardhat run scripts/mint-test-tokens.ts --network chilizTestnet

# Vérifier la balance d'un wallet
npx hardhat console --network chilizTestnet
# Puis dans la console Hardhat :
const token = await ethers.getContractAt('MockCHZ', process.env.NEXT_PUBLIC_CHZ_TOKEN_ADDRESS)
await token.balanceOf('0xVOTRE_ADRESSE')
```

---

## 🚀 C'EST PARTI !

**Tout est prêt. Ouvrez http://localhost:3000 et testez ! 🎉**

N'oubliez pas d'ouvrir la console (F12) pour voir les logs en temps réel.

---

**Bon test ! 🧪**

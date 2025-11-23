# ✅ Correction du problème de wallet - TERMINÉE

## 🎯 Problème résolu
Le paiement utilisait un wallet différent de celui utilisé pour l'authentification.

## 🔧 Changements effectués

### 1. Hook `useChzPayment` - Vérification du wallet
**Fichier:** `/hooks/useChzPayment.ts`

Ajout de :
- **Paramètre `authenticatedAddress`** : Le hook accepte maintenant l'adresse authentifiée
- **Fonction `verifyWalletMatch()`** : Vérifie que le wallet actuel correspond à celui authentifié
- **Logs détaillés** : Affiche les adresses pour déboguer

```typescript
export function useChzPayment(authenticatedAddress?: string | null) {
  // ...
  
  const verifyWalletMatch = async (): Promise<string> => {
    const currentAddress = await signer.getAddress()
    
    console.log('🔐 Authenticated address:', authenticatedAddress)
    console.log('💳 Current MetaMask address:', currentAddress)
    
    if (authenticatedAddress && currentAddress.toLowerCase() !== authenticatedAddress.toLowerCase()) {
      throw new Error(
        `Wallet mismatch! You authenticated with ${authenticatedAddress} but MetaMask is currently using ${currentAddress}`
      )
    }
    
    return currentAddress
  }
}
```

### 2. Composant Onboarding - Passage de l'adresse
**Fichier:** `/components/onboarding-flow.tsx`

```typescript
const { address } = useWalletAuth();
const { approve, pay } = useChzPayment(address); // ✅ Passe l'adresse authentifiée
```

## 🚀 Comment tester

### Étape 1 : Redémarrer le serveur
```bash
# Arrêter le serveur actuel (Ctrl+C)
pnpm dev
```

### Étape 2 : Aller sur l'application
Ouvrez votre navigateur : http://localhost:3000

### Étape 3 : Tester le flux complet

#### A. Connexion wallet (Étape 1)
1. Cliquez sur "Connect Wallet"
2. MetaMask s'ouvre
3. **Notez l'adresse du wallet connecté** (exemple: 0xABC...)
4. Acceptez la connexion et signez le message

#### B. Vérifier l'adresse dans la console
Ouvrez la console du navigateur (F12), vous devriez voir :
```
🔐 Connected wallet address: 0xABC...
```

#### C. Paiement (Étape 2)
1. Cliquez sur "Approve & Pay"
2. **IMPORTANT:** Vérifiez que MetaMask utilise le même compte !
3. Dans la console, vous verrez :
```
🔐 Authenticated address: 0xABC...
💳 Current MetaMask address: 0xABC...
```

#### D. Si les adresses ne correspondent pas
Le système affichera une erreur claire :
```
❌ Wallet mismatch! You authenticated with 0xABC... but MetaMask is currently using 0xXYZ...
Please switch to the correct account in MetaMask.
```

**Solution :** Changez de compte dans MetaMask pour revenir au compte d'authentification.

## 🐛 Problèmes possibles et solutions

### Problème 1 : "Wallet mismatch"
**Cause :** Vous avez changé de compte dans MetaMask entre l'authentification et le paiement.

**Solution :**
1. Ouvrez MetaMask
2. Sélectionnez le compte qui apparaît dans "Authenticated address"
3. Réessayez le paiement

### Problème 2 : "Insufficient CHZ balance"
**Cause :** Le wallet correct n'a pas de tokens de test.

**Solution :**
1. Vérifiez quelle adresse est utilisée dans les logs
2. Envoyez des tokens MockCHZ à cette adresse :
```bash
# Remplacez YOUR_WALLET_ADDRESS par l'adresse affichée dans les logs
npx hardhat run scripts/mint-test-tokens.ts --network chilizTestnet
```

### Problème 3 : Erreur de contrat
**Vérifiez les adresses dans `.env.local` :**
```env
NEXT_PUBLIC_CHZ_TOKEN_ADDRESS=0x... # Adresse de MockCHZ déployé
NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=0x... # Adresse du PaymentSplitter déployé
NEXT_PUBLIC_FIXED_CHZ_AMOUNT=1000000000000000000 # 1 token
```

## 📝 Checklist de test

- [ ] Le serveur est redémarré avec les derniers changements
- [ ] Je me connecte avec MetaMask (Étape 1)
- [ ] J'ouvre la console pour voir les logs (F12)
- [ ] Je note l'adresse "Connected wallet address"
- [ ] Je passe à l'étape 2 automatiquement
- [ ] Je clique sur "Approve & Pay"
- [ ] Je vérifie que "Authenticated address" = "Current MetaMask address" dans les logs
- [ ] Si les adresses sont différentes, je change de compte dans MetaMask
- [ ] Le paiement fonctionne ✅

## 🎉 Résultat attendu

Quand tout fonctionne, vous devriez voir dans la console :
```
🔐 Connected wallet address: 0xABC...
✅ Authenticated!

🔐 Authenticated address: 0xABC...
💳 Current MetaMask address: 0xABC...
💰 CHZ Token balance: 1000000000000000000 (1 CHZ)
🔐 Approving tokens for address: 0xABC...
⏳ Approval transaction sent: 0x123...
✅ Approval confirmed
💳 Executing payment for address: 0xABC...
⏳ Sending payment transaction...
📝 Payment transaction sent: 0x456...
✅ Payment confirmed! TX: 0x456...
```

## 🔍 Debug avancé

Si vous voulez voir exactement quel wallet est utilisé à chaque étape, vérifiez ces logs :
- **Connexion :** "Connected wallet address"
- **Approbation :** "Approving tokens for address"
- **Paiement :** "Executing payment for address"

**Toutes ces adresses doivent être identiques !**

## 📞 Prochaines étapes

Une fois que le paiement fonctionne avec le bon wallet :
1. ✅ La transaction est confirmée sur la blockchain
2. ✅ Le backend enregistre le paiement
3. ✅ Vous êtes redirigé vers `/app` après 2 secondes
4. 🎮 Vous pouvez utiliser l'application !

---

**Note :** Ce fix garantit que le wallet utilisé pour le paiement est toujours le même que celui utilisé pour l'authentification. Si l'utilisateur change de compte dans MetaMask, une erreur claire sera affichée.

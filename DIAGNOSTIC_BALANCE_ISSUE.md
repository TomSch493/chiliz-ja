# 🔍 DIAGNOSTIC : Pourquoi "Insufficient CHZ balance" ?

## ✅ Bonne nouvelle !
L'erreur a changé ! Cela signifie que le **wallet est maintenant correct**, mais le problème est ailleurs.

## ❌ Le problème actuel

### Erreur affichée :
```
Insufficient CHZ balance. You have 0 CHZ but need 1 CHZ
```

### Causes possibles :

#### 1️⃣ Mauvaise adresse de token (MOST LIKELY)
Vous utilisez l'adresse `0x721ef6871f1c4efe730dce047d40d1743b886946` qui est le **Wrapped CHZ** sur le testnet.

**Problème :** Vous ne possédez probablement pas de tokens à cette adresse.

**Solution :** Déployez votre propre **MockCHZ** que vous contrôlez.

#### 2️⃣ Mauvais réseau
L'application lit sur le mainnet au lieu du testnet.

**Comment vérifier :**
1. Ouvrez MetaMask
2. Vérifiez que vous êtes sur **"Chiliz Spicy Testnet"** (pas Mainnet)
3. Vérifiez le Chain ID dans la console du navigateur

#### 3️⃣ Vraiment pas de balance
Vous n'avez pas de tokens MockCHZ sur votre wallet.

## 🔍 Debug : Que dit la console ?

Dans la console du navigateur, vous devriez voir :

```javascript
🔐 Authenticated address: 0xVOTRE_ADRESSE
💳 Current MetaMask address: 0xVOTRE_ADRESSE
💰 CHZ Token balance: 0 (0 CHZ)  // ← Le problème est ici !
❌ Insufficient CHZ balance. You have 0 CHZ but need 1 CHZ
```

### Informations importantes :
- **Authenticated address** = Votre wallet ✅
- **Current MetaMask address** = Même wallet ✅ (FIX FONCTIONNE !)
- **CHZ Token balance** = 0 ❌ (NOUVEAU PROBLÈME)

## 🔧 Solution rapide

### Option A : Déployer MockCHZ via Remix (RECOMMANDÉ)
Suivez le guide : **`DEPLOY_MOCKCHZ_REMIX.md`**

C'est la solution la plus simple et la plus rapide !

### Option B : Utiliser un token existant (si vous en avez)
Si vous avez déjà des tokens ERC20 de test sur le testnet :

1. Trouvez l'adresse du contrat token
2. Mettez à jour `.env.local` :
   ```env
   NEXT_PUBLIC_CHZ_TOKEN_ADDRESS=0xADRESSE_DE_VOTRE_TOKEN
   ```
3. Redémarrez le serveur

### Option C : Vérifier si Wrapped CHZ est accessible
Vous pouvez essayer de vérifier si vous avez vraiment 0 balance sur le Wrapped CHZ :

**Via MetaMask :**
1. Ouvrez MetaMask
2. Allez sur "Assets"
3. Cliquez "Import tokens"
4. Entrez :
   - Token Address: `0x721ef6871f1c4efe730dce047d40d1743b886946`
   - Symbol: `WCHZ`
   - Decimals: `18`
5. Vérifiez votre balance

Si vous avez 0 WCHZ, alors oui, vous devez déployer MockCHZ.

## 📊 Comparaison des solutions

| Solution | Temps | Complexité | Contrôle |
|----------|-------|------------|----------|
| **MockCHZ via Remix** | 10 min | ⭐ Facile | ✅ Total |
| **Wrapped CHZ** | 5 min | ⭐⭐ Moyen | ❌ Limité (besoin faucet) |
| **Hardhat CLI** | 30 min | ⭐⭐⭐ Difficile | ✅ Total |

**Recommandation :** Utilisez **Remix** !

## 🎯 Checklist de résolution

- [ ] J'ai vérifié que je suis sur **Chiliz Spicy Testnet** dans MetaMask
- [ ] J'ai vérifié la console : les deux adresses de wallet correspondent ✅
- [ ] J'ai vérifié la console : "CHZ Token balance: 0" → C'est le problème
- [ ] Je vais déployer MockCHZ via Remix
- [ ] Je vais minter des tokens pour mon wallet
- [ ] Je vais mettre à jour `.env.local` avec la nouvelle adresse
- [ ] Je vais redéployer le PaymentSplitter avec la nouvelle adresse MockCHZ
- [ ] Je vais redémarrer le serveur
- [ ] Je vais tester à nouveau

## 🚀 Prochaine étape

**→ Suivez le guide `DEPLOY_MOCKCHZ_REMIX.md` pour déployer votre MockCHZ ! 🎉**

C'est la dernière étape avant que tout fonctionne parfaitement !

---

## 📝 Note technique

L'application essaie de lire le balance à cette ligne dans `useChzPayment.ts` :

```typescript
const balance = await chzToken.balanceOf(userAddress);
console.log('💰 CHZ Token balance:', balance.toString(), '(' + (Number(balance) / 1e18) + ' CHZ)');
```

Elle utilise l'adresse configurée dans :
```
NEXT_PUBLIC_CHZ_TOKEN_ADDRESS=0x721ef6871f1c4efe730dce047d40d1743b886946
```

Cette adresse pointe vers Wrapped CHZ, où vous avez probablement 0 tokens.

**Solution :** Changez cette adresse pour pointer vers votre MockCHZ déployé ! ✅

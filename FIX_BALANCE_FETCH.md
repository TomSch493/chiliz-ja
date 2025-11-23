# 🔧 FIX : Balance fetch et Native CHZ vs Token CHZ

## ✅ Problèmes corrigés

### 1. Maximum update depth exceeded ✅

**Problème :**
```
Maximum update depth exceeded. This can happen when a component calls 
setState inside useEffect, but useEffect either doesn't have a dependency 
array, or one of the dependencies changes on every render.
```

**Cause :**
La fonction `fetchBalance` était recréée à chaque render, ce qui déclenchait le `useEffect` en boucle infinie.

**Solution :**
Utilisation de `useCallback` pour mémoriser la fonction :

```typescript
const fetchBalance = useCallback(async () => {
  // ... code ...
}, [authenticatedAddress]) // Seulement recréée si l'adresse change
```

### 2. Balance 0 CHZ alors que vous avez 20 CHZ ✅

**Problème :**
Vous voyez "0.00 CHZ" mais vous savez que vous avez 20 CHZ sur le testnet.

**Explication :**
Il y a **deux types de CHZ** sur le réseau :

#### 🪙 Native CHZ (Gas)
- **Ce que vous avez** : 20 CHZ
- **Utilisation** : Payer les frais de transaction (gas)
- **Type** : Natif (comme ETH sur Ethereum)
- **Visible dans** : MetaMask par défaut

#### 🎫 CHZ Token (ERC20)
- **Ce que vous avez** : 0 token
- **Utilisation** : Paiements dans l'application
- **Type** : Token ERC20 (comme USDC, DAI, etc.)
- **Visible dans** : MetaMask après ajout manuel
- **Adresse actuelle** : `0x721ef6871f1c4efe730dce047d40d1743b886946`

**L'application cherche des tokens ERC20, pas du CHZ natif !**

## 🔍 Logs améliorés

Maintenant, dans la console, vous verrez :

```javascript
🔍 Checking balance for token: 0x721ef6871f1c4efe730dce047d40d1743b886946
🔍 Wallet address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7
📊 Raw balance: 0
💰 Fetched token balance: 0.00 CHZ
💵 Native CHZ balance: 20.0 CHZ (gas) ← Voici vos 20 CHZ !
```

## 📊 Comparaison

| Type | Vous avez | Requis | Status |
|------|-----------|---------|--------|
| **Native CHZ** (gas) | 20.00 ✅ | 0.01 (estimation) | ✅ Suffisant pour gas |
| **CHZ Token** (ERC20) | 0.00 ❌ | 1.00 | ❌ Insuffisant |

## 💡 Message affiché sur l'interface

Quand le balance est 0, vous verrez maintenant :

```
⚠️ Important: Native CHZ ≠ Token CHZ

• You need CHZ tokens (ERC20) to pay, not native CHZ (gas)
• Native CHZ = for gas fees only (you probably have 20 CHZ ✅)

💡 Solution: Deploy MockCHZ and mint tokens
→ See SOLUTION_FINALE_FR.md for instructions
```

## 🚀 Solution : Déployer MockCHZ

Vous avez **2 options** :

### Option A : Utiliser Wrapped CHZ existant (si disponible)
Si Wrapped CHZ à `0x721ef6871f1c4efe730dce047d40d1743b886946` existe et a une fonction `deposit()` :

1. Wrappez vos CHZ natifs en tokens
2. Utilisez ces tokens pour payer

**Problème** : Vous ne contrôlez pas ce contrat, difficile de wrap.

### Option B : Déployer votre MockCHZ ⭐ RECOMMANDÉ

1. **Suivez `SOLUTION_FINALE_FR.md`**
2. Déployez MockCHZ via Remix (5 min)
3. Mintez 100 tokens pour votre wallet
4. Mettez à jour `.env.local`
5. Testez !

## 🧪 Test maintenant

### Étape 1 : Vérifier les logs
1. Ouvrez http://localhost:3000
2. Ouvrez la console (F12)
3. Connectez votre wallet
4. Sur Step 2, vérifiez les logs :

```javascript
💵 Native CHZ balance: 20.0 CHZ (gas) ← Vous devriez voir vos 20 CHZ
💰 Fetched token balance: 0.00 CHZ ← 0 car pas de tokens ERC20
```

### Étape 2 : Déployer MockCHZ
Suivez les instructions dans **`SOLUTION_FINALE_FR.md`**

### Étape 3 : Tester avec les nouveaux tokens
Une fois MockCHZ déployé et minté, vous verrez :

```javascript
💰 Fetched token balance: 100.00 CHZ ← Vos tokens MockCHZ !
💵 Native CHZ balance: 19.98 CHZ (gas) ← Un peu moins (gas utilisé)
```

## 🎯 Récapitulatif des changements

### Fichiers modifiés

1. **`hooks/useChzPayment.ts`**
   - ✅ Import `useCallback` de React
   - ✅ `fetchBalance` wrappe avec `useCallback`
   - ✅ Logs détaillés ajoutés
   - ✅ Affichage du native CHZ balance pour debug

2. **`components/onboarding-flow.tsx`**
   - ✅ Message explicatif Native vs Token CHZ
   - ✅ Lien vers le guide de solution
   - ✅ Design amélioré de l'avertissement

## 📝 Configuration actuelle

Votre `.env.local` utilise :
```env
NEXT_PUBLIC_CHZ_TOKEN_ADDRESS=0x721ef6871f1c4efe730dce047d40d1743b886946
```

C'est probablement un Wrapped CHZ ou un token existant sur le testnet où vous n'avez pas de balance.

### Après déploiement MockCHZ
```env
NEXT_PUBLIC_CHZ_TOKEN_ADDRESS=0xVOTRE_MOCKCHZ_ADDRESS
```

## 🎉 Résultat

### Avant ce fix :
```
❌ Boucle infinie (crash)
❌ Balance 0 sans explication
❌ Confusion sur les 20 CHZ
```

### Après ce fix :
```
✅ Fetch balance 1 seule fois
✅ Balance affiché correctement (0 token)
✅ Native CHZ visible dans les logs (20 CHZ)
✅ Message explicatif clair
✅ Lien vers la solution
```

## 🔍 Pour vérifier votre token actuel

Vous pouvez vérifier si le token à `0x721ef6871f1c4efe730dce047d40d1743b886946` existe :

1. Allez sur https://testnet.chiliscan.com
2. Cherchez l'adresse `0x721ef6871f1c4efe730dce047d40d1743b886946`
3. Vérifiez s'il y a un contrat
4. Vérifiez si vous avez un balance là-bas

**Spoiler** : Vous n'avez probablement pas de tokens à cette adresse, d'où le balance 0.

---

## 🚀 Prochaine étape

**Déployez MockCHZ maintenant !**

Suivez **`SOLUTION_FINALE_FR.md`** → 5 minutes max → Tout fonctionnera ! 🎯

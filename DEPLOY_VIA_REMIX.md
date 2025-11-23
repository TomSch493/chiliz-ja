# 🚀 Déploiement via Remix (Solution simple et qui fonctionne !)

## ❌ Problème Hardhat
```
Error: Cannot read properties of undefined (reading 'name')
```

Ce problème vient d'une incompatibilité dans la configuration Hardhat. 

## ✅ Solution : Utiliser Remix IDE

Remix est un IDE en ligne qui fonctionne parfaitement pour déployer des contrats. **Pas besoin de Hardhat !**

---

## 📝 Étape par étape (5 minutes)

### Étape 1 : Ouvrir Remix (30 secondes)

1. Allez sur **https://remix.ethereum.org**
2. Attendez que l'interface charge

### Étape 2 : Créer le fichier (1 minute)

1. Dans le panneau de gauche, cliquez sur "📁 File Explorer"
2. Cliquez sur l'icône "📄 Create New File"
3. Nommez-le : `NativeChzPaymentSplitter.sol`
4. Copiez tout le contenu de votre fichier local :
   `/Users/ethan/Desktop/chiliz-ja/contracts/NativeChzPaymentSplitter.sol`
5. Collez-le dans Remix

Ou copiez ce code directement :

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title NativeChzPaymentSplitter
 * @dev Accepts fixed NATIVE CHZ payments and splits them between two wallets (80/20)
 */

contract NativeChzPaymentSplitter {
    // State variables
    address public immutable wallet1;
    address public immutable wallet2;
    uint256 public immutable fixedAmount;

    // Events
    event PaymentReceived(address indexed payer, uint256 amount);
    event PaymentSplit(address indexed wallet1, uint256 amount1, address indexed wallet2, uint256 amount2);

    /**
     * @dev Constructor
     * @param _wallet1 Address to receive 80% of payments
     * @param _wallet2 Address to receive 20% of payments
     * @param _fixedAmount Fixed payment amount in CHZ (in wei)
     */
    constructor(
        address _wallet1,
        address _wallet2,
        uint256 _fixedAmount
    ) {
        require(_wallet1 != address(0), "Invalid wallet1 address");
        require(_wallet2 != address(0), "Invalid wallet2 address");
        require(_fixedAmount > 0, "Amount must be greater than 0");

        wallet1 = _wallet1;
        wallet2 = _wallet2;
        fixedAmount = _fixedAmount;
    }

    /**
     * @dev Main payment function - accepts native CHZ
     * Users send exactly fixedAmount of CHZ with this transaction
     */
    function pay() external payable {
        require(msg.value == fixedAmount, "Must send exact fixed amount");

        // Calculate split amounts
        uint256 amount1 = (msg.value * 80) / 100; // 80% to wallet1
        uint256 amount2 = msg.value - amount1;     // 20% to wallet2 (remaining)

        // Transfer to wallets
        (bool success1, ) = wallet1.call{value: amount1}("");
        require(success1, "Transfer to wallet1 failed");

        (bool success2, ) = wallet2.call{value: amount2}("");
        require(success2, "Transfer to wallet2 failed");

        emit PaymentReceived(msg.sender, msg.value);
        emit PaymentSplit(wallet1, amount1, wallet2, amount2);
    }

    /**
     * @dev View function to check required payment amount
     */
    function getRequiredAmount() external view returns (uint256) {
        return fixedAmount;
    }

    /**
     * @dev Prevent accidental ETH/CHZ sends
     */
    receive() external payable {
        revert("Use pay() function instead");
    }

    fallback() external payable {
        revert("Use pay() function instead");
    }
}
```

### Étape 3 : Compiler (1 minute)

1. Dans le panneau de gauche, cliquez sur l'icône **"🔨 Solidity Compiler"**
2. Vérifiez que la version est **0.8.20** (ou proche)
3. Cliquez sur **"Compile NativeChzPaymentSplitter.sol"**
4. Vous devriez voir un ✅ checkmark vert

### Étape 4 : Connecter MetaMask (30 secondes)

1. Ouvrez **MetaMask**
2. Changez le réseau vers **"Chiliz Spicy Testnet"**
   
   Si ce réseau n'existe pas, ajoutez-le :
   - Network Name: `Chiliz Spicy Testnet`
   - RPC URL: `https://spicy-rpc.chiliz.com`
   - Chain ID: `88882`
   - Currency Symbol: `CHZ`
   - Block Explorer: `https://testnet.chiliscan.com`

3. Vérifiez que vous avez du CHZ (vous devriez avoir ~20 CHZ)

### Étape 5 : Déployer le contrat (2 minutes)

1. Dans Remix, cliquez sur l'icône **"🚀 Deploy & Run Transactions"**
2. Dans le menu "Environment", sélectionnez **"Injected Provider - MetaMask"**
3. MetaMask va s'ouvrir → Cliquez **"Connect"**
4. Vérifiez que le contrat sélectionné est **"NativeChzPaymentSplitter"**

5. **Remplissez les paramètres du constructor** :
   
   Juste au-dessus du bouton "Deploy", vous verrez 3 champs :
   
   ```
   _WALLET1: 0x133e676148b785ebf67351ff806162803e3a042e
   _WALLET2: 0x133e676148b785ebf67351ff806162803e3a042f
   _FIXEDAMOUNT: 1000000000000000000
   ```

6. Cliquez sur **"Deploy"** (bouton orange)
7. MetaMask s'ouvre → Vérifiez les détails → Cliquez **"Confirm"**
8. Attendez quelques secondes (confirmation de la transaction)

### Étape 6 : Copier l'adresse du contrat (10 secondes)

1. Une fois déployé, vous verrez le contrat sous **"Deployed Contracts"**
2. Le nom sera : `NATIVECHZPAYMENTSPLITTER AT 0x1234...`
3. **Cliquez sur l'icône "📋 Copy"** à côté de l'adresse
4. L'adresse est copiée ! (ex: `0x1234567890abcdef...`)

---

## ⚙️ Étape 7 : Configuration (1 minute)

### Ouvrir `.env.local`

Sur votre ordinateur, ouvrez :
```
/Users/ethan/Desktop/chiliz-ja/.env.local
```

### Mettre à jour avec la nouvelle adresse

```env
# Nouvelle adresse du contrat (celle que vous venez de copier)
NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=0xVOTRE_ADRESSE_COPIEE_ICI

# Le reste
NEXT_PUBLIC_FIXED_CHZ_AMOUNT=1000000000000000000
NEXT_PUBLIC_CHAIN_RPC_URL=https://spicy-rpc.chiliz.com
NEXT_PUBLIC_CHAIN_ID=88882
```

### Exemple complet
```env
NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
NEXT_PUBLIC_FIXED_CHZ_AMOUNT=1000000000000000000
NEXT_PUBLIC_CHAIN_RPC_URL=https://spicy-rpc.chiliz.com
NEXT_PUBLIC_CHAIN_ID=88882
```

---

## 🔄 Étape 8 : Redémarrer le serveur (10 secondes)

Dans votre terminal :

```bash
# Arrêtez le serveur (Ctrl+C si il tourne)

# Relancez
pnpm dev
```

---

## 🧪 Étape 9 : Tester ! (1 minute)

1. **Ouvrez** http://localhost:3000
2. **Ouvrez la console** (F12)
3. **Connectez votre wallet** (Step 1)
4. **Vérifiez le balance** (Step 2) :
   ```
   💰 Native CHZ balance: 20.00 CHZ
   ✅ Sufficient balance to proceed
   ```
5. **Cliquez** "Pay 1 CHZ (Native)"
6. **Confirmez** dans MetaMask
7. **✅ Success !** Vous êtes redirigé vers `/app`

---

## 🎉 Résultat

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
Après le paiement, votre balance sera :
```
Avant : 20.00 CHZ
Après : ~18.99 CHZ
(1 CHZ payé + ~0.01 CHZ de gas)
```

---

## 🐛 Dépannage

### "Insufficient funds"
- **Vérifiez** que vous avez au moins 1 CHZ dans MetaMask
- Si non, allez sur https://spicy-faucet.chiliz.com

### "Wrong network"
- **Vérifiez** que MetaMask est sur **Chiliz Spicy Testnet**
- Chain ID doit être **88882**

### Le contrat ne se déploie pas
- **Vérifiez** que vous avez du CHZ pour payer le gas
- **Vérifiez** que vous êtes connecté à Remix avec MetaMask
- **Réessayez** la connexion MetaMask dans Remix

### L'adresse ne marche pas dans l'app
- **Vérifiez** que vous avez bien copié l'adresse complète
- **Vérifiez** que `.env.local` est sauvegardé
- **Redémarrez** le serveur (`pnpm dev`)

---

## ✅ Checklist

- [ ] Remix ouvert
- [ ] Fichier créé et code collé
- [ ] Contrat compilé (✅ vert)
- [ ] MetaMask sur Chiliz Spicy Testnet
- [ ] MetaMask connecté à Remix
- [ ] Paramètres du constructor remplis
- [ ] Contrat déployé
- [ ] Adresse copiée
- [ ] `.env.local` mis à jour
- [ ] Serveur redémarré
- [ ] Test réussi ✅

---

## 📸 Captures d'écran utiles

### Remix - Compiler
```
┌─────────────────────────┐
│ Solidity Compiler      │
├─────────────────────────┤
│ Compiler: 0.8.20       │
│                         │
│ [Compile Contract] ✅  │
└─────────────────────────┘
```

### Remix - Deploy
```
┌─────────────────────────────────────┐
│ Deploy & Run Transactions          │
├─────────────────────────────────────┤
│ Environment:                        │
│ [Injected Provider - MetaMask]     │
│                                     │
│ Contract:                           │
│ [NativeChzPaymentSplitter]         │
│                                     │
│ _WALLET1: 0x133e...042e            │
│ _WALLET2: 0x133e...042f            │
│ _FIXEDAMOUNT: 1000000000000000000  │
│                                     │
│ [Deploy] 🟧                         │
└─────────────────────────────────────┘
```

---

## 🎯 Temps total

- **Étape 1-6** : Déploiement via Remix → 5 minutes
- **Étape 7** : Configuration → 1 minute
- **Étape 8** : Redémarrage → 10 secondes
- **Étape 9** : Test → 1 minute

**Total : ~7 minutes**

---

## 💡 Pourquoi Remix au lieu de Hardhat ?

| Aspect | Hardhat | Remix |
|--------|---------|-------|
| Setup | Complexe | ✅ Aucun |
| Erreurs | Fréquentes | ✅ Rares |
| Compatibilité | Dépendances | ✅ Navigateur |
| Temps | 15 min | ✅ 5 min |
| Debugging | Difficile | ✅ Facile |

**Remix = Solution recommandée ! 🎯**

---

**Suivez ce guide et ça va fonctionner ! 🚀**

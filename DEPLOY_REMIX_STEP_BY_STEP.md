# 🚀 DÉPLOIEMENT VIA REMIX - 3 MINUTES

## Étape 1 : Ouvrir Remix
👉 Allez sur : **https://remix.ethereum.org**

## Étape 2 : Créer le fichier
1. Dans le panneau de gauche, cliquez sur **"File Explorer"** (icône de fichier)
2. Cliquez sur **"+"** pour créer un nouveau fichier
3. Nommez-le : **`NativeChzPaymentSplitter.sol`**

## Étape 3 : Copier le code
Copiez TOUT le code ci-dessous dans le fichier :

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NativeChzPaymentSplitter {
    address public immutable wallet1;
    address public immutable wallet2;
    uint256 public immutable fixedAmount;

    event PaymentReceived(address indexed payer, uint256 amount);
    event PaymentSplit(address indexed wallet1, uint256 amount1, address indexed wallet2, uint256 amount2);

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

    function pay() external payable {
        require(msg.value == fixedAmount, "Must send exact fixed amount");

        uint256 amount1 = (msg.value * 80) / 100;
        uint256 amount2 = msg.value - amount1;

        (bool success1, ) = wallet1.call{value: amount1}("");
        require(success1, "Transfer to wallet1 failed");

        (bool success2, ) = wallet2.call{value: amount2}("");
        require(success2, "Transfer to wallet2 failed");

        emit PaymentReceived(msg.sender, msg.value);
        emit PaymentSplit(wallet1, amount1, wallet2, amount2);
    }

    function getRequiredAmount() external view returns (uint256) {
        return fixedAmount;
    }

    receive() external payable {
        revert("Use pay() function instead");
    }

    fallback() external payable {
        revert("Use pay() function instead");
    }
}
```

## Étape 4 : Compiler
1. Cliquez sur l'icône **"Solidity Compiler"** (à gauche, 2ème icône)
2. Sélectionnez la version : **`0.8.20+commit...`**
3. Cliquez sur le gros bouton bleu **"Compile NativeChzPaymentSplitter.sol"**
4. Vous devriez voir une ✅ coche verte !

## Étape 5 : Connecter MetaMask
1. Cliquez sur l'icône **"Deploy & Run Transactions"** (3ème icône, fusée)
2. Dans **"ENVIRONMENT"**, sélectionnez : **`Injected Provider - MetaMask`**
3. MetaMask va s'ouvrir → Cliquez **"Next"** puis **"Connect"**
4. Vérifiez que vous êtes sur **"Chiliz Spicy Testnet"** dans MetaMask
5. Vous devriez voir votre adresse et votre balance (~20 CHZ)

## Étape 6 : Configurer le déploiement
Dans la section **"Deploy"**, remplissez les paramètres :

```
CONTRACT: NativeChzPaymentSplitter

Paramètres du constructor (dans l'ordre) :

_WALLET1: 0x133e676148b785ebf67351ff806162803e3a042e

_WALLET2: 0x133e676148b785ebf67351ff806162803e3a042f

_FIXEDAMOUNT: 1000000000000000000
```

⚠️ **Important** : Copiez ces valeurs EXACTEMENT (sans espace, sans guillemets)

## Étape 7 : Déployer ! 🚀
1. Cliquez sur le bouton orange **"Deploy"**
2. MetaMask s'ouvre → Vérifiez la transaction
3. Cliquez **"Confirm"**
4. Attendez 5-10 secondes...
5. ✅ **Deployed Contracts** apparaît en bas !

## Étape 8 : Copier l'adresse du contrat
1. Sous **"Deployed Contracts"**, vous verrez votre contrat
2. Cliquez sur l'icône **"Copy"** (📋) à côté de l'adresse
3. L'adresse ressemble à : `0x1234567890abcdef...`

## Étape 9 : Mettre à jour .env.local

Sur votre ordinateur, ouvrez le fichier `.env.local` et modifiez :

```env
NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=0xCOLLEZ_ICI_LADRESSE_COPIEE

NEXT_PUBLIC_FIXED_CHZ_AMOUNT=1000000000000000000
NEXT_PUBLIC_CHAIN_RPC_URL=https://spicy-rpc.chiliz.com
NEXT_PUBLIC_CHAIN_ID=88882
```

## Étape 10 : Redémarrer le serveur

Dans votre terminal :
```bash
# Arrêtez le serveur (Ctrl+C)
pnpm dev
```

## Étape 11 : TESTER ! 🎉

1. Allez sur **http://localhost:3000**
2. Ouvrez la console (F12)
3. Connectez votre wallet
4. Sur Step 2, vous devriez voir :
   ```
   💰 Native CHZ balance: 20.00 CHZ
   ✅ Sufficient balance to proceed
   ```
5. Cliquez **"Pay 1 CHZ (Native)"**
6. Confirmez dans MetaMask
7. ✅ **SUCCESS !**

---

## 🎊 Félicitations !

Vous avez déployé le contrat et votre app fonctionne maintenant avec le CHZ natif ! 🎉

**Temps total : 3 minutes** ⏱️

Vos 20 CHZ testnet sont enfin utilisables ! 💰

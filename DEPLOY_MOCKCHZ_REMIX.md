# 🚀 Déploiement rapide de MockCHZ via Remix

## ❌ Problème actuel
Vous essayez d'utiliser l'adresse `0x721ef6871f1c4efe730dce047d40d1743b886946` (Wrapped CHZ sur testnet) mais vous n'avez pas de tokens là-bas. Vous devez déployer votre propre MockCHZ.

## ✅ Solution rapide : Déployer via Remix IDE

### Étape 1 : Aller sur Remix
1. Ouvrez https://remix.ethereum.org
2. Créez un nouveau fichier : `MockCHZ.sol`

### Étape 2 : Copier le contrat
Copiez tout le contenu de `/Users/ethan/Desktop/chiliz-ja/contracts/MockCHZ.sol` dans Remix.

Ou utilisez cette version simplifiée :

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockCHZ {
    string public name = "Mock CHZ Token";
    string public symbol = "MCHZ";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        uint256 initialSupply = 1000000 * 10**decimals;
        balanceOf[msg.sender] = initialSupply;
        totalSupply = initialSupply;
    }

    function mint(uint256 amount) external {
        balanceOf[msg.sender] += amount;
        totalSupply += amount;
        emit Transfer(address(0), msg.sender, amount);
    }

    function mintTo(address to, uint256 amount) external {
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
        
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        
        emit Transfer(from, to, amount);
        return true;
    }
}
```

### Étape 3 : Compiler
1. Cliquez sur l'onglet "Solidity Compiler" (à gauche)
2. Sélectionnez la version `0.8.20`
3. Cliquez sur **"Compile MockCHZ.sol"**
4. ✅ Vous devriez voir un checkmark vert

### Étape 4 : Connecter MetaMask au testnet
1. Ouvrez MetaMask
2. Sélectionnez **"Chiliz Spicy Testnet"**
   - Si pas configuré, ajoutez-le :
     - Network Name: `Chiliz Spicy Testnet`
     - RPC URL: `https://spicy-rpc.chiliz.com`
     - Chain ID: `88882`
     - Currency Symbol: `CHZ`

### Étape 5 : Déployer
1. Dans Remix, allez à l'onglet **"Deploy & Run Transactions"**
2. Changez l'environnement en **"Injected Provider - MetaMask"**
3. Vérifiez que MetaMask est connecté au **Chiliz Spicy Testnet**
4. Vérifiez que le contrat sélectionné est **"MockCHZ"**
5. Cliquez sur **"Deploy"**
6. Confirmez la transaction dans MetaMask
7. ✅ Attendez la confirmation

### Étape 6 : Copier l'adresse du contrat
1. Une fois déployé, vous verrez le contrat sous "Deployed Contracts"
2. **Copiez l'adresse** (elle ressemble à `0x1234...`)

### Étape 7 : Minter des tokens pour vous
1. Dans Remix, sous "Deployed Contracts", développez votre contrat MockCHZ
2. Trouvez la fonction `mint`
3. Entrez : `100000000000000000000` (= 100 tokens)
4. Cliquez sur **"transact"**
5. Confirmez dans MetaMask
6. ✅ Vous avez maintenant 100 MCHZ !

### Étape 8 : Mettre à jour .env.local
Sur votre ordinateur, ouvrez `.env.local` et mettez à jour :

```env
NEXT_PUBLIC_CHZ_TOKEN_ADDRESS=0xVOTRE_ADRESSE_MOCKCHZ_ICI
NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=0x02278441aa8acf07E9c1aEa074d3A36E1Dd4F4FD
NEXT_PUBLIC_FIXED_CHZ_AMOUNT=1000000000000000000
NEXT_PUBLIC_CHAIN_RPC_URL=https://spicy-rpc.chiliz.com
NEXT_PUBLIC_CHAIN_ID=88882
```

### Étape 9 : Redéployer le PaymentSplitter
Le contrat de paiement doit aussi être mis à jour pour utiliser la nouvelle adresse MockCHZ.

**Dans Remix :**
1. Ouvrez le fichier `ChzPaymentSplitter.sol`
2. Compilez-le
3. Dans "Deploy", entrez les paramètres du constructor :
   - `_chzToken`: `0xVOTRE_ADRESSE_MOCKCHZ`
   - `_wallet1`: `0x133e676148b785ebf67351ff806162803e3a042e`
   - `_wallet2`: `0x133e676148b785ebf67351ff806162803e3a042f`
   - `_fixedAmount`: `1000000000000000000`
4. Déployez
5. Copiez la nouvelle adresse du PaymentSplitter
6. Mettez à jour `NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS` dans `.env.local`

### Étape 10 : Redémarrer l'application
```bash
# Arrêtez le serveur (Ctrl+C) puis :
pnpm dev
```

### Étape 11 : Tester !
1. Allez sur http://localhost:3000
2. Ouvrez la console (F12)
3. Connectez votre wallet
4. Essayez de payer
5. Cette fois, vous devriez voir :
   ```
   💰 CHZ Token balance: 100000000000000000000 (100 CHZ)
   ```

## 🎯 Résumé des adresses à mettre à jour

Dans `.env.local` :
```env
NEXT_PUBLIC_CHZ_TOKEN_ADDRESS=0x...  # ← Adresse MockCHZ de Remix
NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=0x...  # ← Adresse PaymentSplitter de Remix
```

## 🐛 Alternative : Déploiement en ligne de commande

Si vous voulez quand même essayer via la ligne de commande, vous pouvez utiliser `cast` de Foundry :

```bash
# Installer Foundry (si pas déjà fait)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Déployer MockCHZ
cast send --rpc-url https://spicy-rpc.chiliz.com \
  --private-key VOTRE_PRIVATE_KEY \
  --create \
  $(cat contracts/MockCHZ.sol | solc --bin - | tail -1)
```

Mais **Remix est plus simple** pour commencer ! 😊

---

**Une fois MockCHZ déployé et configuré, vos paiements devraient fonctionner ! 🎉**

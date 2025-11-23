# 🚨 SOLUTION IMMÉDIATE : Déployer MockCHZ

## Problème
Votre contrat de paiement `0x02278441aa8acf07E9c1aEa074d3A36E1Dd4F4FD` est bien sur le testnet, MAIS il pointe vers un token CHZ à l'adresse `0x721ef6871f1c4efe730dce047d40d1743b886946` qui n'a pas de tokens disponibles.

## Solution en 5 minutes

### Étape 1 : Déployer MockCHZ (2 min)

1. **Ouvrez Remix** : https://remix.ethereum.org/

2. **Créez un nouveau fichier** : Cliquez sur l'icône "+" → Nommez-le `MockCHZ.sol`

3. **Collez ce code** :

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockCHZ {
    string public name = "Mock CHZ";
    string public symbol = "MCHZ";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor() {
        _mint(msg.sender, 1000000 * 10**18);
    }
    
    function gimme() external {
        _mint(msg.sender, 1000 * 10**18);
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount);
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
        require(balanceOf[from] >= amount);
        require(allowance[from][msg.sender] >= amount);
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        emit Transfer(from, to, amount);
        return true;
    }
    
    function _mint(address to, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }
}
\`\`\`

4. **Compilez** :
   - Onglet "Solidity Compiler" (à gauche)
   - Compiler version : `0.8.20+`
   - Cliquez "Compile MockCHZ.sol"

5. **Déployez** :
   - Onglet "Deploy & Run Transactions"
   - Environment : **"Injected Provider - MetaMask"**
   - ⚠️ **VÉRIFIEZ que MetaMask affiche "Chiliz Spicy Testnet"**
   - Contract : `MockCHZ`
   - Cliquez **"Deploy"**
   - Confirmez dans MetaMask

6. **Obtenez des tokens** :
   - Dans "Deployed Contracts", trouvez votre contrat MockCHZ
   - Cliquez sur le bouton **"gimme"** (bouton orange)
   - Confirmez dans MetaMask
   - ✅ Vous avez maintenant 1000 MCHZ !

7. **📋 COPIEZ L'ADRESSE DU CONTRAT MockCHZ**

---

### Étape 2 : Re-déployer le Payment Contract (2 min)

Votre contrat actuel pointe vers le mauvais token. Il faut le redéployer :

1. **Dans Remix**, créez `ChzPaymentSplitter.sol`

2. **Collez le code de votre contrat** (ou celui-ci simplifié) :

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract ChzPaymentSplitter {
    IERC20 public immutable chzToken;
    address public immutable wallet1;
    address public immutable wallet2;
    uint256 public immutable fixedAmount;
    
    event PaymentDone(address indexed payer, uint256 amount);
    event PaymentSplit(address indexed wallet1, uint256 amount1, address indexed wallet2, uint256 amount2);
    
    constructor(address _chzToken, address _wallet1, address _wallet2, uint256 _fixedAmount) {
        require(_chzToken != address(0), "Invalid CHZ token address");
        require(_wallet1 != address(0), "Invalid wallet1 address");
        require(_wallet2 != address(0), "Invalid wallet2 address");
        require(_fixedAmount > 0, "Fixed amount must be greater than 0");
        
        chzToken = IERC20(_chzToken);
        wallet1 = _wallet1;
        wallet2 = _wallet2;
        fixedAmount = _fixedAmount;
    }
    
    function pay() external {
        uint256 currentAllowance = chzToken.allowance(msg.sender, address(this));
        require(currentAllowance >= fixedAmount, "Insufficient allowance");
        
        uint256 balance = chzToken.balanceOf(msg.sender);
        require(balance >= fixedAmount, "Insufficient CHZ balance");
        
        uint256 toWallet1 = (fixedAmount * 80) / 100;
        uint256 toWallet2 = fixedAmount - toWallet1;
        
        require(chzToken.transferFrom(msg.sender, wallet1, toWallet1), "Transfer to wallet1 failed");
        require(chzToken.transferFrom(msg.sender, wallet2, toWallet2), "Transfer to wallet2 failed");
        
        emit PaymentDone(msg.sender, fixedAmount);
        emit PaymentSplit(wallet1, toWallet1, wallet2, toWallet2);
    }
}
\`\`\`

3. **Compilez** le contrat

4. **Déployez avec ces paramètres** :
   - `_chzToken` : **[VOTRE ADRESSE MockCHZ]** ← L'adresse que vous venez de copier !
   - `_wallet1` : `0x133e676148b785ebf67351ff806162803e3a042e`
   - `_wallet2` : `0x133e676148b785ebf67351ff806162803e3a042f`
   - `_fixedAmount` : `1000000000000000000`

5. **Cliquez "transact"** et confirmez dans MetaMask

6. **📋 COPIEZ LA NOUVELLE ADRESSE DU PAYMENT CONTRACT**

---

### Étape 3 : Mettre à jour .env.local (30 secondes)

Ouvrez `.env.local` et remplacez les adresses :

\`\`\`bash
NEXT_PUBLIC_CHAIN_RPC_URL=https://spicy-rpc.chiliz.com
NEXT_PUBLIC_CHAIN_ID=88882
NEXT_PUBLIC_CHZ_TOKEN_ADDRESS=[VOTRE_ADRESSE_MOCKCHZ]
NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=[VOTRE_NOUVELLE_ADRESSE_PAYMENT]
NEXT_PUBLIC_FIXED_CHZ_AMOUNT=1000000000000000000
\`\`\`

Et dans `.env` :

\`\`\`bash
CHAIN_RPC_URL="https://spicy-rpc.chiliz.com"
CHZ_TOKEN_ADDRESS="[VOTRE_ADRESSE_MOCKCHZ]"
PAYMENT_CONTRACT_ADDRESS="[VOTRE_NOUVELLE_ADRESSE_PAYMENT]"
\`\`\`

---

### Étape 4 : Redémarrer l'app (10 secondes)

\`\`\`bash
# Dans le terminal, Ctrl+C pour arrêter
# Puis relancer :
pnpm dev
\`\`\`

---

### Étape 5 : TESTER ! 🎉

1. Ouvrez http://localhost:3000
2. ⚠️ **Vérifiez que MetaMask est sur "Chiliz Spicy Testnet"**
3. Connectez votre wallet
4. Cliquez "Pay 1 CHZ"
5. Approuvez (transaction 1)
6. Payez (transaction 2)
7. ✅ **SUCCESS !**

---

## Vérification avant de tester

Dans la console de votre navigateur (F12), vérifiez vos tokens :

\`\`\`javascript
// Remplacez par VOTRE adresse MockCHZ
const mockChzAddress = "VOTRE_ADRESSE_ICI"
const provider = new ethers.BrowserProvider(window.ethereum)
const mockChz = new ethers.Contract(
  mockChzAddress,
  ['function balanceOf(address) view returns (uint256)'],
  provider
)
const balance = await mockChz.balanceOf("VOTRE_WALLET")
console.log("Balance MCHZ:", ethers.formatEther(balance))
// Devrait afficher : "Balance MCHZ: 1000.0"
\`\`\`

---

## Pourquoi ça ne marchait pas ?

L'ancien token à l'adresse `0x721ef6871f1c4efe730dce047d40d1743b886946` :
- ❌ N'existe peut-être pas sur le testnet
- ❌ Ou vous n'avez aucun token de cette adresse
- ❌ Impossible de vous en donner gratuitement

Avec MockCHZ :
- ✅ Vous le déployez vous-même
- ✅ Vous contrôlez 100% des tokens
- ✅ Fonction `gimme()` pour obtenir autant de tokens que vous voulez
- ✅ Parfait pour les tests

---

## Résumé rapide

1. ✅ Déployer MockCHZ → Appeler `gimme()` → Copier adresse
2. ✅ Déployer ChzPaymentSplitter avec adresse MockCHZ → Copier adresse
3. ✅ Mettre à jour `.env.local` avec les 2 nouvelles adresses
4. ✅ Redémarrer : `pnpm dev`
5. ✅ Tester le paiement !

**Temps total : ~5 minutes** ⏱️

---

## Besoin de plus de tokens ?

À tout moment, dans Remix, sur votre contrat MockCHZ déployé, cliquez simplement sur **"gimme"** pour obtenir 1000 tokens supplémentaires !

---

**C'est parti ! 🚀**

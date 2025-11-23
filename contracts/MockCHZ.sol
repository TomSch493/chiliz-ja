// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MockCHZ
 * @dev Mock CHZ token for testing on Chiliz Spicy Testnet
 * Anyone can mint tokens for testing purposes
 * @custom:dev-run-script scripts/deploy-mock.ts
 */

contract MockCHZ {
    string public name = "Mock CHZ Token";
    string public symbol = "MCHZ";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 amount);

    /**
     * @dev Constructor mints initial supply to deployer
     */
    constructor() {
        uint256 initialSupply = 1000000 * 10**decimals; // 1 million tokens
        _mint(msg.sender, initialSupply);
    }

    /**
     * @dev Anyone can mint test tokens
     * @param amount Amount to mint (in wei units)
     */
    function mint(uint256 amount) external {
        _mint(msg.sender, amount);
    }

    /**
     * @dev Mint tokens to a specific address (for testing)
     * @param to Recipient address
     * @param amount Amount to mint
     */
    function mintTo(address to, uint256 amount) external {
        _mint(to, amount);
    }

    /**
     * @dev Transfer tokens
     */
    function transfer(address to, uint256 amount) external returns (bool) {
        require(to != address(0), "Transfer to zero address");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;

        emit Transfer(msg.sender, to, amount);
        return true;
    }

    /**
     * @dev Approve spending
     */
    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    /**
     * @dev Transfer from (for approved spending)
     */
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(to != address(0), "Transfer to zero address");
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");

        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;

        emit Transfer(from, to, amount);
        return true;
    }

    /**
     * @dev Internal mint function
     */
    function _mint(address to, uint256 amount) internal {
        require(to != address(0), "Mint to zero address");
        
        totalSupply += amount;
        balanceOf[to] += amount;

        emit Mint(to, amount);
        emit Transfer(address(0), to, amount);
    }

    /**
     * @dev Helper: Give yourself 1000 test tokens
     */
    function gimme() external {
        _mint(msg.sender, 1000 * 10**decimals);
    }
}

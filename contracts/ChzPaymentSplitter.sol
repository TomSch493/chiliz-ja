// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ChzPaymentSplitter
 * @dev Accepts fixed CHZ token payments and splits them between two wallets (80/20)
 * @custom:dev-run-script scripts/deploy.ts
 */

// Minimal ERC20 interface
interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract ChzPaymentSplitter {
    // State variables
    IERC20 public immutable chzToken;
    address public immutable wallet1;
    address public immutable wallet2;
    uint256 public immutable fixedAmount;

    // Events
    event PaymentDone(address indexed payer, uint256 amount);
    event PaymentSplit(address indexed wallet1, uint256 amount1, address indexed wallet2, uint256 amount2);

    /**
     * @dev Constructor
     * @param _chzToken Address of the CHZ token contract
     * @param _wallet1 Address to receive 80% of payments
     * @param _wallet2 Address to receive 20% of payments
     * @param _fixedAmount Fixed payment amount in CHZ smallest unit
     */
    constructor(
        address _chzToken,
        address _wallet1,
        address _wallet2,
        uint256 _fixedAmount
    ) {
        require(_chzToken != address(0), "Invalid CHZ token address");
        require(_wallet1 != address(0), "Invalid wallet1 address");
        require(_wallet2 != address(0), "Invalid wallet2 address");
        require(_fixedAmount > 0, "Fixed amount must be greater than 0");

        chzToken = IERC20(_chzToken);
        wallet1 = _wallet1;
        wallet2 = _wallet2;
        fixedAmount = _fixedAmount;
    }

    /**
     * @dev Pay the fixed amount of CHZ tokens
     * Requires prior approval of fixedAmount to this contract
     * Splits payment: 80% to wallet1, 20% to wallet2
     */
    function pay() external {
        // Check allowance
        uint256 currentAllowance = chzToken.allowance(msg.sender, address(this));
        require(currentAllowance >= fixedAmount, "Insufficient allowance - please approve tokens first");

        // Check balance
        uint256 balance = chzToken.balanceOf(msg.sender);
        require(balance >= fixedAmount, "Insufficient CHZ balance");

        // Calculate split amounts
        uint256 toWallet1 = (fixedAmount * 80) / 100;
        uint256 toWallet2 = fixedAmount - toWallet1; // Remaining goes to wallet2 (handles rounding)

        // Transfer to wallet1 (80%)
        bool success1 = chzToken.transferFrom(msg.sender, wallet1, toWallet1);
        require(success1, "Transfer to wallet1 failed");

        // Transfer to wallet2 (20%)
        bool success2 = chzToken.transferFrom(msg.sender, wallet2, toWallet2);
        require(success2, "Transfer to wallet2 failed");

        // Emit events
        emit PaymentDone(msg.sender, fixedAmount);
        emit PaymentSplit(wallet1, toWallet1, wallet2, toWallet2);
    }

    /**
     * @dev View function to get payment details
     */
    function getPaymentDetails() external view returns (
        address tokenAddress,
        address recipient1,
        address recipient2,
        uint256 amount,
        uint256 amount1,
        uint256 amount2
    ) {
        uint256 toWallet1 = (fixedAmount * 80) / 100;
        uint256 toWallet2 = fixedAmount - toWallet1;

        return (
            address(chzToken),
            wallet1,
            wallet2,
            fixedAmount,
            toWallet1,
            toWallet2
        );
    }
}

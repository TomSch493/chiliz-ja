// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title NativeChzPaymentSplitter
 * @dev Accepts fixed NATIVE CHZ payments and splits them between two wallets (80/20)
 * @custom:dev-run-script scripts/deploy-native.ts
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

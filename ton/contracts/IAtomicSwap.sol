pragma solidity>=0.6.0;

/**
 * @title      Interface for Hashed Timelock Smart Contract for Atomic Swap
 */
interface IAtomicSwap {

    /**
     * @dev        redeem Atomic Swap by participant before time lock. Emit Redeemed event 
     *             to reveal secret for initiator. Destruct contract after execution.
     * @param      secret  The secret
     */
    function redeem(bytes secret) external;

    /**
     * @dev        refund Atomic Swap by initiator after time lock. Destruct contract after 
     *             execution.
     */
    function refund() external;
}

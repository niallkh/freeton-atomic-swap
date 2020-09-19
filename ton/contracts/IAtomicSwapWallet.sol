pragma solidity>=0.6.0;

interface IAtomicSwapWallet {
    
    /**
     * @dev        factory method for creating Atomic Swap
     * @param      initiator    The initiator, can be the same address as wallet
     * @param      participant  The participant, destination address
     * @param      amount       The amount nanoton
     * @param      timeLock     The time lock secs, utc
     * @param      data         The data, init_data for Atomic Swap, must contain secretHash
     */
    function createSwap(
        address initiator, 
        address participant, 
        uint128 amount,
        uint32 timeLock,
        TvmCell data
    ) external returns (address, TvmCell);
}

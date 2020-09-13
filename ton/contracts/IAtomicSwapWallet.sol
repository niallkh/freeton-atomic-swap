pragma solidity>=0.6.0;

interface IAtomicSwapWallet {
    
    function createSwap(
        address initiator, 
        address participant, 
        uint128 amount,
        uint32 timeLock,
        TvmCell data
    ) external returns (address);
}

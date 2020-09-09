pragma solidity>=0.6.0;

abstract contract IAtomicSwapWallet {
    
    function onRedeem(uint256 secretHash) external virtual;

    function onRefund(uint256 secretHash) external virtual;

    function onInitiate(uint256 secretHash) external virtual;

    function onParticipate(uint256 secretHash) external virtual;
}

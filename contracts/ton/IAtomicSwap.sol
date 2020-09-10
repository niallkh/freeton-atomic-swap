pragma solidity>=0.6.0;

abstract contract IAtomicSwap {

    function redeem(uint256 secret) external virtual;

    function refund() external virtual;

    function destruct() external virtual;
}

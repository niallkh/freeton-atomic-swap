pragma solidity>=0.6.0;

interface IAtomicSwap {

    function redeem(bytes secret) external;

    function refund() external;
}

pragma solidity>=0.6.0;
pragma AbiHeader time;
pragma AbiHeader expire;

import "AtomicSwap.sol";

contract AtomicSwapWallet {

    TvmCell atomicSwapContract;

    modifier onlyOwnerAndAccept() {
        require(msg.pubkey() == tvm.pubkey());
        tvm.accept();
        _;
    }
    
    constructor() public {
        require(tvm.pubkey() != 0);
        tvm.accept();
    }

    function createSwap(
        address participant, 
        uint128 amount,
        uint256 time, 
        uint256 secret_hash
    ) public onlyOwnerAndAccept returns (address) {
        require(address(this).balance >= amount, 400);
                
        address atomicSwap = new AtomicSwap {stateInit: atomicSwapContract,value: amount} (
            participant, 
            amount,
            time, 
            secret_hash
        );
        
        return atomicSwap;
    }
}

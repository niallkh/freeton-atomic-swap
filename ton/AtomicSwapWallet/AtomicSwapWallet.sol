pragma solidity>=0.6.0;
pragma AbiHeader time;
pragma AbiHeader expire;

import "../AtomicSwap/AtomicSwap.sol";


/**
 * @title      { title }
 */
contract AtomicSwapWallet {

    TvmCell codeAtomicSwap;

    address[] atomicSwaps;

    modifier onlyOwnerAndAccept() {
        require(msg.pubkey() == tvm.pubkey());
        tvm.accept();
        _;
    }
    
    constructor() public {
        require(tvm.pubkey() != 0);
        tvm.accept();
    }

    /**
     * @dev        {developper_note }
     * @param      participant  The participant
     * @param      amount       The amount
     * @param      time         The time
     * @param      data         The data
     */
    function createSwap(
        address participant, 
        uint128 amount,
        uint256 time, 
        TvmCell data
    ) public onlyOwnerAndAccept returns (address) {
        require(address(this).balance >= amount, 400);

        TvmCell atomicSwapStateInit = tvm.buildStateInit(codeAtomicSwap, data);
                
        address atomicSwap = new AtomicSwap {
            stateInit: atomicSwapStateInit,
            value: amount
        } (
            participant, 
            amount,
            time
        );

        atomicSwaps.push(atomicSwap);
        
        return atomicSwap;
    }


    /**
     * @dev        {developper_note }
     */
    function getAtomicSwaps() public view returns (address[]) {
        return atomicSwaps;
    }
}

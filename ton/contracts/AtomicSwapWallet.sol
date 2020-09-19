pragma solidity >=0.6.0;
pragma AbiHeader time;
pragma AbiHeader expire;


import "IAtomicSwap.sol";
import "IAtomicSwapWallet.sol";
import "IAccept.sol";
import "AtomicSwap.sol";
import "AtomicSwapLib.sol";


/**
 * @title      Wallet with Atomic Swap factory, can be used as personal wallet.
 */
contract AtomicSwapWallet is IAccept, IAtomicSwapWallet {

    TvmCell codeAtomicSwap;

    /**
     * @dev        constructor of Atomic Swap Wallet
     * @param      _codeAtomicSwap  The code of Atomic Swap
     */
    constructor(TvmCell _codeAtomicSwap) public {
        tvm.accept();
        codeAtomicSwap = _codeAtomicSwap;
    }

    event TransferAccepted(bytes payload);


    /**
     * @dev        method for sending transactions
     * @param      dest     The destination
     * @param      value    The value
     * @param      bounce   The bounce
     * @param      flag     The flag
     * @param      payload  The payload
     */
    function sendTransaction(
        address dest,
        uint128 value,
        bool bounce,
        uint8 flag,
        TvmCell payload
    ) external {
        require(msg.pubkey() == tvm.pubkey(), Errors.CALLER_MUST_BE_OWNER);
        tvm.accept();
        dest.transfer(value, bounce, flag, payload);
    }


    /**
     * @dev        accept transfer and emit payload
     * @param      payload  The payload
     */
    function acceptTransfer(bytes payload) external override {
        emit TransferAccepted(payload);
    }

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
    ) external override returns (address, TvmCell) {
        require(msg.pubkey() == tvm.pubkey(), Errors.CALLER_MUST_BE_OWNER);
        tvm.accept();
        require(address(this).balance >= amount + Fees.ATOMIC_SWAP_CREATE, Errors.BALANCE_INSUFFICIENT);
        require(timeLock > now && timeLock < now + Time.MAX_TIME_LOCK, Errors.TIME_LOCK_INVALID);

        TvmCell atomicSwapStateInit = tvm.buildStateInit(codeAtomicSwap, data);
                
        address atomicSwap = new AtomicSwap {
            stateInit: atomicSwapStateInit,
            value: amount + Fees.ATOMIC_SWAP_CREATE,
            flag: 1
        } (
            initiator,
            participant, 
            amount,
            timeLock
        );
        
        return (atomicSwap, data);
    }

    /**
     * @dev        helper method to check hash function result, run only local
     * @param      secret  The secret
     */
    function hashSecret(bytes secret) public pure returns (uint256) {
        return uint256(sha256(secret));
    }
}
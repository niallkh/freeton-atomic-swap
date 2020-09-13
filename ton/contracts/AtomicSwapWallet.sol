pragma solidity >=0.6.0;
pragma AbiHeader time;
pragma AbiHeader expire;


import "IAtomicSwap.sol";
import "IAtomicSwapWallet.sol";
import "IAccept.sol";
import "AtomicSwap.sol";
import "AtomicSwapLib.sol";

contract AtomicSwapWallet is IAccept, IAtomicSwapWallet {

    TvmCell codeAtomicSwap;

    constructor(TvmCell _codeAtomicSwap) public {
        tvm.accept();
        codeAtomicSwap = _codeAtomicSwap;
    }

    event TransferAccepted(bytes payload);

    function sendTransaction(
        address dest,
        uint128 value,
        bool bounce,
        uint8 flags,
        TvmCell payload
    ) external {
        require(msg.pubkey() == tvm.pubkey(), Errors.CALLER_MUST_BE_OWNER);
        tvm.accept();
        dest.transfer(value, bounce, flags, payload);
    }

    function acceptTransfer(bytes payload) external override {
        emit TransferAccepted(payload);
        msg.sender.transfer(0, true, 64);      
    }

    function createSwap(
        address initiator, 
        address participant, 
        uint128 amount,
        uint32 timeLock,
        TvmCell data
    ) external override returns (address) {
        require(msg.pubkey() == tvm.pubkey() || !msg.sender.isNone(), Errors.CALLER_MUST_BE_OWNER_OR_CONTRACT);
        require(!initiator.isNone(), Errors.ADDRESS_IS_NONE);
        require(!participant.isNone(), Errors.ADDRESS_IS_NONE);
        require(timeLock > now && timeLock < now + Time.MAX_TIME_LOCK, Errors.TIME_LOCK_INVALID);

        if (msg.sender.isNone()) {
            require(address(this).balance >= amount + Fees.ATOMIC_SWAP_CREATE, Errors.BALANCE_INSUFFICIENT);
        } else {
            require(msg.value >= amount + Fees.ATOMIC_SWAP_CREATE, Errors.BALANCE_INSUFFICIENT);
        }

        TvmCell atomicSwapStateInit = tvm.buildStateInit(codeAtomicSwap, data);
                
        address atomicSwap = new AtomicSwap {
            stateInit: atomicSwapStateInit,
            value: amount + 1_000_000_000,
            flag: 1
        } (
            initiator,
            participant, 
            amount,
            timeLock
        );
        
        return atomicSwap;
    }
}
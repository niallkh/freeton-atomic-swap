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
        uint8 flag,
        TvmCell payload
    ) external {
        require(msg.pubkey() == tvm.pubkey(), Errors.CALLER_MUST_BE_OWNER);
        tvm.accept();
        dest.transfer(value, bounce, flag, payload);
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
        if (msg.pubkey() == tvm.pubkey()) {
            tvm.accept();
            require(address(this).balance >= amount + Fees.ATOMIC_SWAP_CREATE, Errors.BALANCE_INSUFFICIENT);
        } else if (msg.sender != address(0)) {
            require(msg.value >= amount + Fees.ATOMIC_SWAP_CREATE, Errors.BALANCE_INSUFFICIENT);
        } else {
            revert(Errors.CALLER_MUST_BE_OWNER_OR_CONTRACT);
        }
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
        
        return atomicSwap;
    }

    function hashSecret(bytes secret) public pure returns (uint256) {
        return uint256(sha256(secret));
    }
}
pragma solidity>=0.6.0;
pragma AbiHeader time;
pragma AbiHeader expire;

import "IAtomicSwap.sol";
import "IAtomicSwapWallet.sol";
import "AtomicSwap.sol";

contract AtomicSwapWallet is IAtomicSwapWallet {

    TvmCell codeAtomicSwap;

    mapping(uint256 => address) initiatorAtomicSwaps;
    mapping(uint256 => address) participantAtomicSwaps;

    event OnParticipate(uint256 secretHash, address atomicSwap);
    event OnInitiate(uint256 secretHash, address atomicSwap);
    event OnRedeemed(uint256 secretHash, uint256 amount);
    event OnRefunded(uint256 secretHash, uint256 amount);
    
    event Error(uint32 code);

    modifier onlyOwnerAndAccept() {
        require(msg.pubkey() == tvm.pubkey());
        tvm.accept();
        _;
    }
    
    constructor(TvmCell _codeAtomicSwap) public {
        require(tvm.pubkey() != 0);
        tvm.accept();
        codeAtomicSwap = _codeAtomicSwap;
    }

    function createSwap(
        address participant, 
        uint128 amount,
        uint32 time,
        TvmCell data
    ) external onlyOwnerAndAccept returns (address) {
        require(!participant.isNone(), 400);
        require(address(this) != participant, 401);
        require(time > 0, 402);
        require(address(this).balance >= amount + 1_000_000_000, 404); // additional ton for fees

        TvmCell atomicSwapStateInit = tvm.buildStateInit(codeAtomicSwap, data);
                
        address atomicSwap = new AtomicSwap {
            stateInit: atomicSwapStateInit,
            value: amount + 1_000_000_000,
            flag: 1
        } (
            participant, 
            amount,
            time
        );
        
        return atomicSwap;
    }

    function onInitiate(uint256 secretHash) public override {
        msg.sender.transfer(0, false, 64);
        initiatorAtomicSwaps[secretHash] = msg.sender;
        emit OnInitiate(secretHash, msg.sender);
    }

    function onParticipate(uint256 secretHash) public override {
        msg.sender.transfer(0, false, 64);
        participantAtomicSwaps[secretHash] = msg.sender;
        emit OnParticipate(secretHash, msg.sender);
    }

    function redeem(bytes secret) external onlyOwnerAndAccept { // FIXME
        uint256 secretHash = hashSecret(secret);
        optional(address) atomicSwap = participantAtomicSwaps.fetch(secretHash);
        require(atomicSwap.hasValue(), 406);

        IAtomicSwap(atomicSwap.get()).redeem { value: 100_000_000, bounce: true, flag: 1 } (secret);
    }

    function refund(uint256 secretHash) external onlyOwnerAndAccept {
        optional(address) atomicSwap = initiatorAtomicSwaps.fetch(secretHash);
        require(atomicSwap.hasValue(), 407);
        IAtomicSwap(atomicSwap.get()).refund { value: 100_000_000, bounce: true, flag: 1 } ();
    }

    function destruct(uint256 secretHash) public onlyOwnerAndAccept {
        optional(address) atomicSwap = initiatorAtomicSwaps.fetch(secretHash);
        require(atomicSwap.hasValue(), 407);
        delete initiatorAtomicSwaps[secretHash];
        IAtomicSwap(atomicSwap.get()).destruct { value: 100_000_000, bounce: true, flag: 1 } ();        
    }

    function onRedeem(uint256 secretHash) public override {
        optional(address) atomicSwap = participantAtomicSwaps.fetch(secretHash);
        require(atomicSwap.hasValue(), 408);
        require(atomicSwap.get() == msg.sender, 409);
        delete participantAtomicSwaps[secretHash];
        emit OnRedeemed(secretHash, msg.value);
    }

    function onRefund(uint256 secretHash) public override {
        optional(address) atomicSwap = initiatorAtomicSwaps.fetch(secretHash);
        require(atomicSwap.hasValue(), 410);
        require(atomicSwap.get() == msg.sender, 411);
        delete initiatorAtomicSwaps[secretHash];
        emit OnRefunded(secretHash, msg.value);
    }

    function hashSecret(bytes secret) public pure returns (uint256) {
        return uint256(sha256(secret));
    }

    onBounce(TvmSlice slice) external {
        uint32 functionId = slice.decode(uint32);
        
        if (functionId == tvm.functionId(IAtomicSwap.refund)) {
            emit Error(500);
        } else if (functionId == tvm.functionId(IAtomicSwap.redeem)) {
            emit Error(501);
        } else {
            emit Error(502);
        }
    }
}

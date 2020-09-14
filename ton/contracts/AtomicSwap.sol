pragma solidity>=0.6.0;
pragma AbiHeader time;
pragma AbiHeader expire;

import "IAtomicSwap.sol";
import "IAccept.sol";
import "AtomicSwapLib.sol";

contract AtomicSwap is IAtomicSwap {

    bytes constant payload = "Atomic Swap";

    address initiator;
    address participant;
    uint32 timeLock;
    uint128 amount;

    uint256 public secretHash;

    event Redeemed(bytes secret);

    modifier only(address addr) {
        require(msg.sender == addr, Errors.ATOMIC_SWAP_NOT_EXPIRED);_;
    }

    modifier whenExpired() {
        require(now >= timeLock, Errors.ATOMIC_SWAP_NOT_EXPIRED);_;
    }

    modifier whenNotExpired() {
        require(now < timeLock, Errors.ATOMIC_SWAP_EXPIRED);_;
    }

    constructor(
        address _initiator, 
        address _participant, 
        uint128 _amount, 
        uint32 _timeLock
    ) public {
        require(_timeLock > now && _timeLock < now + Time.MAX_TIME_LOCK, Errors.TIME_LOCK_INVALID);
        if (msg.sender == address(0)) {
            tvm.accept();
        }

        initiator = _initiator;
        participant = _participant;
        amount = _amount;
        timeLock = _timeLock;

        IAccept(participant).acceptTransfer { value: Fees.ATOMIC_SWAP_FWD_ACCEPT, bounce: true, flag: 1 } (payload);
    }

    function redeem(bytes secret) external override whenNotExpired only(participant) {
        require(address(this).balance >= amount, Errors.BALANCE_INSUFFICIENT);
        uint256 computed_hash = hashSecret(secret);
        require(computed_hash == secretHash, Errors.SECRET_INVALID);
    
        emit Redeemed(secret);

        selfdestruct(participant);
    }

    function refund() external override whenExpired only(initiator) {
        selfdestruct(initiator);
    }

    function params() public view returns (
        address _initiator,
        address _participant,
        uint32 _timeLock,
        uint256 _secretHash,
        uint128 _amount,
        uint256 _balance
    ) {
        _initiator = initiator;
        _participant = participant;
        _timeLock = timeLock;
        _secretHash = secretHash;
        _amount = amount;
        _balance = address(this).balance;
    }

    function canRedeen(bytes secret) public view returns (bool) {
        return now < timeLock
            && address(this).balance >= amount
            && hashSecret(secret) == secretHash;
    }

    function hashSecret(bytes secret) public pure returns (uint256) {
        return uint256(sha256(secret));
    }

    receive() external {}
}

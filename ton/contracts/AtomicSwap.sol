pragma solidity>=0.6.0;
pragma AbiHeader time;
pragma AbiHeader expire;

import "IAtomicSwap.sol";
import "IAccept.sol";
import "AtomicSwapLib.sol";


/**
 * @title      Hashed Timelock Smart Contract for Atomic Swap
 */
contract AtomicSwap is IAtomicSwap {

    address initiator;
    address participant;
    uint32 timeLock;
    uint128 amount;

    /**
     * @dev        unique secret hash, part of init_data, so everyone who knows code and secretHash 
     *             can generate address of this Atomic Swap
     */
    uint256 public secretHash;

    event Redeemed(bytes secret);

    /**
     * @dev        modifier to accept message from specified address
     * @param      addr  Expected address
     */
    modifier only(address addr) {
        require(msg.sender == addr, Errors.ATOMIC_SWAP_NOT_EXPIRED);_;
    }


    /**
     * @dev        modifier that check current time and lock time
     */
    modifier whenExpired() {
        require(now >= timeLock, Errors.ATOMIC_SWAP_NOT_EXPIRED);_;
    }

    /**
     * @dev        modifier that check current time and lock time
     */
    modifier whenNotExpired() {
        require(now < timeLock, Errors.ATOMIC_SWAP_EXPIRED);_;
    }


    /**
     * @dev        constructor for creating Atomic Swap
     * @param      _initiator    The initiator of Atomic Swap, can refund when lockTime will be expired
     * @param      _participant  The participant of Atomic Swap, can redeem
     * @param      _amount       The amount of nanoton to transfer to participant 
     * @param      _timeLock     The time lock in secs, utc 
     */
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
    }

    /**
     * @dev        redeem Atomic Swap by participant before time lock. Emit Redeemed event 
     *             to reveal secret for initiator. Destruct contract after execution.
     * @param      secret  The secret
     */
    function redeem(bytes secret) external override whenNotExpired only(participant) {
        uint256 computed_hash = hashSecret(secret);
        require(computed_hash == secretHash, Errors.SECRET_INVALID);
    
        emit Redeemed(secret);

        selfdestruct(participant);
    }


    /**
     * @dev        refund Atomic Swap by initiator after time lock. Destruct contract after 
     *             execution.
     */
    function refund() external override whenExpired only(initiator) {
        selfdestruct(initiator);
    }


    /**
     * @dev        get params to audit this contract
     */
    function params() public view returns (
        address _initiator,
        address _participant,
        uint32 _timeLock,
        uint32 _now,
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
        _now = uint32(now);
    }


    /**
     * @dev        helper method to check hash function result, run only local
     * @param      secret  The secret
     */
    function hashSecret(bytes secret) public pure returns (uint256) {
        return uint256(sha256(secret));
    }

    receive() external {}
}

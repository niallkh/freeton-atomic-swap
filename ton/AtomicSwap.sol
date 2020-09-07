pragma solidity>=0.6.0;


/**
 * @title      { title }
 */
contract AtomicSwap {

    address owner;
    address participant;
    uint256 expired_time;
    uint256 secret_hash;
    uint128 value;

    event Redeemed(uint256 secret, address addr, uint256 time);
    event Refunded(address addr, uint256 time);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyParticipant() {
        require(msg.sender == participant);
        _;
    }

    modifier whenExpired() {
        require(now >= expired_time);
        _;
    }

    modifier whenNotExpired() {
        require(now < expired_time);
        _;
    }

    /**
     * @dev        Construct contract for atomic swap. Owner of this contract
     *             from tmv.pubkey()
     * @param      _participant  The participant
     * @param      _value        The value
     * @param      _time         The time, must be less than 1 year (31_536_000
     *                           sec)
     * @param      _secret_hash  The secret hash
     */
    constructor(address _participant, uint128 _value, uint256 _time, uint256 _secret_hash) public {
        require(!msg.sender.isNone());
        require(!_participant.isNone());
        require(_time > 0 || _time <= 31_536_0001);
        
        owner = owner;
        participant = _participant;
        value = _value;
        expired_time = now + _time;
        secret_hash = _secret_hash;
    }


    /**
     * @dev        {developper_note }
     * @param      secret  The secret
     */
    function redeem(uint256 secret) external onlyParticipant whenNotExpired {
        require(address(this).balance >= value);
        uint256 computed_hash = uint256(sha256(abi.encodePacked(secret)));
        require(computed_hash == secret_hash);
        participant.transfer(value, false);
        emit Redeemed(secret, participant, now);
        selfdestruct(owner);
    }


    /**
     * @dev        {developper_note }
     */
    function refund() external onlyOwner whenExpired {
        emit Refunded(owner, now);
        selfdestruct(owner);
    }


    /**
     * @dev        {developper_note }
     */
    function params() public view returns (
        address _owner,
        address _participant,
        uint256 _expired_time,
        uint256 _secret_hash,
        uint128 _value,
        uint256 _balance
    ) {
        _owner = owner;
        _participant = participant;
        _expired_time = expired_time;
        _secret_hash = secret_hash;
        _value = value;
        _balance = address(this).balance;
    }
}

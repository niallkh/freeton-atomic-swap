pragma solidity>=0.6.0;
pragma AbiHeader time;
pragma AbiHeader expire;


/**
 * @title      { title }
 */
contract AtomicSwap {

    address owner;
    address participant;
    uint256 expired_time;
    uint128 amount;

    uint256 secret_hash;

    event Redeemed(uint256 secret, address addr, uint256 time);
    event Refunded(address addr, uint256 time);

    modifier onlyOwner() {
        require(msg.sender == owner, 400);
        _;
    }

    modifier onlyParticipant() {
        require(msg.sender == participant, 400);
        _;
    }

    modifier whenExpired() {
        require(now >= expired_time, 400);
        _;
    }

    modifier whenNotExpired() {
        require(now < expired_time, 400);
        _;
    }

    /**
     * @dev        Construct contract for atomic swap. Owner of this contract
     *             from tmv.pubkey()
     * @param      _participant  The participant
     * @param      _amount       The amount
     * @param      _time         The time, must be less than 1 year (31_536_000
     *                           sec)
     */
    constructor(address _participant, uint128 _amount, uint256 _time) public {
        require(!msg.sender.isNone(), 400);
        require(!_participant.isNone(), 400);
        require(_time > 0 || _time <= 31_536_0001, 400);
        require(msg.value >= amount, 400);
        
        owner = owner;
        participant = _participant;
        amount = _amount;
        expired_time = now + _time;
    }


    /**
     * @dev        {developper_note }
     * @param      secret  The secret
     */
    function redeem(uint256 secret) external onlyParticipant whenNotExpired {
        require(address(this).balance >= amount, 400);
        uint256 computed_hash = uint256(sha256(abi.encodePacked(secret)));
        require(computed_hash == secret_hash, 400);
        participant.transfer(amount);
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
        uint128 _amount,
        uint256 _balance
    ) {
        _owner = owner;
        _participant = participant;
        _expired_time = expired_time;
        _secret_hash = secret_hash;
        _amount = amount;
        _balance = address(this).balance;
    }
}

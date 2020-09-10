pragma solidity>=0.6.0;
pragma AbiHeader time;
pragma AbiHeader expire;

import "IAtomicSwapWallet.sol";
import "IAtomicSwap.sol";

contract AtomicSwap is IAtomicSwap {

    address owner;
    address participant;
    uint32 expiredTime;
    uint128 amount;

    uint256 public secretHash;

    bool redeemed;
    bool refunded;

    event Redeemed(uint256 secret, address addr, uint256 time);
    event Refunded(address addr, uint256 time);

    modifier onlyOwner() {
        require(msg.sender == owner, 401);_;
    }

    modifier onlyParticipant() {
        require(msg.sender == participant, 402);_;
    }

    modifier whenExpired() {
        require(msg.createdAt >= expiredTime, 403);_;
    }

    modifier whenNotExpired() {
        require(msg.createdAt < expiredTime, 404);_;
    }

    modifier whenNotRedeemedAndNotRefunded() {
        require(!redeemed && !refunded, 405);_;        
    }

    modifier whenRedeemedOrRefunded() {
        require(redeemed, 406);_;        
    }

    constructor(address _participant, uint128 _amount, uint32 timeLock) public {
        require(!msg.sender.isNone(), 407);
        require(!_participant.isNone(), 408);
        require(msg.sender != _participant, 409);
        require(timeLock > 0, 410);
        require(msg.value >= amount, 411);
        
        owner = msg.sender;
        participant = _participant;
        amount = _amount;
        expiredTime = msg.createdAt + timeLock;
        redeemed = false;
        refunded = false;

        IAtomicSwapWallet(msg.sender).onInitiate { value: 100_000_000, bounce: true, flag: 1 } (secretHash);
        IAtomicSwapWallet(_participant).onParticipate { value: 100_000_000, bounce: true, flag: 1 } (secretHash); // fixme check bounce
    }

    function redeem(uint256 secret) external override onlyParticipant whenNotExpired whenNotRedeemedAndNotRefunded {
        require(address(this).balance >= amount, 412);
        uint256 computed_hash = uint256(sha256(abi.encodePacked(secret)));
        require(computed_hash == secretHash, 413);
        redeemed = true;

        IAtomicSwapWallet(participant).onRedeem { value: amount, bounce: true, flag: 64 } (secretHash);

        emit Redeemed(secret, participant, now);
    }

    function refund() external override onlyOwner whenExpired whenNotRedeemedAndNotRefunded {
        refunded = true;

        IAtomicSwapWallet(owner).onRefund { value: amount, bounce: true, flag: 128 } (secretHash);
        
        emit Refunded(owner, now);
    }

    function destruct() external override onlyOwner whenRedeemedOrRefunded {
        selfdestruct(owner);
    }

    function params() public view returns (
        address _owner,
        address _participant,
        uint32 _expiredTime,
        uint256 _secretHash,
        uint128 _amount,
        uint256 _balance,
        bool _redeemed,
        bool _refunded
    ) {
        _owner = owner;
        _participant = participant;
        _expiredTime = expiredTime;
        _secretHash = secretHash;
        _amount = amount;
        _balance = address(this).balance;
        _redeemed = redeemed;
        _refunded = refunded;
    }

    onBounce(TvmSlice slice) external {
        uint32 functionId = slice.decode(uint32);
        
        if (functionId == tvm.functionId(IAtomicSwapWallet.onParticipate)) {
        } else if (functionId == tvm.functionId(IAtomicSwapWallet.onInitiate)) {
        } else if (functionId == tvm.functionId(IAtomicSwapWallet.onRedeem)) {
            redeemed = false;
        } else if (functionId == tvm.functionId(IAtomicSwapWallet.onRefund)) {
            refunded = false;
        } else {
        }
    }
}

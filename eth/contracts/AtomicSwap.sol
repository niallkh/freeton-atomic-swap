pragma solidity>=0.5.0;

import "./ERC20.sol";

contract AtomicSwap {

    enum SwapType { ETH, ERC20 }

    struct Swap {
        SwapType swapType;
        address initiator;
        address participant;
        uint256 timeLock;
        uint256 value;
        address tokenAddr;
        bool exists;
    }

    mapping(uint256 => Swap) atomicSwaps;

    event AtomicSwapCreated(address indexed participant, uint256 indexed secretHash);

    event Redeemed(uint256 indexed secretHash, bytes secret);
    
    /**
     * @dev        create Atomic Swap transfer native ethers from sender to participant.
     * @param      secretHash   The secret hash is unique id of Atomic Swap
     * @param      participant  The participant, destination of transfer
     * @param      value        The value amount of weis
     * @param      timeLock     The time lock
     */
    function createSwap(uint256 secretHash, address participant, uint256 value, uint256 timeLock) external payable {
        require(!atomicSwaps[secretHash].exists, "Atomic Swap already created");
        require(msg.value == value, "Value with message ne value");
        require(timeLock > now && timeLock < now + 1 weeks, "Timelock is invalid");

        atomicSwaps[secretHash] = Swap({
            swapType: SwapType.ETH,
            initiator: msg.sender,
            participant: participant,
            timeLock: timeLock,
            value: value,
            tokenAddr: address(0),
            exists: true
        });

        emit AtomicSwapCreated(participant, secretHash);
    }

    /**
     * @dev        create Atomic Swap transfer erc20 token from sender to participant
     * @param      secretHash   The secret hash is unique id of Atomic Swap
     * @param      participant  The participant, destination of transfer
     * @param      value        The value is amount weis
     * @param      timeLock     The time lock
     * @param      tokenAddr    The ERC20 token address
     */
    function createSwapErc20(uint256 secretHash, address participant, uint256 value, uint256 timeLock, address tokenAddr) external {
        require(!atomicSwaps[secretHash].exists, "Atomic Swap already created");
        require(timeLock > now && timeLock < now + 1 weeks, "Timelock is invalid");

        atomicSwaps[secretHash] = Swap({
            swapType: SwapType.ERC20,
            initiator: msg.sender,
            participant: participant,
            timeLock: timeLock,
            value: value,
            tokenAddr: tokenAddr,
            exists: true
        });
        
        ERC20 erc20 = ERC20(tokenAddr);
        require(erc20.allowance(msg.sender, address(this)) >= value, "You should allow erc20 tokens for Atomic Swap");
        require(erc20.transferFrom(msg.sender, address(this), value), "Couldn't transfer token to Atomic Swap");

        emit AtomicSwapCreated(participant, secretHash);
    }

    /**
     * @dev        redeem transfer by participant using secret and reveal secret for initiator 
     *             before time lock
     * @param      secret  The secret
     */
    function redeem(bytes calldata secret) external {
        uint256 secretHash = hashSecret(secret);
        require(atomicSwaps[secretHash].exists, "Atomic Swap isn't created");
        require(atomicSwaps[secretHash].timeLock >= now, "Atomic swap expired");
        require(atomicSwaps[secretHash].participant == msg.sender, "Redeem can only participant");

        Swap memory swap = atomicSwaps[secretHash];
        delete atomicSwaps[secretHash];

        if (swap.swapType == SwapType.ERC20) {
            ERC20 erc20 = ERC20(swap.tokenAddr);
            erc20.transfer(swap.participant, swap.value);

        } else {
            address payable participant = address(uint160(swap.participant));
            participant.transfer(swap.value);
        }

        emit Redeemed(secretHash, secret);
    }

    /**
     * @dev        refund transfer by initiator after time lock
     * @param      secretHash  The secret hash is unique id of transfer
     */
    function refund(uint256 secretHash) external {
        require(atomicSwaps[secretHash].exists, "Atomic Swap isn't created");
        require(atomicSwaps[secretHash].timeLock < now, "Atomic swap isn't expired");
        require(atomicSwaps[secretHash].initiator == msg.sender, "Refund can only initiator");

        Swap memory swap = atomicSwaps[secretHash];
        delete atomicSwaps[secretHash];

        if (swap.tokenAddr != address(0)) {
            ERC20 erc20 = ERC20(swap.tokenAddr);
            erc20.transfer(swap.initiator, swap.value);

        } else {
            address payable initiator = address(uint160(swap.initiator));
            initiator.transfer(swap.value);
        }
    }

    /**
     * @dev        get params to verify Atomic Swap transfer
     * @param      secretHash  The secret hash
     */
    function params(uint256 secretHash) public view returns (
        address initiator,
        address participant,
        uint256 timeLock,
        uint256 currTime,
        uint256 value,
        address tokenAddr,
        SwapType swapType
    ) {
        require(atomicSwaps[secretHash].exists, "Atomic Swap isn't created");
        initiator = atomicSwaps[secretHash].initiator;
        participant = atomicSwaps[secretHash].participant;
        timeLock = atomicSwaps[secretHash].timeLock;
        value = atomicSwaps[secretHash].value;
        tokenAddr = atomicSwaps[secretHash].tokenAddr;
        swapType = atomicSwaps[secretHash].swapType;
        currTime = now;
    }

    /**
     * @dev        helper method to check hash function result, call only local
     * @param      secret  The secret
     */
    function hashSecret(bytes memory secret) public pure returns (uint256) {
        return uint256(sha256(secret));
    }
}

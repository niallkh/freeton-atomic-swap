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

    event AtomicSwapCreated(uint256 secretHash);

    event Redeemed(bytes secret);
    
    function createSwap(uint256 secretHash, address participant, uint256 value, uint256 timeLock) external payable {
        require(!atomicSwaps[secretHash].exists, "Atomic Swap already created");
        require(msg.value == value, "Value with message lt value");
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

        emit AtomicSwapCreated(secretHash);
    }

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

        emit AtomicSwapCreated(secretHash);
    }

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

        emit Redeemed(secret);
    }

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

    function params(uint256 secretHash) public view returns (
        address initiator,
        address participant,
        uint256 timeLock,
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
    }

    function hashSecret(bytes memory secret) public pure returns (uint256) {
        return uint256(sha256(secret));
    }
}


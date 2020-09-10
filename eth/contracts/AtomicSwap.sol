pragma solidity>=0.5.0;

import "./ERC20.sol";
import "./ERC721.sol";

contract AtomicSwap {

    enum SwapType { ETH, ERC20, ERC721 }

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

    event AtomicSwapCreated(
        SwapType swapType,
        address initiator, 
        address participant, 
        uint256 secretHash, 
        uint256 value, 
        address tokenAddr
    );

    event Redeemd(
        bytes secret,         
        uint256 secretHash,
        uint256 time,
        address addr
    );

    event Refunded(
        uint256 secretHash,
        uint256 time,
        address addr
    );
    
    function createSwap(uint256 secretHash, address participant, uint256 value, uint256 timeLock) external payable {
        require(!atomicSwaps[secretHash].exists, "Atom Swap already created");
        require(participant != address(0), "Invalid Participant");
        require(msg.sender != participant, "Initiator and participant should be different");
        require(msg.value == value, "Value with message lt value");
        require(now > timeLock, "Timelock is expired");
        require(value > 0, "value should be gt 0");

        atomicSwaps[secretHash] = Swap({
            swapType: SwapType.ETH,
            initiator: msg.sender,
            participant: participant,
            timeLock: timeLock,
            value: value,
            tokenAddr: address(0),
            exists: true
        });

        emit AtomicSwapCreated(SwapType.ETH, msg.sender, participant, secretHash, value, address(0));
    }

    function createSwapErc20(uint256 secretHash, address participant, uint256 value, uint256 timeLock, address tokenAddr) external {
        require(!atomicSwaps[secretHash].exists, "Atom Swap already created");
        require(participant != address(0), "Invalid Participant");
        require(msg.sender != participant, "Initiator and participant should be different");
        require(now > timeLock, "Timelock is expired");
        require(value > 0, "value should be gt 0");

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

        emit AtomicSwapCreated(SwapType.ERC20, msg.sender, participant, secretHash, value, tokenAddr);
    }

    function createSwapErc721(uint256 secretHash, address participant, uint256 tokenId, uint256 timeLock, address tokenAddr) external {
        require(!atomicSwaps[secretHash].exists, "Atom Swap already created");
        require(participant != address(0), "Invalid Participant");
        require(msg.sender != participant, "Initiator and participant should be different");
        require(now > timeLock, "Timelock is expired");

        atomicSwaps[secretHash] = Swap({
            swapType: SwapType.ERC721,
            initiator: msg.sender,
            participant: participant,
            timeLock: timeLock,
            value: tokenId,
            tokenAddr: tokenAddr,
            exists: true
        });
        
        ERC721 erc721 = ERC721(tokenAddr);
        erc721.safeTransferFrom(msg.sender, address(this), tokenId);

        emit AtomicSwapCreated(SwapType.ERC721, msg.sender, participant, secretHash, tokenId, tokenAddr);
    }

    function redeem(bytes calldata secret) external {
        uint256 secretHash = hashSecret(secret);
        require(atomicSwaps[secretHash].exists, "Atom Swap isn't created");
        require(atomicSwaps[secretHash].timeLock >= now, "Atomic swap expired");
        require(atomicSwaps[secretHash].participant == msg.sender, "Redeem can only participant");

        Swap memory swap = atomicSwaps[secretHash];
        delete atomicSwaps[secretHash];

        if (swap.swapType == SwapType.ERC20) {
            ERC20 erc20 = ERC20(swap.tokenAddr);
            erc20.transfer(swap.participant, swap.value);

        } else if (swap.swapType == SwapType.ERC721) {
            ERC721 erc721 = ERC721(swap.tokenAddr);
            erc721.safeTransferFrom(address(this), swap.participant, swap.value);

        } else {
            address payable participant = address(uint160(swap.participant));
            participant.transfer(swap.value);
        }

        emit Redeemd(secret, secretHash, now, swap.participant);
    }

    function refund(uint256 secretHash) external {
        require(atomicSwaps[secretHash].exists, "Atom Swap isn't created");
        require(atomicSwaps[secretHash].timeLock < now, "Atomic swap isn't expired");
        require(atomicSwaps[secretHash].initiator == msg.sender, "Refund can only initiator");

        Swap memory swap = atomicSwaps[secretHash];
        delete atomicSwaps[secretHash];

        if (swap.tokenAddr != address(0)) {
            ERC20 erc20 = ERC20(swap.tokenAddr);
            erc20.transfer(swap.initiator, swap.value);

        } else if (swap.swapType == SwapType.ERC721) {
            ERC721 erc721 = ERC721(swap.tokenAddr);
            erc721.safeTransferFrom(address(this), swap.initiator, swap.value);

        } else {
            address payable initiator = address(uint160(swap.initiator));
            initiator.transfer(swap.value);
        }

        emit Refunded(secretHash, now, swap.initiator);
    }

    function params(uint256 secretHash) public view returns (
        address initiator,
        address participant,
        uint256 timeLock,
        uint256 value,
        address tokenAddr,
        SwapType swapType
    ) {
        require(atomicSwaps[secretHash].exists, "Atom Swap isn't created");
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


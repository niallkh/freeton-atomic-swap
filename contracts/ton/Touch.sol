pragma solidity>=0.6.0;

contract Touch {
    
    uint256 counter;

    modifier checkOwnerAndAccept {
        require(msg.pubkey() == tvm.pubkey(), 100);
        tvm.accept();
        _;
    }

    constructor() public checkOwnerAndAccept {
        counter = 0;
    }

    function touch() public checkOwnerAndAccept {
        counter += 1;
    }

    function count() public view checkOwnerAndAccept returns (uint256) {
        return counter;
    }

    receive() external {
    }
}

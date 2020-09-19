pragma solidity>=0.6.0;

/**
 * @title      error's codes
 */
library Errors {
    uint16 constant ATOMIC_SWAP_EXPIRED = 101;
    uint16 constant ATOMIC_SWAP_NOT_EXPIRED = 102;
    uint16 constant ADDRESS_IS_NONE = 103;
    uint16 constant TIME_LOCK_INVALID = 104;
    uint16 constant CALLER_MUST_BE_PARTICIPANT = 105;
    uint16 constant CALLER_MUST_BE_INITIATOR = 106;
    uint16 constant CALLER_MUST_BE_OWNER = 107;
    uint16 constant SECRET_INVALID = 108;
    uint16 constant BALANCE_INSUFFICIENT = 109;
    uint16 constant NSG_VALUE_INSUFFICIENT = 110;
}

/**
 * @title      predefined fee for operations
 */
library Fees {
    uint128 constant ATOMIC_SWAP_CREATE = 30 milliton;
}

/**
 * @title      const for time
 */
library Time {
    uint32 constant MAX_TIME_LOCK = 1 weeks;
}

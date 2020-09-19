pragma solidity>=0.6.0;

library Errors {
    uint16 constant ATOMIC_SWAP_EXPIRED = 101;
    uint16 constant ATOMIC_SWAP_NOT_EXPIRED = 102;
    uint16 constant ADDRESS_IS_NONE = 103;
    uint16 constant TIME_LOCK_INVALID = 104;
    uint16 constant CALLER_MUST_BE_PARTICIPANT = 105;
    uint16 constant CALLER_MUST_BE_INITIATOR = 106;
    uint16 constant CALLER_MUST_BE_OWNER_OR_CONTRACT = 107;
    uint16 constant CALLER_MUST_BE_OWNER = 108;
    uint16 constant SECRET_INVALID = 109;
    uint16 constant BALANCE_INSUFFICIENT = 110;
    uint16 constant NSG_VALUE_INSUFFICIENT = 111;
}

library Fees {
    uint128 constant ATOMIC_SWAP_CREATE = 20 milliton;
    uint128 constant ATOMIC_SWAP_REDEEM = 10 milliton;
    uint128 constant ATOMIC_SWAP_REFUND = 10 milliton;
    uint128 constant ATOMIC_SWAP_FWD_ACCEPT = 1 milliton;
}

library Time {
    uint32 constant MAX_TIME_LOCK = 1 weeks;
}

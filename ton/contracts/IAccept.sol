pragma solidity>=0.6.0;

interface IAccept {

    /**
     * @dev        accept transfer and emit payload
     * @param      payload  The payload
     */
    function acceptTransfer(bytes payload) external;
}

// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Messaging {

    string public encryptedMessage;

    event MessageStored(string indexed encryptedMessage);

    function storeEncryptedMessage(string memory _encryptedMessage) public {
        encryptedMessage = _encryptedMessage;
        emit MessageStored(_encryptedMessage);
    }

    function retrieveEncryptedMessage() public view returns (string memory) {
        return encryptedMessage;
    }
}

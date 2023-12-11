// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";

// sepolia  0x3A84fF281a5cC2346F33F908275d532Bea8FAa0B
// mumbai   0x5aC2d72604B20471926a9a26768C154Fd6bAe709

contract MessagingCCIP is CCIPReceiver, OwnerIsCreator {
    string private storedMessage;
    string private lastReceivedMessage;

    event MessageStored(string message);
    event MessageSent(
        bytes32 indexed messageId,
        uint64 indexed destinationChainSelector,
        address receiver,
        string text
    );
    event MessageReceived(
        bytes32 indexed messageId,
        uint64 indexed sourceChainSelector,
        address sender,
        string text
    );

    constructor(address _router) CCIPReceiver(_router) {}

    function storeMessage(string calldata _message) external {
        storedMessage = _message;
        emit MessageStored(_message);
    }

    function retrieveMessage() external view returns (string memory) {
        return storedMessage;
    }

    function sendMessagePayNative(
        uint64 _destinationChainSelector,
        address _receiver,
        string calldata _text
    ) external onlyOwner returns (bytes32 messageId) {
        Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(_receiver),
            data: abi.encode(_text),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: Client._argsToBytes(Client.EVMExtraArgsV1({gasLimit: 200000})),
            feeToken: address(0)
        });

        IRouterClient router = IRouterClient(this.getRouter());
        uint256 fees = router.getFee(_destinationChainSelector, evm2AnyMessage);

        require(address(this).balance >= fees, "Not enough balance for fees");

        messageId = router.ccipSend{value: fees}(_destinationChainSelector, evm2AnyMessage);

        emit MessageSent(messageId, _destinationChainSelector, _receiver, _text);
    }

    function _ccipReceive(Client.Any2EVMMessage memory any2EvmMessage) internal override {
        lastReceivedMessage = abi.decode(any2EvmMessage.data, (string));
        emit MessageReceived(
            any2EvmMessage.messageId,
            any2EvmMessage.sourceChainSelector,
            abi.decode(any2EvmMessage.sender, (address)),
            lastReceivedMessage
        );
    }

    function getLastReceivedMessage() external view returns (string memory) {
        return lastReceivedMessage;
    }

    receive() external payable {}
}

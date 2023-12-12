import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useContract, useWallet, useContractWrite, useContractRead, ConnectWallet } from '@thirdweb-dev/react'; 
import styles from '../styles/messaging.module.css';
import { abi } from '../lib/abi';
//import EncryptDecrypt from '../components/EncryptDecrypt';


export default function MessagingApp() {

  // Contract addresses
  const contractAddressSepolia = "0x0Dd3FbD1D30DB88c251f583bDf571AD651Af0946"; 
  const contractAddressMumbai = "0x5B96a49721B94645EB6B53C30623b0e389915A87";

  // Contract instances
  const { contract: contractSepolia } = useContract(contractAddressSepolia, abi);
  const { contract: contractMumbai } = useContract(contractAddressMumbai, abi);

  // State and hooks for Sepolia
  const { mutateAsync: sendSepolia, data: txData, isLoading: isLoadingSepolia } = useContractWrite(contractSepolia, "sendMessagePayLINK");

  // State and hooks for Mumbai
  const getMessageHookMumbai = useContractRead(contractMumbai, "getLastReceivedMessageDetails");
  
  const wallet = useWallet();

  const [status, setStatus] = useState('');
  const [retrievedMessageMumbai, setRetrievedMessageMumbai] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const transactionHash = txData?.receipt?.transactionHash;


  const handleSendMessage = async (encryptedMessage) => {
    setStatus('Sending message to Mumbai...');
    try {
      const destinationChainSelector = "12532609583862916517"; // Mumbai chain selector
      const receiverAddress = "0x5B96a49721B94645EB6B53C30623b0e389915A87"; // MessagingCCIP3 on Mumbai
  
      await sendSepolia({
        args: [destinationChainSelector, receiverAddress, encryptedMessage]
      });
     
      setStatus('Message sent to Mumbai');
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      setStatus(`Error while sending message: ${error.message}`);
    }
  };
  

  const handleGetMessage = async () => {
    try {
      setStatus('Retrieving last received message from Mumbai...');
      const message = await getLastMessageHookMumbai();
      setRetrievedMessageMumbai(message);
      setStatus('Last message retrieved from Mumbai');
    } catch (error) {
      setStatus(`Error retrieving message: ${error.message}`);
    }
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.topRightLink}>
        <Link href="/encrypt-decrypt">
          Encrypt/Decrypt
        </Link>
      </div>
      <h2>This demo showcases what it would be like to send an encrypted message across chains, specifically from Ethereum to Polygon testnets</h2>

      <ConnectWallet  
          theme={"dark"}
          modalSize={"wide"} 
        />
  
      {wallet && (
        <>
          
          {/* Sepolia Network Section */}
          <div className={styles.networkSection}>
            <h2>Sepolia Network</h2>
            
            <textarea 
              className={styles.input}
              placeholder="Encrypt your message first and paste it here"
              value={encryptedMessage}
              onChange={(e) => setEncryptedMessage(e.target.value)} 
            />
  
            <button 
              className={styles.button}
              onClick={() => handleSendMessage(encryptedMessage)}  
            >
              Send Message to Mumbai
            </button>
  
          </div>
          {transactionHash && (
            <h3>CCIP messages take several minutes to confirm, you can find your transaction on etherscan <a
            href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a> Copy the transaction hash and search for it on the CCIP explorer <a href='https://ccip.chain.link' target="_blank" >https://ccip.chain.link</a></h3>
      )}
  
          {/* Mumbai Network Section */}
          <div className={styles.networkSection}>
            <h2>Mumbai Network</h2>
            <h4>(Make sure to switch over)</h4>
  
            <textarea
              className={styles.output}
              readOnly
              value={retrievedMessageMumbai} 
            />
            <button 
              className={styles.button}
              onClick={handleGetMessage}  
            >
              Query Last Received Message
            </button>
          </div>
          {transactionHash && (
            <h3>If your transaction has finalized and this button is not working then you can query the contract directly <a
            href={'https://mumbai.polygonscan.com/address/0x5b96a49721b94645eb6b53c30623b0e389915a87'}
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a></h3>
      )}
  
          {/* Status Display */}
          <div className={styles.status}>
            <p>Status: {status}</p>  
          </div>
        </>
      )}
    </div>
  );  
}
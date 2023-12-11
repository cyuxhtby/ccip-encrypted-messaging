import { useState, useEffect } from 'react';
import { useContract, useWallet, useContractWrite, useContractRead, ConnectWallet } from '@thirdweb-dev/react';
import styles from '../styles/messaging.module.css';
import { abi } from '../lib/abi';
import EncryptDecrypt from '../components/EncryptDecrypt';

export default function MessagingApp() {
    const contractAddress = "0x0D1a1D7D1344C83Be9DF449394137fC8e0509637"; 
    const { contract } = useContract(contractAddress, abi);
    const storeMessageHook = useContractWrite(contract, "storeEncryptedMessage");
    const { data: retrievedData, isLoading: isRetrieving, error: retrieveError } = useContractRead(contract, "retrieveEncryptedMessage");
    const wallet = useWallet();
    const [status, setStatus] = useState('');
    const [encryptedMessage, setEncryptedMessage] = useState('');
    const [retrievedMessage, setRetrievedMessage] = useState('');

    const storeEncryptedMessage = async (message) => {
        if (!message) {
            setStatus('Must enter a message');
            return;
        }
        try {
            setStatus('Processing...');
            await storeMessageHook.mutateAsync({ args: [message] });
            setStatus('Message stored successfully');
        } catch (error) {
            setStatus(`Error: ${error.message}`);
        }
    };

    useEffect(() => {
        if (retrieveError) {
            setStatus(`Error: ${retrieveError.message}`);
        } else if (!isRetrieving && retrievedData) {
            setRetrievedMessage(retrievedData);
            setStatus('Message retrieved');
        }
    }, [retrievedData, isRetrieving, retrieveError]);

    return (
        <div className={styles.container}>
            <h1>Messaging App</h1>
            {!wallet && <ConnectWallet theme={"dark"} modalSize={"wide"} />}
            {wallet && (
                <>
                    <div className={styles.connectWalletContainer}>
                        <ConnectWallet theme={"dark"} modalSize={"wide"} />
                    </div>
                    <div className={styles.action}>
                        <textarea 
                            className={styles.input} 
                            placeholder="Encrypted message" 
                            onChange={(e) => setEncryptedMessage(e.target.value)} 
                            value={encryptedMessage}
                        />
                        <button className={styles.button} onClick={() => storeEncryptedMessage(encryptedMessage)}>Store Message</button>
                    </div>
                    <div className={styles.action}>
                        <button className={styles.button} onClick={() => {}}>Retrieve Message</button>
                        <textarea 
                            className={styles.input} 
                            readOnly 
                            value={retrievedMessage}
                        />
                    </div>
                    <div>
                        <p>{status}</p>
                    </div>
                </>
            )}
            <EncryptDecrypt/>
        </div>
    );
}

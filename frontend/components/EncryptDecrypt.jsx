import React, { useState } from 'react';
import { encryptMessage, decryptMessage } from '../lib/crypto';
import styles from '../styles/EncryptDecrypt.module.css';

const EncryptDecrypt = () => {
    const [message, setMessage] = useState('');
    const [passphrase, setPassphrase] = useState('');
    const [encryptedMessage, setEncryptedMessage] = useState('');
    const [decryptedMessage, setDecryptedMessage] = useState('');

    const handleEncrypt = () => {
        const encrypted = encryptMessage(message, passphrase);
        setEncryptedMessage(encrypted);
    };

    const handleDecrypt = () => {
        const decrypted = decryptMessage(encryptedMessage, passphrase);
        setDecryptedMessage(decrypted);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(encryptedMessage);
    };

    return (
        <div className={styles.container}>
            <div>
                <h2>Encrypt Message</h2>
                <input 
                    type="text" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder="Enter message" 
                />
                <input 
                    type="password" 
                    value={passphrase} 
                    onChange={(e) => setPassphrase(e.target.value)} 
                    placeholder="Enter passphrase" 
                />
                <button onClick={handleEncrypt}>Encrypt</button>
                <textarea 
                    value={encryptedMessage} 
                    readOnly 
                />
                <button onClick={copyToClipboard}>Copy to Clipboard</button>
            </div>
            <div>
                <h2>Decrypt Message</h2>
                <textarea 
                    value={encryptedMessage} 
                    onChange={(e) => setEncryptedMessage(e.target.value)} 
                    placeholder="Paste encrypted message" 
                />
                <button onClick={handleDecrypt}>Decrypt</button>
                <textarea 
                    value={decryptedMessage} 
                    readOnly 
                />
            </div>
        </div>
    );
};

export default EncryptDecrypt;

import React, { useState } from 'react';
import Link from 'next/link';
import { encryptMessage, decryptMessage } from '../lib/crypto';
import styles from '../styles/EncryptDecrypt.module.css';

const EncryptDecryptPage = () => {
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
             <div className={styles.topRightLink}>
        <Link href="/messaging">
          Cross Chain Messaging
        </Link>
      </div>
            <div>
                <h2>Encrypt Message</h2>
                <input 
                    className={styles.inputField}
                    type="text" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder="Enter message" 
                />
                <input 
                    className={styles.textarea}
                    type="password" 
                    value={passphrase} 
                    onChange={(e) => setPassphrase(e.target.value)} 
                    placeholder="Enter passphrase" 
                />
                <button onClick={handleEncrypt}>Encrypt</button>
                <textarea 
                     className={styles.textarea}
                    value={encryptedMessage} 
                    readOnly 
                />
                <button onClick={copyToClipboard}>Copy to Clipboard</button>
            </div>
            <div>
                <h2>Decrypt Message</h2>
                <textarea 
                     className={styles.textarea}
                    onChange={(e) => setEncryptedMessage(e.target.value)} 
                    placeholder="Paste encrypted message" 
                />
                <button onClick={handleDecrypt}>Decrypt</button>
                <textarea 
                    className={styles.textarea}
                    value={decryptedMessage} 
                    readOnly 
                />
            </div>
        </div>
    );
};

export default EncryptDecryptPage;

import CryptoJS from 'crypto-js';

export const encryptMessage = (message, passphrase) => {
    return CryptoJS.AES.encrypt(message, passphrase).toString();
};

export const decryptMessage = (encryptedMessage, passphrase) => {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, passphrase);
    return bytes.toString(CryptoJS.enc.Utf8);
};

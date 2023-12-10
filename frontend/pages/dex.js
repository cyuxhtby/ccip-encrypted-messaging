import { useState } from 'react';
import { useContract, useWallet, useContractWrite, ConnectWallet } from '@thirdweb-dev/react';
import styles from '../styles/dex.module.css';

export default function DEX() {
    const contractAddress = "0x8Ba88EE9B7533900cAc23Bac113C0e97a16DCaEf";
    const { contract } = useContract(contractAddress);
    const addLiquidityHook = useContractWrite(contract, "addLiquidity");
    const removeLiquidityHook = useContractWrite(contract, "removeLiquidity");
    const ethToTokenSwapHook = useContractWrite(contract, "ethToTokenSwap");
    const tokenToEthSwapHook = useContractWrite(contract, "tokenToEthSwap");
    const wallet = useWallet();
    const [status, setStatus] = useState('');
    const [loadingAction, setLoadingAction] = useState(null);

    const addLiquidity = async (amountOfToken) => {
        if (!amountOfToken) {
            setStatus('Must enter a value');
            return;
        }
        try {
            setLoadingAction('addLiquidity');
            setStatus('Processing...');
            await addLiquidityHook.mutateAsync({ args: [amountOfToken] });
            setStatus('Transaction successful');
        } catch (error) {
            setStatus(`Error: ${error.message}`);
        } finally {
            setLoadingAction(null);
        }
    };

    const removeLiquidity = async (amountOfLPTokens) => {
        if (!amountOfLPTokens) {
            setStatus('Must enter a value');
            return;
        }
        try {
            setLoadingAction('removeLiquidity');
            setStatus('Processing...');
            await removeLiquidityHook.mutateAsync({ args: [amountOfLPTokens] });
            setStatus('Transaction successful');
        } catch (error) {
            setStatus(`Error: ${error.message}`);
        } finally {
            setLoadingAction(null);
        }
    };

    const ethToTokenSwap = async (minTokensToReceive) => {
        if (!minTokensToReceive) {
            setStatus('Must enter a value');
            return;
        }
        try {
            setLoadingAction('ethToTokenSwap');
            setStatus('Processing...');
            await ethToTokenSwapHook.mutateAsync({ args: [minTokensToReceive] });
            setStatus('Transaction successful');
        } catch (error) {
            setStatus(`Error: ${error.message}`);
        } finally {
            setLoadingAction(null);
        }
    };

    const tokenToEthSwap = async (tokensToSwap, minEthToReceive) => {
        if (!tokensToSwap || !minEthToReceive) {
            setStatus('Must enter both values');
            return;
        }
        try {
            setLoadingAction('tokenToEthSwap');
            setStatus('Processing...');
            await tokenToEthSwapHook.mutateAsync({ args: [tokensToSwap, minEthToReceive] });
            setStatus('Transaction successful');
        } catch (error) {
            setStatus(`Error: ${error.message}`);
        } finally {
            setLoadingAction(null);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Decentralized Exchange</h1>
            {!wallet && <ConnectWallet />}
            {wallet && (
                <>
                <div className={styles.connectWalletContainer}>
                <ConnectWallet />
                </div>
                <div className={styles.action}>
                    <input type="text" className={styles.input} placeholder="Amount of Token" id="amountOfToken" />
                    <button className={styles.button} onClick={() => addLiquidity(document.getElementById('amountOfToken').value)}>Add Liquidity</button>
                </div>
                <div className={styles.action}>
                    <input type="text" className={styles.input} placeholder="Amount of LP Tokens" id="amountOfLPTokens" />
                    <button className={styles.button} onClick={() => removeLiquidity(document.getElementById('amountOfLPTokens').value)}>Remove Liquidity</button>
                </div>
                <div className={styles.action}>
                    <input type="text" className={styles.input} placeholder="Min Tokens to Receive" id="minTokensToReceive" />
                    <button className={styles.button} onClick={() => ethToTokenSwap(document.getElementById('minTokensToReceive').value)}>Swap ETH for Tokens</button>
                </div>
                <div className={styles.action}>
                    <input type="text" className={styles.input} placeholder="Tokens to Swap" id="tokensToSwap" />
                    <input type="text" className={styles.input} placeholder="Min ETH to Receive" id="minEthToReceive" />
                    <button className={styles.button} onClick={() => tokenToEthSwap(document.getElementById('tokensToSwap').value, document.getElementById('minEthToReceive').value)}>Swap Tokens for ETH</button>
                </div>
                <div>
                    <p>{status}</p>
                </div>
                </>
            )}
        </div>
    );
}

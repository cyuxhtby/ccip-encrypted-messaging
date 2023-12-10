import {
    useClaimNFT,
    useContract,
    Web3Button,
    useAddress,
    useNFT, 
    ThirdwebNftMedia,
  } from "@thirdweb-dev/react";
  import styles from '../styles/mint.module.css';
  
  const contractAddress = "0x7362d9a3d94FB6822eFfc9443D2c21C390ef4eE4";
  
  export default function Mint() {
    const address = useAddress();
    const { contract } = useContract(contractAddress);
    const { mutateAsync: claimNft } = useClaimNFT(contract);
    const { data: nft, isLoading, error } = useNFT(contract, "0");
    
    // Render loading state
    if (isLoading) return <div className={styles.container}>Loading...</div>;
    
    // Render error state
    if (error || !nft) return <div className={styles.container}>NFT not found</div>;
    
    return (
        <div className={styles.container}>
            <div className={styles.nftMedia}>
      <ThirdwebNftMedia metadata={nft.metadata} width="6rem" />
      </div>
      <Web3Button
        className={styles.web3Button}
        contractAddress={contractAddress}
        action={() =>
          claimNft({
            to: address, // Use useAddress hook to get current wallet address
            quantity: 1, // Amount of NFTs to claim
          })
        }
      >
        Claim
      </Web3Button>
      </div>
    );
  }
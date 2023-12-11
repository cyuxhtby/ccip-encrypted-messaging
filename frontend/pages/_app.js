import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  localWallet,
  embeddedWallet,
} from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import "../styles/globals.css";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = Sepolia;

function MyApp({ Component, pageProps }) {
  return (
    
    <ThirdwebProvider
    activeChain={activeChain}
    clientId="c11ce172ec1208d6515ccd489999cf4f"
    supportedWallets={[
      metamaskWallet(),
      coinbaseWallet(),
      walletConnect(),
    ]}
  >
    

      <Component {...pageProps} />
    
  </ThirdwebProvider>
  );
}

export default MyApp;

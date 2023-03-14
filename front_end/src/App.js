/*import './App.css';
import Atmosphere from "./Atmosphere.js"
import { useEffect useState  } from "react"
import AtmosphereMetaData from "./Atmosphere.json"

function initImageData(){
  
  for(let x in AtmosphereMetaData){
    AtmosphereMetaData[x].data = "";
    AtmosphereMetaData[x].isLoaded = false;
  }
  return AtmosphereMetaData;
}

function App() {
  const [imageData, setImageData] = useState(initImageData());
  const [paymentData, setPaymentData] = useState();
  
  return (
    <div className="App">
      <header className="App-header">
        <Atmosphere metaData={AtmosphereMetaData[0]}/>
        <Atmosphere metaData={AtmosphereMetaData[1]}/>
      </header>
    </div>
  );
}

export default App;*/

import "@rainbow-me/rainbowkit/styles.css";
import { configureChains, createClient, WagmiConfig } from "wagmi";//chain,
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";

//import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import Header from "./Header";
import Body from "./Body";

const localhost = {
  id: 31337,
  name: 'Localhost',
  network: 'localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['http://localhost:8545'] },
    default: { http: ['http://localhost:8545'] },
  },
};

const { chains, provider } = configureChains(
  [localhost],
  [
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider
})

export default function App() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Header />
        <Body />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

/*



*/
//

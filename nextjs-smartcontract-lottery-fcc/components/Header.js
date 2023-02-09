import { useConnect, useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit';
//import { ConnectButton } from "web3uikit"



export default function Header() {
    const { address, isConnected } = useAccount();

    const { connect, connectors } = useConnect({
        onSuccess(data) {
        console.log("Connected!")
        }
    });

    return (
        <nav className="p-3 border-b-2 flex flex-row">
            <h1 className="py-3 px-5 font-bold text-3xl"> SaasPaymentChannels</h1>
            <div className="ml-auto py-3 px-5">
                <ConnectButton />;
            </div>
        </nav>
    )
}
/*
{connectors.map((connector) => (
                <button disabled={!connector.ready} key={connector.id} onClick={() => connect({ connector })}>
                    {'Connect Wallet'}
                </button>
            ))}

isConnected ? (
    address.slice(0, 4) + '...' + address.slice(38, 42)
):(
    
)
*/
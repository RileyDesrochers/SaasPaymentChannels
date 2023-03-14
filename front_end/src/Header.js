//import { useConnect, useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
    //const { address, isConnected } = useAccount();

    /*const { connect, connectors } = useConnect({
        onSuccess(data) {
        console.log("Connected!")
        }
    });*/

    return (
        <nav className="p-2 border-b-2 flex flex-row">
            <h1 className="font-bold text-3xl py-2 px-5"> SaasPaymentChannels</h1>
            <div className="ml-auto py-2 px-5">
                <ConnectButton />
            </div>
        </nav>
    )
}

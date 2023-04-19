import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
    return (
        <nav className="p-1 border-b-2 flex flex-row">
            <h1 className="p-1 my-2 ml-8 font-bold text-4xl"> SaasPaymentChannels</h1>
            <div className="p-1 my-2 mr-8 ml-auto">
                <ConnectButton />
            </div>
        </nav>
    )
}

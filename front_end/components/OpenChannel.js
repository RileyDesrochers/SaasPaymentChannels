import { usePrepareContractWrite, useContractWrite, useNetwork } from 'wagmi'
import { channelAbi } from 'abis';
//const paymentRecipient = '0x5AdA39e766c416CA083d8c7e43104f2C7cF2194A';

export default function OpenChannel(props) {
    const { chain } = useNetwork()
    const channelConf = channelAbi(chain.id);

    const { config: openConfig } = usePrepareContractWrite({
        ...channelConf,
        functionName: 'fundChannel',
        args: [props.paymentRecipient, 1000000],
    })
    const { write } = useContractWrite({
        ...openConfig,
        onSuccess(_) {
            props.handle();
        },
    });

    return (
        <button className="my-2 mx-4 p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded disabled:opacity-50" disabled={!write} onClick={() => write?.()}>
            Fund Channel
        </button>
    );
}
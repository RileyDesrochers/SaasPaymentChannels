import { usePrepareContractWrite, useContractWrite, useNetwork } from 'wagmi'
import { channelAbi } from 'abis';

export default function Deposit(props) {
    const { chain } = useNetwork()
    const channelConf = channelAbi(chain.id);

    //writes----------------
    const { config: depositConfig } = usePrepareContractWrite({
        ...channelConf,
        functionName: 'deposit',
        args: ["100000000"],
    })
    const { write: write } = useContractWrite({
        ...depositConfig,
        onSuccess(_) {
            props.handle();
        },
    });

    return (
        <button className="my-2 mx-4 p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded disabled:opacity-50" disabled={!write} onClick={() => write?.()}>
            Deposit
        </button>
    );
}
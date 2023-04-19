import { usePrepareContractWrite, useContractWrite, useNetwork } from 'wagmi'
import { channelAbi, usdcAbi } from 'abis';

export default function Approve(props) {
    const { chain } = useNetwork()
    const channelConf = channelAbi(chain.id);
    const usdcConf = usdcAbi(chain.id);

    const { config: approveConfig } = usePrepareContractWrite({
        ...usdcConf,
        functionName: 'approve',
        args: [channelConf.address, "10000000000"],
    })
    const { write: write } = useContractWrite({
        ...approveConfig,
        onSuccess(_) {
            props.handle();
        },
    });

    return (
        <button className="my-2 mx-4 p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded disabled:opacity-50" disabled={!write} onClick={() => write?.()}>
            Approve Funds
        </button>
    );
}
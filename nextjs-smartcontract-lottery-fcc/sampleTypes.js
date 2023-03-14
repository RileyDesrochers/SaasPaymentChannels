const typedMessage = {
    primaryType: 'Delegation',
    domain: {
      name: 'Atmosphere',
      version: '4',
    },
  
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      Transaction: [
        { name: 'to', type: 'address' },
        { name: 'total', type: 'uint256' },
        { name: 'round', type: 'uint256' },
      ],
      SignedTransaction: [
        { name: 'transaction', type: 'Transaction' },
        { name: 'signature', type: 'bytes' },
      ],
     }
  };
  
  
  module.exports = typedMessage;
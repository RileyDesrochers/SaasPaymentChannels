// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./YourTypesFile.sol";
import "hardhat/console.sol";

contract Channel is EIP712Decoder {
	using Counters for Counters.Counter;
    //using ECDSA for bytes32;

	mapping(address => uint256) private _balances;
	IERC20 public token;

	//Counters.Counter channelIDs;
	uint64 lockPeriod = 1 days;
	uint8 public decimals = 18;

	enum State {NONEXISTANT,OPEN,LOCKED}

	struct ChannelState {
		uint256 value;
		State state;
		Counters.Counter round;
		uint64 lockTime;
	}

	// channels is a array of channels with the index being the index ID
	//ChannelState[] public channels;
	mapping(address => mapping(address => ChannelState)) channels; //sender => reciver => channel
	mapping(address => address[]) channelReciversBySender;
	mapping(address => address[]) channelSendersByReciver;

	//event Open(uint64 indexed ID, uint256 value);
	event Fund(address indexed from, address indexed to, uint256 amount);
	event Lock(address indexed from, address indexed to, uint64 time);
	event Defund(address indexed from, address indexed to, uint256 amount);
	event Transfer(address from, address to, uint256 amount);
	//FIX add more events

	bytes32 public immutable domainHash;
	constructor(string memory name, address _token){
        token = IERC20(_token);
		//_setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
		domainHash = getEIP712DomainHash(name,"4",block.chainid,address(this));
    }

	//modifiers--------------------------------------------------------------------------

	modifier requireOpen(address sender, address reciver){
		require(channels[sender][reciver].state == State.OPEN, "Channel is not open");
		_;
	}

	modifier requireLocked(address sender, address reciver){
		require(channels[sender][reciver].state == State.LOCKED, "Channel is not locked");
		_;
	}

	//deposit and withdrawal functions----------------------------------------------------------------

	function deposit(uint256 amount) public returns (bool){
		address user = msg.sender;
		require(token.transferFrom(user, address(this), amount));
		_balances[user] += amount;

		emit Transfer(address(0), user, amount);

		return true;
	}

	function withdrawal(uint256 amount) public returns (bool){
		address user = msg.sender;
		uint256 Balance = _balances[user];
		require(amount <= Balance);
		unchecked {
			_balances[user] = Balance - amount;
		}
		token.transfer(user, amount);

		emit Transfer(user, address(0), amount);

		return true;
	}

	//ERC20 like functions-----------------------------------------------------------------------------

	function transfer(address to, uint256 amount) public returns(bool){
		address from = msg.sender;
		require(from != address(0), "ERC20: transfer from the zero address");
		require(to != address(0), "ERC20: transfer to the zero address");
		uint256 fromBalance = _balances[from];
		require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[from] = fromBalance - amount;
            // Overflow not possible: the sum of all balances is capped by totalSupply, and the sum is preserved by
            // decrementing then incrementing.
            _balances[to] += amount;
        }

		emit Transfer(from, to, amount);

        return true;
    }

	//helpers adn getters------------------------------------------------------------------------

	function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

	function verify(address sender, address reciver, uint256 amount, uint256 round, bytes memory signature) public view returns (bool){
		//return _verify(sender, _hash(reciver, amount, round), signature);
		address out = verifySignedTransaction(SignedTransaction(Transaction(reciver, amount, round), signature));
		return (sender == out);
    }

	function getEIP712DomainHash(string memory contractName, string memory version, uint256 chainId, address verifyingContract) public pure returns (bytes32) {
		bytes memory encoded = abi.encode(
			EIP712DOMAIN_TYPEHASH,
			keccak256(bytes(contractName)),
			keccak256(bytes(version)),
			chainId,
			verifyingContract
		);
		return keccak256(encoded);
  	}

	function verifySignedTransaction(SignedTransaction memory signedTransaction) public view returns (address) {

		// Break out the struct that was signed:
		Transaction memory transaction = signedTransaction.transaction;

		// Get the top-level hash of that struct, as defined just below:
		bytes32 sigHash = getTransactionTypedDataHash(transaction);

		// The `recover` method comes from the codegen, and will be able to recover from this:
		address recoveredSignatureSigner = recover(sigHash, signedTransaction.signature);
		return recoveredSignatureSigner;
  	}

	function getTransactionTypedDataHash(Transaction memory transaction) public view returns (bytes32) {
		bytes32 digest = keccak256(abi.encodePacked(
			"\x19\x01",

			// The domainHash is derived from your contract name and address above:
			domainHash,

			// This last part is calling one of the generated methods.
			// It must match the name of the struct that is the `primaryType` of this signature.
			GET_TRANSACTION_PACKETHASH(transaction)
		));
		return digest;
  	}

	function getChannelReciversBySender(address sender) public view returns(address[] memory){
		return channelReciversBySender[sender];
	}

	function getChannelSendersByReciver(address reciver) public view returns(address[] memory){
		return channelSendersByReciver[reciver];
	}

	function getChannelByAddresses(address from, address to) public view returns (ChannelState memory) {
        return channels[from][to];
    }

	//user functions-----------------------------------------------------------------------------

	function open(address to, uint256 value) public {
		address from = msg.sender;
		uint256 Balance = _balances[from];
		require(value <= Balance, "you do not have the balance to fund channel");
<<<<<<< HEAD
		//require(channels[msg.sender][to].state == State.NONEXISTANT, "channel already opened use senderFundChannel() instead");
		
		_balances[msg.sender] = Balance - value;
=======
		require(channels[from][to].state == State.NONEXISTANT, "channel already opened use senderFundChannel() instead");
		
		unchecked {
			_balances[from] = Balance - value;
		}

		//uint64 id = uint64(channelIDs.current());

		Counters.Counter memory round;

		channels[from][to] = ChannelState(value, State.OPEN, round, 0);

		channelReciversBySender[from].push(to);
		channelSendersByReciver[to].push(from);
>>>>>>> 2014c9603e839f6746893677247d603797dc0b3d

		if(channels[msg.sender][to].state == State.NONEXISTANT){
			Counters.Counter memory round;

<<<<<<< HEAD
			channels[msg.sender][to] = ChannelState(value, State.OPEN, round, 0);
=======
		emit Fund(from, to, value);
	}
>>>>>>> 2014c9603e839f6746893677247d603797dc0b3d

			channelReciversBySender[msg.sender].push(to);
			channelSendersByReciver[to].push(msg.sender);
		}else{
			channels[msg.sender][to].value += value;
		}
		emit Fund(msg.sender, to, value);
	}

	function senderLock(address to) public requireOpen(msg.sender, to){
		channels[msg.sender][to].state = State.LOCKED;
		uint64 time = uint64(block.timestamp);
		channels[msg.sender][to].lockTime = time;

		emit Lock(msg.sender, to, time);
	}//FIX write sender Unlock function

	function senderWithdrawal(address to) public requireLocked(msg.sender, to){
		uint64 lockTime = channels[msg.sender][to].lockTime;
		require(block.timestamp < lockTime + lockPeriod);

		uint256 amount = channels[msg.sender][to].value;
		channels[msg.sender][to].value = 0;
		_balances[msg.sender] += amount;

		channels[msg.sender][to].state = State.OPEN;//reopen channel

		emit Defund(msg.sender, to, amount);
	}

	//recipient functions-----------------------------------------------------------------------------

	//does no require channel to be open
	function reciverCollectPayment(address from, address to, uint256 amount, uint256 round, bytes memory sig) public {
		require(round == channels[from][msg.sender].round.current());
		require(amount <= channels[from][msg.sender].value);
		require(verify(from, to, amount, round, sig));
		//address sender = channels[id].from;
		//bytes32 messageHash = getMessageHash(msg.sender, amount, round);
		//bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

		
		channels[from][msg.sender].value -= amount;
		channels[from][msg.sender].round.increment();
		_balances[msg.sender] += amount;

		emit Defund(from, msg.sender, amount);
	}

	//Testing Only----------------------------

	function airdrop(uint256 amount) public returns(uint256){
		_balances[msg.sender] += amount;
		return _balances[msg.sender];
	}

}
// SPDX-License-Identifier: UNLICENSED
// github.com/MariusVanDerWijden/go-pay
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
//import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "hardhat/console.sol";

contract Channel {
	using Counters for Counters.Counter;
    //using ECDSA for bytes32;

	mapping(address => uint256) private _balances;
	IERC20 public token;

	Counters.Counter channelIDs;
	uint64 lockPeriod = 1 days;
	uint8 public decimals = 18;

	enum State {NONEXISTANT,OPEN,LOCKED}

	struct ChannelState {
		address from;
		address to;
		uint256 value;
		State state;
		Counters.Counter round;
		uint64 lockTime;
	}

	// channels is a array of channels with the index being the index ID
	ChannelState[] public channels;
	mapping(address => uint64[]) channelIDsBySender;
	mapping(address => uint64[]) channelIDsByReciver;

	//event Open(uint64 indexed ID, uint256 value);
	event Fund(uint64 indexed ID, uint256 amount);
	event Lock(uint64 indexed ID, uint64 time);
	event Defund(uint64 indexed ID, address user, uint256 amount);
	event Transfer(address from, address to, uint256 amount);
	//FIX add more events

	constructor(address _token) {
        token = IERC20(_token);
    }

	//modifiers--------------------------------------------------------------------------

	modifier requireOpen(uint64 id){
		require(channels[id].state == State.OPEN, "Channel is not open");
		_;
	}

	modifier requireLocked(uint64 id){
		require(channels[id].state == State.LOCKED, "Channel is not locked");
		_;
	}

	modifier requireSender(uint64 id){
		require(channels[id].from == msg.sender, "You are not the channel sender");
		_;
	}

	modifier requireReciver(uint64 id){
		require(channels[id].to == msg.sender, "You are not the channel recipient");
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

	function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

	//helpers adn getters------------------------------------------------------------------------

    /*function hashState(uint64 id, uint256 amount, uint64 round) internal  returns (bytes32) {
		return keccak256(abi.encodePacked(id, amount, round));
	}*/

	function splitSignature(bytes memory sig) public pure returns(bytes32 r, bytes32 s, uint8 v)
    {
        require(sig.length == 65, "invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }

	function getMessageHash(uint64 id, uint256 amount, uint64 round) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(id, amount, round));
    }

	function getEthSignedMessageHash(bytes32 _messageHash) public pure returns (bytes32)
    {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash));
    }

	function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature) public pure returns (address)
    {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

	function getChannelIDsBySender(address sender) public view returns(uint64[] memory){
		return channelIDsBySender[sender];
	}

	function getChannelIDsByReciver(address reciver) public view returns(uint64[] memory){
		return channelIDsByReciver[reciver];
	}

	//user functions-----------------------------------------------------------------------------

	function open(address to, uint256 value) public returns(uint64){
		uint256 Balance = _balances[msg.sender];
		require(value <= Balance, "you do not have the balance to fund channel");
		unchecked {
			_balances[msg.sender] = Balance - value;
		}

		uint64 id = uint64(channelIDs.current());

		Counters.Counter memory round;

		channels.push(ChannelState(msg.sender, to, value, State.OPEN, round, 0));

		/*channels[id].from = msg.sender;
		channels[id].to = to;
		channels[id].value = value;
		channels[id].state = State.OPEN;*/

		channelIDsBySender[msg.sender].push(id);
		channelIDsByReciver[to].push(id);

		channelIDs.increment();

		emit Fund(id, value);

		return id;
	}

	function senderFundChannel(uint64 id, uint256 amount) public requireOpen(id) requireSender(id) returns(bool){
		uint256 Balance = _balances[msg.sender];
		require(amount <= Balance, "you do not have the balance to fund channel");
		unchecked {
			_balances[msg.sender] = Balance - amount;
			channels[id].value += amount;
		}

		emit Fund(id, amount);

		return true;
	}

	function senderLock(uint64 id) public requireOpen(id) requireSender(id) returns(uint64){
		channels[id].state = State.LOCKED;
		uint64 time = uint64(block.timestamp);
		channels[id].lockTime = time;

		emit Lock(id, time);

		return time;
	}//FIX write sender Unlock function

	function senderWithdrawal(uint64 id) public requireLocked(id) requireSender(id) returns(uint256){
		uint64 lockTime = channels[id].lockTime;
		require(block.timestamp < lockTime + lockPeriod);

		uint256 amount = channels[id].value;
		channels[id].value = 0;
		_balances[msg.sender] += amount;

		channels[id].state = State.OPEN;//reopen channel

		emit Defund(id, channels[id].from, amount);

		return amount;
	}

	//recipient functions-----------------------------------------------------------------------------

	//does no require channel to be open
	function reciverCollectPayment(uint64 id, uint256 amount, uint64 round, bytes memory sig/*bytes32 r, bytes32 s, bytes32 vs, uint8 v*/) public requireReciver(id) returns(bool){
		require(round == channels[id].round.current());
		require(amount <= channels[id].value);

		address sender = channels[id].from;
		bytes32 messageHash = getMessageHash(id, amount, round);
		bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

		require(recoverSigner(ethSignedMessageHash, sig) == sender);
		//require(ECDSA.recover(hash, sig) == sender, "invalid signature");
		
		channels[id].value -= amount;
		channels[id].round.increment();
		_balances[channels[id].to] += amount;

		emit Defund(id, channels[id].to, amount);

		return true;
	}
}
import React from 'react';
import DepositButton from './deposit_button.js';
import WithdrawalButton from './withdrawal_button.js';
import OpenChannelButton from './open_channel_button.js';
import AirdropCoinsButton from './airdrop_coins_button.js';
import BalanceDisplay from './balance_display.js';

function AccountManagment() {
  return (
    <div className="AccountManagment">
        <DepositButton />
        <WithdrawalButton />
        <AirdropCoinsButton />
        <OpenChannelButton />
        <BalanceDisplay />
    </div>
  );
}

export default AccountManagment;
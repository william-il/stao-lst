import '@polkadot/wasm-crypto/initWasmAsm';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { ethers } from 'ethers';
import BittensorTestUtils from './processors/BittensorTestUtils';
import EthersTestUtils from './processors/EthersTestUtils';
import IntegratedSystem from './processors/IntegratedSystem';
import FinanceUtils, { PortfolioVector } from './processors/FinanceUtils';

import dotenv from 'dotenv';
import * as path from 'path';
import EthKey from './types/EthKey';
import Decimal from 'decimal.js';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function main() {
  await cryptoWaitReady();
  const tempWsProvider = new WsProvider(process.env.BITTENSOR_WS_PROVIDER);
  const tempApi = await ApiPromise.create({ provider: tempWsProvider });
  const tempKeyring = new Keyring({ type: 'sr25519' });

  const bittensorModule = new BittensorTestUtils(
    tempApi,
    tempWsProvider,
    tempKeyring,
    false
  );
  await bittensorModule.setupByFile();

  const ethereumModule = new EthersTestUtils();

  const keyringAddress = bittensorModule.keyringAddresses;
  const keyringPairs = bittensorModule.keyringPairs;
  const ethereumWallets = ethereumModule.signers;
  const targetPortfolioVector = {
    Validator1Hotkey: new Decimal(0.3),
    Validator2Hotkey: new Decimal(0.3),
    Validator3Hotkey: new Decimal(0.4),
  };
  const integratedSystem = new IntegratedSystem(
    bittensorModule,
    ethereumModule,
    targetPortfolioVector,
    true
  );

  console.log('Testing the integrated system...');
  await integratedSystem.start();
  integratedSystem.shouldLog = true;
/* 
  console.log(`\nAddingAnEthKey...`);
  //first add a valid ethKey to the contract.
  const aliceSignature = await bittensorModule.signMessageAsHex(
    keyringPairs[0],
    ethereumWallets[0].address,
    true
  );
  await ethereumModule
    .addEthKeyAccount(
      ethereumWallets[0],
      bittensorModule.coldKeyAddressMap.get('Alice')!,
      ethereumWallets[0].address,
      aliceSignature,
      false
    )
    .then(async () => {
      console.log(`\nSENDING TRANSACTION FROM ALICE TO VAULT...\n`);
      await bittensorModule.sendTransactionSecure(
        bittensorModule.coldKeyPairsMap.get('Alice')!,
        bittensorModule.coldKeyPairsMap.get('Vault')!,
        BigInt(100e9),
        false
      );
    }); */
}

main().catch(console.error);

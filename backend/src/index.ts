import '@polkadot/wasm-crypto/initWasmAsm';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { ethers } from 'ethers';
import BittensorTestUtils from './processors/BittensorTestUtils';
import EthersTestUtils from './processors/EthersTestUtils';
import IntegratedSystem from './processors/IntegratedSystem';
import dotenv from 'dotenv';
import * as path from 'path';
import EthKey from './types/EthKey';
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

  const integratedSystem = new IntegratedSystem(
    bittensorModule,
    ethereumModule
  );

  console.log('Testing the integrated system...');
  await integratedSystem.start();

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
        BigInt(107e8),
        false
      );
    });
}

main().catch(console.error);

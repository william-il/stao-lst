import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { decorateConstants, u16 } from '@polkadot/types';
import { _0n, BN, stringToU8a, u8aToHex } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';
import bitData from '../random/bitData';
import dotenv from 'dotenv';
import '@polkadot/keyring';
import {
  mnemonicGenerate,
  mnemonicToMiniSecret,
  randomAsHex,
} from '@polkadot/util-crypto';
import { SubmittableExtrinsic } from '@polkadot/api-base/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { AccountInfo } from '@polkadot/types/interfaces';
import { KeyringPair } from '@polkadot/keyring/types';
import coldKeys, { hotKeys } from '../data/bittensorTestWallets';
import EthKey from '../types/EthKey';
import { EventEmitter } from 'events';
import { ethers } from 'ethers';
import '../interfaces/augment-api';
import * as path from 'path';
import '@polkadot/wasm-crypto/initWasmAsm';
import { mnemonicValidate, cryptoWaitReady } from '@polkadot/util-crypto';
import yargs, { string } from 'yargs';
import BittensorTestUtils from '../processors/BittensorTestUtils';
import { Vec } from '@polkadot/types';
import fs from 'fs';
import { mapToTypeMap } from '@polkadot/types-codec';
import EthersTestUtils from '../processors/EthersTestUtils';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface EthKeyWithValidation extends EthKey {
  isValid: boolean;
}
async function main() {
  try {
    console.log('hello world');
    await cryptoWaitReady();
    // create temp structs for bittensor
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

    const numberOfUsers = 5;
    // build preset ethkeys and save it into a JSON later

    const keyringMap: Map<string, KeyringPair> = new Map();
    const mnemonicMap: Map<string, string> = new Map();

    const ethKeyAccount: {
      [taoAddress: string]: { EthKey: EthKeyWithValidation[] };
    } = {};

    // create random user TAO addresses
    const userKeyring = new Keyring({ type: 'sr25519' });

    // generate tao addresses and their mnemonics
    let ethAddrIndex = 0;
    for (let i = 0; i < numberOfUsers; i++) {
      const mnemonic = mnemonicGenerate();
      mnemonicMap.set(`User${i + 1}`, mnemonic);
      const tempKeyring = userKeyring.addFromUri(`${mnemonic}`, {
        name: `User${i + 1}`,
      });

      // randomly decide how many ethereum addresses they will add,
      // then for each ethereum address give the probabilty that the signature is fradulant
      const numberOfEthKeys = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numberOfEthKeys; j++) {
        let signature: string;
        let isValid: boolean;
        if (decideFraud()) {
          // create a fradulant signature
          console.log('Fradulant signature');
          signature = bittensorModule.signMessageAsHex(
            keyringPairs[0],
            ethereumWallets[ethAddrIndex].address,
            true
          );
          isValid = false;
        } else {
          // create a valid signature
          console.log('Valid Signature');
          signature = bittensorModule.signMessageAsHex(
            tempKeyring,
            ethereumWallets[ethAddrIndex].address,
            true
          );
          isValid = true;
        }
        const ethKeyTemp: EthKeyWithValidation = {
          address: ethereumWallets[ethAddrIndex].address,
          signature: signature,
          isValid: isValid,
        };
        if (!ethKeyAccount[tempKeyring.address]) {
          ethKeyAccount[tempKeyring.address] = { EthKey: [] };
        }
        ethKeyAccount[tempKeyring.address].EthKey.push(ethKeyTemp);

        // now officially add the eth key to the account:
        await ethereumModule.addEthKeyAccount(
          ethereumWallets[0],
          tempKeyring.address,
          ethKeyAccount[tempKeyring.address].EthKey[j].address,
          signature,
          true
        );
        ethAddrIndex++;
      }
    }
    console.log(ethKeyAccount);
  } catch (error) {
    console.error('Error has occured: ', error);
  }
}

main().catch((error) => {
  console.error('Unhandled error in main:', error);
});
function decideFraud(): boolean {
  const decideFraud = Math.floor(Math.random() * 4) + 1;
  if (decideFraud === 1) {
    return true;
  } else {
    return false;
  }
}

/***
 * Takes in a keyringPair mapping, usually from the bittensorClassUtils object
 * and converts it into a JSON files stored in ../deploymentData
 *
 * @param keyPairMap KeyringPair map to write to JSON
 */
function writeKeyPairsToJSON(
  keyPairMap: Map<string, KeyringPair>,
  mnemonicMap: Map<string, string>
) {
  const accounts: Record<
    string,
    {
      address: string;
      name: string;
      derivation: string;
      hotkey: boolean;
      secretKey: string;
      ethKeys: EthKeyWithValidation[];
    }
  > = {};
  // default polkadot dev seed
  const secretKey =
    'bottom drive obey lake curtain smoke basket hold race lonely fit walk';
  const secretVaultKey = process.env.VAULT_SECRET_KEY;

  // iterate through all keypairs and create an object literal
  for (const [name, keyringPair] of keyPairMap) {
    const secretKeyForName = mnemonicMap.get(name);
    if (name === 'Vault') {
      accounts[name] = {
        address: keyringPair.address,
        name: keyringPair.meta.name!,
        derivation: secretVaultKey!,
        hotkey: false,
        secretKey: secretKeyForName!,
      };
      continue;
    }
    if (name.toLowerCase().endsWith('hotkey')) {
      accounts[name] = {
        address: keyringPair.address,
        name: keyringPair.meta.name!,
        derivation: secretKeyForName!,
        hotkey: true,
        secretKey: secretKeyForName!,
      };
    } else {
      accounts[name] = {
        address: keyringPair.address,
        name: keyringPair.meta.name!,
        derivation: secretKeyForName!,
        hotkey: false,
        secretKey: secretKeyForName!,
      };
    }
  }

  // add additional data headers for the json
  const accountsWithHeader = {
    title: 'KeyringPairs for Bittensor generated by setupSubtensor.ts',
    createdAt: new Date().toISOString(),
    totalKeyrings: Object.keys(accounts).length,
    secretKeyDev: secretKey,
    vaultSecretKey: secretVaultKey,
    accounts,
  };

  const deploymentDir = path.join(__dirname, '..', 'deploymentData');
  ensureDirectoryExistence(deploymentDir);

  const fileName = `keyring_data.json`;
  const filePath = path.join(deploymentDir, fileName);

  const bigIntReplacer = (key: string, value: any) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  };

  // write the json to file
  fs.writeFileSync(
    filePath,
    JSON.stringify(accountsWithHeader, bigIntReplacer, 2)
  );
  console.log('Keypair Wallet Data saved to:', filePath);
}

/***
 * Quick check to see if a filepath exists. If it doesn't create it recursively
 *
 * @param filePath file path to check if it exists
 */
function ensureDirectoryExistence(dirPath: string) {
  if (fs.existsSync(dirPath)) {
    return true;
  }
  fs.mkdirSync(dirPath, { recursive: true });
}

/* export interface EthKey {
    address: string; // Ethereum address as string
    signature: string; // Bytes as hex string
  } */

/* const mnemonicMap: Map<string, string> = new Map();
  const minerMnemonic = mnemonicGenerate();
  mnemonicMap.set('Miner', minerMnemonic);
  bittensorModule.keyring.addFromUri(`${minerMnemonic}`, {
    name: 'Miner',
  }); */

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

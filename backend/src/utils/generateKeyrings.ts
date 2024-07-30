import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { decorateConstants, u16 } from '@polkadot/types';
import { _0n, BN, stringToU8a, u8aToHex } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';
import bitData from '../data/bitData';
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
import keypairData from '../deploymentData/keyring_data.json';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface KeyringDataAccount {
  address: string;
  name: string;
  derivation: string;
}

interface KeyringDataAccounts {
  accounts: {
    [key: string]: KeyringDataAccount;
  };
}

async function main() {
  await cryptoWaitReady();
  const wsProvider = new WsProvider(process.env.BITTENSOR_WS_PROVIDER);
  const api = await ApiPromise.create({ provider: wsProvider });

  const keyring = new Keyring({ type: 'sr25519' });
  const bittensorModule = new BittensorTestUtils(api, wsProvider, keyring);

  const accountData = keypairData as KeyringDataAccounts;
  const vaultKey = keypairData.vaultSecretKey;
  const devKey = keypairData.secretKeyDev;
  Object.entries(accountData.accounts).forEach(([acctName, acctData]) => {
    if (acctName === 'Vault') {
      keyring.addFromMnemonic(vaultKey, { name: acctName });
    } else {
      keyring.addFromUri(acctData.derivation, { name: acctName });
    }
  });

  keyring.getPairs().forEach((pair) => {
    console.log(`Name: ${pair.meta.name}, Address: ${pair.address}`);
  });
}

main();

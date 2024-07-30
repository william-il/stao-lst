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
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function main() {
  //console.log(process.env.BITTENSOR_WS_PROVIDER);
  //console.log(process.env.OWNER_SECRET_KEY);
  await cryptoWaitReady();

  // parse bittensor arguments
  const argv = parseArguments();
  if (argv.subnetCount > 8 && argv.subnetCount > 1) {
    throw new Error('Max number of subnets is 8, the minimum is 1');
  } else if (argv.validatorCount < 1 || argv.validatorCount > 8) {
    throw new Error('Validator count must be between 1 and 8');
  }

  // store arguments
  const validatorCount = argv.validatorCount;
  const subnetCount = argv.subnetCount;

  // generate bittensor providers and keyring
  const wsProviderTemp = new WsProvider(process.env.BITTENSOR_WS_PROVIDER);
  const apiTemp = await ApiPromise.create({ provider: wsProviderTemp });
  let keyringTemp = new Keyring({ type: 'sr25519' });

  // create bittensor module class
  try {
    const bittensorModule = new BittensorTestUtils(
      apiTemp,
      wsProviderTemp,
      keyringTemp
    );

    // Generate keypairs for owner, miner, validators
    //console.log(bittensorModule.keyringMap);
    const mnemonicMap: Map<string, string> = new Map();

    for (const [name, value] of bittensorModule.keyringMap) {
      console.log(name);
      if (name === 'Vault') {
        mnemonicMap.set(name, process.env.VAULT_SECRET_KEY!);
      } else {
        mnemonicMap.set(
          name,
          `bottom drive obey lake curtain smoke basket hold race lonely fit walk//${name}`
        );
      }
    }

    const ownerMnemonic = process.env.OWNER_SECRET_KEY! + '//Owner';
    mnemonicMap.set('Owner', ownerMnemonic);
    bittensorModule.keyring.addFromUri(`${ownerMnemonic}`, {
      name: 'Owner',
    });
    const minerMnemonic = mnemonicGenerate();
    mnemonicMap.set('Miner', minerMnemonic);
    bittensorModule.keyring.addFromUri(`${minerMnemonic}`, {
      name: 'Miner',
    });
    const minerHotkeyMnemonic = mnemonicGenerate();
    mnemonicMap.set('MinerAltKey', minerHotkeyMnemonic);
    bittensorModule.keyring.addFromUri(`${minerHotkeyMnemonic}`, {
      name: 'MinerAltKey',
    });

    // Regenerate keypairs after adding new ones
    bittensorModule.regenerateMapAndAddresses();
    const keyringMap = bittensorModule.keyringMap;
    const keyringMapAddresses = bittensorModule.keyringAddressesMap;
    let transactionMap = new Map<string, bigint>();
    transactionMap.set(keyringMapAddresses.get('Owner')!, BigInt(100000e9));
    transactionMap.set(keyringMapAddresses.get('Miner')!, BigInt(100000e9));
    await bittensorModule.batchTransferRequest(
      keyringMap.get('Alice')!,
      transactionMap
    );
    transactionMap = new Map<string, bigint>();
    // default mnemonic for keyring with no specified mnemonics
    // bottom drive obey lake curtain smoke basket hold race lonely fit walk

    // print account data
    await bittensorModule.getAllAccountData(true, true);

    // create a keyring owner and miner accessor for simple access
    const keyringOwner = bittensorModule.keyringMap.get('Owner')!;
    const keyringMiner = bittensorModule.keyringMap.get('Miner')!;
    const keyringMinerHotkey = bittensorModule.keyringMap.get('MinerAltKey')!;

    // loop through subnet count and generate subnets base on the owner
    console.log('Starting Subnet Generation...');
    for (let i = 0; i < subnetCount; i++) {
      // Register a new network transaction
      // due to subnet 0 and subnet 3 being unusable, try to circumvent
      let trueNETUID = i + 1;
      if (trueNETUID >= 3) {
        trueNETUID++;
      }
      try {
        await handleTransaction(
          bittensorModule.api,
          keyringOwner,
          bittensorModule.api.tx.subtensorModule.registerNetwork()
        );
      } catch (error) {
        console.error('Transaction Failed:', error);
      }

      // set the weight setting limit to a lot
      try {
        await handleTransaction(
          bittensorModule.api,
          keyringOwner,
          bittensorModule.api.tx.adminUtils.sudoSetWeightsSetRateLimit(
            trueNETUID,
            0
          )
        ).then(() => {
          console.log('completed rate limit');
        });
      } catch (error) {
        console.error('Transaction Failed:', error);
      }
    }

    console.log(`\nGenerated ${subnetCount} subnets`);

    // Generate Validators
    console.log('Starting Validator Generation...');
    for (let i = 0; i < validatorCount; i++) {
      // create validator cold keyrings

      const validatorMnemonic = mnemonicGenerate();
      mnemonicMap.set(`Validator${i + 1}`, validatorMnemonic);
      const newValidator = bittensorModule.keyring.addFromUri(
        `${validatorMnemonic}`,
        {
          name: `Validator${i + 1}`,
        }
      );

      // create validator hot keyrings
      const validatorHotkeyMnemonic = mnemonicGenerate();
      mnemonicMap.set(`Validator${i + 1}Hotkey`, validatorHotkeyMnemonic);
      const newValidatorHotkey = bittensorModule.keyring.addFromUri(
        `${validatorHotkeyMnemonic}`,
        {
          name: `Validator${i + 1}Hotkey`,
        }
      );

      // validators generated
      console.log(
        `Validator key pair generated:
      Validator${i + 1} Coldkey Addr: ${newValidator.address}
      \nValidator${i + 1} Hotkey Addr: ${newValidatorHotkey.address}\n`
      );
      await bittensorModule.regenerateMapAndAddresses();

      await bittensorModule.sendTransactionSecure(
        bittensorModule.keyringMap.get('Alice')!,
        newValidator.address,
        BigInt(100000e9)
      );
      await bittensorModule.getAccountData(newValidator.meta.name!, true, true);
      await bittensorModule.getAccountData(
        newValidatorHotkey.meta.name!,
        true,
        true
      );

      // register to each subnet, root subnet is 0 and subnet 3 is unusable
      console.log(`\nStarting Validator${i + 1} Registration...`);
      // add 2 to account for subnet 0 and subnet 3, default subnets
      for (let j = 0; j < subnetCount + 2; j++) {
        // case when at root subnet
        if (j === 0) {
          console.log('Registering at root');
          // Validator transaction to become registered to the subnet
          try {
            await handleTransaction(
              bittensorModule.api,
              newValidator,
              bittensorModule.api.tx.subtensorModule.rootRegister(
                newValidatorHotkey.address
              )
            );
          } catch (error) {
            console.error('Transaction Failed:', error);
          }
          continue;
        }
        // case of subnet 3
        else if (j === 3 || (subnetCount === 1 && j === 2)) {
          continue;
        }
        // if uid isn't 0 or 3 just register normally to subnet
        // Validator transaction to become registered to the subnet
        console.log(`Registering at subnet ${j}`);
        try {
          await handleTransaction(
            bittensorModule.api,
            newValidator,
            bittensorModule.api.tx.subtensorModule.burnedRegister(
              j,
              newValidatorHotkey.address
            )
          );
        } catch (error) {
          console.error('Transaction Failed:', error);
        }
      }

      console.log(
        'Finished registering validators, now adding stake from account to become delgate...'
      );
      // now add stake to the validators 1000 tao from the validators account
      const stakeAmt = BigInt(1000e9);
      try {
        await bittensorModule.addStakeSecure(
          newValidator,
          newValidatorHotkey.address,
          stakeAmt
        );
      } catch (error) {
        console.error('Transaction Failed:', error);
      }

      // create vectors and set root weights now. All subnets shall be equally weighted
      let subnets = Array.from(
        { length: subnetCount + 2 },
        (_, index) => index
      );
      const individualWeight: number = Math.floor(65534 / subnetCount);
      let subnetWeights = Array.from(
        { length: subnetCount + 2 },
        (_, index) => individualWeight
      );
      subnetWeights[0] = 0;
      if (subnetCount === 1) {
        subnetWeights[2] = 0;
        subnets[2] = 3;
      } else {
        subnetWeights[3] = 0;
      }
      console.log(`Subnets: ${subnets}`);
      console.log(`Subnet wights: ${subnetWeights}`);

      // start the set root weights transaction
      console.log(`Setting root weights for Validator${i + 1}...`);
      try {
        await handleTransaction(
          bittensorModule.api,
          newValidator,
          bittensorModule.api.tx.subtensorModule.setRootWeights(
            0,
            newValidatorHotkey.address,
            subnets,
            subnetWeights,
            0
          )
        );
      } catch (error) {
        console.error('Transaction Failed:', error);
      }
    }

    console.log(
      'Generated all validators and their registrations, now registering miner...'
    );
    // register miner to all subnets:
    for (let i = 0; i < subnetCount + 2; i++) {
      if (i === 0) {
        try {
          await handleTransaction(
            bittensorModule.api,
            keyringMiner,
            bittensorModule.api.tx.subtensorModule.rootRegister(
              keyringMinerHotkey.address
            )
          );
        } catch (error) {
          console.error('Transaction Failed:', error);
        }
        continue;
      } else if (i === 3 || (subnetCount === 1 && i === 2)) {
        // skip subnet 3
        continue;
      }
      // if uid isn't 0 or 3 just register normally to subnet
      try {
        await handleTransaction(
          bittensorModule.api,
          keyringMiner,
          bittensorModule.api.tx.subtensorModule.burnedRegister(
            i,
            keyringMinerHotkey.address
          )
        );
      } catch (error) {
        console.error('Transaction Failed:', error);
      }
    }

    console.log(
      'Completed all subtensor setup, now writing keyringpairs to JSON...'
    );
    // write keypairs to JSON file
    writeKeyPairsToJSON(bittensorModule.keyringMap, mnemonicMap);
    console.log('Setup complete!');
  } finally {
    // Ensure API is disconnected even if an error occurs
    console.log('Disconnecting from the Polkadot API...');
    await apiTemp.disconnect();
    console.log('Disconnected. Script execution complete.');
  }
}

/***
 * parse arguments uses yargs to parse 2 different flags:
 *
 * --subnet-count or --sc: Number of subnets to generate
 * 1 - 8 is the range, and the default is 1 subnet
 *
 * --validator-count or --vc: Number of validators to generate
 * 1 - 8 is the range, and the default is 2 validators
 * Each validator will validate all subnets, and will also have equal root weights set for each one.
 *
 */
function parseArguments() {
  var argv = require('yargs/yargs')(process.argv.slice(2))
    .options('subnet-count', {
      alias: 'sc',
      type: 'number',
      description: 'Number of subnets to generate',
      default: 1,
    })
    .options('validator-count', {
      alias: 'vc',
      type: 'number',
      description: 'Number of validators to generate',
      default: 2,
    })
    .help()
    .alias('help', 'h')
    .parse();
  return argv;
}

/***
 * Handle transaction function
 * asynchronous function to protect block transaction rate limits
 * Ensures any transaction is fully signed and finalized before resolving
 * Will create delays between transactions, but avoids subtensor rate limits
 *
 * @param api bittensor bittensor api
 * @param signer signer of the transaction
 * @param transaction bittensor transaction to be signed and sent
 */
async function handleTransaction(
  api: ApiPromise,
  signer: KeyringPair,
  transaction: SubmittableExtrinsic<'promise'>
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    // get next nonce
    const nonce = await api.rpc.system.accountNextIndex(signer.address);
    // use transaction param
    transaction
      // Sign transaction
      .signAndSend(signer, { nonce }, ({ status, events, dispatchError }) => {
        // check if the status of the transaction is in the block or is finalized
        if (status.isInBlock || status.isFinalized) {
          events
            // check that in all status of the transfer, there are no errors/extrinsic failure events
            ?.filter(({ event }) => api.events.system.ExtrinsicFailed.is(event))
            .forEach(
              ({
                event: {
                  data: [error],
                },
              }) => {
                // parse the error and reject the promise if there is an error
                if (dispatchError) {
                  let errorInfo;
                  if (dispatchError.isModule) {
                    const decoded = api.registry.findMetaError(
                      dispatchError.asModule
                    );
                    errorInfo = `${decoded.section}.${decoded.name}`;
                  } else {
                    errorInfo = dispatchError.toString();
                  }
                  reject(new Error(`Transaction failed: ${errorInfo}`));
                }
              }
            );
          // if the transaction is finalized and no failures, resolve the promise
          if (status.isFinalized) {
            console.log(`Transaction finalized at : ${status.asFinalized}`);
            resolve();
          }
        }
      })
      // catch any errors and reject if there is one
      .catch((error) => {
        reject(error);
      });
  });
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

main();

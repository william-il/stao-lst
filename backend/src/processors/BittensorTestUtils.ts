/* import '@polkadot/api-augment';
import '@polkadot/api-augment/substrate';
import '@polkadot/rpc-augment';
import '@polkadot/types-augment';
import '@polkadot/types-augment/lookup';
import '@polkadot/types-augment/registry'; */
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { stringToU8a, u8aToHex } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';
import dotenv from 'dotenv';

import '@polkadot/keyring';
import '../interfaces/augment-api';
import {
  mnemonicGenerate,
  mnemonicToMiniSecret,
  randomAsHex,
} from '@polkadot/util-crypto';
import { SubmittableExtrinsic } from '@polkadot/api-base/types';
import { ISubmittableResult } from '@polkadot/types/types';
import {
  AccountId32,
  AccountInfo,
  DispatchError,
  EventRecord,
  ExtrinsicStatus,
} from '@polkadot/types/interfaces';
import { KeyringPair } from '@polkadot/keyring/types';
import EthKey from '../types/EthKey';
import { EventEmitter } from 'events';
import logger from '../utils/logger';
import HotKeyPortfolio from '../types/HotkeyPortfolio';
import { rebalanceTransactionMap } from './FinanceUtils';

export interface KeyringDataAccount {
  address: string;
  name: string;
  derivation: string;
  hotkey: boolean;
  secretKey: string;
}

export interface KeyringDataAccounts {
  title: string;
  createdAt: string;
  totalKeyrings: number;
  secretKeyDev: string;
  vaultSecretKey: string;
  accounts: {
    [key: string]: KeyringDataAccount;
  };
}

export interface BlockWrapper {
  value: number;
}

import * as path from 'path';
import { number, string } from 'yargs';
import { publicDecrypt } from 'crypto';
import Decimal from 'decimal.js';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
export default class BittensorTestUtils {
  public wsProvider: WsProvider;
  public api: ApiPromise;
  public keyring: Keyring;
  public keyringPairs: KeyringPair[];
  public keyringMap: Map<string, KeyringPair>;
  public hotKeyPairsMap: Map<string, KeyringPair>;
  public hotKeyAddressMap: Map<string, string>;
  public coldKeyPairsMap: Map<string, KeyringPair>;
  public coldKeyAddressMap: Map<string, string>;
  public keyringAddresses: string[];
  public keyringAddressesMap: Map<string, string>;
  private logger = logger;
  private WALLET_CONSTANT = BigInt(1e6);
  private walletTransactionProtectionRAO;

  constructor(
    api: ApiPromise,
    wsProvider: WsProvider,
    keyring: Keyring,
    useDefaultKeys: boolean = true
  ) {
    this.api = api;
    this.wsProvider = wsProvider;
    this.keyring = keyring;
    this.keyringPairs = [];
    this.keyringAddresses = [];
    this.hotKeyPairsMap = new Map();
    this.hotKeyAddressMap = new Map();
    this.coldKeyPairsMap = new Map();
    this.coldKeyAddressMap = new Map();
    this.keyringMap = new Map();
    this.keyringAddressesMap = new Map();
    this.walletTransactionProtectionRAO = this.WALLET_CONSTANT;
    if (useDefaultKeys) {
      this.generateDefaultKeyrings();
    } else {
      console.warn("When not using default keys, ensure to call 'setupByFile'");
    }
    this.logger.warn(
      `initialzing bittensortestutils, please ensure validator hotkeys and vault has atleast ${this.WALLET_CONSTANT} TAO`,
      {
        functionName: 'BittensorTestUtils constructor',
        WALLET_CONSTANT: this.WALLET_CONSTANT,
      }
    );
    console.warn(
      `WARNING: Hotkey wallets, and the "Vault" wallet MUST BE initialzied manually with atleast ${this.WALLET_CONSTANT} TAO`
    );
  }

  public setPairs() {
    this.keyring.getPairs().forEach((pair) => {
      this.keyringPairs.push(pair);
      this.keyringAddresses.push(pair.address);
    });
  }

  public async setupByFile() {
    try {
      await this.generateKeyringsByFile();
    } catch (error) {
      console.log('Error in setupByFile:', error);
      throw error;
    }
  }

  public regenerateMapAndAddresses() {
    let tempMap = new Map<string, KeyringPair>();
    let tempAddrMap = new Map<string, string>();
    string;
    this.keyring.getPairs().forEach((pair) => {
      if (pair.meta.name !== undefined) {
        tempMap.set(pair.meta.name, pair);
        tempAddrMap.set(pair.meta.name, pair.address);
      }
    });
    this.setPairs();
    this.keyringMap = tempMap;
    this.keyringAddressesMap = tempAddrMap;
  }

  public async getKeypairJSON(): Promise<any> {
    try {
      const module = await import('../deploymentData/keyring_data.json');
      return module.default;
    } catch (error) {
      console.error('Error in getKeypairJSON:', error);
      throw error;
    }
  }

  public async generateKeyringsByFile() {
    const keyring = new Keyring({ type: 'sr25519' });
    const hotKeyPairsMap: Map<string, KeyringPair> = new Map();
    const hotKeyAddressMap: Map<string, string> = new Map();
    const coldKeyPairsMap: Map<string, KeyringPair> = new Map();
    const coldKeyAddressMap: Map<string, string> = new Map();
    const accountData = (await this.getKeypairJSON()) as KeyringDataAccounts;
    const vaultKey = accountData.vaultSecretKey;
    const devKey = accountData.secretKeyDev;
    Object.entries(accountData.accounts).forEach(([acctName, acctData]) => {
      if (acctName === 'Vault') {
        keyring.addFromMnemonic(vaultKey, { name: acctName });
        coldKeyPairsMap.set(acctName, keyring.getPair(acctData.address));
        coldKeyAddressMap.set(acctName, acctData.address);
      } else if (acctData.hotkey) {
        keyring.addFromUri(acctData.derivation, { name: acctName });
        hotKeyPairsMap.set(acctName, keyring.getPair(acctData.address));
        hotKeyAddressMap.set(acctName, acctData.address);
      } else {
        keyring.addFromUri(acctData.derivation, {
          name: acctName,
        });
        coldKeyPairsMap.set(acctName, keyring.getPair(acctData.address));
        coldKeyAddressMap.set(acctName, acctData.address);
      }
    });
    this.keyring = keyring;
    this.hotKeyPairsMap = hotKeyPairsMap;
    this.hotKeyAddressMap = hotKeyAddressMap;
    this.coldKeyPairsMap = coldKeyPairsMap;
    this.coldKeyAddressMap = coldKeyAddressMap;
    this.regenerateMapAndAddresses();
  }

  public generateDefaultKeyrings() {
    const keyring = new Keyring({ type: 'sr25519' });
    keyring.addFromUri('//Alice', { name: 'Alice' });
    keyring.addFromUri('//Bob', { name: 'Bob' });
    keyring.addFromUri('//Charlie', { name: 'Charlie' });
    keyring.addFromUri('//Dave', { name: 'Dave' });
    keyring.addFromUri('//Eve', { name: 'Eve' });
    keyring.addFromUri('//Ferdie', { name: 'Ferdie' });
    keyring.addFromMnemonic(
      'ghost place swarm hamster furnace robot century left that basic document shop',
      { name: 'Vault' }
    );
    this.keyring = keyring;
    this.regenerateMapAndAddresses();
  }
  /*
  public generateAdditionalKeyrings(
    keyring: Keyring,
    numberToGenerate: number
  ) {
    console.log('Generating key pairs...');
    for (let i = 0; i < numberToGenerate; i++) {
      const mnemonic = mnemonicGenerate();
      keyring.addFromMnemonic(mnemonic, { name: i.toString() });
    }
    console.log(`${numberToGenerate}, Key pairs generated.`);
  }
*/
  public async getTotalColdKeyStake(
    name: string | AccountId32 | Uint8Array,
    showTrueStake: boolean = false
  ) {
    let finalColdkeyStake = 0n;
    if (typeof name === 'string') {
      if (name in this.keyringMap) {
        const coldkeystake = (
          await this.api.query.subtensorModule.totalColdkeyStake(
            this.keyringMap.get(name)!.address
          )
        ).toBigInt();
        finalColdkeyStake = coldkeystake;
      } else {
        const coldkeystake = (
          await this.api.query.subtensorModule.totalColdkeyStake(name)
        ).toBigInt();
        finalColdkeyStake = coldkeystake;
      }
    } else {
      try {
        const coldkeystake = (
          await this.api.query.subtensorModule.totalColdkeyStake(name)
        ).toBigInt();
        finalColdkeyStake = coldkeystake;
      } catch (error) {
        console.error('Error in getTotalColdKeyStake:', error);
        throw error;
      }
    }
    if (showTrueStake) {
      return finalColdkeyStake;
    } else {
      return finalColdkeyStake;
    }
  }

  /***
   * Get the amount of staked tao of a coldkey for a validator or delegate hotkey
   *
   * @param coldkey can be name or address
   * @param hotkey can be name or address
   */
  public async getColdKeyStakeForHotkey(
    coldkey: string,
    hotkey: string,
    showTrueStake: boolean = false
  ) {
    let coldkeystake;
    if (coldkey in this.keyringMap && hotkey in this.keyringMap) {
      coldkeystake = (
        await this.api.query.subtensorModule.stake(
          this.keyringMap.get(hotkey)!.address,
          this.keyringMap.get(coldkey)!.address
        )
      ).toBigInt();
    } else {
      coldkeystake = (
        await this.api.query.subtensorModule.stake(hotkey, coldkey)
      ).toBigInt();
    }

    if (showTrueStake) {
      return coldkeystake;
    } else {
      return coldkeystake;
    }
  }

  public async waitForBlocks(numberOfBlocks: number): Promise<void> {
    return new Promise<void>(async (resolve) => {
      let blockcount = numberOfBlocks;
      const startingBlock = await this.api.query.system.number();
      const unsubscribe = await this.api.query.system.number((blockNumber) => {
        console.log(
          'Current Block: ',
          blockNumber.toHuman(),
          ' waiting for: ',
          blockcount,
          ' more blocks'
        );
        blockcount -= 1;
        if (blockNumber.sub(startingBlock).gten(numberOfBlocks)) {
          unsubscribe();
          resolve();
        }
      });
    });
  }

  public async getCurrentHotKeyPortfolio(
    vaultKeyringOrAddress: KeyringPair | string = this.keyringMap.get('Vault')!
  ) {
    // parse the hotkey portfolio to an address:
    let vaultAddress;
    if (typeof vaultKeyringOrAddress === 'string') {
      // case where the vault is a name:
      if (this.keyringMap.has(vaultKeyringOrAddress)) {
        vaultAddress = this.keyringMap.get(vaultKeyringOrAddress)!.address;
      } else {
        // case where vault input is an address (sa58)
        vaultAddress = vaultKeyringOrAddress;
      }
    } else {
      // keyring
      vaultAddress = vaultKeyringOrAddress.address;
    }

    const hotKeyPortfolio: HotKeyPortfolio = {};
    const totalTaoInStake = await this.getTotalColdKeyStake(vaultAddress);

    for (let [name, address] of this.hotKeyAddressMap) {
      const taoStakedInHotKey = await this.getColdKeyStakeForHotkey(
        vaultAddress,
        address
      );

      const weight = Decimal.div(
        taoStakedInHotKey.toString(),
        totalTaoInStake.toString()
      );

      hotKeyPortfolio[name] = {
        hotKey: address,
        weight: weight,
        taoAmount: taoStakedInHotKey,
      };
    }
    return hotKeyPortfolio;
  }

  public async getNextNonce(keypair: KeyringPair) {
    return await this.api.rpc.system.accountNextIndex(keypair.address);
  }

  public async getPredictedFees(
    transaction: SubmittableExtrinsic<'promise'>,
    sender: KeyringPair | string,
    nonce: bigint
  ) {
    const info = await transaction.paymentInfo(sender, { nonce });
    console.log(
      `FEES PREDICTED \n { \n class=${info.class.toString()}, \n  weight=${info.weight.toString()}, \n partialFee=${info.partialFee.toHuman()}
        \n }`
    );
  }

  private processTransactionMapToUseable(
    transactionMap: rebalanceTransactionMap,
    shouldReadEvents: boolean = false
  ) {
    let preBatchedTransactions: SubmittableExtrinsic<
      'promise',
      ISubmittableResult
    >[] = [];
    let stakeTransactions: SubmittableExtrinsic<
      'promise',
      ISubmittableResult
    >[] = [];
    let unstakeTransactions: SubmittableExtrinsic<
      'promise',
      ISubmittableResult
    >[] = [];
    try {
      this.logger.info(
        'Starting processTransactionMapToUseable, taking stake and unstake map and processing',
        {
          functionName: 'processTransactionMapToUseable',
          transactionMap: transactionMap,
        }
      );
      let index = 0;
      for (const name in transactionMap) {
        const taoAmount = transactionMap[name].taoAmount;
        const hotKey = transactionMap[name].hotKey;
        const type = transactionMap[name].type;
        if (type === 'unstake') {
          const absTaoAmount = -taoAmount;
          unstakeTransactions.push(
            this.api.tx.subtensorModule.removeStake(hotKey, absTaoAmount)
          );
        } else if (type === 'stake') {
          stakeTransactions.push(
            this.api.tx.subtensorModule.addStake(hotKey, taoAmount)
          );
        }

        if (shouldReadEvents) {
          console.log(
            `Batching Transactions: `,
            index + 1,
            ' of ',
            Object.keys(transactionMap).length,
            '\ntype of: ',
            type,
            ' : ',
            name,
            ': ',
            hotKey,
            ' -> ',
            taoAmount
          );
        }
        index++;
      }
    } catch (error) {
      this.logger.error('Error in processTransactionMapToUseable', error, {
        functionName: 'processTransactionMapToUseable',
        transactionMap: transactionMap,
      });
      throw error;
    }
    preBatchedTransactions = [...unstakeTransactions, ...stakeTransactions];
    this.logger.info('Completed processTransactionMapToUseable', {
      functionName: 'processTransactionMapToUseable',
      transactionMap: transactionMap,
    });

    /* preBatchedTransactions.forEach((tx) => {
      console.log('Prebatched Transactions: ', tx.toHuman());
    }); */

    return preBatchedTransactions;
  }

  public async batchStakingUnstakingRequest(
    sender: KeyringPair,
    stakeTransactionMap: rebalanceTransactionMap,
    shouldReadEvents: boolean = false
  ) {
    const batchTx = new Promise(async (resolve, reject) => {
      this.logger.info('Starting Batch Staking/Unstaking Request', {
        functionName: 'batchStakingUnstakingRequest',
        senderAddress: sender.address,
        transactionMap: stakeTransactionMap,
      });
      const nonce = await this.api.rpc.system.accountNextIndex(sender.address);
      let preBatchedTransactions: any[] = [];

      preBatchedTransactions = this.processTransactionMapToUseable(
        stakeTransactionMap,
        shouldReadEvents
      );

      const info = await this.api.tx.utility
        .batchAll(preBatchedTransactions)
        .paymentInfo(sender, { nonce });
      if (shouldReadEvents) {
        console.log(
          `\nclass=${info.class.toString()}, weight=${info.weight.toString()}, partialFee=${info.partialFee.toHuman()}`,
          info.partialFee
        );
      }
      const batchTransactions = this.api.tx.utility.batchAll(
        preBatchedTransactions
      );
      if (shouldReadEvents) {
        console.log(`Signing and sending batched transaction`);
      }
      batchTransactions
        .signAndSend(sender, { nonce }, ({ status, events }) => {
          if (status.isInBlock) {
            console.log(
              `Transaction included at blockHash ${status.asInBlock}`
            );
          } else if (status.isFinalized) {
            console.log(
              `Transaction finalized at blockHash ${status.asFinalized}`
            );
            if (shouldReadEvents) {
              events.forEach(({ event }) => {
                console.log(
                  `\n\t${event.section}.${event.method}:: ${event.data}`
                );
                if (this.api.events.system.ExtrinsicFailed.is(event)) {
                  const [dispatchError, dispatchInfo] = event.data;
                  let errorInfo;
                  errorInfo = dispatchError.toHuman();
                  console.error(`Error in batch transfer request: `, errorInfo);
                  console.error(
                    `Error dispatchInfo : `,
                    dispatchInfo.toHuman()
                  );
                  reject(new Error('Batch transfer request failed'));
                }
              });
            }
            const extrinsicFailed = events.find(({ event }) => {
              return this.api.events.system.ExtrinsicFailed.is(event);
            });
            if (extrinsicFailed) {
              reject(new Error('Batch transfer request failed'));
            } else {
              resolve(status.asFinalized);
            }
          } else if (status.isInvalid) {
            reject(new Error('Batch transfer request is invalid'));
          }
        })
        .catch(reject);
    });
    try {
      await batchTx;
      this.logger.info('Batch Staking/Unstaking Request Complete', {
        functionName: 'batchStakingUnstakingRequest',
        senderAddress: sender.address,
        transactionMap: stakeTransactionMap,
      });

      if (shouldReadEvents) {
        console.log(`Batch transfer request complete`);
      }
    } catch (error) {
      this.logger.error('Error in batch transfer request:', error, {
        functionName: 'batchStakingUnstakingRequest',
        senderAddress: sender.address,
        transactionMap: stakeTransactionMap,
      });
      console.error('Error in batch transfer request:', error);
      throw error;
    }
  }

  public async batchTransferRequest(
    sender: KeyringPair,
    transactionMap: Map<string, bigint>,
    shouldReadEvents: boolean = false
  ): Promise<void> {
    const batchTx = new Promise(async (resolve, reject) => {
      const nonce = await this.api.rpc.system.accountNextIndex(sender.address);
      let preBatchedTransactions: any[] = [];
      let index = 0;
      transactionMap.forEach((amount, recipient) => {
        console.log(
          `Batching Transactions: ${index} of ${transactionMap.size}: ${recipient} -> ${amount}`
        );
        preBatchedTransactions.push(
          this.api.tx.balances.transferAllowDeath(recipient, amount)
        );
        index++;
      });
      const info = await this.api.tx.utility
        .batchAll(preBatchedTransactions)
        .paymentInfo(sender, { nonce });
      console.log(
        `class=${info.class.toString()}, weight=${info.weight.toString()}, partialFee=${info.partialFee.toHuman()}`
      );

      const batchTransactions = this.api.tx.utility.batchAll(
        preBatchedTransactions
      );
      console.log(`Signing and sending batched transaction`);
      batchTransactions
        .signAndSend(sender, { nonce }, ({ status, events }) => {
          if (status.isInBlock) {
            console.log(
              `Transaction included at blockHash ${status.asInBlock}`
            );
          } else if (status.isFinalized) {
            console.log(
              `Transaction finalized at blockHash ${status.asFinalized}`
            );
            if (shouldReadEvents) {
              events.forEach(({ event }) => {
                console.log(
                  `\t${event.section}.${event.method}:: ${event.data}`
                );
              });
            }
            const extrinsicFailed = events.find(({ event }) => {
              return this.api.events.system.ExtrinsicFailed.is(event);
            });
            if (extrinsicFailed) {
              reject(new Error('Batch transfer request failed'));
            } else {
              resolve(status.asFinalized);
            }
          } else if (status.isInvalid) {
            reject(new Error('Batch transfer request is invalid'));
          }
        })
        .catch(reject);
    });
    try {
      await batchTx;
      console.log(`Batch transfer request complete`);
    } catch (error) {
      console.error('Error in batch transfer request:', error);
      throw error;
    }
  }

  private handleTransactionStatus(
    {
      status,
      events,
      dispatchError,
    }: {
      status: ExtrinsicStatus;
      events: EventRecord[];
      dispatchError: DispatchError | undefined;
    },
    shouldReadEvents: boolean,
    resolve: (value: any) => void,
    reject: (reason?: any) => void
  ) {
    if (status.isInBlock) {
      console.log(`Transaction included at blockHash ${status.asInBlock}`);
    } else if (status.isFinalized) {
      console.log(`Transaction finalized at blockHash ${status.asFinalized}`);
      if (shouldReadEvents) {
        this.logEvents(events);
      }
      this.handleFinalizedTransaction(
        {
          status,
          events,
          dispatchError,
        },
        resolve,
        reject
      );
    } else if (status.isInvalid) {
      reject(new Error('Transaction is invalid'));
    }
  }

  private logEvents(events: EventRecord[]) {
    events.forEach(({ event }) => {
      console.log(`\t${event.section}.${event.method}:: ${event.data}`);
    });
  }

  private decodeEventsErrors(dispatchError: DispatchError | undefined) {
    const metadata: Record<string, unknown> = {};
    try {
      if (dispatchError) {
        if (dispatchError.isModule) {
          const decoded = this.api.registry.findMetaError(
            dispatchError.asModule
          );
          const { docs, name, section } = decoded;

          console.error(`${section}.${name}: ${docs.join(' ')}`);
          metadata['errorInfo'] = `${section}.${name}: ${docs.join(' ')}`;
          metadata['errorType'] = 'canBeDecoded';
          throw new Error('Decodeable error when extrinsic failed');
        } else {
          console.error(dispatchError.toString());
          metadata['errorInfo'] = dispatchError.toString();
          metadata['errorType'] = 'cannotBeDecoded';
          throw new Error('Non-decodable Error when extrinsic failed');
        }
      }
    } catch (error) {
      this.logger.error(
        'Error within transacation, extrinsic failed',
        error,
        metadata
      );
    }
  }
  private handleFinalizedTransaction(
    {
      status,
      events,
      dispatchError,
    }: {
      status: ExtrinsicStatus;
      events: EventRecord[];
      dispatchError: DispatchError | undefined;
    },
    resolve: (value: any) => void,
    reject: (reason?: any) => void
  ) {
    const extrinsicFailed = events.find(({ event }) => {
      return this.api.events.system.ExtrinsicFailed.is(event);
    });
    if (extrinsicFailed) {
      this.decodeEventsErrors(dispatchError);
      reject(new Error('Transaction failed'));
    } else {
      resolve(status.asFinalized);
    }
  }

  public async getStakingInterval() {
    console.log(
      (await this.api.query.subtensorModule.stakeInterval()).toHuman()
    );
    console.log(
      (await this.api.query.subtensorModule.targetStakesPerInterval()).toHuman()
    );
  }

  public async getTransferFee(sender: KeyringPair, recipient: KeyringPair) {
    const transferTx = this.api.tx.balances.transferAllowDeath(
      recipient.address,
      1n
    );
    const nonce = await this.getNextNonce(sender);
    const info = await transferTx.paymentInfo(sender, { nonce });
    console.log('Singular Transfer Fee Info: ', info.toHuman().partialFee);
  }

  public async sendTransactionSecure(
    sender: KeyringPair,
    recipient: KeyringPair | string,
    amount: bigint,
    shouldReadEvents: boolean = false
  ): Promise<void> {
    return new Promise(async (resolve) => {
      const nonce = await this.api.rpc.system.accountNextIndex(sender.address);
      if (shouldReadEvents) {
        console.log(`Nonce for ${sender.address}: ${nonce}`);
      }

      await this.api.tx.balances
        .transferAllowDeath(
          typeof recipient === 'string' ? recipient : recipient.address,
          amount
        )
        .signAndSend(sender, { nonce }, ({ status, events }) => {
          if (status.isInBlock) {
            console.log(
              `Transaction included at blockHash ${status.asInBlock}`
            );
          } else if (status.isFinalized) {
            console.log(
              `Transaction finalized at blockHash ${status.asFinalized}`
            );
            if (shouldReadEvents) {
              events.forEach(({ event }) => {
                console.log(
                  `\t${event.section}.${event.method}:: ${event.data}`
                );
                //console.log(event.toHuman());
              });
            }
            resolve();
          }
        });
    });
  }

  public async addStakeSecure(
    sender: KeyringPair,
    recipient: string,
    amount: bigint,
    shouldReadEvents: boolean = false
  ): Promise<void> {
    this.logger.logger.profile('addStakeSecure');
    const stakeSecurely = new Promise(async (resolve, reject) => {
      this.logger.info('Adding Stake Securely With Tao', {
        functionName: 'addStakeSecure',
        senderAddress: sender.address,
        recipientAddress: recipient,
        amountSent: amount,
      });

      const nonce = await this.api.rpc.system.accountNextIndex(sender.address);

      if (shouldReadEvents) {
        console.log(`Nonce for ${sender.address}: ${nonce}`);
        console.log(
          `Start staking request to ${recipient}, amt: ${this.formatHumanReadableNumber(amount.toString())}`
        );
      }

      await this.api.tx.subtensorModule
        .addStake(recipient, amount)
        .signAndSend(sender, { nonce }, ({ status, events, dispatchError }) => {
          return this.handleTransactionStatus(
            { status, events, dispatchError },
            shouldReadEvents,
            resolve,
            reject
          );
        })
        .catch(reject);
    });

    try {
      await stakeSecurely;
    } catch (error) {
      this.logger.error('Error in addStakeSecure', error, {
        functionName: 'addStakeSecure',
        senderAddress: sender.address,
        recipientAddress: recipient,
        amountSent: amount,
      });
      throw error;
    }
    this.logger.info('Completed Adding Stake Securely With Tao', {
      functionName: 'addStakeSecure',
      senderAddress: sender.address,
      recipientAddress: recipient,
      amountStaked: amount,
    });
    this.logger.logger.profile('addStakeSecure');
  }

  public async removeStakeSecure(
    sender: KeyringPair,
    recipient: string,
    amount: bigint,
    shouldReadEvents: boolean = false
  ): Promise<void> {
    this.logger.logger.profile('removeStakeSecure');
    const removeStakeSecurely = new Promise(async (resolve, reject) => {
      this.logger.info('Removing Stake Securely From Tao Wallet', {
        functionName: 'removeStakeSecure',
        senderAddress: sender.address,
        recipientAddress: recipient,
        amountSent: amount,
      });
      const nonce = await this.api.rpc.system.accountNextIndex(sender.address);
      if (shouldReadEvents) {
        console.log(`Nonce for ${sender.address}: ${nonce}`);
      }

      await this.api.tx.subtensorModule
        .removeStake(recipient, amount)
        .signAndSend(sender, { nonce }, ({ status, events, dispatchError }) => {
          return this.handleTransactionStatus(
            { status, events, dispatchError },
            shouldReadEvents,
            resolve,
            reject
          );
        })
        .catch(reject);
    });
    try {
      await removeStakeSecurely;
    } catch (error) {
      this.logger.error('Error in removeStakeSecure', error, {
        functionName: 'removeStakeSecure',
        senderAddress: sender.address,
        recipientAddress: recipient,
        amountSent: amount,
      });
      throw error;
    }
    this.logger.info('Completed Removing Stake Securely From Tao Wallet', {
      functionName: 'removeStakeSecure',
      senderAddress: sender.address,
      recipientAddress: recipient,
      amountSent: amount,
    });
    this.logger.logger.profile('removeStakeSecure');
  }

  public async quickSendWithFinality(
    sender: KeyringPair,
    recipient: KeyringPair,
    amountToSend: bigint | bigint[],
    numberOfTransactions: number
  ): Promise<void> {
    if (
      Array.isArray(amountToSend) &&
      amountToSend.length !== numberOfTransactions
    ) {
      throw new Error(
        'Amount to send array length does not match number of transactions'
      );
    }
    const transactions = [];
    let startingNonce = await this.api.rpc.system.accountNextIndex(
      sender.address
    );
    console.log(
      `Starting quick send with finality, sending ${numberOfTransactions} transactions`
    );
    for (let i = 0; i < numberOfTransactions; i++) {
      const sendAmt = Array.isArray(amountToSend)
        ? amountToSend[i]
        : amountToSend;
      const nonce = startingNonce.addn(i);

      const newTxPromise = new Promise((resolve, reject) => {
        this.api.tx.balances
          .transferAllowDeath(recipient.address, sendAmt)
          .signAndSend(sender, { nonce }, ({ status, events }) => {
            if (status.isFinalized) {
              console.log(`Transaction ${i} finalized`);
              const extrinsicFailed = events.find(({ event }) => {
                return this.api.events.system.ExtrinsicFailed.is(event);
              });
              if (extrinsicFailed) {
                reject(new Error(`Transaction ${i} failed after finalization`));
              } else {
                resolve(` resolution/finalized hash ${status.asFinalized}`);
              }
            } else if (status.isInvalid) {
              reject(new Error(`Transaction ${i} is invalid`));
            }
          })
          .catch(reject);
      });
      transactions.push(newTxPromise);
    }

    try {
      await Promise.all(transactions);
      console.log(
        `Quick Send with Finality Complete, ${numberOfTransactions} transactions sent`
      );
    } catch (error) {
      console.error(
        'Error in quick send with finality, one or more transactions failed:',
        error
      );
      throw error;
    }
  }

  /***
   * deprecated function
   */
  public async initalizeMinersValidators(
    sender: KeyringPair,
    pubKeys: string[]
  ) {
    const transMap = new Map<string, bigint>();
    pubKeys.forEach((address) => {
      transMap.set(address, BigInt(1000e9));
    });
    console.log(
      `\n Starting a batch transfer request within initalize miners & validators, sent amount is 1000e9`
    );
    await this.batchTransferRequest(sender, transMap);
    return await this.getBalances(pubKeys);
  }

  public formatHumanReadableNumber(
    input: string,
    decimalSpacing: boolean = false
  ): string {
    // Remove commas from the input string
    const cleanedInput = input.replace(/,/g, '');

    // Convert to a number
    let num = BigInt(cleanedInput);

    // Convert the number to a string and ensure it has at least 9 digits by adding leading zeros if necessary
    let numString = num.toString().padStart(10, '0');

    // Insert the decimal point after the first 9 digits
    const integerPart = numString.slice(0, -9);
    let decimalPart = numString.slice(-9);

    // Add commas to the integer part
    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ','
    );

    // Add underscores to the decimal part
    if (decimalSpacing) {
      decimalPart = decimalPart.replace(/(\d{3})(?=\d)/g, '$1_');
    }

    return `${formattedIntegerPart}.${decimalPart}`;
  }

  public async getBalances(
    accounts: KeyringPair[] | string[],
    prettier: boolean = false
  ) {
    let balancesAcc = [];
    for (let i = 0; i < accounts.length; i++) {
      if ((accounts[i] as KeyringPair).address !== undefined) {
        let balance = await this.api.query.system.account(
          (accounts[i] as KeyringPair).address
        );
        balancesAcc.push(balance.data.free.toHuman());
      } else {
        let balance = await this.api.query.system.account(
          accounts[i] as string
        );
        balancesAcc.push(balance.data.free.toHuman());
      }
    }
    if (prettier) {
      balancesAcc.forEach((balance, index) => {
        console.log(
          `Account at index: ${index} has balance of : ${this.formatHumanReadableNumber(balance)} tao`
        );
      });
    }
    return balancesAcc;
  }

  public async getAllAccountData(
    shouldPrint: boolean = false,
    onlyFree: boolean = false
  ) {
    let accountMap = new Map<string, any>();
    this.keyringMap.forEach(async (value, key) => {
      const accountData = await this.api.query.system.account(value.address);
      if (shouldPrint && onlyFree) {
        console.log(
          `Account: ${key} has free balance of: ${accountData.data.free.toHuman()}`
        );
      } else if (shouldPrint) {
        console.log(`Account: ${key} has data: `, accountData.toHuman());
      }
      if (onlyFree) {
        accountMap.set(key, accountData.data.free.toHuman());
      } else {
        accountMap.set(key, accountData);
      }
    });
    return accountMap;
  }

  public async getAccountData(
    account: string,
    shouldPrint: boolean = false,
    onlyFree: boolean = false
  ) {
    const keypair = this.keyringMap.get(account);
    let accountMap: { name: string; data: any };
    let accountData = undefined;
    if (keypair !== undefined) {
      accountData = await this.api.query.system.account(keypair.address);
    } else {
      throw new Error('account name not found');
    }

    if (shouldPrint && onlyFree) {
      console.log(
        `Account: ${account} has free balance of: ${accountData.data.free.toHuman()}`
      );
    } else if (shouldPrint) {
      console.log(
        `Account: ${account} has balances of: `,
        accountData.toHuman()
      );
    }
    if (onlyFree) {
      accountMap = { name: account, data: accountData.data.free.toHuman() };
    } else {
      accountMap = { name: account, data: accountData };
    }
    return accountMap;
  }
  //FrameSystemAccountInfo

  public async getSingularBalance(account: KeyringPair) {
    const balance = await this.api.query.system.account(account.address);
    return balance;
  }

  public async subscribeToFinalizedBalance(keyPair: KeyringPair) {
    let lastKnownBalance = '';
    const unsubscribe = await this.api.rpc.chain.subscribeFinalizedHeads(
      async (finalHeader) => {
        const apiAt = await this.api.at(finalHeader.hash);
        const accountData = await apiAt.query.system.account(keyPair.address);
        const currentBalance = accountData.data.free.toHuman();

        if (currentBalance !== lastKnownBalance) {
          console.log(
            `${keyPair.meta.name} updated balance based on finalized header2:`
          );
          console.log(`${keyPair.meta.name} balance2: ${currentBalance}`);
          lastKnownBalance = currentBalance;
        }
      }
    );
    return unsubscribe;
  }

  /***
   * Deprecated block subscription.
   * Should only be used if you wanto use block subscription to look for a different event
   */
  public async blockSubscription() {
    const blockHash = await this.api.rpc.chain.subscribeFinalizedHeads(
      async (finalizedHeader) => {
        console.log('\n---');
        console.log('Aquiring new block...');
        console.log('block number: ', finalizedHeader.toHuman().number);
        console.log('block hash: ', finalizedHeader.hash.toHuman());

        const signedBlock = await this.api.rpc.chain.getBlock(
          finalizedHeader.hash
        );
        const apiAt = await this.api.at(finalizedHeader.hash);
        const allRecords = await apiAt.query.system.events();
        const filteredEx = signedBlock.block.extrinsics;
        filteredEx.forEach((ex, index) => {
          try {
            const {
              method: { method, section },
            } = ex;
            const transactionEx = console.log(
              `Processing transaction extrinsic ${index}:`
            );
            let validEmit = false;
            let toEmit = [];
            const events = allRecords
              .filter(({ phase }) => {
                return (
                  phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index)
                );
              })
              .forEach(({ event }) => {
                console.log(
                  `new event: ${event.section}.${event.method} from ${section}.${method}`
                );
                if (
                  this.api.events.system.ExtrinsicSuccess.is(event) &&
                  !section.includes('timestamp')
                ) {
                  const [dispatchInfo] = event.data;
                  console.log(
                    `${section}.${method}:: ExtrinsicSuccess:: ${JSON.stringify(dispatchInfo.toHuman())}`
                  );
                  validEmit = true;
                } else if (this.api.events.system.ExtrinsicFailed.is(event)) {
                  const [dispatchError, dispatchInfo] = event.data;
                  let errorInfo;

                  // decode error
                  if (dispatchError.isModule) {
                    const decoded = this.api.registry.findMetaError(
                      dispatchError.asModule
                    );
                    errorInfo = `${decoded.section}.${decoded.name}`;
                  } else {
                    errorInfo = dispatchError.toString();
                  }
                }
                if (!section.includes('timestamp')) {
                  console.log(event.toHuman());
                  toEmit.push(event);
                }
              });
          } catch (error) {
            console.error(`Error processing extrinsic ${index}:`);
            if (error instanceof Error) {
              console.error('Error message:', error.message);
              console.error('Error stack:', error.stack);
            } else {
              console.error('An unknown error occurred:', error);
            }
            console.log('Problematic extrinsic:', ex.toJSON());
          }
          console.log('---\n');
        });
      }
    );
    return blockHash;
  }

  public convertToCodeReadableBigInt(
    humanReadableNumber: string
  ): bigint | null {
    // Validate the input using a regular expression
    const isValid = /^-?\d{1,3}(,\d{3})*(\.\d+)?$/.test(humanReadableNumber);
    if (!isValid) {
      console.error('Invalid number format');
      return null;
    }

    // Remove the commas and convert to bigint
    const numberWithoutCommas = humanReadableNumber.replace(/,/g, '');
    return BigInt(numberWithoutCommas);
  }
  public async blockSubscriptionToTransfer(
    eventEmitter: EventEmitter,
    toAddress: string,
    lastBlock: BlockWrapper,
    shouldLog: boolean = false
  ) {
    const blockHash = await this.api.rpc.chain.subscribeFinalizedHeads(
      async (finalizedHeader) => {
        if (shouldLog) {
          console.log('\n---');
          console.log('Aquiring new block...');
          console.log('block number: ', finalizedHeader.toHuman().number);
          console.log('block hash: ', finalizedHeader.hash.toHuman());
        }

        const blockNum = finalizedHeader.number.toNumber();

        const signedBlock = await this.api.rpc.chain.getBlock(
          finalizedHeader.hash
        );
        const apiAt = await this.api.at(finalizedHeader.hash);
        const allRecords = await apiAt.query.system.events();
        const filteredEx = signedBlock.block.extrinsics;
        filteredEx.forEach((ex, index) => {
          try {
            const {
              method: { method, section },
            } = ex;
            if (shouldLog) {
              const transactionEx = console.log(
                `Processing transaction extrinsic ${index}:`
              );
            }
            let validEmit = false;
            let toEmit: {
              from: string;
              to: string;
              amount: bigint;
            }[] = [];
            const events = allRecords
              .filter(({ phase }) => {
                return (
                  phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index)
                );
              })
              .forEach(({ event }) => {
                if (shouldLog) {
                  console.log(
                    `new event: ${event.section}.${event.method} from ${section}.${method}`
                  );
                }

                if (
                  this.api.events.system.ExtrinsicSuccess.is(event) &&
                  !section.includes('timestamp')
                ) {
                  const [dispatchInfo] = event.data;
                  console.log(
                    `${section}.${method}:: ExtrinsicSuccess:: ${JSON.stringify(dispatchInfo.toHuman())}`
                  );
                  validEmit = true;
                } else if (this.api.events.system.ExtrinsicFailed.is(event)) {
                  const [dispatchError, dispatchInfo] = event.data;
                  let errorInfo;

                  // decode error
                  if (dispatchError.isModule) {
                    const decoded = this.api.registry.findMetaError(
                      dispatchError.asModule
                    );
                    errorInfo = `${decoded.section}.${decoded.name}`;
                  } else {
                    errorInfo = dispatchError.toString();
                  }
                }
                if (!section.includes('timestamp')) {
                  if (shouldLog) {
                    console.log(event.toHuman());
                  }

                  if (
                    event.section?.toLowerCase() === 'balances' &&
                    event.method?.toLowerCase() === 'transfer'
                  ) {
                    if (
                      event.data.to.toString().toLowerCase() ===
                      toAddress.toLowerCase()
                    ) {
                      const amountAsNumber = this.convertToCodeReadableBigInt(
                        event.toHuman().data.amount
                      );
                      if (amountAsNumber !== null) {
                        const obj = {
                          from: event.toHuman().data.from,
                          to: event.toHuman().data.to,
                          amount: amountAsNumber,
                        };
                        toEmit.push(obj);
                      }
                    }
                  }
                }
              });
            if (validEmit && toEmit.length > 0) {
              toEmit.forEach(({ from, to, amount }) => {
                console.log(`\nTransfer from ${from} to ${to} of ${amount}\n`);
                eventEmitter.emit('receiveTransfer', {
                  from,
                  to,
                  amount,
                });
              });
              lastBlock = {
                value: blockNum,
              };
            }
          } catch (error) {
            console.error(`Error processing extrinsic ${index}:`);
            if (error instanceof Error) {
              console.error('Error message:', error.message);
              console.error('Error stack:', error.stack);
            } else {
              console.error('An unknown error occurred:', error);
            }
            console.log('Problematic extrinsic:', ex.toJSON());
          }
          if (shouldLog) {
            console.log('---\n');
          }
        });
      }
    );
    return blockHash;
  }

  public signMessage(
    keyringPair: KeyringPair,
    message: string | Uint8Array
  ): Uint8Array {
    console.log(
      `KeyringPair: ${keyringPair.address} signing message: ${message}`
    );
    return keyringPair.sign(message);
  }

  public signMessageAsHex(
    keyringPair: KeyringPair,
    message: string | Uint8Array,
    log: boolean = false
  ): string {
    if (log) {
      console.log(
        `KeyringPair: ${keyringPair.address} signing message: ${message}`
      );
    }
    return u8aToHex(keyringPair.sign(message));
  }

  public verifyMessage(
    message: string | Uint8Array,
    signature: string | Uint8Array,
    publicAddress: string | Uint8Array,
    log: boolean = false
  ) {
    const { isValid } = signatureVerify(message, signature, publicAddress);
    if (log) {
      if (signature instanceof Uint8Array) {
        console.log(
          `${u8aToHex(signature)} is ${isValid ? 'valid' : 'invalid'}`
        );
      } else {
        console.log(`${signature} is ${isValid ? 'valid' : 'invalid'}`);
      }
    }
    return isValid;
  }
  public findValidEthAddressInEthKeys(
    ethKeys: EthKey[],
    publicAddress: string | Uint8Array,
    log: boolean = false
  ) {
    let foundIndex = 0;
    let foundAddress = '';
    let foundSignature: string = '';
    try {
      ethKeys.forEach(({ address, signature }, index) => {
        if (
          this.verifyMessage(address, signature, publicAddress) &&
          index >= foundIndex
        ) {
          foundAddress = address;
          foundSignature = signature;
          foundIndex = index;
          if (log) {
            console.log(
              `\n Found valid address: ${foundAddress} with signature: \n ${foundSignature} at index ${foundIndex}`
            );
          }
        } else {
          if (log) {
            console.log(
              `\n Invalid address: ${address} with signature: \n ${signature} at index ${index}`
            );
          }
        }
      });
      if (foundAddress === '' || foundSignature.length === 0) {
        console.error("Couldn't find a valid message/signature pair");
        return false;
      } else {
        return { address: foundAddress, signature: foundSignature };
      }
    } catch (error) {
      throw error;
    }
  }
}

/*
 public generateAdditionalKeyrings(
        keyring: Keyring,
        numberToGenerate: number
    ) {
        console.log('Generating key pairs...');
        for (let i = 0; i < numberToGenerate; i++) {
            const mnemonic = mnemonicGenerate();
            this.keyring.addFromMnemonic(mnemonic, { name: i.toString() });
        }
        console.log(`${numberToGenerate}, Key pairs generated.`);
    }

    public async signMessage(
        message: string,
        keypairAccessor?: number | string
    ) {
        const keypairArray = this.keyring.getPairs();
        if (typeof keypairAccessor === 'number') {
            return keypairArray[keypairAccessor].sign(message);
        } else if (typeof keypairAccessor === 'string') {
            return this.keypairAccessorMapping[keypairAccessor].sign(message);
        } else {
            console.warn(
                'Sign Message function did not recevive a valid keypair accessor, defaulting to keypair 0 (Alice)'
            );
        }
    }
    public async sendTransaction(
        sender: KeyringPair,
        recipient: KeyringPair | string,
        amount: bigint
    ): Promise<void> {
        return new Promise(async (resolve) => {
            const nonce = await this.api.rpc.system.accountNextIndex(
                sender.address
            );
            console.log(`Nonce for ${sender.address}: ${nonce}`);

            await this.api.tx.balances
                .transferAllowDeath(
                    typeof recipient === 'string'
                        ? recipient
                        : recipient.address,
                    amount
                )
                .signAndSend(sender, { nonce }, ({ status, events }) => {
                    if (status.isInBlock) {
                        console.log(
                            `Transaction included at blockHash ${status.asInBlock}`
                        );
                    } else if (status.isFinalized) {
                        console.log(
                            `Transaction finalized at blockHash ${status.asFinalized}`
                        );
                        events.forEach(
                            ({ event: { data, method, section } }) => {
                                console.log(`\t${section}.${method}:: ${data}`);
                            }
                        );
                        resolve();
                    }
                });
        });
    }

    public async getBalances(accounts: KeyringPair[]) {
        let balancesAcc = [];
        for (let i = 0; i < accounts.length; i++) {
            let balance = await this.api.query.system.account(
                accounts[i].address
            );
            balancesAcc.push(balance);
        }
        return balancesAcc;
    }

    public async getSingularBalance(account: KeyringPair) {
        const balance = await this.api.query.system.account(account.address);
        return balance;
    }

    public async subscribeToFinalizedBalance(keyPair: KeyringPair) {
        let lastKnownBalance = '';
        const unsubscribe = await this.api.rpc.chain.subscribeNewHeads(
            async (header) => {
                // Check if the block is finalized
                const finalizedHash =
                    await this.api.rpc.chain.getFinalizedHead();
                const finalizedHeader =
                    await this.api.rpc.chain.getHeader(finalizedHash);

                if (header.number.eq(finalizedHeader.number)) {
                    // This block is finalized, so let's check Bob's balance
                    const accountInfo = await this.api.query.system.account(
                        keyPair.address
                    );
                    const currentBalance = accountInfo.data.free.toString();

                    if (currentBalance !== lastKnownBalance) {
                        console.log(
                            `${keyPair.meta.name} updated balance based on finalized header:`
                        );
                        console.log(
                            `${keyPair.meta.name} balance: ${currentBalance}`
                        );
                        lastKnownBalance = currentBalance;
                    }
                }
            }
        );
        return unsubscribe;
    }

    private async blockHandler() {}
    */

/*
    public signMessage(
        keyringPair: KeyringPair,
        message: string | Uint8Array
    ): Uint8Array {
        if (typeof message === 'string') {
            const translated = stringToU8a(message);
        }
        console.log(
            `KeyringPair: ${keyringPair.address} signing message: ${message}`
        );
        return keyringPair.sign(message);
    }
    public verifyMessage(
        message: string | Uint8Array,
        signature: Uint8Array,
        publicAddress: string | Uint8Array,
        log: boolean = false
    ) {
        const { isValid } = signatureVerify(message, signature, publicAddress);
        if (log) {
            console.log(
                `${u8aToHex(signature)} is ${isValid ? 'valid' : 'invalid'}`
            );
        }
        return isValid;
    }
    */

/*    public findValidEthAddressInEthKeys(
        ethKeys: {
            address: string;
            signature: Uint8Array;
        }[],
        publicAddress: string | Uint8Array,
        log: boolean = false
    ) {
        let foundIndex = 0;
        let foundAddress = '';
        let foundSignature: Uint8Array = new Uint8Array();
        ethKeys.forEach(({ address, signature }, index) => {
            if (
                this.verifyMessage(address, signature, publicAddress) &&
                index >= foundIndex
            ) {
                foundAddress = address;
                foundSignature = signature;
                foundIndex = index;
                if (log) {
                    console.log(
                        `\n Found valid address: ${foundAddress} with signature: \n ${u8aToHex(foundSignature)} at index ${foundIndex}`
                    );
                }
            } else {
                if (log) {
                    console.log(
                        `\n Invalid address: ${address} with signature: \n ${u8aToHex(signature)} at index ${index}`
                    );
                }
            }
        });
        if (foundAddress === '' || foundSignature.length === 0) {
            console.error("Couldn't find a valid message/signature pair");
            return false;
        } else {
            return { address: foundAddress, signature: foundSignature };
        }
    }
        */

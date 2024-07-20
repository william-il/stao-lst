import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { decorateConstants } from '@polkadot/types';
import { stringToU8a, u8aToHex } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';
import bitData from '../data/bitData';
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
import { AccountInfo } from '@polkadot/types/interfaces';
import { KeyringPair } from '@polkadot/keyring/types';
import coldKeys, { hotKeys } from '../data/bittensorTestWallets';
import EthKey from '../types/EthKey';
import { EventEmitter } from 'events';
import { ethers } from 'ethers';

interface BlockWrapper {
  value: number;
}
import * as path from 'path';
import { string } from 'yargs';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
export default class BittensorTestUtils {
  public wsProvider: WsProvider;
  public api: ApiPromise;
  public keyring: Keyring;
  public keyringPairs: KeyringPair[];
  public keyringMap: Map<string, KeyringPair>;
  public delegatesList: string[];
  public keyringAddresses: string[];
  public keyringAddressesMap: Map<string, string>;

  constructor(
    api: ApiPromise,
    wsProvider: WsProvider,
    keyring: Keyring,
    generateKeyPairs?: number
  ) {
    this.api = api;
    this.wsProvider = wsProvider;
    this.keyring = keyring;
    this.keyringPairs = [];
    this.keyringAddresses = [];
    this.generateKeyrings(this.keyring);
    if (generateKeyPairs !== undefined) {
      this.generateAdditionalKeyrings(this.keyring, generateKeyPairs);
    }
    this.delegatesList = [];
    hotKeys.forEach(({ name, hotkey }) => {
      this.delegatesList.push(hotkey);
    });
    this.setPairs();
    this.keyringMap = new Map();
    this.keyringAddressesMap = new Map();
    this.regenerateMapAndAddresses();
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

  public generateKeyrings(keyring: Keyring) {
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
  }

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
        .batch(preBatchedTransactions)
        .paymentInfo(sender, { nonce });
      console.log(
        `class=${info.class.toString()}, weight=${info.weight.toString()}, partialFee=${info.partialFee.toHuman()}`
      );
      const batchTransactions = this.api.tx.utility.batch(
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
    console.log('\nPayment Info: ', info.toHuman().partialFee);
  }

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

  public async sendTransactionSecure(
    sender: KeyringPair,
    recipient: KeyringPair | string,
    amount: bigint,
    shouldReadEvents: boolean = false
  ): Promise<void> {
    return new Promise(async (resolve) => {
      const nonce = await this.api.rpc.system.accountNextIndex(sender.address);
      console.log(`Nonce for ${sender.address}: ${nonce}`);

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
    return new Promise(async (resolve) => {
      const nonce = await this.api.rpc.system.accountNextIndex(sender.address);
      if (shouldReadEvents) {
        console.log(`Nonce for ${sender.address}: ${nonce}`);
      }
      console.log(
        `Start staking request to ${recipient}, amt: ${this.formatHumanReadableNumber(amount.toString())}`
      );
      await this.api.tx.subtensorModule
        .addStake(recipient, amount)
        .signAndSend(sender, { nonce }, ({ status, events }) => {
          if (status.isInBlock) {
            console.log(
              `Staking Transaction included at blockHash ${status.asInBlock}`
            );
          } else if (status.isFinalized) {
            console.log(
              `Staking Transaction finalized at blockHash ${status.asFinalized}`
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

  public async removeStakeSecure(
    sender: KeyringPair,
    recipient: string,
    amount: bigint,
    shouldReadEvents: boolean = false
  ): Promise<void> {
    return new Promise(async (resolve) => {
      const nonce = await this.api.rpc.system.accountNextIndex(sender.address);
      console.log(`Nonce for ${sender.address}: ${nonce}`);

      await this.api.tx.subtensorModule
        .removeStake(recipient, amount)
        .signAndSend(sender, { nonce }, ({ status, events }) => {
          console.log(
            `Start staking request to ${recipient}, amt: ${this.formatHumanReadableNumber(amount.toString())}`
          );
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
        console.log(`Account: ${key} has data: ${accountData}`);
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
        `Account: ${account} has free balance of: ${accountData.data.free.toHuman()}`
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
                    event.section.toLowerCase() === 'balances' &&
                    event.method.toLowerCase() === 'transfer'
                  ) {
                    if (
                      event.toHuman().data.to.toLowerCase() ===
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
              console.log('To emit success');
              toEmit.forEach(({ from, to, amount }) => {
                console.log(`Transfer from ${from} to ${to} of ${amount}`);
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
  public setPairs() {
    this.keyring.getPairs().forEach((pair) => {
      this.keyringPairs.push(pair);
      this.keyringAddresses.push(pair.address);
    });
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

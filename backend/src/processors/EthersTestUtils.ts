import { ethers } from 'ethers';
import sTaoData from '../data/ethData';
import dotenv from 'dotenv';
import { EventEmitter } from 'events';
import { ErrorDecoder, ErrorType } from 'ethers-decode-error';
import batchQueriedEvents from '../utils/etherEventBatcher';
import signerList from '../data/testWallets';
import EthKey from '../types/EthKey';
import {
  EventBase,
  EventTypeNames,
  EventTypes,
  EventMap,
} from '../types/eventsErrors';
dotenv.config();

export default class EthersTestUtils {
  public contract: ethers.Contract;
  public provider: ethers.JsonRpcProvider;
  public signers: ethers.Wallet[];
  private minterContract: ethers.Contract;
  private poolTaxContract: ethers.Contract;
  private errorDecoder: ErrorDecoder;

  constructor();
  constructor(
    _contract?: ethers.Contract,
    _provider?: ethers.JsonRpcProvider,
    signers?: ethers.Wallet[]
  ) {
    if (
      _contract !== undefined &&
      _provider !== undefined &&
      signers !== undefined
    ) {
      this.contract = _contract;
      this.provider = _provider;
      this.signers = signers;
    } else {
      console.warn(
        'Using default sTAO contract, ethersTestUtils intialization not specified'
      );
      this.provider = new ethers.JsonRpcProvider(process.env.HARDHAT_RPC);
      this.contract = new ethers.Contract(
        sTaoData.address,
        sTaoData.abi,
        this.provider
      );
      this.signers = signerList.map((walletKeyPair) => {
        return new ethers.Wallet(walletKeyPair.private, this.provider);
      });
    }
    this.minterContract = this.contract.connect(
      new ethers.Wallet(sTaoData.minterPK, this.provider)
    ) as ethers.Contract;
    this.poolTaxContract = this.contract.connect(
      new ethers.Wallet(sTaoData.poolTaxRolePK, this.provider)
    ) as ethers.Contract;
    this.errorDecoder = ErrorDecoder.create([this.contract.interface]);
  }

  public async stakeSTao(amount: bigint, to?: string | number) {
    let toAddr;
    if (to !== undefined) {
      toAddr = typeof to === 'string' ? to : this.signers[to].address;
    }
    let tx;
    try {
      if (typeof toAddr === 'string') {
        tx = await this.minterContract.stakeSTao(
          toAddr,
          amount,
          sTaoData.bittensorDefaultAddr
        );
      } else if (typeof toAddr === 'number') {
        tx = await this.minterContract.stakeSTao(
          this.signers[toAddr].address,
          amount,
          sTaoData.bittensorDefaultAddr
        );
      } else {
        tx = await this.minterContract.stakeSTao(
          this.signers[0].address,
          amount,
          sTaoData.bittensorDefaultAddr
        );
      }
    } catch (error) {
      await this.processError(error, 'stakeSTao');
    }
    tx = await tx.wait();

    return this.emitTransactionReciptEvent(tx, 'Staked');
  }

  public async stakeSTaoWithRange(
    amount: bigint,
    startIndex: number,
    endIndex: number,
    active: boolean = false
  ) {
    if (endIndex > this.signers.length || startIndex < 0) {
      console.error('Range exceeds signer list length');
      return;
    }
    let tx;
    let eventRecipts: any[] = [];
    try {
      for (let i = startIndex; i <= endIndex; i++) {
        tx = await this.minterContract.stakeSTao(
          this.signers[i].address,
          amount,
          sTaoData.bittensorDefaultAddr
        );
        tx = await tx.wait();
        const receipt = this.emitTransactionReciptEvent(tx, 'Staked');
        eventRecipts.push(receipt);
        if (active) {
          console.log(receipt);
        }
      }
    } catch (error) {
      await this.processError(error, 'stakeSTaoWithRange');
    }
    return eventRecipts;
  }

  public async redeemSTao(amount: bigint, from: string | number) {
    let fromWallet;
    let tx;
    try {
      fromWallet =
        typeof from === 'string'
          ? this.findWalletFromAddress(from)
          : this.signers[from];
      const tempContract = this.contract.connect(fromWallet) as ethers.Contract;
      tx = await tempContract.redeemSTao(sTaoData.bittensorDefaultAddr, amount);
      tx = await tx.wait();
    } catch (error) {
      await this.processError(error, 'redeemSTao');
    }
    return this.emitTransactionReciptEvent(tx, 'Redeemed');
  }

  private createWallet(
    ethereumPrivateKey: string,
    contractConnection: ethers.Provider
  ): ethers.Wallet {
    return new ethers.Wallet(ethereumPrivateKey, contractConnection);
  }

  public async redeemAllSTao(from: string | number) {
    let fromWallet;
    let tx;
    try {
      fromWallet =
        typeof from === 'string'
          ? this.findWalletFromAddress(from)
          : this.signers[from];
      const tempContract = this.contract.connect(fromWallet) as ethers.Contract;
      tx = await tempContract.redeemSTao(
        sTaoData.bittensorDefaultAddr,
        await tempContract.balanceOf(fromWallet.address)
      );
      tx = await tx.wait();
    } catch (error) {
      await this.processError(error, 'redeemAllSTao');
    }
    return this.emitTransactionReciptEvent(tx, 'Redeemed');
  }

  public async updateRatiosWithPercentage(
    _newRedeemPercentage: bigint,
    _newRedeemDecimals: bigint
  ) {
    let tx;
    try {
      console.log('Updating staking and redeem basis points ...');
      tx = await this.poolTaxContract.updateRatiosWithPercentage(
        _newRedeemPercentage,
        _newRedeemDecimals
      );
      tx = await tx.wait();
      console.log('Update complete!');
    } catch (error) {
      await this.processError(error, 'updateRatiosWithPercentage');
    }
    return this.emitTransactionReciptEvent(tx, 'PoolBasisPointsUpdated');
  }

  public async updateRatiosWithBasisPoints(_newRedeemBasisPoints: bigint) {
    let tx;
    try {
      console.log('Updating staking and redeem basis points ...');
      tx = await this.poolTaxContract.updateRatiosWithBasisPoints(
        _newRedeemBasisPoints
      );
      tx = await tx.wait();
      console.log('Update complete!');
    } catch (error) {
      await this.processError(error, 'updateRatiosWithBasisPoints');
    }
    return this.emitTransactionReciptEvent(tx, 'PoolBasisPointsUpdated');
  }

  public async updateRatiosWithPercentageCycle(
    _newRedeemPercentageStart: bigint,
    _newRedeemDecimalsStart: bigint,
    _cycleIncrement: bigint,
    _cycles: number
  ) {
    let receiptArr: any[] = [];
    let contPercentage = _newRedeemPercentageStart;
    for (let i = 0; i < _cycles; i++) {
      contPercentage += _cycleIncrement;
      let tx = await this.updateRatiosWithPercentage(
        contPercentage,
        _newRedeemDecimalsStart
      );
      receiptArr.push(tx);
    }
    return receiptArr;
  }

  public async relativeUpdateRatiosWithCycle(
    _cycleIncrement: bigint,
    _cycles: number
  ) {
    let receiptArr: any[] = [];
    for (let i = 0; i < _cycles; i++) {
      let tx = await this.updateRatiosWithBasisPoints(
        (await this.poolTaxContract.redeemBasisPoints()) + _cycleIncrement
      );
      receiptArr.push(tx);
    }
    return receiptArr;
  }

  public async processError(error: unknown, funcName?: string) {
    if (funcName !== undefined) {
      console.error('Error in function: ', funcName);
    }
    const decodedError = await this.errorDecoder.decode(error);
    console.error(
      'Error reason: ',
      decodedError.reason,
      '\n Error type: ',
      decodedError.type
    );
    decodedError.args.forEach((arg) => {
      console.error('Error arg: ', arg);
    });
  }

  /**
   * Takes in a ContractTransactionReceipt, and a known event name and returns the argument array of the event
   * @param recipt
   * @param eventName
   * @returns any[]
   */
  private emitTransactionReciptEvent(
    receipt: ethers.ContractTransactionReceipt | null,
    eventName: string
  ): { [key: string]: any; [index: number]: any } {
    let eventArguments: { [key: string]: any; [index: number]: any } = {};
    if (receipt === null) {
      console.warn('emit transaction event, empty');
      return eventArguments;
    }
    const eventLogsArr = receipt?.logs.filter((log): log is ethers.EventLog => {
      if (log instanceof ethers.EventLog) {
        return log.eventName === eventName;
      } else {
        return false;
      }
    });

    //eventLog.fragment.inputs.map((input) => input.name)
    if (eventLogsArr !== undefined && eventLogsArr.length > 0) {
      eventLogsArr.forEach((eventLog) => {
        let nameArr = eventLog.fragment.inputs.map((input) => input.name);
        eventLog.args.forEach((args, index) => {
          eventArguments[nameArr[index]] = args;
          eventArguments[index] = args;
        });
      });
    }
    return eventArguments;
  }

  private findPrivateKey(accountPublicKey: string) {
    let wallet = this.signers.find((w) => {
      return w.address.toLowerCase() === accountPublicKey.toLowerCase();
    });
    if (wallet?.privateKey === undefined) {
      console.warn('Wallet not found in find private key');
      return '';
    } else {
      return wallet.privateKey;
    }
  }
  private findWalletFromAddress(accountPublicKey: string) {
    let wallet = this.signers.find((w) => {
      return w.address.toLowerCase() === accountPublicKey.toLowerCase();
    });
    if (wallet?.privateKey === undefined) {
      console.warn('Wallet not found in findWalletFromAddress');
      throw new Error('Wallet not found from address');
    } else {
      return wallet;
    }
  }

  public async queryEventsInRangeAndBatch(
    contract: ethers.Contract,
    startBlock: number | string,
    endBlock: number | string,
    filter: ethers.DeferredTopicFilter | ethers.ContractEvent
  ) {
    const lastEvents = (await contract.queryFilter(
      filter,
      startBlock,
      endBlock
    )) as ethers.EventLog[];

    let eventArr: any[] = [];
    let eventMap = new Map();

    if (lastEvents.length <= 0) {
      console.error('No events found in given range');
      return;
    }

    const eventName = lastEvents[0].fragment.name;
    if (eventName === 'Redeemed' || eventName === 'Staked') {
      const namesArray = lastEvents[0].fragment.inputs.map((name) => name.name);
      lastEvents.forEach((event) => {
        if (!eventMap.has(event.args[0])) {
          eventMap.set(event.args[0], {});
          let obj = eventMap.get(event.args[0]);
          event.args.forEach((arg, index) => {
            if (index !== 0) {
              obj[namesArray[index]] = arg;
            }
          });
          obj['eventCount'] = 1;
          eventMap.set(event.args[0], obj);
        } else {
          let obj = eventMap.get(event.args[0]);
          event.args.forEach((arg, index) => {
            if (index !== 0) {
              if (typeof arg === 'bigint') {
                obj[namesArray[index]] += arg;
              }
              if (
                'Redeemed' &&
                index === 1 &&
                obj[namesArray[index]] !== arg &&
                typeof obj[namesArray[index]] === 'string'
              ) {
                obj[namesArray[index]] = obj[namesArray[index]] + ` ${arg}`;
              }
            }
          });
          obj['eventCount'] += 1;
          eventMap.set(event.args[0], obj);
        }
      });
    } else {
      lastEvents.forEach((event) => {
        eventArr.push(event.args.toArray());
      });
    }

    if (!eventArr.length) {
      return eventMap;
    } else {
      return eventArr;
    }
  }

  public async getSTaoBalance(address: string) {
    return await this.contract.balanceOf(address);
  }

  public async addEthKeyAccount(
    ethAccountSender: ethers.Wallet,
    taoAddress: string,
    ethWallet: string,
    signature: string,
    shouldLogConfirmation: boolean = false
  ) {
    let tx;
    let allEthKeys;
    try {
      const tempContract = this.contract.connect(
        ethAccountSender
      ) as ethers.Contract;
      tx = await tempContract.addAccount(taoAddress, ethWallet, signature);
      await tx.wait();
    } catch (error) {
      await this.processError(error, 'addEthKeyAccount');
      throw error;
    }
    if (shouldLogConfirmation) {
      console.log(`Transaction to add account complete`);
      console.log(await this.retrieveEthKeyAccount(taoAddress));
    }
  }

  public async retrieveEthKeyAccount(taoAddress: string): Promise<EthKey[]> {
    try {
      const result = await this.contract.getAllEthKeysForTaoAddress(taoAddress);
      const allEthKeys: EthKey[] = result.map((item: [string, string]) => ({
        address: item[0],
        signature: item[1],
      }));
      return allEthKeys;
    } catch (error) {
      await this.processError(error, 'retreiveEthKeyAccount');
      throw error;
    }
  }
}

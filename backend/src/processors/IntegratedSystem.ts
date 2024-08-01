import '@polkadot/wasm-crypto/initWasmAsm';
import { EventEmitter } from 'events';
import BittensorTestUtils from './BittensorTestUtils';
import EthersTestUtils from './EthersTestUtils';
import { Decimal } from 'decimal.js';
import '@polkadot/wasm-crypto/initWasmAsm';
import logger from '../utils/logger';
import FinanceUtils, { PortfolioVector } from './FinanceUtils';
import { KeyringPair } from '@polkadot/keyring/types';

import HotKeyPortfolio from '../types/HotkeyPortfolio';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { stringToU8a, u8aToHex } from '@polkadot/util';
import {
  mnemonicValidate,
  signatureVerify,
  cryptoWaitReady,
} from '@polkadot/util-crypto';
import '../interfaces/augment-api';

interface Transfer {
  from: string;
  to: string;
  amount: bigint;
}

interface BlockWrapper {
  value: number;
}

export default class IntegratedSystem {
  public bittensor: BittensorTestUtils;
  public ethereum: EthersTestUtils;
  private finance: FinanceUtils;
  private eventEmitter: EventEmitter;
  private transferQueue: { address: string; amount: bigint }[];
  private lastProcessedBlock: BlockWrapper;
  private isStaking: boolean;
  private targetAllocationVector: PortfolioVector;
  private amountToStake: bigint;
  private logger = logger;
  private isRebalancingStakingAndUnstaking: boolean = false;
  private runningTotalAmountToStake;
  private BITTENSOR_FEE = 124560n;
  private shouldTax: boolean = false;
  private vaultKeyringPair: KeyringPair;
  public shouldLog: boolean = false;

  constructor(
    bittensor: BittensorTestUtils,
    ethereum: EthersTestUtils,
    intialTargetPortfolioVector: PortfolioVector,
    shouldLog: boolean = false
  ) {
    this.bittensor = bittensor;
    this.ethereum = ethereum;
    this.eventEmitter = new EventEmitter();
    this.transferQueue = [];
    this.lastProcessedBlock = { value: 0 };
    this.isStaking = true; // Start by staking, can't unstake until staking
    this.finance = new FinanceUtils(
      this.bittensor,
      intialTargetPortfolioVector
    );
    this.targetAllocationVector = this.finance.targetPortfolioVector;
    this.amountToStake = 0n;
    this.runningTotalAmountToStake = 0n;
    this.vaultKeyringPair = this.bittensor.keyringMap.get('Vault')!;
    this.shouldLog = shouldLog;
    this.setupEventListeners();
    this.startScheduledTasks(this.shouldLog);
  }

  private setupEventListeners() {
    this.eventEmitter.on('receiveTransfer', (transfer) => {
      this.logger.info('Received transfer', {
        functionName: 'setupEventListeners',
        addressSendingTao: transfer.from,
        amountSent: transfer.amount,
      });
      //console.log(
      //  `Received transfer: ${transfer.from} -> ${transfer.to}: ${transfer.amount}`
      // );
      this.transferQueue.push({
        address: transfer.from,
        amount: transfer.amount,
      });

      this.amountToStake += transfer.amount;
      this.runningTotalAmountToStake += transfer.amount;
    });
  }

  // start scheduled tasks, time is set like (minutes * seconds per minute * milliseconds per second)
  private startScheduledTasks(shouldLog: boolean = false) {
    this.logger.logger.profile('startScheduledTasks');

    setInterval(
      async () => {
        this.isRebalancingStakingAndUnstaking = true;
        await this.logAllServerStatus('before rebalance');
        try {
          this.logger.info(
            'Starting Scheduled Tasks, starting to rebalance stake and unstake',
            {
              functionName: 'startScheduledTasks',
              isStaking: this.isStaking,
            }
          );
          await this.rebalanceVaultStakeAndUnstake();

          await this.updateRedemptionAndStakingRatios();

          await this.logAllServerStatus('after rebalance');

          this.logger.info('Schedule Tasks Completed\n', {
            functionName: 'startScheudledTasks',
            isStaking: this.isStaking,
          });
        } catch (error) {
          this.logger.error('Error in Scheduled Tasks', {
            functionName: 'startScheudledTasks',
          });
        }
        this.isRebalancingStakingAndUnstaking = false;
      },
      1 * 30 * 1000
    );

    // Process transfer queue more frequently
    setInterval(
      async () => {
        if (!this.isRebalancingStakingAndUnstaking) {
          try {
            this.logger.info('Processing Transfer Queue...', {
              functionName: 'startScheudledTasks',
              queue: this.transferQueue,
            });

            await this.processTransferQueue();

            this.logger.info('Processing Transfer Queue Completed\n', {
              functionName: 'startScheudledTasks',
              queue: this.transferQueue,
            });
          } catch (error) {
            this.logger.error('Error in Processing Transfer Queue', {
              functionName: 'startScheudledTasks',
            });
          }
        }
      },
      1 * 10 * 1000
    ); // Every 5 minutes
    this.logger.logger.profile('startScheudledTasks');
  }

  /**
   * Bittensor wallet listener
   * This function will listen to finalized block extrinsics, and specifcally filter for balance.Transfer request
   * where Tao is sent to a specific given wallet.
   *
   * Change 'Vault' to the name of your vault wallet saved in the keyring
   */
  private async listenToIncomingTransfers() {
    //console.log('START SUBSCRIPTION');
    this.logger.info('Starting Block Subscription', {
      functionName: 'listenToIncomingTransfers',
      accountListeningTo: this.bittensor.keyringAddressesMap.get('Vault')!,
      timestamp: Date.now(),
    });
    const unsubscribe = await this.bittensor.blockSubscriptionToTransfer(
      this.eventEmitter,
      this.bittensor.keyringAddressesMap.get('Vault')!,
      this.lastProcessedBlock
    );
    return unsubscribe;
  }

  /**
   * At an interval, will process entire transfer queue
   * This is where sTao is created based on Tao transfers to our wallet
   */
  private async processTransferQueue() {
    this.logger.info('In Process Transfer Queue Function', {
      functionName: 'processTransferQueue',
      queue: this.transferQueue,
      queueSize: this.transferQueue.length,
    });
    if (this.transferQueue.length === 0) {
      this.logger.info('Transfer Queue is Empty', {
        functionName: 'processTransferQueue',
      });
    }
    while (this.transferQueue.length > 0) {
      this.logger.logger.profile('processTransferQueue', {
        startTime: Date.now(),
      });
      //console.log('Processing the transfer queue...');
      const { address, amount } = this.transferQueue.shift()!;
      this.logger.info('Processing Transfer Queue Element, Shifting Elements', {
        functionName: 'processTransferQueue',
        queue: this.transferQueue,
        queueSize: this.transferQueue.length,
        addressSendingTao: address,
        amountSent: amount,
      });

      if (this.shouldLog) {
        console.log(
          'Transfer Queue Element Found, \nAddress: ',
          address,
          '\nAmount: ',
          amount
        );
      }

      try {
        const usersAccount = await this.ethereum.retrieveEthKeyAccount(address);
        if (usersAccount) {
          this.logger.info('Retrieving User Eth Key Account From Contract', {
            functionName: 'processTransferQueue',
            addressSendingTao: address,
            amountSent: amount,
            usersAccount: usersAccount,
          });
          const validAccount =
            await this.bittensor.findValidEthAddressInEthKeys(
              usersAccount,
              address
            );
          if (validAccount) {
            this.logger.info('Filtering For Valid Eth Key For User Address', {
              functionName: 'processTransferQueue',
              addressSendingTao: address,
              amountSent: amount,
              validAccount: validAccount,
            });
            const taxedTaoAmount = amount - this.BITTENSOR_FEE;
            const receipt = await this.ethereum.stakeSTao(
              this.convert9To18Decimals(taxedTaoAmount),
              validAccount.address
            );
            if (this.shouldLog) {
              console.log('Valid Transaction Signature Found, Staking sTao: ');
              console.log('Ethereum Address: ', validAccount.address);
              console.log('Tao Address: ', address);
              console.log('Tao Amount Sent: ', amount);
              console.log('Receipt: ');
              console.log('   Ethereum Reciever Addr: ', receipt.to);
              console.log(
                '   Bittensor Sender Addr: ',
                receipt.bittensorWallet
              );
              console.log('   Total sTAO Created: ', receipt.totalAmountStaked);
              console.log('   sTAO Taxed: ', receipt.amountTaxed);
              console.log('   sTAO Sent to User: ', receipt.amountToUser);
              console.log(
                '   Last Time the Ratios Were Updated: ',
                receipt.lastTimeUpdated
              );
            }
          }
        } else {
          this.logger.warn('Tao was sent with no valid Eth Key Account', {
            functionName: 'processTransferQueue',
            addressSendingTao: address,
            amountSent: amount,
          });
        }
      } catch (error) {
        await this.ethereum.processError(error, 'processTransferQueue');
      }
      this.logger.logger.profile('processTransferQueue', {
        endTime: Date.now(),
      });
    }
  }

  /**
   * This function will update the redemption and staking ratios when called
   */
  private async updateRedemptionAndStakingRatios() {
    this.logger.logger.profile('updateRedemptionAndStakingRatios');
    try {
      const ratios = await this.ethereum.getStakingRedemptionRatios();
      this.logger.info(
        'Updating Redemption and Staking Ratios On Smart Contract',
        {
          functionName: 'updateRedemptionAndStakingRatios',
          stakingBasisPoints: ratios.stakingBasisPoints,
          redeemBasisPoints: ratios.redeemBasisPoints,
          lastRedeemBasisPoints: ratios.lastRedeemBasisPoints,
          lastLastRedeemBasisPoints: ratios.lastLastRedeemBasisPoints,
        }
      );
      let totalInStake = (
        await this.bittensor.api.query.subtensorModule.totalColdkeyStake(
          this.bittensor.keyringMap.get('Vault')!.address
        )
      ).toBigInt();
      const totalSTaoInCirculation = await this.ethereum.contract.totalSupply();
      const newRedeemRatioPercentage = this.calculateNewRatio(
        totalInStake,
        totalSTaoInCirculation
      );
      if (newRedeemRatioPercentage) {
        try {
          await this.ethereum.updateRatiosWithPercentage(
            newRedeemRatioPercentage,
            BigInt(18)
          );
        } catch (error) {
          this.logger.warn(
            `Redemption and Staking Ratios Not Updated Due to error: ${error}`,
            {
              functionName: 'updateRedemptionAndStakingRatios',
              newRedeemRatioPercentage: newRedeemRatioPercentage,
              totalInStake: totalInStake,
              totalSTaoInCirculation: totalSTaoInCirculation,
            }
          );
        }

        const ratios = await this.ethereum.getStakingRedemptionRatios();
        this.logger.info(
          'Completed Updating Redemption and Staking Ratios On Smart Contract',
          {
            functionName: 'updateRedemptionAndStakingRatios',
            newStakingBasisPoints: ratios.stakingBasisPoints,
            newRedeemBasisPoints: ratios.redeemBasisPoints,
            newLastRedeemBasisPoints: ratios.lastRedeemBasisPoints,
            newLastLastRedeemBasisPoints: ratios.lastLastRedeemBasisPoints,
          }
        );
        //console.log(`Updated redemption and staking ratios`);
      } else {
        this.logger.info(
          'Completed Updating Redemption and Staking Ratios,\n No Update Due to an Incoming Negative Ratio',
          {
            functionName: 'updateRedemptionAndStakingRatios',
            newRedeemRatioPercentage: newRedeemRatioPercentage,
            totalInStake: totalInStake,
            totalSTaoInCirculation: totalSTaoInCirculation,
          }
        );
      }
    } catch (error) {
      this.logger.logger.profile('updateRedemptionAndStakingRatios');
      this.logger.error(
        'Error in updating redemption and staking ratios',
        error,
        {
          functionName: 'updateRedemptionAndStakingRatios',
        }
      );
      await this.ethereum.processError(
        error,
        'updateRedemptionAndStakingRatios'
      );
    }
    this.logger.logger.profile('updateRedemptionAndStakingRatios');
  }

  /**
   * This function processes sTao redemption events by querying the last hour's worth of
   * Redeemed events, bundling them together via TaoAddress => taoToReceive mapping, and then requesting
   * an unstaking request from our coldkey account.
   */
  private async processRedeemRequests() {
    this.logger.logger.profile('processRedeemRequests');
    try {
      const currentBlock = await this.ethereum.provider.getBlockNumber();

      this.logger.info('Processing Redeem Requests By Querying Block Range', {
        functionName: 'processRedeemRequests',
        currentBlock: currentBlock,
        lastProcessedBlock: this.lastProcessedBlock.value,
      });

      const burnEvents = await this.ethereum.queryEventsInRangeAndBatch(
        this.ethereum.contract,
        this.lastProcessedBlock.value,
        currentBlock,
        this.ethereum.contract.filters.Redeemed()
      );

      this.lastProcessedBlock.value = currentBlock;

      this.logger.info('Completed Processing Redeem Requests', {
        functionName: 'processRedeemRequests',
        currentBlock: currentBlock,
        lastProcessedBlock: this.lastProcessedBlock.value,
        burnEvents: burnEvents,
      });

      return burnEvents;
    } catch (error) {
      this.logger.error('Error in processing redeem requests', error, {
        functionName: 'processRedeemRequests',
      });
      this.ethereum.processError(error, 'processRedeemRequests');
    }
    this.logger.logger.profile('processRedeemRequests');
  }

  /***
   * deprecated
   */
  private taxTransactions(
    transactionMap: Map<string, bigint>,
    flatTaxAmount: bigint = BigInt(120000)
  ) {
    try {
      const taxMap = new Map<string, bigint>();
      for (const [address, amount] of transactionMap) {
        if (flatTaxAmount >= amount) {
          throw new Error(
            `Flat Tax: ${flatTaxAmount}, is greater than ${amount}`
          );
        }
        const taxedAmount = amount - flatTaxAmount;
        taxMap.set(address, taxedAmount);
      }
      return taxMap;
    } catch (error) {}
  }

  private async rebalanceVaultStakeAndUnstake() {
    this.logger.logger.profile('rebalanceVaultStakeAndUnstake');
    // rebalance call:
    // this requires knowing how much tao will be staked,
    // how much tao that needs to be sent over to the users.
    const totalToStake = this.amountToStake;
    const burnEvents = (await this.processRedeemRequests()) as Map<any, any>;

    const { burnTransactionMap, totalTaoToSend } =
      this.processBurnForTransaction(burnEvents, this.shouldTax);

    this.logger.info(
      'Rebalancing Vault Stake and Unstake, sTAO contract Burn Events',
      {
        functionName: 'rebalanceVaultStakeAndUnstake',
        burnEvents: burnEvents,
        totalToUnstakes: totalTaoToSend,
        runningTotalAmountToStake: this.runningTotalAmountToStake,
      }
    );

    // get total input and total output tao, and calculate stake and unstake rates
    const { transactionMap, shouldDoSendTx } =
      await this.finance.rebalanceAndCreateStakeTransactions(
        totalToStake,
        totalTaoToSend,
        this.shouldLog
      );

    if (shouldDoSendTx) {
      this.logger.info(
        'Sending Staking and Unstaking Transactions To Rebalance',
        {
          functionName: 'rebalanceVaultStakeAndUnstake',
          transactionMap: transactionMap,
        }
      );
      await this.bittensor.batchStakingUnstakingRequest(
        this.bittensor.keyringMap.get('Vault')!,
        transactionMap,
        this.shouldLog
      );
    } else {
      this.logger.info('No Staking and Unstaking Transactions To Send', {
        functionName: 'rebalanceVaultStakeAndUnstake',
      });
    }

    // now send tao back to all users
    let didSendBurnTransactionMap = false;
    if (burnTransactionMap.size > 0) {
      await this.sendBurnTransactionMap(burnTransactionMap);
      didSendBurnTransactionMap = true;
      this.logger.info('Sent Processed Burn Event Transaction Map Requests', {
        functionName: 'rebalanceVaultStakeAndUnstake',
        didSendBurnTransactionMap: didSendBurnTransactionMap,
        burnTransactionMap: burnTransactionMap,
      });
    } else {
      this.logger.info('No burn transactions on the map to send', {
        functionName: 'rebalanceVaultStakeAndUnstake',
        didSendBurnTransactionMap: didSendBurnTransactionMap,
      });
    }

    this.amountToStake = 0n;

    this.logger.info(
      'Completed Rebalancing Vault Stake and Unstake, and Burn Transfer',
      {
        functionName: 'rebalanceVaultStakeAndUnstake',
        burnEvents: burnEvents,
        totalToUnstakes: totalTaoToSend,
        runningTotalAmountToStake: this.runningTotalAmountToStake,
        didSendBurnTransactionMap: didSendBurnTransactionMap,
      }
    );
    this.logger.logger.profile('rebalanceVaultStakeAndUnstake');
  }

  private processBurnForTransaction(
    burnEvents: Map<any, any>,
    shouldTax: boolean = false
  ) {
    this.logger.info('Processing Burn Event to Transactional Map', {
      functionName: 'processBurnForTransaction',
      burnEvents: burnEvents,
      shouldTax: shouldTax,
    });
    let totalTaoToSend = 0n;
    const burnTransactionMap: Map<string, bigint> = new Map();
    try {
      if (burnEvents === undefined) {
        this.logger.info('Completed processing burn events, No events found', {
          functionName: 'processBurnForTransaction',
        });
        return { burnTransactionMap, totalTaoToSend };
      }
      for (const [key, value] of burnEvents) {
        let taoToSendToUser = value.taoToUser;
        if (shouldTax) {
          taoToSendToUser -= this.BITTENSOR_FEE;
        }
        burnTransactionMap.set(key, taoToSendToUser);
        totalTaoToSend += taoToSendToUser;
      }
    } catch (error) {
      this.logger.error(
        'Error in Processing Burn Events To Transactional Map',
        error,
        {
          functionName: 'processBurnForTransaction',
          burnEvents: burnEvents,
        }
      );
      console.error(
        'error detected in processing burn for transactional map',
        error
      );
      throw new Error('Error in processing burn events');
    }

    this.logger.info('Completed Processing Burn Event to Tranasctional Map', {
      functionName: 'processBurnForTransaction',
    });

    return { burnTransactionMap, totalTaoToSend };
  }

  private async sendBurnTransactionMap(
    burnTransactionMap: Map<string, bigint>
  ) {
    try {
      this.logger.info('Sending the Burn Transaction Map to Users', {
        functionName: 'sendBurnTransactionMap',
        sender: this.bittensor.keyringMap.get('Vault')!,
        burnTransactionMap: burnTransactionMap,
      });
      await this.bittensor.batchTransferRequest(
        this.bittensor.keyringMap.get('Vault')!,
        burnTransactionMap
      );
      this.logger.info('Completed Sending the Burn Transaction Map to Users', {
        functionName: 'sendBurnTransactionMap',
      });
    } catch (error) {
      this.logger.error(
        'Error When Sending Burn Transaction map to Users',
        error,
        {
          functionName: 'sendBurnTransactionMap',
        }
      );
      throw error;
    }
  }

  public async setTargetAllocationVector(
    targetPortfolioVector: PortfolioVector
  ) {
    await this.finance.setTargetPortfolioVector(targetPortfolioVector);
  }

  public async logAllServerStatus(
    interval: string = '',
    verbose: boolean = false
  ) {
    console.log(
      '\n******************************************************************'
    );
    console.log(`Server Stats ${interval}:`);
    console.log(
      '******************************************************************'
    );

    await this.logEtherStatus();

    await this.logBittensorStatus(verbose);

    this.logServerStatus();

    console.log(
      '******************************************************************'
    );
    console.log('Server Stats Completed');
    console.log(
      '******************************************************************\n'
    );
  }

  public async logEtherStatus() {
    console.log('\nEthereum Statistics');
    console.log('-------------------');
    console.log('sTaoSupply: ', await this.ethereum.contract.totalSupply());
    console.log(
      'Redeem Ratio: ',
      await this.ethereum.contract.redeemBasisPoints()
    );
    console.log(
      'Last Redeem Ratio: ',
      await this.ethereum.contract.lastRedeemBasisPoints()
    );
    console.log(
      'Last Last Redeem Ratio: ',
      await this.ethereum.contract.lastLastRedeemBasisPoints()
    );
    console.log(
      'Staking Ratio: ',
      await this.ethereum.contract.stakeBasisPoints()
    );
  }

  public async logBittensorStatus(verbose: boolean) {
    console.log('\nBittensor Statistics:');
    console.log('---------------------');
    const balData = await this.bittensor.getSingularBalance(
      this.vaultKeyringPair
    );
    const stakeData = await this.bittensor.getTotalColdKeyStake(
      this.vaultKeyringPair.address
    );
    const hotKeyPortfolio = await this.bittensor.getCurrentHotKeyPortfolio();
    if (verbose) {
      console.log('Vault Wallet Account: ', balData.data.toHuman());
      console.log('Total Stake: ', stakeData);
      await this.bittensor.getTransferFee(
        this.vaultKeyringPair,
        this.vaultKeyringPair
      );
      console.log('Current HotkeyPortfolio: ', hotKeyPortfolio);
    } else {
      console.log('Vault Wallet Account: ');
      console.log('Free: ', balData.data.free.toBigInt());
      console.log('Total Staked ', stakeData);
      await this.bittensor.getTransferFee(
        this.vaultKeyringPair,
        this.vaultKeyringPair
      );
      console.log(
        'Total Amount of Tao In Vault: ',
        stakeData + balData.data.free.toBigInt()
      );
      console.log('\nCurrent HotkeyPortfolio: ');
      Object.entries(hotKeyPortfolio).forEach(([key, value]) => {
        console.log(
          `${key}: \n\tWeight: ${value.weight}\n\tTao Staked: ${value.taoAmount}`
        );
      });
    }
    console.log('Target Vector: ', await this.finance.targetPortfolioVector);
  }

  public logServerStatus() {
    console.log('\nSystems Stats: ');
    console.log('--------------');
    console.log('Transfer Queue: ', this.transferQueue);
    console.log('Vault keyring Address: ', this.vaultKeyringPair.address);
    console.log('Last Processed Block: ', this.lastProcessedBlock);
    console.log('Amount To Stake: ', this.amountToStake);
    console.log('Running amount to stake: ', this.runningTotalAmountToStake);
  }

  /**
   * calculating new sTao redemption ratio by diving total staked Tao by total sTao supply
   *
   * @param totalInStake should be a 9 decimal Tao amount
   * @param totalSTaoInCirculation should be a 18 decimal sTao amount
   * @returns the basis points of the new redemption ratio (always has 18 decimals)
   */
  private calculateNewRatio(
    totalInStake: bigint,
    totalSTaoInCirculation: bigint
  ) {
    const totalInStakeScaled = this.convert9To18Decimals(totalInStake);

    const toDecimalStake = new Decimal(totalInStakeScaled.toString());
    const toDecimalCirculation = new Decimal(totalSTaoInCirculation.toString());
    const result = toDecimalStake.dividedBy(toDecimalCirculation).times(100);
    const scaledResult = result.times(1e18);
    /*
        if (result.lessThan(new Decimal(100))) {
            console.log(`invalid ratio, is negative`);
            throw new Error('Invalid ratio');
        }
            */
    console.log('In calculate New Ratio: \n');
    console.log(
      `total TAO staked ${totalInStake}, total sTAO supply: ${totalSTaoInCirculation}`
    );
    console.log(
      `In human Tao ${this.humanReadableE18(totalInStakeScaled)} in Human sTAO supply : ${this.humanReadableE18(totalSTaoInCirculation)}`
    );
    console.log(
      `Scaled End Ratio Result: ${BigInt(scaledResult.floor().toFixed(0))}`
    );
    return BigInt(scaledResult.floor().toFixed(0));
  }

  /**
   * Helper function to convert 9 decimal Tao values to 18 decimal values
   *
   * @param amount 9 decimal Tao value
   * @returns  18 decimal tao value
   */
  private convert9To18Decimals(amount: bigint) {
    const scaleFactor = BigInt(1e9);
    return amount * scaleFactor;
  }

  /**
   * Helper function to convert 18 decimal Tao values to 9 decimal values
   * note that Tao is normally 9 decimals, so there isn't issues with truncating extra decimals
   *
   * @param amount 18 decimal Tao value
   * @returns  9 decimal tao value
   */
  private convert18To9Decimals(amount: bigint) {
    const scaleFactor = BigInt(1e9);
    return amount / scaleFactor;
  }

  /**
   * Utility to help read 18 decimal values
   *
   * @param amount 18 decimal value
   * @returns the amount in a human readable form
   */
  private humanReadableE18(amount: bigint) {
    const amountAsDecimal = new Decimal(amount.toString());
    return amountAsDecimal.div(1e18).floor().toFixed(18);
  }
  /**
   * Utility to help read 9 decimal values
   *
   * @param amount 9 decimal value
   * @returns the amount in a human readable form
   */
  private humanReadableE9(amount: bigint) {
    const amountAsDecimal = new Decimal(amount.toString());
    return amountAsDecimal.div(1e9).floor().toFixed(9);
  }

  public setBittensorFee(fee: bigint) {
    this.BITTENSOR_FEE = fee;
  }

  public async start() {
    await this.finance.initalize();
    await this.listenToIncomingTransfers();
    console.log('Started the processor');
  }
}

// Promise<Map<string, bigint>>
/*   private async smartUnstakeAndTransfer(
    burnEvents: any[] | Map<any, any> | undefined,
    shouldTax: boolean = false
  ): Promise<boolean> {
    this.logger.logger.profile('smartUnstakeAndTransfer');
    try {
      this.logger.info('Starting Smart Unstake And Transfer', {
        functionName: 'smartUnstakeAndTransfer',
        burnEvents: burnEvents,
      });
      let taoToSendTotal = BigInt(0);
      let transferMap = new Map<string, bigint>();
      const taoInColdKey = (
        await this.bittensor.getSingularBalance(
          this.bittensor.keyringMap.get('Vault')!
        )
      ).data.free.toBigInt();

      if (burnEvents instanceof Map) {
        for (const [taoAddress, data] of burnEvents) {
          const modifiedData = this.convert18To9Decimals(data.taoToUser);
          if (!transferMap.has(taoAddress)) {
            transferMap.set(taoAddress, modifiedData);
          } else {
            transferMap.set(
              taoAddress,
              transferMap.get(taoAddress)! + modifiedData
            );
          }
          taoToSendTotal += modifiedData;
        }
      }
      this.logger.info(
        'Within Smart Unstake And Transfer, Starting Smart Unstaking Process',
        {
          functionName: 'smartUnstakeAndTransfer',
          subActivityName: 'smartUnstaking decision',
          taoToSendTotal: this.humanReadableE9(taoToSendTotal),
          taoInColdKey: this.humanReadableE9(taoInColdKey),
        }
      );
      let taoToUnstake = BigInt(0);

      // situation 1, more deposits than redemptions, thus batch transfer, and get a free stake in:
      if (taoInColdKey >= taoToSendTotal) {
        const leftoverColdKeyTao = taoInColdKey - taoToSendTotal;
        this.logger.info(
          'Smart Unstake Choice Situation 1, More Deposit Value Than Redemption Value',
          {
            functionName: 'smartUnstakeAndTransfer',
            subActivityName: 'smartUnstaking decision 1',
            taoToSendTotal: this.humanReadableE9(taoToSendTotal),
            leftoverColdKeyTao: this.humanReadableE9(leftoverColdKeyTao),
            shouldTax: shouldTax,
            totalTaoStaked: (
              await this.bittensor.api.query.subtensorModule.totalColdkeyStake(
                this.bittensor.keyringMap.get('Vault')!.address
              )
            ).toBigInt(),
            vaultWallet: this.bittensor.keyringMap.get('Vault')!.address,
          }
        );
        if (shouldTax) {
          const taxedTransferMap = this.taxTransactions(transferMap);
          await this.bittensor.batchTransferRequest(
            this.bittensor.keyringMap.get('Vault')!,
            taxedTransferMap!
          );
        } else {
          await this.bittensor.batchTransferRequest(
            this.bittensor.keyringMap.get('Vault')!,
            transferMap
          );
        }
        this.logger.info('Smart Unstake Choice Situation 1 Completed', {
          functionName: 'smartUnstakeAndTransfer',
          subActivityName: 'smartUnstaking decision 1',
          taoToSendTotal: this.humanReadableE9(taoToSendTotal),
          leftoverColdKeyTao: this.humanReadableE9(leftoverColdKeyTao),
          totalTaoStaked: (
            await this.bittensor.api.query.subtensorModule.totalColdkeyStake(
              this.bittensor.keyringMap.get('Vault')!.address
            )
          ).toBigInt(),
          vaultWallet: this.bittensor.keyringMap.get('Vault')!.address,
        });

        if (leftoverColdKeyTao > 0) {
          await this.bittensor.addStakeSecure(
            this.bittensor.keyringMap.get('Vault')!,
            this.bittensor.hotKeyAddressMap.get('Validator1Hotkey')!,
            leftoverColdKeyTao
          );
        }
        this.logger.info('Completed Smart Unstake Choice Situation 1', {
          functionName: 'smartUnstakeAndTransfer',
          subActivityName: 'smartUnstaking decision 1',
          taoToSendTotal: this.humanReadableE9(taoToSendTotal),
          leftoverColdKeyTao: this.humanReadableE9(leftoverColdKeyTao),
          totalTaoStaked: (
            await this.bittensor.api.query.subtensorModule.totalColdkeyStake(
              this.bittensor.keyringMap.get('Vault')!.address
            )
          ).toBigInt(),
          vaultWallet: this.bittensor.keyringMap.get('Vault')!.address,
        });
        this.logger.logger.profile('smartUnstakeAndTransfer');
        //returns true as we can update pool when we stake note, could stay the same as === 0
        return true;
      } else {
        // situation 2, more redemptions than deposits, thus unstake, then batch transfer
        taoToUnstake = taoToSendTotal - taoInColdKey;
        this.logger.info(
          'Smart Unstake Choice Situation 2, More Redemption Value Than Deposit Value',
          {
            functionName: 'smartUnstakeAndTransfer',
            subActivityName: 'smartUnstaking decision 2',
            taoToSendTotal: this.humanReadableE9(taoToSendTotal),
            taoToUnstake: this.humanReadableE9(taoToUnstake),
            taoInColdKey: this.humanReadableE9(taoInColdKey),
            shouldTax: shouldTax,
            totalTaoStaked: (
              await this.bittensor.api.query.subtensorModule.totalColdkeyStake(
                this.bittensor.keyringMap.get('Vault')!.address
              )
            ).toBigInt(),
            vaultWallet: this.bittensor.keyringMap.get('Vault')!.address,
          }
        );
        await this.bittensor.removeStakeSecure(
          this.bittensor.keyringMap.get('Vault')!,
          this.bittensor.hotKeyAddressMap.get('Validator1Hotkey')!,
          taoToUnstake
        );
        if (shouldTax) {
          const taxedTransferMap = this.taxTransactions(transferMap);
          await this.bittensor.batchTransferRequest(
            this.bittensor.keyringMap.get('Vault')!,
            taxedTransferMap!
          );
        } else {
          await this.bittensor.batchTransferRequest(
            this.bittensor.keyringMap.get('Vault')!,
            transferMap
          );
        }
        this.logger.info('Completed Smart Unstake Choice Situation 2', {
          functionName: 'smartUnstakeAndTransfer',
          subActivityName: 'smartUnstaking decision 2',
          taoToSendTotal: this.humanReadableE9(taoToSendTotal),
          taoToUnstake: this.humanReadableE9(taoToUnstake),
          taoInColdKey: this.humanReadableE9(taoInColdKey),
          shouldTax: shouldTax,
          totalTaoStaked: (
            await this.bittensor.api.query.subtensorModule.totalColdkeyStake(
              this.bittensor.keyringMap.get('Vault')!.address
            )
          ).toBigInt(),
          vaultWallet: this.bittensor.keyringMap.get('Vault')!.address,
        });
        this.logger.logger.profile('smartUnstakeAndTransfer');
        return false; // returns false as we can't update pool when we unstake
      }
    } catch (error) {
      this.logger.logger.profile('smartUnstakeAndTransfer');
      console.error(`Error in smartUnstakeAndTransfer: ${error}`);
      throw error;
    }
  } */

/* private async alternateStakingUnstaking(): Promise<boolean> {
    try {
      this.logger.logger.profile('alternateStakingUnstaking');
      this.logger.info('Starting Alternate Staking and Unstaking', {
        functionName: 'alternateStakingUnstaking',
        isStaking: this.isStaking,
      });
      if (this.isStaking) {
        //console.log('in staking;');
        const taoInColdKey = (
          await this.bittensor.getSingularBalance(
            this.bittensor.keyringMap.get('Vault')!
          )
        ).data.free.toBigInt();

        this.logger.info(
          'Withing Alternate Staking and Unstaking, Starting Staking Process',
          {
            functionName: 'alternateStakingUnstaking',
            subActivityName: 'staking decision',
            taoInColdKey: this.humanReadableE9(taoInColdKey),
            totalTaoStaked: (
              await this.bittensor.api.query.subtensorModule.totalColdkeyStake(
                this.bittensor.keyringMap.get('Vault')!.address
              )
            ).toBigInt(),
            isStaking: this.isStaking,
          }
        );

        if (taoInColdKey > 0) {
          //console.log('Adding stake secure');
          await this.bittensor.addStakeSecure(
            this.bittensor.keyringMap.get('Vault')!,
            this.bittensor.hotKeyAddressMap.get('Validator1Hotkey')!,
            taoInColdKey
          );
          this.isStaking = !this.isStaking;

          this.logger.info(
            'Withing Alternate Staking and Unstaking, Compelted Staking Process',
            {
              functionName: 'alternateStakingUnstaking',
              subActivityName: 'staking decision, Add Stake Securely',
              taoInColdKey: this.humanReadableE9(taoInColdKey),
              totalTaoStaked: (
                await this.bittensor.api.query.subtensorModule.totalColdkeyStake(
                  this.bittensor.keyringMap.get('Vault')!.address
                )
              ).toBigInt(),
              isStaking: this.isStaking,
            }
          );

          this.logger.logger.profile('alternateStakingUnstaking');
          return true;
        } else {
          //console.log('no tao in cold key, skipping to smart unstake....');
          const transactionMap = await this.processRedeemRequests();
          if (transactionMap !== undefined && transactionMap instanceof Map) {
            await this.smartUnstakeAndTransfer(transactionMap);
          }
          this.isStaking = this.isStaking;

          this.logger.logger.profile('alternateStakingUnstaking');
          return false;
        }
      } else {
        //console.log('In smart unstake');
        const transactionMap = await this.processRedeemRequests();
        //console.log('smart unstake transactionmap: ', transactionMap);
        if (transactionMap !== undefined && transactionMap instanceof Map) {
          const shouldUpdate =
            await this.smartUnstakeAndTransfer(transactionMap);
          if (shouldUpdate) {
            this.isStaking = !this.isStaking;
            this.logger.logger.profile('alternateStakingUnstaking');
            return true;
          }
        }
        this.isStaking = !this.isStaking; // sets to stake
        this.logger.logger.profile('alternateStakingUnstaking');
        return false; // no staking means no pool update
      }
    } catch (error) {
      this.logger.error('Error in alternate staking and unstaking', error, {
        functionName: 'alternateStakingUnstaking',
      });
      this.logger.logger.profile('alternateStakingUnstaking');
      console.error(`Error in alternating: ${error}`);
    }
    return false;
  } */

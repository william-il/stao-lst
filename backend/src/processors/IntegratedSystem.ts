import '@polkadot/wasm-crypto/initWasmAsm';
import { EventEmitter } from 'events';
import BittensorTestUtils from './BittensorTestUtils';
import EthersTestUtils from './EthersTestUtils';
import { ethers } from 'ethers';
import EthKey from '../types/EthKey';
import { Decimal } from 'decimal.js';
import '@polkadot/wasm-crypto/initWasmAsm';
import { add } from 'winston';
import 'tx2';
import logger from '../utils/logger';
import FinanceUtils, { PortfolioVector } from './FinanceUtils';
import { error } from 'console';

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

  constructor(
    bittensor: BittensorTestUtils,
    ethereum: EthersTestUtils,
    finance: FinanceUtils
  ) {
    this.bittensor = bittensor;
    this.ethereum = ethereum;
    this.eventEmitter = new EventEmitter();
    this.transferQueue = [];
    this.lastProcessedBlock = { value: 0 };
    this.isStaking = true; // Start by staking, can't unstake until staking
    this.finance = finance;
    this.targetAllocationVector = finance.targetPortfolioVector;
    this.amountToStake = 0n;
    this.runningTotalAmountToStake = 0n;
    this.setupEventListeners();
    this.startScheduledTasks();
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
  private startScheduledTasks() {
    this.logger.logger.profile('startScheduledTasks');

    setInterval(
      async () => {
        this.isRebalancingStakingAndUnstaking = true;

        try {
          this.logger.info(
            'Starting Scheduled Tasks, starting to rebalance stake and unstake',
            {
              functionName: 'startScheudledTasks',
              isStaking: this.isStaking,
            }
          );

          // Then, alternate staking/unstaking
          //console.log('Starting alternateStakingUnstaking');
          //const shoudUpdate = await this.alternateStakingUnstaking();
          //console.log('alternateStakingUnstaking completed successfully');

          this.logger.info('Alternate Staking and Unstaking completed', {
            functionName: 'startScheudledTasks',
            isStaking: this.isStaking,
          });

          //console.log('All scheduled tasks completed successfully');
        } catch (error) {
          this.logger.error('Error in Alternate Staking and Unstaking', {
            functionName: 'startScheudledTasks',
          });
          //console.error('Error in scheduled tasks:', error);
          // Optionally, you could add more specific error handling here
          // For example, you might want to handle errors from each task differently
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
            this.logger.info('Processing Transfer Queue', {
              functionName: 'startScheudledTasks',
              queue: this.transferQueue,
            });
            await this.processTransferQueue();

            this.logger.info('Processing Transfer Queue Completed', {
              functionName: 'startScheudledTasks',
              queue: this.transferQueue,
            });
          } catch (error) {
            this.logger.error('Error in Processing Transfer Queue', {
              functionName: 'startScheudledTasks',
            });
            // console.error('Error processing transfer queue:', error);
          }
        }
      },
      1 * 5 * 1000
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
            await this.ethereum.stakeSTao(
              this.convert9To18Decimals(taxedTaoAmount),
              validAccount.address
            );
            console.log(`\n Successfully processed transaction queue element`);
          }
        } else {
          throw new Error('User');
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
        await this.ethereum.updateRatiosWithPercentage(
          newRedeemRatioPercentage,
          BigInt(18)
        );
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

  private async reblanaceVaultStakeAndUnstake() {
    this.logger.logger.profile('rebalanceVaultStakeAndUnstake');
    // rebalance call:
    // this requires knowing how much tao will be staked,
    // how much tao that needs to be sent over to the users.
    const totalToStake = this.amountToStake;
    let totalToUnstake = 0n;
    const burnEvents = (await this.processRedeemRequests()) as Map<any, any>;

    for (const [key, value] of burnEvents) {
    }

    this.logger.logger.profile('rebalanceVaultStakeAndUnstake');
  }

  private async setTargetAllocationVector(
    targetPortfolioVector: PortfolioVector
  ) {
    await this.finance.setTargetPortfolioVector(targetPortfolioVector);
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
    console.log('In calculate New Ratio \n\n:');
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
    await this.listenToIncomingTransfers();
    console.log('Started the processor');
  }
}

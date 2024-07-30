import '@polkadot/wasm-crypto/initWasmAsm';
import { EventEmitter } from 'events';
import BittensorTestUtils from './BittensorTestUtils';
import EthersTestUtils from './EthersTestUtils';
import { ethers, QuickNodeProvider } from 'ethers';
import EthKey from '../types/EthKey';
import { Decimal } from 'decimal.js';
import '@polkadot/wasm-crypto/initWasmAsm';
import 'tx2';
import logger from '../utils/logger';
import HotKeyPortfolio from '../types/HotkeyPortfolio';
import { KeyringPair } from '@polkadot/keyring/types';
import { lazyVariants } from '@polkadot/types';

export interface PortfolioVector {
  [name: string]: Decimal;
}
/* export interface HotkeyPortfolio {
  [name: string]: {
    hotKey: string;
    weight: Decimal;
    taoAmount: bigint;
  };*/
/* export interface rebalanceTransactionMap {
  [name: string]: {
    hotKey: string;
    taoAmount: bigint;
    type: 'stake' | 'unstake' | 'none';
  };
} */
export interface rebalanceTransactionMap {
  [name: string]: {
    hotKey: string;
    taoAmount: bigint;
    type: 'stake' | 'unstake' | 'none';
  };
}
export default class FinanceUtils {
  private bittensor: BittensorTestUtils;
  private hotKeyPortfolio: HotKeyPortfolio;
  private vaultKeyringPair: KeyringPair;
  public targetPortfolioVector: PortfolioVector;
  private targetPortfolio: HotKeyPortfolio;

  constructor(
    bittensor: BittensorTestUtils,
    targetPortfolioVector: PortfolioVector
  ) {
    this.bittensor = bittensor;
    this.hotKeyPortfolio = {};
    this.targetPortfolioVector = targetPortfolioVector;
    this.targetPortfolio = {};
    this.vaultKeyringPair = this.bittensor.keyringMap.get('Vault')!;
    console.warn(
      'Finance Utils must be asynchronously initalized with .initalize() before use'
    );
  }

  // initalize the current hotkey portfolio afor (name in)nd the target portfolio based on the bittensor utils input
  public async initalize() {
    logger.info('Initalizing FinanceUtils', {
      functionName: 'initalize',
    });
    this.hotKeyPortfolio = await this.bittensor.getCurrentHotKeyPortfolio();
    this.targetPortfolio = await this.calculateTargetPortfolio();
  }

  // calculate the target portfolio based on the target portfolio vector
  public async calculateTargetPortfolio() {
    Decimal.set({ rounding: Decimal.ROUND_DOWN });
    const totalTaoInStake = await this.bittensor.getTotalColdKeyStake(
      this.vaultKeyringPair.address
    );

    logger.info('Calculating Target Portfolio', {
      functionName: 'calculateTargetPortfolio',
      totalTaoInStake: totalTaoInStake,
      targetPortfolioVector: this.targetPortfolioVector,
    });

    const tempPortfolio: HotKeyPortfolio = {};
    for (const name in this.targetPortfolioVector) {
      if (this.bittensor.keyringAddressesMap.has(name)) {
        // create the target portfolio based on the target portfolio vector
        // the vector is a literal with "name (of keyringpair) : weight (as a Decimal)"
        const weight = this.targetPortfolioVector[name];

        const targetHotKeyStake = this.targetPortfolioVector[name].times(
          new Decimal(totalTaoInStake.toString())
        );
        tempPortfolio[name] = {
          hotKey: this.bittensor.keyringAddressesMap.get(name)!,
          weight: weight,
          taoAmount: BigInt(targetHotKeyStake.round().toFixed(0)),
        };
      } else {
        throw new Error('Hotkey not found in keyring address map');
      }
    }

    logger.info('Completed Calculating Target Portfolio', {
      functionName: 'calculateTargetPortfolio',
      targetPortfolioVector: this.targetPortfolioVector,
      targetPortfolio: tempPortfolio,
    });

    return tempPortfolio;
  }

  // set the target portfolio vector and then update the target portfolio
  public async setTargetPortfolioVector(
    targetPortfolioVector: PortfolioVector
  ) {
    this.targetPortfolioVector = targetPortfolioVector;
    this.targetPortfolio = await this.calculateTargetPortfolio();
  }

  // set the hotkey portfolio
  public async setHotKeyPortfolio(hotKeyPortfolio?: HotKeyPortfolio) {
    if (hotKeyPortfolio === undefined) {
      this.hotKeyPortfolio = await this.bittensor.getCurrentHotKeyPortfolio();
    } else {
      this.hotKeyPortfolio = hotKeyPortfolio;
    }
  }

  /***
   * This function will take the admin defined target portfolio vector and use it to rebalance the current stake state
   *
   */
  public async rebalanceAndCreateStakeTransactions(
    taoDepositAmount: bigint,
    taoToSend: bigint,
    shouldLog: boolean = false
  ) {
    Decimal.set({ rounding: Decimal.ROUND_DOWN });
    const totalColdkeyStake = await this.bittensor.getTotalColdKeyStake(
      this.vaultKeyringPair.address
    );
    // calculate the total amount of Tao that will be staked or unstaked
    const negativeTaoToSend = taoToSend * -1n;
    const totalTaoToMove = taoDepositAmount + negativeTaoToSend;
    const absTotalTaoToMove =
      totalTaoToMove < 0 ? -totalTaoToMove : totalTaoToMove;

    // error handling
    if (totalTaoToMove < 0 && absTotalTaoToMove > totalColdkeyStake) {
      logger.error(
        'Tao to send is greater than total tao in stake in rebalance',
        {
          functionName: 'rebalanceAndCreateStakeTransactions',
          taoToSend: taoToSend,
          taoToDeposit: taoDepositAmount,
          taoToMove: totalTaoToMove,
          totalTaoInStake: totalColdkeyStake,
        }
      );
      throw new Error('Tao to send is greater than total tao in stake');
    }

    // get current hotkey portfolio
    await this.setHotKeyPortfolio();
    const currentHotkeyPortfolio = this.hotKeyPortfolio;

    // get the target portfolio without the deposit:
    const targetPortfolio = await this.calculateTargetPortfolio();

    // calculate the differences between the currentHotKeyPortfolio and the target portfolio
    const differencePortfolio: HotKeyPortfolio = {};
    for (const name in currentHotkeyPortfolio) {
      const hotKey = currentHotkeyPortfolio[name].hotKey;
      const weight = new Decimal(0); // the weights do not matter in the difference portfolio
      const targetTao = targetPortfolio[name].taoAmount;
      const currentTao = currentHotkeyPortfolio[name].taoAmount;
      const differenceInTao = targetTao - currentTao;
      differencePortfolio[name] = {
        hotKey: hotKey,
        weight: weight,
        taoAmount: differenceInTao,
      };
    }

    // calculate the total amount of Tao that either needs to be staked or unstaked
    let transactionMap: rebalanceTransactionMap = {};
    for (const name in targetPortfolio) {
      // first get the variables to place in transaction map
      const hotKey = targetPortfolio[name].hotKey;
      // convert the tao into a Decimal to do decimal multiplication cleaner
      const taoDifference = new Decimal(
        differencePortfolio[name].taoAmount.toString()
      );
      const hotkeyTargetPercentage = targetPortfolio[name].weight;
      const taoToMoveForHotkey = new Decimal(totalTaoToMove.toString()).times(
        hotkeyTargetPercentage
      );

      const taoToMoveWithDifference = BigInt(
        taoToMoveForHotkey.plus(taoDifference).round().toFixed(0)
      );
      let type: 'stake' | 'unstake' | 'none' = 'none';
      if (taoToMoveWithDifference > 0) {
        type = 'stake';
      } else if (taoToMoveWithDifference < 0) {
        type = 'unstake';
      } else {
        type = 'none';
      }
      // build transaction map
      transactionMap[name] = {
        hotKey: hotKey,
        taoAmount: taoToMoveWithDifference,
        type: type,
      };
    }

    // verify if the amount send is equal to total amount to move
    let totalTaoMoved = 0n;
    for (const name in transactionMap) {
      totalTaoMoved += transactionMap[name].taoAmount;
    }

    const absValueTotalToMove =
      totalTaoToMove < 0 ? -totalTaoToMove : totalTaoToMove;
    const absValueTaoMoved = totalTaoMoved < 0 ? -totalTaoMoved : totalTaoMoved;

    if (
      absValueTotalToMove < absValueTaoMoved - 10n ||
      absValueTotalToMove > absValueTaoMoved + 10n
    ) {
      logger.error('Total Tao moved does not equal total Tao to Move', {
        functionName: 'rebalanceAndCreateStakeTransactions',
        totalTaoToMove: totalTaoToMove,
        totalTaoMoved: totalTaoMoved,
      });
      console.log(`Total tao To move: ${totalTaoToMove}`);
      console.log(`Total tao moved: ${totalTaoMoved}`);
      throw new Error('Total Tao moved does not equal total Tao to move');
    }

    if (shouldLog) {
      console.log('\ncurrent hotkey portfolio: ', currentHotkeyPortfolio);

      console.log('\nTarget hotkey portfolio: ', targetPortfolio);

      console.log('\nDifference Portfolio: ', differencePortfolio);

      let totalTaoToStake = 0n;
      let totalTaoToUnstake = 0n;
      Object.keys(transactionMap).forEach((key) => {
        const type = transactionMap[key].type;
        if (type === 'stake') {
          totalTaoToStake += transactionMap[key].taoAmount;
        } else if (type === 'unstake') {
          totalTaoToUnstake += transactionMap[key].taoAmount;
        }
      });

      console.log('\nTao to Stake            : ', totalTaoToStake);

      console.log('\nTao to Unstake          : ', totalTaoToUnstake);

      console.log('\nTotal Tao to Be Moved   : ', totalTaoToMove);

      console.log('\nActual Total Tao to Move: ', totalTaoMoved);

      console.log('\nTotal Cold Key In Stake : ', totalColdkeyStake);

      console.log('\nTransaction Map', transactionMap);
    }

    const shouldDoSendTx = totalTaoToMove < 0 ? true : false;
    return { transactionMap, shouldDoSendTx };
  }
}

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { decorateConstants } from '@polkadot/types';
import { _0n, stringToU8a, u8aToHex } from '@polkadot/util';
import {
  mnemonicValidate,
  signatureVerify,
  cryptoWaitReady,
} from '@polkadot/util-crypto';
import dotenv from 'dotenv';
import '../interfaces/augment-api';
import bitData from '../data/bitData';
import { appendFileSync } from 'fs';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function main() {
  const wsProvider = new WsProvider(process.env.BITTENSOR_WS_PROVIDER);
  const api = await ApiPromise.create({ provider: wsProvider });
  const keyring = new Keyring({ type: 'sr25519' });

  const bittensorModule = new BittensorTestUtils(
    api,
    wsProvider,
    keyring,
    false
  );
  await bittensorModule.setupByFile();
  const vaultKeyring = bittensorModule.coldKeyPairsMap.get('Vault')!;

  await bittensorModule.sendTransactionSecure(
    bittensorModule.keyringMap.get('Alice')!,
    bittensorModule.keyringMap.get('Vault')!,
    BigInt(1400000e9)
  );

  //const vaultKeyring = bittensorModule.coldKeyPairsMap.get('Vault')!;
  await bittensorModule.addStakeSecure(
    vaultKeyring,
    bittensorModule.hotKeyAddressMap.get('Validator1Hotkey')!,
    BigInt(10000e9)
  );
  await bittensorModule.addStakeSecure(
    vaultKeyring,
    bittensorModule.hotKeyAddressMap.get('Validator2Hotkey')!,
    BigInt(10000e9)
  );
  await bittensorModule.addStakeSecure(
    vaultKeyring,
    bittensorModule.hotKeyAddressMap.get('Validator3Hotkey')!,
    BigInt(10000e9)
  );

  const targetPortfolioVector = {
    Validator1Hotkey: new Decimal(0.01),
    Validator2Hotkey: new Decimal(0.1),
    Validator3Hotkey: new Decimal(0.89),
  };

  /* console.log(
    'total tao staked: ',
    await bittensorModule.getTotalColdKeyStake(vaultKeyring.address)
  );
  console.log(
    'tao staked in validator 1: ',
    await bittensorModule.getColdKeyStakeForHotkey(
      vaultKeyring.address,
      bittensorModule.hotKeyAddressMap.get('Validator1Hotkey')!
    )
  );
  console.log(
    'tao staked in validator 2: ',
    await bittensorModule.getColdKeyStakeForHotkey(
      vaultKeyring.address,
      bittensorModule.hotKeyAddressMap.get('Validator2Hotkey')!
    )
  );
  console.log(
    'tao staked in validator 3: ',
    await bittensorModule.getColdKeyStakeForHotkey(
      vaultKeyring.address,
      bittensorModule.hotKeyAddressMap.get('Validator3Hotkey')!
    )
  );
 */
  /* await bittensorModule.addStakeSecure(
    vaultKeyring,
    bittensorModule.hotKeyAddressMap.get('Validator1Hotkey')!,
    BigInt(50e9)
  );
  await bittensorModule.addStakeSecure(
    vaultKeyring,
    bittensorModule.hotKeyAddressMap.get('Validator2Hotkey')!,
    BigInt(30e9)
  );
  await bittensorModule.addStakeSecure(
    vaultKeyring,
    bittensorModule.hotKeyAddressMap.get('Validator3Hotkey')!,
    BigInt(20e9)
  );
 */
  /*  const targetPortfolioVector = {
    Validator1Hotkey: new Decimal(0.5),
    Validator2Hotkey: new Decimal(0.3),
    Validator3Hotkey: new Decimal(0.2),
  };
 */
  /*  const financeUtils = new FinanceUtils(bittensorModule, targetPortfolioVector);
  await financeUtils.initalize();

  await printStake(bittensorModule, vaultKeyring); */

  /* await bittensorModule.addStakeSecure(
    vaultKeyring,
    bittensorModule.hotKeyAddressMap.get('Validator1Hotkey')!,
    BigInt(35835e9)
  );
  await bittensorModule.addStakeSecure(
    vaultKeyring,
    bittensorModule.hotKeyAddressMap.get('Validator2Hotkey')!,
    BigInt(1678e9)
  );
  await bittensorModule.addStakeSecure(
    vaultKeyring,
    bittensorModule.hotKeyAddressMap.get('Validator3Hotkey')!,
    BigInt(678e9)
  ); */

  const total = await bittensorModule.getTotalColdKeyStake(
    vaultKeyring.address
  );
  /* const quickMath = total - BigInt(100e9);
  console.log('quick maths ', quickMath); */
  //console.log('TEST : ', total);
  //console.log(vaultKeyring.address);
  //console.log(bittensorModule.hotKeyAddressMap.get('Validator1Hotkey')!);
  //await bittensorModule.getAllAccountData(true);

  const financeUtils = new FinanceUtils(bittensorModule, targetPortfolioVector);
  await financeUtils.initalize();

  try {
    await bittensorModule.addStakeSecure(
      vaultKeyring,
      bittensorModule.hotKeyAddressMap.get('Validator1Hotkey')!,
      BigInt(1e9),
      true
    );
  } catch (error) {
    console.log(error);
  }

  const total2 = await bittensorModule.getTotalColdKeyStake(
    vaultKeyring.address
  );
  //console.log('TEST2 : ', total2);
  const test = await bittensorModule.getSingularBalance(vaultKeyring);
  const test2 = await bittensorModule.getColdKeyStakeForHotkey(
    vaultKeyring.address,
    bittensorModule.hotKeyAddressMap.get('Validator1Hotkey')!
  );
  //console.log('TEST3 : ', test.toHuman());
  //console.log('TEST4 : ', test2);

  /*  await bittensorModule.removeStakeSecure(
    vaultKeyring,
    bittensorModule.hotKeyAddressMap.get('Validator1Hotkey')!,
    await bittensorModule.getColdKeyStakeForHotkey(
      vaultKeyring.address,
      bittensorModule.hotKeyAddressMap.get('Validator1Hotkey')!
    )
  ); */
  await bittensorModule.sendTransactionSecure(
    bittensorModule.keyringMap.get('Alice')!,
    bittensorModule.keyringMap.get('Vault')!,
    BigInt(1000e9)
  );

  const { transactionMap, shouldDoSendTx } =
    await financeUtils.rebalanceAndCreateStakeTransactions(
      BigInt(1000e9),
      BigInt(0),
      true
    );
  ('1,340,997,999,875,351');
  ('1,339,997,999,750,703');
  console.log(`TRUE OR FALSE TO TRANSACT: ${shouldDoSendTx}`);
  console.log(transactionMap);

  let currentHKPortfolio = await bittensorModule.getCurrentHotKeyPortfolio();
  console.log('Current hotkey portfolio: ', currentHKPortfolio);
  const totalTaoInColdKey = await bittensorModule.getAccountData(
    vaultKeyring.meta.name!,
    true,
    false
  );
  console.log('Wait for blocks...');
  await bittensorModule.waitForBlocks(5);
  console.log('Completed waiting for 5 blocks');

  await bittensorModule.batchStakingUnstakingRequest(
    vaultKeyring,
    transactionMap,
    true
  );

  currentHKPortfolio = await bittensorModule.getCurrentHotKeyPortfolio();
  console.log('Current hotkey portfolio: ', currentHKPortfolio);
  const totalTaoInColdKey2 = await bittensorModule.getAccountData(
    'Vault',
    true,
    false
  );

  /* await bittensorModule.addStakeSecure(
    vaultKeyring,
    bittensorModule.hotKeyAddressMap.get('Validator1Hotkey')!,
    BigInt(10000e9)
  ); */

  /*
  await bittensorModule.addStakeSecure(
    keyring.getPair('Vault')!,
    keyring.getPair('Validator2Hotkey')!.address,
    BigInt(20000e9)
  );

  await bittensorModule.addStakeSecure(
    keyring.getPair('Vault')!,
    keyring.getPair('Validator3Hotkey')!.address,
    BigInt(20000e9)
  );
  console.log(
    'total tao staked: ',
    await bittensorModule.getTotalColdKeyStake(vaultKeyring.address)
  );
  console.log(
    'tao staked in validator 1: ',
    await bittensorModule.getColdKeyStakeForHotkey(
      vaultKeyring.address,
      bittensorModule.hotKeyAddressMap.get('Validator1')!
    )
  );
  console.log(
    'tao staked in validator 2: ',
    await bittensorModule.getColdKeyStakeForHotkey(
      vaultKeyring.address,
      bittensorModule.hotKeyAddressMap.get('Validator2')!
    )
  );
  console.log(
    'tao staked in validator 3: ',
    await bittensorModule.getColdKeyStakeForHotkey(
      vaultKeyring.address,
      bittensorModule.hotKeyAddressMap.get('Validator3')!
    )
  ); */
  //await financeUtils.setTargetPortfolioVector(targetPortfolioVector);
  //await financeUtils.calculateDepositAllocation(BigInt(10000e9));
  /*
  export interface HotkeyPortfolio {
    [name: string]: {
        hotKey: string;
        weight: Decimal;
        taoAmount: bigint;
      };
    }
    5GBhZx1pMm3yFUMgC6gJzZUtx9yUUJPhyf4n3EhUzGAYrjM1
    5Ge9vQY1mbYG1LSTKgkz9gBN1XHXB43iLki5GR4EGY7GPkAN
    5CnqxtcbGvrNyeT48MM7dT6EYQhtJUMGeLWtGbPh5sCJExoF
    */
}
async function printStake(
  bittensorModule: BittensorTestUtils,
  vaultKeyring: KeyringPair
) {
  console.log(
    'total tao staked: ',
    await bittensorModule.getTotalColdKeyStake(vaultKeyring.address)
  );
  console.log(
    'tao staked in validator 1: ',
    await bittensorModule.getColdKeyStakeForHotkey(
      vaultKeyring.address,
      bittensorModule.hotKeyAddressMap.get('Validator1Hotkey')!
    )
  );
  console.log(
    'tao staked in validator 2: ',
    await bittensorModule.getColdKeyStakeForHotkey(
      vaultKeyring.address,
      bittensorModule.hotKeyAddressMap.get('Validator2Hotkey')!
    )
  );
  console.log(
    'tao staked in validator 3: ',
    await bittensorModule.getColdKeyStakeForHotkey(
      vaultKeyring.address,
      bittensorModule.hotKeyAddressMap.get('Validator3Hotkey')!
    )
  );
}
main();

/*   // calculate the deposit allocation based on the target portfolio vector
  public async calculateDepositAllocation(taoDepositAmount: bigint) {
    // create a target allocation, if none is provided default to the original allocation
    // this is for rebalancing with no change in allocation
    let targetAllocationPercentages = await this.calculateTargetPortfolio();
    const vaultKeyringPairAddress = this.vaultKeyringPair!.address;
    const totalTaoInStake = await this.bittensor.getTotalColdKeyStake(
      vaultKeyringPairAddress
    );

    // calculate the true percentages of the hotkeys
    await this.setHotKeyPortfolio();
    const hotKeyTruePercentages = this.hotKeyPortfolio;

    // Calculate the new total amount of tao that will be staked
    const totalTaoInStakeWithDeposit = totalTaoInStake + taoDepositAmount;

    // Calculate the new ideal portfolio with the deposit
    const idealAllocationForDeposit: HotKeyPortfolio = {};

    for (const name in targetAllocationPercentages) {
      idealAllocationForDeposit[name] = {
        hotKey: targetAllocationPercentages[name].hotKey,
        weight: targetAllocationPercentages[name].weight,
        taoAmount: BigInt(
          targetAllocationPercentages[name].weight
            .times(new Decimal(totalTaoInStakeWithDeposit.toString()))
            .floor()
            .toFixed(0)
        ),
      };
    }

    // Calculate the amount of Tao we need to allocate to each hotkey
    const amountToStake: HotKeyPortfolio = {};
    for (const name in idealAllocationForDeposit) {
      const hotkey = idealAllocationForDeposit[name].hotKey;
      const weight = idealAllocationForDeposit[name].weight;
      const targetValue = new Decimal(
        idealAllocationForDeposit[name].taoAmount.toString()
      );
      const currentValue = new Decimal(
        hotKeyTruePercentages[name].taoAmount.toString()
      );
      const amountToAllocate = BigInt(
        Decimal.max(new Decimal(0), targetValue.minus(currentValue)).toFixed(0)
      );
      amountToStake[name] = {
        hotKey: hotkey,
        weight: weight,
        taoAmount: amountToAllocate,
      };
    }

    // Calculate the total amount needed to stake in order to balance the portfolio
    let totalAmountNeeded = BigInt(0);
    for (const name in amountToStake) {
      totalAmountNeeded += amountToStake[name].taoAmount;
    }

    // calculate a proportional factor if its the case that the total amount needed to rebalance is greater than the deposit
    let proportionalFactor = new Decimal(1);
    const adjustedAmountToStake = amountToStake;
    if (taoDepositAmount < totalAmountNeeded) {
      proportionalFactor = new Decimal(taoDepositAmount.toString()).dividedBy(
        new Decimal(totalAmountNeeded.toString())
      );

      // Now calculate the adjusted amount to stake
      for (const name in adjustedAmountToStake) {
        adjustedAmountToStake[name].taoAmount = BigInt(
          new Decimal(adjustedAmountToStake[name].taoAmount.toString())
            .times(proportionalFactor)
            .floor()
            .toFixed(0)
        );
      }
    }
  }
 */
/*  console.log('==================================');
    let sumTao: bigint = 0n;
    Object.keys(hotKeyTruePercentages).forEach((key) => {
      console.log(
        `Hotkey: ${hotKeyTruePercentages[key].hotKey}, Weight: ${hotKeyTruePercentages[key].weight}, Tao Amount: ${hotKeyTruePercentages[key].taoAmount}`
      );
      sumTao += hotKeyTruePercentages[key].taoAmount;
    });
    console.log(`Total Tao in Stake: ${totalTaoInStake}`);
    console.log(sumTao);
    console.log('==================================');

    console.log('==================================');
    sumTao = 0n;
    Object.keys(targetAllocationPercentages).forEach((key) => {
      console.log(
        `Hotkey: ${targetAllocationPercentages[key].hotKey}, Weight: ${targetAllocationPercentages[key].weight}, Tao Amount: ${targetAllocationPercentages[key].taoAmount}`
      );
      sumTao += targetAllocationPercentages[key].taoAmount;
    });
    console.log(`Total Tao in Stake: ${totalTaoInStake}`);
    console.log(sumTao);
    console.log('==================================');

    logger.info('Starting Calculating Deposit Allocation', {
      functionName: 'calculateDepositAllocation',
      taoDepositAmount: taoDepositAmount,
      totalTaoInStake: totalTaoInStake,
      currentHotKeyPortfolio: hotKeyTruePercentages,
      targetAllocationPortfolio: targetAllocationPercentages,
    });

    // calculate percentage difference between target and true percentages
    const percentageDifference: {
      [name: string]: {
        difference: Decimal;
        hotkey: string;
      };
    } = {};

    // for each to calculate the difference between the target and the true percentages
    for (const name in hotKeyTruePercentages) {
      const data = hotKeyTruePercentages[name];
      const idealData = targetAllocationPercentages[name];
      const difference = idealData.weight.minus(data.weight);
      percentageDifference[name] = {
        difference: difference,
        hotkey: data.hotKey,
      };
    }

    console.log(
      `Percentage Difference between target and true percentages,`,
      percentageDifference
    );

    // calculate how the new deposit should be ideally allocated
    const idealAllocationForDeposit: HotKeyPortfolio = {};

    for (const name in targetAllocationPercentages) {
      idealAllocationForDeposit[name] = {
        hotKey: targetAllocationPercentages[name].hotKey,
        weight: targetAllocationPercentages[name].weight,
        taoAmount: BigInt(
          targetAllocationPercentages[name].weight
            .times(new Decimal(taoDepositAmount.toString()))
            .floor()
            .toFixed(0)
        ),
      };
    }

    const preAdjustIdealAllocationForDeposit = idealAllocationForDeposit;
    console.log('\n==================================');
    console.log(
      `Ideal Allocation Portfolio for Deposit`,
      idealAllocationForDeposit
    );
    console.log('==================================\n');

    // calculate the total negative difference to be used in the adjustment factor
    let negativeDifference = new Decimal(0);
    for (const name in percentageDifference) {
      if (percentageDifference[name].difference.lessThan(0)) {
        negativeDifference = negativeDifference.plus(
          percentageDifference[name].difference
        );
      }
    }

    console.log(`Negative difference: ${negativeDifference}`);

    if (negativeDifference.lessThan(0)) {
      // case where the deposit is less than the total tao in stake
      const adjustmentFactor = new Decimal(
        taoDepositAmount.toString()
      ).dividedBy(
        negativeDifference.times(new Decimal(totalTaoInStake.toString()))
      );
      console.log('Adjustment Factor: ', adjustmentFactor);
      for (const name in idealAllocationForDeposit) {
        if (percentageDifference[name].difference.lessThan(0)) {
          console.log(
            `Adjusting ${name}, with tao amount: ${idealAllocationForDeposit[name].taoAmount}`
          );
          const taoAMT = new Decimal(
            idealAllocationForDeposit[name].taoAmount.toString()
          ).plus(
            percentageDifference[name].difference
              .times(new Decimal(totalTaoInStake.toString()))
              .times(adjustmentFactor)
              .floor()
              .toFixed(0)
          );
          console.log(`New Adjusted Value: ${taoAMT}`);
        }
      }
    }

    console.log('\n==================================');
    console.log(
      'Ideal Allocation For Deposit PRE adjustment: ',
      preAdjustIdealAllocationForDeposit
    );
    console.log('==================================\n');

    console.log('\n==================================');
    console.log(
      'Ideal Allocation For Deposit post adjustment: ',
      idealAllocationForDeposit
    );
    console.log('==================================\n');

    const totalAllocatedTao = Object.values(idealAllocationForDeposit).reduce(
      (sum, asset) => {
        return sum + asset.taoAmount;
      },
      BigInt(0)
    );

    console.log(`Total Allocated Tao: ${totalAllocatedTao}`);

    if (totalAllocatedTao > taoDepositAmount) {
      const scaleFactor = taoDepositAmount / totalAllocatedTao;
      for (const name in idealAllocationForDeposit) {
        idealAllocationForDeposit[name].taoAmount *= scaleFactor;
      }
    }
    console.log(
      `Final allocation deposit portfolio: ${idealAllocationForDeposit}`
    );
    return idealAllocationForDeposit; */

/*
  public async calculatePortfolioPercentage() {
    const HotKeyTruePercentages: HotKeyTruePercentage[] = [];
    const totalTaoInStake = (
      await this.bittensor.api.query.subtensorModule.totalColdkeyStake(
        this.bittensor.keyringMap.get('Vault')!.address
      )
    ).toBigInt();
    Object.entries(this.hotKeyPortfolio).forEach(async ([name, data]) => {
      const taoStakedInHotkey = (
        await this.bittensor.api.query.subtensorModule.stake(
          this.vaultKeyringPair!.address,
          data.hotKey
        )
      ).toBigInt();

      const totalTaoStakedAsDecimal = new Decimal(totalTaoInStake.toString());
      const taoStakedInHotkeyAsDecimal = new Decimal(
        taoStakedInHotkey.toString()
      );

      const percentage: Decimal = taoStakedInHotkeyAsDecimal.dividedBy(
        totalTaoStakedAsDecimal
      );

      HotKeyTruePercentages.push({
        name: name,
        hotKey: data.hotKey,
        taoAmount: taoStakedInHotkey,
        percentage: percentage,
      });
    });
    return HotKeyTruePercentages;
  }
    */

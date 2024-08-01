import '@polkadot/wasm-crypto/initWasmAsm';
import BittensorTestUtils from './BittensorTestUtils';
import { Decimal } from 'decimal.js';
import '@polkadot/wasm-crypto/initWasmAsm';
import 'tx2';
import logger from '../utils/logger';
import HotKeyPortfolio from '../types/HotkeyPortfolio';
import { KeyringPair } from '@polkadot/keyring/types';

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

    let totalTaoToStake = 0n;
    let totalTaoToUnstake = 0n;

    if (shouldLog) {
      console.log('\ncurrent hotkey portfolio: ', currentHotkeyPortfolio);

      console.log('\nTarget hotkey portfolio: ', targetPortfolio);

      console.log('\nDifference Portfolio: ', differencePortfolio);
      totalTaoToStake = 0n;
      totalTaoToUnstake = 0n;
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

    const shouldDoSendTx =
      totalTaoToStake === 0n && totalTaoToUnstake === 0n ? false : true;
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
import bitData from '../random/bitData';
import { appendFileSync } from 'fs';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

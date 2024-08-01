import { ApiPromise, WsProvider } from '@polkadot/api';
import BittensorTestUtils from '../processors/BittensorTestUtils';
import ethWallets from '../data/testWallets';
import { stringToU8a, u8aToHex } from '@polkadot/util';
import bittensorTestWallets from '../data/bittensorTestWallets';
import { Keyring } from '@polkadot/keyring';
import {
  cryptoWaitReady,
  mnemonicGenerate,
  mnemonicToMiniSecret,
  randomAsHex,
} from '@polkadot/util-crypto';
import dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
async function main() {
  await cryptoWaitReady();

  const wsProviderTemp = new WsProvider(process.env.BITTENSOR_WS_PROVIDER);
  const apiTemp = await ApiPromise.create({ provider: wsProviderTemp });
  let keyringTemp = new Keyring({ type: 'sr25519' });

  const bittensorModule = new BittensorTestUtils(
    apiTemp,
    wsProviderTemp,
    keyringTemp,
    false
  );

  await bittensorModule.setupByFile();

  await bittensorModule.sendTransactionSecure(
    bittensorModule.keyringMap.get('Alice')!,
    bittensorModule.keyringMap.get('Vault')!,
    BigInt(100000e9)
  );
  const vaultKeyring = bittensorModule.keyringMap.get('Vault')!;
  await bittensorModule.addStakeSecure(
    vaultKeyring,
    bittensorModule.hotKeyAddressMap.get('Validator1Hotkey')!,
    BigInt(10000e9)
  );
  console.log(
    'TOTAL tao staked in vault: ',
    await bittensorModule.getTotalColdKeyStake(vaultKeyring.address)
  );

  console.log(
    'tao staked in validator 1: ',
    await bittensorModule.getColdKeyStakeForHotkey(
      vaultKeyring.address,
      bittensorModule.hotKeyAddressMap.get('Validator1Hotkey')!
    )
  );

  //console.log(`Subscribing to extrinsics...`);
  /*
    const exSub = await bittensorModule.blockSubscriptionToTransferTest(
        keyringPairs[6].address
    );
    */
  /*


    console.log(`Testing Sending a Secure Transaction...`);
    await bittensorModule.sendTransactionSecure(
        keyringPairs[0],
        keyringPairs[6],
        BigInt(10e9),
        true
    );

    console.log(`Testing batch sending transactions...`);
    let transactionMap = new Map<string, bigint>();
    keyringPairs.forEach((pair) => {
        transactionMap.set(pair.address, BigInt(3e9));
    });
    await bittensorModule.batchTransferRequest(
        keyringPairs[0],
        transactionMap,
        true
    );
    console.log(`\n \n \n Testing Batch with VAULT`);
    transactionMap = new Map<string, bigint>();
    transactionMap.set(keyringPairs[6].address, BigInt(21e9));
    transactionMap.set(keyringPairs[6].address, BigInt(22e9));
    transactionMap.set(keyringPairs[6].address, BigInt(23e9));
    transactionMap.set(keyringPairs[6].address, BigInt(24e9));
    await bittensorModule.batchTransferRequest(
        keyringPairs[0],
        transactionMap,
        true
    );
    */

  /*
    console.log(
        (await bittensorModule.getSingularBalance(keyringPairs[0])).toHuman()
    );
    console.log(
        (await bittensorModule.getSingularBalance(keyringPairs[1])).toHuman()
    );
    */
  /*
    console.log(
        (await bittensorModule.api.query.subtensorModule.totalStake()).toHuman()
    );
    console.log(
        (
            await bittensorModule.api.query.subtensorModule.totalColdkeyStake(
                keyringPairs[1].address
            )
        ).toHuman()
    );
    console.log(
        (
            await bittensorModule.api.query.subtensorModule.stake(
                '5DqDUXvbapugi2Djv2bGvhmjWTZPggBvKAJ7dR67Gn7iHbNQ',
                keyringPairs[1].address
            )
        ).toHuman()
    );
    console.log(
        (
            await bittensorModule.api.query.subtensorModule.totalHotkeyStake(
                '5DqDUXvbapugi2Djv2bGvhmjWTZPggBvKAJ7dR67Gn7iHbNQ'
            )
        ).toHuman()
    );
    */

  /*
    console.log('Testing Bittensor Module, with 10 generated accounts');

    console.log(`Subscribing to Alice's account...`);
    console.log(`Subscribing to Bob's Account...`);
    const balanceSubAlice = await bittensorModule.subscribeToFinalizedBalance(
        keyringPairs[0]
    );
    const balanceSubBob = await bittensorModule.subscribeToFinalizedBalance(
        keyringPairs[1]
    );
    console.log(`Testing Get All Account Balances...`);
    console.log(await bittensorModule.getBalances(keyringPairs, true));

    console.log(`Subscribing to extrinsics...`);
    const exSub = await bittensorModule.blockSubscription();

    console.log(`Testing Sending a Secure Transaction...`);
    await bittensorModule.sendTransactionSecure(
        keyringPairs[0],
        keyringPairs[1],
        BigInt(10e9),
        true
    );

    console.log(`Testing batch sending transactions...`);
    let transactionMap = new Map<string, bigint>();
    keyringPairs.forEach((pair) => {
        transactionMap.set(pair.address, BigInt(3e9));
    });
    await bittensorModule.batchTransferRequest(
        keyringPairs[0],
        transactionMap,
        true
    );

    console.log(`Testing Get Staking Interval & Transfer Fee...`);
    await bittensorModule.getStakingInterval();
    await bittensorModule.getTransferFee(keyringPairs[0], keyringPairs[1]);

    console.log(`Testing Get All Account Balances...`);
    console.log(await bittensorModule.getBalances(keyringPairs, true));

    console.log(`Signing a message...`);
    const ethWalletAddresses = ethWallets.map(({ account }) => account);
    const message = bittensorModule.signMessage(
        keyringPairs[0],
        ethWalletAddresses[0]
    );

    console.log(`Signature : ${u8aToHex(message)}`);

    console.log(`Verifying a message...`);
    console.log(
        `Verification Result: `,
        bittensorModule.verifyMessage(
            ethWalletAddresses[0],
            message,
            keyringPairs[0].address,
            true
        )
    );
    console.log(`Verifying a message with wrong signer...`);
    console.log(
        `Verification Result: `,
        bittensorModule.verifyMessage(
            ethWalletAddresses[0],
            message,
            keyringPairs[1].address,
            true
        )
    );

    console.log(`Testing finding valid in ethKeys...`);
    let ethKeys: { address: string; signature: Uint8Array }[] = [];
    for (let i = 0; i < keyringPairs.length; i++) {
        ethKeys.push({
            address: ethWalletAddresses[i],
            signature: bittensorModule.signMessage(
                keyringPairs[i],
                ethWalletAddresses[i]
            ),
        });
    }
    console.log(
        `Valid Signers: ${bittensorModule.findValidEthAddressInEthKeys(ethKeys, keyringPairs[4].address)}`
    );

    console.log(`Testing adding stake...`);
    await bittensorModule.addStakeSecure(
        keyringPairs[0],
        bittensorModule.delegatesList[0],
        BigInt(123e9),
        true
    );

    console.log(`Testing removing stake...`);
    await bittensorModule.removeStakeSecure(
        keyringPairs[0],
        bittensorModule.delegatesList[0],
        BigInt(34e9)
    );

    console.log(`Testing quick send with finality...`);
    await bittensorModule.quickSendWithFinality(
        keyringPairs[0],
        keyringPairs[1],
        BigInt(11e9),
        10
    );
    */

  console.log(`Finshed for now`);
}

main();

// learn how to query for these stats:
// - Staking interval
// - current bittensor transfer fee
// - delegator aprs
// - wallet's balance
// - wallet's staking rewards, if possible
//
// learn how to listen to events such as
// - filtered wallet transfers (from and to)
// - delegator apr changes
//
// learn how to send extrinsics such as:
// - staking
// - unstaking
// - multiple - transfer request
// - filter and bundle transfer request
//
// other utils:
// - signing messages
// - creating test wallets/using
// - any other additional utils
// - create modular request class

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { SubmittableExtrinsic } from '@polkadot/api-base/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { stringToU8a, u8aToHex } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';
import dotenv from 'dotenv';
import '../interfaces/augment-api';
import testWallets from '../data/testWallets';
import {
    mnemonicGenerate,
    mnemonicToMiniSecret,
    randomAsHex,
} from '@polkadot/util-crypto';

dotenv.config();

// learn how to query for these stats:
// - Staking interval
// - current bittensor transfer fee
// - delegator aprs
// - wallet's balance
// - wallet's staking rewards, if possible

async function main() {
    const wsProvider = new WsProvider(process.env.BITTENSOR_WS_PROVIDER);
    const api = await ApiPromise.create({ provider: wsProvider });

    let keyring = new Keyring({ type: 'sr25519' });
    keyring.addFromUri('//Alice', { name: 'Alice' });
    keyring.addFromUri('//Bob', { name: 'Bob' });
    keyring.addFromUri('//Charlie', { name: 'Charlie' });
    keyring.addFromUri('//Dave', { name: 'Dave' });
    keyring.addFromUri('//Eve', { name: 'Eve' });
    keyring.addFromUri('//Ferdie', { name: 'Ferdie' });

    let subnetKeyring = new Keyring({ type: 'sr25519' });

    let keypairAddresses = keyring.getPairs().map((pair) => pair.address);
    console.log(keypairAddresses);
    let keypairMapping: { [key: string]: KeyringPair } = {};
    keyring.getPairs().forEach((pair) => {
        if (
            pair.meta.name !== undefined &&
            typeof pair.meta.name === 'string'
        ) {
            keypairMapping[pair.meta.name] = pair;
        }
    });
    const blocksub = await blockSubscription(api);
    const subnetUtilKeys = [
        '5FyNHAKvrBQdiaK7PKpyErL7KXV8Bi1eBMyAdEBBWCFTHdrg',
        '5CnzCxmXHr2dC4SekptSBb3deuXsYHMnivXqLay6x61xPqko',
        '5DJbCcB5skvDqTNG5875WtT2gGa5FN35jtLE48Y2uNKK3rMD',
        '5GjcYTJdjfYF2qK6u3bjj3AjWAJAxbfhFo3zkxzhWBYn4wdR',
        '5DAeaKDsw8NqMt3oWzZU69AHGQ3612iXvNoDxqpvxcgZYW7m',
        '5FvuFeFbmfVP1dAUSQw18ans4rboupvJapB7oUBvSK8p32DU',
    ];
    await getStakingInterval(api);
    await getBalances(api, subnetUtilKeys, true);
    //console.log(await initalizeMinersValidators(api, keypairMapping['Alice']));
    /*
    await addStakeSecure(
        api,
        keypairMapping['Alice'],
        '5EPTSScCiWrtUNF668zxWbJ561ZfEY2vDXWrMLNaF2mm5exx',
        BigInt(100e9)
    );
    */

    const batchStakeUnstakes = [
        api.tx.subtensorModule.addStake(
            '5EPTSScCiWrtUNF668zxWbJ561ZfEY2vDXWrMLNaF2mm5exx',
            BigInt(10e9)
        ),
        api.tx.subtensorModule.removeStake(
            '5DqDUXvbapugi2Djv2bGvhmjWTZPggBvKAJ7dR67Gn7iHbNQ',
            BigInt(100e9)
        ),
    ];
    const nonce = await getNextNonce(api, keypairMapping['Alice']);
    const batchTransactions = await api.tx.utility
        .batch(batchStakeUnstakes)
        .signAndSend(keypairMapping['Alice'], { nonce });
    let transactionMap = new Map<string, bigint>();
    transactionMap.set(keypairMapping['Bob'].address, 1n);
    transactionMap.set(keypairMapping['Charlie'].address, 1n);
    transactionMap.set(keypairMapping['Dave'].address, 1n);
    transactionMap.set(keypairMapping['Eve'].address, 1n);
    transactionMap.set(keypairMapping['Ferdie'].address, 1n);
    for (let i = 0; i < 40; i++) {
        transactionMap.set(keypairMapping['Bob'].address, 1n);
    }
    generateAdditionalKeyrings(keyring, 30);
    keyring.getPairs().forEach((pair) => {
        transactionMap.set(pair.address, 1000000000n);
    });
    console.log(transactionMap);
    await batchTransferRequest(api, keypairMapping['Alice'], transactionMap);
    console.log('Complete');
}

//
//Password1
//
//
//
//
//
async function getNextNonce(api: ApiPromise, keypair: KeyringPair) {
    return await api.rpc.system.accountNextIndex(keypair.address);
}

function generateAdditionalKeyrings(
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

async function getPredictedFees(
    api: ApiPromise,
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

async function batchTransferRequest(
    api: ApiPromise,
    sender: KeyringPair,
    transactionMap: Map<string, bigint>,
    shouldReadEvents: boolean = false
): Promise<void> {
    const batchTx = new Promise(async (resolve, reject) => {
        const nonce = await api.rpc.system.accountNextIndex(sender.address);
        let preBatchedTransactions: any[] = [];
        let index = 0;
        transactionMap.forEach((amount, recipient) => {
            console.log(
                `Batching Transactions: ${index} of ${transactionMap.size}: ${recipient} -> ${amount}`
            );
            preBatchedTransactions.push(
                api.tx.balances.transferAllowDeath(recipient, amount)
            );
            index++;
        });
        const info = await api.tx.utility
            .batch(preBatchedTransactions)
            .paymentInfo(sender, { nonce });
        console.log(
            `class=${info.class.toString()}, weight=${info.weight.toString()}, partialFee=${info.partialFee.toHuman()}`
        );
        const batchTransactions = api.tx.utility.batch(preBatchedTransactions);
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
                        return api.events.system.ExtrinsicFailed.is(event);
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

async function getStakingInterval(api: ApiPromise) {
    console.log((await api.query.subtensorModule.stakeInterval()).toHuman());
    console.log(
        (await api.query.subtensorModule.targetStakesPerInterval()).toHuman()
    );
}

async function getTransferFee(
    api: ApiPromise,
    sender: KeyringPair,
    recipient: KeyringPair
) {
    const transferTx = api.tx.balances.transferAllowDeath(
        recipient.address,
        1n
    );
    const nonce = await getNextNonce(api, sender);
    const info = await transferTx.paymentInfo(sender, { nonce });
    console.log('\nPayment Info: ', info.toHuman().partialFee);
}

function signMessage(
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

function verifyMessage(
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

function findValidEthAddressInEthKeys(
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
            verifyMessage(address, signature, publicAddress) &&
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

async function sendTransaction(
    api: ApiPromise,
    sender: KeyringPair,
    recipient: KeyringPair | string,
    amount: bigint,
    shouldReadEvents: boolean = false
): Promise<void> {
    return new Promise(async (resolve) => {
        const nonce = await api.rpc.system.accountNextIndex(sender.address);
        console.log(`Nonce for ${sender.address}: ${nonce}`);

        await api.tx.balances
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

async function addStakeSecure(
    api: ApiPromise,
    sender: KeyringPair,
    recipient: string,
    amount: bigint,
    shouldReadEvents: boolean = false
): Promise<void> {
    return new Promise(async (resolve) => {
        const nonce = await api.rpc.system.accountNextIndex(sender.address);
        console.log(`Nonce for ${sender.address}: ${nonce}`);

        await api.tx.subtensorModule
            .addStake(recipient, amount)
            .signAndSend(sender, { nonce }, ({ status, events }) => {
                console.log(
                    `Start staking request to ${recipient}, amt: ${formatHumanReadableNumber(amount.toString())}`
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

async function removeStakeSecure(
    api: ApiPromise,
    sender: KeyringPair,
    recipient: string,
    amount: bigint,
    shouldReadEvents: boolean = false
): Promise<void> {
    return new Promise(async (resolve) => {
        const nonce = await api.rpc.system.accountNextIndex(sender.address);
        console.log(`Nonce for ${sender.address}: ${nonce}`);

        await api.tx.subtensorModule
            .removeStake(recipient, amount)
            .signAndSend(sender, { nonce }, ({ status, events }) => {
                console.log(
                    `Start staking request to ${recipient}, amt: ${formatHumanReadableNumber(amount.toString())}`
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

async function quickSend(
    api: ApiPromise,
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
    return new Promise(async (resolve) => {
        let transactionCount = 0;
        for (let i = 0; i < numberOfTransactions; i++) {
            try {
                console.log(
                    `\n starting ${i} transaction within quick send....`
                );
                let nonce = await api.rpc.system.accountNextIndex(
                    sender.address
                );
                console.log(`Nonce for ${sender.address}: ${nonce}`);

                const tx = await api.tx.balances
                    .transferAllowDeath(
                        recipient.address,
                        Array.isArray(amountToSend)
                            ? amountToSend[i]
                            : amountToSend
                    )
                    .signAndSend(sender, { nonce }, ({ status }) => {
                        if (status.isInBlock) {
                            console.log(`${i} transaction is in block`);
                            tx();
                            transactionCount++;
                        }
                        if (transactionCount === numberOfTransactions) {
                            resolve();
                        }
                    });
            } catch (error) {
                console.error('Error in quick send:', error);
            }
        }
        console.log(
            `Quick send complete, ${numberOfTransactions} transactions sent`
        );
    });
}

async function quickSendWithFinality(
    api: ApiPromise,
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
    let startingNonce = await api.rpc.system.accountNextIndex(sender.address);
    console.log(
        `Starting quick send with finality, sending ${numberOfTransactions} transactions`
    );
    for (let i = 0; i < numberOfTransactions; i++) {
        const sendAmt = Array.isArray(amountToSend)
            ? amountToSend[i]
            : amountToSend;
        const nonce = startingNonce.addn(i);

        const newTxPromise = new Promise((resolve, reject) => {
            api.tx.balances
                .transferAllowDeath(recipient.address, sendAmt)
                .signAndSend(sender, { nonce }, ({ status, events }) => {
                    if (status.isFinalized) {
                        console.log(`Transaction ${i} finalized`);
                        const extrinsicFailed = events.find(({ event }) => {
                            return api.events.system.ExtrinsicFailed.is(event);
                        });
                        if (extrinsicFailed) {
                            reject(
                                new Error(
                                    `Transaction ${i} failed after finalization`
                                )
                            );
                        } else {
                            resolve(
                                ` resolution/finalized hash ${status.asFinalized}`
                            );
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

// hard coded for owner, validator 1, validator, validator 2, miner
async function initalizeMinersValidators(api: ApiPromise, sender: KeyringPair) {
    const pubKeys = [
        '5FyNHAKvrBQdiaK7PKpyErL7KXV8Bi1eBMyAdEBBWCFTHdrg',
        '5CnzCxmXHr2dC4SekptSBb3deuXsYHMnivXqLay6x61xPqko',
        '5DJbCcB5skvDqTNG5875WtT2gGa5FN35jtLE48Y2uNKK3rMD',
        '5GjcYTJdjfYF2qK6u3bjj3AjWAJAxbfhFo3zkxzhWBYn4wdR',
        '5DAeaKDsw8NqMt3oWzZU69AHGQ3612iXvNoDxqpvxcgZYW7m',
        '5FvuFeFbmfVP1dAUSQw18ans4rboupvJapB7oUBvSK8p32DU',
    ];
    const transMap = new Map<string, bigint>();
    pubKeys.forEach((address) => {
        transMap.set(address, BigInt(1000e9));
    });
    console.log(
        `\n Starting a batch transfer request within initalize miners & validators, sent amount is 1000e9`
    );
    await batchTransferRequest(api, sender, transMap);
    return await getBalances(api, pubKeys);
}

function formatHumanReadableNumber(
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

async function getBalances(
    api: ApiPromise,
    accounts: KeyringPair[] | string[],
    prettier: boolean = false
) {
    let balancesAcc = [];
    for (let i = 0; i < accounts.length; i++) {
        if ((accounts[i] as KeyringPair).address !== undefined) {
            let balance = await api.query.system.account(
                (accounts[i] as KeyringPair).address
            );
            balancesAcc.push(balance.data.free.toHuman());
        } else {
            let balance = await api.query.system.account(accounts[i] as string);
            balancesAcc.push(balance.data.free.toHuman());
        }
    }
    if (prettier) {
        balancesAcc.forEach((balance, index) => {
            console.log(
                `Account at index: ${index} has balance of : ${formatHumanReadableNumber(balance)} tao`
            );
        });
    }
    return balancesAcc;
}

async function getSingularBalance(api: ApiPromise, account: KeyringPair) {
    const balance = await api.query.system.account(account.address);
    return balance;
}

async function subscribeToFinalizedBalance(
    api: ApiPromise,
    keyPair: KeyringPair
) {
    let lastKnownBalance = '';
    const unsubscribe = await api.rpc.chain.subscribeFinalizedHeads(
        async (finalHeader) => {
            const apiAt = await api.at(finalHeader.hash);
            const accountData = await apiAt.query.system.account(
                keyPair.address
            );
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

async function subscribeToFinalizedBalance2(
    api: ApiPromise,
    keyPair: KeyringPair
) {
    let lastKnownBalance = '';
    const unsubscribe = await api.rpc.chain.subscribeNewHeads(
        async (header) => {
            // Check if the block is finalized
            const finalizedHash = await api.rpc.chain.getFinalizedHead();
            const finalizedHeader =
                await api.rpc.chain.getHeader(finalizedHash);

            if (header.number.eq(finalizedHeader.number)) {
                // This block is finalized, so let's check Bob's balance
                const accountInfo = await api.query.system.account(
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

async function blockSubscription(
    api: ApiPromise,
    extrinsicArray?: any[],
    eventsArray?: any[]
) {
    const blockHash = await api.rpc.chain.subscribeFinalizedHeads(
        async (finalizedHeader) => {
            console.log('\n---');
            console.log('Aquiring new block...');
            console.log('block number: ', finalizedHeader.toHuman().number);
            console.log('block hash: ', finalizedHeader.hash.toHuman());

            const signedBlock = await api.rpc.chain.getBlock(
                finalizedHeader.hash
            );
            const apiAt = await api.at(finalizedHeader.hash);
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
                    const events = allRecords
                        .filter(({ phase }) => {
                            return (
                                phase.isApplyExtrinsic &&
                                phase.asApplyExtrinsic.eq(index)
                            );
                        })
                        .forEach(({ event }) => {
                            console.log(
                                `new event: ${event.section}.${event.method} from ${section}.${method}`
                            );
                            if (
                                api.events.system.ExtrinsicSuccess.is(event) &&
                                !section.includes('timestamp')
                            ) {
                                const [dispatchInfo] = event.data;
                                console.log(
                                    `${section}.${method}:: ExtrinsicSuccess:: ${JSON.stringify(dispatchInfo.toHuman())}`
                                );
                            } else if (
                                api.events.system.ExtrinsicFailed.is(event)
                            ) {
                                const [dispatchError, dispatchInfo] =
                                    event.data;
                                let errorInfo;

                                // decode error
                                if (dispatchError.isModule) {
                                    const decoded = api.registry.findMetaError(
                                        dispatchError.asModule
                                    );
                                    errorInfo = `${decoded.section}.${decoded.name}`;
                                } else {
                                    errorInfo = dispatchError.toString();
                                }
                            }
                            if (!section.includes('timestamp')) {
                                console.log(event.toHuman());
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

/*
async function simpleBlockSubscription(api: ApiPromise) {
    const blockHash = await api.rpc.chain.subscribeFinalizedHeads(
        async (finalizedHeader) => {
            const signedBlock = await api.rpc.chain.getBlock(
                finalizedHeader.hash
            );
            const apiAt = await api.at(finalizedHeader.hash);
            const allRecords = await apiAt.query.system.events();
            const signedBlockSimple = signedBlock.block;

            const simplifiedBlock = {
                header: {
                    number: signedBlockSimple.header.number.toHuman(),
                    hash: signedBlockSimple.header.hash.toHuman(),
                },
                extrinsics: signedBlockSimple.extrinsics.map((ex, index) => {
                    index, method;
                }),
            };
        }
    );
}
*/
main();
/*

/*
    const testQuery = await api.rpc.chain.subscribeFinalizedHeads((header) => {
        console.log('header:', header.toHuman());
    });
    const testQuertyNon = await api.rpc.chain.subscribeNewHeads((header) => {
        console.log('header new heads:', header.toHuman());
    });
    const unsub = await api.derive.chain.subscribeNewHeads((lastHeader) => {
        console.log(
            `#${lastHeader.number} was authored by ${lastHeader.author}`
        );
    });
    */ /*
    console.log(api.tx.subtensorModule);
    console.log(
        await api.query.subtensorModule.stakeInterval().then((value) => {
            return value.toString();
        })
    );
    //const addr = '9fb2e0e7a67d6a22632ff858daf99e83752ea4446934e44be2e9990c7e3c0cf';

    //const chain = await api.rpc.system.chain();
    //const addr = '5G15NVhptjPVQYQyg3U4gR14oPMZxVBVrdBH9TvkTvD2qYpH'
    // Retrieve the latest header
    //const lastHeader = await api.rpc.chain.getHeader();
    //const lastFinalHeader = await api.rpc.chain.getFinalizedHead();
    const keyring = new Keyring({ type: 'sr25519' });
    const bobkeyring = keyring.createFromUri('//Bob');
    console.log('keyring', keyring);
    console.log('bob ring: ', bobkeyring);
    const alicekeyring = keyring.createFromUri('//Alice');

    console.log(
        await api.query.subtensorModule.stakeInterval().then((value) => {
            return value.toString();
        })
    );

    const unstake = api.query.subtensorModule.targetStakesPerInterval();

    //const balanceBob = await api.query.system.account(bobkeyring);
    //const message = stringToU8a('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    const message = stringToU8a('0x617F2E2fD72FD9D5503197092aC168c91465E7f2');
    const sig = bobkeyring.sign(message);
    console.log(sig.toString());
    console.log(u8aToHex(sig));
    console.log(sig.length);
    console.log('bobs address ' + bobkeyring.address);
    const { isValid } = signatureVerify(message, sig, bobkeyring.address);
    // tao publickey -> [sig : {
    // ether wallet
    // signed eth
    //},
    // sig  : { maletherwallet, signed eth}
    //
    // tao 1 - > 3 vault
    // tao 1 - > 2 vault
    // tao 1 - > 5 vault
    //
    // eth -> balance (erc20)
    //sign their eth wallet
    // createAccount(tao public, ether + signed eth)
    // externrall tao -> our tao public key
    // we detect money going to our tao from their public tao address
    //
    // 5G15NVhptjPVQYQyg3U4gR14oPMZxVBVrdBH9TvkTvD2qYpH
    // 5F4tQyWrhfGVcNhoqeiNsR6KjD4wMZ2kfhLj4oHYuyHbZAc3

    // output the result
    console.log(`${u8aToHex(sig)} is ${isValid ? 'valid' : 'invalid'}`);
    */ // Do something
//console.log(api.genesisHash.toHex());
//onsole.log(timestamps);
//ws://localhost:9945

// part 2
/*
 const stakingInterval = await api.query.subtensorModule.stakeInterval();
    console.log('staking interval:', stakingInterval.toHuman());

    const bobKeyPair = keyring.getPairs()[1];
    const bobBalance = (
        await api.query.system.account(bobKeyPair.address)
    ).toHuman();
    //console.log('bob balance:', bobBalance.data.free);

    // Subscribe to bob's balance:
    const unsub = await api.query.system.account(
        bobKeyPair.address,
        (result) => {
            console.log('');
            console.log('IN BOB BAL LISTENER');
            console.log('bob balance:', result.data.free.toHuman());
        }
    );

    let nonce1 = await api.rpc.system.accountNextIndex(keypairAddresses[0]);
    console.log('');
    console.log('Alices nonce before transact :', nonce1.toHuman());

    const tx = api.tx.balances.transferAllowDeath(
        keyring.getPairs()[1].address,
        66666
    );
    console.log('');
    console.log('Tx to Human', tx.toHuman());

    // send the transaction

    const txHash = await tx.signAndSend(keyring.getPairs()[0], ({ status }) => {
        if (status.isFinalized) {
            console.log('\n In first transaction');
            console.log('Transaction Finalized');
            process.exit(0);
        }
    });

    console.log('');
    nonce1 = await api.rpc.system.accountNextIndex(keypairAddresses[0]);
    console.log('Alices nonce before transact #2 :', nonce1.toHuman());

    api.tx.balances
        .transferAllowDeath(keyring.getPairs()[1].address, 99999)
        .signAndSend(
            keyring.getPairs()[0],
            { nonce: nonce1 },
            ({ events = [], status }) => {
                if (status.isFinalized) {
                    console.log('\n In second transaction');
                    console.log('Transaction Finalized');
                    process.exit(0);
                }
            }
        );
        */

// the extrinsics are decoded by the API, human-like view
// Safely call toHuman() with error handling
//const exHuman = ex.toHuman();
// console.log('Extrinsic human-readable form:', exHuman);
/*
const {
    isSigned,
    meta,
    method: { args, method, section },
} = ex;
*/
// explicit display of name, args & documentation
/*
console.log(
    `${section}.${method}(${args.map((a) => a.toString()).join(', ')})`
);
*/
/*
                    if (meta && meta.docs) {
                        console.log(
                            meta.docs.map((d) => d.toString()).join('\n')
                        );
                    } else {
                        console.log('No documentation available');
                    }
                    */
// signer/nonce info
/*
if (isSigned) {
    console.log(`signer=${ex.signer.toString()}, nonce=${ex.nonce.toString()}`);
}
*/

//TEST

//
//
//
//
//const blockunsub = await blockSubscription(api);

/*
    let balances = await getBalances(api, keyring.getPairs());
    balances.forEach((balance, index) => {
        console.log(
            `${keyring.getPairs()[index].meta.name} : ${balance.data.free.toHuman()}`
        );
    });
    */

/*
    const unsub = await api.query.system.account(
        keypairMapping['Bob'].address,
        (result: AccountInfo) => {
            console.log('Bob balance updated:', result.data.free.toHuman());
        }
    );
    await getTransferFee(api, keypairMapping['Alice'], keypairMapping['Bob']);
    await getStakingInterval(api);
    */

/*
    console.log('Bobs finalized balance:');
    const unsubscribe = await subscribeToFinalizedBalance(
        api,
        keypairMapping['Bob']
    );
    */

/*
    let transactionMap = new Map<string, bigint>();
    transactionMap.set(keypairMapping['Bob'].address, 1n);
    transactionMap.set(keypairMapping['Charlie'].address, 1n);
    transactionMap.set(keypairMapping['Dave'].address, 1n);
    transactionMap.set(keypairMapping['Eve'].address, 1n);
    transactionMap.set(keypairMapping['Ferdie'].address, 1n);
    await batchTransferRequest(api, keypairMapping['Alice'], transactionMap);

    const unsub2 = await subscribeToFinalizedBalance2(
        api,
        keypairMapping['Bob']
    );

    console.log('\nFirst transaction');
    await sendTransaction(
        api,
        keypairMapping['Alice'],
        keypairMapping['Bob'],
        1n
    );

    console.log(`\n starting quicksend`);
    await quickSend(
        api,
        keypairMapping['Alice'],
        keypairMapping['Bob'],
        1n,
        10
    );
    */

/*
    for (let i = 0; i < 20; i++) {
        console.log(`\n ${i} transaction:`);
        await sendTransaction(
            api,
            keypairMapping['Alice'],
            keypairMapping['Bob'],
            BigInt(i + 2)
        );
    }
    */

//unsubscribe();
/*
    unsub();
    unsub2();
    blockunsub();
    await api.disconnect();
    */

/*
    const ethPubKeys = testWallets.map((data) => data.account);
    let ethKeys = ethPubKeys.map((pubKey) => {
        return {
            address: pubKey,
            signature: signMessage(keypairMapping['Alice'], pubKey),
        };
    });
    ethKeys.push({
        address: ethPubKeys[0],
        signature: signMessage(keypairMapping['Bob'], ethPubKeys[1]),
    });
    ethKeys.push({
        address: ethPubKeys[1],
        signature: signMessage(keypairMapping['Bob'], ethPubKeys[1]),
    });
    const validEthKey = findValidEthAddressInEthKeys(
        ethKeys,
        keypairMapping['Alice'].address
    );

    const validEthKeyBob = findValidEthAddressInEthKeys(
        ethKeys,
        keypairMapping['Bob'].address
    );

    if (validEthKey !== false) {
        console.log(
            `\n Most recent Valid Ether Adress for Alice: ${validEthKey.address}\n`
        );
    }
    if (validEthKeyBob !== false) {
        console.log(
            `\n Most recent Valid Ether Adress for Bob: ${validEthKeyBob.address} \n`
        );
    }
    */

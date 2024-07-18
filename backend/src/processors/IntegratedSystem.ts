import '@polkadot/wasm-crypto/initWasmAsm';
import { EventEmitter } from 'events';
import BittensorTestUtils from './BittensorTestUtils';
import EthersTestUtils from './EthersTestUtils';
import { ethers } from 'ethers';
import EthKey from '../types/EthKey';
import { Decimal } from 'decimal.js';
import '@polkadot/wasm-crypto/initWasmAsm';
interface Transfer {
    from: string;
    to: string;
    amount: bigint;
}

interface BlockWrapper {
    value: number;
}

export default class IntegratedSystem {
    private bittensor: BittensorTestUtils;
    private ethereum: EthersTestUtils;
    private eventEmitter: EventEmitter;
    private transferQueue: { address: string; amount: bigint }[];
    private lastProcessedBlock: BlockWrapper;
    private isStaking: boolean;

    constructor(bittensor: BittensorTestUtils, ethereum: EthersTestUtils) {
        this.bittensor = bittensor;
        this.ethereum = ethereum;
        this.eventEmitter = new EventEmitter();
        this.transferQueue = [];
        this.lastProcessedBlock = { value: 0 };
        this.isStaking = true; // Start by staking, can't unstake until staking

        this.setupEventListners();
        this.startScheduledTasks();
    }

    private setupEventListners() {
        this.eventEmitter.on('receiveTransfer', (transfer) => {
            console.log(
                `Received transfer: ${transfer.from} -> ${transfer.to}: ${transfer.amount}`
            );
            this.transferQueue.push({
                address: transfer.from,
                amount: transfer.amount,
            });
        });
    }

    // start scheduled tasks, time is set like (minutes * seconds per minute * milliseconds per second)
    private startScheduledTasks() {
        setInterval(
            async () => {
                console.log('Starting scheduled tasks');
                try {
                    // Then, alternate staking/unstaking
                    console.log('Starting alternateStakingUnstaking');
                    const shoudUpdate = await this.alternateStakingUnstaking();
                    console.log(
                        'alternateStakingUnstaking completed successfully'
                    );
                    if (shoudUpdate) {
                        console.log(
                            `Updating ratios as we know we staked when doing alternate staking unstaking`
                        );
                        await this.updateRedemptionAndStakingRatios();
                    }

                    console.log('All scheduled tasks completed successfully');
                } catch (error) {
                    console.error('Error in scheduled tasks:', error);
                    // Optionally, you could add more specific error handling here
                    // For example, you might want to handle errors from each task differently
                }
            },
            1 * 30 * 1000
        );

        // Process transfer queue more frequently
        setInterval(
            async () => {
                try {
                    await this.processTransferQueue();
                } catch (error) {
                    console.error('Error processing transfer queue:', error);
                }
            },
            1 * 5 * 1000
        ); // Every 5 minutes
    }

    /**
     * Bittensor wallet listener
     * This function will listen to finalized block extrinsics, and specifcally filter for balance.Transfer request
     * where Tao is sent to a specific given wallet.
     */
    private async listenToIncomingTransfers() {
        const unsubscribe = await this.bittensor.blockSubscriptionToTransfer(
            this.eventEmitter,
            this.bittensor.keyring.getPairs()[6].address,
            this.lastProcessedBlock
        );
        return unsubscribe;
    }

    /**
     * At an interval, will process entire transfer queue
     * This is where sTao is created based on Tao transfers to our wallet
     */
    private async processTransferQueue() {
        console.log('in process transfer');
        while (this.transferQueue.length > 0) {
            console.log('in process transfer loop');
            const { address, amount } = this.transferQueue.shift()!;

            try {
                const usersAccount =
                    await this.ethereum.retrieveEthKeyAccount(address);
                if (usersAccount) {
                    const validAccount =
                        await this.bittensor.findValidEthAddressInEthKeys(
                            usersAccount,
                            address
                        );
                    if (validAccount) {
                        await this.ethereum.stakeSTao(
                            this.convert9To18Decimals(amount),
                            validAccount.address
                        );
                        console.log(
                            `\n Successfully processed transaction queue element`
                        );
                    }
                }
            } catch (error) {
                await this.ethereum.processError(error, 'processTransferQueue');
            }
        }
    }

    /**
     * This function will update the redemption and staking ratios when called
     */
    private async updateRedemptionAndStakingRatios() {
        try {
            let totalInStake = (
                await this.bittensor.api.query.subtensorModule.totalColdkeyStake(
                    this.bittensor.keyringPairs[6].address
                )
            ).toBigInt();
            const totalSTaoInCirculation =
                await this.ethereum.contract.totalSupply();
            const newRedeemRatioPercentage = this.calculateNewRatio(
                totalInStake,
                totalSTaoInCirculation
            );
            if (newRedeemRatioPercentage) {
                await this.ethereum.updateRatiosWithPercentage(
                    newRedeemRatioPercentage,
                    BigInt(18)
                );
                console.log(`Updated redemption and staking ratios`);
            }
        } catch (error) {
            await this.ethereum.processError(
                error,
                'updateRedemptionAndStakingRatios'
            );
        }
    }

    /**
     * This function processes sTao redemption events by querying the last hour's worth of
     * Redeemed events, bundling them together via TaoAddress => taoToReceive mapping, and then requesting
     * an unstaking request from our coldkey account.
     */
    private async processRedeemRequests() {
        try {
            const currentBlock = await this.ethereum.provider.getBlockNumber();
            const burnEvents = await this.ethereum.queryEventsInRangeAndBatch(
                this.ethereum.contract,
                this.lastProcessedBlock.value,
                currentBlock,
                this.ethereum.contract.filters.Redeemed()
            );
            this.lastProcessedBlock.value = currentBlock;
            return burnEvents;
        } catch (error) {
            this.ethereum.processError(error, 'processRedeemRequests');
        }
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

    // Promise<Map<string, bigint>>
    private async smartUnstakeAndTransfer(
        burnEvents: any[] | Map<any, any> | undefined,
        shouldTax: boolean = false
    ): Promise<boolean> {
        try {
            let taoToSendTotal = BigInt(0);
            let transferMap = new Map<string, bigint>();
            const taoInColdKey = (
                await this.bittensor.getSingularBalance(
                    this.bittensor.keyringPairs[6]
                )
            ).data.free.toBigInt();

            if (burnEvents instanceof Map) {
                for (const [taoAddress, data] of burnEvents) {
                    const modifiedData = this.convert18To9Decimals(
                        data.taoToUser
                    );
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
            let taoToUnstake = BigInt(0);
            // situation 1, more deposits than redemptions, thus batch transfer, and get a free stake in:
            if (taoInColdKey >= taoToSendTotal) {
                const leftoverColdKeyTao = taoInColdKey - taoToSendTotal;
                if (shouldTax) {
                    const taxedTransferMap = this.taxTransactions(transferMap);
                    await this.bittensor.batchTransferRequest(
                        this.bittensor.keyringPairs[6],
                        taxedTransferMap!
                    );
                } else {
                    await this.bittensor.batchTransferRequest(
                        this.bittensor.keyringPairs[6],
                        transferMap
                    );
                }
                console.log(
                    `Did a smart transfer, situation where enough there was enough tao in coldkey to directly send, thus the rest was staked.`
                );
                if (leftoverColdKeyTao > 0) {
                    await this.bittensor.addStakeSecure(
                        this.bittensor.keyringPairs[6],
                        this.bittensor.delegatesList[0],
                        leftoverColdKeyTao
                    );
                }
                return true; //returns true as we can update pool when we stake note, could stay the same as === 0
            } else {
                // situation 2, more redemptions than deposits, thus unstake, then batch transfer
                taoToUnstake = taoToSendTotal - taoInColdKey;
                await this.bittensor.removeStakeSecure(
                    this.bittensor.keyringPairs[6],
                    this.bittensor.delegatesList[0],
                    taoToUnstake
                );
                if (shouldTax) {
                    const taxedTransferMap = this.taxTransactions(transferMap);
                    await this.bittensor.batchTransferRequest(
                        this.bittensor.keyringPairs[6],
                        taxedTransferMap!
                    );
                } else {
                    await this.bittensor.batchTransferRequest(
                        this.bittensor.keyringPairs[6],
                        transferMap
                    );
                }
                return false; // returns false as we can't update pool when we unstake
            }
        } catch (error) {
            console.log(`Error in smartUnstakeAndTransfer: ${error}`);
            throw error;
        }
    }

    private async alternateStakingUnstaking(): Promise<boolean> {
        try {
            if (this.isStaking) {
                console.log('in staking;');
                const taoInColdKey = (
                    await this.bittensor.getSingularBalance(
                        this.bittensor.keyringPairs[6]
                    )
                ).data.free.toBigInt();

                if (taoInColdKey > 0) {
                    console.log('Adding stake secure');
                    await this.bittensor.addStakeSecure(
                        this.bittensor.keyringPairs[6],
                        this.bittensor.delegatesList[0],
                        taoInColdKey
                    );
                    this.isStaking = !this.isStaking;
                    return true;
                } else {
                    console.log(
                        'no tao in cold key, skipping to smart unstake....'
                    );
                    const transactionMap = await this.processRedeemRequests();
                    if (
                        transactionMap !== undefined &&
                        transactionMap instanceof Map
                    ) {
                        await this.smartUnstakeAndTransfer(transactionMap);
                    }
                    this.isStaking = this.isStaking;
                    return false;
                }
            } else {
                console.log('In smart unstake');
                const transactionMap = await this.processRedeemRequests();
                console.log('smart unstake transactionmap: ', transactionMap);
                if (
                    transactionMap !== undefined &&
                    transactionMap instanceof Map
                ) {
                    const shouldUpdate =
                        await this.smartUnstakeAndTransfer(transactionMap);
                    if (shouldUpdate) {
                        this.isStaking = !this.isStaking;
                        return true;
                    }
                }
                this.isStaking = !this.isStaking; // sets to stake
                return false; // no staking means no pool update
            }
        } catch (error) {
            console.error(`Error in alternating: ${error}`);
        }
        return false;
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
        const toDecimalCirculation = new Decimal(
            totalSTaoInCirculation.toString()
        );
        const result = toDecimalStake
            .dividedBy(toDecimalCirculation)
            .times(100);
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
            `Scaled End Ratio Result: ${BigInt(scaledResult.toFixed(0))}`
        );
        return BigInt(scaledResult.toFixed(0));
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
        return amountAsDecimal.div(1e18).toFixed(18);
    }

    /**
     * Utility to help read 9 decimal values
     *
     * @param amount 9 decimal value
     * @returns the amount in a human readable form
     */
    private humanReadableE9(amount: bigint) {
        const amountAsDecimal = new Decimal(amount.toString());
        return amountAsDecimal.div(1e9).toFixed(9);
    }

    public async start() {
        await this.listenToIncomingTransfers();
        console.log('Started the processor');
    }
}

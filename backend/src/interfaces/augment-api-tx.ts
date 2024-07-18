// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/submittable';

import type {
    ApiTypes,
    AugmentedSubmittable,
    SubmittableExtrinsic,
    SubmittableExtrinsicFunction,
} from '@polkadot/api-base/types';
import type {
    Bytes,
    Compact,
    Option,
    U8aFixed,
    Vec,
    bool,
    u128,
    u16,
    u32,
    u64,
    u8,
} from '@polkadot/types-codec';
import type { AnyNumber, IMethod, ITuple } from '@polkadot/types-codec/types';
import type {
    AccountId32,
    Call,
    H256,
    MultiAddress,
} from '@polkadot/types/interfaces/runtime';

export type __AugmentedSubmittable = AugmentedSubmittable<() => unknown>;
export type __SubmittableExtrinsic<ApiType extends ApiTypes> =
    SubmittableExtrinsic<ApiType>;
export type __SubmittableExtrinsicFunction<ApiType extends ApiTypes> =
    SubmittableExtrinsicFunction<ApiType>;

declare module '@polkadot/api-base/types/submittable' {
    interface AugmentedSubmittables<ApiType extends ApiTypes> {
        adminUtils: {
            /**
             * The extrinsic sets the activity cutoff for a subnet.
             * It is only callable by the root account or subnet owner.
             * The extrinsic will call the Subtensor pallet to set the activity cutoff.
             **/
            sudoSetActivityCutoff: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    activityCutoff: u16 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u16]
            >;
            /**
             * The extrinsic sets the adjustment alpha for a subnet.
             * It is only callable by the root account or subnet owner.
             * The extrinsic will call the Subtensor pallet to set the adjustment alpha.
             **/
            sudoSetAdjustmentAlpha: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    adjustmentAlpha: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u64]
            >;
            /**
             * The extrinsic sets the adjustment interval for a subnet.
             * It is only callable by the root account, not changeable by the subnet owner.
             * The extrinsic will call the Subtensor pallet to set the adjustment interval.
             **/
            sudoSetAdjustmentInterval: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    adjustmentInterval: u16 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u16]
            >;
            /**
             * The extrinsic sets the bonds moving average for a subnet.
             * It is only callable by the root account or subnet owner.
             * The extrinsic will call the Subtensor pallet to set the bonds moving average.
             **/
            sudoSetBondsMovingAverage: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    bondsMovingAverage: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u64]
            >;
            /**
             * The extrinsic enabled/disables commit/reaveal for a given subnet.
             * It is only callable by the root account or subnet owner.
             * The extrinsic will call the Subtensor pallet to set the value.
             **/
            sudoSetCommitRevealWeightsEnabled: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    enabled: bool | boolean | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, bool]
            >;
            /**
             * The extrinsic sets the commit/reveal interval for a subnet.
             * It is only callable by the root account or subnet owner.
             * The extrinsic will call the Subtensor pallet to set the interval.
             **/
            sudoSetCommitRevealWeightsInterval: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    interval: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u64]
            >;
            /**
             * The extrinsic sets the default take for the network.
             * It is only callable by the root account.
             * The extrinsic will call the Subtensor pallet to set the default take.
             **/
            sudoSetDefaultTake: AugmentedSubmittable<
                (
                    defaultTake: u16 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16]
            >;
            /**
             * The extrinsic sets the difficulty for a subnet.
             * It is only callable by the root account or subnet owner.
             * The extrinsic will call the Subtensor pallet to set the difficulty.
             **/
            sudoSetDifficulty: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    difficulty: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u64]
            >;
            /**
             * The extrinsic sets the immunity period for a subnet.
             * It is only callable by the root account or subnet owner.
             * The extrinsic will call the Subtensor pallet to set the immunity period.
             **/
            sudoSetImmunityPeriod: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    immunityPeriod: u16 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u16]
            >;
            /**
             * The extrinsic sets the kappa for a subnet.
             * It is only callable by the root account or subnet owner.
             * The extrinsic will call the Subtensor pallet to set the kappa.
             **/
            sudoSetKappa: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    kappa: u16 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u16]
            >;
            /**
             * The extrinsic sets the lock reduction interval for the network.
             * It is only callable by the root account.
             * The extrinsic will call the Subtensor pallet to set the lock reduction interval.
             **/
            sudoSetLockReductionInterval: AugmentedSubmittable<
                (
                    interval: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u64]
            >;
            /**
             * The extrinsic sets the maximum allowed UIDs for a subnet.
             * It is only callable by the root account.
             * The extrinsic will call the Subtensor pallet to set the maximum allowed UIDs for a subnet.
             **/
            sudoSetMaxAllowedUids: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    maxAllowedUids: u16 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u16]
            >;
            /**
             * The extrinsic sets the maximum allowed validators for a subnet.
             * It is only callable by the root account.
             * The extrinsic will call the Subtensor pallet to set the maximum allowed validators.
             **/
            sudoSetMaxAllowedValidators: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    maxAllowedValidators: u16 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u16]
            >;
            /**
             * The extrinsic sets the maximum burn for a subnet.
             * It is only callable by the root account or subnet owner.
             * The extrinsic will call the Subtensor pallet to set the maximum burn.
             **/
            sudoSetMaxBurn: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    maxBurn: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u64]
            >;
            /**
             * The extrinsic sets the maximum difficulty for a subnet.
             * It is only callable by the root account or subnet owner.
             * The extrinsic will call the Subtensor pallet to set the maximum difficulty.
             **/
            sudoSetMaxDifficulty: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    maxDifficulty: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u64]
            >;
            /**
             * The extrinsic sets the maximum registrations per block for a subnet.
             * It is only callable by the root account.
             * The extrinsic will call the Subtensor pallet to set the maximum registrations per block.
             **/
            sudoSetMaxRegistrationsPerBlock: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    maxRegistrationsPerBlock: u16 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u16]
            >;
            /**
             * The extrinsic sets the adjustment beta for a subnet.
             * It is only callable by the root account or subnet owner.
             * The extrinsic will call the Subtensor pallet to set the adjustment beta.
             **/
            sudoSetMaxWeightLimit: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    maxWeightLimit: u16 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u16]
            >;
            /**
             * The extrinsic sets the minimum allowed weights for a subnet.
             * It is only callable by the root account or subnet owner.
             * The extrinsic will call the Subtensor pallet to set the minimum allowed weights.
             **/
            sudoSetMinAllowedWeights: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    minAllowedWeights: u16 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u16]
            >;
            /**
             * The extrinsic sets the minimum burn for a subnet.
             * It is only callable by the root account or subnet owner.
             * The extrinsic will call the Subtensor pallet to set the minimum burn.
             **/
            sudoSetMinBurn: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    minBurn: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u64]
            >;
            /**
             * The extrinsic sets the minimum delegate take.
             * It is only callable by the root account.
             * The extrinsic will call the Subtensor pallet to set the minimum delegate take.
             **/
            sudoSetMinDelegateTake: AugmentedSubmittable<
                (
                    take: u16 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16]
            >;
            /**
             * The extrinsic sets the minimum difficulty for a subnet.
             * It is only callable by the root account or subnet owner.
             * The extrinsic will call the Subtensor pallet to set the minimum difficulty.
             **/
            sudoSetMinDifficulty: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    minDifficulty: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u64]
            >;
            /**
             * The extrinsic sets the immunity period for the network.
             * It is only callable by the root account.
             * The extrinsic will call the Subtensor pallet to set the immunity period for the network.
             **/
            sudoSetNetworkImmunityPeriod: AugmentedSubmittable<
                (
                    immunityPeriod: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u64]
            >;
            /**
             * The extrinsic sets the min lock cost for the network.
             * It is only callable by the root account.
             * The extrinsic will call the Subtensor pallet to set the min lock cost for the network.
             **/
            sudoSetNetworkMinLockCost: AugmentedSubmittable<
                (
                    lockCost: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u64]
            >;
            /**
             * The extrinsic sets the network PoW registration allowed for a subnet.
             * It is only callable by the root account or subnet owner.
             * The extrinsic will call the Subtensor pallet to set the network PoW registration allowed.
             **/
            sudoSetNetworkPowRegistrationAllowed: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    registrationAllowed: bool | boolean | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, bool]
            >;
            /**
             * The extrinsic sets the network rate limit for the network.
             * It is only callable by the root account.
             * The extrinsic will call the Subtensor pallet to set the network rate limit.
             **/
            sudoSetNetworkRateLimit: AugmentedSubmittable<
                (
                    rateLimit: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u64]
            >;
            /**
             * The extrinsic sets the network registration allowed for a subnet.
             * It is only callable by the root account or subnet owner.
             * The extrinsic will call the Subtensor pallet to set the network registration allowed.
             **/
            sudoSetNetworkRegistrationAllowed: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    registrationAllowed: bool | boolean | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, bool]
            >;
            /**
             * The extrinsic sets the minimum stake required for nominators.
             * It is only callable by the root account.
             * The extrinsic will call the Subtensor pallet to set the minimum stake required for nominators.
             **/
            sudoSetNominatorMinRequiredStake: AugmentedSubmittable<
                (
                    minStake: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u64]
            >;
            /**
             * The extrinsic sets the recycled RAO for a subnet.
             * It is only callable by the root account.
             * The extrinsic will call the Subtensor pallet to set the recycled RAO.
             **/
            sudoSetRaoRecycled: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    raoRecycled: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u64]
            >;
            /**
             * The extrinsic sets the rho for a subnet.
             * It is only callable by the root account or subnet owner.
             * The extrinsic will call the Subtensor pallet to set the rho.
             **/
            sudoSetRho: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    rho: u16 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u16]
            >;
            /**
             * The extrinsic sets the serving rate limit for a subnet.
             * It is only callable by the root account or subnet owner.
             * The extrinsic will call the Subtensor pallet to set the serving rate limit.
             **/
            sudoSetServingRateLimit: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    servingRateLimit: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u64]
            >;
            /**
             * The extrinsic sets the subnet limit for the network.
             * It is only callable by the root account.
             * The extrinsic will call the Subtensor pallet to set the subnet limit.
             **/
            sudoSetSubnetLimit: AugmentedSubmittable<
                (
                    maxSubnets: u16 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16]
            >;
            /**
             * The extrinsic sets the subnet owner cut for a subnet.
             * It is only callable by the root account.
             * The extrinsic will call the Subtensor pallet to set the subnet owner cut.
             **/
            sudoSetSubnetOwnerCut: AugmentedSubmittable<
                (
                    subnetOwnerCut: u16 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16]
            >;
            /**
             * The extrinsic sets the target registrations per interval for a subnet.
             * It is only callable by the root account.
             * The extrinsic will call the Subtensor pallet to set the target registrations per interval.
             **/
            sudoSetTargetRegistrationsPerInterval: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    targetRegistrationsPerInterval: u16 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u16]
            >;
            /**
             * The extrinsic sets the target stake per interval.
             * It is only callable by the root account.
             * The extrinsic will call the Subtensor pallet to set target stake per interval.
             **/
            sudoSetTargetStakesPerInterval: AugmentedSubmittable<
                (
                    targetStakesPerInterval: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u64]
            >;
            /**
             * The extrinsic sets the tempo for a subnet.
             * It is only callable by the root account.
             * The extrinsic will call the Subtensor pallet to set the tempo.
             **/
            sudoSetTempo: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    tempo: u16 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u16]
            >;
            /**
             * The extrinsic sets the total issuance for the network.
             * It is only callable by the root account.
             * The extrinsic will call the Subtensor pallet to set the issuance for the network.
             **/
            sudoSetTotalIssuance: AugmentedSubmittable<
                (
                    totalIssuance: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u64]
            >;
            /**
             * The extrinsic sets the rate limit for delegate take transactions.
             * It is only callable by the root account.
             * The extrinsic will call the Subtensor pallet to set the rate limit for delegate take transactions.
             **/
            sudoSetTxDelegateTakeRateLimit: AugmentedSubmittable<
                (
                    txRateLimit: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u64]
            >;
            /**
             * The extrinsic sets the transaction rate limit for the network.
             * It is only callable by the root account.
             * The extrinsic will call the Subtensor pallet to set the transaction rate limit.
             **/
            sudoSetTxRateLimit: AugmentedSubmittable<
                (
                    txRateLimit: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u64]
            >;
            /**
             * The extrinsic sets the weights min stake.
             * It is only callable by the root account.
             * The extrinsic will call the Subtensor pallet to set the weights min stake.
             **/
            sudoSetWeightsMinStake: AugmentedSubmittable<
                (
                    minStake: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u64]
            >;
            /**
             * The extrinsic sets the weights set rate limit for a subnet.
             * It is only callable by the root account or subnet owner.
             * The extrinsic will call the Subtensor pallet to set the weights set rate limit.
             **/
            sudoSetWeightsSetRateLimit: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    weightsSetRateLimit: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u64]
            >;
            /**
             * The extrinsic sets the weights version key for a subnet.
             * It is only callable by the root account or subnet owner.
             * The extrinsic will call the Subtensor pallet to set the weights version key.
             **/
            sudoSetWeightsVersionKey: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    weightsVersionKey: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u64]
            >;
            /**
             * The extrinsic sets the new authorities for Aura consensus.
             * It is only callable by the root account.
             * The extrinsic will call the Aura pallet to change the authorities.
             **/
            swapAuthorities: AugmentedSubmittable<
                (
                    newAuthorities:
                        | Vec<SpConsensusAuraSr25519AppSr25519Public>
                        | (
                              | SpConsensusAuraSr25519AppSr25519Public
                              | string
                              | Uint8Array
                          )[]
                ) => SubmittableExtrinsic<ApiType>,
                [Vec<SpConsensusAuraSr25519AppSr25519Public>]
            >;
            /**
             * Generic tx
             **/
            [key: string]: SubmittableExtrinsicFunction<ApiType>;
        };
        balances: {
            /**
             * Adjust the total issuance in a saturating way.
             *
             * Can only be called by root and always needs a positive `delta`.
             *
             * # Example
             **/
            forceAdjustTotalIssuance: AugmentedSubmittable<
                (
                    direction:
                        | PalletBalancesAdjustmentDirection
                        | 'Increase'
                        | 'Decrease'
                        | number
                        | Uint8Array,
                    delta: Compact<u64> | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [PalletBalancesAdjustmentDirection, Compact<u64>]
            >;
            /**
             * Set the regular balance of a given account.
             *
             * The dispatch origin for this call is `root`.
             **/
            forceSetBalance: AugmentedSubmittable<
                (
                    who:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array,
                    newFree: Compact<u64> | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [MultiAddress, Compact<u64>]
            >;
            /**
             * Exactly as `transfer_allow_death`, except the origin must be root and the source account
             * may be specified.
             **/
            forceTransfer: AugmentedSubmittable<
                (
                    source:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array,
                    dest:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array,
                    value: Compact<u64> | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [MultiAddress, MultiAddress, Compact<u64>]
            >;
            /**
             * Unreserve some balance from a user by force.
             *
             * Can only be called by ROOT.
             **/
            forceUnreserve: AugmentedSubmittable<
                (
                    who:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array,
                    amount: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [MultiAddress, u64]
            >;
            /**
             * Transfer the entire transferable balance from the caller account.
             *
             * NOTE: This function only attempts to transfer _transferable_ balances. This means that
             * any locked, reserved, or existential deposits (when `keep_alive` is `true`), will not be
             * transferred by this function. To ensure that this function results in a killed account,
             * you might need to prepare the account by removing any reference counters, storage
             * deposits, etc...
             *
             * The dispatch origin of this call must be Signed.
             *
             * - `dest`: The recipient of the transfer.
             * - `keep_alive`: A boolean to determine if the `transfer_all` operation should send all
             * of the funds the account has, causing the sender account to be killed (false), or
             * transfer everything except at least the existential deposit, which will guarantee to
             * keep the sender account alive (true).
             **/
            transferAll: AugmentedSubmittable<
                (
                    dest:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array,
                    keepAlive: bool | boolean | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [MultiAddress, bool]
            >;
            /**
             * Transfer some liquid free balance to another account.
             *
             * `transfer_allow_death` will set the `FreeBalance` of the sender and receiver.
             * If the sender's account is below the existential deposit as a result
             * of the transfer, the account will be reaped.
             *
             * The dispatch origin for this call must be `Signed` by the transactor.
             **/
            transferAllowDeath: AugmentedSubmittable<
                (
                    dest:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array,
                    value: Compact<u64> | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [MultiAddress, Compact<u64>]
            >;
            /**
             * Same as the [`transfer_allow_death`] call, but with a check that the transfer will not
             * kill the origin account.
             *
             * 99% of the time you want [`transfer_allow_death`] instead.
             *
             * [`transfer_allow_death`]: struct.Pallet.html#method.transfer
             **/
            transferKeepAlive: AugmentedSubmittable<
                (
                    dest:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array,
                    value: Compact<u64> | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [MultiAddress, Compact<u64>]
            >;
            /**
             * Upgrade a specified account.
             *
             * - `origin`: Must be `Signed`.
             * - `who`: The account to be upgraded.
             *
             * This will waive the transaction fee if at least all but 10% of the accounts needed to
             * be upgraded. (We let some not have to be upgraded just in order to allow for the
             * possibility of churn).
             **/
            upgradeAccounts: AugmentedSubmittable<
                (
                    who:
                        | Vec<AccountId32>
                        | (AccountId32 | string | Uint8Array)[]
                ) => SubmittableExtrinsic<ApiType>,
                [Vec<AccountId32>]
            >;
            /**
             * Generic tx
             **/
            [key: string]: SubmittableExtrinsicFunction<ApiType>;
        };
        commitments: {
            /**
             * Set the commitment for a given netuid
             **/
            setCommitment: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    info:
                        | PalletCommitmentsCommitmentInfo
                        | { fields?: any }
                        | string
                        | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, PalletCommitmentsCommitmentInfo]
            >;
            /**
             * Generic tx
             **/
            [key: string]: SubmittableExtrinsicFunction<ApiType>;
        };
        grandpa: {
            /**
             * Note that the current authority set of the GRANDPA finality gadget has stalled.
             *
             * This will trigger a forced authority set change at the beginning of the next session, to
             * be enacted `delay` blocks after that. The `delay` should be high enough to safely assume
             * that the block signalling the forced change will not be re-orged e.g. 1000 blocks.
             * The block production rate (which may be slowed down because of finality lagging) should
             * be taken into account when choosing the `delay`. The GRANDPA voters based on the new
             * authority will start voting on top of `best_finalized_block_number` for new finalized
             * blocks. `best_finalized_block_number` should be the highest of the latest finalized
             * block of all validators of the new authority set.
             *
             * Only callable by root.
             **/
            noteStalled: AugmentedSubmittable<
                (
                    delay: u32 | AnyNumber | Uint8Array,
                    bestFinalizedBlockNumber: u32 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u32, u32]
            >;
            /**
             * Report voter equivocation/misbehavior. This method will verify the
             * equivocation proof and validate the given key ownership proof
             * against the extracted offender. If both are valid, the offence
             * will be reported.
             **/
            reportEquivocation: AugmentedSubmittable<
                (
                    equivocationProof:
                        | SpConsensusGrandpaEquivocationProof
                        | { setId?: any; equivocation?: any }
                        | string
                        | Uint8Array,
                    keyOwnerProof: SpCoreVoid | null
                ) => SubmittableExtrinsic<ApiType>,
                [SpConsensusGrandpaEquivocationProof, SpCoreVoid]
            >;
            /**
             * Report voter equivocation/misbehavior. This method will verify the
             * equivocation proof and validate the given key ownership proof
             * against the extracted offender. If both are valid, the offence
             * will be reported.
             *
             * This extrinsic must be called unsigned and it is expected that only
             * block authors will call it (validated in `ValidateUnsigned`), as such
             * if the block author is defined it will be defined as the equivocation
             * reporter.
             **/
            reportEquivocationUnsigned: AugmentedSubmittable<
                (
                    equivocationProof:
                        | SpConsensusGrandpaEquivocationProof
                        | { setId?: any; equivocation?: any }
                        | string
                        | Uint8Array,
                    keyOwnerProof: SpCoreVoid | null
                ) => SubmittableExtrinsic<ApiType>,
                [SpConsensusGrandpaEquivocationProof, SpCoreVoid]
            >;
            /**
             * Generic tx
             **/
            [key: string]: SubmittableExtrinsicFunction<ApiType>;
        };
        multisig: {
            /**
             * Register approval for a dispatch to be made from a deterministic composite account if
             * approved by a total of `threshold - 1` of `other_signatories`.
             *
             * Payment: `DepositBase` will be reserved if this is the first approval, plus
             * `threshold` times `DepositFactor`. It is returned once this dispatch happens or
             * is cancelled.
             *
             * The dispatch origin for this call must be _Signed_.
             *
             * - `threshold`: The total number of approvals for this dispatch before it is executed.
             * - `other_signatories`: The accounts (other than the sender) who can approve this
             * dispatch. May not be empty.
             * - `maybe_timepoint`: If this is the first approval, then this must be `None`. If it is
             * not the first approval, then it must be `Some`, with the timepoint (block number and
             * transaction index) of the first approval transaction.
             * - `call_hash`: The hash of the call to be executed.
             *
             * NOTE: If this is the final approval, you will want to use `as_multi` instead.
             *
             * ## Complexity
             * - `O(S)`.
             * - Up to one balance-reserve or unreserve operation.
             * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
             * signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
             * - One encode & hash, both of complexity `O(S)`.
             * - Up to one binary search and insert (`O(logS + S)`).
             * - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove.
             * - One event.
             * - Storage: inserts one item, value size bounded by `MaxSignatories`, with a deposit
             * taken for its lifetime of `DepositBase + threshold * DepositFactor`.
             **/
            approveAsMulti: AugmentedSubmittable<
                (
                    threshold: u16 | AnyNumber | Uint8Array,
                    otherSignatories:
                        | Vec<AccountId32>
                        | (AccountId32 | string | Uint8Array)[],
                    maybeTimepoint:
                        | Option<PalletMultisigTimepoint>
                        | null
                        | Uint8Array
                        | PalletMultisigTimepoint
                        | { height?: any; index?: any }
                        | string,
                    callHash: U8aFixed | string | Uint8Array,
                    maxWeight:
                        | SpWeightsWeightV2Weight
                        | { refTime?: any; proofSize?: any }
                        | string
                        | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [
                    u16,
                    Vec<AccountId32>,
                    Option<PalletMultisigTimepoint>,
                    U8aFixed,
                    SpWeightsWeightV2Weight,
                ]
            >;
            /**
             * Register approval for a dispatch to be made from a deterministic composite account if
             * approved by a total of `threshold - 1` of `other_signatories`.
             *
             * If there are enough, then dispatch the call.
             *
             * Payment: `DepositBase` will be reserved if this is the first approval, plus
             * `threshold` times `DepositFactor`. It is returned once this dispatch happens or
             * is cancelled.
             *
             * The dispatch origin for this call must be _Signed_.
             *
             * - `threshold`: The total number of approvals for this dispatch before it is executed.
             * - `other_signatories`: The accounts (other than the sender) who can approve this
             * dispatch. May not be empty.
             * - `maybe_timepoint`: If this is the first approval, then this must be `None`. If it is
             * not the first approval, then it must be `Some`, with the timepoint (block number and
             * transaction index) of the first approval transaction.
             * - `call`: The call to be executed.
             *
             * NOTE: Unless this is the final approval, you will generally want to use
             * `approve_as_multi` instead, since it only requires a hash of the call.
             *
             * Result is equivalent to the dispatched result if `threshold` is exactly `1`. Otherwise
             * on success, result is `Ok` and the result from the interior call, if it was executed,
             * may be found in the deposited `MultisigExecuted` event.
             *
             * ## Complexity
             * - `O(S + Z + Call)`.
             * - Up to one balance-reserve or unreserve operation.
             * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
             * signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
             * - One call encode & hash, both of complexity `O(Z)` where `Z` is tx-len.
             * - One encode & hash, both of complexity `O(S)`.
             * - Up to one binary search and insert (`O(logS + S)`).
             * - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove.
             * - One event.
             * - The weight of the `call`.
             * - Storage: inserts one item, value size bounded by `MaxSignatories`, with a deposit
             * taken for its lifetime of `DepositBase + threshold * DepositFactor`.
             **/
            asMulti: AugmentedSubmittable<
                (
                    threshold: u16 | AnyNumber | Uint8Array,
                    otherSignatories:
                        | Vec<AccountId32>
                        | (AccountId32 | string | Uint8Array)[],
                    maybeTimepoint:
                        | Option<PalletMultisigTimepoint>
                        | null
                        | Uint8Array
                        | PalletMultisigTimepoint
                        | { height?: any; index?: any }
                        | string,
                    call: Call | IMethod | string | Uint8Array,
                    maxWeight:
                        | SpWeightsWeightV2Weight
                        | { refTime?: any; proofSize?: any }
                        | string
                        | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [
                    u16,
                    Vec<AccountId32>,
                    Option<PalletMultisigTimepoint>,
                    Call,
                    SpWeightsWeightV2Weight,
                ]
            >;
            /**
             * Immediately dispatch a multi-signature call using a single approval from the caller.
             *
             * The dispatch origin for this call must be _Signed_.
             *
             * - `other_signatories`: The accounts (other than the sender) who are part of the
             * multi-signature, but do not participate in the approval process.
             * - `call`: The call to be executed.
             *
             * Result is equivalent to the dispatched result.
             *
             * ## Complexity
             * O(Z + C) where Z is the length of the call and C its execution weight.
             **/
            asMultiThreshold1: AugmentedSubmittable<
                (
                    otherSignatories:
                        | Vec<AccountId32>
                        | (AccountId32 | string | Uint8Array)[],
                    call: Call | IMethod | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [Vec<AccountId32>, Call]
            >;
            /**
             * Cancel a pre-existing, on-going multisig transaction. Any deposit reserved previously
             * for this operation will be unreserved on success.
             *
             * The dispatch origin for this call must be _Signed_.
             *
             * - `threshold`: The total number of approvals for this dispatch before it is executed.
             * - `other_signatories`: The accounts (other than the sender) who can approve this
             * dispatch. May not be empty.
             * - `timepoint`: The timepoint (block number and transaction index) of the first approval
             * transaction for this dispatch.
             * - `call_hash`: The hash of the call to be executed.
             *
             * ## Complexity
             * - `O(S)`.
             * - Up to one balance-reserve or unreserve operation.
             * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
             * signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
             * - One encode & hash, both of complexity `O(S)`.
             * - One event.
             * - I/O: 1 read `O(S)`, one remove.
             * - Storage: removes one item.
             **/
            cancelAsMulti: AugmentedSubmittable<
                (
                    threshold: u16 | AnyNumber | Uint8Array,
                    otherSignatories:
                        | Vec<AccountId32>
                        | (AccountId32 | string | Uint8Array)[],
                    timepoint:
                        | PalletMultisigTimepoint
                        | { height?: any; index?: any }
                        | string
                        | Uint8Array,
                    callHash: U8aFixed | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, Vec<AccountId32>, PalletMultisigTimepoint, U8aFixed]
            >;
            /**
             * Generic tx
             **/
            [key: string]: SubmittableExtrinsicFunction<ApiType>;
        };
        preimage: {
            /**
             * Ensure that the a bulk of pre-images is upgraded.
             *
             * The caller pays no fee if at least 90% of pre-images were successfully updated.
             **/
            ensureUpdated: AugmentedSubmittable<
                (
                    hashes: Vec<H256> | (H256 | string | Uint8Array)[]
                ) => SubmittableExtrinsic<ApiType>,
                [Vec<H256>]
            >;
            /**
             * Register a preimage on-chain.
             *
             * If the preimage was previously requested, no fees or deposits are taken for providing
             * the preimage. Otherwise, a deposit is taken proportional to the size of the preimage.
             **/
            notePreimage: AugmentedSubmittable<
                (
                    bytes: Bytes | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [Bytes]
            >;
            /**
             * Request a preimage be uploaded to the chain without paying any fees or deposits.
             *
             * If the preimage requests has already been provided on-chain, we unreserve any deposit
             * a user may have paid, and take the control of the preimage out of their hands.
             **/
            requestPreimage: AugmentedSubmittable<
                (
                    hash: H256 | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [H256]
            >;
            /**
             * Clear an unrequested preimage from the runtime storage.
             *
             * If `len` is provided, then it will be a much cheaper operation.
             *
             * - `hash`: The hash of the preimage to be removed from the store.
             * - `len`: The length of the preimage of `hash`.
             **/
            unnotePreimage: AugmentedSubmittable<
                (
                    hash: H256 | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [H256]
            >;
            /**
             * Clear a previously made request for a preimage.
             *
             * NOTE: THIS MUST NOT BE CALLED ON `hash` MORE TIMES THAN `request_preimage`.
             **/
            unrequestPreimage: AugmentedSubmittable<
                (
                    hash: H256 | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [H256]
            >;
            /**
             * Generic tx
             **/
            [key: string]: SubmittableExtrinsicFunction<ApiType>;
        };
        proxy: {
            /**
             * Register a proxy account for the sender that is able to make calls on its behalf.
             *
             * The dispatch origin for this call must be _Signed_.
             *
             * Parameters:
             * - `proxy`: The account that the `caller` would like to make a proxy.
             * - `proxy_type`: The permissions allowed for this proxy account.
             * - `delay`: The announcement period required of the initial proxy. Will generally be
             * zero.
             **/
            addProxy: AugmentedSubmittable<
                (
                    delegate:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array,
                    proxyType:
                        | NodeSubtensorRuntimeProxyType
                        | 'Any'
                        | 'Owner'
                        | 'NonCritical'
                        | 'NonTransfer'
                        | 'Senate'
                        | 'NonFungibile'
                        | 'Triumvirate'
                        | 'Governance'
                        | 'Staking'
                        | 'Registration'
                        | number
                        | Uint8Array,
                    delay: u32 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [MultiAddress, NodeSubtensorRuntimeProxyType, u32]
            >;
            /**
             * Publish the hash of a proxy-call that will be made in the future.
             *
             * This must be called some number of blocks before the corresponding `proxy` is attempted
             * if the delay associated with the proxy relationship is greater than zero.
             *
             * No more than `MaxPending` announcements may be made at any one time.
             *
             * This will take a deposit of `AnnouncementDepositFactor` as well as
             * `AnnouncementDepositBase` if there are no other pending announcements.
             *
             * The dispatch origin for this call must be _Signed_ and a proxy of `real`.
             *
             * Parameters:
             * - `real`: The account that the proxy will make a call on behalf of.
             * - `call_hash`: The hash of the call to be made by the `real` account.
             **/
            announce: AugmentedSubmittable<
                (
                    real:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array,
                    callHash: H256 | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [MultiAddress, H256]
            >;
            /**
             * Spawn a fresh new account that is guaranteed to be otherwise inaccessible, and
             * initialize it with a proxy of `proxy_type` for `origin` sender.
             *
             * Requires a `Signed` origin.
             *
             * - `proxy_type`: The type of the proxy that the sender will be registered as over the
             * new account. This will almost always be the most permissive `ProxyType` possible to
             * allow for maximum flexibility.
             * - `index`: A disambiguation index, in case this is called multiple times in the same
             * transaction (e.g. with `utility::batch`). Unless you're using `batch` you probably just
             * want to use `0`.
             * - `delay`: The announcement period required of the initial proxy. Will generally be
             * zero.
             *
             * Fails with `Duplicate` if this has already been called in this transaction, from the
             * same sender, with the same parameters.
             *
             * Fails if there are insufficient funds to pay for deposit.
             **/
            createPure: AugmentedSubmittable<
                (
                    proxyType:
                        | NodeSubtensorRuntimeProxyType
                        | 'Any'
                        | 'Owner'
                        | 'NonCritical'
                        | 'NonTransfer'
                        | 'Senate'
                        | 'NonFungibile'
                        | 'Triumvirate'
                        | 'Governance'
                        | 'Staking'
                        | 'Registration'
                        | number
                        | Uint8Array,
                    delay: u32 | AnyNumber | Uint8Array,
                    index: u16 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [NodeSubtensorRuntimeProxyType, u32, u16]
            >;
            /**
             * Removes a previously spawned pure proxy.
             *
             * WARNING: **All access to this account will be lost.** Any funds held in it will be
             * inaccessible.
             *
             * Requires a `Signed` origin, and the sender account must have been created by a call to
             * `pure` with corresponding parameters.
             *
             * - `spawner`: The account that originally called `pure` to create this account.
             * - `index`: The disambiguation index originally passed to `pure`. Probably `0`.
             * - `proxy_type`: The proxy type originally passed to `pure`.
             * - `height`: The height of the chain when the call to `pure` was processed.
             * - `ext_index`: The extrinsic index in which the call to `pure` was processed.
             *
             * Fails with `NoPermission` in case the caller is not a previously created pure
             * account whose `pure` call has corresponding parameters.
             **/
            killPure: AugmentedSubmittable<
                (
                    spawner:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array,
                    proxyType:
                        | NodeSubtensorRuntimeProxyType
                        | 'Any'
                        | 'Owner'
                        | 'NonCritical'
                        | 'NonTransfer'
                        | 'Senate'
                        | 'NonFungibile'
                        | 'Triumvirate'
                        | 'Governance'
                        | 'Staking'
                        | 'Registration'
                        | number
                        | Uint8Array,
                    index: u16 | AnyNumber | Uint8Array,
                    height: Compact<u32> | AnyNumber | Uint8Array,
                    extIndex: Compact<u32> | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [
                    MultiAddress,
                    NodeSubtensorRuntimeProxyType,
                    u16,
                    Compact<u32>,
                    Compact<u32>,
                ]
            >;
            /**
             * Dispatch the given `call` from an account that the sender is authorised for through
             * `add_proxy`.
             *
             * The dispatch origin for this call must be _Signed_.
             *
             * Parameters:
             * - `real`: The account that the proxy will make a call on behalf of.
             * - `force_proxy_type`: Specify the exact proxy type to be used and checked for this call.
             * - `call`: The call to be made by the `real` account.
             **/
            proxy: AugmentedSubmittable<
                (
                    real:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array,
                    forceProxyType:
                        | Option<NodeSubtensorRuntimeProxyType>
                        | null
                        | Uint8Array
                        | NodeSubtensorRuntimeProxyType
                        | 'Any'
                        | 'Owner'
                        | 'NonCritical'
                        | 'NonTransfer'
                        | 'Senate'
                        | 'NonFungibile'
                        | 'Triumvirate'
                        | 'Governance'
                        | 'Staking'
                        | 'Registration'
                        | number,
                    call: Call | IMethod | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [MultiAddress, Option<NodeSubtensorRuntimeProxyType>, Call]
            >;
            /**
             * Dispatch the given `call` from an account that the sender is authorized for through
             * `add_proxy`.
             *
             * Removes any corresponding announcement(s).
             *
             * The dispatch origin for this call must be _Signed_.
             *
             * Parameters:
             * - `real`: The account that the proxy will make a call on behalf of.
             * - `force_proxy_type`: Specify the exact proxy type to be used and checked for this call.
             * - `call`: The call to be made by the `real` account.
             **/
            proxyAnnounced: AugmentedSubmittable<
                (
                    delegate:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array,
                    real:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array,
                    forceProxyType:
                        | Option<NodeSubtensorRuntimeProxyType>
                        | null
                        | Uint8Array
                        | NodeSubtensorRuntimeProxyType
                        | 'Any'
                        | 'Owner'
                        | 'NonCritical'
                        | 'NonTransfer'
                        | 'Senate'
                        | 'NonFungibile'
                        | 'Triumvirate'
                        | 'Governance'
                        | 'Staking'
                        | 'Registration'
                        | number,
                    call: Call | IMethod | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [
                    MultiAddress,
                    MultiAddress,
                    Option<NodeSubtensorRuntimeProxyType>,
                    Call,
                ]
            >;
            /**
             * Remove the given announcement of a delegate.
             *
             * May be called by a target (proxied) account to remove a call that one of their delegates
             * (`delegate`) has announced they want to execute. The deposit is returned.
             *
             * The dispatch origin for this call must be _Signed_.
             *
             * Parameters:
             * - `delegate`: The account that previously announced the call.
             * - `call_hash`: The hash of the call to be made.
             **/
            rejectAnnouncement: AugmentedSubmittable<
                (
                    delegate:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array,
                    callHash: H256 | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [MultiAddress, H256]
            >;
            /**
             * Remove a given announcement.
             *
             * May be called by a proxy account to remove a call they previously announced and return
             * the deposit.
             *
             * The dispatch origin for this call must be _Signed_.
             *
             * Parameters:
             * - `real`: The account that the proxy will make a call on behalf of.
             * - `call_hash`: The hash of the call to be made by the `real` account.
             **/
            removeAnnouncement: AugmentedSubmittable<
                (
                    real:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array,
                    callHash: H256 | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [MultiAddress, H256]
            >;
            /**
             * Unregister all proxy accounts for the sender.
             *
             * The dispatch origin for this call must be _Signed_.
             *
             * WARNING: This may be called on accounts created by `pure`, however if done, then
             * the unreserved fees will be inaccessible. **All access to this account will be lost.**
             **/
            removeProxies: AugmentedSubmittable<
                () => SubmittableExtrinsic<ApiType>,
                []
            >;
            /**
             * Unregister a proxy account for the sender.
             *
             * The dispatch origin for this call must be _Signed_.
             *
             * Parameters:
             * - `proxy`: The account that the `caller` would like to remove as a proxy.
             * - `proxy_type`: The permissions currently enabled for the removed proxy account.
             **/
            removeProxy: AugmentedSubmittable<
                (
                    delegate:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array,
                    proxyType:
                        | NodeSubtensorRuntimeProxyType
                        | 'Any'
                        | 'Owner'
                        | 'NonCritical'
                        | 'NonTransfer'
                        | 'Senate'
                        | 'NonFungibile'
                        | 'Triumvirate'
                        | 'Governance'
                        | 'Staking'
                        | 'Registration'
                        | number
                        | Uint8Array,
                    delay: u32 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [MultiAddress, NodeSubtensorRuntimeProxyType, u32]
            >;
            /**
             * Generic tx
             **/
            [key: string]: SubmittableExtrinsicFunction<ApiType>;
        };
        registry: {
            /**
             * Clear the identity of an account.
             **/
            clearIdentity: AugmentedSubmittable<
                (
                    identified: AccountId32 | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [AccountId32]
            >;
            /**
             * Register an identity for an account. This will overwrite any existing identity.
             **/
            setIdentity: AugmentedSubmittable<
                (
                    identified: AccountId32 | string | Uint8Array,
                    info:
                        | PalletRegistryIdentityInfo
                        | {
                              additional?: any;
                              display?: any;
                              legal?: any;
                              web?: any;
                              riot?: any;
                              email?: any;
                              pgpFingerprint?: any;
                              image?: any;
                              twitter?: any;
                          }
                        | string
                        | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [AccountId32, PalletRegistryIdentityInfo]
            >;
            /**
             * Generic tx
             **/
            [key: string]: SubmittableExtrinsicFunction<ApiType>;
        };
        scheduler: {
            /**
             * Cancel an anonymously scheduled task.
             **/
            cancel: AugmentedSubmittable<
                (
                    when: u32 | AnyNumber | Uint8Array,
                    index: u32 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u32, u32]
            >;
            /**
             * Cancel a named scheduled task.
             **/
            cancelNamed: AugmentedSubmittable<
                (
                    id: U8aFixed | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [U8aFixed]
            >;
            /**
             * Removes the retry configuration of a task.
             **/
            cancelRetry: AugmentedSubmittable<
                (
                    task:
                        | ITuple<[u32, u32]>
                        | [
                              u32 | AnyNumber | Uint8Array,
                              u32 | AnyNumber | Uint8Array,
                          ]
                ) => SubmittableExtrinsic<ApiType>,
                [ITuple<[u32, u32]>]
            >;
            /**
             * Cancel the retry configuration of a named task.
             **/
            cancelRetryNamed: AugmentedSubmittable<
                (
                    id: U8aFixed | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [U8aFixed]
            >;
            /**
             * Anonymously schedule a task.
             **/
            schedule: AugmentedSubmittable<
                (
                    when: u32 | AnyNumber | Uint8Array,
                    maybePeriodic:
                        | Option<ITuple<[u32, u32]>>
                        | null
                        | Uint8Array
                        | ITuple<[u32, u32]>
                        | [
                              u32 | AnyNumber | Uint8Array,
                              u32 | AnyNumber | Uint8Array,
                          ],
                    priority: u8 | AnyNumber | Uint8Array,
                    call: Call | IMethod | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u32, Option<ITuple<[u32, u32]>>, u8, Call]
            >;
            /**
             * Anonymously schedule a task after a delay.
             **/
            scheduleAfter: AugmentedSubmittable<
                (
                    after: u32 | AnyNumber | Uint8Array,
                    maybePeriodic:
                        | Option<ITuple<[u32, u32]>>
                        | null
                        | Uint8Array
                        | ITuple<[u32, u32]>
                        | [
                              u32 | AnyNumber | Uint8Array,
                              u32 | AnyNumber | Uint8Array,
                          ],
                    priority: u8 | AnyNumber | Uint8Array,
                    call: Call | IMethod | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u32, Option<ITuple<[u32, u32]>>, u8, Call]
            >;
            /**
             * Schedule a named task.
             **/
            scheduleNamed: AugmentedSubmittable<
                (
                    id: U8aFixed | string | Uint8Array,
                    when: u32 | AnyNumber | Uint8Array,
                    maybePeriodic:
                        | Option<ITuple<[u32, u32]>>
                        | null
                        | Uint8Array
                        | ITuple<[u32, u32]>
                        | [
                              u32 | AnyNumber | Uint8Array,
                              u32 | AnyNumber | Uint8Array,
                          ],
                    priority: u8 | AnyNumber | Uint8Array,
                    call: Call | IMethod | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [U8aFixed, u32, Option<ITuple<[u32, u32]>>, u8, Call]
            >;
            /**
             * Schedule a named task after a delay.
             **/
            scheduleNamedAfter: AugmentedSubmittable<
                (
                    id: U8aFixed | string | Uint8Array,
                    after: u32 | AnyNumber | Uint8Array,
                    maybePeriodic:
                        | Option<ITuple<[u32, u32]>>
                        | null
                        | Uint8Array
                        | ITuple<[u32, u32]>
                        | [
                              u32 | AnyNumber | Uint8Array,
                              u32 | AnyNumber | Uint8Array,
                          ],
                    priority: u8 | AnyNumber | Uint8Array,
                    call: Call | IMethod | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [U8aFixed, u32, Option<ITuple<[u32, u32]>>, u8, Call]
            >;
            /**
             * Set a retry configuration for a task so that, in case its scheduled run fails, it will
             * be retried after `period` blocks, for a total amount of `retries` retries or until it
             * succeeds.
             *
             * Tasks which need to be scheduled for a retry are still subject to weight metering and
             * agenda space, same as a regular task. If a periodic task fails, it will be scheduled
             * normally while the task is retrying.
             *
             * Tasks scheduled as a result of a retry for a periodic task are unnamed, non-periodic
             * clones of the original task. Their retry configuration will be derived from the
             * original task's configuration, but will have a lower value for `remaining` than the
             * original `total_retries`.
             **/
            setRetry: AugmentedSubmittable<
                (
                    task:
                        | ITuple<[u32, u32]>
                        | [
                              u32 | AnyNumber | Uint8Array,
                              u32 | AnyNumber | Uint8Array,
                          ],
                    retries: u8 | AnyNumber | Uint8Array,
                    period: u32 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [ITuple<[u32, u32]>, u8, u32]
            >;
            /**
             * Set a retry configuration for a named task so that, in case its scheduled run fails, it
             * will be retried after `period` blocks, for a total amount of `retries` retries or until
             * it succeeds.
             *
             * Tasks which need to be scheduled for a retry are still subject to weight metering and
             * agenda space, same as a regular task. If a periodic task fails, it will be scheduled
             * normally while the task is retrying.
             *
             * Tasks scheduled as a result of a retry for a periodic task are unnamed, non-periodic
             * clones of the original task. Their retry configuration will be derived from the
             * original task's configuration, but will have a lower value for `remaining` than the
             * original `total_retries`.
             **/
            setRetryNamed: AugmentedSubmittable<
                (
                    id: U8aFixed | string | Uint8Array,
                    retries: u8 | AnyNumber | Uint8Array,
                    period: u32 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [U8aFixed, u8, u32]
            >;
            /**
             * Generic tx
             **/
            [key: string]: SubmittableExtrinsicFunction<ApiType>;
        };
        senateMembers: {
            /**
             * Add a member `who` to the set.
             *
             * May only be called from `T::AddOrigin`.
             **/
            addMember: AugmentedSubmittable<
                (
                    who:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [MultiAddress]
            >;
            /**
             * Swap out the sending member for some other key `new`.
             *
             * May only be called from `Signed` origin of a current member.
             *
             * Prime membership is passed from the origin account to `new`, if extant.
             **/
            changeKey: AugmentedSubmittable<
                (
                    updated:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [MultiAddress]
            >;
            /**
             * Remove the prime member if it exists.
             *
             * May only be called from `T::PrimeOrigin`.
             **/
            clearPrime: AugmentedSubmittable<
                () => SubmittableExtrinsic<ApiType>,
                []
            >;
            /**
             * Remove a member `who` from the set.
             *
             * May only be called from `T::RemoveOrigin`.
             **/
            removeMember: AugmentedSubmittable<
                (
                    who:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [MultiAddress]
            >;
            /**
             * Change the membership to a new set, disregarding the existing membership. Be nice and
             * pass `members` pre-sorted.
             *
             * May only be called from `T::ResetOrigin`.
             **/
            resetMembers: AugmentedSubmittable<
                (
                    members:
                        | Vec<AccountId32>
                        | (AccountId32 | string | Uint8Array)[]
                ) => SubmittableExtrinsic<ApiType>,
                [Vec<AccountId32>]
            >;
            /**
             * Set the prime member. Must be a current member.
             *
             * May only be called from `T::PrimeOrigin`.
             **/
            setPrime: AugmentedSubmittable<
                (
                    who:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [MultiAddress]
            >;
            /**
             * Swap out one member `remove` for another `add`.
             *
             * May only be called from `T::SwapOrigin`.
             *
             * Prime membership is *not* passed from `remove` to `add`, if extant.
             **/
            swapMember: AugmentedSubmittable<
                (
                    remove:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array,
                    add:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [MultiAddress, MultiAddress]
            >;
            /**
             * Generic tx
             **/
            [key: string]: SubmittableExtrinsicFunction<ApiType>;
        };
        subtensorModule: {
            /**
             * --- Adds stake to a hotkey. The call is made from the
             * coldkey account linked in the hotkey.
             * Only the associated coldkey is allowed to make staking and
             * unstaking requests. This protects the neuron against
             * attacks on its hotkey running in production code.
             *
             * # Args:
             * * 'origin': (<T as frame_system::Config>Origin):
             * - The signature of the caller's coldkey.
             *
             * * 'hotkey' (T::AccountId):
             * - The associated hotkey account.
             *
             * * 'amount_staked' (u64):
             * - The amount of stake to be added to the hotkey staking account.
             *
             * # Event:
             * * StakeAdded;
             * - On the successfully adding stake to a global account.
             *
             * # Raises:
             * * 'NotEnoughBalanceToStake':
             * - Not enough balance on the coldkey to add onto the global account.
             *
             * * 'NonAssociatedColdKey':
             * - The calling coldkey is not associated with this hotkey.
             *
             * * 'BalanceWithdrawalError':
             * - Errors stemming from transaction pallet.
             *
             **/
            addStake: AugmentedSubmittable<
                (
                    hotkey: AccountId32 | string | Uint8Array,
                    amountStaked: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [AccountId32, u64]
            >;
            /**
             * --- Sets the key as a delegate.
             *
             * # Args:
             * * 'origin': (<T as frame_system::Config>Origin):
             * - The signature of the caller's coldkey.
             *
             * * 'hotkey' (T::AccountId):
             * - The hotkey we are delegating (must be owned by the coldkey.)
             *
             * * 'take' (u64):
             * - The stake proportion that this hotkey takes from delegations.
             *
             * # Event:
             * * DelegateAdded;
             * - On successfully setting a hotkey as a delegate.
             *
             * # Raises:
             * * 'NotRegistered':
             * - The hotkey we are delegating is not registered on the network.
             *
             * * 'NonAssociatedColdKey':
             * - The hotkey we are delegating is not owned by the calling coldket.
             *
             **/
            becomeDelegate: AugmentedSubmittable<
                (
                    hotkey: AccountId32 | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [AccountId32]
            >;
            /**
             * User register a new subnetwork via burning token
             **/
            burnedRegister: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    hotkey: AccountId32 | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, AccountId32]
            >;
            /**
             * ---- Used to commit a hash of your weight values to later be revealed.
             *
             * # Args:
             * * `origin`: (`<T as frame_system::Config>::RuntimeOrigin`):
             * - The signature of the committing hotkey.
             *
             * * `netuid` (`u16`):
             * - The u16 network identifier.
             *
             * * `commit_hash` (`H256`):
             * - The hash representing the committed weights.
             *
             * # Raises:
             * * `WeightsCommitNotAllowed`:
             * - Attempting to commit when it is not allowed.
             *
             **/
            commitWeights: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    commitHash: H256 | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, H256]
            >;
            /**
             * --- Allows delegates to decrease its take value.
             *
             * # Args:
             * * 'origin': (<T as frame_system::Config>::Origin):
             * - The signature of the caller's coldkey.
             *
             * * 'hotkey' (T::AccountId):
             * - The hotkey we are delegating (must be owned by the coldkey.)
             *
             * * 'netuid' (u16):
             * - Subnet ID to decrease take for
             *
             * * 'take' (u16):
             * - The new stake proportion that this hotkey takes from delegations.
             * The new value can be between 0 and 11_796 and should be strictly
             * lower than the previous value. It T is the new value (rational number),
             * the the parameter is calculated as [65535 * T]. For example, 1% would be
             * [0.01 * 65535] = [655.35] = 655
             *
             * # Event:
             * * TakeDecreased;
             * - On successfully setting a decreased take for this hotkey.
             *
             * # Raises:
             * * 'NotRegistered':
             * - The hotkey we are delegating is not registered on the network.
             *
             * * 'NonAssociatedColdKey':
             * - The hotkey we are delegating is not owned by the calling coldkey.
             *
             * * 'DelegateTakeTooLow':
             * - The delegate is setting a take which is not lower than the previous.
             *
             **/
            decreaseTake: AugmentedSubmittable<
                (
                    hotkey: AccountId32 | string | Uint8Array,
                    take: u16 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [AccountId32, u16]
            >;
            /**
             * Remove a user's subnetwork
             * The caller must be the owner of the network
             **/
            dissolveNetwork: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16]
            >;
            /**
             * Facility extrinsic for user to get taken from faucet
             * It is only available when pow-faucet feature enabled
             * Just deployed in testnet and devnet for testing purpose
             **/
            faucet: AugmentedSubmittable<
                (
                    blockNumber: u64 | AnyNumber | Uint8Array,
                    nonce: u64 | AnyNumber | Uint8Array,
                    work: Bytes | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u64, u64, Bytes]
            >;
            /**
             * --- Allows delegates to increase its take value. This call is rate-limited.
             *
             * # Args:
             * * 'origin': (<T as frame_system::Config>::Origin):
             * - The signature of the caller's coldkey.
             *
             * * 'hotkey' (T::AccountId):
             * - The hotkey we are delegating (must be owned by the coldkey.)
             *
             * * 'take' (u16):
             * - The new stake proportion that this hotkey takes from delegations.
             * The new value can be between 0 and 11_796 and should be strictly
             * greater than the previous value. T is the new value (rational number),
             * the the parameter is calculated as [65535 * T]. For example, 1% would be
             * [0.01 * 65535] = [655.35] = 655
             *
             * # Event:
             * * TakeIncreased;
             * - On successfully setting a increased take for this hotkey.
             *
             * # Raises:
             * * 'NotRegistered':
             * - The hotkey we are delegating is not registered on the network.
             *
             * * 'NonAssociatedColdKey':
             * - The hotkey we are delegating is not owned by the calling coldkey.
             *
             * * 'DelegateTakeTooHigh':
             * - The delegate is setting a take which is not greater than the previous.
             *
             **/
            increaseTake: AugmentedSubmittable<
                (
                    hotkey: AccountId32 | string | Uint8Array,
                    take: u16 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [AccountId32, u16]
            >;
            /**
             * ---- Registers a new neuron to the subnetwork.
             *
             * # Args:
             * * 'origin': (<T as frame_system::Config>Origin):
             * - The signature of the calling hotkey.
             *
             * * 'netuid' (u16):
             * - The u16 network identifier.
             *
             * * 'block_number' ( u64 ):
             * - Block hash used to prove work done.
             *
             * * 'nonce' ( u64 ):
             * - Positive integer nonce used in POW.
             *
             * * 'work' ( Vec<u8> ):
             * - Vector encoded bytes representing work done.
             *
             * * 'hotkey' ( T::AccountId ):
             * - Hotkey to be registered to the network.
             *
             * * 'coldkey' ( T::AccountId ):
             * - Associated coldkey account.
             *
             * # Event:
             * * NeuronRegistered;
             * - On successfully registering a uid to a neuron slot on a subnetwork.
             *
             * # Raises:
             * * 'SubNetworkDoesNotExist':
             * - Attempting to register to a non existent network.
             *
             * * 'TooManyRegistrationsThisBlock':
             * - This registration exceeds the total allowed on this network this block.
             *
             * * 'HotKeyAlreadyRegisteredInSubNet':
             * - The hotkey is already registered on this network.
             *
             * * 'InvalidWorkBlock':
             * - The work has been performed on a stale, future, or non existent block.
             *
             * * 'InvalidDifficulty':
             * - The work does not match the difficulty.
             *
             * * 'InvalidSeal':
             * - The seal is incorrect.
             *
             **/
            register: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    blockNumber: u64 | AnyNumber | Uint8Array,
                    nonce: u64 | AnyNumber | Uint8Array,
                    work: Bytes | string | Uint8Array,
                    hotkey: AccountId32 | string | Uint8Array,
                    coldkey: AccountId32 | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u64, u64, Bytes, AccountId32, AccountId32]
            >;
            /**
             * User register a new subnetwork
             **/
            registerNetwork: AugmentedSubmittable<
                () => SubmittableExtrinsic<ApiType>,
                []
            >;
            /**
             * Remove stake from the staking account. The call must be made
             * from the coldkey account attached to the neuron metadata. Only this key
             * has permission to make staking and unstaking requests.
             *
             * # Args:
             * * 'origin': (<T as frame_system::Config>Origin):
             * - The signature of the caller's coldkey.
             *
             * * 'hotkey' (T::AccountId):
             * - The associated hotkey account.
             *
             * * 'amount_unstaked' (u64):
             * - The amount of stake to be added to the hotkey staking account.
             *
             * # Event:
             * * StakeRemoved;
             * - On the successfully removing stake from the hotkey account.
             *
             * # Raises:
             * * 'NotRegistered':
             * - Thrown if the account we are attempting to unstake from is non existent.
             *
             * * 'NonAssociatedColdKey':
             * - Thrown if the coldkey does not own the hotkey we are unstaking from.
             *
             * * 'NotEnoughStakeToWithdraw':
             * - Thrown if there is not enough stake on the hotkey to withdwraw this amount.
             *
             **/
            removeStake: AugmentedSubmittable<
                (
                    hotkey: AccountId32 | string | Uint8Array,
                    amountUnstaked: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [AccountId32, u64]
            >;
            /**
             * ---- Used to reveal the weights for a previously committed hash.
             *
             * # Args:
             * * `origin`: (`<T as frame_system::Config>::RuntimeOrigin`):
             * - The signature of the revealing hotkey.
             *
             * * `netuid` (`u16`):
             * - The u16 network identifier.
             *
             * * `uids` (`Vec<u16>`):
             * - The uids for the weights being revealed.
             *
             * * `values` (`Vec<u16>`):
             * - The values of the weights being revealed.
             *
             * * `salt` (`Vec<u8>`):
             * - The random salt to protect from brute-force guessing attack in case of small weight changes bit-wise.
             *
             * * `version_key` (`u64`):
             * - The network version key.
             *
             * # Raises:
             * * `NoWeightsCommitFound`:
             * - Attempting to reveal weights without an existing commit.
             *
             * * `InvalidRevealCommitHashNotMatchTempo`:
             * - Attempting to reveal weights outside the valid tempo.
             *
             * * `InvalidRevealCommitHashNotMatch`:
             * - The revealed hash does not match the committed hash.
             *
             **/
            revealWeights: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    uids: Vec<u16> | (u16 | AnyNumber | Uint8Array)[],
                    values: Vec<u16> | (u16 | AnyNumber | Uint8Array)[],
                    salt: Vec<u16> | (u16 | AnyNumber | Uint8Array)[],
                    versionKey: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, Vec<u16>, Vec<u16>, Vec<u16>, u64]
            >;
            /**
             * Register the hotkey to root network
             **/
            rootRegister: AugmentedSubmittable<
                (
                    hotkey: AccountId32 | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [AccountId32]
            >;
            /**
             * Serves or updates axon /promethteus information for the neuron associated with the caller. If the caller is
             * already registered the metadata is updated. If the caller is not registered this call throws NotRegistered.
             *
             * # Args:
             * * 'origin': (<T as frame_system::Config>Origin):
             * - The signature of the caller.
             *
             * * 'netuid' (u16):
             * - The u16 network identifier.
             *
             * * 'version' (u64):
             * - The bittensor version identifier.
             *
             * * 'ip' (u64):
             * - The endpoint ip information as a u128 encoded integer.
             *
             * * 'port' (u16):
             * - The endpoint port information as a u16 encoded integer.
             *
             * * 'ip_type' (u8):
             * - The endpoint ip version as a u8, 4 or 6.
             *
             * * 'protocol' (u8):
             * - UDP:1 or TCP:0
             *
             * * 'placeholder1' (u8):
             * - Placeholder for further extra params.
             *
             * * 'placeholder2' (u8):
             * - Placeholder for further extra params.
             *
             * # Event:
             * * AxonServed;
             * - On successfully serving the axon info.
             *
             * # Raises:
             * * 'SubNetworkDoesNotExist':
             * - Attempting to set weights on a non-existent network.
             *
             * * 'NotRegistered':
             * - Attempting to set weights from a non registered account.
             *
             * * 'InvalidIpType':
             * - The ip type is not 4 or 6.
             *
             * * 'InvalidIpAddress':
             * - The numerically encoded ip address does not resolve to a proper ip.
             *
             * * 'ServingRateLimitExceeded':
             * - Attempting to set prometheus information withing the rate limit min.
             *
             **/
            serveAxon: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    version: u32 | AnyNumber | Uint8Array,
                    ip: u128 | AnyNumber | Uint8Array,
                    port: u16 | AnyNumber | Uint8Array,
                    ipType: u8 | AnyNumber | Uint8Array,
                    protocol: u8 | AnyNumber | Uint8Array,
                    placeholder1: u8 | AnyNumber | Uint8Array,
                    placeholder2: u8 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u32, u128, u16, u8, u8, u8, u8]
            >;
            /**
             * ---- Set prometheus information for the neuron.
             * # Args:
             * * 'origin': (<T as frame_system::Config>Origin):
             * - The signature of the calling hotkey.
             *
             * * 'netuid' (u16):
             * - The u16 network identifier.
             *
             * * 'version' (u16):
             * -  The bittensor version identifier.
             *
             * * 'ip' (u128):
             * - The prometheus ip information as a u128 encoded integer.
             *
             * * 'port' (u16):
             * - The prometheus port information as a u16 encoded integer.
             *
             * * 'ip_type' (u8):
             * - The ip type v4 or v6.
             *
             **/
            servePrometheus: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    version: u32 | AnyNumber | Uint8Array,
                    ip: u128 | AnyNumber | Uint8Array,
                    port: u16 | AnyNumber | Uint8Array,
                    ipType: u8 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, u32, u128, u16, u8]
            >;
            /**
             * # Args:
             * * `origin`: (<T as frame_system::Config>Origin):
             * - The caller, a hotkey who wishes to set their weights.
             *
             * * `netuid` (u16):
             * - The network uid we are setting these weights on.
             *
             * * `hotkey` (T::AccountId):
             * - The hotkey associated with the operation and the calling coldkey.
             *
             * * `dests` (Vec<u16>):
             * - The edge endpoint for the weight, i.e. j for w_ij.
             *
             * * 'weights' (Vec<u16>):
             * - The u16 integer encoded weights. Interpreted as rational
             * values in the range [0,1]. They must sum to in32::MAX.
             *
             * * 'version_key' ( u64 ):
             * - The network version key to check if the validator is up to date.
             *
             * # Event:
             *
             * * WeightsSet;
             * - On successfully setting the weights on chain.
             *
             * # Raises:
             *
             * * NonAssociatedColdKey;
             * - Attempting to set weights on a non-associated cold key.
             *
             * * 'SubNetworkDoesNotExist':
             * - Attempting to set weights on a non-existent network.
             *
             * * 'NotRootSubnet':
             * - Attempting to set weights on a subnet that is not the root network.
             *
             * * 'WeightVecNotEqualSize':
             * - Attempting to set weights with uids not of same length.
             *
             * * 'UidVecContainInvalidOne':
             * - Attempting to set weights with invalid uids.
             *
             * * 'NotRegistered':
             * - Attempting to set weights from a non registered account.
             *
             * * 'WeightVecLengthIsLow':
             * - Attempting to set weights with fewer weights than min.
             *
             * * 'IncorrectWeightVersionKey':
             * - Attempting to set weights with the incorrect network version key.
             *
             * * 'SettingWeightsTooFast':
             * - Attempting to set weights too fast.
             *
             * * 'WeightVecLengthIsLow':
             * - Attempting to set weights with fewer weights than min.
             *
             * * 'MaxWeightExceeded':
             * - Attempting to set weights with max value exceeding limit.
             *
             **/
            setRootWeights: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    hotkey: AccountId32 | string | Uint8Array,
                    dests: Vec<u16> | (u16 | AnyNumber | Uint8Array)[],
                    weights: Vec<u16> | (u16 | AnyNumber | Uint8Array)[],
                    versionKey: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, AccountId32, Vec<u16>, Vec<u16>, u64]
            >;
            /**
             * --- Sets the caller weights for the incentive mechanism. The call can be
             * made from the hotkey account so is potentially insecure, however, the damage
             * of changing weights is minimal if caught early. This function includes all the
             * checks that the passed weights meet the requirements. Stored as u16s they represent
             * rational values in the range [0,1] which sum to 1 and can be interpreted as
             * probabilities. The specific weights determine how inflation propagates outward
             * from this peer.
             *
             * Note: The 16 bit integers weights should represent 1.0 as the max u16.
             * However, the function normalizes all integers to u16_max anyway. This means that if the sum of all
             * elements is larger or smaller than the amount of elements * u16_max, all elements
             * will be corrected for this deviation.
             *
             * # Args:
             * * `origin`: (<T as frame_system::Config>Origin):
             * - The caller, a hotkey who wishes to set their weights.
             *
             * * `netuid` (u16):
             * - The network uid we are setting these weights on.
             *
             * * `dests` (Vec<u16>):
             * - The edge endpoint for the weight, i.e. j for w_ij.
             *
             * * 'weights' (Vec<u16>):
             * - The u16 integer encoded weights. Interpreted as rational
             * values in the range [0,1]. They must sum to in32::MAX.
             *
             * * 'version_key' ( u64 ):
             * - The network version key to check if the validator is up to date.
             *
             * # Event:
             * * WeightsSet;
             * - On successfully setting the weights on chain.
             *
             * # Raises:
             * * 'SubNetworkDoesNotExist':
             * - Attempting to set weights on a non-existent network.
             *
             * * 'NotRegistered':
             * - Attempting to set weights from a non registered account.
             *
             * * 'WeightVecNotEqualSize':
             * - Attempting to set weights with uids not of same length.
             *
             * * 'DuplicateUids':
             * - Attempting to set weights with duplicate uids.
             *
             * * 'UidsLengthExceedUidsInSubNet':
             * - Attempting to set weights above the max allowed uids.
             *
             * * 'UidVecContainInvalidOne':
             * - Attempting to set weights with invalid uids.
             *
             * * 'WeightVecLengthIsLow':
             * - Attempting to set weights with fewer weights than min.
             *
             * * 'MaxWeightExceeded':
             * - Attempting to set weights with max value exceeding limit.
             **/
            setWeights: AugmentedSubmittable<
                (
                    netuid: u16 | AnyNumber | Uint8Array,
                    dests: Vec<u16> | (u16 | AnyNumber | Uint8Array)[],
                    weights: Vec<u16> | (u16 | AnyNumber | Uint8Array)[],
                    versionKey: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, Vec<u16>, Vec<u16>, u64]
            >;
            /**
             * Authenticates a council proposal and dispatches a function call with `Root` origin.
             *
             * The dispatch origin for this call must be a council majority.
             *
             * ## Complexity
             * - O(1).
             **/
            sudo: AugmentedSubmittable<
                (
                    call: Call | IMethod | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [Call]
            >;
            /**
             * Authenticates a council proposal and dispatches a function call with `Root` origin.
             * This function does not check the weight of the call, and instead allows the
             * user to specify the weight of the call.
             *
             * The dispatch origin for this call must be a council majority.
             *
             * ## Complexity
             * - O(1).
             **/
            sudoUncheckedWeight: AugmentedSubmittable<
                (
                    call: Call | IMethod | string | Uint8Array,
                    weight:
                        | SpWeightsWeightV2Weight
                        | { refTime?: any; proofSize?: any }
                        | string
                        | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [Call, SpWeightsWeightV2Weight]
            >;
            /**
             * The extrinsic for user to change its hotkey
             **/
            swapHotkey: AugmentedSubmittable<
                (
                    hotkey: AccountId32 | string | Uint8Array,
                    newHotkey: AccountId32 | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [AccountId32, AccountId32]
            >;
            /**
             * User vote on a proposal
             **/
            vote: AugmentedSubmittable<
                (
                    hotkey: AccountId32 | string | Uint8Array,
                    proposal: H256 | string | Uint8Array,
                    index: Compact<u32> | AnyNumber | Uint8Array,
                    approve: bool | boolean | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [AccountId32, H256, Compact<u32>, bool]
            >;
            /**
             * Generic tx
             **/
            [key: string]: SubmittableExtrinsicFunction<ApiType>;
        };
        sudo: {
            /**
             * Permanently removes the sudo key.
             *
             * **This cannot be un-done.**
             **/
            removeKey: AugmentedSubmittable<
                () => SubmittableExtrinsic<ApiType>,
                []
            >;
            /**
             * Authenticates the current sudo key and sets the given AccountId (`new`) as the new sudo
             * key.
             **/
            setKey: AugmentedSubmittable<
                (
                    updated:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [MultiAddress]
            >;
            /**
             * Authenticates the sudo key and dispatches a function call with `Root` origin.
             **/
            sudo: AugmentedSubmittable<
                (
                    call: Call | IMethod | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [Call]
            >;
            /**
             * Authenticates the sudo key and dispatches a function call with `Signed` origin from
             * a given account.
             *
             * The dispatch origin for this call must be _Signed_.
             **/
            sudoAs: AugmentedSubmittable<
                (
                    who:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array,
                    call: Call | IMethod | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [MultiAddress, Call]
            >;
            /**
             * Authenticates the sudo key and dispatches a function call with `Root` origin.
             * This function does not check the weight of the call, and instead allows the
             * Sudo user to specify the weight of the call.
             *
             * The dispatch origin for this call must be _Signed_.
             **/
            sudoUncheckedWeight: AugmentedSubmittable<
                (
                    call: Call | IMethod | string | Uint8Array,
                    weight:
                        | SpWeightsWeightV2Weight
                        | { refTime?: any; proofSize?: any }
                        | string
                        | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [Call, SpWeightsWeightV2Weight]
            >;
            /**
             * Generic tx
             **/
            [key: string]: SubmittableExtrinsicFunction<ApiType>;
        };
        system: {
            /**
             * Provide the preimage (runtime binary) `code` for an upgrade that has been authorized.
             *
             * If the authorization required a version check, this call will ensure the spec name
             * remains unchanged and that the spec version has increased.
             *
             * Depending on the runtime's `OnSetCode` configuration, this function may directly apply
             * the new `code` in the same block or attempt to schedule the upgrade.
             *
             * All origins are allowed.
             **/
            applyAuthorizedUpgrade: AugmentedSubmittable<
                (
                    code: Bytes | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [Bytes]
            >;
            /**
             * Authorize an upgrade to a given `code_hash` for the runtime. The runtime can be supplied
             * later.
             *
             * This call requires Root origin.
             **/
            authorizeUpgrade: AugmentedSubmittable<
                (
                    codeHash: H256 | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [H256]
            >;
            /**
             * Authorize an upgrade to a given `code_hash` for the runtime. The runtime can be supplied
             * later.
             *
             * WARNING: This authorizes an upgrade that will take place without any safety checks, for
             * example that the spec name remains the same and that the version number increases. Not
             * recommended for normal use. Use `authorize_upgrade` instead.
             *
             * This call requires Root origin.
             **/
            authorizeUpgradeWithoutChecks: AugmentedSubmittable<
                (
                    codeHash: H256 | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [H256]
            >;
            /**
             * Kill all storage items with a key that starts with the given prefix.
             *
             * **NOTE:** We rely on the Root origin to provide us the number of subkeys under
             * the prefix we are removing to accurately calculate the weight of this function.
             **/
            killPrefix: AugmentedSubmittable<
                (
                    prefix: Bytes | string | Uint8Array,
                    subkeys: u32 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [Bytes, u32]
            >;
            /**
             * Kill some items from storage.
             **/
            killStorage: AugmentedSubmittable<
                (
                    keys: Vec<Bytes> | (Bytes | string | Uint8Array)[]
                ) => SubmittableExtrinsic<ApiType>,
                [Vec<Bytes>]
            >;
            /**
             * Make some on-chain remark.
             *
             * Can be executed by every `origin`.
             **/
            remark: AugmentedSubmittable<
                (
                    remark: Bytes | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [Bytes]
            >;
            /**
             * Make some on-chain remark and emit event.
             **/
            remarkWithEvent: AugmentedSubmittable<
                (
                    remark: Bytes | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [Bytes]
            >;
            /**
             * Set the new runtime code.
             **/
            setCode: AugmentedSubmittable<
                (
                    code: Bytes | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [Bytes]
            >;
            /**
             * Set the new runtime code without doing any checks of the given `code`.
             *
             * Note that runtime upgrades will not run if this is called with a not-increasing spec
             * version!
             **/
            setCodeWithoutChecks: AugmentedSubmittable<
                (
                    code: Bytes | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [Bytes]
            >;
            /**
             * Set the number of pages in the WebAssembly environment's heap.
             **/
            setHeapPages: AugmentedSubmittable<
                (
                    pages: u64 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u64]
            >;
            /**
             * Set some items of storage.
             **/
            setStorage: AugmentedSubmittable<
                (
                    items:
                        | Vec<ITuple<[Bytes, Bytes]>>
                        | [
                              Bytes | string | Uint8Array,
                              Bytes | string | Uint8Array,
                          ][]
                ) => SubmittableExtrinsic<ApiType>,
                [Vec<ITuple<[Bytes, Bytes]>>]
            >;
            /**
             * Generic tx
             **/
            [key: string]: SubmittableExtrinsicFunction<ApiType>;
        };
        timestamp: {
            /**
             * Set the current time.
             *
             * This call should be invoked exactly once per block. It will panic at the finalization
             * phase, if this call hasn't been invoked by that time.
             *
             * The timestamp should be greater than the previous one by the amount specified by
             * [`Config::MinimumPeriod`].
             *
             * The dispatch origin for this call must be _None_.
             *
             * This dispatch class is _Mandatory_ to ensure it gets executed in the block. Be aware
             * that changing the complexity of this call could result exhausting the resources in a
             * block to execute any other calls.
             *
             * ## Complexity
             * - `O(1)` (Note that implementations of `OnTimestampSet` must also be `O(1)`)
             * - 1 storage read and 1 storage mutation (codec `O(1)` because of `DidUpdate::take` in
             * `on_finalize`)
             * - 1 event handler `on_timestamp_set`. Must be `O(1)`.
             **/
            set: AugmentedSubmittable<
                (
                    now: Compact<u64> | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [Compact<u64>]
            >;
            /**
             * Generic tx
             **/
            [key: string]: SubmittableExtrinsicFunction<ApiType>;
        };
        triumvirate: {
            /**
             * Close a vote that is either approved, disapproved or whose voting period has ended.
             *
             * May be called by any signed account in order to finish voting and close the proposal.
             *
             * If called before the end of the voting period it will only close the vote if it is
             * has enough votes to be approved or disapproved.
             *
             * If called after the end of the voting period abstentions are counted as rejections
             * unless there is a prime member set and the prime member cast an approval.
             *
             * If the close operation completes successfully with disapproval, the transaction fee will
             * be waived. Otherwise execution of the approved operation will be charged to the caller.
             *
             * + `proposal_weight_bound`: The maximum amount of weight consumed by executing the closed
             * proposal.
             * + `length_bound`: The upper bound for the length of the proposal in storage. Checked via
             * `storage::read` so it is `size_of::<u32>() == 4` larger than the pure length.
             *
             * ## Complexity
             * - `O(B + M + P1 + P2)` where:
             * - `B` is `proposal` size in bytes (length-fee-bounded)
             * - `M` is members-count (code- and governance-bounded)
             * - `P1` is the complexity of `proposal` preimage.
             * - `P2` is proposal-count (code-bounded)
             **/
            close: AugmentedSubmittable<
                (
                    proposalHash: H256 | string | Uint8Array,
                    index: Compact<u32> | AnyNumber | Uint8Array,
                    proposalWeightBound:
                        | SpWeightsWeightV2Weight
                        | { refTime?: any; proofSize?: any }
                        | string
                        | Uint8Array,
                    lengthBound: Compact<u32> | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [H256, Compact<u32>, SpWeightsWeightV2Weight, Compact<u32>]
            >;
            /**
             * Disapprove a proposal, close, and remove it from the system, regardless of its current
             * state.
             *
             * Must be called by the Root origin.
             *
             * Parameters:
             * * `proposal_hash`: The hash of the proposal that should be disapproved.
             *
             * ## Complexity
             * O(P) where P is the number of max proposals
             **/
            disapproveProposal: AugmentedSubmittable<
                (
                    proposalHash: H256 | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [H256]
            >;
            /**
             * Dispatch a proposal from a member using the `Member` origin.
             *
             * Origin must be a member of the collective.
             *
             * ## Complexity:
             * - `O(B + M + P)` where:
             * - `B` is `proposal` size in bytes (length-fee-bounded)
             * - `M` members-count (code-bounded)
             * - `P` complexity of dispatching `proposal`
             **/
            execute: AugmentedSubmittable<
                (
                    proposal: Call | IMethod | string | Uint8Array,
                    lengthBound: Compact<u32> | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [Call, Compact<u32>]
            >;
            /**
             * Add a new proposal to either be voted on or executed directly.
             *
             * Requires the sender to be member.
             *
             * `threshold` determines whether `proposal` is executed directly (`threshold < 2`)
             * or put up for voting.
             *
             * ## Complexity
             * - `O(B + M + P1)` or `O(B + M + P2)` where:
             * - `B` is `proposal` size in bytes (length-fee-bounded)
             * - `M` is members-count (code- and governance-bounded)
             * - branching is influenced by `threshold` where:
             * - `P1` is proposal execution complexity (`threshold < 2`)
             * - `P2` is proposals-count (code-bounded) (`threshold >= 2`)
             **/
            propose: AugmentedSubmittable<
                (
                    proposal: Call | IMethod | string | Uint8Array,
                    lengthBound: Compact<u32> | AnyNumber | Uint8Array,
                    duration: u32 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [Call, Compact<u32>, u32]
            >;
            /**
             * Set the collective's membership.
             *
             * - `new_members`: The new member list. Be nice to the chain and provide it sorted.
             * - `prime`: The prime member whose vote sets the default.
             * - `old_count`: The upper bound for the previous number of members in storage. Used for
             * weight estimation.
             *
             * The dispatch of this call must be `SetMembersOrigin`.
             *
             * NOTE: Does not enforce the expected `MaxMembers` limit on the amount of members, but
             * the weight estimations rely on it to estimate dispatchable weight.
             *
             * # WARNING:
             *
             * The `pallet-collective` can also be managed by logic outside of the pallet through the
             * implementation of the trait [`ChangeMembers`].
             * Any call to `set_members` must be careful that the member set doesn't get out of sync
             * with other logic managing the member set.
             *
             * ## Complexity:
             * - `O(MP + N)` where:
             * - `M` old-members-count (code- and governance-bounded)
             * - `N` new-members-count (code- and governance-bounded)
             * - `P` proposals-count (code-bounded)
             **/
            setMembers: AugmentedSubmittable<
                (
                    newMembers:
                        | Vec<AccountId32>
                        | (AccountId32 | string | Uint8Array)[],
                    prime:
                        | Option<AccountId32>
                        | null
                        | Uint8Array
                        | AccountId32
                        | string,
                    oldCount: u32 | AnyNumber | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [Vec<AccountId32>, Option<AccountId32>, u32]
            >;
            /**
             * Add an aye or nay vote for the sender to the given proposal.
             *
             * Requires the sender to be a member.
             *
             * Transaction fees will be waived if the member is voting on any particular proposal
             * for the first time and the call is successful. Subsequent vote changes will charge a
             * fee.
             * ## Complexity
             * - `O(M)` where `M` is members-count (code- and governance-bounded)
             **/
            vote: AugmentedSubmittable<
                (
                    proposal: H256 | string | Uint8Array,
                    index: Compact<u32> | AnyNumber | Uint8Array,
                    approve: bool | boolean | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [H256, Compact<u32>, bool]
            >;
            /**
             * Generic tx
             **/
            [key: string]: SubmittableExtrinsicFunction<ApiType>;
        };
        triumvirateMembers: {
            /**
             * Add a member `who` to the set.
             *
             * May only be called from `T::AddOrigin`.
             **/
            addMember: AugmentedSubmittable<
                (
                    who:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [MultiAddress]
            >;
            /**
             * Swap out the sending member for some other key `new`.
             *
             * May only be called from `Signed` origin of a current member.
             *
             * Prime membership is passed from the origin account to `new`, if extant.
             **/
            changeKey: AugmentedSubmittable<
                (
                    updated:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [MultiAddress]
            >;
            /**
             * Remove the prime member if it exists.
             *
             * May only be called from `T::PrimeOrigin`.
             **/
            clearPrime: AugmentedSubmittable<
                () => SubmittableExtrinsic<ApiType>,
                []
            >;
            /**
             * Remove a member `who` from the set.
             *
             * May only be called from `T::RemoveOrigin`.
             **/
            removeMember: AugmentedSubmittable<
                (
                    who:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [MultiAddress]
            >;
            /**
             * Change the membership to a new set, disregarding the existing membership. Be nice and
             * pass `members` pre-sorted.
             *
             * May only be called from `T::ResetOrigin`.
             **/
            resetMembers: AugmentedSubmittable<
                (
                    members:
                        | Vec<AccountId32>
                        | (AccountId32 | string | Uint8Array)[]
                ) => SubmittableExtrinsic<ApiType>,
                [Vec<AccountId32>]
            >;
            /**
             * Set the prime member. Must be a current member.
             *
             * May only be called from `T::PrimeOrigin`.
             **/
            setPrime: AugmentedSubmittable<
                (
                    who:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [MultiAddress]
            >;
            /**
             * Swap out one member `remove` for another `add`.
             *
             * May only be called from `T::SwapOrigin`.
             *
             * Prime membership is *not* passed from `remove` to `add`, if extant.
             **/
            swapMember: AugmentedSubmittable<
                (
                    remove:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array,
                    add:
                        | MultiAddress
                        | { Id: any }
                        | { Index: any }
                        | { Raw: any }
                        | { Address32: any }
                        | { Address20: any }
                        | string
                        | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [MultiAddress, MultiAddress]
            >;
            /**
             * Generic tx
             **/
            [key: string]: SubmittableExtrinsicFunction<ApiType>;
        };
        utility: {
            /**
             * Send a call through an indexed pseudonym of the sender.
             *
             * Filter from origin are passed along. The call will be dispatched with an origin which
             * use the same filter as the origin of this call.
             *
             * NOTE: If you need to ensure that any account-based filtering is not honored (i.e.
             * because you expect `proxy` to have been used prior in the call stack and you do not want
             * the call restrictions to apply to any sub-accounts), then use `as_multi_threshold_1`
             * in the Multisig pallet instead.
             *
             * NOTE: Prior to version *12, this was called `as_limited_sub`.
             *
             * The dispatch origin for this call must be _Signed_.
             **/
            asDerivative: AugmentedSubmittable<
                (
                    index: u16 | AnyNumber | Uint8Array,
                    call: Call | IMethod | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [u16, Call]
            >;
            /**
             * Send a batch of dispatch calls.
             *
             * May be called from any origin except `None`.
             *
             * - `calls`: The calls to be dispatched from the same origin. The number of call must not
             * exceed the constant: `batched_calls_limit` (available in constant metadata).
             *
             * If origin is root then the calls are dispatched without checking origin filter. (This
             * includes bypassing `frame_system::Config::BaseCallFilter`).
             *
             * ## Complexity
             * - O(C) where C is the number of calls to be batched.
             *
             * This will return `Ok` in all circumstances. To determine the success of the batch, an
             * event is deposited. If a call failed and the batch was interrupted, then the
             * `BatchInterrupted` event is deposited, along with the number of successful calls made
             * and the error of the failed call. If all were successful, then the `BatchCompleted`
             * event is deposited.
             **/
            batch: AugmentedSubmittable<
                (
                    calls: Vec<Call> | (Call | IMethod | string | Uint8Array)[]
                ) => SubmittableExtrinsic<ApiType>,
                [Vec<Call>]
            >;
            /**
             * Send a batch of dispatch calls and atomically execute them.
             * The whole transaction will rollback and fail if any of the calls failed.
             *
             * May be called from any origin except `None`.
             *
             * - `calls`: The calls to be dispatched from the same origin. The number of call must not
             * exceed the constant: `batched_calls_limit` (available in constant metadata).
             *
             * If origin is root then the calls are dispatched without checking origin filter. (This
             * includes bypassing `frame_system::Config::BaseCallFilter`).
             *
             * ## Complexity
             * - O(C) where C is the number of calls to be batched.
             **/
            batchAll: AugmentedSubmittable<
                (
                    calls: Vec<Call> | (Call | IMethod | string | Uint8Array)[]
                ) => SubmittableExtrinsic<ApiType>,
                [Vec<Call>]
            >;
            /**
             * Dispatches a function call with a provided origin.
             *
             * The dispatch origin for this call must be _Root_.
             *
             * ## Complexity
             * - O(1).
             **/
            dispatchAs: AugmentedSubmittable<
                (
                    asOrigin:
                        | NodeSubtensorRuntimeOriginCaller
                        | { system: any }
                        | { Void: any }
                        | { Triumvirate: any }
                        | string
                        | Uint8Array,
                    call: Call | IMethod | string | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [NodeSubtensorRuntimeOriginCaller, Call]
            >;
            /**
             * Send a batch of dispatch calls.
             * Unlike `batch`, it allows errors and won't interrupt.
             *
             * May be called from any origin except `None`.
             *
             * - `calls`: The calls to be dispatched from the same origin. The number of call must not
             * exceed the constant: `batched_calls_limit` (available in constant metadata).
             *
             * If origin is root then the calls are dispatch without checking origin filter. (This
             * includes bypassing `frame_system::Config::BaseCallFilter`).
             *
             * ## Complexity
             * - O(C) where C is the number of calls to be batched.
             **/
            forceBatch: AugmentedSubmittable<
                (
                    calls: Vec<Call> | (Call | IMethod | string | Uint8Array)[]
                ) => SubmittableExtrinsic<ApiType>,
                [Vec<Call>]
            >;
            /**
             * Dispatch a function call with a specified weight.
             *
             * This function does not check the weight of the call, and instead allows the
             * Root origin to specify the weight of the call.
             *
             * The dispatch origin for this call must be _Root_.
             **/
            withWeight: AugmentedSubmittable<
                (
                    call: Call | IMethod | string | Uint8Array,
                    weight:
                        | SpWeightsWeightV2Weight
                        | { refTime?: any; proofSize?: any }
                        | string
                        | Uint8Array
                ) => SubmittableExtrinsic<ApiType>,
                [Call, SpWeightsWeightV2Weight]
            >;
            /**
             * Generic tx
             **/
            [key: string]: SubmittableExtrinsicFunction<ApiType>;
        };
    } // AugmentedSubmittables
} // declare module

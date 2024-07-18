// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/consts';

import type { ApiTypes, AugmentedConst } from '@polkadot/api-base/types';
import type { u16, u32, u64, u8 } from '@polkadot/types-codec';
import type { Codec } from '@polkadot/types-codec/types';

export type __AugmentedConst<ApiType extends ApiTypes> =
    AugmentedConst<ApiType>;

declare module '@polkadot/api-base/types/consts' {
    interface AugmentedConsts<ApiType extends ApiTypes> {
        aura: {
            /**
             * The slot duration Aura should run with, expressed in milliseconds.
             * The effective value of this type should not change while the chain is running.
             *
             * For backwards compatibility either use [`MinimumPeriodTimesTwo`] or a const.
             **/
            slotDuration: u64 & AugmentedConst<ApiType>;
            /**
             * Generic const
             **/
            [key: string]: Codec;
        };
        balances: {
            /**
             * The minimum amount required to keep an account open. MUST BE GREATER THAN ZERO!
             *
             * If you *really* need it to be zero, you can enable the feature `insecure_zero_ed` for
             * this pallet. However, you do so at your own risk: this will open up a major DoS vector.
             * In case you have multiple sources of provider references, you may also get unexpected
             * behaviour if you set this to zero.
             *
             * Bottom line: Do yourself a favour and make it at least one!
             **/
            existentialDeposit: u64 & AugmentedConst<ApiType>;
            /**
             * The maximum number of individual freeze locks that can exist on an account at any time.
             **/
            maxFreezes: u32 & AugmentedConst<ApiType>;
            /**
             * The maximum number of locks that should exist on an account.
             * Not strictly enforced, but used for weight estimation.
             *
             * Use of locks is deprecated in favour of freezes. See `https://github.com/paritytech/substrate/pull/12951/`
             **/
            maxLocks: u32 & AugmentedConst<ApiType>;
            /**
             * The maximum number of named reserves that can exist on an account.
             *
             * Use of reserves is deprecated in favour of holds. See `https://github.com/paritytech/substrate/pull/12951/`
             **/
            maxReserves: u32 & AugmentedConst<ApiType>;
            /**
             * Generic const
             **/
            [key: string]: Codec;
        };
        commitments: {
            /**
             * The amount held on deposit per additional field for a registered identity.
             **/
            fieldDeposit: u64 & AugmentedConst<ApiType>;
            /**
             * The amount held on deposit for a registered identity
             **/
            initialDeposit: u64 & AugmentedConst<ApiType>;
            /**
             * The maximum number of additional fields that can be added to a commitment
             **/
            maxFields: u32 & AugmentedConst<ApiType>;
            /**
             * The rate limit for commitments
             **/
            rateLimit: u32 & AugmentedConst<ApiType>;
            /**
             * Generic const
             **/
            [key: string]: Codec;
        };
        grandpa: {
            /**
             * Max Authorities in use
             **/
            maxAuthorities: u32 & AugmentedConst<ApiType>;
            /**
             * The maximum number of nominators for each validator.
             **/
            maxNominators: u32 & AugmentedConst<ApiType>;
            /**
             * The maximum number of entries to keep in the set id to session index mapping.
             *
             * Since the `SetIdSession` map is only used for validating equivocations this
             * value should relate to the bonding duration of whatever staking system is
             * being used (if any). If equivocation handling is not enabled then this value
             * can be zero.
             **/
            maxSetIdSessionEntries: u64 & AugmentedConst<ApiType>;
            /**
             * Generic const
             **/
            [key: string]: Codec;
        };
        multisig: {
            /**
             * The base amount of currency needed to reserve for creating a multisig execution or to
             * store a dispatch call for later.
             *
             * This is held for an additional storage item whose value size is
             * `4 + sizeof((BlockNumber, Balance, AccountId))` bytes and whose key size is
             * `32 + sizeof(AccountId)` bytes.
             **/
            depositBase: u64 & AugmentedConst<ApiType>;
            /**
             * The amount of currency needed per unit threshold when creating a multisig execution.
             *
             * This is held for adding 32 bytes more into a pre-existing storage value.
             **/
            depositFactor: u64 & AugmentedConst<ApiType>;
            /**
             * The maximum amount of signatories allowed in the multisig.
             **/
            maxSignatories: u32 & AugmentedConst<ApiType>;
            /**
             * Generic const
             **/
            [key: string]: Codec;
        };
        proxy: {
            /**
             * The base amount of currency needed to reserve for creating an announcement.
             *
             * This is held when a new storage item holding a `Balance` is created (typically 16
             * bytes).
             **/
            announcementDepositBase: u64 & AugmentedConst<ApiType>;
            /**
             * The amount of currency needed per announcement made.
             *
             * This is held for adding an `AccountId`, `Hash` and `BlockNumber` (typically 68 bytes)
             * into a pre-existing storage value.
             **/
            announcementDepositFactor: u64 & AugmentedConst<ApiType>;
            /**
             * The maximum amount of time-delayed announcements that are allowed to be pending.
             **/
            maxPending: u32 & AugmentedConst<ApiType>;
            /**
             * The maximum amount of proxies allowed for a single account.
             **/
            maxProxies: u32 & AugmentedConst<ApiType>;
            /**
             * The base amount of currency needed to reserve for creating a proxy.
             *
             * This is held for an additional storage item whose value size is
             * `sizeof(Balance)` bytes and whose key size is `sizeof(AccountId)` bytes.
             **/
            proxyDepositBase: u64 & AugmentedConst<ApiType>;
            /**
             * The amount of currency needed per proxy added.
             *
             * This is held for adding 32 bytes plus an instance of `ProxyType` more into a
             * pre-existing storage value. Thus, when configuring `ProxyDepositFactor` one should take
             * into account `32 + proxy_type.encode().len()` bytes of data.
             **/
            proxyDepositFactor: u64 & AugmentedConst<ApiType>;
            /**
             * Generic const
             **/
            [key: string]: Codec;
        };
        registry: {
            /**
             * The amount held on deposit per additional field for a registered identity.
             **/
            fieldDeposit: u64 & AugmentedConst<ApiType>;
            /**
             * The amount held on deposit for a registered identity
             **/
            initialDeposit: u64 & AugmentedConst<ApiType>;
            /**
             * Configuration fields
             * Maximum user-configured additional fields
             **/
            maxAdditionalFields: u32 & AugmentedConst<ApiType>;
            /**
             * Generic const
             **/
            [key: string]: Codec;
        };
        scheduler: {
            /**
             * The maximum weight that may be scheduled per block for any dispatchables.
             **/
            maximumWeight: SpWeightsWeightV2Weight & AugmentedConst<ApiType>;
            /**
             * The maximum number of scheduled calls in the queue for a single block.
             *
             * NOTE:
             * + Dependent pallets' benchmarks might require a higher limit for the setting. Set a
             * higher limit under `runtime-benchmarks` feature.
             **/
            maxScheduledPerBlock: u32 & AugmentedConst<ApiType>;
            /**
             * Generic const
             **/
            [key: string]: Codec;
        };
        subtensorModule: {
            /**
             * Activity constant.
             **/
            initialActivityCutoff: u16 & AugmentedConst<ApiType>;
            /**
             * Initial adjustment alpha on burn and pow.
             **/
            initialAdjustmentAlpha: u64 & AugmentedConst<ApiType>;
            /**
             * Initial adjustment interval.
             **/
            initialAdjustmentInterval: u16 & AugmentedConst<ApiType>;
            /**
             * Initial bonds moving average.
             **/
            initialBondsMovingAverage: u64 & AugmentedConst<ApiType>;
            /**
             * Initial Burn.
             **/
            initialBurn: u64 & AugmentedConst<ApiType>;
            /**
             * Initial default delegation take.
             **/
            initialDefaultTake: u16 & AugmentedConst<ApiType>;
            /**
             * Initial Difficulty.
             **/
            initialDifficulty: u64 & AugmentedConst<ApiType>;
            /**
             * Initial Emission Ratio.
             **/
            initialEmissionValue: u16 & AugmentedConst<ApiType>;
            /**
             * Immunity Period Constant.
             **/
            initialImmunityPeriod: u16 & AugmentedConst<ApiType>;
            /**
             * =================================
             * ==== Initial Value Constants ====
             * =================================
             * Initial currency issuance.
             **/
            initialIssuance: u64 & AugmentedConst<ApiType>;
            /**
             * Kappa constant.
             **/
            initialKappa: u16 & AugmentedConst<ApiType>;
            /**
             * Max UID constant.
             **/
            initialMaxAllowedUids: u16 & AugmentedConst<ApiType>;
            /**
             * Initial maximum allowed validators per network.
             **/
            initialMaxAllowedValidators: u16 & AugmentedConst<ApiType>;
            /**
             * Initial Max Burn.
             **/
            initialMaxBurn: u64 & AugmentedConst<ApiType>;
            /**
             * Initial Max Difficulty.
             **/
            initialMaxDifficulty: u64 & AugmentedConst<ApiType>;
            /**
             * Initial max registrations per block.
             **/
            initialMaxRegistrationsPerBlock: u16 & AugmentedConst<ApiType>;
            /**
             * Initial max weight limit.
             **/
            initialMaxWeightsLimit: u16 & AugmentedConst<ApiType>;
            /**
             * Initial min allowed weights setting.
             **/
            initialMinAllowedWeights: u16 & AugmentedConst<ApiType>;
            /**
             * Initial Min Burn.
             **/
            initialMinBurn: u64 & AugmentedConst<ApiType>;
            /**
             * Initial Min Difficulty.
             **/
            initialMinDifficulty: u64 & AugmentedConst<ApiType>;
            /**
             * Initial minimum delegation take.
             **/
            initialMinTake: u16 & AugmentedConst<ApiType>;
            /**
             * Initial network immunity period
             **/
            initialNetworkImmunityPeriod: u64 & AugmentedConst<ApiType>;
            /**
             * Initial lock reduction interval.
             **/
            initialNetworkLockReductionInterval: u64 & AugmentedConst<ApiType>;
            /**
             * Initial minimum allowed network UIDs
             **/
            initialNetworkMinAllowedUids: u16 & AugmentedConst<ApiType>;
            /**
             * Initial network minimum burn cost
             **/
            initialNetworkMinLockCost: u64 & AugmentedConst<ApiType>;
            /**
             * Initial network creation rate limit
             **/
            initialNetworkRateLimit: u64 & AugmentedConst<ApiType>;
            /**
             * Initial pruning score for each neuron.
             **/
            initialPruningScore: u16 & AugmentedConst<ApiType>;
            /**
             * Initial RAO Recycled.
             **/
            initialRAORecycledForRegistration: u64 & AugmentedConst<ApiType>;
            /**
             * Rho constant.
             **/
            initialRho: u16 & AugmentedConst<ApiType>;
            /**
             * Initial scaling law power.
             **/
            initialScalingLawPower: u16 & AugmentedConst<ApiType>;
            /**
             * Initial percentage of total stake required to join senate.
             **/
            initialSenateRequiredStakePercentage: u64 & AugmentedConst<ApiType>;
            /**
             * Initial serving rate limit.
             **/
            initialServingRateLimit: u64 & AugmentedConst<ApiType>;
            /**
             * Initial max allowed subnets
             **/
            initialSubnetLimit: u16 & AugmentedConst<ApiType>;
            /**
             * Initial network subnet cut.
             **/
            initialSubnetOwnerCut: u16 & AugmentedConst<ApiType>;
            /**
             * Initial target registrations per interval.
             **/
            initialTargetRegistrationsPerInterval: u16 &
                AugmentedConst<ApiType>;
            /**
             * Initial target stakes per interval issuance.
             **/
            initialTargetStakesPerInterval: u64 & AugmentedConst<ApiType>;
            /**
             * Tempo for each network.
             **/
            initialTempo: u16 & AugmentedConst<ApiType>;
            /**
             * Initial delegate take transaction rate limit.
             **/
            initialTxDelegateTakeRateLimit: u64 & AugmentedConst<ApiType>;
            /**
             * Initial transaction rate limit.
             **/
            initialTxRateLimit: u64 & AugmentedConst<ApiType>;
            /**
             * Initial validator context pruning length.
             **/
            initialValidatorPruneLen: u64 & AugmentedConst<ApiType>;
            /**
             * Initial weights version key.
             **/
            initialWeightsVersionKey: u64 & AugmentedConst<ApiType>;
            /**
             * Generic const
             **/
            [key: string]: Codec;
        };
        system: {
            /**
             * Maximum number of block number to block hash mappings to keep (oldest pruned first).
             **/
            blockHashCount: u32 & AugmentedConst<ApiType>;
            /**
             * The maximum length of a block (in bytes).
             **/
            blockLength: FrameSystemLimitsBlockLength & AugmentedConst<ApiType>;
            /**
             * Block & extrinsics weights: base values and limits.
             **/
            blockWeights: FrameSystemLimitsBlockWeights &
                AugmentedConst<ApiType>;
            /**
             * The weight of runtime database operations the runtime can invoke.
             **/
            dbWeight: SpWeightsRuntimeDbWeight & AugmentedConst<ApiType>;
            /**
             * The designated SS58 prefix of this chain.
             *
             * This replaces the "ss58Format" property declared in the chain spec. Reason is
             * that the runtime should know about the prefix in order to make use of it as
             * an identifier of the chain.
             **/
            ss58Prefix: u16 & AugmentedConst<ApiType>;
            /**
             * Get the chain's in-code version.
             **/
            version: SpVersionRuntimeVersion & AugmentedConst<ApiType>;
            /**
             * Generic const
             **/
            [key: string]: Codec;
        };
        timestamp: {
            /**
             * The minimum period between blocks.
             *
             * Be aware that this is different to the *expected* period that the block production
             * apparatus provides. Your chosen consensus system will generally work with this to
             * determine a sensible block time. For example, in the Aura pallet it will be double this
             * period on default settings.
             **/
            minimumPeriod: u64 & AugmentedConst<ApiType>;
            /**
             * Generic const
             **/
            [key: string]: Codec;
        };
        transactionPayment: {
            /**
             * A fee multiplier for `Operational` extrinsics to compute "virtual tip" to boost their
             * `priority`
             *
             * This value is multiplied by the `final_fee` to obtain a "virtual tip" that is later
             * added to a tip component in regular `priority` calculations.
             * It means that a `Normal` transaction can front-run a similarly-sized `Operational`
             * extrinsic (with no tip), by including a tip value greater than the virtual tip.
             *
             * ```rust,ignore
             * // For `Normal`
             * let priority = priority_calc(tip);
             *
             * // For `Operational`
             * let virtual_tip = (inclusion_fee + tip) * OperationalFeeMultiplier;
             * let priority = priority_calc(tip + virtual_tip);
             * ```
             *
             * Note that since we use `final_fee` the multiplier applies also to the regular `tip`
             * sent with the transaction. So, not only does the transaction get a priority bump based
             * on the `inclusion_fee`, but we also amplify the impact of tips applied to `Operational`
             * transactions.
             **/
            operationalFeeMultiplier: u8 & AugmentedConst<ApiType>;
            /**
             * Generic const
             **/
            [key: string]: Codec;
        };
        utility: {
            /**
             * The limit on the number of batched calls.
             **/
            batchedCallsLimit: u32 & AugmentedConst<ApiType>;
            /**
             * Generic const
             **/
            [key: string]: Codec;
        };
    } // AugmentedConsts
} // declare module

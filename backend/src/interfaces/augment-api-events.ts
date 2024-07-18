// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/events';

import type { ApiTypes, AugmentedEvent } from '@polkadot/api-base/types';
import type {
    Null,
    Option,
    Result,
    U8aFixed,
    Vec,
    bool,
    u16,
    u32,
    u64,
    u8,
} from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { AccountId32, H256 } from '@polkadot/types/interfaces/runtime';

export type __AugmentedEvent<ApiType extends ApiTypes> =
    AugmentedEvent<ApiType>;

declare module '@polkadot/api-base/types/events' {
    interface AugmentedEvents<ApiType extends ApiTypes> {
        adminUtils: {
            /**
             * Generic event
             **/
            [key: string]: AugmentedEvent<ApiType>;
        };
        balances: {
            /**
             * A balance was set by root.
             **/
            BalanceSet: AugmentedEvent<
                ApiType,
                [who: AccountId32, free: u64],
                { who: AccountId32; free: u64 }
            >;
            /**
             * Some amount was burned from an account.
             **/
            Burned: AugmentedEvent<
                ApiType,
                [who: AccountId32, amount: u64],
                { who: AccountId32; amount: u64 }
            >;
            /**
             * Some amount was deposited (e.g. for transaction fees).
             **/
            Deposit: AugmentedEvent<
                ApiType,
                [who: AccountId32, amount: u64],
                { who: AccountId32; amount: u64 }
            >;
            /**
             * An account was removed whose balance was non-zero but below ExistentialDeposit,
             * resulting in an outright loss.
             **/
            DustLost: AugmentedEvent<
                ApiType,
                [account: AccountId32, amount: u64],
                { account: AccountId32; amount: u64 }
            >;
            /**
             * An account was created with some free balance.
             **/
            Endowed: AugmentedEvent<
                ApiType,
                [account: AccountId32, freeBalance: u64],
                { account: AccountId32; freeBalance: u64 }
            >;
            /**
             * Some balance was frozen.
             **/
            Frozen: AugmentedEvent<
                ApiType,
                [who: AccountId32, amount: u64],
                { who: AccountId32; amount: u64 }
            >;
            /**
             * Total issuance was increased by `amount`, creating a credit to be balanced.
             **/
            Issued: AugmentedEvent<ApiType, [amount: u64], { amount: u64 }>;
            /**
             * Some balance was locked.
             **/
            Locked: AugmentedEvent<
                ApiType,
                [who: AccountId32, amount: u64],
                { who: AccountId32; amount: u64 }
            >;
            /**
             * Some amount was minted into an account.
             **/
            Minted: AugmentedEvent<
                ApiType,
                [who: AccountId32, amount: u64],
                { who: AccountId32; amount: u64 }
            >;
            /**
             * Total issuance was decreased by `amount`, creating a debt to be balanced.
             **/
            Rescinded: AugmentedEvent<ApiType, [amount: u64], { amount: u64 }>;
            /**
             * Some balance was reserved (moved from free to reserved).
             **/
            Reserved: AugmentedEvent<
                ApiType,
                [who: AccountId32, amount: u64],
                { who: AccountId32; amount: u64 }
            >;
            /**
             * Some balance was moved from the reserve of the first account to the second account.
             * Final argument indicates the destination balance type.
             **/
            ReserveRepatriated: AugmentedEvent<
                ApiType,
                [
                    from: AccountId32,
                    to: AccountId32,
                    amount: u64,
                    destinationStatus: FrameSupportTokensMiscBalanceStatus,
                ],
                {
                    from: AccountId32;
                    to: AccountId32;
                    amount: u64;
                    destinationStatus: FrameSupportTokensMiscBalanceStatus;
                }
            >;
            /**
             * Some amount was restored into an account.
             **/
            Restored: AugmentedEvent<
                ApiType,
                [who: AccountId32, amount: u64],
                { who: AccountId32; amount: u64 }
            >;
            /**
             * Some amount was removed from the account (e.g. for misbehavior).
             **/
            Slashed: AugmentedEvent<
                ApiType,
                [who: AccountId32, amount: u64],
                { who: AccountId32; amount: u64 }
            >;
            /**
             * Some amount was suspended from an account (it can be restored later).
             **/
            Suspended: AugmentedEvent<
                ApiType,
                [who: AccountId32, amount: u64],
                { who: AccountId32; amount: u64 }
            >;
            /**
             * Some balance was thawed.
             **/
            Thawed: AugmentedEvent<
                ApiType,
                [who: AccountId32, amount: u64],
                { who: AccountId32; amount: u64 }
            >;
            /**
             * The `TotalIssuance` was forcefully changed.
             **/
            TotalIssuanceForced: AugmentedEvent<
                ApiType,
                [old: u64, new_: u64],
                { old: u64; new_: u64 }
            >;
            /**
             * Transfer succeeded.
             **/
            Transfer: AugmentedEvent<
                ApiType,
                [from: AccountId32, to: AccountId32, amount: u64],
                { from: AccountId32; to: AccountId32; amount: u64 }
            >;
            /**
             * Some balance was unlocked.
             **/
            Unlocked: AugmentedEvent<
                ApiType,
                [who: AccountId32, amount: u64],
                { who: AccountId32; amount: u64 }
            >;
            /**
             * Some balance was unreserved (moved from reserved to free).
             **/
            Unreserved: AugmentedEvent<
                ApiType,
                [who: AccountId32, amount: u64],
                { who: AccountId32; amount: u64 }
            >;
            /**
             * An account was upgraded.
             **/
            Upgraded: AugmentedEvent<
                ApiType,
                [who: AccountId32],
                { who: AccountId32 }
            >;
            /**
             * Some amount was withdrawn from the account (e.g. for transaction fees).
             **/
            Withdraw: AugmentedEvent<
                ApiType,
                [who: AccountId32, amount: u64],
                { who: AccountId32; amount: u64 }
            >;
            /**
             * Generic event
             **/
            [key: string]: AugmentedEvent<ApiType>;
        };
        commitments: {
            /**
             * A commitment was set
             **/
            Commitment: AugmentedEvent<
                ApiType,
                [netuid: u16, who: AccountId32],
                { netuid: u16; who: AccountId32 }
            >;
            /**
             * Generic event
             **/
            [key: string]: AugmentedEvent<ApiType>;
        };
        grandpa: {
            /**
             * New authority set has been applied.
             **/
            NewAuthorities: AugmentedEvent<
                ApiType,
                [authoritySet: Vec<ITuple<[SpConsensusGrandpaAppPublic, u64]>>],
                {
                    authoritySet: Vec<
                        ITuple<[SpConsensusGrandpaAppPublic, u64]>
                    >;
                }
            >;
            /**
             * Current authority set has been paused.
             **/
            Paused: AugmentedEvent<ApiType, []>;
            /**
             * Current authority set has been resumed.
             **/
            Resumed: AugmentedEvent<ApiType, []>;
            /**
             * Generic event
             **/
            [key: string]: AugmentedEvent<ApiType>;
        };
        multisig: {
            /**
             * A multisig operation has been approved by someone.
             **/
            MultisigApproval: AugmentedEvent<
                ApiType,
                [
                    approving: AccountId32,
                    timepoint: PalletMultisigTimepoint,
                    multisig: AccountId32,
                    callHash: U8aFixed,
                ],
                {
                    approving: AccountId32;
                    timepoint: PalletMultisigTimepoint;
                    multisig: AccountId32;
                    callHash: U8aFixed;
                }
            >;
            /**
             * A multisig operation has been cancelled.
             **/
            MultisigCancelled: AugmentedEvent<
                ApiType,
                [
                    cancelling: AccountId32,
                    timepoint: PalletMultisigTimepoint,
                    multisig: AccountId32,
                    callHash: U8aFixed,
                ],
                {
                    cancelling: AccountId32;
                    timepoint: PalletMultisigTimepoint;
                    multisig: AccountId32;
                    callHash: U8aFixed;
                }
            >;
            /**
             * A multisig operation has been executed.
             **/
            MultisigExecuted: AugmentedEvent<
                ApiType,
                [
                    approving: AccountId32,
                    timepoint: PalletMultisigTimepoint,
                    multisig: AccountId32,
                    callHash: U8aFixed,
                    result: Result<Null, SpRuntimeDispatchError>,
                ],
                {
                    approving: AccountId32;
                    timepoint: PalletMultisigTimepoint;
                    multisig: AccountId32;
                    callHash: U8aFixed;
                    result: Result<Null, SpRuntimeDispatchError>;
                }
            >;
            /**
             * A new multisig operation has begun.
             **/
            NewMultisig: AugmentedEvent<
                ApiType,
                [
                    approving: AccountId32,
                    multisig: AccountId32,
                    callHash: U8aFixed,
                ],
                {
                    approving: AccountId32;
                    multisig: AccountId32;
                    callHash: U8aFixed;
                }
            >;
            /**
             * Generic event
             **/
            [key: string]: AugmentedEvent<ApiType>;
        };
        preimage: {
            /**
             * A preimage has ben cleared.
             **/
            Cleared: AugmentedEvent<ApiType, [hash_: H256], { hash_: H256 }>;
            /**
             * A preimage has been noted.
             **/
            Noted: AugmentedEvent<ApiType, [hash_: H256], { hash_: H256 }>;
            /**
             * A preimage has been requested.
             **/
            Requested: AugmentedEvent<ApiType, [hash_: H256], { hash_: H256 }>;
            /**
             * Generic event
             **/
            [key: string]: AugmentedEvent<ApiType>;
        };
        proxy: {
            /**
             * An announcement was placed to make a call in the future.
             **/
            Announced: AugmentedEvent<
                ApiType,
                [real: AccountId32, proxy: AccountId32, callHash: H256],
                { real: AccountId32; proxy: AccountId32; callHash: H256 }
            >;
            /**
             * A proxy was added.
             **/
            ProxyAdded: AugmentedEvent<
                ApiType,
                [
                    delegator: AccountId32,
                    delegatee: AccountId32,
                    proxyType: NodeSubtensorRuntimeProxyType,
                    delay: u32,
                ],
                {
                    delegator: AccountId32;
                    delegatee: AccountId32;
                    proxyType: NodeSubtensorRuntimeProxyType;
                    delay: u32;
                }
            >;
            /**
             * A proxy was executed correctly, with the given.
             **/
            ProxyExecuted: AugmentedEvent<
                ApiType,
                [result: Result<Null, SpRuntimeDispatchError>],
                { result: Result<Null, SpRuntimeDispatchError> }
            >;
            /**
             * A proxy was removed.
             **/
            ProxyRemoved: AugmentedEvent<
                ApiType,
                [
                    delegator: AccountId32,
                    delegatee: AccountId32,
                    proxyType: NodeSubtensorRuntimeProxyType,
                    delay: u32,
                ],
                {
                    delegator: AccountId32;
                    delegatee: AccountId32;
                    proxyType: NodeSubtensorRuntimeProxyType;
                    delay: u32;
                }
            >;
            /**
             * A pure account has been created by new proxy with given
             * disambiguation index and proxy type.
             **/
            PureCreated: AugmentedEvent<
                ApiType,
                [
                    pure: AccountId32,
                    who: AccountId32,
                    proxyType: NodeSubtensorRuntimeProxyType,
                    disambiguationIndex: u16,
                ],
                {
                    pure: AccountId32;
                    who: AccountId32;
                    proxyType: NodeSubtensorRuntimeProxyType;
                    disambiguationIndex: u16;
                }
            >;
            /**
             * Generic event
             **/
            [key: string]: AugmentedEvent<ApiType>;
        };
        registry: {
            /**
             * Emitted when a user dissolves an identity
             **/
            IdentityDissolved: AugmentedEvent<
                ApiType,
                [who: AccountId32],
                { who: AccountId32 }
            >;
            /**
             * Emitted when a user registers an identity
             **/
            IdentitySet: AugmentedEvent<
                ApiType,
                [who: AccountId32],
                { who: AccountId32 }
            >;
            /**
             * Generic event
             **/
            [key: string]: AugmentedEvent<ApiType>;
        };
        scheduler: {
            /**
             * The call for the provided hash was not found so the task has been aborted.
             **/
            CallUnavailable: AugmentedEvent<
                ApiType,
                [task: ITuple<[u32, u32]>, id: Option<U8aFixed>],
                { task: ITuple<[u32, u32]>; id: Option<U8aFixed> }
            >;
            /**
             * Canceled some task.
             **/
            Canceled: AugmentedEvent<
                ApiType,
                [when: u32, index: u32],
                { when: u32; index: u32 }
            >;
            /**
             * Dispatched some task.
             **/
            Dispatched: AugmentedEvent<
                ApiType,
                [
                    task: ITuple<[u32, u32]>,
                    id: Option<U8aFixed>,
                    result: Result<Null, SpRuntimeDispatchError>,
                ],
                {
                    task: ITuple<[u32, u32]>;
                    id: Option<U8aFixed>;
                    result: Result<Null, SpRuntimeDispatchError>;
                }
            >;
            /**
             * The given task was unable to be renewed since the agenda is full at that block.
             **/
            PeriodicFailed: AugmentedEvent<
                ApiType,
                [task: ITuple<[u32, u32]>, id: Option<U8aFixed>],
                { task: ITuple<[u32, u32]>; id: Option<U8aFixed> }
            >;
            /**
             * The given task can never be executed since it is overweight.
             **/
            PermanentlyOverweight: AugmentedEvent<
                ApiType,
                [task: ITuple<[u32, u32]>, id: Option<U8aFixed>],
                { task: ITuple<[u32, u32]>; id: Option<U8aFixed> }
            >;
            /**
             * Cancel a retry configuration for some task.
             **/
            RetryCancelled: AugmentedEvent<
                ApiType,
                [task: ITuple<[u32, u32]>, id: Option<U8aFixed>],
                { task: ITuple<[u32, u32]>; id: Option<U8aFixed> }
            >;
            /**
             * The given task was unable to be retried since the agenda is full at that block or there
             * was not enough weight to reschedule it.
             **/
            RetryFailed: AugmentedEvent<
                ApiType,
                [task: ITuple<[u32, u32]>, id: Option<U8aFixed>],
                { task: ITuple<[u32, u32]>; id: Option<U8aFixed> }
            >;
            /**
             * Set a retry configuration for some task.
             **/
            RetrySet: AugmentedEvent<
                ApiType,
                [
                    task: ITuple<[u32, u32]>,
                    id: Option<U8aFixed>,
                    period: u32,
                    retries: u8,
                ],
                {
                    task: ITuple<[u32, u32]>;
                    id: Option<U8aFixed>;
                    period: u32;
                    retries: u8;
                }
            >;
            /**
             * Scheduled some task.
             **/
            Scheduled: AugmentedEvent<
                ApiType,
                [when: u32, index: u32],
                { when: u32; index: u32 }
            >;
            /**
             * Generic event
             **/
            [key: string]: AugmentedEvent<ApiType>;
        };
        senateMembers: {
            /**
             * Phantom member, never used.
             **/
            Dummy: AugmentedEvent<ApiType, []>;
            /**
             * One of the members' keys changed.
             **/
            KeyChanged: AugmentedEvent<ApiType, []>;
            /**
             * The given member was added; see the transaction for who.
             **/
            MemberAdded: AugmentedEvent<ApiType, []>;
            /**
             * The given member was removed; see the transaction for who.
             **/
            MemberRemoved: AugmentedEvent<ApiType, []>;
            /**
             * The membership was reset; see the transaction for who the new set is.
             **/
            MembersReset: AugmentedEvent<ApiType, []>;
            /**
             * Two members were swapped; see the transaction for who.
             **/
            MembersSwapped: AugmentedEvent<ApiType, []>;
            /**
             * Generic event
             **/
            [key: string]: AugmentedEvent<ApiType>;
        };
        subtensorModule: {
            /**
             * an activity cutoff is set for a subnet.
             **/
            ActivityCutoffSet: AugmentedEvent<ApiType, [u16, u16]>;
            /**
             * setting the adjustment alpha on a subnet.
             **/
            AdjustmentAlphaSet: AugmentedEvent<ApiType, [u16, u64]>;
            /**
             * the adjustment interval is set for a subnet.
             **/
            AdjustmentIntervalSet: AugmentedEvent<ApiType, [u16, u16]>;
            /**
             * the axon server information is added to the network.
             **/
            AxonServed: AugmentedEvent<ApiType, [u16, AccountId32]>;
            /**
             * bonds moving average is set for a subnet.
             **/
            BondsMovingAverageSet: AugmentedEvent<ApiType, [u16, u64]>;
            /**
             * FIXME: Not used yet
             **/
            BulkBalancesSet: AugmentedEvent<ApiType, [u16, u16]>;
            /**
             * multiple uids have been concurrently registered.
             **/
            BulkNeuronsRegistered: AugmentedEvent<ApiType, [u16, u16]>;
            /**
             * setting burn on a network.
             **/
            BurnSet: AugmentedEvent<ApiType, [u16, u64]>;
            /**
             * the default take is set.
             **/
            DefaultTakeSet: AugmentedEvent<ApiType, [u16]>;
            /**
             * a hotkey has become a delegate.
             **/
            DelegateAdded: AugmentedEvent<
                ApiType,
                [AccountId32, AccountId32, u16]
            >;
            /**
             * the difficulty has been set for a subnet.
             **/
            DifficultySet: AugmentedEvent<ApiType, [u16, u64]>;
            /**
             * emission ratios for all networks is set.
             **/
            EmissionValuesSet: AugmentedEvent<ApiType, []>;
            /**
             * the faucet it called on the test net.
             **/
            Faucet: AugmentedEvent<ApiType, [AccountId32, u64]>;
            /**
             * the hotkey is swapped
             **/
            HotkeySwapped: AugmentedEvent<
                ApiType,
                [
                    coldkey: AccountId32,
                    oldHotkey: AccountId32,
                    newHotkey: AccountId32,
                ],
                {
                    coldkey: AccountId32;
                    oldHotkey: AccountId32;
                    newHotkey: AccountId32;
                }
            >;
            /**
             * immunity period is set for a subnet.
             **/
            ImmunityPeriodSet: AugmentedEvent<ApiType, [u16, u16]>;
            /**
             * Kappa is set for a subnet.
             **/
            KappaSet: AugmentedEvent<ApiType, [u16, u16]>;
            /**
             * max allowed uids has been set for a subnetwork.
             **/
            MaxAllowedUidsSet: AugmentedEvent<ApiType, [u16, u16]>;
            /**
             * setting the max number of allowed validators on a subnet.
             **/
            MaxAllowedValidatorsSet: AugmentedEvent<ApiType, [u16, u16]>;
            /**
             * setting max burn on a network.
             **/
            MaxBurnSet: AugmentedEvent<ApiType, [u16, u64]>;
            /**
             * maximum delegate take is set by sudo/admin transaction
             **/
            MaxDelegateTakeSet: AugmentedEvent<ApiType, [u16]>;
            /**
             * setting max difficulty on a network.
             **/
            MaxDifficultySet: AugmentedEvent<ApiType, [u16, u64]>;
            /**
             * we set max registrations per block.
             **/
            MaxRegistrationsPerBlockSet: AugmentedEvent<ApiType, [u16, u16]>;
            /**
             * the max weight limit has been set for a subnetwork.
             **/
            MaxWeightLimitSet: AugmentedEvent<ApiType, [u16, u16]>;
            /**
             * minimum allowed weight is set for a subnet.
             **/
            MinAllowedWeightSet: AugmentedEvent<ApiType, [u16, u16]>;
            /**
             * setting min burn on a network.
             **/
            MinBurnSet: AugmentedEvent<ApiType, [u16, u64]>;
            /**
             * minimum delegate take is set by sudo/admin transaction
             **/
            MinDelegateTakeSet: AugmentedEvent<ApiType, [u16]>;
            /**
             * setting min difficulty on a network.
             **/
            MinDifficultySet: AugmentedEvent<ApiType, [u16, u64]>;
            /**
             * a new network is added.
             **/
            NetworkAdded: AugmentedEvent<ApiType, [u16, u16]>;
            /**
             * the network immunity period is set.
             **/
            NetworkImmunityPeriodSet: AugmentedEvent<ApiType, [u64]>;
            /**
             * the lock cost reduction is set
             **/
            NetworkLockCostReductionIntervalSet: AugmentedEvent<ApiType, [u64]>;
            /**
             * the network minimum locking cost is set.
             **/
            NetworkMinLockCostSet: AugmentedEvent<ApiType, [u64]>;
            /**
             * the network creation rate limit is set.
             **/
            NetworkRateLimitSet: AugmentedEvent<ApiType, [u64]>;
            /**
             * a network is removed.
             **/
            NetworkRemoved: AugmentedEvent<ApiType, [u16]>;
            /**
             * a new neuron account has been registered to the chain.
             **/
            NeuronRegistered: AugmentedEvent<ApiType, [u16, u16, AccountId32]>;
            /**
             * POW registration is allowed/disallowed for a subnet.
             **/
            PowRegistrationAllowed: AugmentedEvent<ApiType, [u16, bool]>;
            /**
             * the prometheus server information is added to the network.
             **/
            PrometheusServed: AugmentedEvent<ApiType, [u16, AccountId32]>;
            /**
             * setting the RAO recycled for registration.
             **/
            RAORecycledForRegistrationSet: AugmentedEvent<ApiType, [u16, u64]>;
            /**
             * registration is allowed/disallowed for a subnet.
             **/
            RegistrationAllowed: AugmentedEvent<ApiType, [u16, bool]>;
            /**
             * registration per interval is set for a subnet.
             **/
            RegistrationPerIntervalSet: AugmentedEvent<ApiType, [u16, u16]>;
            /**
             * Rho value is set.
             **/
            RhoSet: AugmentedEvent<ApiType, [u16, u16]>;
            /**
             * the scaling law power has been set for a subnet.
             **/
            ScalingLawPowerSet: AugmentedEvent<ApiType, [u16, u16]>;
            /**
             * setting the minimum required stake amount for senate registration.
             **/
            SenateRequiredStakePercentSet: AugmentedEvent<ApiType, [u64]>;
            /**
             * setting the prometheus serving rate limit.
             **/
            ServingRateLimitSet: AugmentedEvent<ApiType, [u16, u64]>;
            /**
             * stake has been transferred from the a coldkey account onto the hotkey staking account.
             **/
            StakeAdded: AugmentedEvent<ApiType, [AccountId32, u64]>;
            /**
             * stake has been removed from the hotkey staking account onto the coldkey account.
             **/
            StakeRemoved: AugmentedEvent<ApiType, [AccountId32, u64]>;
            /**
             * the maximum number of subnets is set
             **/
            SubnetLimitSet: AugmentedEvent<ApiType, [u16]>;
            /**
             * the subnet owner cut is set.
             **/
            SubnetOwnerCutSet: AugmentedEvent<ApiType, [u16]>;
            /**
             * a sudo call is done.
             **/
            Sudid: AugmentedEvent<
                ApiType,
                [Result<Null, SpRuntimeDispatchError>]
            >;
            /**
             * the take for a delegate is decreased.
             **/
            TakeDecreased: AugmentedEvent<
                ApiType,
                [AccountId32, AccountId32, u16]
            >;
            /**
             * the take for a delegate is increased.
             **/
            TakeIncreased: AugmentedEvent<
                ApiType,
                [AccountId32, AccountId32, u16]
            >;
            /**
             * the target stakes per interval is set by sudo/admin transaction
             **/
            TargetStakesPerIntervalSet: AugmentedEvent<ApiType, [u64]>;
            /**
             * setting tempo on a network
             **/
            TempoSet: AugmentedEvent<ApiType, [u16, u16]>;
            /**
             * setting the delegate take transaction rate limit.
             **/
            TxDelegateTakeRateLimitSet: AugmentedEvent<ApiType, [u64]>;
            /**
             * setting the transaction rate limit.
             **/
            TxRateLimitSet: AugmentedEvent<ApiType, [u64]>;
            /**
             * the validator pruning length has been set.
             **/
            ValidatorPruneLenSet: AugmentedEvent<ApiType, [u16, u64]>;
            /**
             * min stake is set for validators to set weights.
             **/
            WeightsMinStake: AugmentedEvent<ApiType, [u64]>;
            /**
             * a caller successfully sets their weights on a subnetwork.
             **/
            WeightsSet: AugmentedEvent<ApiType, [u16, u16]>;
            /**
             * weights set rate limit has been set for a subnet.
             **/
            WeightsSetRateLimitSet: AugmentedEvent<ApiType, [u16, u64]>;
            /**
             * weights version key is set for a network.
             **/
            WeightsVersionKeySet: AugmentedEvent<ApiType, [u16, u64]>;
            /**
             * Generic event
             **/
            [key: string]: AugmentedEvent<ApiType>;
        };
        sudo: {
            /**
             * The sudo key has been updated.
             **/
            KeyChanged: AugmentedEvent<
                ApiType,
                [old: Option<AccountId32>, new_: AccountId32],
                { old: Option<AccountId32>; new_: AccountId32 }
            >;
            /**
             * The key was permanently removed.
             **/
            KeyRemoved: AugmentedEvent<ApiType, []>;
            /**
             * A sudo call just took place.
             **/
            Sudid: AugmentedEvent<
                ApiType,
                [sudoResult: Result<Null, SpRuntimeDispatchError>],
                { sudoResult: Result<Null, SpRuntimeDispatchError> }
            >;
            /**
             * A [sudo_as](Pallet::sudo_as) call just took place.
             **/
            SudoAsDone: AugmentedEvent<
                ApiType,
                [sudoResult: Result<Null, SpRuntimeDispatchError>],
                { sudoResult: Result<Null, SpRuntimeDispatchError> }
            >;
            /**
             * Generic event
             **/
            [key: string]: AugmentedEvent<ApiType>;
        };
        system: {
            /**
             * `:code` was updated.
             **/
            CodeUpdated: AugmentedEvent<ApiType, []>;
            /**
             * An extrinsic failed.
             **/
            ExtrinsicFailed: AugmentedEvent<
                ApiType,
                [
                    dispatchError: SpRuntimeDispatchError,
                    dispatchInfo: FrameSupportDispatchDispatchInfo,
                ],
                {
                    dispatchError: SpRuntimeDispatchError;
                    dispatchInfo: FrameSupportDispatchDispatchInfo;
                }
            >;
            /**
             * An extrinsic completed successfully.
             **/
            ExtrinsicSuccess: AugmentedEvent<
                ApiType,
                [dispatchInfo: FrameSupportDispatchDispatchInfo],
                { dispatchInfo: FrameSupportDispatchDispatchInfo }
            >;
            /**
             * An account was reaped.
             **/
            KilledAccount: AugmentedEvent<
                ApiType,
                [account: AccountId32],
                { account: AccountId32 }
            >;
            /**
             * A new account was created.
             **/
            NewAccount: AugmentedEvent<
                ApiType,
                [account: AccountId32],
                { account: AccountId32 }
            >;
            /**
             * On on-chain remark happened.
             **/
            Remarked: AugmentedEvent<
                ApiType,
                [sender: AccountId32, hash_: H256],
                { sender: AccountId32; hash_: H256 }
            >;
            /**
             * An upgrade was authorized.
             **/
            UpgradeAuthorized: AugmentedEvent<
                ApiType,
                [codeHash: H256, checkVersion: bool],
                { codeHash: H256; checkVersion: bool }
            >;
            /**
             * Generic event
             **/
            [key: string]: AugmentedEvent<ApiType>;
        };
        transactionPayment: {
            /**
             * A transaction fee `actual_fee`, of which `tip` was added to the minimum inclusion fee,
             * has been paid by `who`.
             **/
            TransactionFeePaid: AugmentedEvent<
                ApiType,
                [who: AccountId32, actualFee: u64, tip: u64],
                { who: AccountId32; actualFee: u64; tip: u64 }
            >;
            /**
             * Generic event
             **/
            [key: string]: AugmentedEvent<ApiType>;
        };
        triumvirate: {
            /**
             * A motion was approved by the required threshold.
             **/
            Approved: AugmentedEvent<
                ApiType,
                [proposalHash: H256],
                { proposalHash: H256 }
            >;
            /**
             * A proposal was closed because its threshold was reached or after its duration was up.
             **/
            Closed: AugmentedEvent<
                ApiType,
                [proposalHash: H256, yes: u32, no: u32],
                { proposalHash: H256; yes: u32; no: u32 }
            >;
            /**
             * A motion was not approved by the required threshold.
             **/
            Disapproved: AugmentedEvent<
                ApiType,
                [proposalHash: H256],
                { proposalHash: H256 }
            >;
            /**
             * A motion was executed; result will be `Ok` if it returned without error.
             **/
            Executed: AugmentedEvent<
                ApiType,
                [
                    proposalHash: H256,
                    result: Result<Null, SpRuntimeDispatchError>,
                ],
                {
                    proposalHash: H256;
                    result: Result<Null, SpRuntimeDispatchError>;
                }
            >;
            /**
             * A single member did some action; result will be `Ok` if it returned without error.
             **/
            MemberExecuted: AugmentedEvent<
                ApiType,
                [
                    proposalHash: H256,
                    result: Result<Null, SpRuntimeDispatchError>,
                ],
                {
                    proposalHash: H256;
                    result: Result<Null, SpRuntimeDispatchError>;
                }
            >;
            /**
             * A motion (given hash) has been proposed (by given account) with a threshold (given
             * `MemberCount`).
             **/
            Proposed: AugmentedEvent<
                ApiType,
                [
                    account: AccountId32,
                    proposalIndex: u32,
                    proposalHash: H256,
                    threshold: u32,
                ],
                {
                    account: AccountId32;
                    proposalIndex: u32;
                    proposalHash: H256;
                    threshold: u32;
                }
            >;
            /**
             * A motion (given hash) has been voted on by given account, leaving
             * a tally (yes votes and no votes given respectively as `MemberCount`).
             **/
            Voted: AugmentedEvent<
                ApiType,
                [
                    account: AccountId32,
                    proposalHash: H256,
                    voted: bool,
                    yes: u32,
                    no: u32,
                ],
                {
                    account: AccountId32;
                    proposalHash: H256;
                    voted: bool;
                    yes: u32;
                    no: u32;
                }
            >;
            /**
             * Generic event
             **/
            [key: string]: AugmentedEvent<ApiType>;
        };
        triumvirateMembers: {
            /**
             * Phantom member, never used.
             **/
            Dummy: AugmentedEvent<ApiType, []>;
            /**
             * One of the members' keys changed.
             **/
            KeyChanged: AugmentedEvent<ApiType, []>;
            /**
             * The given member was added; see the transaction for who.
             **/
            MemberAdded: AugmentedEvent<ApiType, []>;
            /**
             * The given member was removed; see the transaction for who.
             **/
            MemberRemoved: AugmentedEvent<ApiType, []>;
            /**
             * The membership was reset; see the transaction for who the new set is.
             **/
            MembersReset: AugmentedEvent<ApiType, []>;
            /**
             * Two members were swapped; see the transaction for who.
             **/
            MembersSwapped: AugmentedEvent<ApiType, []>;
            /**
             * Generic event
             **/
            [key: string]: AugmentedEvent<ApiType>;
        };
        utility: {
            /**
             * Batch of dispatches completed fully with no error.
             **/
            BatchCompleted: AugmentedEvent<ApiType, []>;
            /**
             * Batch of dispatches completed but has errors.
             **/
            BatchCompletedWithErrors: AugmentedEvent<ApiType, []>;
            /**
             * Batch of dispatches did not complete fully. Index of first failing dispatch given, as
             * well as the error.
             **/
            BatchInterrupted: AugmentedEvent<
                ApiType,
                [index: u32, error: SpRuntimeDispatchError],
                { index: u32; error: SpRuntimeDispatchError }
            >;
            /**
             * A call was dispatched.
             **/
            DispatchedAs: AugmentedEvent<
                ApiType,
                [result: Result<Null, SpRuntimeDispatchError>],
                { result: Result<Null, SpRuntimeDispatchError> }
            >;
            /**
             * A single item within a Batch of dispatches has completed with no error.
             **/
            ItemCompleted: AugmentedEvent<ApiType, []>;
            /**
             * A single item within a Batch of dispatches has completed with error.
             **/
            ItemFailed: AugmentedEvent<
                ApiType,
                [error: SpRuntimeDispatchError],
                { error: SpRuntimeDispatchError }
            >;
            /**
             * Generic event
             **/
            [key: string]: AugmentedEvent<ApiType>;
        };
    } // AugmentedEvents
} // declare module

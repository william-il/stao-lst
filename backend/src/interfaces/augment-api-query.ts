// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/storage';

import type {
  ApiTypes,
  AugmentedQuery,
  QueryableStorageEntry,
} from '@polkadot/api-base/types';
import type {
  Bytes,
  Option,
  U8aFixed,
  Vec,
  bool,
  u128,
  u16,
  u32,
  u64,
} from '@polkadot/types-codec';
import type { AnyNumber, ITuple } from '@polkadot/types-codec/types';
import type {
  AccountId32,
  Call,
  H256,
} from '@polkadot/types/interfaces/runtime';
import type { Observable } from '@polkadot/types/types';

export type __AugmentedQuery<ApiType extends ApiTypes> = AugmentedQuery<
  ApiType,
  () => unknown
>;
export type __QueryableStorageEntry<ApiType extends ApiTypes> =
  QueryableStorageEntry<ApiType>;

declare module '@polkadot/api-base/types/storage' {
  interface AugmentedQueries<ApiType extends ApiTypes> {
    aura: {
      /**
       * The current authority set.
       **/
      authorities: AugmentedQuery<
        ApiType,
        () => Observable<Vec<SpConsensusAuraSr25519AppSr25519Public>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The current slot of this block.
       *
       * This will be set in `on_initialize`.
       **/
      currentSlot: AugmentedQuery<ApiType, () => Observable<u64>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    balances: {
      /**
       * The Balances pallet example of storing the balance of an account.
       *
       * # Example
       *
       * ```nocompile
       * impl pallet_balances::Config for Runtime {
       * type AccountStore = StorageMapShim<Self::Account<Runtime>, frame_system::Provider<Runtime>, AccountId, Self::AccountData<Balance>>
       * }
       * ```
       *
       * You can also store the balance of an account in the `System` pallet.
       *
       * # Example
       *
       * ```nocompile
       * impl pallet_balances::Config for Runtime {
       * type AccountStore = System
       * }
       * ```
       *
       * But this comes with tradeoffs, storing account balances in the system pallet stores
       * `frame_system` data alongside the account data contrary to storing account balances in the
       * `Balances` pallet, which uses a `StorageMap` to store balances data only.
       * NOTE: This is only used in the case that this pallet is used to store balances.
       **/
      account: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<PalletBalancesAccountData>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      /**
       * Freeze locks on account balances.
       **/
      freezes: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Vec<PalletBalancesIdAmountRuntimeFreezeReason>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      /**
       * Holds on account balances.
       **/
      holds: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Vec<PalletBalancesIdAmountRuntimeHoldReason>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      /**
       * The total units of outstanding deactivated balance in the system.
       **/
      inactiveIssuance: AugmentedQuery<ApiType, () => Observable<u64>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Any liquidity locks on some account balances.
       * NOTE: Should only be accessed when setting, changing and freeing a lock.
       *
       * Use of locks is deprecated in favour of freezes. See `https://github.com/paritytech/substrate/pull/12951/`
       **/
      locks: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Vec<PalletBalancesBalanceLock>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      /**
       * Named reserves on some account balances.
       *
       * Use of reserves is deprecated in favour of holds. See `https://github.com/paritytech/substrate/pull/12951/`
       **/
      reserves: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Vec<PalletBalancesReserveData>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      /**
       * The total units issued in the system.
       **/
      totalIssuance: AugmentedQuery<ApiType, () => Observable<u64>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    commitments: {
      /**
       * Identity data by account
       **/
      commitmentOf: AugmentedQuery<
        ApiType,
        (
          arg1: u16 | AnyNumber | Uint8Array,
          arg2: AccountId32 | string | Uint8Array
        ) => Observable<Option<PalletCommitmentsRegistration>>,
        [u16, AccountId32]
      > &
        QueryableStorageEntry<ApiType, [u16, AccountId32]>;
      lastCommitment: AugmentedQuery<
        ApiType,
        (
          arg1: u16 | AnyNumber | Uint8Array,
          arg2: AccountId32 | string | Uint8Array
        ) => Observable<Option<u32>>,
        [u16, AccountId32]
      > &
        QueryableStorageEntry<ApiType, [u16, AccountId32]>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    grandpa: {
      /**
       * The current list of authorities.
       **/
      authorities: AugmentedQuery<
        ApiType,
        () => Observable<Vec<ITuple<[SpConsensusGrandpaAppPublic, u64]>>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The number of changes (both in terms of keys and underlying economic responsibilities)
       * in the "set" of Grandpa validators from genesis.
       **/
      currentSetId: AugmentedQuery<ApiType, () => Observable<u64>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * next block number where we can force a change.
       **/
      nextForced: AugmentedQuery<ApiType, () => Observable<Option<u32>>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Pending change: (signaled at, scheduled change).
       **/
      pendingChange: AugmentedQuery<
        ApiType,
        () => Observable<Option<PalletGrandpaStoredPendingChange>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * A mapping from grandpa set ID to the index of the *most recent* session for which its
       * members were responsible.
       *
       * This is only used for validating equivocation proofs. An equivocation proof must
       * contains a key-ownership proof for a given session, therefore we need a way to tie
       * together sessions and GRANDPA set ids, i.e. we need to validate that a validator
       * was the owner of a given key on a given session, and what the active set ID was
       * during that session.
       *
       * TWOX-NOTE: `SetId` is not under user control.
       **/
      setIdSession: AugmentedQuery<
        ApiType,
        (arg: u64 | AnyNumber | Uint8Array) => Observable<Option<u32>>,
        [u64]
      > &
        QueryableStorageEntry<ApiType, [u64]>;
      /**
       * `true` if we are currently stalled.
       **/
      stalled: AugmentedQuery<
        ApiType,
        () => Observable<Option<ITuple<[u32, u32]>>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * State of the current authority set.
       **/
      state: AugmentedQuery<
        ApiType,
        () => Observable<PalletGrandpaStoredState>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    multisig: {
      /**
       * The set of open multisig operations.
       **/
      multisigs: AugmentedQuery<
        ApiType,
        (
          arg1: AccountId32 | string | Uint8Array,
          arg2: U8aFixed | string | Uint8Array
        ) => Observable<Option<PalletMultisigMultisig>>,
        [AccountId32, U8aFixed]
      > &
        QueryableStorageEntry<ApiType, [AccountId32, U8aFixed]>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    preimage: {
      preimageFor: AugmentedQuery<
        ApiType,
        (
          arg:
            | ITuple<[H256, u32]>
            | [H256 | string | Uint8Array, u32 | AnyNumber | Uint8Array]
        ) => Observable<Option<Bytes>>,
        [ITuple<[H256, u32]>]
      > &
        QueryableStorageEntry<ApiType, [ITuple<[H256, u32]>]>;
      /**
       * The request status of a given hash.
       **/
      requestStatusFor: AugmentedQuery<
        ApiType,
        (
          arg: H256 | string | Uint8Array
        ) => Observable<Option<PalletPreimageRequestStatus>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>;
      /**
       * The request status of a given hash.
       **/
      statusFor: AugmentedQuery<
        ApiType,
        (
          arg: H256 | string | Uint8Array
        ) => Observable<Option<PalletPreimageOldRequestStatus>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    proxy: {
      /**
       * The announcements made by the proxy (key).
       **/
      announcements: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<ITuple<[Vec<PalletProxyAnnouncement>, u64]>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      /**
       * The set of account proxies. Maps the account which has delegated to the accounts
       * which are being delegated to, together with the amount held on deposit.
       **/
      proxies: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<ITuple<[Vec<PalletProxyProxyDefinition>, u64]>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    randomnessCollectiveFlip: {
      /**
       * Series of block headers from the last 81 blocks that acts as random seed material. This
       * is arranged as a ring buffer with `block_number % 81` being the index into the `Vec` of
       * the oldest hash.
       **/
      randomMaterial: AugmentedQuery<ApiType, () => Observable<Vec<H256>>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    registry: {
      /**
       * Identity data by account
       **/
      identityOf: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Option<PalletRegistryRegistration>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    scheduler: {
      /**
       * Items to be executed, indexed by the block number that they should be executed on.
       **/
      agenda: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<Vec<Option<PalletSchedulerScheduled>>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>;
      incompleteSince: AugmentedQuery<
        ApiType,
        () => Observable<Option<u32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Lookup from a name to the block number and index of the task.
       *
       * For v3 -> v4 the previously unbounded identities are Blake2-256 hashed to form the v4
       * identities.
       **/
      lookup: AugmentedQuery<
        ApiType,
        (
          arg: U8aFixed | string | Uint8Array
        ) => Observable<Option<ITuple<[u32, u32]>>>,
        [U8aFixed]
      > &
        QueryableStorageEntry<ApiType, [U8aFixed]>;
      /**
       * Retry configurations for items to be executed, indexed by task address.
       **/
      retries: AugmentedQuery<
        ApiType,
        (
          arg:
            | ITuple<[u32, u32]>
            | [u32 | AnyNumber | Uint8Array, u32 | AnyNumber | Uint8Array]
        ) => Observable<Option<PalletSchedulerRetryConfig>>,
        [ITuple<[u32, u32]>]
      > &
        QueryableStorageEntry<ApiType, [ITuple<[u32, u32]>]>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    senateMembers: {
      /**
       * The current membership, stored as an ordered Vec.
       **/
      members: AugmentedQuery<ApiType, () => Observable<Vec<AccountId32>>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The current prime member, if one exists.
       **/
      prime: AugmentedQuery<
        ApiType,
        () => Observable<Option<AccountId32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    subtensorModule: {
      active: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<Vec<bool>>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      activityCutoff: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u16>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      adjustmentAlpha: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u64>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      adjustmentInterval: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u16>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      axons: AugmentedQuery<
        ApiType,
        (
          arg1: u16 | AnyNumber | Uint8Array,
          arg2: AccountId32 | string | Uint8Array
        ) => Observable<Option<PalletSubtensorAxonInfo>>,
        [u16, AccountId32]
      > &
        QueryableStorageEntry<ApiType, [u16, AccountId32]>;
      blockAtRegistration: AugmentedQuery<
        ApiType,
        (
          arg1: u16 | AnyNumber | Uint8Array,
          arg2: u16 | AnyNumber | Uint8Array
        ) => Observable<u64>,
        [u16, u16]
      > &
        QueryableStorageEntry<ApiType, [u16, u16]>;
      blockEmission: AugmentedQuery<ApiType, () => Observable<u64>, []> &
        QueryableStorageEntry<ApiType, []>;
      blocksSinceLastStep: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u64>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      bonds: AugmentedQuery<
        ApiType,
        (
          arg1: u16 | AnyNumber | Uint8Array,
          arg2: u16 | AnyNumber | Uint8Array
        ) => Observable<Vec<ITuple<[u16, u16]>>>,
        [u16, u16]
      > &
        QueryableStorageEntry<ApiType, [u16, u16]>;
      bondsMovingAverage: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u64>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      burn: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u64>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      burnRegistrationsThisInterval: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u16>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      commitRevealWeightsEnabled: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<bool>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      consensus: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<Vec<u16>>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      delegates: AugmentedQuery<
        ApiType,
        (arg: AccountId32 | string | Uint8Array) => Observable<u16>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      difficulty: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u64>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      dividends: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<Vec<u16>>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      emission: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<Vec<u64>>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      emissionValues: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u64>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      immunityPeriod: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u16>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      incentive: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<Vec<u16>>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      isNetworkMember: AugmentedQuery<
        ApiType,
        (
          arg1: AccountId32 | string | Uint8Array,
          arg2: u16 | AnyNumber | Uint8Array
        ) => Observable<bool>,
        [AccountId32, u16]
      > &
        QueryableStorageEntry<ApiType, [AccountId32, u16]>;
      kappa: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u16>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      keys: AugmentedQuery<
        ApiType,
        (
          arg1: u16 | AnyNumber | Uint8Array,
          arg2: u16 | AnyNumber | Uint8Array
        ) => Observable<AccountId32>,
        [u16, u16]
      > &
        QueryableStorageEntry<ApiType, [u16, u16]>;
      lastAdjustmentBlock: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u64>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      lastMechansimStepBlock: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u64>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      lastTxBlock: AugmentedQuery<
        ApiType,
        (arg: AccountId32 | string | Uint8Array) => Observable<u64>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      lastTxBlockDelegateTake: AugmentedQuery<
        ApiType,
        (arg: AccountId32 | string | Uint8Array) => Observable<u64>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      lastUpdate: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<Vec<u64>>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      loadedEmission: AugmentedQuery<
        ApiType,
        (
          arg: u16 | AnyNumber | Uint8Array
        ) => Observable<Option<Vec<ITuple<[AccountId32, u64, u64]>>>>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      maxAllowedUids: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u16>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      maxAllowedValidators: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u16>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      maxBurn: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u64>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      maxDifficulty: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u64>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      maxRegistrationsPerBlock: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u16>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      maxTake: AugmentedQuery<ApiType, () => Observable<u16>, []> &
        QueryableStorageEntry<ApiType, []>;
      maxWeightsLimit: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u16>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      minAllowedWeights: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u16>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      minBurn: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u64>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      minDifficulty: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u64>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      minTake: AugmentedQuery<ApiType, () => Observable<u16>, []> &
        QueryableStorageEntry<ApiType, []>;
      networkImmunityPeriod: AugmentedQuery<
        ApiType,
        () => Observable<u64>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      networkLastLockCost: AugmentedQuery<ApiType, () => Observable<u64>, []> &
        QueryableStorageEntry<ApiType, []>;
      networkLastRegistered: AugmentedQuery<
        ApiType,
        () => Observable<u64>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      networkLockReductionInterval: AugmentedQuery<
        ApiType,
        () => Observable<u64>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      networkMinAllowedUids: AugmentedQuery<
        ApiType,
        () => Observable<u16>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      networkMinLockCost: AugmentedQuery<ApiType, () => Observable<u64>, []> &
        QueryableStorageEntry<ApiType, []>;
      networkModality: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u16>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      networkPowRegistrationAllowed: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<bool>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      networkRateLimit: AugmentedQuery<ApiType, () => Observable<u64>, []> &
        QueryableStorageEntry<ApiType, []>;
      networkRegisteredAt: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u64>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      networkRegistrationAllowed: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<bool>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      networksAdded: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<bool>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      neuronsToPruneAtNextEpoch: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u16>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      nominatorMinRequiredStake: AugmentedQuery<
        ApiType,
        () => Observable<u64>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      owner: AugmentedQuery<
        ApiType,
        (arg: AccountId32 | string | Uint8Array) => Observable<AccountId32>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      pendingEmission: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u64>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      powRegistrationsThisInterval: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u16>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      prometheus: AugmentedQuery<
        ApiType,
        (
          arg1: u16 | AnyNumber | Uint8Array,
          arg2: AccountId32 | string | Uint8Array
        ) => Observable<Option<PalletSubtensorPrometheusInfo>>,
        [u16, AccountId32]
      > &
        QueryableStorageEntry<ApiType, [u16, AccountId32]>;
      pruningScores: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<Vec<u16>>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      rank: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<Vec<u16>>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      raoRecycledForRegistration: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u64>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      registrationsThisBlock: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u16>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      registrationsThisInterval: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u16>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      rho: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u16>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      scalingLawPower: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u16>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      senateRequiredStakePercentage: AugmentedQuery<
        ApiType,
        () => Observable<u64>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      servingRateLimit: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u64>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      stake: AugmentedQuery<
        ApiType,
        (
          arg1: AccountId32 | string | Uint8Array,
          arg2: AccountId32 | string | Uint8Array
        ) => Observable<u64>,
        [AccountId32, AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32, AccountId32]>;
      stakeInterval: AugmentedQuery<ApiType, () => Observable<u64>, []> &
        QueryableStorageEntry<ApiType, []>;
      subnetLimit: AugmentedQuery<ApiType, () => Observable<u16>, []> &
        QueryableStorageEntry<ApiType, []>;
      subnetLocked: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u64>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      subnetOwner: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<AccountId32>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      subnetOwnerCut: AugmentedQuery<ApiType, () => Observable<u16>, []> &
        QueryableStorageEntry<ApiType, []>;
      subnetworkN: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u16>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      targetRegistrationsPerInterval: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u16>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      targetStakesPerInterval: AugmentedQuery<
        ApiType,
        () => Observable<u64>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      tempo: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u16>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      totalColdkeyStake: AugmentedQuery<
        ApiType,
        (arg: AccountId32 | string | Uint8Array) => Observable<u64>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      /**
       * MAP (hot, cold) --> stake | Returns a tuple (u64: stakes, u64: block_number)
       **/
      totalHotkeyColdkeyStakesThisInterval: AugmentedQuery<
        ApiType,
        (
          arg1: AccountId32 | string | Uint8Array,
          arg2: AccountId32 | string | Uint8Array
        ) => Observable<ITuple<[u64, u64]>>,
        [AccountId32, AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32, AccountId32]>;
      totalHotkeyStake: AugmentedQuery<
        ApiType,
        (arg: AccountId32 | string | Uint8Array) => Observable<u64>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      totalIssuance: AugmentedQuery<ApiType, () => Observable<u64>, []> &
        QueryableStorageEntry<ApiType, []>;
      totalNetworks: AugmentedQuery<ApiType, () => Observable<u16>, []> &
        QueryableStorageEntry<ApiType, []>;
      totalStake: AugmentedQuery<ApiType, () => Observable<u64>, []> &
        QueryableStorageEntry<ApiType, []>;
      trust: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<Vec<u16>>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      txDelegateTakeRateLimit: AugmentedQuery<
        ApiType,
        () => Observable<u64>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      txRateLimit: AugmentedQuery<ApiType, () => Observable<u64>, []> &
        QueryableStorageEntry<ApiType, []>;
      uids: AugmentedQuery<
        ApiType,
        (
          arg1: u16 | AnyNumber | Uint8Array,
          arg2: AccountId32 | string | Uint8Array
        ) => Observable<Option<u16>>,
        [u16, AccountId32]
      > &
        QueryableStorageEntry<ApiType, [u16, AccountId32]>;
      usedWork: AugmentedQuery<
        ApiType,
        (arg: Bytes | string | Uint8Array) => Observable<u64>,
        [Bytes]
      > &
        QueryableStorageEntry<ApiType, [Bytes]>;
      validatorPermit: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<Vec<bool>>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      validatorPruneLen: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u64>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      validatorTrust: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<Vec<u16>>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      weightCommitRevealInterval: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u64>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      weightCommits: AugmentedQuery<
        ApiType,
        (
          arg1: u16 | AnyNumber | Uint8Array,
          arg2: AccountId32 | string | Uint8Array
        ) => Observable<Option<ITuple<[H256, u64]>>>,
        [u16, AccountId32]
      > &
        QueryableStorageEntry<ApiType, [u16, AccountId32]>;
      weights: AugmentedQuery<
        ApiType,
        (
          arg1: u16 | AnyNumber | Uint8Array,
          arg2: u16 | AnyNumber | Uint8Array
        ) => Observable<Vec<ITuple<[u16, u16]>>>,
        [u16, u16]
      > &
        QueryableStorageEntry<ApiType, [u16, u16]>;
      weightsMinStake: AugmentedQuery<ApiType, () => Observable<u64>, []> &
        QueryableStorageEntry<ApiType, []>;
      weightsSetRateLimit: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u64>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      weightsVersionKey: AugmentedQuery<
        ApiType,
        (arg: u16 | AnyNumber | Uint8Array) => Observable<u64>,
        [u16]
      > &
        QueryableStorageEntry<ApiType, [u16]>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    sudo: {
      /**
       * The `AccountId` of the sudo key.
       **/
      key: AugmentedQuery<ApiType, () => Observable<Option<AccountId32>>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    system: {
      /**
       * The full account information for a particular account ID.
       **/
      account: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<FrameSystemAccountInfo>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      /**
       * Total length (in bytes) for all extrinsics put together, for the current block.
       **/
      allExtrinsicsLen: AugmentedQuery<
        ApiType,
        () => Observable<Option<u32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * `Some` if a code upgrade has been authorized.
       **/
      authorizedUpgrade: AugmentedQuery<
        ApiType,
        () => Observable<Option<FrameSystemCodeUpgradeAuthorization>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Map of block numbers to block hashes.
       **/
      blockHash: AugmentedQuery<
        ApiType,
        (arg: u32 | AnyNumber | Uint8Array) => Observable<H256>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>;
      /**
       * The current weight for the block.
       **/
      blockWeight: AugmentedQuery<
        ApiType,
        () => Observable<FrameSupportDispatchPerDispatchClassWeight>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Digest of the current block, also part of the block header.
       **/
      digest: AugmentedQuery<ApiType, () => Observable<SpRuntimeDigest>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The number of events in the `Events<T>` list.
       **/
      eventCount: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Events deposited for the current block.
       *
       * NOTE: The item is unbound and should therefore never be read on chain.
       * It could otherwise inflate the PoV size of a block.
       *
       * Events have a large in-memory size. Box the events to not go out-of-memory
       * just in case someone still reads them from within the runtime.
       **/
      events: AugmentedQuery<
        ApiType,
        () => Observable<Vec<FrameSystemEventRecord>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Mapping between a topic (represented by T::Hash) and a vector of indexes
       * of events in the `<Events<T>>` list.
       *
       * All topic vectors have deterministic storage locations depending on the topic. This
       * allows light-clients to leverage the changes trie storage tracking mechanism and
       * in case of changes fetch the list of events of interest.
       *
       * The value has the type `(BlockNumberFor<T>, EventIndex)` because if we used only just
       * the `EventIndex` then in case if the topic has the same contents on the next block
       * no notification will be triggered thus the event might be lost.
       **/
      eventTopics: AugmentedQuery<
        ApiType,
        (
          arg: H256 | string | Uint8Array
        ) => Observable<Vec<ITuple<[u32, u32]>>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>;
      /**
       * The execution phase of the block.
       **/
      executionPhase: AugmentedQuery<
        ApiType,
        () => Observable<Option<FrameSystemPhase>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Total extrinsics count for the current block.
       **/
      extrinsicCount: AugmentedQuery<
        ApiType,
        () => Observable<Option<u32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Extrinsics data for the current block (maps an extrinsic's index to its data).
       **/
      extrinsicData: AugmentedQuery<
        ApiType,
        (arg: u32 | AnyNumber | Uint8Array) => Observable<Bytes>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>;
      /**
       * Whether all inherents have been applied.
       **/
      inherentsApplied: AugmentedQuery<ApiType, () => Observable<bool>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Stores the `spec_version` and `spec_name` of when the last runtime upgrade happened.
       **/
      lastRuntimeUpgrade: AugmentedQuery<
        ApiType,
        () => Observable<Option<FrameSystemLastRuntimeUpgradeInfo>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The current block number being processed. Set by `execute_block`.
       **/
      number: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Hash of the previous block.
       **/
      parentHash: AugmentedQuery<ApiType, () => Observable<H256>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * True if we have upgraded so that AccountInfo contains three types of `RefCount`. False
       * (default) if not.
       **/
      upgradedToTripleRefCount: AugmentedQuery<
        ApiType,
        () => Observable<bool>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * True if we have upgraded so that `type RefCount` is `u32`. False (default) if not.
       **/
      upgradedToU32RefCount: AugmentedQuery<
        ApiType,
        () => Observable<bool>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    timestamp: {
      /**
       * Whether the timestamp has been updated in this block.
       *
       * This value is updated to `true` upon successful submission of a timestamp by a node.
       * It is then checked at the end of each block execution in the `on_finalize` hook.
       **/
      didUpdate: AugmentedQuery<ApiType, () => Observable<bool>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The current time for the current block.
       **/
      now: AugmentedQuery<ApiType, () => Observable<u64>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    transactionPayment: {
      nextFeeMultiplier: AugmentedQuery<ApiType, () => Observable<u128>, []> &
        QueryableStorageEntry<ApiType, []>;
      storageVersion: AugmentedQuery<
        ApiType,
        () => Observable<PalletTransactionPaymentReleases>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    triumvirate: {
      /**
       * The current members of the collective. This is stored sorted (just by value).
       **/
      members: AugmentedQuery<ApiType, () => Observable<Vec<AccountId32>>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The prime member that helps determine the default vote behavior in case of absentations.
       **/
      prime: AugmentedQuery<
        ApiType,
        () => Observable<Option<AccountId32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Proposals so far.
       **/
      proposalCount: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Actual proposal for a given hash, if it's current.
       **/
      proposalOf: AugmentedQuery<
        ApiType,
        (arg: H256 | string | Uint8Array) => Observable<Option<Call>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>;
      /**
       * The hashes of the active proposals.
       **/
      proposals: AugmentedQuery<ApiType, () => Observable<Vec<H256>>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Votes on a given proposal, if it is ongoing.
       **/
      voting: AugmentedQuery<
        ApiType,
        (
          arg: H256 | string | Uint8Array
        ) => Observable<Option<PalletCollectiveVotes>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    triumvirateMembers: {
      /**
       * The current membership, stored as an ordered Vec.
       **/
      members: AugmentedQuery<ApiType, () => Observable<Vec<AccountId32>>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The current prime member, if one exists.
       **/
      prime: AugmentedQuery<
        ApiType,
        () => Observable<Option<AccountId32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
  } // AugmentedQueries
} // declare module

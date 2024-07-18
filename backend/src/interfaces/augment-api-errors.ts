// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/errors';

import type { ApiTypes, AugmentedError } from '@polkadot/api-base/types';

export type __AugmentedError<ApiType extends ApiTypes> =
    AugmentedError<ApiType>;

declare module '@polkadot/api-base/types/errors' {
    interface AugmentedErrors<ApiType extends ApiTypes> {
        adminUtils: {
            /**
             * The maximum number of subnet validators must be more than the current number of UIDs already in the subnet.
             **/
            MaxAllowedUIdsLessThanCurrentUIds: AugmentedError<ApiType>;
            /**
             * The maximum number of subnet validators must be less than the maximum number of allowed UIDs in the subnet.
             **/
            MaxValidatorsLargerThanMaxUIds: AugmentedError<ApiType>;
            /**
             * The subnet does not exist, check the netuid parameter
             **/
            SubnetDoesNotExist: AugmentedError<ApiType>;
            /**
             * Generic error
             **/
            [key: string]: AugmentedError<ApiType>;
        };
        balances: {
            /**
             * Beneficiary account must pre-exist.
             **/
            DeadAccount: AugmentedError<ApiType>;
            /**
             * The delta cannot be zero.
             **/
            DeltaZero: AugmentedError<ApiType>;
            /**
             * Value too low to create account due to existential deposit.
             **/
            ExistentialDeposit: AugmentedError<ApiType>;
            /**
             * A vesting schedule already exists for this account.
             **/
            ExistingVestingSchedule: AugmentedError<ApiType>;
            /**
             * Transfer/payment would kill account.
             **/
            Expendability: AugmentedError<ApiType>;
            /**
             * Balance too low to send value.
             **/
            InsufficientBalance: AugmentedError<ApiType>;
            /**
             * The issuance cannot be modified since it is already deactivated.
             **/
            IssuanceDeactivated: AugmentedError<ApiType>;
            /**
             * Account liquidity restrictions prevent withdrawal.
             **/
            LiquidityRestrictions: AugmentedError<ApiType>;
            /**
             * Number of freezes exceed `MaxFreezes`.
             **/
            TooManyFreezes: AugmentedError<ApiType>;
            /**
             * Number of holds exceed `VariantCountOf<T::RuntimeHoldReason>`.
             **/
            TooManyHolds: AugmentedError<ApiType>;
            /**
             * Number of named reserves exceed `MaxReserves`.
             **/
            TooManyReserves: AugmentedError<ApiType>;
            /**
             * Vesting balance too high to send value.
             **/
            VestingBalance: AugmentedError<ApiType>;
            /**
             * Generic error
             **/
            [key: string]: AugmentedError<ApiType>;
        };
        commitments: {
            /**
             * Account is not allow to make commitments to the chain
             **/
            AccountNotAllowedCommit: AugmentedError<ApiType>;
            /**
             * Account is trying to commit data too fast, rate limit exceeded
             **/
            CommitmentSetRateLimitExceeded: AugmentedError<ApiType>;
            /**
             * Account passed too many additional fields to their commitment
             **/
            TooManyFieldsInCommitmentInfo: AugmentedError<ApiType>;
            /**
             * Generic error
             **/
            [key: string]: AugmentedError<ApiType>;
        };
        grandpa: {
            /**
             * Attempt to signal GRANDPA change with one already pending.
             **/
            ChangePending: AugmentedError<ApiType>;
            /**
             * A given equivocation report is valid but already previously reported.
             **/
            DuplicateOffenceReport: AugmentedError<ApiType>;
            /**
             * An equivocation proof provided as part of an equivocation report is invalid.
             **/
            InvalidEquivocationProof: AugmentedError<ApiType>;
            /**
             * A key ownership proof provided as part of an equivocation report is invalid.
             **/
            InvalidKeyOwnershipProof: AugmentedError<ApiType>;
            /**
             * Attempt to signal GRANDPA pause when the authority set isn't live
             * (either paused or already pending pause).
             **/
            PauseFailed: AugmentedError<ApiType>;
            /**
             * Attempt to signal GRANDPA resume when the authority set isn't paused
             * (either live or already pending resume).
             **/
            ResumeFailed: AugmentedError<ApiType>;
            /**
             * Cannot signal forced change so soon after last.
             **/
            TooSoon: AugmentedError<ApiType>;
            /**
             * Generic error
             **/
            [key: string]: AugmentedError<ApiType>;
        };
        multisig: {
            /**
             * Call is already approved by this signatory.
             **/
            AlreadyApproved: AugmentedError<ApiType>;
            /**
             * The data to be stored is already stored.
             **/
            AlreadyStored: AugmentedError<ApiType>;
            /**
             * The maximum weight information provided was too low.
             **/
            MaxWeightTooLow: AugmentedError<ApiType>;
            /**
             * Threshold must be 2 or greater.
             **/
            MinimumThreshold: AugmentedError<ApiType>;
            /**
             * Call doesn't need any (more) approvals.
             **/
            NoApprovalsNeeded: AugmentedError<ApiType>;
            /**
             * Multisig operation not found when attempting to cancel.
             **/
            NotFound: AugmentedError<ApiType>;
            /**
             * No timepoint was given, yet the multisig operation is already underway.
             **/
            NoTimepoint: AugmentedError<ApiType>;
            /**
             * Only the account that originally created the multisig is able to cancel it.
             **/
            NotOwner: AugmentedError<ApiType>;
            /**
             * The sender was contained in the other signatories; it shouldn't be.
             **/
            SenderInSignatories: AugmentedError<ApiType>;
            /**
             * The signatories were provided out of order; they should be ordered.
             **/
            SignatoriesOutOfOrder: AugmentedError<ApiType>;
            /**
             * There are too few signatories in the list.
             **/
            TooFewSignatories: AugmentedError<ApiType>;
            /**
             * There are too many signatories in the list.
             **/
            TooManySignatories: AugmentedError<ApiType>;
            /**
             * A timepoint was given, yet no multisig operation is underway.
             **/
            UnexpectedTimepoint: AugmentedError<ApiType>;
            /**
             * A different timepoint was given to the multisig operation that is underway.
             **/
            WrongTimepoint: AugmentedError<ApiType>;
            /**
             * Generic error
             **/
            [key: string]: AugmentedError<ApiType>;
        };
        preimage: {
            /**
             * Preimage has already been noted on-chain.
             **/
            AlreadyNoted: AugmentedError<ApiType>;
            /**
             * The user is not authorized to perform this action.
             **/
            NotAuthorized: AugmentedError<ApiType>;
            /**
             * The preimage cannot be removed since it has not yet been noted.
             **/
            NotNoted: AugmentedError<ApiType>;
            /**
             * The preimage request cannot be removed since no outstanding requests exist.
             **/
            NotRequested: AugmentedError<ApiType>;
            /**
             * A preimage may not be removed when there are outstanding requests.
             **/
            Requested: AugmentedError<ApiType>;
            /**
             * Preimage is too large to store on-chain.
             **/
            TooBig: AugmentedError<ApiType>;
            /**
             * Too few hashes were requested to be upgraded (i.e. zero).
             **/
            TooFew: AugmentedError<ApiType>;
            /**
             * More than `MAX_HASH_UPGRADE_BULK_COUNT` hashes were requested to be upgraded at once.
             **/
            TooMany: AugmentedError<ApiType>;
            /**
             * Generic error
             **/
            [key: string]: AugmentedError<ApiType>;
        };
        proxy: {
            /**
             * Account is already a proxy.
             **/
            Duplicate: AugmentedError<ApiType>;
            /**
             * Call may not be made by proxy because it may escalate its privileges.
             **/
            NoPermission: AugmentedError<ApiType>;
            /**
             * Cannot add self as proxy.
             **/
            NoSelfProxy: AugmentedError<ApiType>;
            /**
             * Proxy registration not found.
             **/
            NotFound: AugmentedError<ApiType>;
            /**
             * Sender is not a proxy of the account to be proxied.
             **/
            NotProxy: AugmentedError<ApiType>;
            /**
             * There are too many proxies registered or too many announcements pending.
             **/
            TooMany: AugmentedError<ApiType>;
            /**
             * Announcement, if made at all, was made too recently.
             **/
            Unannounced: AugmentedError<ApiType>;
            /**
             * A call which is incompatible with the proxy type's filter was attempted.
             **/
            Unproxyable: AugmentedError<ApiType>;
            /**
             * Generic error
             **/
            [key: string]: AugmentedError<ApiType>;
        };
        registry: {
            /**
             * Account attempted to register an identity but does not meet the requirements.
             **/
            CannotRegister: AugmentedError<ApiType>;
            /**
             * Account doesn't have a registered identity
             **/
            NotRegistered: AugmentedError<ApiType>;
            /**
             * Account passed too many additional fields to their identity
             **/
            TooManyFieldsInIdentityInfo: AugmentedError<ApiType>;
            /**
             * Generic error
             **/
            [key: string]: AugmentedError<ApiType>;
        };
        scheduler: {
            /**
             * Failed to schedule a call
             **/
            FailedToSchedule: AugmentedError<ApiType>;
            /**
             * Attempt to use a non-named function on a named task.
             **/
            Named: AugmentedError<ApiType>;
            /**
             * Cannot find the scheduled call.
             **/
            NotFound: AugmentedError<ApiType>;
            /**
             * Reschedule failed because it does not change scheduled time.
             **/
            RescheduleNoChange: AugmentedError<ApiType>;
            /**
             * Given target block number is in the past.
             **/
            TargetBlockNumberInPast: AugmentedError<ApiType>;
            /**
             * Generic error
             **/
            [key: string]: AugmentedError<ApiType>;
        };
        senateMembers: {
            /**
             * Already a member.
             **/
            AlreadyMember: AugmentedError<ApiType>;
            /**
             * Not a member.
             **/
            NotMember: AugmentedError<ApiType>;
            /**
             * Too many members.
             **/
            TooManyMembers: AugmentedError<ApiType>;
            /**
             * Generic error
             **/
            [key: string]: AugmentedError<ApiType>;
        };
        subtensorModule: {
            /**
             * All subnets are in the immunity period.
             **/
            AllNetworksInImmunity: AugmentedError<ApiType>;
            /**
             * The caller is trying to add stake, but for some reason the requested amount could not be withdrawn from the coldkey account.
             **/
            BalanceWithdrawalError: AugmentedError<ApiType>;
            /**
             * Can not set weights for the root network.
             **/
            CanNotSetRootNetworkWeights: AugmentedError<ApiType>;
            /**
             * Attemtping to commit/reveal weights when disabled.
             **/
            CommitRevealDisabled: AugmentedError<ApiType>;
            /**
             * Attempting to call set_weights when commit/reveal is enabled
             **/
            CommitRevealEnabled: AugmentedError<ApiType>;
            /**
             * Delegate take is too high.
             **/
            DelegateTakeTooHigh: AugmentedError<ApiType>;
            /**
             * Delegate take is too low.
             **/
            DelegateTakeTooLow: AugmentedError<ApiType>;
            /**
             * A transactor exceeded the rate limit for delegate transaction.
             **/
            DelegateTxRateLimitExceeded: AugmentedError<ApiType>;
            /**
             * The caller is attempting to set weights with duplicate UIDs in the weight matrix.
             **/
            DuplicateUids: AugmentedError<ApiType>;
            /**
             * Faucet is disabled.
             **/
            FaucetDisabled: AugmentedError<ApiType>;
            /**
             * The hotkey does not exists
             **/
            HotKeyAccountNotExists: AugmentedError<ApiType>;
            /**
             * The hotkey is attempting to become a delegate when the hotkey is already a delegate.
             **/
            HotKeyAlreadyDelegate: AugmentedError<ApiType>;
            /**
             * The caller is requesting registering a neuron which already exists in the active set.
             **/
            HotKeyAlreadyRegisteredInSubNet: AugmentedError<ApiType>;
            /**
             * The hotkey is not a delegate and the signer is not the owner of the hotkey.
             **/
            HotKeyNotDelegateAndSignerNotOwnHotKey: AugmentedError<ApiType>;
            /**
             * The hotkey is not registered in any subnet.
             **/
            HotKeyNotRegisteredInNetwork: AugmentedError<ApiType>;
            /**
             * The hotkey is not registered in subnet
             **/
            HotKeyNotRegisteredInSubNet: AugmentedError<ApiType>;
            /**
             * A transactor exceeded the rate limit for setting or swapping hotkey.
             **/
            HotKeySetTxRateLimitExceeded: AugmentedError<ApiType>;
            /**
             * A validator is attempting to set weights from a validator with incorrect weight version.
             **/
            IncorrectWeightVersionKey: AugmentedError<ApiType>;
            /**
             * The supplied PoW hash block does not meet the network difficulty.
             **/
            InvalidDifficulty: AugmentedError<ApiType>;
            /**
             * An invalid IP address is passed to the serve function.
             **/
            InvalidIpAddress: AugmentedError<ApiType>;
            /**
             * The user is trying to serve an axon which is not of type 4 (IPv4) or 6 (IPv6).
             **/
            InvalidIpType: AugmentedError<ApiType>;
            /**
             * An invalid port is passed to the serve function.
             **/
            InvalidPort: AugmentedError<ApiType>;
            /**
             * Committed hash does not equal the hashed reveal data.
             **/
            InvalidRevealCommitHashNotMatch: AugmentedError<ApiType>;
            /**
             * Not the correct block/range to reveal weights.
             **/
            InvalidRevealCommitTempo: AugmentedError<ApiType>;
            /**
             * The supplied PoW hash seal does not match the supplied work.
             **/
            InvalidSeal: AugmentedError<ApiType>;
            /**
             * The supplied PoW hash block is in the future or negative.
             **/
            InvalidWorkBlock: AugmentedError<ApiType>;
            /**
             * The dispatch is attempting to set weights on chain with weight value exceeding the MaxWeightLimit (max_weight_limit subnet hyperparameter).
             **/
            MaxWeightExceeded: AugmentedError<ApiType>;
            /**
             * A transactor exceeded the rate limit for add network transaction.
             **/
            NetworkTxRateLimitExceeded: AugmentedError<ApiType>;
            /**
             * The caller is attempting to set non-self weights without being a permitted validator.
             **/
            NeuronNoValidatorPermit: AugmentedError<ApiType>;
            /**
             * The new hotkey is the same as old one
             **/
            NewHotKeyIsSameWithOld: AugmentedError<ApiType>;
            /**
             * Stake amount below the minimum threshold for nominator validations.
             **/
            NomStakeBelowMinimumThreshold: AugmentedError<ApiType>;
            /**
             * Request to stake, unstake or subscribe is made by a coldkey that is not associated with the hotkey account.
             **/
            NonAssociatedColdKey: AugmentedError<ApiType>;
            /**
             * No neuron ID is available.
             **/
            NoNeuronIdAvailable: AugmentedError<ApiType>;
            /**
             * Not enough balance to pay swapping hotkey.
             **/
            NotEnoughBalanceToPaySwapHotKey: AugmentedError<ApiType>;
            /**
             * The caller is requesting adding more stake than there exists in the coldkey account. See: "[add_stake()]"
             **/
            NotEnoughBalanceToStake: AugmentedError<ApiType>;
            /**
             * The caller is requesting to set weights but the caller has less than minimum stake required to set weights (less than WeightsMinStake).
             **/
            NotEnoughStakeToSetWeights: AugmentedError<ApiType>;
            /**
             * The caller is requesting removing more stake than there exists in the staking account. See: "[remove_stake()]".
             **/
            NotEnoughStakeToWithdraw: AugmentedError<ApiType>;
            /**
             * Netuid does not match for setting root network weights.
             **/
            NotRootSubnet: AugmentedError<ApiType>;
            /**
             * A hotkey is attempting to do something only senate members can do.
             **/
            NotSenateMember: AugmentedError<ApiType>;
            /**
             * Not a subnet owner.
             **/
            NotSubnetOwner: AugmentedError<ApiType>;
            /**
             * No commit found for the provided hotkey+netuid combination when attempting to reveal the weights.
             **/
            NoWeightsCommitFound: AugmentedError<ApiType>;
            /**
             * Operation is not permitted on the root subnet.
             **/
            RegistrationNotPermittedOnRootSubnet: AugmentedError<ApiType>;
            /**
             * The root network does not exist.
             **/
            RootNetworkDoesNotExist: AugmentedError<ApiType>;
            /**
             * An axon or prometheus serving exceeded the rate limit for a registered neuron.
             **/
            ServingRateLimitExceeded: AugmentedError<ApiType>;
            /**
             * The hotkey is attempting to set weights twice within the duration of net_tempo/2 blocks.
             **/
            SettingWeightsTooFast: AugmentedError<ApiType>;
            /**
             * A transactor exceeded the rate limit for staking.
             **/
            StakeRateLimitExceeded: AugmentedError<ApiType>;
            /**
             * A hotkey with too little stake is attempting to join the root subnet.
             **/
            StakeTooLowForRoot: AugmentedError<ApiType>;
            /**
             * Stake amount to withdraw is zero.
             **/
            StakeToWithdrawIsZero: AugmentedError<ApiType>;
            /**
             * Registration is disabled.
             **/
            SubNetRegistrationDisabled: AugmentedError<ApiType>;
            /**
             * The subnet does not exist.
             **/
            SubNetworkDoesNotExist: AugmentedError<ApiType>;
            /**
             * Number of registrations in this block exceeds the allowed number (i.e., exceeds the subnet hyperparameter "max_regs_per_block").
             **/
            TooManyRegistrationsThisBlock: AugmentedError<ApiType>;
            /**
             * The number of registration attempts exceeded the allowed number in the interval.
             **/
            TooManyRegistrationsThisInterval: AugmentedError<ApiType>;
            /**
             * The hotkey is required to be the origin.
             **/
            TransactorAccountShouldBeHotKey: AugmentedError<ApiType>;
            /**
             * The caller is attempting to set weights with more UIDs than allowed.
             **/
            UidsLengthExceedUidsInSubNet: AugmentedError<ApiType>;
            /**
             * The caller is attempting to set weight to at least one UID that does not exist in the metagraph.
             **/
            UidVecContainInvalidOne: AugmentedError<ApiType>;
            /**
             * A transactor exceeded the rate limit for unstaking.
             **/
            UnstakeRateLimitExceeded: AugmentedError<ApiType>;
            /**
             * Not allowed to commit weights.
             **/
            WeightsCommitNotAllowed: AugmentedError<ApiType>;
            /**
             * The dispatch is attempting to set weights on chain with fewer elements than are allowed.
             **/
            WeightVecLengthIsLow: AugmentedError<ApiType>;
            /**
             * The caller is attempting to set the weight keys and values but these vectors have different size.
             **/
            WeightVecNotEqualSize: AugmentedError<ApiType>;
            /**
             * Unsuccessfully withdraw, balance could be zero (can not make account exist) after withdrawal.
             **/
            ZeroBalanceAfterWithdrawn: AugmentedError<ApiType>;
            /**
             * Generic error
             **/
            [key: string]: AugmentedError<ApiType>;
        };
        sudo: {
            /**
             * Sender must be the Sudo account.
             **/
            RequireSudo: AugmentedError<ApiType>;
            /**
             * Generic error
             **/
            [key: string]: AugmentedError<ApiType>;
        };
        system: {
            /**
             * The origin filter prevent the call to be dispatched.
             **/
            CallFiltered: AugmentedError<ApiType>;
            /**
             * Failed to extract the runtime version from the new runtime.
             *
             * Either calling `Core_version` or decoding `RuntimeVersion` failed.
             **/
            FailedToExtractRuntimeVersion: AugmentedError<ApiType>;
            /**
             * The name of specification does not match between the current runtime
             * and the new runtime.
             **/
            InvalidSpecName: AugmentedError<ApiType>;
            /**
             * A multi-block migration is ongoing and prevents the current code from being replaced.
             **/
            MultiBlockMigrationsOngoing: AugmentedError<ApiType>;
            /**
             * Suicide called when the account has non-default composite data.
             **/
            NonDefaultComposite: AugmentedError<ApiType>;
            /**
             * There is a non-zero reference count preventing the account from being purged.
             **/
            NonZeroRefCount: AugmentedError<ApiType>;
            /**
             * No upgrade authorized.
             **/
            NothingAuthorized: AugmentedError<ApiType>;
            /**
             * The specification version is not allowed to decrease between the current runtime
             * and the new runtime.
             **/
            SpecVersionNeedsToIncrease: AugmentedError<ApiType>;
            /**
             * The submitted code is not authorized.
             **/
            Unauthorized: AugmentedError<ApiType>;
            /**
             * Generic error
             **/
            [key: string]: AugmentedError<ApiType>;
        };
        triumvirate: {
            /**
             * Duplicate proposals not allowed
             **/
            DuplicateProposal: AugmentedError<ApiType>;
            /**
             * Duplicate vote ignored
             **/
            DuplicateVote: AugmentedError<ApiType>;
            /**
             * The given motion duration for the proposal was too low.
             **/
            DurationLowerThanConfiguredMotionDuration: AugmentedError<ApiType>;
            /**
             * Index mismatched the proposal hash
             **/
            IndexMismatchProposalHash: AugmentedError<ApiType>;
            /**
             * Account is not a member of collective
             **/
            NotMember: AugmentedError<ApiType>;
            /**
             * The given length-bound for the proposal was too low.
             **/
            ProposalLengthBoundLessThanProposalLength: AugmentedError<ApiType>;
            /**
             * Proposal must exist
             **/
            ProposalNotExists: AugmentedError<ApiType>;
            /**
             * The given weight-bound for the proposal was too low.
             **/
            ProposalWeightLessThanDispatchCallWeight: AugmentedError<ApiType>;
            /**
             * The call to close the proposal was made too early, before the end of the voting
             **/
            TooEarlyToCloseProposal: AugmentedError<ApiType>;
            /**
             * There can only be a maximum of `MaxProposals` active proposals.
             **/
            TooManyActiveProposals: AugmentedError<ApiType>;
            /**
             * Generic error
             **/
            [key: string]: AugmentedError<ApiType>;
        };
        triumvirateMembers: {
            /**
             * Already a member.
             **/
            AlreadyMember: AugmentedError<ApiType>;
            /**
             * Not a member.
             **/
            NotMember: AugmentedError<ApiType>;
            /**
             * Too many members.
             **/
            TooManyMembers: AugmentedError<ApiType>;
            /**
             * Generic error
             **/
            [key: string]: AugmentedError<ApiType>;
        };
        utility: {
            /**
             * Too many calls batched.
             **/
            TooManyCalls: AugmentedError<ApiType>;
            /**
             * Generic error
             **/
            [key: string]: AugmentedError<ApiType>;
        };
    } // AugmentedErrors
} // declare module

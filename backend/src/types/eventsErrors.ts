import { ethers } from 'ethers';

export interface EventBase {}

export interface Redeemed extends EventBase {
    ethAddress: string;
    sTaoTotalAmount: bigint;
    sTaoTaxed: bigint;
    sTaoBurned: bigint;
    taoToUser: bigint;
    lastTimeUpdated: bigint;
}

export interface Staked extends EventBase {
    to: string;
    bittensorWallet: string;
    totalAmountStaked: bigint;
    amountTaxed: bigint;
    amountToUser: bigint;
    lastTimeUpdated: bigint;
}

export interface ProtocolVaultTransfer extends EventBase {
    from: string;
    to: string;
    amount: bigint;
}

export interface ProtcolTaxData extends EventBase {
    tax: bigint;
    enabled: boolean;
}

export interface PoolBasisPointsUpdated extends EventBase {
    latestStats: {
        lastLastRedeemBasisPoints: bigint;
        lastRedeemBasisPoints: bigint;
        redeemBasisPoints: bigint;
        stakeBasisPoints: bigint;
        updateTime: bigint;
    };
}

export interface NotEnoughSTao extends EventBase {
    amount: bigint;
    sTaoAmount: bigint;
    wallet: string;
}

export interface InsignificantAmountOfTao extends EventBase {
    amount: bigint;
}

export interface BittensorWalletInvalidLength extends EventBase {
    wallet: string;
}

export interface InvalidNegativeValue extends EventBase {
    value: bigint;
}

export interface InvalidTaxValue extends EventBase {
    value: bigint;
}

export interface NotEnoughTimePassed extends EventBase {
    time: bigint;
}

export interface IncorrectSignatureSize extends EventBase {
    signature: string;
}

export interface IncorrectTaoAddrSize extends EventBase {
    taoAddr: string;
}

export interface NegativeStakingRewards extends EventBase {
    newBasisPoints: bigint;
}

export type EventMap = {
    Redeemed: Redeemed;
    Staked: Staked;
    ProtocolVaultTransfer: ProtocolVaultTransfer;
    ProtcolTaxData: ProtcolTaxData;
    PoolBasisPointsUpdated: PoolBasisPointsUpdated;
    NotEnoughSTao: NotEnoughSTao;
    InsignificantAmountOfTao: InsignificantAmountOfTao;
    BittensorWalletInvalidLength: BittensorWalletInvalidLength;
    InvalidNegativeValue: InvalidNegativeValue;
    InvalidTaxValue: InvalidTaxValue;
    NotEnoughTimePassed: NotEnoughTimePassed;
    IncorrectSignatureSize: IncorrectSignatureSize;
    IncorrectTaoAddrSize: IncorrectTaoAddrSize;
    NegativeStakingRewards: NegativeStakingRewards;
};

export type EventTypeNames = keyof EventMap;
export type EventTypes = EventMap[EventTypeNames];

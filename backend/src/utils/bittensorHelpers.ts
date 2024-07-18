import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { decorateConstants } from '@polkadot/types';
import { stringToU8a, u8aToHex } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';
import dotenv from 'dotenv';
import '../interfaces/augment-api';

dotenv.config();

export function generateKeyrings(keyring: Keyring) {
    keyring.addFromUri('//Alice');
    keyring.addFromUri('//Bob');
    keyring.addFromUri('//Charlie');
    keyring.addFromUri('//Dave');
    keyring.addFromUri('//Eve');
}

export function generateNewKeyrings(
    keyring: Keyring,
    numberOfKeyrings: number
) {
    for (let i = 0; i < numberOfKeyrings; i++) {
        keyring.addFromUri('//Alice');
    }
}

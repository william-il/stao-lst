import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { decorateConstants } from '@polkadot/types';
import { stringToU8a, u8aToHex } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';
import dotenv from 'dotenv';
import '../interfaces/augment-api';

dotenv.config();

const testKeyring = new Keyring({ type: 'sr25519', ss58Format: 13116 });
export const bittensorData = {
    wsProvider: process.env.BITTENSOR_WS_PROVIDER,
    keyring: testKeyring,
    keypairs: [
        testKeyring.createFromUri('//Alice'),
        testKeyring.createFromUri('//Bob'),
        testKeyring.createFromUri('//Charlie'),
        testKeyring.createFromUri('//Dave'),
        testKeyring.createFromUri('//Eve'),
        testKeyring.createFromUri('//Ferdie'),
        testKeyring.createFromUri('//Grace'),
    ],
    keypairsName: {
        Alice: testKeyring.createFromUri('//Alice'),
        Bob: testKeyring.createFromUri('//Bob'),
        Charlie: testKeyring.createFromUri('//Charlie'),
        Dave: testKeyring.createFromUri('//Dave'),
        Eve: testKeyring.createFromUri('//Eve'),
        Ferdie: testKeyring.createFromUri('//Ferdie'),
        Grace: testKeyring.createFromUri('//Grace'),
    },
};

export default bittensorData;

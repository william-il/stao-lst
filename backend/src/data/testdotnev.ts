import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { decorateConstants } from '@polkadot/types';
import { stringToU8a, u8aToHex } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';
import dotenv from 'dotenv';
import '../interfaces/augment-api';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function main() {
  console.log(process.env.BITTENSOR_WS_PROVIDER);
}

main();

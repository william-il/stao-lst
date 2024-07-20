import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { decorateConstants } from '@polkadot/types';
import { stringToU8a, u8aToHex } from '@polkadot/util';
import {
  mnemonicValidate,
  signatureVerify,
  cryptoWaitReady,
} from '@polkadot/util-crypto';
import dotenv from 'dotenv';
import '../interfaces/augment-api';
import bitData from '../data/bitData';
import { appendFileSync } from 'fs';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function main() {
  await cryptoWaitReady();
  const wsProvider = new WsProvider(process.env.BITTENSOR_WS_PROVIDER);
  const api = await ApiPromise.create({ provider: wsProvider });

  const keyring = await new Keyring({ type: 'sr25519' });
  keyring.addFromUri('//Alice');
  keyring.addFromUri('//Bob');
  keyring.addFromUri('//Charlie');
  keyring.addFromUri('//Dave');
  keyring.addFromUri('//Eve');
  keyring.addFromUri('//Ferdie');
  console.log('keyring', keyring.getPairs()[1].address);
  console.log(
    (await api.query.balances.account(keyring.getPairs()[1].address)).toHuman()
  );
  const balances = await api.query.subtensorModule.console; // console.log('keyring', keyring);
  console.log(
    keyring.getPairs().forEach((pair, index) => {
      console.log(pair.address);
      //console.log(pair);
      /*
            console.log(pair.address);
            console.log('pair publicKey: ', pair.publicKey);
            console.log('pair toJson with addr', pair.toJson().address);
            */
    })
  );
  const arrayKeys = keyring.getPairs();
  for (let i = 0; i < arrayKeys.length; i++) {
    console.log(arrayKeys[i].address);
  }
}

main();

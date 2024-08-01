import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { decorateConstants } from '@polkadot/types';
import { stringToU8a, u8aToHex } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';
import bitData from '../random/bitData';
import dotenv from 'dotenv';
import '@polkadot/keyring';
import '../interfaces/augment-api';
import {
  mnemonicGenerate,
  mnemonicToMiniSecret,
  randomAsHex,
} from '@polkadot/util-crypto';
import { SubmittableExtrinsic } from '@polkadot/api-base/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { AccountInfo } from '@polkadot/types/interfaces';
import { KeyringPair } from '@polkadot/keyring/types';
import coldKeys, { hotKeys } from '../data/bittensorTestWallets';
import EthKey from '../types/EthKey';
export default class KeyringUtils {
  public keyring: Keyring;
  public delegatesList: string[];
  public keyringPairs: KeyringPair[];
  public keyringAddresses: string[];

  constructor(keyring: Keyring, additionalRings?: number) {
    this.keyring = keyring;
    this.generateKeyrings(this.keyring);
    if (additionalRings !== undefined) {
      this.generateAdditionalKeyrings(this.keyring, additionalRings);
    }
    this.delegatesList = [];
    this.keyringPairs = [];
    this.keyringAddresses = [];
    hotKeys.forEach(({ name, hotkey }) => {
      this.delegatesList.push(hotkey);
    });
    this.setPairs();
  }

  public generateKeyrings(keyring: Keyring) {
    keyring.addFromUri('//Alice', { name: 'Alice' });
    keyring.addFromUri('//Bob', { name: 'Bob' });
    keyring.addFromUri('//Charlie', { name: 'Charlie' });
    keyring.addFromUri('//Dave', { name: 'Dave' });
    keyring.addFromUri('//Eve', { name: 'Eve' });
    keyring.addFromUri('//Ferdie', { name: 'Ferdie' });
  }
  public generateAdditionalKeyrings(
    keyring: Keyring,
    numberToGenerate: number
  ) {
    console.log('Generating key pairs...');
    for (let i = 0; i < numberToGenerate; i++) {
      const mnemonic = mnemonicGenerate();
      keyring.addFromMnemonic(mnemonic, { name: i.toString() });
    }
    console.log(`${numberToGenerate}, Key pairs generated.`);
  }
  public setPairs() {
    this.keyring.getPairs().forEach((pair) => {
      this.keyringPairs.push(pair);
      this.keyringAddresses.push(pair.address);
    });
  }

  public signMessage(
    keyringPair: KeyringPair,
    message: string | Uint8Array
  ): Uint8Array {
    console.log(
      `KeyringPair: ${keyringPair.address} signing message: ${message}`
    );
    return keyringPair.sign(message);
  }

  public signMessageAsHex(
    keyringPair: KeyringPair,
    message: string | Uint8Array,
    log: boolean = false
  ): string {
    if (log) {
      console.log(
        `KeyringPair: ${keyringPair.address} signing message: ${message}`
      );
    }
    return u8aToHex(keyringPair.sign(message));
  }

  public verifyMessage(
    message: string | Uint8Array,
    signature: string | Uint8Array,
    publicAddress: string | Uint8Array,
    log: boolean = false
  ) {
    const { isValid } = signatureVerify(message, signature, publicAddress);
    if (log) {
      if (signature instanceof Uint8Array) {
        console.log(
          `${u8aToHex(signature)} is ${isValid ? 'valid' : 'invalid'}`
        );
      } else {
        console.log(`${signature} is ${isValid ? 'valid' : 'invalid'}`);
      }
    }
    return isValid;
  }

  public findValidEthAddressInEthKeys(
    ethKeys: EthKey[],
    publicAddress: string | Uint8Array,
    log: boolean = false
  ) {
    let foundIndex = 0;
    let foundAddress = '';
    let foundSignature: string = '';
    ethKeys.forEach(({ address, signature }, index) => {
      if (
        this.verifyMessage(address, signature, publicAddress) &&
        index >= foundIndex
      ) {
        foundAddress = address;
        foundSignature = signature;
        foundIndex = index;
        if (log) {
          console.log(
            `\n Found valid address: ${foundAddress} with signature: \n ${foundSignature} at index ${foundIndex}`
          );
        }
      } else {
        if (log) {
          console.log(
            `\n Invalid address: ${address} with signature: \n ${signature} at index ${index}`
          );
        }
      }
    });
    if (foundAddress === '' || foundSignature.length === 0) {
      console.error("Couldn't find a valid message/signature pair");
      return false;
    } else {
      return { address: foundAddress, signature: foundSignature };
    }
  }

  public ethKeyFormat() {}
}

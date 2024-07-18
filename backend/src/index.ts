import '@polkadot/wasm-crypto/initWasmAsm';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { ethers } from 'ethers';
import BittensorTestUtils from './processors/BittensorTestUtils';
import EthersTestUtils from './processors/EthersTestUtils';
import IntegratedSystem from './processors/IntegratedSystem';
import dotenv from 'dotenv';

dotenv.config();
async function main() {
    const tempWsProvider = new WsProvider('ws://localhost:9945');
    const tempApi = await ApiPromise.create({ provider: tempWsProvider });
    const tempKeyring = new Keyring({ type: 'sr25519' });

    const bittensorModule = new BittensorTestUtils(
        tempApi,
        tempWsProvider,
        tempKeyring,
        10
    );
    const ethereumModule = new EthersTestUtils();

    const keyringAddress = bittensorModule.keyringAddresses;
    const keyringPairs = bittensorModule.keyringPairs;
    const ethereumWallets = ethereumModule.signers;

    const integratedSystem = new IntegratedSystem(
        bittensorModule,
        ethereumModule
    );

    console.log('Testing the integrated system...');
    await integratedSystem.start();

    console.log(`\nAddingAnEthKey...`);
    //first add a valid ethKey to the contract. also pretend im a power user
    const aliceSignature = await bittensorModule.signMessageAsHex(
        keyringPairs[0],
        ethereumWallets[0].address,
        true
    );
    await ethereumModule
        .addEthKeyAccount(
            ethereumWallets[0],
            keyringAddress[0],
            ethereumWallets[0].address,
            aliceSignature,
            true
        )
        .then(async () => {
            await bittensorModule.sendTransactionSecure(
                keyringPairs[0],
                keyringPairs[6],
                BigInt(107e8),
                true
            );
        });
}

main().catch(console.error);

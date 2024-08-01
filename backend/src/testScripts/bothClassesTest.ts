import { ethers } from 'ethers';
import { sTaoData } from '../data/ethData';
import EthersTestUtils from '../processors/EthersTestUtils';
import testSigners from '../data/testWallets';
import { ApiPromise, WsProvider } from '@polkadot/api';
import BittensorTestUtils from '../processors/BittensorTestUtils';
import ethWallets from '../data/testWallets';
import { _0n, stringToU8a, u8aToHex, u8aToString } from '@polkadot/util';
import { Keyring } from '@polkadot/keyring';
// important this needs to be done before any `@polkadot/util-crypto` operations
//import '@polkadot/wasm-crypto/initWasmAsm';

async function main() {
  const wsProviderTemp = new WsProvider(process.env.BITTENSOR_WS_PROVIDER);
  console.log(process.env.BITTENSOR_WS_PROVIDER);
  const apiTemp = await ApiPromise.create({ provider: wsProviderTemp });
  let keyringTemp = new Keyring({ type: 'sr25519' });

  const bittensorModule = new BittensorTestUtils(
    apiTemp,
    wsProviderTemp,
    keyringTemp,
  );


  const ethersClass = new EthersTestUtils();

  const etherWallets = ethersClass.signers;
  const key = keyringTemp.addFromUri('//Owner');
  console.log(key.address);
}
/*
    console.log('\n Creating some eth keys....');

    let ethKeys: { taoWallet: string; address: string; signature: string }[] =
        [];
    etherWallets.forEach((wallet) => {
        const obj = {
            taoWallet: keyringPairs[0].address,
            address: wallet.address,
            signature: keyringUtils.signMessageAsHex(
                keyringPairs[0],
                wallet.address
            ),
        };
        ethKeys.push(obj);
    });

    const totalInStake =
        await bittensorModule.api.query.subtensorModule.totalColdkeyStake(
            bittensorModule.keyringPairs[6].address
        );
    console.log(totalInStake.toBigInt());
    const totalSupply = await ethersClass.contract.totalSupply();
    console.log(totalSupply);
    const taoInColdKey = (
        await bittensorModule.getSingularBalance(
            bittensorModule.keyringPairs[6]
        )
    ).data.free.toBigInt();
    console.log(taoInColdKey);

    */
/*823 902
       823 902 567 941 101n
42 100 975 651 937 187 453n
    if (ethKeys.length) {
        await ethersClass.addEthKeyAccount(
            etherWallets[0],
            ethKeys[0].taoWallet,
            ethKeys[0].address,
            ethKeys[0].signature
        );
        await ethersClass.addEthKeyAccount(
            etherWallets[0],
            ethKeys[0].taoWallet,
            ethKeys[2].address,
            ethKeys[0].signature
        );
        await ethersClass.addEthKeyAccount(
            etherWallets[0],
            ethKeys[0].taoWallet,
            ethKeys[0].address,
            ethKeys[2].signature
        );
    }
    */

/*
    console.log(await ethersClass.provider.getBalance(etherWallets[0].address));
    const tao1Mapping = await ethersClass.retrieveEthKeyAccount(
        ethKeys[0].taoWallet
    );

    console.log(tao1Mapping);
    console.log(
        keyringUtils.findValidEthAddressInEthKeys(
            tao1Mapping,
            ethKeys[0].taoWallet,
            true
        )
    );
    console.log(ethKeys[0].taoWallet);
*/
// lets create some tao accounts
// the mapping looks like this:
// taoAddress => [{ethAddress, signature of signed ethAddress}]
// so this means we must have a string version of:
// tao address, eth address, and the signature of the eth address.

main();

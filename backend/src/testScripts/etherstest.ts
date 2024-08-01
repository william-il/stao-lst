import { ethers } from 'ethers';
import data, { sTaoData } from '../data/ethData';
import dotenv from 'dotenv';
import { EventEmitter } from 'events';
import { ErrorDecoder, ErrorType } from 'ethers-decode-error';
import { Redeemed } from '../random/eventsErrors';
import {
  EventBase,
  EventTypeNames,
  EventTypes,
  EventMap,
} from '../random/eventsErrors';
const provider = new ethers.JsonRpcProvider(process.env.HARDHAT_RPC);
const sTAOContract = new ethers.Contract(data.address, data.abi, provider);
const minterSigner = new ethers.Wallet(data.minterPK, provider);
const sTAOContractSigner = new ethers.Contract(
  data.address,
  data.abi,
  minterSigner
);
const poolTaxSigner = new ethers.Wallet(data.poolTaxRolePK, provider);
const sTAOContractPoolTax = new ethers.Contract(
  data.address,
  data.abi,
  poolTaxSigner
);
const ints: bigint = 100000000000n;
async function main() {
  const errorDecoder = ErrorDecoder.create([data.abi]);
  //console.log(await provider.getBlock(2));
  //console.log(await provider.getCode(data.address));
  //console.log(await sTAOContract.decimals());
  console.log('start');
  const transact: ethers.ContractTransactionResponse =
    await sTAOContractSigner.stakeSTao(
      '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      BigInt(100e18),
      '5DLv1jmtwHBBGEhGbVaXrK4dXzjv2vKi8UvjU11wKDsF5XBg'
    );
  const transact2 = await transact.wait();
  //console.log(transact);
  console.log('TEST TRANSACT \n \n \n');
  /*
    const logArr = transact2?.logs.filter((log): log is ethers.EventLog => {
        if (log instanceof ethers.EventLog) {
            return log.eventName === 'Staked';
        } else {
            return false;
        }
    });
    */
  const logArr = emitTransactionReciptEvent(transact2, 'Staked');
  console.log(logArr);
  //const loggedArr = eventArgsIntoInteface(logArr, 'Staked');
  console.log('test');
  // console.log(await loggedArr.lastTimeUpdated);
  // console.log(await sTAOContractSigner.stakeSTao("0xcd3B766CCDd6AE721141F452C550Ca635964ce71", 120, "5DLv1jmtwHBBGEhGbVaXrK4dXzjv2vKi8UvjU11wKDsF5XBg"));
  //console.log(await sTAOContract.balanceOf("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"));
  const issue = await sTAOContract.POOL_TAX_ROLE();
  console.log(
    await sTAOContractPoolTax.hasRole(
      issue,
      '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65'
    )
  );
  let redeembasis = BigInt(await sTAOContract.redeemBasisPoints());

  console.log('Sending first transaction...');
  redeembasis = redeembasis + BigInt(10e18);
  let tx =
    await sTAOContractPoolTax.setStakingRedeemingBasisPointsWithPoints(
      redeembasis
    );
  console.log(await sTAOContract.redeemBasisPoints());
  await tx.wait();
  console.log('First transaction completed');

  // Second transaction
  console.log('Sending second transaction...');
  redeembasis = redeembasis + BigInt(10e18);
  tx =
    await sTAOContractPoolTax.setStakingRedeemingBasisPointsWithPoints(
      redeembasis
    );
  console.log(await sTAOContract.redeemBasisPoints());
  await tx.wait();
  console.log('Second transaction completed');

  // Third transaction
  console.log('Sending third transaction...');
  redeembasis = redeembasis + BigInt(10e18);
  tx =
    await sTAOContractPoolTax.setStakingRedeemingBasisPointsWithPoints(
      redeembasis
    );
  console.log(await sTAOContract.redeemBasisPoints());
  await tx.wait();
  console.log('Third transaction completed');

  console.log(
    'set the redeeming rewards here are stats: \n' +
      (await sTAOContract.redeemBasisPoints()) +
      '\n' +
      (await sTAOContract.lastRedeemBasisPoints()) +
      '\n' +
      (await sTAOContract.lastLastRedeemBasisPoints())
  );
  /*
    Account #19: 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199 (10000 ETH)
    Private Key: 0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e
    Account #14: 0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097 (10000 ETH)
    Private Key: 0xc526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aaa

    Account #15: 0xcd3B766CCDd6AE721141F452C550Ca635964ce71 (10000 ETH)
    Private Key: 0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61

    Account #16: 0x2546BcD3c84621e976D8185a91A922aE77ECEc30 (10000 ETH)
    Private Key: 0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0
    */
  const walletSinger = new ethers.Wallet(
    '0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e',
    provider
  );
  const redeemerContractSigner = (await sTAOContractSigner.connect(
    walletSinger
  )) as ethers.Contract;
  let sTAOAmount = await redeemerContractSigner.balanceOf(walletSinger.address);
  console.log(sTAOAmount);
  const filter = sTAOContract.filters.Redeemed(
    '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199'
  );

  while (true) {
    console.log(
      'Draining wallet, current amount: ' +
        (await sTAOContract.balanceOf(walletSinger.address))
    );
    try {
      const tx = await redeemerContractSigner.redeemSTao(
        '5DLv1jmtwHBBGEhGbVaXrK4dXzjv2vKi8UvjU11wKDsF5XBg',
        BigInt(50e18)
      );
      // console.log(tx);
      await tx.wait();
      // console.log('TEST');
      // console.log(await tx.wait());
    } catch (error) {
      const deErr = await errorDecoder.decode(error);
      console.log('revert reason:', deErr.reason);
      console.log(deErr.args[0]);
      console.log(deErr.args[1]);
      console.log(deErr.args[2]);
      console.log(deErr.type === ErrorType.RevertError);
      break;
    }
    console.log('bal: ', await sTAOContract.balanceOf(walletSinger.address));
  }
  /*   const maps = await batchQueriedEvents(
    sTAOContract,
    0,
    'latest',
    filter,
    true
  );
  console.log(maps);
  await batchEvents(); */
}
function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function batchEvents() {
  const filter = sTAOContract.filters.Redeemed(
    '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199'
  );
  const lastEvents = (await sTAOContract.queryFilter(
    filter,
    0,
    'latest'
  )) as ethers.EventLog[];
  let amt = 0n;
  let bamt = 0n;
  let lastblock = 0;
  for (let i = 0; i < lastEvents.length; i++) {
    amt = amt + lastEvents[i].args[4];
    lastblock = lastEvents[i].blockNumber;
    bamt = bamt + lastEvents[i].args[3];
  }
  console.log('tao to user: ', amt);
  console.log('burned tao: ', bamt);
  console.log('burned block number: ', lastblock);
  let argArray: any[] = [];
  await lastEvents.forEach((events) => argArray.push(events.args.toArray()));
  //console.log(argArray);
}

function emitTransactionReciptEvent(
  recipt: ethers.ContractTransactionReceipt | null,
  eventName: string
) {
  let eventFrags: any[] = [];
  if (recipt === null) {
    console.warn('emit transaction event, empty');
    return eventFrags;
  }
  const eventLogsArr = recipt?.logs.filter((log): log is ethers.EventLog => {
    if (log instanceof ethers.EventLog) {
      return log.eventName === eventName;
    } else {
      return false;
    }
  });
  if (eventLogsArr !== undefined && eventLogsArr.length > 0) {
    eventLogsArr.forEach((eventLog) => {
      eventLog.args.forEach((args) => {
        eventFrags.push(args);
      });
    });
  }
  return eventFrags;
}

main();

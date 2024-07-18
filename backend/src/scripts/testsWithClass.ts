import { ethers } from 'ethers';
import { sTaoData } from '../data/ethData';
import EthersTestUtils from '../processors/EthersTestUtils';
import testSigners from '../data/testWallets';
import batchQueriedEvents from '../utils/etherEventBatcher';
import { eth } from '@polkadot/types/interfaces/definitions';

async function main() {
    const ethersClass = new EthersTestUtils();

    // First lets do some minting:
    //console.log('Testing Sigular Mint');
    console.log(
        await ethersClass.getSTaoBalance(
            '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
        )
    );
    /*10,000,000,000,000,000,000
    console.log(
        'Mint Receipt: ',
        await ethersClass.stakeSTao(BigInt(100e18), 0)
    );

    console.log(
        'Mint Receipt: ',
        await ethersClass.stakeSTao(BigInt(100e18), 0)
    );

    console.log(
        'Mint Receipt: ',
        await ethersClass.stakeSTao(BigInt(100e18), 0)
    );

    console.log('total supply', await ethersClass.contract.totalSupply());
    */

    /*
    console.log('Testing Multiple Mint');

    console.log(
        'Mint Receipts : ',
        await ethersClass.stakeSTaoWithRange(BigInt(200e18), 0, 10, true)
    );

    console.log('Updating the Ratio Pool (w/ percentage)');
    console.log(
        'Update Receipt: ',
        await ethersClass.updateRatiosWithPercentage(BigInt(110), BigInt(0))
    );

    console.log('Updating the Ratio Pool (w/ BasisPoints)');
    console.log(
        'Update Recipt BP: ',
        await ethersClass.updateRatiosWithBasisPoints(BigInt(120e18))
    );

    console.log('Updating the Ratio Pool Cycles (w/ percentage');
    console.log(
        'Cycle Update Receipt: ',
        await ethersClass.updateRatiosWithPercentageCycle(
            BigInt(120),
            BigInt(0),
            BigInt(10),
            3
        )
    );

    console.log('Updating the Ratio Pool Cycles Relative (w/ BasisPoints)');
    console.log(
        'Cycle Update Receipt Relative: ',
        await ethersClass.relativeUpdateRatiosWithCycle(BigInt(20e18), 3)
    );

    console.log('Redeeming STao Test');
    console.log(
        'Redeem Receipt: ',
        await ethersClass.redeemSTao(BigInt(10e18), testSigners[0].account),
        ' testing the string',
        testSigners[0].account
    );

    console.log('Redeeming all STao Test');
    console.log('Redeem All Receipt: ', await ethersClass.redeemAllSTao(0));

    console.log('Redeeming all STao Test #2');
    console.log('Redeem All Receipt: ', await ethersClass.redeemAllSTao(2));

    console.log('Redeeming all STao Test #4');
    console.log('Redeem All Receipt: ', await ethersClass.redeemAllSTao(4));

    console.log('Batch Request Test');
    const newFilter = ethersClass.contract.filters.Redeemed();
    console.log(
        await batchQueriedEvents(
            ethersClass.contract,
            0,
            'latest',
            newFilter,
            true
        )
    );
    */
    /*
    console.log('Batch Request for Staking');
    const newFilter2 = ethersClass.contract.filters.Transfer();
    console.log(
        await ethersClass.queryEventsInRangeAndBatch(
            ethersClass.contract,
            0,
            'latest',
            newFilter2
        )
    );
    */
    console.log('Completed Successfully');
}

main();

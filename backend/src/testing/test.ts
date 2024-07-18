import { staking } from '@polkadot/types/interfaces/definitions';
import { Decimal } from 'decimal.js';
import EthersTestUtils from 'src/processors/EthersTestUtils';
async function main() {
    const totalInStake = BigInt(12349870e9);
    const totaInSupply = BigInt(10123387e18);
    const scaledResult = calculateNewRatio(totalInStake, totaInSupply);
    const ethersClass = new EthersTestUtils();
    const testBasis = await ethersClass.contract.calculateBasisPoints(
        scaledResult,
        18
    );
    console.log(
        '\n\nTesting ratio/basis point percentage calculations using solidity functions:\n*note that percentages will have 18 points of precision (ie.1e20 = 100%, 1e18 = 1%, 1e17 = .1% ...)\nand sTao has 18 points of precision'
    );
    console.log(
        `\nStarting values:\nTotal Tao Staked: ${totalInStake}\nor ${convertE9toDecimal(totalInStake)}\n\nTotal sTao in circulation ${totaInSupply}\nor ${convertE18toDecimal(totaInSupply)}\n`
    );
    console.log(
        `Testing calculating redemption ratio basis points: ${await ethersClass.contract.calculateBasisPoints(scaledResult, 18)}`
    );
    console.log(`In percentage form: ${convertE18toDecimal(testBasis)}`);
    const appliedDecimal = await ethersClass.contract.applyBasisPoints(
        testBasis,
        BigInt(450e16)
    );
    console.log(
        '\n\nIdeally, in this test if I apply 4.5 sTao(450e16) with some redemption ratio,\nthe Tao result applied with the inverse redemption ratio (staking ratio) should give us back 4.5 sTao\n'
    );
    console.log(
        `\nApplying the redeemption ratio, sTao(450e16) => Tao(${appliedDecimal})`
    );
    console.log(
        `Tao in human readable form: ${convertE18toDecimal(appliedDecimal)}`
    );
    const stakingRatio =
        await ethersClass.contract.inverseBasisPoints(testBasis);

    console.log(
        `\nCalculating the inverse of redeemption ratio (staking ratio): ${stakingRatio}`
    );
    console.log(`In percentage form: ${convertE18toDecimal(stakingRatio)}`);

    const inverseApplied = await ethersClass.contract.applyBasisPoints(
        stakingRatio,
        appliedDecimal
    );
    console.log(
        `\nApplying the staking ratio, Tao(${appliedDecimal}) => sTao(${inverseApplied})`
    );
    console.log(
        `sTao in human readable form: ${convertE18toDecimal(inverseApplied)} \n \n`
    );
}
function calculateNewRatio(
    totalInStake: bigint,
    totalSTaoInCirculation: bigint
) {
    const totalInStakeScaled = convertTo18Decimals(totalInStake);
    const toDecimalStake = new Decimal(totalInStakeScaled.toString());
    const toDecimalCirculation = new Decimal(totalSTaoInCirculation.toString());
    const result = toDecimalStake.dividedBy(toDecimalCirculation).times(100);
    const scaledResult = result.times(1e18);
    console.log(scaledResult.div(1e18).toFixed(18));
    console.log(BigInt(scaledResult.toFixed(0)));
    console.log(result.toFixed(18));
    if (result.lessThan(new Decimal(100))) {
        console.log(`invalid ratio, is negative`);
    }
    return BigInt(scaledResult.toFixed(0));
}

function convertTo18Decimals(amount: bigint) {
    const scaleFactor = BigInt(1e9);
    return amount * scaleFactor;
}

function convertE18toDecimal(amount: bigint) {
    const amountAsDecimal = new Decimal(amount.toString());
    return amountAsDecimal.div(1e18).toFixed(18);
}

function convertE9toDecimal(amount: bigint) {
    const amountAsDecimal = new Decimal(amount.toString());
    return amountAsDecimal.div(1e9).toFixed(9);
}

main();

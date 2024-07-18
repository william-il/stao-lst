import sTAOArtifact from '../../../artifacts/contracts/sTAO.sol/sTAO.json';
import data from '../deployment-info.json';
import dotenv from 'dotenv';
dotenv.config();

export const sTaoData = {
    address: data.address,
    abi: sTAOArtifact.abi,
    apiKey: process.env.HARDHAT_RPC,
    network: data.network,
    deployer: data.deployer,
    defaultAdminAddr: data.constructorData.roleAccounts.defaultAdmin,
    pauserAddr: data.constructorData.roleAccounts.pauser,
    minterAddr: data.constructorData.roleAccounts.minter,
    upgraderAddr: data.constructorData.roleAccounts.upgrader,
    multisigVaultAddr: data.constructorData.roleAccounts.multisigVault,
    poolTaxRoleAddr: data.constructorData.roleAccounts.poolTaxRole,
    defaultAdminPK: data.accountsPrivateKeys.defaultAdminPrivateKey,
    pauserPK: data.accountsPrivateKeys.pauserPrivateKey,
    minterPK: data.accountsPrivateKeys.minterPrivateKey,
    upgraderPK: data.accountsPrivateKeys.upgraderPrivateKey,
    multisigVaultPK: data.accountsPrivateKeys.multisigVaultPrivateKey,
    poolTaxRolePK: data.accountsPrivateKeys.poolTaxRolePrivateKey,
    deployTimestamp: data.timestamp,
    bittensorDefaultAddr: '5DLv1jmtwHBBGEhGbVaXrK4dXzjv2vKi8UvjU11wKDsF5XBg',
};

export default sTaoData;

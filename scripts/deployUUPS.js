const {artifacts, network,ethers, upgrades} = require("hardhat"); 
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const {Wallet} = require("ethers");
async function main() {
  console.log("Network:", network.name);
  console.log("Is Hardhat Network?", network.name === "hardhat");
  //console.log(process.env.PRIVATE_KEY);
  // the deployer is the first signer   
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying contracts with the account: ",
    await deployer.getAddress(),
  );


  const [
    ,
    sTaoPauser,
    sTaoMinter,
    sTaoVault,
    sTaoPoolTax,
  ] = await ethers.getSigners();
 // console.log(sTaoPauser);
  
  const [
    deployerPK,
    sTaoPauserPK,
    sTaoMinterPK,
    sTaoVaultPK,
    sTaoPoolTaxPK,
  ] = [
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", 
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
    "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
    "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
    "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a"]
  
  console.log(
    "sTao role addresses: ",
    "\n Deployer/Default Admin: ",
    await deployer.getAddress(),
    "\n Pauser : ",
    await sTaoPauser.getAddress(),
    "\n Minter : ",
    await sTaoMinter.getAddress(),
    "\n Vault : ",
    await sTaoVault.getAddress(),
    " \n Pool and Tax : ",
    await sTaoPoolTax.getAddress(),
  );

  // initalizer types
  const initParams = {
    defaultAdmin: await deployer.getAddress(),
    pauser: await sTaoPauser.getAddress(),
    minter: await sTaoMinter.getAddress(),
    upgrader: await deployer.getAddress(),
    multisigVault: await sTaoVault.getAddress(),
    poolTaxRole: await sTaoPoolTax.getAddress(),
    initialTax: 0,
    initialTaxDecimals: 0,
    _taxEnabled: false,
    initialPercentage: 100,
    intialPercentageDecimals: 0,
  };

  console.log("Deploying contract..");

  const STao = await ethers.getContractFactory("sTAO");

  //await upgrades.validateImplementation(STao, { kind: "uups" });

  const sTaoDeployed = await upgrades.deployProxy(
    STao,
    [
      deployer.address,
      initParams.pauser,
      initParams.minter,
      initParams.upgrader,
      initParams.multisigVault,
      initParams.poolTaxRole,
      initParams.initialPercentage,
      initParams.intialPercentageDecimals,
    ],
    { kind: "uups" },
  );

  //await sTaoDeployed.deployed();
  console.log(
    "Contract successfully deployed to : ",
    await sTaoDeployed.getAddress(),
  );

  await sTaoDeployed.waitForDeployment();
  
  console.log("ROLES PRINTED: \n");
  
  const minterRole = await sTaoDeployed.MINTER_ROLE();
  const poolTaxRole = await sTaoDeployed.POOL_TAX_ROLE();
  console.log(await sTaoDeployed.hasRole(minterRole, initParams.minter));
  console.log(await sTaoDeployed.hasRole(poolTaxRole, initParams.poolTaxRole));

  console.log(
    "Implementation Address (logic address) is : ",
    await upgrades.erc1967.getImplementationAddress(
      await sTaoDeployed.getAddress(),
    ),
  );
  console.log(
    "Proxy Admin Address is : ",
    await upgrades.erc1967.getAdminAddress(await sTaoDeployed.getAddress()),
  );

  const deployedAddress = await sTaoDeployed.getAddress();

  const deploymentInfo = {
    network: network.name,
    address: deployedAddress,
    deployer: await deployer.getAddress(),
    constructorData : {
      roleAccounts: {
        defaultAdmin : initParams.defaultAdmin,
        pauser: initParams.pauser,
        minter: initParams.minter,
        upgrader: initParams.upgrader,
        multisigVault: initParams.multisigVault,
        poolTaxRole: initParams.poolTaxRole,
      },
      initialPercentage: initParams.initialPercentage,
      initialPercentageDecimals: initParams.intialPercentageDecimals,
    },
    accountsPrivateKeys: {
          defaultAdminPrivateKey: deployerPK,
          pauserPrivateKey: sTaoPauserPK,
          minterPrivateKey: sTaoMinterPK,
          upgraderPrivateKey: deployerPK,
          multisigVaultPrivateKey: sTaoVaultPK,
          poolTaxRolePrivateKey: sTaoPoolTaxPK,
    },
    timestamp: new Date().toISOString()
  };

  const deploymentFile = path.join(__dirname, '..', 'backend', 'src', 'deployment-info.json');
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("Deployment info saved to:", deploymentFile);

  // Check contract code
  const deployedCode = await ethers.provider.getCode(deployedAddress);
  if (deployedCode === "0x") {
    console.error("Warning: Deployed contract has no bytecode!");
  } else {
    console.log("Contract bytecode verified on-chain.");
  }

  console.log("Deployment complete. Verify on Etherscan:");
  console.log(`https://${network.name}.etherscan.io/address/${deployedAddress}`);

  const abi = JSON.stringify(STao.interface.format('json'), null, 2);
  
  const abiPath = path.join(__dirname, "..", "backend", "src", 'STaoHumanReadableABI.json');
  fs.writeFileSync(abiPath, abi);

  console.log(`ABI written to ${abiPath}`);

  //extractHumanReadableAbi("sTAO", sTaoDeployed);
}

//import { STAO } from "../../typechain-types/contracts/sTao.sol";

async function extractHumanReadableAbi(name, token) {
  const hardhatArtifactABI = await artifacts
    .readArtifact(name)
    .then((artifact) => {
      return artifact.abi;
    });
  const backendDir = path.join(__dirname, "..", "backend", "contracts");

  if (!fs.existsSync(backendDir)) {
    fs.mkdirSync(backendDir);
  }

  fs.writeFileSync(
    path.join(backendDir, "contract-address.json"),
    JSON.stringify({ sTAO: token.address }, undefined, 2),
  );

  fs.writeFileSync(
    path.join(backendDir, "sTAO.json"),
    JSON.stringify(hardhatArtifactABI, null, 2),
  );
}
//0xe519389F8c262d4301Fd2830196FB7D0021daf59
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

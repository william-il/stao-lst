require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
const upgrades = require("@openzeppelin/hardhat-upgrades");
console.log("OpenZeppelin Upgrades plugin loaded:", !!upgrades);
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: { 
    version: "0.8.24",
    settings: {
    optimizer: {
      enabled: true,
      runs: 200,
      },
    },
  },
  networks:{
    localhost : {
      chainId: 31337,
      url : 'http://127.0.0.1:8545/',
    },
    hardhat: {
      chainId: 31337,
    },
    holesky: {
      url: `https://eth-holesky.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 17000,
    },
  },
  etherscan:{
    apiKey: {
      holesky: process.env.ETHERSCAN_API_KEY,
    },
    customChains: {
      network: "holesky",
      chainId: 17000,
      urls: {
        apiURL: "https://api-holesky.etherscan.io/api",
        browserURL: "https://holesky.etherscan.io"
      }
    }
  },
  upgrades: {
    saveDeployments : true,
    },
    outputSelection: {
      "*" : {
        "*": ["abi", "evm.bytecode", "evm.deployedBytecode", "metadata"]
      }
    }
};


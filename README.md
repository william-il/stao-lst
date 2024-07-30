# stao-lst

This project is broken down into 2 sections, the hardhat project, and the backend processors. If you are in windows, you must be in WSL2.  
The hardhat project and the backend section each have their own config files for npm/pnpm.

To run the protocol locally we need to run a hardhat local node, and a substrate subtensor chain.  
To run the subtensor chain, look at the local staging process in the bittensor github [here](https://github.com/opentensor/bittensor-subnet-template/blob/main/docs/running_on_staging.md)  

## Run Node and Contract
In order to run the hardhat node, and deploy the uups contract properly do the following in the project's root directory:

```shell
npx hardhat node --network hardhat
```

Deploy the contract, note that if you do not run the script with 'hardhat run' and '--network localhost', the contract will still deploy but ethers will have issues extracting contract defined structures.
```shell
npx hardhat run scripts/deployUUPS.js --network localhost
```
---

## Run Subtensor setup
Within the project directory there is a custom built subtensor chain that will accomodate the higher rate limits of the test environment.  
To use this subtensor do the followng:  

#### Only do this once, or if you have already done this, skip this section
First install substrate dependencies

```shell
sudo apt update
```
```shell
sudo apt install --assume-yes make build-essential git clang curl libssl-dev llvm libudev-dev protobuf-compiler
```

Install rust and cargo

```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
```shell
source "$HOME/.cargo/env"
```

Setup rust

```shell
./subtensor/scripts/init.sh
```

#### Do this if this is your first time building the binaries, or if you edit the subtensor

Rebuild the binary

```shell
cargo build --release --features pow-faucet
```
or for fast-block (not recommended)
```shell
cargo build --release --features fast-block
```

Run the localnet script and launch the subtensor chain

```shell
BUILD_BINARY=0 ./scripts/localnet.sh 
```

Run the subtensor builder script  
This script creates validators, miners, subnets, a owner, and adds stake to each validator.
* --subnet-count or --sc can be between 1 - 8, and defaults to 1
* --validator-count or --vc can be between 2 - 8, and defaults to 2

```shell
npx tsx backend/src/setup/setupSubtensor.ts --sc [1-8] --vc [2-8]
```
---

## Run the Bittensor Processor
Assuming the bittensor side is already setup, run the backend processor.

```shell
npx tsx backend/src/index.ts
```
---

## Bittensor utilities
To check the list of delgates:

```shell
btcli root list_delegates --subtensor.chain_endpoint --subtensor.chain_endpoint ws://127.0.0.1:9946
```

To see subnet, validator and miner information:

```shell
btcli subnet list --subtensor.chain_endpoint ws://127.0.0.1:9946
```

```shell
btcli wallet overview --wallet.name [wallet name] --subtensor.chain_endpoint ws://127.0.0.1:9946
```

```shell
btcli wallet overview --wallet.name [wallet name] --subtensor.chain_endpoint ws://127.0.0.1:9946
```

To see metagraph subnet data

```shell
btcli s metagraph --subtensor.chain_endpoint ws://127.0.0.1:9946
```

To see root weights set by validators

```shell
btcli root get_weights --subtensor.chain_endpoint ws://127.0.0.1:9946
```


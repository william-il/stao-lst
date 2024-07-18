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

Deploy the contract
```shell
npx hardhat run scripts/deployUUPS.js --network localhost
```
---

## Run the Bittensor Processor
Assuming the bittensor side is already setup, run the backend processor.

```shell
npx tsx backend/src/index.ts
```

## Bittensor setup
On deployment, check the terminal running the hardhat node to check if it properly deployed. Some json files should have also been generated in the backend files.  
Next, inorder to test the capabilities of the contract and the processor, set up a subnet and some miners and validators. Also set one of the validators to be a delegate.  

This is on the staging documentation, but here are the relevant commands:


Create an owner
```shell
btcli wallet new_coldkey --wallet.name owner
```

Create a miner
```shell
btcli wallet new_coldkey --wallet.name miner
```

Create a miner hotkey pair
```shell
btcli wallet new_hotkey --wallet.name miner --wallet.hotkey default
```

Create a validator
```shell
btcli wallet new_coldkey --wallet.name validator
```

Create a validator hotkey pair
```shell
btcli wallet new_hotkey --wallet.name validator --wallet.hotkey default
```
---

Either faucet or send tao from a dev account to owner and validator, then create the subnet.

Faucet to owner
```shell
btcli wallet faucet --wallet.name owner --subtensor.chain_endpoint ws://127.0.0.1:9946
```

Faucet to validator
```shell
btcli wallet faucet --wallet.name validator --subtensor.chain_endpoint ws://127.0.0.1:9946
```

Create subnet with owner's balance
```shell
btcli subnet create --wallet.name owner --subtensor.chain_endpoint ws://127.0.0.1:9946 
```
---

Register the miner and the validator to the subnet

```shell
btcli subnet register --wallet.name miner --wallet.hotkey default --subtensor.chain_endpoint ws://127.0.0.1:9946
```

```shell
btcli subnet register --wallet.name validator --wallet.hotkey default --subtensor.chain_endpoint ws://127.0.0.1:9946
```
---

Add stake to the subnet through the validator.

```shell
btcli stake add --wallet.name validator --wallet.hotkey default --subtensor.chain_endpoint ws://127.0.0.1:9946
```
---

Nominate the validator as a delegate

```shell
btcli root nominate
    --wallet.name validator
    --wallet.hotkey default
    --subtensor.chain_endpoint ws://127.0.0.1:9946
```
---

Run the miner and validator

```shell
python neurons/miner.py 
    --netuid 1 
    --subtensor.chain_endpoint ws://127.0.0.1:9946 
    --wallet.name miner
    --wallet.hotkey default
    --logging.debug
```

```shell
python neurons/validator.py
    --netuid 1
    --subtensor.chain_endpoint ws://127.0.0.1:9946
    --wallet.name validator
    --wallet.hotkey default
    --logging.debug
```
---

Set weights for the subnet

Register the validator to the root subnet
```shell
btcli root register
    --wallet.name validator
    --wallet.hotkey default
    --subtensor.chain_endpoint ws://127.0.0.1:9946
```

Boost your subnet on the root subnet
```shell
btcli root boost
    --netuid 1
    --increase 1
    --wallet.name validator
    --wallet.hotkey default
    --subtensor.chain_endpoint ws://127.0.0.1:9946
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
btcli wallet overview --wallet.name validator --subtensor.chain_endpoint ws://127.0.0.1:9946
```

```shell
btcli wallet overview --wallet.name miner --subtensor.chain_endpoint ws://127.0.0.1:9946
```


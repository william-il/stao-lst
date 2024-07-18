import {ethers} from 'ethers';
import data from '../data/ethData';
import dotenv from 'dotenv';
import constants from '../data/constants';
import { EventEmitter } from 'events';
import internal from 'stream';


dotenv.config();

export class EthereumListener extends EventEmitter {
    private provider : ethers.JsonRpcProvider;
    private sTAOContract : ethers.Contract;
    private sTAOAddress : string;
    private sTAOVaultAddress : string;
    private isListening : boolean;
    private startingInterval : NodeJS.Timeout | null;



    constructor() {
        super();
        this.provider = new ethers.JsonRpcProvider(process.env.HARDHAT_RPC);
        this.sTAOAddress = data.address;
        this.sTAOContract = new ethers.Contract(this.sTAOAddress, data.abi, this.provider);
        this.sTAOVaultAddress = data.multisigVaultAddr;
        this.isListening = false;
        this.startingInterval = null;
        console.log('EthereumListener initialized with values: ');
        console.log('sTAOAddress: ', this.sTAOAddress);
        console.log('sTAOContract: ', this.sTAOContract);
        console.log('provider: ', this.provider);
        console.log('sTAOVaultAddress: ', this.sTAOVaultAddress);
    }


    /*
        "event Approval(address indexed,address indexed,uint256)",
        "event Initialized(uint64)",
        "event Paused(address)",
        "event PoolBasisPointsUpdated((uint256,uint256,uint256,uint256,uint256))",
        "event ProtocolTaxData(uint256,bool)",
        "event ProtocolVaultTransfer(address indexed,address indexed,uint256)",
        "event Redeemed(address indexed,uint256,uint256,uint256,uint256,(uint256,uint256,uint256))",
        address indexed ethBurner,
        uint256 sTaoTotalAmount,
        uint256 sTaoTaxed,
        uint256 sTaoBurned,
        uint256 taoToUser,
        BlockTimeData blockStats
        "event RoleAdminChanged(bytes32 indexed,bytes32 indexed,bytes32 indexed)",
        "event RoleGranted(bytes32 indexed,address indexed,address indexed)",
        "event RoleRevoked(bytes32 indexed,address indexed,address indexed)",
        "event Staked(address indexed,string,uint256,uint256,uint256,(uint256,uint256,uint256))",
        "event Transfer(address indexed,address indexed,uint256)",
        "event Unpaused(address)",
        "event Upgraded(address indexed)",
    */

    public async startListening() {
        if(this.isListening) {
            console.log("Eth listener is already listening");
            return;
        }
        this.isListening = true;
        this.startingInterval = setInterval(() => {
            this.processHourlyTransactions()
        }, 3600000);
        console.log("hourly listening for ethereum listener started");
    }

    private async processHourlyTransactions() {
        console.log("withing hourly processing");
        this.provider.
    }
    
}

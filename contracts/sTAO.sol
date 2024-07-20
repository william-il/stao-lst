// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {ERC20PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

import "hardhat/console.sol";

contract sTAO is
    Initializable,
    ERC20Upgradeable,
    ERC20PausableUpgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable,
    ReentrancyGuardUpgradeable
{
    /*
     ****************************************************************************
     * Storage variables, mappings and structures
     ****************************************************************************
     */

    // creating roles with upgradeable access control
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant POOL_TAX_ROLE = keccak256("POOL_TAX_ROLE");
    bytes32 public constant VAULT_ROLE = keccak256("VAULT_ROLE");

    // Tax is done with 18 points of precision, such that 1 * 10 ** 18 is 1%
    // 1 * 10 ** 17 is 0.1%
    uint256 public protocolTax;
    bool public taxEnabled;

    // Tao pool is calculate with 18 points of precision even though tao only has 9 points of precision
    // this means that 1 * 10 ** 18 is 1 tao
    // and 1 * 10 * 9 is 1 rao (1,000,000,000 taoPool = 1 rao)
    uint256 public taoPool;

    // BasisPoints is calculate with a percentage with 18 points of precision, such ath 1 * 10 ** 18 is 1%
    uint256 public redeemBasisPoints;
    uint256 public lastRedeemBasisPoints;
    uint256 public lastLastRedeemBasisPoints;
    uint256 public stakeBasisPoints;

    // sinceLastUpdate is a unix timestamp given by the eth chain.
    uint256 public sinceLastUpdate;

    // This is a gnosis multisig wallet which will only hold taxed sTao
    address public sTAOProtcolVault;

    struct EthKey {
        address ethWallet;
        bytes signature;
    }

    mapping(string taoAddr => EthKey[] ethkeys) public bitToEth;

    /*
     ****************************************************************************
     * END OF Storage variables, mappings and structures
     ****************************************************************************
     */

    /*
     ****************************************************************************
     * Events and Errors
     ****************************************************************************
     */

    event Staked(
        address indexed to,
        string bittensorWallet,
        uint256 totalAmountStaked,
        uint256 amountTaxed,
        uint256 amountToUser,
        uint256 lastTimeUpdated
    );

    event Redeemed(
        string bittensorWalletToSendTao,
        address indexed ethBurner,
        uint256 sTaoTotalAmount,
        uint256 sTaoTaxed,
        uint256 sTaoBurned,
        uint256 taoToUser,
        uint256 lastTimeUpdated
    );

    event ProtocolVaultTransfer(
        address indexed from,
        address indexed to,
        uint256 amount
    );

    event ProtocolTaxData(uint256 tax, bool enabled);
    event PoolBasisPointsUpdated(uint256 lastLastRedeemBasisPoints, uint256 lastRedeemBasisPoints, uint256 redeemBasisPoints, uint256 stakeBasisPoints,uint256 updateTime);

    error NotEnoughSTao(uint256 amount, uint256 sTaoAmount, address wallet);
    error InsignificantAmountOfTao(uint256 amount);
    error BittensorWalletInvalidLength(string wallet);
    error InvalidNegativeValue(uint256 value);
    error InvalidTaxValue(uint256 value);
    error NotEnoughTimePassed(uint256 time);
    error IncorrectSignatureSize(bytes signature);
    error IncorrectTaoAddrSize(string taoAddr);
    error NegativeStakingRewards(uint256 newBasisPoints);

    /*
     ****************************************************************************
     * END OF Events and Errors
     ****************************************************************************
     */

    /*
     ****************************************************************************
     * Initializer Function
     ****************************************************************************
     */

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address defaultAdmin,
        address pauser,
        address minter,
        address upgrader,
        address multisigVault,
        address poolTaxRole,
        uint256 initialPercentage,
        uint8 initialPercentageDecimals
    ) public initializer {
        __ERC20_init("Staked Tao", "sTAO");
        __ERC20Pausable_init();
        __AccessControl_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, pauser);
        _grantRole(MINTER_ROLE, minter);
        _grantRole(UPGRADER_ROLE, upgrader);
        _grantRole(VAULT_ROLE, multisigVault);
        _grantRole(POOL_TAX_ROLE, poolTaxRole);

        // set intial BasisPoints and tax values
        protocolTax = 0;
        uint256 initialBasisPoints = calculateBasisPoints(
            initialPercentage,
            initialPercentageDecimals
        );
        redeemBasisPoints = initialBasisPoints;
        lastRedeemBasisPoints = initialBasisPoints;
        lastLastRedeemBasisPoints = initialBasisPoints;
        sinceLastUpdate = block.timestamp;
        stakeBasisPoints = inverseBasisPoints(initialBasisPoints);
        sTAOProtcolVault = multisigVault;
        taxEnabled = false;
    }


    /*
     ****************************************************************************
     * END OF Initializer Function
     ****************************************************************************
     */

    /*
     ****************************************************************************
     * EthKey account creation functions
     ****************************************************************************
     */

    function addAccount(
        string calldata _taoAddr,
        address _ethWallet,
        bytes calldata _signature
    ) public {
        if (_signature.length != 64) {
            revert IncorrectSignatureSize({signature: _signature});
        }
        if (bytes(_taoAddr).length != 48) {
            revert IncorrectTaoAddrSize({taoAddr: _taoAddr});
        }

        bitToEth[_taoAddr].push(
            EthKey({ethWallet: _ethWallet, signature: _signature})
        );
    }

    function getAllEthKeysForTaoAddress(
        string calldata _taoAddr
    ) public view returns (EthKey[] memory) {
        return bitToEth[_taoAddr];
    }

    /*
     ****************************************************************************
     * END OF EthKey account creation functions
     ****************************************************************************
     */

    /*
     ****************************************************************************
     * Calculation & Function Helpers
     ****************************************************************************
     */

    // we are calculating in basis points in 1e18
    function calculateBasisPoints(
        uint256 _percentage,
        uint8 _decimals
    ) public pure returns (uint256) {
        // takes a percentage number such as 124 and a decimal value such as 1.
        // this means we want the percentage of 12.4% as the decimal value dictates how many numbers are to the left of the decimal
        // note that all percentages will have 18 points of precision
        require(
            _percentage > 0 && _decimals >= 0 && _decimals <= 18,
            "Invalid percentage or decimal value"
        );

        uint256 _basisPoints = _percentage * 10 ** (18 - _decimals);
        return _basisPoints;
    }

    // done via basis points of which each are worth 1e-18
    function applyBasisPoints(
        uint256 _basisPoints,
        uint256 _value
    ) public pure returns (uint256) {
        // posible error checking of invalid basis points?
        return (_basisPoints * _value) / (1e20);
    }

    // provide the basis points of the inverse of a percentage
    function inverseBasisPoints(
        uint256 _basisPoints
    ) public pure returns (uint256) {
        return (1e40 / _basisPoints);
    }

    function bittensorWalletLengthCheck(
        string memory _wallet
    ) internal pure returns (bool) {
        if (bytes(_wallet).length != 48) {
            revert BittensorWalletInvalidLength(_wallet);
        }
        return true;
    }

    // decimals is 18, this means 1 sTao will be 1 * 10 ** 18 or 1 * 10^18
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    /*
     ****************************************************************************
     * END OF Calculation & Function Helpers
     ****************************************************************************
     */

    /*
     ****************************************************************************
     * Contract Control Functions, Role Blocked
     ****************************************************************************
     */
    function setProtocolTax(
        uint256 _protocolTax,
        uint8 _protocolDecimals
    ) public onlyRole(POOL_TAX_ROLE) {
        // check to see if the value is zero or 100%
        if (_protocolTax < 0) {
            revert InvalidTaxValue(_protocolTax);
        }

        protocolTax = calculateBasisPoints(_protocolTax, _protocolDecimals);

        if (protocolTax / 1e18 >= 1) {
            // protocol tax is above or equal 100%
            revert InvalidTaxValue(_protocolTax);
        }
        emit ProtocolTaxData(protocolTax, taxEnabled);
    }

    function setProtocolTax(
        uint256 _protocolTax,
        uint8 _protocolDecimals,
        bool _taxEnabled
    ) public onlyRole(POOL_TAX_ROLE) {
        // check to see if the value is zero or 100%
        if (_protocolTax < 0) {
            revert InvalidTaxValue(_protocolTax);
        }
        protocolTax = calculateBasisPoints(_protocolTax, _protocolDecimals);
        if (protocolTax / 1e18 >= 1) {
            // protocol tax is above or equal 100%
            revert InvalidTaxValue(_protocolTax);
        }
        taxEnabled = _taxEnabled;
        emit ProtocolTaxData(protocolTax, taxEnabled);
    }

    function _authorizeUpgrade(
        address
    ) internal override onlyRole(UPGRADER_ROLE) {}

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function transferProtocolVault(
        address _newVault
    ) public onlyRole(VAULT_ROLE) whenPaused {
        _transfer(sTAOProtcolVault, _newVault, balanceOf(sTAOProtcolVault));
        _revokeRole(VAULT_ROLE, sTAOProtcolVault);
        _grantRole(VAULT_ROLE, _newVault);

        emit ProtocolVaultTransfer(
            sTAOProtcolVault,
            _newVault,
            balanceOf(sTAOProtcolVault)
        );

        sTAOProtcolVault = _newVault;
    }

    // to calculate stake basis points:
    // this is done by:
    // keep track of last 2 hours of redeem ratios
    // averaging the difference between the last 2 hours of the deltas of the basis points
    // for example
    /*
     * H0: 1 sTao : 1.0 Tao (100e18 bp) (redeem bp)
     * H1: 1 sTao : 1.1 Tao (110e18 bp) (redeem bp)
     * H2: 1 sTao : 1.2 Tao (120e18 bp) (redeem bp)
     * to calculate the stake bp we need to "predict" what the future tao pool can be
     *  this is because since the tao basis point ratios are updated every hour, a staker at anytime could be at an advantage by getting a better tao to sTao ratio
     * A simple fix is to just average the last 2 hours of the redeem basis points, averaging them, and adding them to the
     *
     */
    function calculateStakingBasisPoints(
        uint256 _lastlastReedemBasisPoints,
        uint256 _lastReedemBasisPoints,
        uint256 _redeemBasisPoints
    ) public pure returns (uint256) {
        if (_lastReedemBasisPoints > _redeemBasisPoints) {
            revert NegativeStakingRewards(_redeemBasisPoints);
        }
        // calculate the predicted average
        // Rewards-bearings mean that ideally, the basis points for each new redeemBasispoints should be higher
        // tao is never slashed, so negative ratios should not be accounted for
        uint256 delta1 = _lastReedemBasisPoints - _lastlastReedemBasisPoints;
        uint256 delta2 = _redeemBasisPoints - _lastReedemBasisPoints;
        uint256 averageDelta = (delta1 + delta2) / 2;
        return (_redeemBasisPoints + averageDelta);
    }

    function updateRatiosWithPercentage(
        uint256 _newRedeemPercentage,
        uint8 _redeemDecimals
    ) public onlyRole(POOL_TAX_ROLE) {
        lastLastRedeemBasisPoints = lastRedeemBasisPoints;
        lastRedeemBasisPoints = redeemBasisPoints;
        redeemBasisPoints = calculateBasisPoints(
            _newRedeemPercentage,
            _redeemDecimals
        );
        stakeBasisPoints = calculateStakingBasisPoints(
            lastLastRedeemBasisPoints,
            lastRedeemBasisPoints,
            redeemBasisPoints
        );
        stakeBasisPoints = inverseBasisPoints(stakeBasisPoints);
        // update time and emit stats
        sinceLastUpdate = block.timestamp;
        emit PoolBasisPointsUpdated(
                lastLastRedeemBasisPoints,
                lastRedeemBasisPoints,
                redeemBasisPoints,
                stakeBasisPoints,
                sinceLastUpdate
        );
    }

    function updateRatiosWithBasisPoints(
        uint256 _newRedeemPoints
    ) public onlyRole(POOL_TAX_ROLE) {
        if (lastRedeemBasisPoints > _newRedeemPoints) {
            revert NegativeStakingRewards(_newRedeemPoints);
        }
        lastLastRedeemBasisPoints = lastRedeemBasisPoints;
        lastRedeemBasisPoints = redeemBasisPoints;
        redeemBasisPoints = _newRedeemPoints;
        stakeBasisPoints = calculateStakingBasisPoints(
            lastLastRedeemBasisPoints,
            lastRedeemBasisPoints,
            redeemBasisPoints
        );
        stakeBasisPoints = inverseBasisPoints(stakeBasisPoints);
        // update time and emit stats
        sinceLastUpdate = block.timestamp;
        emit PoolBasisPointsUpdated(
                lastLastRedeemBasisPoints,
                lastRedeemBasisPoints,
                redeemBasisPoints,
                stakeBasisPoints,
                sinceLastUpdate
        );
    }

    /*
     ****************************************************************************
     * END OF Contract Control Functions, Role Blocked
     ****************************************************************************
     */

    /*
     ****************************************************************************
     * Staking & Minting
     ****************************************************************************
     */
    function stakeSTao(
        address _to,
        uint256 _taoAmount,
        string memory _bittensorWallet
    ) public onlyRole(MINTER_ROLE) whenNotPaused {
        bittensorWalletLengthCheck(_bittensorWallet);
        require(_taoAmount > 0, "Invalid amount");
        if (applyBasisPoints(stakeBasisPoints, _taoAmount) == 0) {
            revert InsignificantAmountOfTao(_taoAmount);
        }
        uint256 _sTaoToMint = applyBasisPoints(stakeBasisPoints, _taoAmount);
        // now calcuate the tax to be sent to the protocol vault
        uint256 _sTaoTaxed = 0;
        if (taxEnabled) {
            _sTaoTaxed = applyBasisPoints(protocolTax, _sTaoToMint);
        }
        uint256 _sTAOtoUser = _sTaoToMint - _sTaoTaxed;
        _mint(_to, _sTAOtoUser);
        if (_sTaoTaxed > 0) {
            _mint(sTAOProtcolVault, _sTaoTaxed);
        }
        emit Staked(
            _to,
            _bittensorWallet,
            _sTaoToMint,
            _sTaoTaxed,
            _sTAOtoUser,
            sinceLastUpdate
        );
    }

    /*
     *   Redeem STao function
     *   @param _bittensorWallet : the wallet address of the user
     *       - note that this is in the format of a cold public bittensor  *         wallet string
     *       - 48 characters long, ex:
     *         5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty
     *
     *   @param _sTaoAmount : the amount of sTao to be redeemed
     *       - this sTao will be burned and taxed accordingly
     *       - Note that sTao has 18 decimals, thus 1e18 is 1 sTao
     * 
     *  - burns sTao by user/sender's request
     *  - A protocol fee is taken from the sTao to be burned
     *  - the remaining sTao is then put through a redeemption calculation
     *  - the calculated value is then sent to the backend, in which we send the *    appropriate amount of Tao to the 
     * 
     * input wallet in function call
     *  - Note that this wallet is not checked, thus power users beware of the *    bittensor wallet input
     *  - for redeemption ratio calculations, check calculateStakingBasisPoints()
     *
     *   @return uint256 : the amount of Tao to be sent to the user, processed
     *   Also emits a redeem event to be read
     *
     */
    function redeemSTao( 
        string memory _bittensorWallet,
        uint256 _sTaoAmount
    ) public whenNotPaused nonReentrant returns (uint256) {
        bittensorWalletLengthCheck(_bittensorWallet);
        require(_sTaoAmount > 0, "Invalid amount");
        // burn first to check if user amount is valid 

        if (balanceOf(msg.sender) < _sTaoAmount) {
            revert NotEnoughSTao(balanceOf(msg.sender),_sTaoAmount, msg.sender);
        }

        uint256 _sTaoToBurnOriginal = _sTaoAmount;
        uint256 _sTaoTaxed = 0;

        if (taxEnabled) {
            _sTaoTaxed = applyBasisPoints(protocolTax, _sTaoToBurnOriginal);
        }

        uint256 _sTaoToBurnAfterTaxes = _sTaoToBurnOriginal - _sTaoTaxed;
        // if tax amount exists

        if (_sTaoTaxed > 0) {
            _transfer(msg.sender, sTAOProtcolVault, _sTaoTaxed);
        }

        _burn(msg.sender, _sTaoToBurnAfterTaxes);
        // now calculate tao to send back with redeem basis points
        uint256 _taoToUser = applyBasisPoints(
            redeemBasisPoints,
            _sTaoToBurnAfterTaxes
        );

        emit Redeemed(
            _bittensorWallet,
            msg.sender,
            _sTaoToBurnOriginal,
            _sTaoTaxed,
            _sTaoToBurnAfterTaxes,
            _taoToUser,
            sinceLastUpdate 
        );
        return (_taoToUser);
    }

    /*
     ****************************************************************************
     * Staking & Minting
     ****************************************************************************
     */

    // required by solidity/*
    function _update(
        address from,
        address to,
        uint256 value
    )
        internal
        override(ERC20Upgradeable, ERC20PausableUpgradeable)
        whenNotPaused
    {
        super._update(from, to, value);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "./StemLiquidStaking.sol";

// ============================================================================
// Liquid Staking Factory (Beacon Proxy Pattern)
// ============================================================================
contract LiquidStakingFactory {
    UpgradeableBeacon public immutable beacon;
    
    mapping(address => address[]) public userVaults;
    address[] public allVaults;

    event LiquidStakingCreated(
        address indexed creator,
        address indexed vaultAddress,
        string name,
        string symbol,
        address assetToken
    );

    constructor() {
        StemLiquidStaking implementation = new StemLiquidStaking();
        beacon = new UpgradeableBeacon(address(implementation), msg.sender);
    }

    function createLiquidStaking(
        address _assetToken,
        string memory _vaultName,
        string memory _vaultSymbol,
        uint256 _minLockTime
    ) external returns (address) {
        
        // Data để khởi tạo hàm initialize() của StemLiquidStaking
        bytes memory data = abi.encodeWithSelector(
            StemLiquidStaking.initialize.selector,
            _assetToken,
            _vaultName,
            _vaultSymbol,
            msg.sender,
            _minLockTime
        );

        // Khởi tạo Proxy trỏ về Beacon
        BeaconProxy proxy = new BeaconProxy(address(beacon), data);
        address vaultAddress = address(proxy);

        // Lưu trữ
        userVaults[msg.sender].push(vaultAddress);
        allVaults.push(vaultAddress);

        emit LiquidStakingCreated(msg.sender, vaultAddress, _vaultName, _vaultSymbol, _assetToken);

        return vaultAddress;
    }

    function getUserVaults(address user) external view returns (address[] memory) {
        return userVaults[user];
    }
}

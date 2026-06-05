// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "./StemLaunchpad.sol";

contract LaunchpadFactory {
    UpgradeableBeacon public immutable beacon;

    event LaunchpadCreated(
        address indexed creator,
        address indexed launchpadAddress,
        address projectToken,
        address paymentToken,
        uint256 hardCap
    );

    constructor() {
        StemLaunchpad implementation = new StemLaunchpad();
        beacon = new UpgradeableBeacon(address(implementation), msg.sender);
    }

    function createLaunchpad(
        address _projectToken,
        address _paymentToken,
        uint256 _rate,
        uint256 _softCap,
        uint256 _hardCap,
        uint256 _durationMinutes
    ) external returns (address) {
        bytes memory data = abi.encodeWithSelector(
            StemLaunchpad.initialize.selector,
            msg.sender, // projectOwner
            _projectToken,
            _paymentToken,
            _rate,
            _softCap,
            _hardCap,
            _durationMinutes
        );

        BeaconProxy proxy = new BeaconProxy(address(beacon), data);
        address launchpadAddr = address(proxy);

        emit LaunchpadCreated(msg.sender, launchpadAddr, _projectToken, _paymentToken, _hardCap);
        return launchpadAddr;
    }
}

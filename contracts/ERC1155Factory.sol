// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "./StemERC1155.sol";

// ============================================================================
// Nhà máy đúc Huy Hiệu (Beacon Proxy Pattern)
// ============================================================================
contract ERC1155Factory {
    UpgradeableBeacon public immutable beacon;
    mapping(address => address[]) public userCollections;
    address[] public allCollections;

    event CollectionCreated(address indexed creator, address collectionAddress, string name, string symbol);

    constructor() {
        StemERC1155 implementation = new StemERC1155();
        beacon = new UpgradeableBeacon(address(implementation), msg.sender);
    }

    function createCollection(string memory name, string memory symbol, string memory uri, bool isSoulbound) public returns (address) {
        bytes memory data = abi.encodeWithSelector(StemERC1155.initialize.selector, name, symbol, uri, msg.sender, isSoulbound);
        BeaconProxy proxy = new BeaconProxy(address(beacon), data);
        address collectionAddr = address(proxy);
        
        userCollections[msg.sender].push(collectionAddr);
        allCollections.push(collectionAddr);

        emit CollectionCreated(msg.sender, collectionAddr, name, symbol);
        return collectionAddr;
    }

    function getUserCollections(address user) public view returns (address[] memory) {
        return userCollections[user];
    }

    function getTotalCollections() public view returns (uint256) {
        return allCollections.length;
    }
}

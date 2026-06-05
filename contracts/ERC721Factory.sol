// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// OZ v5 — non-upgradeable vì Factory bản thân không cần upgrade
import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "./StemERC721.sol";

// ============================================================================
// ERC721Factory — Beacon Proxy Pattern
// Mỗi collection là 1 BeaconProxy trỏ đến StemERC721 implementation
// Nâng cấp toàn bộ collection chỉ cần upgrade 1 lần trên Beacon
// ============================================================================
contract ERC721Factory {

    UpgradeableBeacon public immutable beacon;

    // creator => danh sách collection của họ
    mapping(address => address[]) public userCollections;

    // Tất cả collection từ trước đến nay
    address[] public allCollections;

    event CollectionCreated(
        address indexed creator,
        address collectionAddress,
        string name,
        string symbol
    );

    // Deploy Factory = tự động deploy Implementation + Beacon
    // msg.sender trở thành owner của Beacon (có quyền upgrade implementation)
    constructor() {
        StemERC721 implementation = new StemERC721();
        beacon = new UpgradeableBeacon(address(implementation), msg.sender);
    }

    // Tạo 1 collection mới — mỗi collection là 1 BeaconProxy riêng
    function createCollection(
        string memory name,
        string memory symbol,
        bool isSoulbound
    ) public returns (address) {
        // Encode lời gọi initialize để BeaconProxy tự gọi khi deploy
        bytes memory initData = abi.encodeWithSelector(
            StemERC721.initialize.selector,
            name,
            symbol,
            msg.sender,   // owner của collection = người tạo
            isSoulbound
        );

        BeaconProxy proxy = new BeaconProxy(address(beacon), initData);
        address collectionAddr = address(proxy);

        userCollections[msg.sender].push(collectionAddr);
        allCollections.push(collectionAddr);

        emit CollectionCreated(msg.sender, collectionAddr, name, symbol);
        return collectionAddr;
    }

    // Lấy danh sách collection của 1 địa chỉ
    function getUserCollections(address user) public view returns (address[] memory) {
        return userCollections[user];
    }

    // Tổng số collection đã tạo
    function getTotalCollections() public view returns (uint256) {
        return allCollections.length;
    }

    // Địa chỉ implementation hiện tại (để verify trên Etherscan)
    function getImplementation() public view returns (address) {
        return beacon.implementation();
    }
}

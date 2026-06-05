// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./NFTAuctionHouse.sol";

/**
 * @title AuctionHouseFactory
 * @notice Factory dùng để triển khai (deploy) Sàn Đấu Giá NFT.
 *         Giáo viên bấm nút → Deploy ra 1 Sàn Đấu Giá chung cho cả lớp.
 */
contract AuctionHouseFactory {
    
    event AuctionHouseCreated(address indexed auctionHouseAddress, string name, address indexed owner);

    function createAuctionHouse(string memory _name) external returns (address) {
        NFTAuctionHouse newHouse = new NFTAuctionHouse(_name, msg.sender);

        emit AuctionHouseCreated(address(newHouse), _name, msg.sender);
        return address(newHouse);
    }
}

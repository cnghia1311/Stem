// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./CoinFaucet.sol";

// ============================================================================
// Nhà Máy Tạo Két Sắt Bài Thi (CoinFaucet Factory — EIP-1167 Minimal Clone)
// - Tạo Két Sắt mới với chi phí gas cực thấp (~10x rẻ hơn deploy thường)
// - Mỗi Két Sắt là bản Clone bất biến của CoinFaucet
// ============================================================================
contract CoinFaucetFactory {
    using Clones for address;

    address public immutable implementation; // Bản gốc CoinFaucet
    address[] public allFaucets;             // Toàn bộ Két Sắt đã tạo
    mapping(address => address[]) public userFaucets; // Két Sắt theo Owner

    event FaucetCreated(
        address indexed creator,
        address faucetAddress,
        address token,
        uint256 rewardAmount,
        uint256 whitelistCount
    );

    constructor() {
        // Deploy 1 bản CoinFaucet làm implementation (không initialize)
        implementation = address(new CoinFaucet());
    }

    /// @notice Tạo một Két Sắt Bài Thi mới (Clone + Khởi tạo)
    /// @param _token Địa chỉ ERC-20 Coin dùng làm phần thưởng
    /// @param _rewardAmount Số lượng Coin thưởng mỗi lần claim (đã nhân 10^18)
    /// @param _whitelistedUsers Danh sách ví học sinh được phép nhận thưởng
    function createFaucet(
        address _token,
        uint256 _rewardAmount,
        address[] calldata _whitelistedUsers
    ) external returns (address) {
        require(_token != address(0), "Token address invalid");
        require(_rewardAmount > 0, "Reward must be > 0");

        // Clone bản implementation (EIP-1167 — siêu rẻ gas)
        address clone = implementation.clone();

        // Khởi tạo Két Sắt mới
        CoinFaucet(clone).initialize(msg.sender, _token, _rewardAmount, _whitelistedUsers);

        // Lưu lịch sử
        allFaucets.push(clone);
        userFaucets[msg.sender].push(clone);

        emit FaucetCreated(msg.sender, clone, _token, _rewardAmount, _whitelistedUsers.length);
        return clone;
    }

    /// @notice Xem Két Sắt theo Owner
    function getFaucetsByOwner(address _owner) external view returns (address[] memory) {
        return userFaucets[_owner];
    }

    /// @notice Tổng số Két Sắt đã tạo
    function getTotalFaucets() external view returns (uint256) {
        return allFaucets.length;
    }
}

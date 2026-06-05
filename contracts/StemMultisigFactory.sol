// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./StemMultisig.sol";

// ============================================================================
// Nhà Máy Tạo Quỹ Lớp (Multisig Factory — EIP-1167 Minimal Clone)
// - Tạo quỹ mới với chi phí gas thấp nhất (~10x rẻ hơn deploy thường)
// - Mỗi quỹ là bản Clone bất biến của StemMultisig
// ============================================================================
contract StemMultisigFactory {
    using Clones for address;

    address public immutable implementation; // Bản gốc StemMultisig
    address[] public allMultisigs;           // Toàn bộ quỹ đã tạo
    mapping(address => address[]) public userMultisigs; // Quỹ theo Owner

    event MultisigCreated(
        address indexed creator,
        address multisigAddress,
        address[] owners,
        uint256 required
    );

    constructor() {
        // Deploy 1 bản StemMultisig làm implementation (không initialize)
        implementation = address(new StemMultisig());
    }

    /// @notice Tạo một Quỹ Lớp mới (Clone + Khởi tạo)
    /// @param _owners Danh sách ví Ban Quản Trị
    /// @param _required Số chữ ký tối thiểu để giải ngân
    function createMultisig(address[] calldata _owners, uint256 _required)
        external
        returns (address)
    {
        require(_owners.length > 0, "Can it nhat 1 Owner");
        require(_required > 0 && _required <= _owners.length, "So chu ky khong hop le");

        // Clone bản implementation (EIP-1167 — siêu rẻ gas)
        address clone = implementation.clone();

        // Khởi tạo quỹ mới
        StemMultisig(payable(clone)).initialize(_owners, _required);

        // Lưu lịch sử
        allMultisigs.push(clone);
        for (uint256 i = 0; i < _owners.length; i++) {
            userMultisigs[_owners[i]].push(clone);
        }

        emit MultisigCreated(msg.sender, clone, _owners, _required);
        return clone;
    }

    /// @notice Xem toàn bộ quỹ đã tạo trên hệ thống
    function getMultisigs() external view returns (address[] memory) {
        return allMultisigs;
    }

    /// @notice Xem quỹ theo Owner (tiện cho Dashboard)
    function getMultisigsByOwner(address _owner) external view returns (address[] memory) {
        return userMultisigs[_owner];
    }

    /// @notice Tổng số quỹ đã tạo
    function getTotalMultisigs() external view returns (uint256) {
        return allMultisigs.length;
    }
}

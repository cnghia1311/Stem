// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IStemERC1155 {
    function mint(address account, uint256 id, uint256 amount, bytes memory data) external;
}

// ============================================================================
// Contract Trung Gian - Đúc Tự Do (Free Claim)
// Cho phép bất kỳ ai đúc huy hiệu từ một bộ sưu tập (đã cấp quyền MINTER_ROLE)
// ============================================================================
contract StemFreeMint1155 {
    // Hàm được học sinh gọi để đúc huy hiệu
    function claimBadge(address collection, uint256 tokenId, uint256 amount) public {
        // Gọi hàm mint trên contract StemERC1155.
        // Yêu cầu: Contract StemFreeMint1155 này phải được cấp quyền MINTER_ROLE trên collection đó
        IStemERC1155(collection).mint(msg.sender, tokenId, amount, "");
    }
}

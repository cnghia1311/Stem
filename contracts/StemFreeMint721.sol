// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IStemERC721 {
    function mintTemplateNFT(address to, uint256 templateId) external returns (uint256);
    function totalSupply() external view returns (uint256);
}

// ============================================================================
// Contract Trung Gian - Đúc NFT Tự Do (Free Claim ERC-721)
// Cho phép bất kỳ ai đúc NFT từ một bộ sưu tập (đã cấp quyền MINTER_ROLE) theo khuôn mẫu
// ============================================================================
contract StemFreeMint721 {
    // Hàm được học sinh gọi để đúc NFT theo Template ID
    function claimNFT(address collection, uint256 templateId) public returns (uint256) {
        // Kiểm tra collection phải là Smart Contract (không phải ví)
        uint256 codeSize;
        assembly { codeSize := extcodesize(collection) }
        require(codeSize > 0, "StemFreeMint721: collection is not a contract");

        // Ghi lại totalSupply trước khi mint để kiểm tra sau
        uint256 supplyBefore = IStemERC721(collection).totalSupply();

        // Gọi hàm mintTemplateNFT trên contract StemERC721.
        // Yêu cầu: Contract StemFreeMint721 này phải được giáo viên cấp quyền đúc
        uint256 tokenId = IStemERC721(collection).mintTemplateNFT(msg.sender, templateId);

        // Kiểm tra NFT thực sự đã được đúc
        require(IStemERC721(collection).totalSupply() > supplyBefore, "StemFreeMint721: Mint did not succeed");

        return tokenId;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract StemERC721 is
    Initializable,
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable,
    ERC721EnumerableUpgradeable,
    ERC721BurnableUpgradeable,
    ERC2981Upgradeable,
    OwnableUpgradeable
{
    // ==================== STORAGE ====================
    // CẢNH BÁO: Không được đổi thứ tự các biến — Beacon Proxy phụ thuộc vào slot

    uint256 private _nextTokenId;                           // slot 0
    bool public isSoulbound;                                // slot 1
    mapping(address => bool) private _minters;              // slot 2
    mapping(address => bool) private _templateCreators;     // slot 3
    mapping(uint256 => string) public templateURIs;         // slot 4 — giữ nguyên từ v1
    mapping(uint256 => uint256) public templateWeights;     // slot 5 — thêm mới
    uint256[] public templateIds;                           // slot 6 — thêm mới
    uint256 public totalWeight;                             // slot 7 — thêm mới

    // ==================== EVENTS ====================

    event TemplateSet(uint256 indexed templateId, string uri, uint256 weight);
    event MinterGranted(address indexed minter);
    event MinterRevoked(address indexed minter);

    // ==================== CONSTRUCTOR ====================

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // ==================== INITIALIZER ====================

    function initialize(
        string memory name_,
        string memory symbol_,
        address initialOwner,
        bool isSoulbound_
    ) public initializer {
        __ERC721_init(name_, symbol_);
        __ERC721URIStorage_init();
        __ERC721Enumerable_init();
        __ERC721Burnable_init();
        __ERC2981_init();
        __Ownable_init(initialOwner);

        isSoulbound = isSoulbound_;
        _setDefaultRoyalty(initialOwner, 500);
    }

    // ==================== MINTER ROLE ====================

    function isMinter(address account) public view returns (bool) {
        return _minters[account];
    }

    function grantMinterRole(address minter) public onlyOwner {
        _minters[minter] = true;
        emit MinterGranted(minter);
    }

    function revokeMinterRole(address minter) public onlyOwner {
        _minters[minter] = false;
        emit MinterRevoked(minter);
    }

    // ==================== TEMPLATE CREATOR ROLE ====================

    function isTemplateCreator(address account) public view returns (bool) {
        return _templateCreators[account];
    }

    function grantTemplateCreatorRole(address creator) public onlyOwner {
        _templateCreators[creator] = true;
    }

    function revokeTemplateCreatorRole(address creator) public onlyOwner {
        _templateCreators[creator] = false;
    }

    // ==================== TEMPLATE MANAGEMENT ====================

    /// @notice Thêm hoặc cập nhật một mẫu NFT trong collection
    /// @param templateId  ID của mẫu (do bạn tự đặt, bắt đầu từ 0)
    /// @param uri         IPFS URI metadata của mẫu này
    /// @param weight      Tỉ lệ xuất hiện khi gacha (số càng cao càng dễ ra)
    function setTemplate(
        uint256 templateId,
        string memory uri,
        uint256 weight
    ) public {
        require(
            owner() == msg.sender || _templateCreators[msg.sender],
            "StemERC721: Not authorized"
        );
        require(bytes(uri).length > 0, "StemERC721: URI cannot be empty");
        require(weight > 0, "StemERC721: Weight must be greater than 0");

        bool isNew = bytes(templateURIs[templateId]).length == 0;

        if (isNew) {
            templateIds.push(templateId);
            totalWeight += weight;
        } else {
            totalWeight = totalWeight - templateWeights[templateId] + weight;
        }

        templateURIs[templateId] = uri;
        templateWeights[templateId] = weight;

        emit TemplateSet(templateId, uri, weight);
    }

    /// @notice Thêm hoặc cập nhật NHIỀU mẫu NFT trong một giao dịch duy nhất
    /// @dev Chỉ thêm hàm, KHÔNG thêm biến storage → an toàn tuyệt đối cho Beacon upgrade
    /// @param ids      Danh sách templateId
    /// @param uris     Danh sách IPFS URI, cùng thứ tự với ids
    /// @param weights  Danh sách trọng số gacha, cùng thứ tự với ids
    function setTemplateBatch(
        uint256[] calldata ids,
        string[] calldata uris,
        uint256[] calldata weights
    ) external {
        require(
            owner() == msg.sender || _templateCreators[msg.sender],
            "StemERC721: Not authorized"
        );
        require(
            ids.length == uris.length && ids.length == weights.length,
            "StemERC721: Array length mismatch"
        );
        require(ids.length > 0, "StemERC721: Empty batch");
        require(ids.length <= 50, "StemERC721: Batch too large");

        for (uint256 i = 0; i < ids.length; i++) {
            uint256 templateId = ids[i];
            uint256 weight = weights[i];

            require(bytes(uris[i]).length > 0, "StemERC721: URI cannot be empty");
            require(weight > 0, "StemERC721: Weight must be greater than 0");

            bool isNew = bytes(templateURIs[templateId]).length == 0;

            if (isNew) {
                templateIds.push(templateId);
                totalWeight += weight;
            } else {
                totalWeight = totalWeight - templateWeights[templateId] + weight;
            }

            templateURIs[templateId] = uris[i];
            templateWeights[templateId] = weight;

            emit TemplateSet(templateId, uris[i], weight);
        }
    }

    /// @notice Lấy toàn bộ danh sách templateId của collection này
    function getTemplateIds() public view returns (uint256[] memory) {
        return templateIds;
    }

    /// @notice Lấy thông tin đầy đủ của một mẫu
    function getTemplate(uint256 templateId) public view returns (
        string memory uri,
        uint256 weight,
        bool exists
    ) {
        uri = templateURIs[templateId];
        weight = templateWeights[templateId];
        exists = bytes(uri).length > 0;
    }

    /// @notice Lấy thông tin tất cả mẫu trong 1 lần gọi — tiện cho JS đọc
    function getAllTemplates() public view returns (
        uint256[] memory ids,
        string[] memory uris,
        uint256[] memory weights
    ) {
        uint256 len = templateIds.length;
        ids     = new uint256[](len);
        uris    = new string[](len);
        weights = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            uint256 id = templateIds[i];
            ids[i]     = id;
            uris[i]    = templateURIs[id];
            weights[i] = templateWeights[id];
        }
    }

    // ==================== ROYALTY ====================

    function setRoyalty(address receiver, uint96 feeNumerator) public onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    // ==================== MINT ====================

    /// @notice Mint NFT với URI tùy chỉnh (không theo template)
    function mintNFT(address to, string memory uri) public returns (uint256) {
        require(
            owner() == msg.sender || _minters[msg.sender],
            "StemERC721: Not authorized to mint"
        );
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    /// @notice Mint NFT theo template — dùng cho Máy Gacha
    /// @dev JS chọn templateId random theo weight rồi gọi hàm này
    function mintTemplateNFT(address to, uint256 templateId) public returns (uint256) {
        require(
            owner() == msg.sender || _minters[msg.sender],
            "StemERC721: Not authorized to mint"
        );
        string memory uri = templateURIs[templateId];
        require(bytes(uri).length > 0, "StemERC721: Template does not exist");

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    // ==================== SOULBOUND ====================

    function revokeCertificate(uint256 tokenId) public onlyOwner {
        require(isSoulbound, "StemERC721: Can only revoke Soulbound tokens");
        _burn(tokenId);
    }

    // ==================== INTERNAL OVERRIDES ====================

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) returns (address) {
        address from = _ownerOf(tokenId);
        if (isSoulbound && from != address(0) && to != address(0)) {
            revert("StemERC721: Soulbound tokens cannot be transferred");
        }
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        super._increaseBalance(account, value);
    }

    // ==================== VIEW OVERRIDES ====================

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721Upgradeable, ERC721URIStorageUpgradeable) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(
        ERC721Upgradeable,
        ERC721EnumerableUpgradeable,
        ERC721URIStorageUpgradeable,
        ERC2981Upgradeable
    ) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
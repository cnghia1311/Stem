// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// ============================================================================
// Logic Contract cho ERC1155 (StemERC1155)
// Bản thân nó là Logic Contract (Implementation) được thiết kế cho Beacon Proxy.
// Phiên bản: V1
// ============================================================================
contract StemERC1155 is Initializable, ERC1155Upgradeable, ERC1155BurnableUpgradeable, ERC1155SupplyUpgradeable, ERC2981Upgradeable, OwnableUpgradeable, AccessControlUpgradeable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant TEMPLATE_CREATOR_ROLE = keccak256("TEMPLATE_CREATOR_ROLE");

    string public name;
    string public symbol;
    bool public isSoulbound;
    mapping(uint256 => string) private _tokenURIs;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(string memory name_, string memory symbol_, string memory uri_, address initialOwner, bool isSoulbound_) initializer public {
        __ERC1155_init(uri_);
        __ERC1155Burnable_init();
        __ERC1155Supply_init();
        __ERC2981_init();
        __Ownable_init(initialOwner);
        __AccessControl_init();

        name = name_;
        symbol = symbol_;
        isSoulbound = isSoulbound_;
        _setDefaultRoyalty(initialOwner, 500);
        
        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);
        _grantRole(MINTER_ROLE, initialOwner);
        _grantRole(TEMPLATE_CREATOR_ROLE, initialOwner);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function setTokenURI(uint256 tokenId, string memory newuri) public {
        require(owner() == msg.sender || hasRole(TEMPLATE_CREATOR_ROLE, msg.sender), "StemERC1155: Not authorized to set URI");
        _tokenURIs[tokenId] = newuri;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        string memory tokenURI = _tokenURIs[tokenId];
        if (bytes(tokenURI).length > 0) {
            return tokenURI;
        }
        return super.uri(tokenId);
    }

    function setRoyalty(address receiver, uint96 feeNumerator) public onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    function grantMinterRole(address minter) public onlyOwner {
        _grantRole(MINTER_ROLE, minter);
    }

    function revokeMinterRole(address minter) public onlyOwner {
        _revokeRole(MINTER_ROLE, minter);
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data) public {
        require(owner() == msg.sender || hasRole(MINTER_ROLE, msg.sender), "StemERC1155: Not authorized to mint");
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public {
        require(owner() == msg.sender || hasRole(MINTER_ROLE, msg.sender), "StemERC1155: Not authorized to mint");
        _mintBatch(to, ids, amounts, data);
    }

    function revokeBadge(address from, uint256 id, uint256 amount) public onlyOwner {
        require(isSoulbound, "StemERC1155: Can only revoke Soulbound badges");
        _burn(from, id, amount);
    }

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values) internal override(ERC1155Upgradeable, ERC1155SupplyUpgradeable) {
        if (isSoulbound && from != address(0) && to != address(0)) {
            revert("StemERC1155: Soulbound badges cannot be transferred");
        }
        super._update(from, to, ids, values);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC1155Upgradeable, ERC2981Upgradeable, AccessControlUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

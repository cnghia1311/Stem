// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// ============================================================================
// Token "Siêu Cấp" (Full Option: Transfer, Burn, Vote, Permit)
// Bản thân nó là Logic Contract (Implementation) được thiết kế cho Beacon Proxy.
// Phiên bản: V1
// ============================================================================
contract StemERC20 is Initializable, ERC20Upgradeable, ERC20BurnableUpgradeable, ERC20PermitUpgradeable, ERC20VotesUpgradeable {
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(string memory name, string memory symbol, uint256 initialSupply, address owner) initializer public {
        __ERC20_init(name, symbol);
        __ERC20Permit_init(name);
        __ERC20Burnable_init();
        __ERC20Votes_init();

        _mint(owner, initialSupply * 10 ** decimals());
    }

    // Bắt buộc override để giải quyết xung đột đa kế thừa
    function _update(address from, address to, uint256 value) internal override(ERC20Upgradeable, ERC20VotesUpgradeable) {
        super._update(from, to, value);
    }

    function nonces(address owner) public view override(ERC20PermitUpgradeable, NoncesUpgradeable) returns (uint256) {
        return super.nonces(owner);
    }
}

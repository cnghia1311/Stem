// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "./StemERC20.sol";

// ============================================================================
// 2. Token Factory (Beacon Proxy Pattern)
// ============================================================================
contract ERC20Factory {
    UpgradeableBeacon public immutable beacon;
    
    mapping(address => address[]) public userTokens;
    address[] public allTokens;

    event TokenCreated(address indexed creator, address tokenAddress, string name, string symbol, uint256 supply);

    constructor() {
        StemERC20 implementation = new StemERC20();
        beacon = new UpgradeableBeacon(address(implementation), msg.sender);
    }

    function createToken(string memory name, string memory symbol, uint256 initialSupply) public returns (address) {
        require(initialSupply > 0, "Supply must be > 0");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");

        bytes memory data = abi.encodeWithSelector(StemERC20.initialize.selector, name, symbol, initialSupply, msg.sender);
        BeaconProxy proxy = new BeaconProxy(address(beacon), data);
        address tokenAddr = address(proxy);

        userTokens[msg.sender].push(tokenAddr);
        allTokens.push(tokenAddr);

        emit TokenCreated(msg.sender, tokenAddr, name, symbol, initialSupply);
        return tokenAddr;
    }

    function getUserTokens(address user) public view returns (address[] memory) {
        return userTokens[user];
    }

    function getTotalTokens() public view returns (uint256) {
        return allTokens.length;
    }
}

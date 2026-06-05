// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CoinStaking.sol";

/**
 * @title StakingFactory
 * @notice Factory dùng để triển khai Ngân Hàng Tiết Kiệm.
 *         Giáo viên bấm nút → Deploy ra 1 Ngân Hàng chung cho cả lớp.
 */
contract StakingFactory {

    event StakingCreated(
        address indexed stakingAddress,
        string name,
        address indexed owner,
        address stakingToken,
        uint256 rewardRate,
        uint256 minLockTime
    );

    function createStaking(
        string memory _name,
        address _stakingToken,
        uint256 _rewardRatePerDay,
        uint256 _minLockTime
    ) external returns (address) {
        CoinStaking newStaking = new CoinStaking(
            _name,
            _stakingToken,
            _rewardRatePerDay,
            _minLockTime,
            msg.sender
        );

        emit StakingCreated(
            address(newStaking),
            _name,
            msg.sender,
            _stakingToken,
            _rewardRatePerDay,
            _minLockTime
        );

        return address(newStaking);
    }
}

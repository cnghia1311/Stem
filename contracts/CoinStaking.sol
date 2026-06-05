// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CoinStaking - Ngân Hàng Tiết Kiệm Coin
 * @notice Học sinh gửi Coin vào đây để nhận lãi suất theo thời gian.
 *         Giáo viên nạp quỹ dự trữ để trả lãi.
 *         Lãi suất: X Coin / ngày / 100 Coin gửi (tính chính xác từng giây).
 */

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function symbol() external view returns (string memory);
    function name() external view returns (string memory);
    function decimals() external view returns (uint8);
}

contract CoinStaking {

    IERC20 public stakingToken;
    address public owner;
    string public bankName;

    uint256 public rewardRatePerDay;

    uint256 public totalStaked;
    uint256 public rewardPool;
    uint256 public minLockTime;      // Thời gian khóa tối thiểu (giây)

    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public lastUpdateTime;
    mapping(address => uint256) public depositTime;  // Thời điểm gửi tiền cuối cùng

    bool private _locked;
    modifier nonReentrant() {
        require(!_locked, "ReentrancyGuard: reentrant call");
        _locked = true;
        _;
        _locked = false;
    }

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward);
    event RewardCompounded(address indexed user, uint256 reward);
    event RewardFunded(address indexed funder, uint256 amount);

    constructor(
        string memory _name,
        address _stakingToken,
        uint256 _rewardRatePerDay,
        uint256 _minLockTime,
        address _owner
    ) {
        bankName = _name;
        stakingToken = IERC20(_stakingToken);
        rewardRatePerDay = _rewardRatePerDay;
        minLockTime = _minLockTime;
        owner = _owner;
    }

    modifier updateReward(address _user) {
        if (stakedBalance[_user] > 0) {
            rewards[_user] += _calculateReward(_user);
        }
        lastUpdateTime[_user] = block.timestamp;
        _;
    }

    function _calculateReward(address _user) internal view returns (uint256) {
        if (stakedBalance[_user] == 0) return 0;
        uint256 elapsed = block.timestamp - lastUpdateTime[_user];
        return (stakedBalance[_user] * rewardRatePerDay * elapsed) / (100 * 1e18 * 86400);
    }

    function earned(address _user) external view returns (uint256) {
        return rewards[_user] + _calculateReward(_user);
    }

    function stake(uint256 _amount) external nonReentrant updateReward(msg.sender) {
        require(_amount > 0, "So luong phai > 0");
        require(stakingToken.transferFrom(msg.sender, address(this), _amount), "Chuyen Coin that bai");
        stakedBalance[msg.sender] += _amount;
        totalStaked += _amount;
        depositTime[msg.sender] = block.timestamp; // Reset lại thời gian khóa
        emit Staked(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) external nonReentrant updateReward(msg.sender) {
        require(_amount > 0, "So luong phai > 0");
        require(stakedBalance[msg.sender] >= _amount, "Khong du so du goc");
        require(block.timestamp >= depositTime[msg.sender] + minLockTime, "Chua het thoi gian khoa goc!");
        
        stakedBalance[msg.sender] -= _amount;
        totalStaked -= _amount;
        require(stakingToken.transfer(msg.sender, _amount), "Rut Coin that bai");
        emit Withdrawn(msg.sender, _amount);
    }

    function claimReward() external nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        require(reward > 0, "Chua co lai de thu hoach");
        require(reward <= rewardPool, "Quy du tru khong du");
        rewards[msg.sender] = 0;
        rewardPool -= reward;
        require(stakingToken.transfer(msg.sender, reward), "Tra lai that bai");
        emit RewardClaimed(msg.sender, reward);
    }

    function compoundReward() external nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        require(reward > 0, "Chua co lai de gop");
        require(reward <= rewardPool, "Quy du tru khong du");
        
        rewards[msg.sender] = 0;
        rewardPool -= reward;
        
        // Gộp lãi vào gốc
        stakedBalance[msg.sender] += reward;
        totalStaked += reward;
        depositTime[msg.sender] = block.timestamp; // Reset lại thời gian khóa
        
        emit RewardCompounded(msg.sender, reward);
    }

    function fundRewards(uint256 _amount) external nonReentrant {
        require(_amount > 0, "So luong phai > 0");
        require(stakingToken.transferFrom(msg.sender, address(this), _amount), "Nap tien that bai");
        rewardPool += _amount;
        emit RewardFunded(msg.sender, _amount);
    }

    function getRewardBalance() external view returns (uint256) {
        return rewardPool;
    }

    function getStakingInfo() external view returns (
        string memory _bankName,
        address _stakingToken,
        uint256 _rewardRatePerDay,
        uint256 _totalStaked,
        uint256 _rewardPool,
        uint256 _minLockTime,
        address _owner
    ) {
        return (bankName, address(stakingToken), rewardRatePerDay, totalStaked, rewardPool, minLockTime, owner);
    }
}

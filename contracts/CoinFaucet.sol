// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

// ============================================================================
// Két Sắt Bài Thi (CoinFaucet) — Dùng với CoinFaucetFactory (Clone Pattern)
// - Mỗi ví chỉ claim được 1 lần duy nhất
// - Chỉ ví trong Whitelist mới được claim
// - Owner có thể thu hồi tiền thừa và thêm Whitelist
// ============================================================================
contract CoinFaucet {
    bool private initialized;
    address public owner;
    IERC20 public token;
    uint256 public rewardAmount;

    // Whitelist: Chỉ những ví này mới được nhận thưởng
    mapping(address => bool) public isWhitelisted;

    // Sổ Đen: Đánh dấu ví đã nhận thưởng rồi
    mapping(address => bool) public hasClaimed;

    event Claimed(address indexed user, uint256 amount);
    event WhitelistAdded(address[] users);
    event Withdrawn(address indexed owner, uint256 amount);

    /// @notice Khởi tạo Két Sắt (Gọi bởi Factory sau khi Clone)
    function initialize(
        address _owner,
        address _token,
        uint256 _rewardAmount,
        address[] calldata _whitelistedUsers
    ) external {
        require(!initialized, "Already initialized");
        initialized = true;

        owner = _owner;
        token = IERC20(_token);
        rewardAmount = _rewardAmount;

        for (uint i = 0; i < _whitelistedUsers.length; i++) {
            isWhitelisted[_whitelistedUsers[i]] = true;
        }
    }

    /// @notice Học sinh gọi hàm này để nhận thưởng (1 lần duy nhất)
    function claim() external {
        require(isWhitelisted[msg.sender], "Not in whitelist");
        require(!hasClaimed[msg.sender], "Already claimed");
        require(token.balanceOf(address(this)) >= rewardAmount, "Faucet empty");

        hasClaimed[msg.sender] = true;
        require(token.transfer(msg.sender, rewardAmount), "Transfer failed");

        emit Claimed(msg.sender, rewardAmount);
    }

    /// @notice Giáo viên thêm ví học sinh vào Whitelist
    function addWhitelist(address[] calldata _users) external {
        require(msg.sender == owner, "Only owner");
        for (uint i = 0; i < _users.length; i++) {
            isWhitelisted[_users[i]] = true;
        }
        emit WhitelistAdded(_users);
    }

    /// @notice Giáo viên thu hồi toàn bộ tiền thừa về ví (Sau giờ thi)
    function withdrawRemaining() external {
        require(msg.sender == owner, "Only owner");
        uint256 bal = token.balanceOf(address(this));
        require(bal > 0, "No balance to withdraw");
        require(token.transfer(owner, bal), "Transfer failed");

        emit Withdrawn(owner, bal);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// ============================================================================
// Liquid Staking "Siêu Cấp" (Full Option: ERC-4626 + Permit + Burnable)
// Đã xóa Voting để tiết kiệm Phí Gas và tránh "Bỏ Phiếu Kép"
// ============================================================================
contract StemLiquidStaking is Initializable, ERC4626Upgradeable, ERC20BurnableUpgradeable, ERC20PermitUpgradeable {
    
    address public owner;
    
    // Nợ & Thanh khoản
    uint256 public totalBorrowed;

    // Khóa thanh khoản
    uint256 public minLockTime;
    mapping(address => uint256) public depositTime;

    event YieldAdded(address indexed funder, uint256 amount);
    event Borrowed(address indexed owner, uint256 amount);
    event Repaid(address indexed owner, uint256 principal, uint256 interest);
    event LossDeclared(address indexed owner, uint256 amount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        IERC20 _asset,
        string memory _name,
        string memory _symbol,
        address _owner,
        uint256 _minLockTime
    ) initializer public {
        __ERC20_init(_name, _symbol);
        __ERC4626_init(_asset);
        __ERC20Permit_init(_name);
        __ERC20Burnable_init();

        owner = _owner;
        minLockTime = _minLockTime * 1 minutes;
    }

    // ==========================================
    // CƠ CHẾ NỢ (FRACTIONAL RESERVE)
    // ==========================================

    /**
     * @dev Override lại tổng tài sản: Bằng tiền mặt + Tiền nợ
     */
    function totalAssets() public view virtual override returns (uint256) {
        return super.totalAssets() + totalBorrowed;
    }

    /**
     * @dev Giáo viên rút thanh khoản đi đầu tư. Tỷ giá không đổi.
     */
    function borrow(uint256 amount) external {
        require(msg.sender == owner, "Chi Giao vien moi duoc vay");
        require(totalSupply() > 0, "Chua co ai mua Chung chi"); // Ngăn rút vốn nếu quỹ trống
        require(amount <= super.totalAssets(), "Quy khong du tien mat"); // Chỉ so sánh với tiền mặt
        
        totalBorrowed += amount;
        require(IERC20(asset()).transfer(owner, amount), "Loi rut tien");
        
        emit Borrowed(msg.sender, amount);
    }

    /**
     * @dev Giáo viên trả lại vốn đã vay + bơm thêm lãi (nếu có).
     *      Khoản lãi sẽ lập tức làm tăng tỷ giá Chứng chỉ.
     */
    function repay(uint256 principal, uint256 interest) external {
        require(msg.sender == owner, "Chi Giao vien");
        require(principal <= totalBorrowed, "Tra goc nhieu hon No");
        if (interest > 0) {
            require(totalSupply() > 0, "Chua co ai mua Chung chi"); // Ngăn bơm lãi nếu quỹ trống
        }
        
        uint256 totalAmount = principal + interest;
        require(totalAmount > 0, "So luong > 0");

        totalBorrowed -= principal;
        require(IERC20(asset()).transferFrom(msg.sender, address(this), totalAmount), "Loi tra tien");

        if (interest > 0) {
            emit YieldAdded(msg.sender, interest);
        }
        emit Repaid(msg.sender, principal, interest);
    }

    /**
     * @dev Khai báo thua lỗ (Xóa nợ xấu)
     *      Khoản lỗ sẽ ngay lập tức chia đều cho toàn bộ Chứng chỉ (làm giảm tỷ giá).
     */
    function declareLoss(uint256 lostAmount) external {
        require(msg.sender == owner, "Chi Giao vien");
        require(lostAmount > 0, "So luong > 0");
        require(lostAmount <= totalBorrowed, "Khong the lo nhieu hon so no");
        
        totalBorrowed -= lostAmount;
        emit LossDeclared(msg.sender, lostAmount);
    }

    // ==========================================
    // CƠ CHẾ KHÓA THANH KHOẢN (ANTI BANK-RUN)
    // ==========================================

    /**
     * @dev Override hàm chuyển Chứng chỉ: Không cho chuyển nếu chưa hết hạn khóa. Vá lỗi Hacker.
     */
    function _update(address from, address to, uint256 value) internal override(ERC20Upgradeable) {
        if (from != address(0)) { // Bỏ qua lúc Mint
            require(block.timestamp >= depositTime[from] + minLockTime, "Chung chi dang bi Khoa");
        }
        super._update(from, to, value);
    }

    /**
     * @dev Override hàm gửi tiền: Đặt lại đồng hồ khóa.
     */
    function deposit(uint256 assets, address receiver) public virtual override returns (uint256) {
        depositTime[receiver] = block.timestamp;
        return super.deposit(assets, receiver);
    }

    function mint(uint256 shares, address receiver) public virtual override returns (uint256) {
        depositTime[receiver] = block.timestamp;
        return super.mint(shares, receiver);
    }

    // ==========================================
    // CÁC HÀM CƠ BẢN KHÁC CỦA STEM ERC-20
    // ==========================================



    function decimals() public view override(ERC20Upgradeable, ERC4626Upgradeable) returns (uint8) {
        return super.decimals();
    }
}

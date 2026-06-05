// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StemLaunchpad is Initializable {
    IERC20 public projectToken; // Token B (Token dự án bán)
    IERC20 public paymentToken; // Token A (Coin gọi vốn, VD: ClassCoin)

    address public projectOwner; // Chủ dự án (Học sinh lập dự án)

    uint256 public rate; // Tỷ giá: 1 Token A = bao nhiêu Token B?
    uint256 public softCap; // Mục tiêu tối thiểu (Tính bằng Token A)
    uint256 public hardCap; // Mục tiêu tối đa (Tính bằng Token A)
    uint256 public endTime; // Thời gian kết thúc

    uint256 public totalRaised; // Tổng số tiền đã gọi được
    mapping(address => uint256) public contributions; // Số tiền mỗi Shark đã nạp
    mapping(address => bool) public hasClaimed; // Đã nhận Token (hoặc rút tiền) chưa?

    bool public isFinalized; // Đã chốt sổ chưa?
    bool public isSuccessful; // Gọi vốn thành công hay thất bại?

    event Invested(address indexed investor, uint256 amount);
    event Finalized(bool success, uint256 totalRaised);
    event Claimed(address indexed investor, uint256 projectTokenAmount);
    event Refunded(address indexed investor, uint256 paymentTokenAmount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _projectOwner,
        address _projectToken,
        address _paymentToken,
        uint256 _rate,
        uint256 _softCap,
        uint256 _hardCap,
        uint256 _durationMinutes
    ) public initializer {
        projectOwner = _projectOwner;
        projectToken = IERC20(_projectToken);
        paymentToken = IERC20(_paymentToken);
        rate = _rate;
        softCap = _softCap;
        hardCap = _hardCap;
        endTime = block.timestamp + (_durationMinutes * 1 minutes);
    }

    // 1. CHỨC NĂNG ĐẦU TƯ (Dành cho Sharks)
    function invest(uint256 amount) external {
        require(!isFinalized, "Launchpad da chot so");
        require(block.timestamp <= endTime, "Launchpad da het han");
        require(amount > 0, "So tien phai > 0");
        require(totalRaised + amount <= hardCap, "Vuot qua Hard Cap!");

        // BẮT BUỘC Chủ dự án phải bơm đủ hàng vào Kho thì mới cho Shark mua
        require(
            projectToken.balanceOf(address(this)) >= (hardCap * rate),
            "Chu du an chua nap du Hang vao kho!"
        );

        totalRaised += amount;
        contributions[msg.sender] += amount;

        // Trừ tiền Token A của Shark
        require(
            paymentToken.transferFrom(msg.sender, address(this), amount),
            "Loi chuyen tien"
        );

        emit Invested(msg.sender, amount);
    }

    // 2. CHỐT SỔ (Chủ dự án gọi)
    function finalize() external {
        require(msg.sender == projectOwner, "Chi Chu du an moi duoc chot so");
        require(!isFinalized, "Da chot so roi");

        // Điều kiện chốt sổ: Đã hết thời gian HOẶC đã chạm mức Hard Cap
        require(
            block.timestamp > endTime || totalRaised == hardCap,
            "Chua den luc chot so"
        );

        isFinalized = true;

        if (totalRaised >= softCap) {
            isSuccessful = true;
            // Trả tiền Token A cho chủ dự án đi làm ăn
            require(
                paymentToken.transfer(projectOwner, totalRaised),
                "Loi rut tien cho Owner"
            );

            // Trả lại Token B bị thừa (do không bán hết Hard Cap) cho chủ dự án
            uint256 tokensSold = totalRaised * rate;
            uint256 balanceB = projectToken.balanceOf(address(this));
            if (balanceB > tokensSold) {
                projectToken.transfer(projectOwner, balanceB - tokensSold);
            }
        } else {
            isSuccessful = false;
            // Thất bại -> Trả lại toàn bộ Token B cho chủ dự án
            uint256 balanceB = projectToken.balanceOf(address(this));
            if (balanceB > 0) {
                projectToken.transfer(projectOwner, balanceB);
            }
        }

        emit Finalized(isSuccessful, totalRaised);
    }

    // 3. NHẬN TOKEN HOẶC HOÀN TIỀN (Dành cho Sharks)
    function claimOrRefund() external {
        require(isFinalized, "Chua chot so, chua the rut");
        require(contributions[msg.sender] > 0, "Ban khong dau tu");
        require(!hasClaimed[msg.sender], "Da nhan hoac rut tien roi");

        hasClaimed[msg.sender] = true;
        uint256 amountA = contributions[msg.sender];

        if (isSuccessful) {
            // Thành công -> Phát Token B
            uint256 amountB = amountA * rate;
            require(
                projectToken.transfer(msg.sender, amountB),
                "Loi phat Token B"
            );
            emit Claimed(msg.sender, amountB);
        } else {
            // Thất bại -> Hoàn lại Token A
            require(
                paymentToken.transfer(msg.sender, amountA),
                "Loi hoan tien Token A"
            );
            emit Refunded(msg.sender, amountA);
        }
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// ============================================================================
// Quỹ Lớp Đa Chữ Ký (Multisig Treasury)
// - Hỗ trợ cả Native Coin (ETH/BNB) và Token ERC-20
// - Cần nhiều người ký duyệt (M-of-N) trước khi giải ngân
// - Bất biến sau khi deploy (dùng làm implementation cho EIP-1167 Clone)
// ============================================================================
contract StemMultisig is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // --- Storage ---
    address[] public owners;
    uint256 public required; // Số chữ ký tối thiểu để thực thi
    bool private _initialized; // Chặn gọi initialize 2 lần

    mapping(address => bool) public isOwner;

    struct Transaction {
        address to;               // Ví người nhận
        uint256 value;            // Số Native Coin (0 nếu rút ERC-20)
        address token;            // Địa chỉ ERC-20 (address(0) nếu rút Native)
        uint256 tokenAmount;      // Số Token ERC-20 (0 nếu rút Native)
        bool executed;            // Đã thực thi chưa
        uint256 numConfirmations; // Số người đã ký
    }

    Transaction[] public transactions;
    // txId => owner => đã ký chưa
    mapping(uint256 => mapping(address => bool)) public confirmed;

    // --- Events ---
    event Deposit(address indexed sender, uint256 amount);
    event DepositERC20(address indexed sender, address indexed token, uint256 amount);
    event SubmitTransaction(
        address indexed creator,
        uint256 indexed txId,
        address to,
        uint256 value,
        address token,
        uint256 tokenAmount,
        string note
    );
    event ConfirmTransaction(address indexed owner, uint256 indexed txId);
    event RevokeConfirmation(address indexed owner, uint256 indexed txId);
    event ExecuteTransaction(address indexed owner, uint256 indexed txId);

    // --- Modifiers ---
    modifier onlyOwner() {
        require(isOwner[msg.sender], "Khong phai Owner");
        _;
    }

    modifier txExists(uint256 _txId) {
        require(_txId < transactions.length, "Lenh khong ton tai");
        _;
    }

    modifier notExecuted(uint256 _txId) {
        require(!transactions[_txId].executed, "Lenh da thuc thi roi");
        _;
    }

    // --- Khởi tạo (gọi 1 lần duy nhất bởi Factory) ---
    function initialize(address[] calldata _owners, uint256 _required) external {
        require(!_initialized, "Da khoi tao roi");
        require(_owners.length > 0, "Can it nhat 1 Owner");
        require(_required > 0 && _required <= _owners.length, "So chu ky khong hop le");

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Owner khong hop le");
            require(!isOwner[owner], "Owner bi trung");

            isOwner[owner] = true;
            owners.push(owner);
        }
        required = _required;
        _initialized = true;
    }

    // --- Nhận Native Coin ---
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function deposit() external payable {
        require(msg.value > 0, "Can gui kem ETH");
        emit Deposit(msg.sender, msg.value);
    }

    // --- Nhận Token ERC-20 (cần approve trước) ---
    function depositERC20(address _token, uint256 _amount) external {
        require(_token != address(0), "Dia chi Token khong hop le");
        require(_amount > 0, "So luong phai > 0");

        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
        emit DepositERC20(msg.sender, _token, _amount);
    }

    // --- Tạo Đề Xuất Rút Tiền (ai cũng được tạo — Dân chủ) ---
    function submitTransaction(
        address _to,
        uint256 _value,
        address _token,
        uint256 _tokenAmount,
        string calldata _note
    ) external {
        require(_to != address(0), "Dia chi nhan khong hop le");
        // Phải chọn 1 trong 2: Native hoặc ERC-20
        require(
            (_value > 0 && _token == address(0) && _tokenAmount == 0) ||
            (_value == 0 && _token != address(0) && _tokenAmount > 0),
            "Chi duoc rut Native HOAC ERC-20"
        );

        uint256 txId = transactions.length;
        transactions.push(Transaction({
            to: _to,
            value: _value,
            token: _token,
            tokenAmount: _tokenAmount,
            executed: false,
            numConfirmations: 0
        }));

        emit SubmitTransaction(msg.sender, txId, _to, _value, _token, _tokenAmount, _note);
    }

    // --- Ký Duyệt (chỉ Owner) ---
    function confirmTransaction(uint256 _txId)
        external
        onlyOwner
        txExists(_txId)
        notExecuted(_txId)
    {
        require(!confirmed[_txId][msg.sender], "Ban da ky roi");

        confirmed[_txId][msg.sender] = true;
        transactions[_txId].numConfirmations++;

        emit ConfirmTransaction(msg.sender, _txId);
    }

    // --- Rút Chữ Ký (trước khi thực thi) ---
    function revokeConfirmation(uint256 _txId)
        external
        onlyOwner
        txExists(_txId)
        notExecuted(_txId)
    {
        require(confirmed[_txId][msg.sender], "Ban chua ky lenh nay");

        confirmed[_txId][msg.sender] = false;
        transactions[_txId].numConfirmations--;

        emit RevokeConfirmation(msg.sender, _txId);
    }

    // --- Thực Thi Lệnh (khi đủ chữ ký) ---
    function executeTransaction(uint256 _txId)
        external
        onlyOwner
        txExists(_txId)
        notExecuted(_txId)
        nonReentrant
    {
        Transaction storage txn = transactions[_txId];
        require(txn.numConfirmations >= required, "Chua du chu ky");

        txn.executed = true;

        if (txn.token == address(0)) {
            // Rút Native Coin
            require(address(this).balance >= txn.value, "Quy khong du so du ETH");
            (bool success, ) = txn.to.call{value: txn.value}("");
            require(success, "Chuyen ETH that bai");
        } else {
            // Rút Token ERC-20
            require(
                IERC20(txn.token).balanceOf(address(this)) >= txn.tokenAmount,
                "Quy khong du so du Token"
            );
            IERC20(txn.token).safeTransfer(txn.to, txn.tokenAmount);
        }

        emit ExecuteTransaction(msg.sender, _txId);
    }

    // --- View Functions ---
    function getOwners() external view returns (address[] memory) {
        return owners;
    }

    function getTransactionCount() external view returns (uint256) {
        return transactions.length;
    }

    function getTransaction(uint256 _txId)
        external
        view
        txExists(_txId)
        returns (
            address to,
            uint256 value,
            address token,
            uint256 tokenAmount,
            bool executed,
            uint256 numConfirmations
        )
    {
        Transaction memory txn = transactions[_txId];
        return (txn.to, txn.value, txn.token, txn.tokenAmount, txn.executed, txn.numConfirmations);
    }

    function getERC20Balance(address _token) external view returns (uint256) {
        return IERC20(_token).balanceOf(address(this));
    }
}

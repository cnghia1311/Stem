// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title NFTAuctionHouse - Sàn Đấu Giá NFT bằng Coin ERC-20
 * @notice Mỗi phiên đấu giá cho phép người bán chọn loại Coin (ERC-20) riêng.
 *         Người mua phải bỏ thầu bằng đúng loại Coin đó.
 *         Mô hình English Auction: Ai trả giá cao nhất khi hết giờ sẽ thắng.
 */

// Inline interfaces (không cần OpenZeppelin)
interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address);
    function transferFrom(address from, address to, uint256 tokenId) external;
}

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract NFTAuctionHouse {
    
    struct Auction {
        address seller;
        address nftContract;
        uint256 tokenId;
        address paymentToken;   // Loại Coin ERC-20 dùng để bỏ thầu
        uint256 startingPrice;  // Giá khởi điểm
        uint256 highestBid;     // Giá cao nhất hiện tại
        address highestBidder;  // Người đang giữ Top 1
        uint256 endTime;        // Thời điểm kết thúc (Unix timestamp)
        bool ended;             // Đã chốt đơn chưa?
        bool cancelled;         // Đã hủy chưa?
    }

    uint256 public totalAuctions;
    mapping(uint256 => Auction) public auctions;
    
    // Tiền bị khóa (Coin mà người trước đã bỏ thầu nhưng bị đánh bật → rút lại sau)
    mapping(uint256 => mapping(address => uint256)) public pendingReturns;

    address public owner;
    string public auctionHouseName;

    // Chống reentrancy
    bool private _locked;
    modifier nonReentrant() {
        require(!_locked, "ReentrancyGuard: reentrant call");
        _locked = true;
        _;
        _locked = false;
    }

    event AuctionCreated(uint256 indexed auctionId, address indexed seller, address nftContract, uint256 tokenId, address paymentToken, uint256 startingPrice, uint256 endTime);
    event BidPlaced(uint256 indexed auctionId, address indexed bidder, uint256 amount);
    event AuctionEnded(uint256 indexed auctionId, address winner, uint256 amount);
    event AuctionCancelled(uint256 indexed auctionId);
    event FundsWithdrawn(uint256 indexed auctionId, address indexed bidder, uint256 amount);

    constructor(string memory _name, address _owner) {
        owner = _owner;
        auctionHouseName = _name;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Chi chu san moi duoc phep");
        _;
    }

    /**
     * @notice Mở phiên đấu giá mới
     */
    function createAuction(
        address _nftContract,
        uint256 _tokenId,
        address _paymentToken,
        uint256 _startingPrice,
        uint256 _durationMinutes
    ) external returns (uint256) {
        require(_durationMinutes >= 1 && _durationMinutes <= 10080, "Thoi gian: 1 phut - 7 ngay");
        require(_startingPrice > 0, "Gia khoi diem phai > 0");

        IERC721 nft = IERC721(_nftContract);
        require(nft.ownerOf(_tokenId) == msg.sender, "Ban khong so huu NFT nay");
        nft.transferFrom(msg.sender, address(this), _tokenId);

        totalAuctions++;
        uint256 auctionId = totalAuctions;
        uint256 endTime = block.timestamp + (_durationMinutes * 1 minutes);

        auctions[auctionId] = Auction({
            seller: msg.sender,
            nftContract: _nftContract,
            tokenId: _tokenId,
            paymentToken: _paymentToken,
            startingPrice: _startingPrice,
            highestBid: 0,
            highestBidder: address(0),
            endTime: endTime,
            ended: false,
            cancelled: false
        });

        emit AuctionCreated(auctionId, msg.sender, _nftContract, _tokenId, _paymentToken, _startingPrice, endTime);
        return auctionId;
    }

    /**
     * @notice Bỏ thầu (Bid) vào phiên đấu giá
     */
    function bid(uint256 _auctionId, uint256 _amount) external nonReentrant {
        Auction storage a = auctions[_auctionId];
        require(!a.ended && !a.cancelled, "Phien da ket thuc hoac bi huy");
        require(block.timestamp < a.endTime, "Het thoi gian dau gia");
        require(msg.sender != a.seller, "Chu nhan khong duoc tu dau gia");
        require(_amount >= a.startingPrice, "Gia phai >= gia khoi diem");
        require(_amount > a.highestBid, "Gia phai cao hon gia hien tai");

        IERC20 token = IERC20(a.paymentToken);
        require(token.transferFrom(msg.sender, address(this), _amount), "Chuyen Coin that bai");

        if (a.highestBidder != address(0)) {
            pendingReturns[_auctionId][a.highestBidder] += a.highestBid;
        }

        a.highestBid = _amount;
        a.highestBidder = msg.sender;

        emit BidPlaced(_auctionId, msg.sender, _amount);
    }

    /**
     * @notice Chốt đơn - Kết thúc phiên đấu giá (Ai cũng có thể gọi khi hết giờ)
     */
    function endAuction(uint256 _auctionId) external nonReentrant {
        Auction storage a = auctions[_auctionId];
        require(!a.ended && !a.cancelled, "Phien da ket thuc hoac bi huy");
        require(block.timestamp >= a.endTime, "Chua het thoi gian dau gia");

        a.ended = true;

        if (a.highestBidder != address(0)) {
            IERC721(a.nftContract).transferFrom(address(this), a.highestBidder, a.tokenId);
            IERC20(a.paymentToken).transfer(a.seller, a.highestBid);
        } else {
            IERC721(a.nftContract).transferFrom(address(this), a.seller, a.tokenId);
        }

        emit AuctionEnded(_auctionId, a.highestBidder, a.highestBid);
    }

    /**
     * @notice Hủy phiên đấu giá (Chỉ người bán, và chỉ khi chưa có ai bỏ thầu)
     */
    function cancelAuction(uint256 _auctionId) external {
        Auction storage a = auctions[_auctionId];
        require(msg.sender == a.seller, "Chi nguoi ban moi duoc huy");
        require(!a.ended && !a.cancelled, "Phien da ket thuc hoac bi huy");
        require(a.highestBidder == address(0), "Da co nguoi bo thau, khong the huy");

        a.cancelled = true;
        IERC721(a.nftContract).transferFrom(address(this), a.seller, a.tokenId);

        emit AuctionCancelled(_auctionId);
    }

    /**
     * @notice Rút lại Coin cho những người bị đánh bật (không thắng)
     */
    function withdraw(uint256 _auctionId) external nonReentrant {
        uint256 amount = pendingReturns[_auctionId][msg.sender];
        require(amount > 0, "Khong co tien de rut");

        pendingReturns[_auctionId][msg.sender] = 0;
        
        Auction storage a = auctions[_auctionId];
        require(IERC20(a.paymentToken).transfer(msg.sender, amount), "Rut tien that bai");

        emit FundsWithdrawn(_auctionId, msg.sender, amount);
    }

    /**
     * @notice Đọc thông tin phiên đấu giá
     */
    function getAuction(uint256 _auctionId) external view returns (
        address seller,
        address nftContract,
        uint256 tokenId,
        address paymentToken,
        uint256 startingPrice,
        uint256 highestBid,
        address highestBidder,
        uint256 endTime,
        bool ended,
        bool cancelled
    ) {
        Auction storage a = auctions[_auctionId];
        return (a.seller, a.nftContract, a.tokenId, a.paymentToken, a.startingPrice, a.highestBid, a.highestBidder, a.endTime, a.ended, a.cancelled);
    }
}

// Mock blocks metadata — sẽ thay bằng API khi có backend
// contractFields: danh sách ô nhập contract mà block cần user điền
const BLOCKS_META = [
  {
    id: 'wallet', name: '🦊 Kết Nối Ví', desc: 'Nút MetaMask + Hiện địa chỉ',
    color: '#f59e0b', label: 'Ví của tôi', required: true,
    contractFields: [] // Wallet không cần contract
  },
  {
    id: 'balance', name: '💰 Hiện Số Dư Token', desc: 'Chọn coin từ danh sách',
    color: '#10b981', label: 'Số dư tài khoản',
    contractFields: [
      { key: 'tokenAddress', label: 'Địa chỉ Token (ERC-20)', placeholder: '0x... (địa chỉ contract token)' }
    ]
  },
  {
    id: 'transfer', name: '🚀 Chuyển Token', desc: 'Gửi coin đến địa chỉ khác',
    color: '#3b82f6', label: 'Chuyển tiền',
    contractFields: [
      { key: 'tokenAddress', label: 'Địa chỉ Token (ERC-20)', placeholder: '0x... (địa chỉ contract token)' }
    ]
  },
  {
    id: 'wrap-eth', name: '🔄 Đổi WETH', desc: 'Wrap ETH sang WETH hoặc ngược lại (Sepolia)',
    color: '#eab308', label: 'Wrap WETH',
    contractFields: []
  },
  {
    id: 'claim', name: '🎁 Nhận Lộng (Claim)', desc: 'Nhận Token miễn phí',
    color: '#3b82f6', label: 'Nhận lộng',
    contractFields: [
      { key: 'claimContract', label: 'Contract Claim', placeholder: '0x... (contract cho phép claim)' }
    ]
  },



  {
    id: 'profile-gallery', name: '🪪 Thẻ Danh Tính SBT', desc: 'Soulbound Token cá nhân',
    color: '#f97316', label: 'Profile',
    contractFields: [
      { key: 'sbtContract', label: 'Contract SBT (ERC-1155)', placeholder: '0x... (Soulbound Token contract)' }
    ]
  },
  {
    id: 'market-list', name: '📝 Đăng Bán NFT', desc: 'Liệt kê NFT để bán',
    color: '#06b6d4', label: 'Đăng bán',
    contractFields: [
      { key: 'marketplaceContract', label: 'Contract Marketplace', placeholder: '0x... (Thirdweb Marketplace)' },
      { key: 'nftContract', label: 'Contract NFT', placeholder: '0x... (NFT collection contract)' }
    ]
  },
  {
    id: 'market-cancel', name: '❌ Hủy Bán NFT', desc: 'Hủy lệnh bán NFT',
    color: '#ef4444', label: 'Hủy bán',
    contractFields: [
      { key: 'marketplaceContract', label: 'Contract Marketplace', placeholder: '0x... (Thirdweb Marketplace)' }
    ]
  },
  {
    id: 'market-shop', name: '🛒 Cửa Hàng NFT', desc: 'Mua NFT từ marketplace',
    color: '#22c55e', label: 'Cửa Hàng',
    contractFields: [
      { key: 'marketplaceContract', label: 'Contract Marketplace', placeholder: '0x... (Thirdweb Marketplace)' }
    ]
  },
  {
    id: 'uniswap-v3-sell', name: '🦄 Swap Token (DEX)', desc: 'Đổi token qua Uniswap V3',
    color: '#ff007a', label: 'Swap',
    contractFields: [
      { key: 'routerAddress', label: 'Router Uniswap V3', placeholder: '0x... (SwapRouter address)' },
      { key: 'tokenIn', label: 'Token In (bán)', placeholder: '0x... (token muốn bán)' },
      { key: 'tokenOut', label: 'Token Out (mua)', placeholder: '0x... (token muốn mua)' }
    ]
  },
  {
    id: 'gecko-chart', name: '📈 Biểu Đồ Giá', desc: 'Chart giá coin realtime',
    color: '#84cc16', label: 'Biểu đồ',
    contractFields: [
      { key: 'poolAddress', label: 'Pool Address (GeckoTerminal)', placeholder: '0x... (địa chỉ pool trên DEX)' }
    ]
  },
  {
    id: 'gecko-txns', name: '📊 Lịch Sử Giao Dịch', desc: 'Bảng transactions gần nhất',
    color: '#a855f7', label: 'Giao dịch',
    contractFields: [
      { key: 'poolAddress', label: 'Pool Address (GeckoTerminal)', placeholder: '0x... (địa chỉ pool trên DEX)' }
    ]
  },
  {
    id: 'dao-token-voting', name: '🗳️ Bầu Cử Bằng Token', desc: 'Bỏ phiếu DAO (1 Token = 1 Điểm)',
    color: '#eab308', label: 'Bầu cử',
    contractFields: [
      { key: 'votingContract', label: 'Contract Voting', placeholder: '0x... (địa chỉ RealTokenVoting)' }
    ]
  },
  {
    id: 'uniswap-v3-lp', name: '💧 Cung Cấp Thanh Khoản', desc: 'Tạo Pool & thêm thanh khoản Uniswap V3',
    color: '#06b6d4', label: 'Thanh Khoản',
    contractFields: []
  },
  {
    id: 'erc20-factory', name: '🏭 Khởi Tạo Token (ERC20)', desc: 'Tạo Hợp đồng Token kỹ thuật số của riêng bạn',
    color: '#f59e0b', label: 'Khởi Tạo Token',
    contractFields: []
  },
  {
    id: 'erc721-factory', name: '🎨 Khởi Tạo Bộ Sưu Tập (ERC721)', desc: 'Tạo Bộ sưu tập Vật phẩm độc bản của riêng bạn',
    color: '#8b5cf6', label: 'Khởi Tạo Bộ Sưu Tập',
    contractFields: []
  },
  {
    id: 'mint-nft', name: '🖌️ Đúc NFT (Mint)', desc: 'Upload ảnh & Mint NFT vào Bộ Sưu Tập',
    color: '#ec4899', label: 'Đúc NFT',
    contractFields: []
  },
  {
    id: 'market-factory', name: '🏪 Khởi Tạo Chợ Giao Dịch', desc: 'Tạo Sàn Giao Dịch Vật phẩm (Marketplace) của riêng bạn',
    color: '#06b6d4', label: 'Khởi Tạo Chợ Giao Dịch',
    contractFields: []
  },
  {
    id: 'voting-factory', name: '🗳️ Khởi Tạo Bỏ Phiếu (DAO)', desc: 'Tạo cuộc Bầu cử minh bạch với Token',
    color: '#eab308', label: 'Khởi Tạo Bỏ Phiếu',
    contractFields: []
  },
  {
    id: 'admin-revoke', name: '🔥 Thu Hồi Vật Phẩm', desc: 'Admin thu hồi và đốt vật phẩm/chứng chỉ đã cấp phát nhầm',
    color: '#ef4444', label: 'Thu Hồi Vật Phẩm',
    contractFields: []
  },
  {
    id: 'erc1155-factory', name: '🏅 Khởi Tạo Bộ Vật Phẩm (ERC1155)', desc: 'Tạo Bộ sưu tập đa năng (Nhiều bản sao) của riêng bạn',
    color: '#10b981', label: 'Khởi Tạo Bộ Vật Phẩm',
    contractFields: []
  },
  {
    id: 'mint-1155', name: '🎖️ Đúc Huy Hiệu (Mint 1155)', desc: 'Đúc Huy hiệu / Vật phẩm vào bộ sưu tập ERC-1155',
    color: '#06b6d4', label: 'Đúc Huy Hiệu',
    contractFields: []
  },
  {
    id: 'update-erc1155', name: '🎨 Tạo Huy Hiệu (Upload 1155)', desc: 'Kéo thả ảnh và Tạo / Mint Huy hiệu mới chuẩn ERC-1155',
    color: '#6366f1', label: 'Tạo Huy Hiệu',
    contractFields: []
  },
  {
    id: 'grant-minter-1155', name: '🔑 Ủy Quyền Đúc Huy Hiệu', desc: 'Cấp quyền hoặc Thu hồi quyền đúc cho Máy Gacha, Máy Airdrop, Máy Free Claim...',
    color: '#f59e0b', label: 'Ủy Quyền Đúc',
    contractFields: []
  },
  {
    id: 'free-claim-1155', name: '🎁 Đúc Huy Hiệu Tự Do', desc: 'Học sinh tự do đúc Huy hiệu về ví qua máy phát trung gian',
    color: '#ec4899', label: 'Nhận Huy Hiệu Tự Do',
    contractFields: []
  },
  {
    id: 'grant-minter-721', name: '🔑 Ủy Quyền Đúc NFT', desc: 'Cấp quyền hoặc Thu hồi quyền đúc cho Máy Gacha, Máy Airdrop, Máy Free Claim...',
    color: '#f59e0b', label: 'Ủy Quyền Đúc NFT',
    contractFields: []
  },
  {
    id: 'update-erc721', name: '🎨 Tạo Mẫu NFT', desc: 'Giáo viên tải ảnh lên để gài sẵn Khuôn Mẫu (Template) cho học sinh đúc',
    color: '#6366f1', label: 'Tạo Mẫu NFT',
    contractFields: []
  },
  {
    id: 'free-claim-721', name: '🎁 Đúc NFT Tự Do', desc: 'Học sinh đúc NFT về ví dựa trên Khuôn Mẫu (Template ID) của giáo viên',
    color: '#ec4899', label: 'Nhận NFT Tự Do',
    contractFields: []
  },
  {
    id: 'mint-erc721-random',
    name: '🎰 Máy Gacha NFT',
    desc: 'Mint NFT random theo danh sách mẫu có sẵn (templateId), animation mở rương kiểu CSGO. Cấp/Thu hồi quyền đúc cho Máy Gacha.',
    color: '#f59e0b',
    label: 'Mint ERC721 Random',
    contractFields: [
      { key: 'collection', label: 'Địa chỉ Collection (ERC-721)', placeholder: '0x... (danh sách mẫu NFT)' },
      { key: 'minter', label: 'Địa chỉ Máy Gacha', placeholder: '0x... (contract cấp quyềnMint)' }
    ]
  },
  {
    id: 'multisig-factory',
    name: '🏛️ Khởi Tạo Quỹ Lớp (Đa Chữ Ký)',
    desc: 'Tạo Quỹ lớp mới với nhiều người quản lý, cần đủ chữ ký mới rút được tiền',
    color: '#6366f1',
    label: 'Tạo Quỹ Lớp',
    contractFields: []
  },
  {
    id: 'multisig-deposit',
    name: '💰 Đóng Quỹ / Nạp Tiền',
    desc: 'Nạp ETH hoặc Token ERC-20 vào Quỹ Lớp đa chữ ký',
    color: '#10b981',
    label: 'Đóng Quỹ',
    contractFields: []
  },
  {
    id: 'multisig-dashboard',
    name: '✍️ Bảng Điều Khiển Quỹ Lớp',
    desc: 'Quản lý Quỹ: Tạo đề xuất rút tiền, ký duyệt, thực thi lệnh giải ngân',
    color: '#f59e0b',
    label: 'Bảng Điều Khiển Quỹ',
    contractFields: []
  },
  {
    id: 'qr-scanner',
    name: '📷 Máy Quét Mã QR',
    desc: 'Sử dụng camera điện thoại/laptop để quét mã QR địa chỉ ví, hữu ích để điểm danh sự kiện',
    color: '#14b8a6',
    label: 'Quét Mã QR',
    contractFields: []
  },
  {
    id: 'qr-wallet',
    name: '🪪 Căn Cước Ví',
    desc: 'Tạo thẻ QR Code cho địa chỉ ví của bạn để người khác dễ dàng quét và chuyển tiền',
    color: '#3b82f6',
    label: 'Thẻ QR Ví',
    contractFields: []
  },
  {
    id: 'qr-generator',
    name: '🖨️ Máy Tạo Mã QR',
    desc: 'Tạo nhanh mã QR chứa sẵn địa chỉ Bộ sưu tập và Mã Huy Hiệu để in ra dán ở sự kiện',
    color: '#8b5cf6',
    label: 'Tạo Mã QR',
    contractFields: []
  },
  {
    id: 'move-to-earn',
    name: '🏃‍♂️ Đi Bộ Nhận Thưởng',
    desc: 'Đo khoảng cách chạy bộ GPS, học sinh hoàn thành cự ly sẽ được mở khóa đúc NFT',
    color: '#22c55e',
    label: 'Move-to-Earn',
    contractFields: []
  },
  {
    id: 'treasure-hunt',
    name: '🗺️ Tìm Kho Báu NFT',
    desc: 'Giấu NFT tại một tọa độ GPS thực tế. Học sinh dò Radar để tìm và khai quật kho báu.',
    color: '#f59e0b',
    label: 'Tìm Kho Báu',
    contractFields: []
  },
  {
    id: 'coin-faucet-factory',
    name: '🏭 Tạo Két Sắt Bài Thi',
    desc: 'Tạo Máy Phát Lương Coin cho bài thi Trắc nghiệm. Whitelist + Chống gian lận.',
    color: '#eab308',
    label: 'Tạo Két Sắt (Faucet)',
    contractFields: []
  },
  {
    id: 'quiz-to-earn',
    name: '📝 Trắc Nghiệm Nhận Thưởng',
    desc: 'Tạo bài thi trắc nghiệm (A B C D) từ link ảnh đề thi. Sinh link bảo mật chống hack.',
    color: '#8b5cf6',
    label: 'Trắc Nghiệm (Q2E)',
    contractFields: []
  },
  {
    id: 'auction-factory',
    name: '🏛️ Máy Tạo Sàn Đấu Giá',
    desc: 'Tạo Sàn Đấu Giá NFT chung cho cả lớp (Mô hình English Auction)',
    color: '#f59e0b',
    label: 'Tạo Sàn Đấu Giá',
    contractFields: []
  },
  {
    id: 'auction-create',
    name: '🔨 Lên Sàn Đấu Giá',
    desc: 'Mở phiên đấu giá NFT của bạn. Chọn loại Coin, giá khởi điểm và thời gian.',
    color: '#ec4899',
    label: 'Mở Phiên Đấu Giá',
    contractFields: []
  },
  {
    id: 'auction-bid',
    name: '⚖️ Sàn Đấu Giá',
    desc: 'Xem các phiên đấu giá, bỏ thầu bằng Coin, chốt đơn và rút tiền thừa',
    color: '#8b5cf6',
    label: 'Sàn Đấu Giá',
    contractFields: []
  },
  {
    id: 'staking-factory',
    name: '🏛️ Lập Ngân Hàng',
    desc: 'Tạo Ngân Hàng Tiết Kiệm chung cho cả lớp. Học sinh gửi Coin lấy lãi theo ngày.',
    color: '#059669',
    label: 'Lập Ngân Hàng',
    contractFields: []
  },
  {
    id: 'staking-dashboard',
    name: '💰 Sổ Tiết Kiệm',
    desc: 'Gửi Coin vào Ngân Hàng lấy lãi mỗi ngày. Thu hoạch lãi hoặc rút gốc bất cứ lúc nào.',
    color: '#10b981',
    label: 'Sổ Tiết Kiệm',
    contractFields: []
  },
  {
    id: 'liquid-factory',
    name: '🏦 Lập Quỹ Đầu Tư',
    desc: 'Lập Quỹ đầu tư mạo hiểm. Huy động vốn từ học sinh và phát hành Chứng Chỉ Quỹ (sCoin).',
    color: '#0ea5e9',
    label: 'Quản Lý Quỹ',
    contractFields: []
  },
  {
    id: 'liquid-dashboard',
    name: '📈 Chứng Chỉ Quỹ',
    desc: 'Mua Chứng Chỉ Quỹ (sCoin) và chờ giá trị tăng lên khi Giáo viên bơm lợi nhuận vào.',
    color: '#38bdf8',
    label: 'Cổng Đầu Tư',
    contractFields: []
  },
  {
    id: 'launchpad-factory',
    name: '🚀 Lập Bệ Phóng IDO',
    desc: 'Thiết lập mục tiêu gọi vốn, giá bán và tạo Bệ Phóng để huy động vốn từ cộng đồng.',
    color: '#e11d48',
    icon: '🚀',
    contractFields: []
  },
  {
    id: 'launchpad-dashboard',
    name: '🦈 Cổng Đầu Tư Dự Án',
    desc: 'Học sinh nạp Coin để Đầu tư sớm vào dự án. Chốt sổ nhận Token hoặc Refund nếu xịt.',
    color: '#be123c',
    icon: '🦈',
    contractFields: []
  }
]

export default BLOCKS_META

export const LESSONS = [
    { id: "web3-bank", name: "🏛️ Bài 1: Hệ Thống Tiền Tệ Web3", blocks: ["wallet", "qr-wallet", "erc20-factory", "balance", "transfer", "wrap-eth"] },
    { id: "nft-gacha", name: "🎰 Bài 2: Máy Quay Thưởng NFT", blocks: ["wallet", "erc721-factory", "update-erc721", "grant-minter-721", "mint-erc721-random"] },
    { id: "market-trade", name: "🛒 Bài 3: Chợ Giao Dịch Vật Phẩm", blocks: ["wallet", "balance", "erc721-factory", "mint-nft", "market-factory", "market-list", "market-shop", "market-cancel"] },
    { id: "soulbound-cert", name: "🎓 Bài 4: Hồ Sơ Danh Tính (SBT)", blocks: ["wallet", "erc721-factory", "mint-nft", "profile-gallery", "admin-revoke"] },
    { id: "dex-exchange", name: "🦄 Bài 5: Sàn Phân Quyền (DEX)", blocks: ["wallet", "erc20-factory", "wrap-eth", "uniswap-v3-lp", "uniswap-v3-sell", "gecko-chart", "gecko-txns"] },
    { id: "dao-voting", name: "🗳️ Bài 6: Tổ Chức Tự Trị (DAO)", blocks: ["wallet", "erc20-factory", "transfer", "balance", "voting-factory", "dao-token-voting"] },
    { id: "token-factory", name: "🏭 Bài 7: Khởi Tạo Token", blocks: ["wallet", "erc20-factory", "balance"] },
    { id: "badge-system", name: "🏅 Bài 8: Bộ Sưu Tập Đa Năng", blocks: ["wallet", "erc1155-factory", "update-erc1155", "grant-minter-1155", "free-claim-1155", "mint-1155"] },
    { id: "nft-system", name: "🖼️ Bài 9: Bộ Sưu Tập Độc Bản", blocks: ["wallet", "erc721-factory", "update-erc721", "mint-nft", "grant-minter-721", "free-claim-721", "admin-revoke"] },
    { id: "multisig-treasury", name: "🏛️ Bài 10: Quỹ Chung Đa Chữ Ký", blocks: ["wallet", "multisig-factory", "multisig-deposit", "multisig-dashboard"] },
    { id: "poap-event", name: "🎫 Bài 11: Chứng Nhận Sự Kiện", blocks: ["wallet", "erc1155-factory", "qr-generator", "qr-scanner", "free-claim-1155", "mint-1155"] },
    { id: "web3-sports", name: "🏃‍♂️ Bài 12: Vận Động Nhận Thưởng", blocks: ["wallet", "erc1155-factory", "move-to-earn"] },
    { id: "treasure-hunt-lesson", name: "🗺️ Bài 13: Định Vị Tọa Độ (GPS)", blocks: ["wallet", "erc1155-factory", "treasure-hunt"] },
    { id: "quiz-to-earn", name: "📝 Bài 14: Học Tập Nhận Thưởng", blocks: ["coin-faucet-factory", "quiz-to-earn", "erc20-factory"] },
    { id: "nft-auction", name: "🔨 Bài 15: Sàn Đấu Giá", blocks: ["wallet", "auction-factory", "auction-create", "auction-bid"] },
    { id: "defi-staking", name: "🏛️ Bài 16: Két Sắt Sinh Lời (Staking)", blocks: ["wallet", "erc20-factory", "staking-factory", "staking-dashboard"] },
    { id: "liquid-staking", name: "🏛️ Bài 17: Phái Sinh Thanh Khoản", blocks: ["wallet", "erc20-factory", "liquid-factory", "liquid-dashboard"] },
    { id: "launchpad", name: "🚀 Bài 18: Gọi Vốn Cộng Đồng (IDO)", blocks: ["wallet", "erc20-factory", "launchpad-factory", "launchpad-dashboard"] }
]

export const CATEGORIES = [
    { id: "nav", name: "🧭 Nhóm Điều Hướng", blocks: [] },
    { id: "basic", name: "⚙️ Nhóm Tương Tác", blocks: ["wallet", "qr-wallet", "qr-scanner", "qr-generator", "move-to-earn", "treasure-hunt", "quiz-to-earn"] },
    { id: "payment", name: "💰 Nhóm Tài Sản", blocks: ["erc20-factory", "balance", "transfer", "wrap-eth", "coin-faucet-factory"] },
    { id: "nft", name: "🖼️ Nhóm Vật Phẩm", blocks: ["erc721-factory", "erc1155-factory", "update-erc1155", "update-erc721", "mint-nft", "mint-1155", "grant-minter-1155", "free-claim-1155", "grant-minter-721", "free-claim-721", "admin-revoke", "profile-gallery"] },
    { id: "market", name: "📈 Nhóm Thị Trường", blocks: ["market-factory", "market-list", "market-cancel", "market-shop", "auction-factory", "auction-create", "auction-bid", "uniswap-v3-sell", "uniswap-v3-lp", "gecko-chart", "gecko-txns"] },
    { id: "dao", name: "🗳️ Nhóm Quản Trị", blocks: ["voting-factory", "dao-token-voting", "multisig-factory", "multisig-deposit", "multisig-dashboard"] },
    { id: "defi", name: "💰 Nhóm Tài Chính", blocks: ["staking-factory", "staking-dashboard", "liquid-factory", "liquid-dashboard", "launchpad-factory", "launchpad-dashboard"] },
    { id: "decorative", name: "🎨 Nhóm Trang Trí", blocks: ["text-title", "background-image", "container"] }
]

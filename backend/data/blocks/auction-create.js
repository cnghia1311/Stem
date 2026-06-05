// ==================== KHỐI: LÊN SÀN ĐẤU GIÁ (CREATE AUCTION) ====================
export default {
    id: "auction-create",
    name: "🔨 Lên Sàn Đấu Giá",
    desc: "Mở phiên đấu giá NFT của bạn. Chọn loại Coin, giá khởi điểm và thời gian.",
    color: "#ec4899",
    label: "Mở Phiên Đấu Giá",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#ec4899;">
        <div class="khoi-title" style="color:#f472b6;margin-bottom:12px;">🔨 LÊN SÀN ĐẤU GIÁ</div>
        <p style="font-size:11px;color:#cbd5e1;margin-bottom:12px;line-height:1.5;">Mang NFT của bạn lên Sàn Đấu Giá. Chọn loại Coin để nhận thanh toán, giá khởi điểm và thời gian đấu giá.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
            <input type="text" id="ac-auction-house" placeholder="🏛️ Mã Sàn Đấu Giá (0x...)" style="grid-column:1/-1;background:#0f172a;color:#fff;border:1px solid #334155;padding:10px;border-radius:6px;font-size:11px;">
            <input type="text" id="ac-nft-contract" placeholder="🖼️ Mã NFT Collection (0x...)" style="background:#0f172a;color:#fff;border:1px solid #334155;padding:10px;border-radius:6px;font-size:11px;">
            <input type="number" id="ac-token-id" placeholder="🆔 Token ID" style="background:#0f172a;color:#fff;border:1px solid #334155;padding:10px;border-radius:6px;font-size:11px;">
            <input type="text" id="ac-payment-token" placeholder="💰 Coin thanh toán (0x... ERC-20)" style="grid-column:1/-1;background:#0f172a;color:#fff;border:1px solid #334155;padding:10px;border-radius:6px;font-size:11px;">
            <input type="text" id="ac-starting-price" placeholder="💲 Giá khởi điểm (VD: 10)" style="background:#0f172a;color:#fff;border:1px solid #334155;padding:10px;border-radius:6px;font-size:11px;">
            <input type="number" id="ac-duration" placeholder="⏱️ Thời gian (phút)" value="30" min="1" max="10080" style="background:#0f172a;color:#fff;border:1px solid #334155;padding:10px;border-radius:6px;font-size:11px;">
        </div>
        <button id="ac-create-btn" style="background:linear-gradient(45deg, #db2777, #ec4899);width:100%;padding:14px;border-radius:10px;border:none;color:white;font-weight:bold;font-size:14px;cursor:pointer;margin-bottom:12px;">🔨 MỞ PHIÊN ĐẤU GIÁ</button>
        <div id="ac-result" style="display:none;background:#0f172a;border:1px solid #10b981;border-radius:8px;padding:12px;text-align:center;">
            <div style="font-size:14px;color:#10b981;font-weight:bold;margin-bottom:5px;">🎉 ĐÃ MỞ PHIÊN ĐẤU GIÁ!</div>
            <div style="font-size:12px;color:#fbbf24;">🎫 Mã phiên: <b id="ac-auction-id">#?</b></div>
            <div style="font-size:10px;color:#94a3b8;margin-top:5px;">NFT đã được gửi vào Sàn. Hãy chia sẻ mã Sàn cho bạn bè để họ bỏ thầu!</div>
        </div>

        <div style="margin-top:16px;border-top:1px solid #334155;padding-top:12px;">
            <div class="khoi-title" style="color:#ef4444;font-size:13px;">❌ HỦY PHIÊN ĐẤU GIÁ</div>
            <p style="font-size:10px;color:#94a3b8;margin-bottom:8px;">Chỉ có thể hủy khi chưa có ai bỏ thầu. NFT sẽ được trả về ví.</p>
            <div style="display:flex;gap:8px;margin-bottom:8px;">
                <input type="number" id="ac-cancel-id" placeholder="Mã phiên muốn hủy" style="flex:1;background:#0f172a;color:#fff;border:1px solid #334155;padding:8px;border-radius:6px;font-size:10px;">
                <button id="ac-cancel-btn" style="background:#ef4444;color:white;border:none;padding:8px 12px;border-radius:6px;font-size:10px;cursor:pointer;white-space:nowrap;">❌ HỦY</button>
            </div>
        </div>
    </div>`,
    engineCode: () => `
    const AUCTION_HOUSE_ABI_CREATE = [
        "function createAuction(address _nftContract, uint256 _tokenId, address _paymentToken, uint256 _startingPrice, uint256 _durationMinutes) external returns (uint256)",
        "function cancelAuction(uint256 _auctionId) external",
        "event AuctionCreated(uint256 indexed auctionId, address indexed seller, address nftContract, uint256 tokenId, address paymentToken, uint256 startingPrice, uint256 endTime)",
        "event AuctionCancelled(uint256 indexed auctionId)"
    ];

    async function createAuction() {
        if(!signer){toast('error','Kết nối Ví trước!');return;}
        const houseAddr = document.getElementById('ac-auction-house').value.trim();
        const nftAddr = document.getElementById('ac-nft-contract').value.trim();
        const tokenId = document.getElementById('ac-token-id').value.trim();
        const payToken = document.getElementById('ac-payment-token').value.trim();
        const price = document.getElementById('ac-starting-price').value.trim();
        const duration = document.getElementById('ac-duration').value.trim();
        const btn = document.getElementById('ac-create-btn');
        const result = document.getElementById('ac-result');

        if(!houseAddr || houseAddr.length !== 42) { toast('error','Nhập Mã Sàn Đấu Giá hợp lệ!'); return; }
        if(!nftAddr || nftAddr.length !== 42) { toast('error','Nhập Mã NFT Collection hợp lệ!'); return; }
        if(tokenId === '') { toast('error','Nhập Token ID!'); return; }
        if(!payToken || payToken.length !== 42) { toast('error','Nhập địa chỉ Coin thanh toán (ERC-20) hợp lệ!'); return; }
        if(!price || isNaN(price)) { toast('error','Nhập Giá Khởi Điểm hợp lệ!'); return; }
        if(!duration || parseInt(duration) < 1) { toast('error','Thời gian phải ≥ 1 phút!'); return; }

        try {
            btn.disabled = true; result.style.display = 'none';

            // Bước 1: Approve NFT cho Sàn Đấu Giá
            btn.innerText = '🔑 BƯỚC 1: ỦY QUYỀN NFT...'; toast('info', 'Ủy quyền NFT cho Sàn Đấu Giá...');
            const nftContract = new ethers.Contract(nftAddr, [
                "function approve(address to, uint256 tokenId)",
                "function getApproved(uint256 tokenId) view returns (address)"
            ], signer);

            const approved = await nftContract.getApproved(tokenId);
            if(approved.toLowerCase() !== houseAddr.toLowerCase()) {
                const txApprove = await nftContract.approve(houseAddr, tokenId);
                await txApprove.wait();
                toast('success', 'Ủy quyền thành công!');
            } else {
                toast('info', 'Đã được ủy quyền sẵn.');
            }

            // Bước 2: Mở phiên đấu giá
            btn.innerText = '🔨 BƯỚC 2: MỞ PHIÊN...'; toast('info', 'Đang mở phiên đấu giá...');
            const house = new ethers.Contract(houseAddr, AUCTION_HOUSE_ABI_CREATE, signer);
            const priceWei = ethers.utils.parseEther(price);
            const tx = await house.createAuction(nftAddr, tokenId, payToken, priceWei, duration);
            toast('info', 'Đang đợi Blockchain xác nhận...');
            const receipt = await tx.wait();

            let auctionId = '?';
            for(const log of receipt.logs) {
                try {
                    const parsed = house.interface.parseLog(log);
                    if(parsed.name === 'AuctionCreated') {
                        auctionId = parsed.args.auctionId.toString();
                        break;
                    }
                } catch(e) {}
            }

            result.style.display = 'block';
            document.getElementById('ac-auction-id').innerText = '#' + auctionId;
            toast('success', '🎉 Mở phiên đấu giá thành công! Mã phiên: #' + auctionId);
            btn.innerText = '🔨 MỞ PHIÊN TIẾP'; btn.disabled = false;
        } catch(e) {
            btn.innerText = '🔨 MỞ PHIÊN ĐẤU GIÁ'; btn.disabled = false;
            const msg = e.reason || e.message || 'Lỗi!';
            toast('error', msg.substring(0, 80));
        }
    }

    // Hủy phiên đấu giá
    document.getElementById('ac-cancel-btn').addEventListener('click', async function() {
        if(!signer){toast('error','Kết nối Ví trước!');return;}
        const houseAddr = document.getElementById('ac-auction-house').value.trim();
        const cancelId = document.getElementById('ac-cancel-id').value.trim();
        if(!houseAddr || houseAddr.length !== 42) { toast('error','Nhập Mã Sàn Đấu Giá ở trên!'); return; }
        if(!cancelId) { toast('error','Nhập Mã phiên muốn hủy!'); return; }
        const btn = this;
        try {
            btn.disabled = true; btn.innerText = '⏳ Đang hủy...';
            const house = new ethers.Contract(houseAddr, AUCTION_HOUSE_ABI_CREATE, signer);
            const tx = await house.cancelAuction(cancelId);
            await tx.wait();
            toast('success', '❌ Đã hủy phiên #' + cancelId + '. NFT đã về ví!');
            btn.innerText = '❌ HỦY'; btn.disabled = false;
        } catch(e) {
            btn.innerText = '❌ HỦY'; btn.disabled = false;
            toast('error', e.reason || e.message || 'Không thể hủy!');
        }
    });
    `,
    bindings: [{ btn: "ac-create-btn", fn: "createAuction" }]
}

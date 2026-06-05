import { FACTORY_ADDRESSES } from '../contracts/contractFactorys.js';

// ==================== KHỐI: MÁY TẠO SÀN ĐẤU GIÁ (AUCTION HOUSE FACTORY) ====================
export default {
    id: "auction-factory",
    name: "🏛️ Máy Tạo Sàn Đấu Giá",
    desc: "Tạo Sàn Đấu Giá NFT chung cho cả lớp (Mô hình English Auction)",
    color: "#f59e0b",
    label: "Tạo Sàn Đấu Giá",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#f59e0b;">
        <div class="khoi-title" style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
            <span style="font-size:24px;">🏛️</span>
            <span style="background:linear-gradient(135deg,#f59e0b,#d97706);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:16px;letter-spacing:1px;">MÁY TẠO SÀN ĐẤU GIÁ</span>
        </div>
        <p style="font-size:11px;color:#cbd5e1;margin-bottom:12px;line-height:1.5;">Tạo một Sàn Đấu Giá NFT chung cho cả lớp. Ai cũng có thể mang NFT lên Sàn này để đấu giá bằng Coin!</p>
        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:15px;margin-bottom:12px;">
            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Tên Sàn Đấu Giá</label>
            <input type="text" id="ahf-name" placeholder="Ví dụ: Sàn Đấu Giá Lớp 10A1" maxlength="48" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:14px;outline:none;">
            <div style="font-size:10px;color:#f59e0b;margin-top:6px;">🔨 Sàn Đấu Giá cho phép mỗi người bán tự chọn loại Coin (ERC-20) riêng khi mở phiên đấu giá.</div>
        </div>

        <button id="ahf-create-btn" style="width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:white;font-size:15px;font-weight:800;cursor:pointer;letter-spacing:1px;">🚀 TẠO SÀN ĐẤU GIÁ</button>

        <div id="ahf-status" style="margin-top:10px;font-size:12px;text-align:center;color:#94a3b8;min-height:20px;"></div>

        <div id="ahf-result" style="display:none;margin-top:12px;background:#0f2a1a;border:1px solid #10b981;border-radius:12px;padding:15px;">
            <div style="font-size:14px;font-weight:bold;color:#10b981;margin-bottom:8px;">🎉 Sàn Đấu Giá đã khai trương!</div>
            <div style="font-size:11px;color:#94a3b8;margin-bottom:4px;">Tên: <span id="ahf-result-name" style="color:#e2e8f0;font-weight:bold;"></span></div>
            <div style="font-size:11px;color:#94a3b8;margin-bottom:8px;">Địa chỉ Contract Sàn Đấu Giá:</div>
            <div id="ahf-result-address" style="background:#1e293b;padding:10px;border-radius:8px;font-size:12px;color:#f59e0b;word-break:break-all;cursor:pointer;text-align:center;" title="Bấm để copy"></div>
            <div style="text-align:center;margin-top:8px;">
                <a id="ahf-result-link" href="#" target="_blank" style="color:#f59e0b;font-size:11px;text-decoration:underline;">🔗 Xem trên Etherscan</a>
            </div>
            <div style="margin-top:10px;padding:8px;background:#1e293b;border-radius:8px;font-size:10px;color:#fcd34d;text-align:center;">
                💡 Copy địa chỉ Sàn → Dán vào khối <strong>Lên Sàn Đấu Giá</strong> và <strong>Bảng Đấu Giá</strong> để bắt đầu!
            </div>
        </div>

        <div id="ahf-history" style="margin-top:12px;">
            <div style="font-size:12px;color:#64748b;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;">
                <span>📜 Sàn Đấu Giá đã tạo trước đó:</span>
                <button id="ahf-load-history" style="background:none;border:1px solid #334155;color:#94a3b8;padding:3px 8px;border-radius:6px;font-size:10px;cursor:pointer;">Tải lịch sử</button>
            </div>
            <div id="ahf-history-list" style="font-size:11px;color:#94a3b8;"></div>
        </div>
    </div>`,

    engineCode: () => `
        const AUCTION_FACTORY_ADDR = '${FACTORY_ADDRESSES.AUCTION_FACTORY || '0x0000000000000000000000000000000000000000'}';
        const AUCTION_FACTORY_ABI = [
            "function createAuctionHouse(string memory _name) external returns (address)",
            "event AuctionHouseCreated(address indexed auctionHouseAddress, string name, address indexed owner)"
        ];

        const _ahfBtn = document.getElementById('ahf-create-btn');
        const _ahfName = document.getElementById('ahf-name');
        const _ahfStatus = document.getElementById('ahf-status');
        const _ahfResult = document.getElementById('ahf-result');
        const _ahfLoadHist = document.getElementById('ahf-load-history');

        if (_ahfBtn) {
            document.getElementById('ahf-result-address').addEventListener('click', function() {
                navigator.clipboard.writeText(this.innerText).then(function(){
                    toast('success', '📋 Đã copy địa chỉ Sàn Đấu Giá!');
                });
            });

            _ahfBtn.addEventListener('click', async function() {
                if (!signer) { toast('error', 'Cần kết nối ví (🦊) trước!'); return; }
                var name = _ahfName.value.trim();
                if (!name) { toast('error', 'Nhập tên cho Sàn Đấu Giá!'); return; }

                try {
                    _ahfBtn.disabled = true; _ahfBtn.style.opacity = '0.5';
                    _ahfStatus.innerHTML = '<span style="color:#f59e0b;">⏳ Đang gửi giao dịch tạo Sàn Đấu Giá... (Xác nhận trên MetaMask)</span>';
                    _ahfResult.style.display = 'none';

                    var factory = new ethers.Contract(AUCTION_FACTORY_ADDR, AUCTION_FACTORY_ABI, signer);
                    var tx = await factory.createAuctionHouse(name);
                    _ahfStatus.innerHTML = '<span style="color:#f59e0b;">⛏️ Đang đợi Blockchain xác nhận...</span>';

                    var receipt = await tx.wait();

                    var houseAddr = null;
                    for (var i = 0; i < receipt.logs.length; i++) {
                        try {
                            var parsed = factory.interface.parseLog(receipt.logs[i]);
                            if (parsed.name === 'AuctionHouseCreated') {
                                houseAddr = parsed.args.auctionHouseAddress;
                                break;
                            }
                        } catch(e) {}
                    }

                    if (!houseAddr) throw new Error('Không tìm thấy địa chỉ Sàn trong transaction.');

                    var scanBase = 'https://sepolia.etherscan.io/address/';
                    document.getElementById('ahf-result-name').innerText = name;
                    document.getElementById('ahf-result-address').innerText = houseAddr;
                    document.getElementById('ahf-result-link').href = scanBase + houseAddr;
                    _ahfResult.style.display = 'block';

                    _ahfStatus.innerHTML = '<span style="color:#10b981;">✅ Hoàn tất! Sàn Đấu Giá <strong>' + name + '</strong> đã khai trương!</span>';
                    toast('success', '🎉 Đã tạo thành công Sàn Đấu Giá!');
                    _ahfName.value = '';
                } catch(e) {
                    var msg = e.reason || e.message || 'Lỗi không xác định';
                    if (msg.includes('user rejected')) msg = 'Bạn đã từ chối giao dịch trên MetaMask!';
                    _ahfStatus.innerHTML = '<span style="color:#ef4444;">❌ ' + msg.substring(0, 80) + '</span>';
                    toast('error', 'Thất bại: ' + msg.substring(0, 50));
                } finally {
                    _ahfBtn.disabled = false; _ahfBtn.style.opacity = '1';
                }
            });

            _ahfLoadHist.addEventListener('click', async function() {
                if (!signer) { toast('error', 'Cần kết nối ví trước!'); return; }
                var histList = document.getElementById('ahf-history-list');
                histList.innerHTML = '<span style="color:#f59e0b;">⏳ Đang quét Blockchain...</span>';
                try {
                    var factory = new ethers.Contract(AUCTION_FACTORY_ADDR, AUCTION_FACTORY_ABI, provider);
                    var filter = factory.filters.AuctionHouseCreated(null, null, userAddr);
                    var events = await factory.queryFilter(filter, 0, 'latest');

                    if (events.length === 0) {
                        histList.innerHTML = '<span style="color:#64748b;">Bạn chưa tạo Sàn Đấu Giá nào.</span>';
                        return;
                    }
                    var html = '';
                    for (var i = 0; i < events.length; i++) {
                        var ev = events[i];
                        var addr = ev.args.auctionHouseAddress;
                        var n = ev.args.name || '???';
                        html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 8px;background:#1e293b;border-radius:6px;margin-bottom:4px;">';
                        html += '<span style="color:#f59e0b;font-weight:bold;">🏛️ ' + n + '</span>';
                        html += '<a href="https://sepolia.etherscan.io/address/' + addr + '" target="_blank" style="color:#fcd34d;font-size:10px;">' + addr.substring(0,8) + '...' + addr.substring(36) + '</a>';
                        html += '</div>';
                    }
                    histList.innerHTML = html;
                } catch(e) {
                    histList.innerHTML = '<span style="color:#ef4444;">❌ Lỗi: ' + (e.message||'').substring(0,50) + '</span>';
                }
            });
        }
    `,
    bindings: []
}

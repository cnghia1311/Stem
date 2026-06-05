import { FACTORY_ADDRESSES } from '../contracts/contractFactorys.js';

// ==================== KHỐI: MÁY TẠO BỘ SƯU TẬP HUY HIỆU (ERC-1155) ====================
export default {
    id: "erc1155-factory",
    name: "🏅 Máy Tạo Bộ Sưu Tập Huy Hiệu",
    desc: "Tạo Bộ sưu tập Huy hiệu / Vật phẩm đa năng chuẩn ERC-1155",
    color: "#10b981",
    label: "Máy Tạo BST Huy Hiệu",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#10b981;">
        <div class="khoi-title" style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:24px;">🏅</span>
            <span style="background:linear-gradient(135deg,#10b981,#059669);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:16px;letter-spacing:1px;">MÁY TẠO BỘ SƯU TẬP HUY HIỆU</span>
        </div>
        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:15px;margin-bottom:12px;">
            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Tên Bộ Sưu Tập</label>
            <input type="text" id="1155f-collection-name" placeholder="Ví dụ: Huy Hiệu STEM Club" maxlength="32" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:14px;outline:none;margin-bottom:12px;">

            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Ký Hiệu (Symbol)</label>
            <input type="text" id="1155f-collection-symbol" placeholder="Ví dụ: STEM (3-5 chữ)" maxlength="8" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:14px;outline:none;text-transform:uppercase;margin-bottom:12px;">


            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Loại Token</label>
            <select id="1155f-is-soulbound" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;margin-bottom:4px;">
                <option value="false">🎁 Vật phẩm game (Có thể mua bán, trao đổi)</option>
                <option value="true">🏅 Huy hiệu / Bằng khen (Khóa vĩnh viễn vào ví)</option>
            </select>
            <div style="font-size:10px;color:#64748b;margin-bottom:6px;">🏆 Bạn là Owner duy nhất có quyền Mint và cấp quyền cho Máy Gacha Drop</div>
        </div>

        <button id="1155f-create-btn" style="width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#10b981,#059669);color:white;font-size:15px;font-weight:800;cursor:pointer;letter-spacing:1px;">🚀 TẠO BỘ SƯU TẬP</button>
        <div id="1155f-status" style="margin-top:10px;font-size:12px;text-align:center;color:#94a3b8;min-height:20px;"></div>

        <div id="1155f-result" style="display:none;margin-top:12px;background:#0a1f18;border:1px solid #10b981;border-radius:12px;padding:15px;">
            <div style="font-size:14px;font-weight:bold;color:#10b981;margin-bottom:8px;">🎉 Bộ Sưu Tập Huy Hiệu đã được tạo thành công!</div>
            <div style="font-size:11px;color:#94a3b8;margin-bottom:4px;">Tên: <span id="1155f-result-name" style="color:#e2e8f0;font-weight:bold;"></span></div>
            <div style="font-size:11px;color:#94a3b8;margin-bottom:4px;">Ký hiệu: <span id="1155f-result-symbol" style="color:#10b981;font-weight:bold;"></span></div>
            <div style="font-size:11px;color:#94a3b8;margin-bottom:8px;">Địa chỉ Contract:</div>
            <div id="1155f-result-address" style="background:#1e293b;padding:10px;border-radius:8px;font-size:12px;color:#06b6d4;word-break:break-all;cursor:pointer;text-align:center;" title="Bấm để copy"></div>
            <div style="text-align:center;margin-top:8px;">
                <a id="1155f-result-link" href="#" target="_blank" style="color:#06b6d4;font-size:11px;text-decoration:underline;">🔗 Xem trên Etherscan</a>
            </div>
            <div style="margin-top:10px;padding:8px;background:#1e293b;border-radius:8px;font-size:10px;color:#10b981;text-align:center;">
                💡 Copy địa chỉ Contract → Dán vào khối <strong>🎖️ Đúc Huy Hiệu</strong> để bắt đầu mint!
            </div>
        </div>

        <div id="1155f-history" style="margin-top:12px;">
            <div style="font-size:12px;color:#64748b;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;">
                <span>📜 Bộ sưu tập đã tạo:</span>
                <button id="1155f-load-history" style="background:none;border:1px solid #334155;color:#94a3b8;padding:3px 8px;border-radius:6px;font-size:10px;cursor:pointer;">Tải lịch sử</button>
            </div>
            <div id="1155f-history-list" style="font-size:11px;color:#94a3b8;"></div>
        </div>
    </div>`,

    engineCode: () => `
        const ERC1155_FACTORY_ADDR = '${FACTORY_ADDRESSES.ERC1155_FACTORY}';
        const ERC1155_FACTORY_ABI = [
            "function createCollection(string name, string symbol, string uri, bool isSoulbound) public returns (address)",
            "function getUserCollections(address user) public view returns (address[] memory)",
            "function getTotalCollections() public view returns (uint256)",
            "event CollectionCreated(address indexed creator, address collectionAddress, string name, string symbol)"
        ];
        const ERC1155_MINI_ABI = [
            "function name() view returns (string)",
            "function symbol() view returns (string)"
        ];

        const _1155fBtn = document.getElementById('1155f-create-btn');
        const _1155fName = document.getElementById('1155f-collection-name');
        const _1155fSymbol = document.getElementById('1155f-collection-symbol');

        const _1155fSoulbound = document.getElementById('1155f-is-soulbound');
        const _1155fStatus = document.getElementById('1155f-status');
        const _1155fResult = document.getElementById('1155f-result');
        const _1155fLoadHist = document.getElementById('1155f-load-history');

        if (_1155fBtn) {
            _1155fSymbol.addEventListener('input', function() {
                this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            });

            document.getElementById('1155f-result-address').addEventListener('click', function() {
                navigator.clipboard.writeText(this.innerText).then(function(){
                    toast('success', '📋 Đã copy địa chỉ Contract Collection!');
                });
            });

            _1155fBtn.addEventListener('click', async function() {
                if (!signer) { toast('error', 'Cần kết nối ví (🦊) trước!'); return; }
                if (!ERC1155_FACTORY_ADDR || ERC1155_FACTORY_ADDR.length !== 42) {
                    toast('error', 'Factory chưa được cấu hình! Liên hệ Admin.'); return;
                }
                var colName = _1155fName.value.trim();
                var colSymbol = _1155fSymbol.value.trim();
                var colUri = ""; // Mặc định để trống vì dùng update-erc1155 để set từng URI
                var isSoulbound = _1155fSoulbound ? (_1155fSoulbound.value === 'true') : false;

                if (!colName) { toast('error', 'Nhập tên Bộ Sưu Tập!'); return; }
                if (!colSymbol || colSymbol.length < 2) { toast('error', 'Nhập ký hiệu (ít nhất 2 ký tự)!'); return; }


                try {
                    _1155fBtn.disabled = true; _1155fBtn.style.opacity = '0.5';
                    _1155fStatus.innerHTML = '<span style="color:#10b981;">⏳ Đang gửi giao dịch... (Xác nhận trên MetaMask)</span>';
                    _1155fResult.style.display = 'none';

                    var factory = new ethers.Contract(ERC1155_FACTORY_ADDR, ERC1155_FACTORY_ABI, signer);
                    var tx = await factory.createCollection(colName, colSymbol, colUri, isSoulbound);
                    _1155fStatus.innerHTML = '<span style="color:#10b981;">⛏️ Đang đợi Blockchain xác nhận...</span>';
                    var receipt = await tx.wait();

                    var collectionAddr = null;
                    for (var i = 0; i < receipt.logs.length; i++) {
                        try {
                            var parsed = factory.interface.parseLog(receipt.logs[i]);
                            if (parsed && parsed.name === 'CollectionCreated') { collectionAddr = parsed.args.collectionAddress; break; }
                        } catch(e) {}
                    }
                    if (!collectionAddr) {
                        var cols = await factory.getUserCollections(userAddr);
                        collectionAddr = cols[cols.length - 1];
                    }

                    var scanBase = 'https://sepolia.etherscan.io/address/';
                    document.getElementById('1155f-result-name').innerText = colName;
                    document.getElementById('1155f-result-symbol').innerText = colSymbol;
                    document.getElementById('1155f-result-address').innerText = collectionAddr;
                    document.getElementById('1155f-result-link').href = scanBase + collectionAddr;
                    _1155fResult.style.display = 'block';

                    _1155fStatus.innerHTML = '<span style="color:#10b981;">✅ Hoàn tất! Bộ sưu tập <strong>' + colSymbol + '</strong> đã sẵn sàng!</span>';
                    toast('success', '🏅 Đã tạo thành công bộ sưu tập ' + colSymbol + '!');
                    _1155fName.value = ''; _1155fSymbol.value = '';
                } catch(e) {
                    var msg = e.reason || e.message || 'Lỗi không xác định';
                    _1155fStatus.innerHTML = '<span style="color:#ef4444;">❌ ' + msg.substring(0, 80) + '</span>';
                    toast('error', 'Thất bại: ' + msg.substring(0, 50));
                } finally {
                    _1155fBtn.disabled = false; _1155fBtn.style.opacity = '1';
                }
            });

            _1155fLoadHist.addEventListener('click', async function() {
                if (!signer) { toast('error', 'Cần kết nối ví trước!'); return; }
                var histList = document.getElementById('1155f-history-list');
                histList.innerHTML = '<span style="color:#10b981;">⏳ Đang tải...</span>';
                try {
                    var factory = new ethers.Contract(ERC1155_FACTORY_ADDR, ERC1155_FACTORY_ABI, signer);
                    var collections = await factory.getUserCollections(userAddr);
                    if (collections.length === 0) { histList.innerHTML = '<span style="color:#64748b;">Bạn chưa tạo Bộ Sưu Tập Huy Hiệu nào.</span>'; return; }
                    var html = '';
                    for (var i = 0; i < collections.length; i++) {
                        var addr = collections[i]; var sym = '???'; var colN = '???';
                        try { var c = new ethers.Contract(addr, ERC1155_MINI_ABI, signer); sym = await c.symbol(); colN = await c.name(); } catch(e) {}
                        html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 8px;background:#1e293b;border-radius:6px;margin-bottom:4px;">';
                        html += '<div><span style="color:#10b981;font-weight:bold;">🏅 ' + sym + '</span> <span style="color:#64748b;font-size:9px;">' + colN + '</span></div>';
                        html += '<a href="https://sepolia.etherscan.io/address/' + addr + '" target="_blank" style="color:#06b6d4;font-size:10px;">' + addr.substring(0,8) + '...' + addr.substring(36) + '</a></div>';
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

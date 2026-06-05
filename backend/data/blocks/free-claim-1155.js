import { FACTORY_ADDRESSES } from '../contracts/contractFactorys.js';

// ==================== KHỐI: ĐÚC HUY HIỆU TỰ DO (FREE CLAIM 1155) ====================
export default {
    id: "free-claim-1155",
    name: "🎁 Đúc Huy Hiệu Tự Do",
    desc: "Học sinh tự do đúc Huy hiệu về ví qua máy phát trung gian",
    color: "#ec4899",
    label: "Nhận Huy Hiệu Tự Do",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#ec4899;">
        <div class="khoi-title" style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:24px;">🎁</span>
            <span style="background:linear-gradient(135deg,#ec4899,#be185d);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:16px;letter-spacing:1px;">NHẬN HUY HIỆU MIỄN PHÍ</span>
        </div>

        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:15px;margin-bottom:12px;">
            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Địa chỉ Contract Bộ Sưu Tập (Giáo viên cấp)</label>
            <input type="text" id="fc1155-collection-addr" placeholder="0x..." style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;margin-bottom:12px;">

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <div>
                    <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Mã Huy Hiệu (Token ID)</label>
                    <input type="number" id="fc1155-token-id" placeholder="VD: 1" min="0" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:14px;outline:none;">
                </div>
                <div>
                    <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Số lượng</label>
                    <input type="number" id="fc1155-amount" placeholder="VD: 1" min="1" value="1" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:14px;outline:none;">
                </div>
            </div>
            <div style="font-size:10px;color:#64748b;margin-top:8px;">💡 Bạn sẽ tự trả một chút phí Gas (ETH Sepolia) để nhận huy hiệu.</div>
        </div>

        <button id="fc1155-claim-btn" style="width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#ec4899,#be185d);color:white;font-size:15px;font-weight:800;cursor:pointer;letter-spacing:1px;">🎁 NHẬN HUY HIỆU NGAY</button>
        <div id="fc1155-status" style="margin-top:10px;font-size:12px;text-align:center;color:#94a3b8;min-height:20px;"></div>
    </div>`,

    engineCode: () => `
        var FC1155_ADDR = '${FACTORY_ADDRESSES.FREE_MINT_1155}';
        var FC1155_ABI = [
            "function claimBadge(address collection, uint256 tokenId, uint256 amount) public"
        ];

        var _fc1155Btn = document.getElementById('fc1155-claim-btn');
        var _fc1155Status = document.getElementById('fc1155-status');
        var _fc1155ColInput = document.getElementById('fc1155-collection-addr');
        var _fc1155IdInput = document.getElementById('fc1155-token-id');

        try {
            var urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('col') && _fc1155ColInput) _fc1155ColInput.value = urlParams.get('col');
            if (urlParams.get('id') && _fc1155IdInput) _fc1155IdInput.value = urlParams.get('id');
        } catch(e) {}

        if (_fc1155Btn) {
            _fc1155Btn.addEventListener('click', async function() {
                if (!signer) { toast('error', 'Cần kết nối ví (🦊) trước!'); return; }
                if (!FC1155_ADDR || FC1155_ADDR.length !== 42) {
                    toast('error', 'Hệ thống Máy phát quà chưa được Admin cài đặt!'); return;
                }

                var colAddr = document.getElementById('fc1155-collection-addr').value.trim();
                var tokenId = document.getElementById('fc1155-token-id').value.trim();
                var amount = document.getElementById('fc1155-amount').value.trim();

                if (!colAddr || !colAddr.startsWith('0x') || colAddr.length !== 42) {
                    toast('error', 'Địa chỉ Bộ Sưu Tập không hợp lệ!'); return;
                }
                if (tokenId === '' || isNaN(parseInt(tokenId)) || parseInt(tokenId) < 0) {
                    toast('error', 'Nhập Mã Huy Hiệu hợp lệ (số ≥ 0)!'); return;
                }
                if (!amount || parseInt(amount) < 1) {
                    toast('error', 'Số lượng đúc tối thiểu là 1!'); return;
                }

                try {
                    _fc1155Btn.disabled = true; _fc1155Btn.style.opacity = '0.5';
                    _fc1155Status.innerHTML = '<span style="color:#ec4899;">⏳ Đang xin Huy hiệu... (Xác nhận trên MetaMask)</span>';
                    
                    var freeMintMachine = new ethers.Contract(FC1155_ADDR, FC1155_ABI, signer);
                    var tx = await freeMintMachine.claimBadge(colAddr, parseInt(tokenId), parseInt(amount));

                    _fc1155Status.innerHTML = '<span style="color:#ec4899;">⛏️ Đang chờ Blockchain xác nhận đúc...</span>';
                    await tx.wait();

                    _fc1155Status.innerHTML = '<span style="color:#10b981;">✅ Tuyệt vời! Bạn đã nhận thành công ' + amount + ' Huy hiệu (Mã #' + tokenId + ') vào ví!</span>';
                    toast('success', '🎁 Nhận huy hiệu thành công!');
                    
                } catch(e) {
                    var msg = e.reason || e.message || 'Lỗi không xác định';
                    if (msg.includes('user rejected')) msg = 'Bạn đã từ chối giao dịch trên MetaMask!';
                    if (msg.includes('Not authorized')) msg = 'Bộ sưu tập này chưa cấp quyền cho Máy Phát Quà!';
                    _fc1155Status.innerHTML = '<span style="color:#ef4444;">❌ ' + msg.substring(0, 100) + '</span>';
                    toast('error', 'Nhận thất bại: ' + msg.substring(0, 50));
                } finally {
                    _fc1155Btn.disabled = false; _fc1155Btn.style.opacity = '1';
                }
            });
        }
    `,
    bindings: []
}

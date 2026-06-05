import { FACTORY_ADDRESSES } from '../contracts/contractFactorys.js';

// ==================== KHỐI: ĐÚC NFT TỰ DO (FREE CLAIM ERC-721 TEMPLATE) ====================
export default {
    id: "free-claim-721",
    name: "🎁 Đúc NFT Tự Do",
    desc: "Học sinh đúc NFT về ví dựa trên Khuôn Mẫu (Template ID) của giáo viên",
    color: "#ec4899",
    label: "Nhận NFT Tự Do",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#ec4899;">
        <div class="khoi-title" style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:24px;">🎁</span>
            <span style="background:linear-gradient(135deg,#ec4899,#be185d);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:16px;letter-spacing:1px;">NHẬN NFT MIỄN PHÍ</span>
        </div>

        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:15px;margin-bottom:12px;">
            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Địa chỉ Contract Bộ Sưu Tập (Giáo viên cấp)</label>
            <input type="text" id="fc721-collection-addr" placeholder="0x... (ERC-721)" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;margin-bottom:12px;">

            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Mã Khuôn Mẫu (Template ID)</label>
            <input type="number" id="fc721-template-id" placeholder="Ví dụ: 1" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:14px;font-weight:bold;outline:none;margin-bottom:4px;">
            <div style="font-size:10px;color:#64748b;">💡 Mã Mẫu do giáo viên cung cấp để bạn nhận đúng loại bằng khen/quà tặng.</div>
        </div>

        <button id="fc721-claim-btn" style="width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#ec4899,#be185d);color:white;font-size:15px;font-weight:800;cursor:pointer;letter-spacing:1px;box-shadow:0 4px 15px rgba(236,72,153,0.3);">🎁 ĐÚC NFT VỀ VÍ NGAY</button>
        <div id="fc721-status" style="margin-top:10px;font-size:12px;text-align:center;color:#94a3b8;min-height:20px;"></div>

        <div id="fc721-result" style="display:none;margin-top:12px;background:#1e1b4b;border:1px solid #ec4899;border-radius:12px;padding:15px;">
            <div style="font-size:14px;font-weight:bold;color:#ec4899;margin-bottom:10px;">🎉 Chúc mừng! Bạn đã nhận thành công NFT!</div>
            <div style="font-size:12px;color:#cbd5e1;margin-bottom:4px;">Địa chỉ Bộ Sưu Tập:</div>
            <div id="fc721-result-addr" style="font-family:monospace;background:#0f172a;padding:8px;border-radius:6px;font-size:11px;color:#38bdf8;word-break:break-all;margin-bottom:8px;"></div>
            <div style="font-size:12px;color:#cbd5e1;margin-bottom:4px;">Token ID (Dùng để thêm vào ví):</div>
            <div id="fc721-result-id" style="font-size:24px;font-weight:900;color:#f472b6;margin-bottom:12px;"></div>
            <div style="font-size:11px;color:#94a3b8;background:#334155;padding:8px;border-radius:6px;">
                💡 <b>Mẹo:</b> Mở MetaMask -> tab <b>NFTs</b> -> cuộn xuống chọn <b>Import NFT</b> -> Nhập địa chỉ Bộ Sưu Tập và Token ID ở trên để thấy NFT trong ví nhé!
            </div>
        </div>
    </div>`,

    engineCode: () => `
        var FC721_ADDR = '${FACTORY_ADDRESSES.FREE_MINT_721}';
        var FC721_ABI = [
            "function claimNFT(address collection, uint256 templateId) public returns (uint256)"
        ];

        var _fc721Btn = document.getElementById('fc721-claim-btn');
        var _fc721Status = document.getElementById('fc721-status');
        var _fc721Result = document.getElementById('fc721-result');
        var _fc721ColInput = document.getElementById('fc721-collection-addr');
        var _fc721TplInput = document.getElementById('fc721-template-id');

        try {
            var urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('col') && _fc721ColInput) _fc721ColInput.value = urlParams.get('col');
            if (urlParams.get('tpl') && _fc721TplInput) _fc721TplInput.value = urlParams.get('tpl');
        } catch(e) {}

        if (_fc721Btn) {
            _fc721Btn.addEventListener('click', async function() {
                if (!signer) { toast('error', 'Cần kết nối ví (🦊) trước!'); return; }
                if (!FC721_ADDR || FC721_ADDR.length !== 42) {
                    toast('error', 'Hệ thống Máy phát quà 721 chưa được Admin cài đặt!'); return;
                }

                var colAddr = document.getElementById('fc721-collection-addr').value.trim();
                var templateIdStr = document.getElementById('fc721-template-id').value.trim();

                if (!colAddr || colAddr.length !== 42) { toast('error', 'Địa chỉ bộ sưu tập không hợp lệ!'); return; }
                if (!templateIdStr) { toast('error', 'Vui lòng nhập Mã Khuôn Mẫu (Template ID)!'); return; }

                var templateId = parseInt(templateIdStr);

                try {
                    _fc721Btn.disabled = true; _fc721Btn.style.opacity = '0.5';
                    _fc721Result.style.display = 'none';
                    _fc721Status.innerHTML = '<span style="color:#ec4899;">⏳ Đang xin đúc NFT theo Mẫu số ' + templateId + '...</span>';
                    
                    console.log('[free-claim-721] FC721_ADDR =', FC721_ADDR);
                    console.log('[free-claim-721] colAddr =', colAddr, '| templateId =', templateId);

                    var freeMintMachine = new ethers.Contract(FC721_ADDR, FC721_ABI, signer);
                    var tx = await freeMintMachine.claimNFT(colAddr, templateId);

                    console.log('[free-claim-721] TX hash:', tx.hash);
                    _fc721Status.innerHTML = '<span style="color:#ec4899;">⛏️ Đang chờ Blockchain xác nhận đúc NFT...</span>';
                    var receipt = await tx.wait();
                    console.log('[free-claim-721] Receipt status:', receipt.status, '| logs:', receipt.logs.length);

                    // Đọc Token ID vừa đúc: vì _nextTokenId tăng dần từ 0
                    // nên Token ID mới nhất = totalSupply() - 1
                    var mintedTokenId = "?";
                    try {
                        var colABI = ["function totalSupply() view returns (uint256)"];
                        var colContract = new ethers.Contract(colAddr, colABI, signer);
                        var total = await colContract.totalSupply();
                        var totalBig = typeof total === 'bigint' ? total : BigInt(total.toString());
                        mintedTokenId = (totalBig - 1n).toString();
                    } catch(readErr) {
                        console.warn('Không đọc được Token ID:', readErr);
                    }

                    _fc721Status.innerHTML = '<span style="color:#10b981;">✅ Tuyệt vời! Bạn đã nhận thành công NFT!</span>';
                    
                    document.getElementById('fc721-result-addr').innerText = colAddr;
                    document.getElementById('fc721-result-id').innerText = mintedTokenId;
                    _fc721Result.style.display = 'block';

                    toast('success', '🎁 Nhận NFT thành công!');
                    
                } catch(e) {
                    var msg = e.reason || e.message || 'Lỗi không xác định';
                    if (msg.includes('user rejected')) msg = 'Bạn đã từ chối giao dịch trên MetaMask!';
                    if (msg.includes('Not authorized')) msg = 'Bộ sưu tập này chưa cấp quyền đúc hoặc sai bộ sưu tập!';
                    if (msg.includes('Template does not exist')) msg = 'Mã Khuôn Mẫu này chưa được giáo viên tạo!';
                    _fc721Status.innerHTML = '<span style="color:#ef4444;">❌ ' + msg.substring(0, 100) + '</span>';
                    toast('error', 'Nhận thất bại: ' + msg.substring(0, 50));
                } finally {
                    _fc721Btn.disabled = false; _fc721Btn.style.opacity = '1';
                }
            });
        }
    `,
    bindings: []
}


// ==================== KHỐI: ĐÚC HUY HIỆU (MINT ERC-1155) ====================
export default {
    id: "mint-1155",
    name: "🎖️ Đúc Huy Hiệu (Mint 1155)",
    desc: "Đúc Huy hiệu / Vật phẩm vào bộ sưu tập ERC-1155",
    color: "#06b6d4",
    label: "Đúc Huy Hiệu",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#06b6d4;">
        <div class="khoi-title" style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:24px;">🎖️</span>
            <span style="background:linear-gradient(135deg,#06b6d4,#0284c7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:16px;letter-spacing:1px;">ĐÚC HUY HIỆU (ERC-1155)</span>
        </div>
        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:15px;margin-bottom:12px;">
            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Địa chỉ Contract Bộ Sưu Tập (ERC-1155)</label>
            <input type="text" id="m1155-contract-addr" placeholder="Dán địa chỉ từ Khối 🏅 Máy Tạo BST Huy Hiệu (0x...)" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;margin-bottom:12px;">

            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Địa chỉ Ví Người Nhận</label>
            <input type="text" id="m1155-recipient" placeholder="0x... (để trống = ví của bạn)" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;margin-bottom:12px;">

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:8px;">
                <div>
                    <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Mã Huy Hiệu (Token ID)</label>
                    <input type="number" id="m1155-token-id" placeholder="Ví dụ: 1" min="0" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:14px;outline:none;">
                </div>
                <div>
                    <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Số Lượng Đúc</label>
                    <input type="number" id="m1155-amount" placeholder="Ví dụ: 1" min="1" value="1" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:14px;outline:none;">
                </div>
            </div>
            <div style="font-size:10px;color:#64748b;">🎖️ Token ID = Loại huy hiệu. Số lượng = Bao nhiêu chiếc được đúc ra.</div>
        </div>

        <button id="m1155-mint-btn" style="width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#06b6d4,#0284c7);color:white;font-size:15px;font-weight:800;cursor:pointer;letter-spacing:1px;">🎖️ ĐÚC HUY HIỆU</button>
        <div id="m1155-status" style="margin-top:10px;font-size:12px;text-align:center;color:#94a3b8;min-height:20px;"></div>

        <div id="m1155-result" style="display:none;margin-top:12px;background:#0a1828;border:1px solid #06b6d4;border-radius:12px;padding:15px;">
            <div style="font-size:14px;font-weight:bold;color:#06b6d4;margin-bottom:8px;">🎉 Huy Hiệu đã được Đúc thành công!</div>
            <div style="font-size:11px;color:#94a3b8;margin-bottom:4px;">Token ID: <span id="m1155-result-tokenid" style="color:#06b6d4;font-weight:bold;"></span></div>
            <div style="font-size:11px;color:#94a3b8;margin-bottom:4px;">Số lượng: <span id="m1155-result-amount" style="color:#10b981;font-weight:bold;"></span></div>
            <div style="font-size:11px;color:#94a3b8;margin-bottom:8px;">Gửi đến ví: <span id="m1155-result-recipient" style="color:#e2e8f0;word-break:break-all;"></span></div>
            <div style="text-align:center;margin-top:8px;">
                <a id="m1155-result-link" href="#" target="_blank" style="color:#06b6d4;font-size:11px;text-decoration:underline;">🔗 Xem giao dịch trên Etherscan</a>
            </div>
        </div>
    </div>`,

    engineCode: () => `
        const M1155_ABI = [
            "function mint(address account, uint256 id, uint256 amount, bytes memory data) public",
            "function balanceOf(address account, uint256 id) view returns (uint256)",
            "function name() view returns (string)",
            "function symbol() view returns (string)",
            "function owner() view returns (address)"
        ];

        const _m1155Btn = document.getElementById('m1155-mint-btn');
        const _m1155Status = document.getElementById('m1155-status');
        const _m1155Result = document.getElementById('m1155-result');

        if (_m1155Btn) {
            _m1155Btn.addEventListener('click', async function() {
                if (!signer) { toast('error', 'Cần kết nối ví (🦊) trước!'); return; }

                var contractAddr = document.getElementById('m1155-contract-addr').value.trim();
                var recipient = document.getElementById('m1155-recipient').value.trim();
                var tokenId = document.getElementById('m1155-token-id').value.trim();
                var amount = document.getElementById('m1155-amount').value.trim();

                if (!contractAddr || !contractAddr.startsWith('0x') || contractAddr.length !== 42) {
                    toast('error', 'Nhập địa chỉ Contract ERC-1155 hợp lệ!'); return;
                }
                if (!recipient) recipient = userAddr;
                if (!recipient.startsWith('0x') || recipient.length !== 42) {
                    toast('error', 'Địa chỉ ví nhận không hợp lệ!'); return;
                }
                if (tokenId === '' || isNaN(parseInt(tokenId)) || parseInt(tokenId) < 0) {
                    toast('error', 'Nhập Mã Huy Hiệu (Token ID) hợp lệ!'); return;
                }
                if (!amount || isNaN(parseInt(amount)) || parseInt(amount) < 1) {
                    toast('error', 'Nhập Số lượng đúc hợp lệ (ít nhất 1)!'); return;
                }

                try {
                    _m1155Btn.disabled = true; _m1155Btn.style.opacity = '0.5';
                    _m1155Result.style.display = 'none';
                    _m1155Status.innerHTML = '<span style="color:#06b6d4;">⏳ Đang gửi giao dịch đúc Huy Hiệu... (Xác nhận trên MetaMask)</span>';

                    var collection = new ethers.Contract(contractAddr, M1155_ABI, signer);

                    // Kiểm tra quyền Owner
                    try {
                        var contractOwner = await collection.owner();
                        if (contractOwner.toLowerCase() !== userAddr.toLowerCase()) {
                            throw new Error('Bạn không phải Owner của bộ sưu tập này! Chỉ Owner hoặc tài khoản được cấp quyền mới có thể Mint.');
                        }
                    } catch(ownerErr) {
                        if (ownerErr.message.includes('Owner')) throw ownerErr;
                    }

                    var tx = await collection.mint(recipient, parseInt(tokenId), parseInt(amount), '0x');
                    _m1155Status.innerHTML = '<span style="color:#06b6d4;">⛏️ Đang đợi Blockchain xác nhận...</span>';
                    var receipt = await tx.wait();

                    document.getElementById('m1155-result-tokenid').innerText = '#' + tokenId;
                    document.getElementById('m1155-result-amount').innerText = amount + ' chiếc';
                    document.getElementById('m1155-result-recipient').innerText = recipient;
                    document.getElementById('m1155-result-link').href = 'https://sepolia.etherscan.io/tx/' + receipt.hash;
                    _m1155Result.style.display = 'block';

                    _m1155Status.innerHTML = '<span style="color:#10b981;">✅ Hoàn tất! Đã đúc <strong>' + amount + '</strong> huy hiệu ID #' + tokenId + ' thành công!</span>';
                    toast('success', '🎖️ Mint ' + amount + ' Huy Hiệu #' + tokenId + ' thành công!');

                    document.getElementById('m1155-token-id').value = '';
                    document.getElementById('m1155-amount').value = '1';
                    document.getElementById('m1155-recipient').value = '';
                    if (window.refreshAllBalances) window.refreshAllBalances();
                } catch(e) {
                    var msg = e.reason || e.message || 'Lỗi không xác định';
                    if (msg.includes('user rejected')) msg = 'Bạn đã từ chối giao dịch trên MetaMask!';
                    _m1155Status.innerHTML = '<span style="color:#ef4444;">❌ ' + msg.substring(0, 100) + '</span>';
                    toast('error', 'Thất bại: ' + msg.substring(0, 60));
                } finally {
                    _m1155Btn.disabled = false; _m1155Btn.style.opacity = '1';
                }
            });
        }
    `,
    bindings: []
}
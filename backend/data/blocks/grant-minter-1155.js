// ==================== KHỐI: PHÂN QUYỀN BỘ SƯU TẬP (GRANT ROLE 1155) ====================
export default {
    id: "grant-minter-1155",
    name: "🔑 Phân Quyền BST (1155)",
    desc: "Cấp hoặc Thu hồi Quyền Đúc (Máy Gacha) và Quyền Tạo Mẫu (Học sinh) cho ERC-1155",
    color: "#f59e0b",
    label: "Phân Quyền BST (1155)",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#f59e0b;">
        <div class="khoi-title" style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:24px;">🔑</span>
            <span style="background:linear-gradient(135deg,#f59e0b,#d97706);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:16px;letter-spacing:1px;">PHÂN QUYỀN BỘ SƯU TẬP (1155)</span>
        </div>

        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:15px;margin-bottom:12px;">
            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Địa chỉ Contract Bộ Sưu Tập Huy Hiệu</label>
            <input type="text" id="g1155-collection-addr" placeholder="0x... (ERC-1155)" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;margin-bottom:12px;">

            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Địa chỉ Ví / Máy nhận quyền</label>
            <input type="text" id="g1155-target-addr" placeholder="0x... (Ví học sinh hoặc Máy đúc)" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;margin-bottom:12px;">
            
            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Loại Quyền Cấp / Thu Hồi</label>
            <select id="g1155-role-select" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#f59e0b;font-size:13px;font-weight:bold;outline:none;margin-bottom:4px;">
                <option value="MINTER">⛏️ Quyền Đúc Huy Hiệu (MINTER_ROLE) — Dành cho Máy</option>
                <option value="TEMPLATE_CREATOR">🎨 Quyền Tạo Mẫu (TEMPLATE_CREATOR_ROLE) — Dành cho Học sinh</option>
            </select>
            <div style="font-size:10px;color:#64748b;">💡 Phân quyền đúng giúp bảo vệ bộ sưu tập của bạn.</div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <button id="g1155-grant-btn" style="padding:12px;border-radius:10px;border:none;background:linear-gradient(135deg,#10b981,#059669);color:white;font-size:13px;font-weight:bold;cursor:pointer;">🚀 CẤP QUYỀN</button>
            <button id="g1155-revoke-btn" style="padding:12px;border-radius:10px;border:none;background:linear-gradient(135deg,#ef4444,#dc2626);color:white;font-size:13px;font-weight:bold;cursor:pointer;">❌ THU HỒI</button>
        </div>

        <div id="g1155-status" style="margin-top:12px;font-size:12px;text-align:center;color:#94a3b8;min-height:20px;"></div>
    </div>`,

    engineCode: () => `
        var G1155_ABI = [
            "function grantMinterRole(address minter) public",
            "function revokeMinterRole(address minter) public",
            "function grantRole(bytes32 role, address account) public",
            "function revokeRole(bytes32 role, address account) public",
            "function owner() view returns (address)"
        ];

        var _g1155GrantBtn = document.getElementById('g1155-grant-btn');
        var _g1155RevokeBtn = document.getElementById('g1155-revoke-btn');
        var _g1155Status = document.getElementById('g1155-status');

        async function _handleRole1155(isGrant) {
            if (!signer) { toast('error', 'Cần kết nối ví (🦊) trước!'); return; }

            var colAddr = document.getElementById('g1155-collection-addr').value.trim();
            var targetAddr = document.getElementById('g1155-target-addr').value.trim();
            var roleType = document.getElementById('g1155-role-select').value;

            if (!colAddr || !colAddr.startsWith('0x') || colAddr.length !== 42) {
                toast('error', 'Địa chỉ Bộ Sưu Tập không hợp lệ!'); return;
            }
            if (!targetAddr || !targetAddr.startsWith('0x') || targetAddr.length !== 42) {
                toast('error', 'Địa chỉ Ví/Máy nhận quyền không hợp lệ!'); return;
            }

            try {
                _g1155GrantBtn.disabled = true; _g1155RevokeBtn.disabled = true;
                _g1155GrantBtn.style.opacity = '0.5'; _g1155RevokeBtn.style.opacity = '0.5';

                _g1155Status.innerHTML = '<span style="color:#f59e0b;">⏳ Đang gửi yêu cầu... (Xác nhận trên MetaMask)</span>';
                
                var collection = new ethers.Contract(colAddr, G1155_ABI, signer);
                var tx;
                
                if (roleType === "MINTER") {
                    if (isGrant) tx = await collection.grantMinterRole(targetAddr);
                    else tx = await collection.revokeMinterRole(targetAddr);
                } else {
                    var roleHash = (typeof ethers.id === 'function') ? ethers.id("TEMPLATE_CREATOR_ROLE") : ethers.utils.id("TEMPLATE_CREATOR_ROLE");
                    if (isGrant) tx = await collection.grantRole(roleHash, targetAddr);
                    else tx = await collection.revokeRole(roleHash, targetAddr);
                }

                _g1155Status.innerHTML = '<span style="color:#f59e0b;">⏳ Đang chờ Blockchain xác nhận...</span>';
                await tx.wait();

                var actionStr = isGrant ? "Cấp Quyền" : "Thu Hồi Quyền";
                var roleName = roleType === "MINTER" ? "Đúc Huy Hiệu" : "Tạo Mẫu";
                _g1155Status.innerHTML = '<span style="color:#10b981;">✅ Hoàn tất! Đã ' + actionStr + ' ' + roleName + ' thành công!</span>';
                toast('success', 'Thành công: ' + actionStr + ' ' + roleName + '!');
                
            } catch(e) {
                var msg = e.reason || e.message || 'Lỗi không xác định';
                if (msg.includes('user rejected')) msg = 'Bạn đã từ chối giao dịch trên MetaMask!';
                if (msg.includes('Not authorized') || msg.includes('AccessControl')) msg = 'Bạn không phải Admin của bộ sưu tập này!';
                _g1155Status.innerHTML = '<span style="color:#ef4444;">❌ ' + msg.substring(0, 100) + '</span>';
                toast('error', 'Thất bại: ' + msg.substring(0, 50));
            } finally {
                _g1155GrantBtn.disabled = false; _g1155RevokeBtn.disabled = false;
                _g1155GrantBtn.style.opacity = '1'; _g1155RevokeBtn.style.opacity = '1';
            }
        }

        if (_g1155GrantBtn) {
            _g1155GrantBtn.addEventListener('click', () => _handleRole1155(true));
            _g1155RevokeBtn.addEventListener('click', () => _handleRole1155(false));
        }
    `,
    bindings: []
}


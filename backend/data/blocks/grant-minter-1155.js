import { FACTORY_ADDRESSES } from '../contracts/contractFactorys.js';

// ==================== KHỐI: PHÂN QUYỀN BỘ SƯU TẬP (GRANT ROLE 1155) ====================
export default {
    id: "grant-minter-1155",
    name: "🔑 Phân Quyền BST (1155)",
    desc: "Cấp hoặc Thu hồi Quyền Đúc (Máy Phát Quà) và Quyền Tạo Mẫu (Học sinh) cho ERC-1155",
    color: "#f59e0b",
    label: "Phân Quyền BST (1155)",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#f59e0b;">
        <div class="khoi-title" style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:22px;">🔑</span>
            <span style="background:linear-gradient(135deg,#f59e0b,#d97706);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:15px;letter-spacing:0.5px;">PHÂN QUYỀN BỘ SƯU TẬP (1155)</span>
        </div>

        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:14px;margin-bottom:12px;">
            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Địa chỉ Contract Bộ Sưu Tập Huy Hiệu</label>
            <input type="text" id="g1155-collection-addr" placeholder="0x... (ERC-1155)" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;margin-bottom:12px;">

            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Loại Quyền Cấp / Thu Hồi</label>
            <select id="g1155-role-select" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#f59e0b;font-size:13px;font-weight:bold;outline:none;margin-bottom:12px;">
                <option value="MINTER">⛏️ Quyền Đúc Huy Hiệu (MINTER_ROLE) — Dành cho Máy</option>
                <option value="TEMPLATE_CREATOR">🎨 Quyền Tạo Mẫu (TEMPLATE_CREATOR_ROLE) — Học sinh</option>
            </select>

            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Địa chỉ Ví / Máy nhận quyền</label>
            <input type="text" id="g1155-target-addr" placeholder="0x... (dán tay hoặc bấm nút gợi ý dưới)" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;margin-bottom:8px;">

            <div style="display:flex;gap:6px;margin-bottom:8px;">
                <button id="g1155-use-machine" style="flex:1;min-width:0;width:auto;padding:8px 6px;border-radius:8px;border:1px solid #f59e0b;background:rgba(245,158,11,0.12);color:#fbbf24;font-size:11px;font-weight:bold;cursor:pointer;">🎁 Máy Phát Huy Hiệu</button>
                <button id="g1155-use-me" style="flex:1;min-width:0;width:auto;padding:8px 6px;border-radius:8px;border:1px solid #475569;background:transparent;color:#94a3b8;font-size:11px;font-weight:bold;cursor:pointer;">👤 Ví của tôi</button>
            </div>

            <div id="g1155-hint" style="font-size:10px;color:#64748b;line-height:1.5;background:#1e293b;padding:8px;border-radius:6px;"></div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <button id="g1155-grant-btn" style="padding:12px;border-radius:10px;border:none;background:linear-gradient(135deg,#10b981,#059669);color:white;font-size:13px;font-weight:bold;cursor:pointer;">🚀 CẤP QUYỀN</button>
            <button id="g1155-revoke-btn" style="padding:12px;border-radius:10px;border:none;background:linear-gradient(135deg,#ef4444,#dc2626);color:white;font-size:13px;font-weight:bold;cursor:pointer;">❌ THU HỒI</button>
        </div>

        <div id="g1155-status" style="margin-top:10px;font-size:12px;text-align:center;color:#94a3b8;min-height:20px;"></div>
    </div>`,

    engineCode: () => `
        var G1155_MACHINE = '${FACTORY_ADDRESSES.FREE_MINT_1155}';
        var G1155_ABI = [
            "function grantMinterRole(address minter) public",
            "function revokeMinterRole(address minter) public",
            "function grantRole(bytes32 role, address account) public",
            "function revokeRole(bytes32 role, address account) public",
            "function owner() view returns (address)"
        ];

        var _g1155GrantBtn  = document.getElementById('g1155-grant-btn');
        var _g1155RevokeBtn = document.getElementById('g1155-revoke-btn');
        var _g1155Status    = document.getElementById('g1155-status');
        var _g1155Role      = document.getElementById('g1155-role-select');
        var _g1155Target    = document.getElementById('g1155-target-addr');
        var _g1155Hint      = document.getElementById('g1155-hint');
        var _g1155UseMachine= document.getElementById('g1155-use-machine');
        var _g1155UseMe     = document.getElementById('g1155-use-me');

        // Gợi ý đổi theo loại quyền đang chọn
        function _g1155UpdateHint() {
            if (_g1155Role.value === 'MINTER') {
                _g1155Hint.innerHTML = '⛏️ <b style="color:#fbbf24;">MINTER_ROLE</b> cấp cho <b>Máy Phát Huy Hiệu</b> — bấm nút 🎁 ở trên để điền sẵn.<br>'
                    + '<span style="color:#475569;font-family:monospace;font-size:9px;word-break:break-all;">' + G1155_MACHINE + '</span><br>'
                    + 'Không có quyền này thì học sinh KHÔNG tự nhận huy hiệu được.<br>'
                    + '<span style="color:#64748b;">Cùng một máy này phục vụ cả khối Vận Động Nhận Thưởng (bài 12) và Định Vị GPS (bài 13).</span>';
                _g1155UseMachine.style.borderColor = '#f59e0b';
                _g1155UseMachine.style.background = 'rgba(245,158,11,0.12)';
            } else {
                _g1155Hint.innerHTML = '🎨 <b style="color:#a78bfa;">TEMPLATE_CREATOR_ROLE</b> cấp cho <b>ví học sinh</b> để các em tự thiết kế huy hiệu.<br>'
                    + 'Dán địa chỉ ví học sinh vào ô trên (không dùng địa chỉ Máy Phát).';
                _g1155UseMachine.style.borderColor = '#475569';
                _g1155UseMachine.style.background = 'transparent';
            }
        }
        if (_g1155Role) { _g1155Role.addEventListener('change', _g1155UpdateHint); _g1155UpdateHint(); }

        if (_g1155UseMachine) {
            _g1155UseMachine.addEventListener('click', function() {
                _g1155Target.value = G1155_MACHINE;
                _g1155Role.value = 'MINTER';
                _g1155UpdateHint();
                toast('info', 'Đã điền địa chỉ Máy Phát Huy Hiệu');
            });
        }
        if (_g1155UseMe) {
            _g1155UseMe.addEventListener('click', function() {
                if (!userAddr) { toast('error', 'Hãy kết nối ví trước!'); return; }
                _g1155Target.value = userAddr;
                toast('info', 'Đã điền địa chỉ ví của bạn');
            });
        }

        async function _handleRole1155(isGrant) {
            if (!signer) { toast('error', 'Cần kết nối ví (🦊) trước!'); return; }

            var colAddr    = document.getElementById('g1155-collection-addr').value.trim();
            var targetAddr = _g1155Target.value.trim();
            var roleType   = _g1155Role.value;

            if (!colAddr || !colAddr.startsWith('0x') || colAddr.length !== 42) {
                toast('error', 'Địa chỉ Bộ Sưu Tập không hợp lệ!'); return;
            }
            if (!targetAddr || !targetAddr.startsWith('0x') || targetAddr.length !== 42) {
                toast('error', 'Địa chỉ Ví/Máy nhận quyền không hợp lệ!'); return;
            }

            // Nhắc khi cấp MINTER cho ví người thay vì Máy Phát
            if (isGrant && roleType === 'MINTER' && targetAddr.toLowerCase() !== G1155_MACHINE.toLowerCase()) {
                if (!confirm('Bạn đang cấp Quyền Đúc cho một địa chỉ KHÁC Máy Phát Huy Hiệu.\\n\\nNếu mục đích là để học sinh tự nhận huy hiệu, hãy bấm Hủy rồi dùng nút 🎁 Máy Phát Huy Hiệu.\\n\\nVẫn tiếp tục?')) return;
            }

            try {
                _g1155GrantBtn.disabled = true; _g1155RevokeBtn.disabled = true;
                _g1155GrantBtn.style.opacity = '0.5'; _g1155RevokeBtn.style.opacity = '0.5';
                _g1155Status.innerHTML = '<span style="color:#f59e0b;">⏳ Đang gửi yêu cầu... (Xác nhận trên MetaMask)</span>';

                var collection = new ethers.Contract(colAddr, G1155_ABI, signer);
                var tx;

                if (roleType === "MINTER") {
                    if (isGrant) tx = await collection.grantMinterRole(targetAddr);
                    else         tx = await collection.revokeMinterRole(targetAddr);
                } else {
                    var roleHash = (typeof ethers.id === 'function') ? ethers.id("TEMPLATE_CREATOR_ROLE") : ethers.utils.id("TEMPLATE_CREATOR_ROLE");
                    if (isGrant) tx = await collection.grantRole(roleHash, targetAddr);
                    else         tx = await collection.revokeRole(roleHash, targetAddr);
                }

                _g1155Status.innerHTML = '<span style="color:#f59e0b;">⏳ Đang chờ Blockchain xác nhận...</span>';
                await tx.wait();

                var actionStr = isGrant ? "Cấp Quyền" : "Thu Hồi Quyền";
                var roleName  = roleType === "MINTER" ? "Đúc Huy Hiệu" : "Tạo Mẫu";
                var who       = targetAddr.toLowerCase() === G1155_MACHINE.toLowerCase()
                                ? 'Máy Phát Huy Hiệu'
                                : targetAddr.substring(0,6) + '...' + targetAddr.slice(-4);
                _g1155Status.innerHTML = '<span style="color:#10b981;">✅ Đã ' + actionStr + ' ' + roleName + ' cho ' + who + '!</span>';
                toast('success', 'Thành công: ' + actionStr + ' ' + roleName + '!');

            } catch(e) {
                var msg = e.reason || e.message || 'Lỗi không xác định';
                if (msg.includes('user rejected')) msg = 'Bạn đã từ chối giao dịch trên MetaMask!';
                if (msg.includes('Not authorized') || msg.includes('AccessControl') || msg.includes('Unauthorized')) msg = 'Bạn không phải Owner của bộ sưu tập này!';
                _g1155Status.innerHTML = '<span style="color:#ef4444;">❌ ' + msg.substring(0, 100) + '</span>';
                toast('error', 'Thất bại: ' + msg.substring(0, 50));
            } finally {
                _g1155GrantBtn.disabled = false; _g1155RevokeBtn.disabled = false;
                _g1155GrantBtn.style.opacity = '1'; _g1155RevokeBtn.style.opacity = '1';
            }
        }

        if (_g1155GrantBtn) {
            _g1155GrantBtn.addEventListener('click', function(){ _handleRole1155(true); });
            _g1155RevokeBtn.addEventListener('click', function(){ _handleRole1155(false); });
        }
    `,
    bindings: []
}
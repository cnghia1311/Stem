import { FACTORY_ADDRESSES } from '../contracts/contractFactorys.js';

// ==================== KHỐI: ĐÚC HUY HIỆU TỰ DO (FREE CLAIM 1155) ====================
export default {
    id: "free-claim-1155",
    name: "🎁 Đúc Huy Hiệu Tự Do",
    desc: "Học sinh tự nhận Huy hiệu về ví qua máy phát trung gian — mỗi người 1 chiếc",
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

            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Mã Huy Hiệu (Token ID)</label>
            <input type="number" id="fc1155-token-id" placeholder="VD: 1" min="0" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:14px;outline:none;margin-bottom:8px;">

            <div style="font-size:10px;color:#64748b;">🎖️ Mỗi người chỉ nhận được <b style="color:#f472b6;">1 chiếc</b> huy hiệu này. Bạn tự trả một chút phí Gas (ETH Sepolia).</div>
        </div>

        <div id="fc1155-preview" style="display:none;background:#1e1b3a;border:1px solid #7c3aed;border-radius:12px;padding:12px;margin-bottom:12px;text-align:center;"></div>

        <button id="fc1155-claim-btn" style="width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#ec4899,#be185d);color:white;font-size:15px;font-weight:800;cursor:pointer;letter-spacing:1px;">🎁 NHẬN HUY HIỆU NGAY</button>
        <div id="fc1155-status" style="margin-top:10px;font-size:12px;text-align:center;color:#94a3b8;min-height:20px;line-height:1.5;"></div>
    </div>`,

    engineCode: () => `
        // Đặt true nếu về sau bạn muốn cho nhận nhiều chiếc (vé, vật phẩm game...).
        // Để false cho huy hiệu / bằng khen: mỗi ví đúng 1 chiếc.
        var FC1155_ALLOW_MULTIPLE = false;

        var FC1155_ADDR = '${FACTORY_ADDRESSES.FREE_MINT_1155}';
        var FC1155_ABI = [
            "function claimBadge(address collection, uint256 tokenId, uint256 amount) public"
        ];
        var FC1155_COL_ABI = [
            "function balanceOf(address account, uint256 id) view returns (uint256)",
            "function uri(uint256 id) view returns (string)",
            "function name() view returns (string)",
            "function isSoulbound() view returns (bool)"
        ];
        var FC1155_GATEWAYS = ['https://gateway.pinata.cloud/ipfs/', 'https://ipfs.io/ipfs/', 'https://cloudflare-ipfs.com/ipfs/'];

        var _fc1155MetaCache = {};
        var _fc1155Owned     = 0;      // số huy hiệu ví đang giữ
        var _fc1155Ready     = false;  // đã kiểm tra xong và đủ điều kiện nhận
        var _fc1155Timer     = null;

        var _fc1155Btn      = document.getElementById('fc1155-claim-btn');
        var _fc1155Status   = document.getElementById('fc1155-status');
        var _fc1155Preview  = document.getElementById('fc1155-preview');
        var _fc1155ColInput = document.getElementById('fc1155-collection-addr');
        var _fc1155IdInput  = document.getElementById('fc1155-token-id');

        try {
            var urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('col') && _fc1155ColInput) _fc1155ColInput.value = urlParams.get('col');
            if (urlParams.get('id')  && _fc1155IdInput)  _fc1155IdInput.value  = urlParams.get('id');
        } catch(e) {}

        function _fc1155SetStatus(msg, color) {
            _fc1155Status.innerHTML = msg ? '<span style="color:' + (color || '#94a3b8') + '">' + msg + '</span>' : '';
        }
        function _fc1155Provider() {
            if (provider) return provider;
            if (window.ethereum) return new ethers.providers.Web3Provider(window.ethereum);
            return null;
        }
        function _fc1155LockBtn(locked, label) {
            _fc1155Ready = !locked;
            _fc1155Btn.disabled = locked;
            _fc1155Btn.style.background = locked ? '#475569' : 'linear-gradient(135deg,#ec4899,#be185d)';
            _fc1155Btn.style.color = locked ? '#94a3b8' : '#fff';
            _fc1155Btn.style.cursor = locked ? 'not-allowed' : 'pointer';
            if (label) _fc1155Btn.innerText = label;
        }

        async function _fc1155Meta(uri, id) {
            if (!uri) return { name: null, image: '' };
            var key = uri + '|' + id;
            if (_fc1155MetaCache[key]) return _fc1155MetaCache[key];
            var cid = uri.replace('ipfs://', '').replace('{id}', id);
            var out = { name: null, image: '' };
            for (var g = 0; g < FC1155_GATEWAYS.length; g++) {
                try {
                    var r = await fetch(FC1155_GATEWAYS[g] + cid, { signal: AbortSignal.timeout(5000) });
                    if (!r.ok) continue;
                    var j = await r.json();
                    out.name = j.name || null;
                    out.image = j.image ? j.image.replace('ipfs://', FC1155_GATEWAYS[0]) : '';
                    break;
                } catch(e) {}
            }
            _fc1155MetaCache[key] = out;
            return out;
        }

        // ---- Xem trước huy hiệu + kiểm tra đã nhận chưa ----
        async function _fc1155Check() {
            var colAddr = _fc1155ColInput.value.trim();
            var tokenId = _fc1155IdInput.value.trim();

            if (!colAddr || colAddr.length !== 42 || tokenId === '') {
                _fc1155Preview.style.display = 'none';
                _fc1155LockBtn(false, '🎁 NHẬN HUY HIỆU NGAY');
                _fc1155SetStatus('');
                return;
            }

            var prov = _fc1155Provider();
            if (!prov) { _fc1155SetStatus('🔗 Cần cài MetaMask để xem huy hiệu.', '#f59e0b'); return; }

            _fc1155Preview.style.display = 'block';
            _fc1155Preview.innerHTML = '<span style="color:#94a3b8;font-size:12px;">⏳ Đang đọc thông tin huy hiệu...</span>';

            try {
                var c = new ethers.Contract(colAddr, FC1155_COL_ABI, prov);

                var colName = ''; try { colName = await c.name(); } catch(e) {}
                var soulbound = false; try { soulbound = await c.isSoulbound(); } catch(e) {}

                var uri = ''; try { uri = await c.uri(tokenId); } catch(e) {}
                var meta = await _fc1155Meta(uri, tokenId);

                // Đã nhận chưa?
                _fc1155Owned = 0;
                if (userAddr) {
                    try { _fc1155Owned = (await c.balanceOf(userAddr, tokenId)).toNumber(); } catch(e) {}
                }

                var html = '';
                html += meta.image
                    ? '<img src="' + meta.image + '" style="width:90px;height:90px;object-fit:cover;border-radius:12px;border:2px solid #7c3aed;margin-bottom:8px;">'
                    : '<div style="font-size:38px;margin-bottom:6px;">🎖️</div>';
                html += '<div style="font-size:13px;font-weight:bold;color:#e2e8f0;">' + (meta.name || ('Huy hiệu #' + tokenId)) + '</div>';
                if (colName) html += '<div style="font-size:10px;color:#94a3b8;margin-top:2px;">' + colName + (soulbound ? ' · Soulbound 🔒' : '') + '</div>';
                html += '<div style="font-size:10px;color:#64748b;margin-top:4px;">Mã #' + tokenId + '</div>';
                _fc1155Preview.innerHTML = html;

                if (!userAddr) {
                    _fc1155LockBtn(false, '🎁 NHẬN HUY HIỆU NGAY');
                    _fc1155SetStatus('🔗 Hãy kết nối ví để nhận huy hiệu.', '#94a3b8');
                    return;
                }

                if (_fc1155Owned > 0 && !FC1155_ALLOW_MULTIPLE) {
                    _fc1155LockBtn(true, '✅ BẠN ĐÃ CÓ HUY HIỆU NÀY');
                    _fc1155SetStatus('🎖️ Bạn đã nhận huy hiệu này rồi — mỗi người chỉ nhận được 1 chiếc.', '#10b981');
                } else {
                    _fc1155LockBtn(false, '🎁 NHẬN HUY HIỆU NGAY');
                    _fc1155SetStatus('✅ Bạn chưa có huy hiệu này. Bấm nút để nhận!', '#10b981');
                }

            } catch(e) {
                _fc1155Preview.style.display = 'none';
                _fc1155LockBtn(false, '🎁 NHẬN HUY HIỆU NGAY');
                _fc1155SetStatus('⚠️ Không đọc được bộ sưu tập này (sai địa chỉ hoặc sai mạng).', '#f59e0b');
            }
        }

        function _fc1155Trigger() {
            clearTimeout(_fc1155Timer);
            _fc1155Timer = setTimeout(_fc1155Check, 500);
        }
        if (_fc1155ColInput) _fc1155ColInput.addEventListener('input', _fc1155Trigger);
        if (_fc1155IdInput)  _fc1155IdInput.addEventListener('input', _fc1155Trigger);

        // Nếu link có sẵn ?col=&id= thì kiểm tra luôn khi mở trang
        if (_fc1155ColInput && _fc1155ColInput.value.trim().length === 42 && _fc1155IdInput.value.trim() !== '') {
            setTimeout(_fc1155Check, 600);
        }

        if (_fc1155Btn) {
            _fc1155Btn.addEventListener('click', async function() {
                if (!signer) { toast('error', 'Cần kết nối ví (🦊) trước!'); return; }
                if (!FC1155_ADDR || FC1155_ADDR.length !== 42) {
                    toast('error', 'Hệ thống Máy phát quà chưa được Admin cài đặt!'); return;
                }

                var colAddr = _fc1155ColInput.value.trim();
                var tokenId = _fc1155IdInput.value.trim();

                if (!colAddr || !colAddr.startsWith('0x') || colAddr.length !== 42) {
                    toast('error', 'Địa chỉ Bộ Sưu Tập không hợp lệ!'); return;
                }
                if (tokenId === '' || isNaN(parseInt(tokenId)) || parseInt(tokenId) < 0) {
                    toast('error', 'Nhập Mã Huy Hiệu hợp lệ (số ≥ 0)!'); return;
                }

                // Chốt chặn: kiểm tra lại ngay trước khi gửi, tránh bấm 2 lần liên tiếp
                if (!FC1155_ALLOW_MULTIPLE) {
                    try {
                        var prov = _fc1155Provider();
                        var cc = new ethers.Contract(colAddr, FC1155_COL_ABI, prov);
                        var bal = (await cc.balanceOf(userAddr, tokenId)).toNumber();
                        if (bal > 0) {
                            _fc1155LockBtn(true, '✅ BẠN ĐÃ CÓ HUY HIỆU NÀY');
                            _fc1155SetStatus('🎖️ Bạn đã nhận huy hiệu này rồi — mỗi người chỉ nhận được 1 chiếc.', '#f59e0b');
                            toast('info', 'Bạn đã có huy hiệu này rồi!');
                            return;
                        }
                    } catch(e) {} // đọc lỗi thì vẫn cho thử, để contract quyết
                }

                var amount = FC1155_ALLOW_MULTIPLE ? 1 : 1;   // luôn 1 chiếc

                try {
                    _fc1155LockBtn(true, '⏳ ĐANG NHẬN...');
                    _fc1155SetStatus('⏳ Đang xin Huy hiệu... (Xác nhận trên MetaMask)', '#ec4899');

                    var freeMintMachine = new ethers.Contract(FC1155_ADDR, FC1155_ABI, signer);
                    var tx = await freeMintMachine.claimBadge(colAddr, parseInt(tokenId), amount);

                    _fc1155SetStatus('⛏️ Đang chờ Blockchain xác nhận đúc...', '#ec4899');
                    await tx.wait();

                    _fc1155SetStatus('✅ Tuyệt vời! Huy hiệu (Mã #' + tokenId + ') đã vào ví bạn!<br><span style="font-size:10px;color:#94a3b8;">Mở MetaMask → tab NFTs → Import NFT → dán địa chỉ và Mã #' + tokenId + ' để xem.</span>', '#10b981');
                    toast('success', '🎁 Nhận huy hiệu thành công!');

                    await _fc1155Check();   // cập nhật lại: nút sẽ khoá vì đã có

                } catch(e) {
                    var msg = e.reason || e.message || 'Lỗi không xác định';
                    if (msg.includes('user rejected')) msg = 'Bạn đã từ chối giao dịch trên MetaMask!';
                    else if (msg.includes('Not authorized')) msg = 'Bộ sưu tập này chưa cấp quyền cho Máy Phát Quà! Báo giáo viên dùng khối 🔑 Phân Quyền.';
                    _fc1155SetStatus('❌ ' + msg.substring(0, 110), '#ef4444');
                    toast('error', 'Nhận thất bại: ' + msg.substring(0, 50));
                    _fc1155LockBtn(false, '🎁 NHẬN HUY HIỆU NGAY');
                }
            });
        }
    `,
    bindings: []
}
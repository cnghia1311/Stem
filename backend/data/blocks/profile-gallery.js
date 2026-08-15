// ==================== KHỐI 14: PROFILE GALLERY (BẢNG VINH DANH) ====================
export default {
    id: "profile-gallery",
    name: "🏆 Bảng Vinh Danh Lớp",
    desc: "Dán địa chỉ BST là tự liệt kê chứng chỉ, chọn loại/Token ID để xem ai đang giữ",
    color: "#a855f7",
    label: "Bảng Phong Thần",
    config: [
        { key: "contractAddr", label: "🏛️ Địa chỉ Hợp đồng Bằng Khen", type: "text" }
    ],
    preview: () => `
        <div style="text-align:center;padding:8px;">
            <div style="font-size:30px;margin-bottom:6px;">🏆</div>
            <div class="pv-input">Mã Bằng Khen</div>
            <div class="pv-input">🎓 Chọn chứng chỉ...</div>
            <div style="display:flex;gap:4px;margin-top:4px;">
                <div style="flex:1;padding:4px;background:#10b981;border-radius:4px;font-size:7px;color:white;">🎓 0xA...</div>
                <div style="flex:1;padding:4px;background:#10b981;border-radius:4px;font-size:7px;color:white;">🎓 0xB...</div>
            </div>
        </div>`,
    exportHtml: (tk, cfg) => {
        const addr = (cfg && cfg.contractAddr) || '';
        return `
    <div class="khoi" style="border-left-color:#a855f7;">
        <div class="khoi-title" style="color:#c084fc;">🏆 BẢNG VINH DANH LỚP HỌC</div>
        <p style="font-size:11px;color:#cbd5e1;margin-bottom:12px;line-height:1.5;">Dán địa chỉ Bộ Sưu Tập, đợi một chút là hiện danh sách chứng chỉ để chọn.</p>

        <input type="text" id="honor-contract" placeholder="🏛️ Mã Hợp Đồng Bằng Khen (0x...)" value="${addr}" style="width:100%;background:#0f172a;color:#fff;border:1px solid #334155;padding:10px;border-radius:6px;font-size:11px;margin-bottom:8px;">

        <select id="honor-select" disabled style="width:100%;background:#0f172a;color:#e2e8f0;border:1px solid #334155;padding:10px;border-radius:6px;font-size:12px;margin-bottom:6px;cursor:pointer;">
            <option value="all">-- Dán địa chỉ bộ sưu tập ở trên --</option>
        </select>
        <div id="honor-load-status" style="font-size:10px;color:#64748b;margin-bottom:10px;min-height:14px;"></div>

        <button id="honor-btn" style="background:linear-gradient(45deg, #7c3aed, #a855f7);width:100%;padding:12px;border-radius:10px;border:none;color:white;font-weight:bold;font-size:13px;cursor:pointer;margin-bottom:10px;">🔄 QUÉT LẠI</button>

        <div id="honor-summary" style="display:none;background:#1e1b3a;border:1px solid #7c3aed;border-radius:8px;padding:8px 10px;margin-bottom:10px;font-size:11px;color:#c4b5fd;text-align:center;line-height:1.6;"></div>

        <div id="honor-grid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(140px, 1fr));gap:8px;">
            <div style="text-align:center;grid-column:1/-1;color:#64748b;font-size:12px;padding:15px;">Chưa có dữ liệu. Dán Mã Hợp Đồng để bắt đầu...</div>
        </div>
    </div>`;
    },
    engineCode: (pfx) => `
    var HONOR_ABI = [
        "function totalSupply() view returns (uint256)",
        "function tokenByIndex(uint256 index) view returns (uint256)",
        "function ownerOf(uint256 tokenId) view returns (address)",
        "function tokenURI(uint256 tokenId) view returns (string)",
        "function name() view returns (string)",
        "function isSoulbound() view returns (bool)"
    ];
    var HONOR_GATEWAYS = ['https://gateway.pinata.cloud/ipfs/', 'https://ipfs.io/ipfs/', 'https://cloudflare-ipfs.com/ipfs/'];

    var _honorMetaCache = {};   // tokenURI -> { name, image }
    var _honorItems     = [];   // { id, owner, name, image, key }
    var _honorTypes     = [];   // { name, image, key, ids[], ownerCount }
    var _honorAddr      = '';
    var _honorColName   = '';
    var _honorSoulbound = false;
    var _honorTimer     = null;

    var _honorInput   = document.getElementById('honor-contract');
    var _honorSelect  = document.getElementById('honor-select');
    var _honorLoadSt  = document.getElementById('honor-load-status');
    var _honorBtn     = document.getElementById('honor-btn');
    var _honorGrid    = document.getElementById('honor-grid');
    var _honorSummary = document.getElementById('honor-summary');

    function _honorEsc(s) {
        return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
    function _honorSt(msg, color) {
        _honorLoadSt.innerHTML = msg ? '<span style="color:' + (color || '#64748b') + '">' + msg + '</span>' : '';
    }
    function _honorProvider() {
        if (provider) return provider;
        if (window.ethereum) return new ethers.providers.Web3Provider(window.ethereum);
        return null;
    }

    // Nhiều chứng chỉ cùng mẫu dùng chung tokenURI -> chỉ tải IPFS 1 lần
    async function _honorMeta(uri) {
        if (!uri) return { name: null, image: '' };
        if (_honorMetaCache[uri]) return _honorMetaCache[uri];
        var cid = uri.replace('ipfs://', '');
        var out = { name: null, image: '' };
        for (var g = 0; g < HONOR_GATEWAYS.length; g++) {
            try {
                var r = await fetch(HONOR_GATEWAYS[g] + cid, { signal: AbortSignal.timeout(5000) });
                if (!r.ok) continue;
                var j = await r.json();
                out.name  = j.name || null;
                out.image = j.image ? j.image.replace('ipfs://', HONOR_GATEWAYS[0]) : '';
                break;
            } catch(e) {}
        }
        _honorMetaCache[uri] = out;
        return out;
    }

    function _honorReset(msg) {
        _honorItems = []; _honorTypes = []; _honorAddr = '';
        _honorSelect.innerHTML = '<option value="all">-- Dán địa chỉ bộ sưu tập ở trên --</option>';
        _honorSelect.disabled = true;
        _honorSummary.style.display = 'none';
        _honorGrid.innerHTML = '<div style="text-align:center;grid-column:1/-1;color:#64748b;font-size:12px;padding:15px;">'
            + (msg || 'Chưa có dữ liệu. Dán Mã Hợp Đồng để bắt đầu...') + '</div>';
    }

    // Gom các chứng chỉ cùng mẫu thành 1 "loại"
    function _honorBuildTypes() {
        _honorTypes = [];
        var map = {};
        _honorItems.forEach(function(it) {
            if (!map[it.key]) {
                map[it.key] = { name: it.name, image: it.image, key: it.key, ids: [], owners: {} };
                _honorTypes.push(map[it.key]);
            }
            map[it.key].ids.push(it.id);
            map[it.key].owners[it.owner.toLowerCase()] = true;
        });
        _honorTypes.forEach(function(t){ t.ownerCount = Object.keys(t.owners).length; });
    }

    function _honorBuildSelect() {
        var html = '<option value="all">🏆 Tất cả — ' + _honorItems.length + ' chứng chỉ</option>';

        // Chỉ hiện nhóm "theo loại" khi thực sự có mẫu dùng chung (nếu mỗi cái một tên thì nhóm vô nghĩa)
        var hasGroup = _honorTypes.some(function(t){ return t.ids.length > 1; });
        if (hasGroup) {
            html += '<optgroup label="── Theo loại chứng chỉ ──">';
            _honorTypes.forEach(function(t, i) {
                html += '<option value="type:' + i + '">🎓 ' + _honorEsc(t.name) + ' — ' + t.ownerCount + ' người</option>';
            });
            html += '</optgroup>';
        }

        html += '<optgroup label="── Theo từng Token ID ──">';
        _honorItems.forEach(function(it) {
            html += '<option value="id:' + it.id + '">#' + it.id + ' · ' + _honorEsc(it.name) + '</option>';
        });
        html += '</optgroup>';

        _honorSelect.innerHTML = html;
        _honorSelect.disabled = false;
        _honorSelect.value = 'all';
    }

    // Lọc trên dữ liệu đã quét — không gọi lại blockchain
    function _honorRender() {
        var val = _honorSelect.value || 'all';
        var list = _honorItems;
        var label = 'Toàn bộ bộ sưu tập';

        if (val.indexOf('type:') === 0) {
            var t = _honorTypes[parseInt(val.substring(5))];
            if (t) { list = _honorItems.filter(function(it){ return it.key === t.key; }); label = 'Loại: ' + t.name; }
        } else if (val.indexOf('id:') === 0) {
            var wanted = val.substring(3);
            list = _honorItems.filter(function(it){ return it.id === wanted; });
            label = 'Token #' + wanted;
        }

        var owners = {};
        list.forEach(function(it){ owners[it.owner.toLowerCase()] = true; });
        var ownerCount = Object.keys(owners).length;

        _honorSummary.innerHTML = '🎓 <b>' + _honorEsc(_honorColName) + '</b>'
            + (_honorSoulbound ? ' <span style="color:#fbbf24;">· Soulbound 🔒</span>' : '')
            + '<br><span style="color:#94a3b8;">' + _honorEsc(label) + '</span>'
            + '<br><b style="color:#e2e8f0;">' + list.length + '</b> chứng chỉ · <b style="color:#e2e8f0;">' + ownerCount + '</b> học sinh đang giữ';
        _honorSummary.style.display = 'block';

        if (list.length === 0) {
            _honorGrid.innerHTML = '<div style="text-align:center;grid-column:1/-1;color:#ef4444;font-size:12px;padding:20px;">Không có chứng chỉ nào khớp lựa chọn này.</div>';
            return;
        }

        var me = userAddr ? userAddr.toLowerCase() : '';
        _honorGrid.innerHTML = '';
        list.forEach(function(it) {
            var isMe = me && it.owner.toLowerCase() === me;
            var shortW = it.owner.substring(0, 6) + '...' + it.owner.slice(-4);
            var card = document.createElement('div');
            card.style.cssText = 'background:linear-gradient(135deg,#065f46,#047857);border:2px solid '
                + (isMe ? '#fbbf24' : '#10b981') + ';border-radius:10px;padding:10px;text-align:center;position:relative;';
            card.title = it.owner;

            var inner = '';
            if (isMe) inner += '<div style="position:absolute;top:4px;right:4px;background:#fbbf24;color:#0f172a;font-size:8px;font-weight:900;padding:2px 6px;border-radius:10px;">⭐ BẠN</div>';
            inner += it.image
                ? '<img src="' + it.image + '" style="width:100%;height:78px;object-fit:cover;border-radius:6px;margin-bottom:6px;border:1px solid #34d399;">'
                : '<div style="font-size:28px;margin-bottom:4px;">🎓</div>';
            inner += '<div style="font-size:10px;font-weight:bold;color:#d1fae5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + _honorEsc(it.name) + '</div>';
            inner += '<div style="font-size:9px;color:#6ee7b7;margin-top:2px;">Token #' + it.id + '</div>';
            inner += '<div style="font-size:9px;color:#a7f3d0;margin-top:4px;font-family:monospace;">' + shortW + '</div>';
            card.innerHTML = inner;
            _honorGrid.appendChild(card);
        });
    }

    async function _honorScan() {
        var addr = _honorInput.value.trim();
        if (!addr || addr.length !== 42) { _honorReset('Địa chỉ chưa hợp lệ (cần 42 ký tự).'); return; }

        var prov = _honorProvider();
        if (!prov) { toast('error', 'Cần cài MetaMask để đọc dữ liệu Blockchain!'); return; }

        _honorAddr = addr;
        _honorBtn.disabled = true; _honorBtn.innerText = '⏳ ĐANG QUÉT...';
        _honorSelect.disabled = true;
        _honorSelect.innerHTML = '<option>⏳ Đang đọc từ Blockchain...</option>';
        _honorSummary.style.display = 'none';
        _honorSt('⏳ Đang đọc danh sách chứng chỉ...', '#c084fc');
        _honorGrid.innerHTML = '<div style="text-align:center;grid-column:1/-1;color:#c084fc;font-size:12px;padding:15px;">Đang quét Blockchain...</div>';
        _honorItems = []; _honorTypes = [];

        try {
            var c = new ethers.Contract(addr, HONOR_ABI, prov);

            _honorColName = 'Bộ sưu tập';
            try { _honorColName = await c.name(); } catch(e) {}
            _honorSoulbound = false;
            try { _honorSoulbound = await c.isSoulbound(); } catch(e) {}

            var total = await c.totalSupply();
            var totalNum = total.toNumber();

            if (totalNum === 0) {
                _honorSt('⚠️ Bộ sưu tập chưa cấp chứng chỉ nào.', '#f59e0b');
                _honorSelect.innerHTML = '<option value="all">Chưa có chứng chỉ nào</option>';
                _honorGrid.innerHTML = '<div style="text-align:center;grid-column:1/-1;color:#94a3b8;font-size:12px;padding:20px;">Hãy dùng khối 🖌️ Đúc NFT để cấp chứng chỉ trước.</div>';
                _honorBtn.innerText = '🔄 QUÉT LẠI'; _honorBtn.disabled = false;
                return;
            }

            var cap = totalNum;
            if (cap > 300) { cap = 300; toast('info', 'Có ' + totalNum + ' chứng chỉ — chỉ quét 300 cái đầu.'); }

            // Bước 1: lấy toàn bộ tokenId còn tồn tại (theo cụm 10 cho đỡ nghẽn RPC)
            _honorSt('⏳ Tìm thấy ' + cap + ' chứng chỉ, đang đọc mã...', '#c084fc');
            var ids = [];
            for (var i = 0; i < cap; i += 10) {
                var chunk = [];
                for (var j = 0; j < 10 && (i + j) < cap; j++) {
                    chunk.push(c.tokenByIndex(i + j).then(function(id){ ids.push(id.toString()); }).catch(function(){}));
                }
                await Promise.all(chunk);
            }
            ids.sort(function(a, b){ return parseInt(a) - parseInt(b); });

            // Bước 2: đọc chủ sở hữu + metadata
            var done = 0;
            for (var k = 0; k < ids.length; k += 10) {
                var batch = [];
                for (var m = 0; m < 10 && (k + m) < ids.length; m++) {
                    (function(tid) {
                        batch.push((async function() {
                            try {
                                var owner = await c.ownerOf(tid);
                                var uri = '';
                                try { uri = await c.tokenURI(tid); } catch(e) {}
                                var meta = await _honorMeta(uri);
                                _honorItems.push({
                                    id: tid,
                                    owner: owner,
                                    name: meta.name || ('Chứng chỉ #' + tid),
                                    image: meta.image,
                                    key: uri || ('name:' + (meta.name || tid))
                                });
                            } catch(e) {} // token đã bị thu hồi
                        })());
                    })(ids[k + m]);
                }
                await Promise.all(batch);
                done = Math.min(k + 10, ids.length);
                _honorSt('⏳ Đang đọc chủ sở hữu ' + done + '/' + ids.length + '...', '#c084fc');
            }

            _honorItems.sort(function(a, b){ return parseInt(a.id) - parseInt(b.id); });

            if (_honorItems.length === 0) {
                _honorSt('❌ Không đọc được chứng chỉ nào.', '#ef4444');
                _honorReset('Không đọc được chứng chỉ nào từ bộ sưu tập này.');
                _honorBtn.innerText = '🔄 QUÉT LẠI'; _honorBtn.disabled = false;
                return;
            }

            _honorBuildTypes();
            _honorBuildSelect();
            _honorRender();
            _honorSt('✅ Đã tải ' + _honorItems.length + ' chứng chỉ — chọn trong ô trên để lọc.', '#10b981');
            toast('success', 'Đã quét xong ' + _honorItems.length + ' chứng chỉ!');

        } catch(e) {
            var msg = e.reason || e.message || 'Không rõ';
            if (msg.indexOf('call revert') !== -1 || msg.indexOf('CALL_EXCEPTION') !== -1) {
                msg = 'Địa chỉ này không phải Bộ Sưu Tập ERC-721 hợp lệ (hoặc sai mạng).';
            }
            _honorSt('❌ ' + msg.substring(0, 90), '#ef4444');
            _honorReset('Lỗi: ' + msg.substring(0, 90));
        } finally {
            _honorBtn.innerText = '🔄 QUÉT LẠI';
            _honorBtn.disabled = false;
        }
    }

    // Dán đủ 42 ký tự là tự quét sau 500ms
    if (_honorInput) {
        _honorInput.addEventListener('input', function() {
            clearTimeout(_honorTimer);
            var v = this.value.trim();
            if (v.length !== 42) { _honorReset(); _honorSt(''); return; }
            if (v.toLowerCase() === _honorAddr.toLowerCase()) return;
            _honorSt('⏳ Chuẩn bị quét...', '#64748b');
            _honorTimer = setTimeout(_honorScan, 500);
        });
    }

    if (_honorSelect) _honorSelect.addEventListener('change', _honorRender);

    // Nếu giáo viên đã cấu hình sẵn địa chỉ thì quét luôn khi mở trang
    if (_honorInput && _honorInput.value.trim().length === 42 && window.ethereum) {
        setTimeout(_honorScan, 400);
    }

    function checkHonorRoll() { return _honorScan(); }
    `,
    bindings: [{ btn: "honor-btn", fn: "checkHonorRoll" }]
}
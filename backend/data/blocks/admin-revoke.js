// ==================== KHỐI: ADMIN THU HỒI CHỨNG CHỈ CỦA CÁ NHÂN ====================
export default {
    id: "admin-revoke",
    name: "🔥 Thu Hồi Chứng Chỉ",
    desc: "Admin chọn học sinh, xem bằng em đó đang giữ rồi thu hồi đúng tấm cần thu",
    color: "#ef4444",
    label: "Thu Hồi Bằng Cấp",
    preview: () => `
        <div style="text-align:center;padding:8px;">
            <div style="font-size:30px;margin-bottom:6px;">🔥</div>
            <div class="pv-input">Mã Bộ Sưu Tập (0x...)</div>
            <div class="pv-input">Ví học sinh (0x...)</div>
            <div class="pv-btn" style="background:#ef4444;">THU HỒI CHỨNG CHỈ</div>
        </div>`,
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#ef4444;">
        <div class="khoi-title" style="color:#ef4444;">🔥 ADMIN: THU HỒI CHỨNG CHỈ</div>
        <p style="font-size:11px;color:#cbd5e1;margin-bottom:12px;line-height:1.5;">Thu hồi bằng của <b>riêng một học sinh</b>. Các bạn khác trong lớp không bị ảnh hưởng.</p>

        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:14px;margin-bottom:12px;">
            <label style="display:block;font-size:12px;color:#ef4444;margin-bottom:6px;font-weight:bold;">① Địa chỉ Bộ Sưu Tập</label>
            <input type="text" id="revoke-collection-addr" placeholder="Dán địa chỉ Bộ Sưu Tập (0x...)" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;margin-bottom:8px;">
            <div id="revoke-detect" style="display:none;font-size:10px;line-height:1.6;padding:8px;border-radius:6px;margin-bottom:12px;"></div>

            <label style="display:block;font-size:12px;color:#ef4444;margin-bottom:6px;font-weight:bold;">② Ví học sinh cần thu hồi</label>
            <input type="text" id="revoke-student-addr" placeholder="0x... (dán ví học sinh)" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;margin-bottom:6px;">
            <div style="display:flex;gap:6px;margin-bottom:8px;">
                <button id="revoke-use-me" style="flex:1;min-width:0;width:auto;padding:7px 6px;border-radius:8px;border:1px solid #475569;background:transparent;color:#94a3b8;font-size:11px;font-weight:bold;cursor:pointer;">👤 Ví của tôi</button>
                <button id="revoke-find-btn" style="flex:1;min-width:0;width:auto;padding:7px 6px;border-radius:8px;border:1px solid #ef4444;background:rgba(239,68,68,0.12);color:#fca5a5;font-size:11px;font-weight:bold;cursor:pointer;">🔍 Tìm bằng</button>
            </div>
            <div id="revoke-find-status" style="font-size:10px;color:#64748b;min-height:14px;margin-bottom:6px;"></div>
        </div>

        <label style="display:block;font-size:12px;color:#ef4444;margin-bottom:6px;font-weight:bold;">③ Chọn tấm bằng cần thu hồi</label>
        <div id="revoke-list" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(130px, 1fr));gap:8px;margin-bottom:10px;">
            <div style="text-align:center;grid-column:1/-1;color:#64748b;font-size:11px;padding:14px;">Dán 2 địa chỉ ở trên để xem học sinh này đang giữ bằng nào...</div>
        </div>

        <div id="revoke-amount-group" style="display:none;margin-bottom:10px;">
            <label style="display:block;font-size:12px;color:#ef4444;margin-bottom:6px;font-weight:bold;">Số lượng thu hồi</label>
            <input type="number" id="revoke-amount" value="1" min="1" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;">
        </div>

        <div id="revoke-selected" style="display:none;background:#2d1215;border:1px solid #ef4444;border-radius:8px;padding:8px 10px;margin-bottom:10px;font-size:11px;color:#fca5a5;text-align:center;line-height:1.5;"></div>

        <button id="revoke-btn" disabled style="background:#475569;width:100%;padding:14px;border-radius:10px;border:none;color:#94a3b8;font-weight:bold;font-size:14px;cursor:not-allowed;">Chọn một tấm bằng ở trên</button>

        <div id="revoke-status" style="margin-top:10px;font-size:12px;text-align:center;color:#94a3b8;min-height:20px;"></div>
    </div>`,
    engineCode: (pfx) => `
        var RV_I721  = "0x80ac58cd";
        var RV_I1155 = "0xd9b67a26";

        var RV_COMMON_ABI = [
            "function supportsInterface(bytes4 interfaceId) view returns (bool)",
            "function owner() view returns (address)",
            "function name() view returns (string)",
            "function isSoulbound() view returns (bool)"
        ];
        // Tách ABI theo chuẩn vì balanceOf bị nạp chồng giữa 721 và 1155
        var RV_ABI721 = [
            "function balanceOf(address owner) view returns (uint256)",
            "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
            "function ownerOf(uint256 tokenId) view returns (address)",
            "function tokenURI(uint256 tokenId) view returns (string)",
            "function revokeCertificate(uint256 tokenId)"
        ];
        var RV_ABI1155 = [
            "function balanceOf(address account, uint256 id) view returns (uint256)",
            "function uri(uint256 id) view returns (string)",
            "function revokeBadge(address from, uint256 id, uint256 amount)"
        ];
        var RV_GATEWAYS = ['https://gateway.pinata.cloud/ipfs/', 'https://ipfs.io/ipfs/', 'https://cloudflare-ipfs.com/ipfs/'];

        var _rvMetaCache = {};
        var _rvStd       = null;     // 'erc721' | 'erc1155'
        var _rvSoulbound = false;
        var _rvIsOwner   = false;
        var _rvName      = '';
        var _rvAddr      = '';
        var _rvCerts     = [];       // { id, name, image, bal }
        var _rvSelected  = null;
        var _rvTimer     = null;
        var _rvFindTimer = null;

        var _rvColInput  = document.getElementById('revoke-collection-addr');
        var _rvDetect    = document.getElementById('revoke-detect');
        var _rvStudInput = document.getElementById('revoke-student-addr');
        var _rvUseMe     = document.getElementById('revoke-use-me');
        var _rvFindBtn   = document.getElementById('revoke-find-btn');
        var _rvFindSt    = document.getElementById('revoke-find-status');
        var _rvList      = document.getElementById('revoke-list');
        var _rvAmtGroup  = document.getElementById('revoke-amount-group');
        var _rvAmtInput  = document.getElementById('revoke-amount');
        var _rvSelBox    = document.getElementById('revoke-selected');
        var _rvBtn       = document.getElementById('revoke-btn');
        var _rvStatus    = document.getElementById('revoke-status');

        function _rvEsc(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
        function _rvSetStatus(msg, color){ _rvStatus.innerHTML = msg ? '<span style="color:' + (color||'#94a3b8') + '">' + msg + '</span>' : ''; }
        function _rvSetFind(msg, color){ _rvFindSt.innerHTML = msg ? '<span style="color:' + (color||'#64748b') + '">' + msg + '</span>' : ''; }
        function _rvProvider(){
            if (provider) return provider;
            if (window.ethereum) return new ethers.providers.Web3Provider(window.ethereum);
            return null;
        }

        async function _rvMeta(uri, id) {
            if (!uri) return { name: null, image: '' };
            var key = uri + '|' + id;
            if (_rvMetaCache[key]) return _rvMetaCache[key];
            var cid = uri.replace('ipfs://', '').replace('{id}', id);
            var out = { name: null, image: '' };
            for (var g = 0; g < RV_GATEWAYS.length; g++) {
                try {
                    var r = await fetch(RV_GATEWAYS[g] + cid, { signal: AbortSignal.timeout(5000) });
                    if (!r.ok) continue;
                    var j = await r.json();
                    out.name = j.name || null;
                    out.image = j.image ? j.image.replace('ipfs://', RV_GATEWAYS[0]) : '';
                    break;
                } catch(e) {}
            }
            _rvMetaCache[key] = out;
            return out;
        }

        function _rvClearSelection() {
            _rvSelected = null;
            _rvSelBox.style.display = 'none';
            _rvBtn.disabled = true;
            _rvBtn.style.background = '#475569';
            _rvBtn.style.color = '#94a3b8';
            _rvBtn.style.cursor = 'not-allowed';
            _rvBtn.innerText = 'Chọn một tấm bằng ở trên';
        }

        function _rvClearList(msg) {
            _rvCerts = [];
            _rvClearSelection();
            _rvList.innerHTML = '<div style="text-align:center;grid-column:1/-1;color:#64748b;font-size:11px;padding:14px;">'
                + (msg || 'Dán 2 địa chỉ ở trên để xem học sinh này đang giữ bằng nào...') + '</div>';
        }

        // ---- Hỏi contract xem nó là chuẩn gì ----
        async function _rvDetectStandard() {
            var addr = _rvColInput.value.trim();
            if (!addr || addr.length !== 42) {
                _rvStd = null; _rvAddr = ''; _rvDetect.style.display = 'none';
                _rvAmtGroup.style.display = 'none'; _rvClearList(); return;
            }
            var prov = _rvProvider();
            if (!prov) { toast('error', 'Cần cài MetaMask!'); return; }

            _rvAddr = addr;
            _rvDetect.style.display = 'block';
            _rvDetect.style.background = '#1e293b';
            _rvDetect.style.border = '1px solid #334155';
            _rvDetect.innerHTML = '<span style="color:#94a3b8;">⏳ Đang nhận diện Bộ Sưu Tập...</span>';

            try {
                var c = new ethers.Contract(addr, RV_COMMON_ABI, prov);
                var is721 = false, is1155 = false;
                try { is721  = await c.supportsInterface(RV_I721);  } catch(e) {}
                try { is1155 = await c.supportsInterface(RV_I1155); } catch(e) {}

                if (!is721 && !is1155) {
                    _rvStd = null;
                    _rvDetect.style.background = '#2d1215';
                    _rvDetect.style.border = '1px solid #ef4444';
                    _rvDetect.innerHTML = '<span style="color:#fca5a5;">❌ Không phải Bộ Sưu Tập NFT hợp lệ (hoặc sai mạng).</span>';
                    _rvAmtGroup.style.display = 'none'; _rvClearList(); return;
                }

                _rvStd = is721 ? 'erc721' : 'erc1155';
                try { _rvName = await c.name(); } catch(e) { _rvName = 'Bộ sưu tập'; }
                try { _rvSoulbound = await c.isSoulbound(); } catch(e) { _rvSoulbound = false; }

                _rvIsOwner = false; var ownerAddr = '';
                try {
                    ownerAddr = await c.owner();
                    if (userAddr && ownerAddr.toLowerCase() === userAddr.toLowerCase()) _rvIsOwner = true;
                } catch(e) {}

                _rvAmtGroup.style.display = (_rvStd === 'erc1155') ? 'block' : 'none';

                var lines = '<b style="color:#e2e8f0;">' + _rvEsc(_rvName) + '</b><br>';
                lines += _rvStd === 'erc721'
                    ? '🎓 Chuẩn <b>ERC-721</b> — mỗi tấm bằng là một Token riêng của một học sinh<br>'
                    : '🎖️ Chuẩn <b>ERC-1155</b> — huy hiệu có số lượng<br>';
                if (_rvStd === 'erc721') {
                    lines += _rvSoulbound
                        ? '<span style="color:#10b981;">🔒 Soulbound — thu hồi được ✅</span><br>'
                        : '<span style="color:#f59e0b;">⚠️ KHÔNG phải Soulbound — contract sẽ CHẶN thu hồi</span><br>';
                }
                lines += _rvIsOwner
                    ? '<span style="color:#10b981;">👑 Bạn là Owner ✅</span>'
                    : '<span style="color:#ef4444;">🚫 Bạn KHÔNG phải Owner (chủ: ' + (ownerAddr ? ownerAddr.substring(0,6) + '...' + ownerAddr.slice(-4) : '?') + ')</span>';

                var ok = _rvIsOwner && (_rvStd === 'erc1155' || _rvSoulbound);
                _rvDetect.style.background = ok ? '#0a1f15' : '#2d1f00';
                _rvDetect.style.border = '1px solid ' + (ok ? '#10b981' : '#f59e0b');
                _rvDetect.innerHTML = lines;

                if (_rvStudInput.value.trim().length === 42) _rvFindCerts();

            } catch(e) {
                _rvStd = null;
                _rvDetect.style.background = '#2d1215';
                _rvDetect.style.border = '1px solid #ef4444';
                _rvDetect.innerHTML = '<span style="color:#fca5a5;">❌ Không đọc được contract: ' + _rvEsc((e.reason||e.message||'').substring(0,60)) + '</span>';
            }
        }

        // ---- Liệt kê những tấm bằng mà RIÊNG ví này đang giữ ----
        async function _rvFindCerts() {
            var stud = _rvStudInput.value.trim();
            if (!_rvStd)                       { _rvSetFind('Hãy dán địa chỉ Bộ Sưu Tập trước.', '#f59e0b'); return; }
            if (!stud || stud.length !== 42)   { _rvSetFind('Địa chỉ ví học sinh chưa hợp lệ.', '#f59e0b'); _rvClearList(); return; }

            var prov = _rvProvider();
            if (!prov) { toast('error', 'Cần cài MetaMask!'); return; }

            _rvCerts = []; _rvClearSelection();
            _rvSetFind('⏳ Đang tìm bằng của ví này...', '#fbbf24');
            _rvList.innerHTML = '<div style="text-align:center;grid-column:1/-1;color:#fbbf24;font-size:11px;padding:14px;">Đang quét Blockchain...</div>';

            try {
                if (_rvStd === 'erc721') {
                    var c = new ethers.Contract(_rvAddr, RV_ABI721, prov);
                    var n = (await c.balanceOf(stud)).toNumber();

                    if (n === 0) {
                        _rvSetFind('Ví này không giữ tấm bằng nào của bộ sưu tập.', '#94a3b8');
                        _rvClearList('Học sinh này chưa có bằng nào trong bộ sưu tập.');
                        return;
                    }
                    if (n > 60) n = 60;

                    var ids = [];
                    for (var i = 0; i < n; i += 10) {
                        var chunk = [];
                        for (var j = 0; j < 10 && (i + j) < n; j++) {
                            chunk.push(c.tokenOfOwnerByIndex(stud, i + j).then(function(id){ ids.push(id.toString()); }).catch(function(){}));
                        }
                        await Promise.all(chunk);
                    }
                    ids.sort(function(a,b){ return parseInt(a) - parseInt(b); });

                    for (var k = 0; k < ids.length; k++) {
                        var uri = '';
                        try { uri = await c.tokenURI(ids[k]); } catch(e) {}
                        var meta = await _rvMeta(uri, ids[k]);
                        _rvCerts.push({ id: ids[k], name: meta.name || ('Chứng chỉ #' + ids[k]), image: meta.image, bal: 1 });
                    }

                } else {
                    // ERC-1155 không liệt kê được on-chain -> quét ID 0..40
                    var c2 = new ethers.Contract(_rvAddr, RV_ABI1155, prov);
                    for (var a = 0; a <= 40; a += 10) {
                        var batch = [];
                        for (var b = 0; b < 10 && (a + b) <= 40; b++) {
                            (function(id) {
                                batch.push(c2.balanceOf(stud, id).then(function(bal){
                                    if (bal.gt(0)) _rvCerts.push({ id: String(id), name: 'Huy hiệu #' + id, image: '', bal: bal.toString() });
                                }).catch(function(){}));
                            })(a + b);
                        }
                        await Promise.all(batch);
                    }
                    _rvCerts.sort(function(x,y){ return parseInt(x.id) - parseInt(y.id); });

                    for (var m = 0; m < _rvCerts.length; m++) {
                        var u = '';
                        try { u = await c2.uri(_rvCerts[m].id); } catch(e) {}
                        var mt = await _rvMeta(u, _rvCerts[m].id);
                        if (mt.name)  _rvCerts[m].name  = mt.name;
                        if (mt.image) _rvCerts[m].image = mt.image;
                    }

                    if (_rvCerts.length === 0) {
                        _rvSetFind('Ví này không giữ huy hiệu nào (đã quét ID 0-40).', '#94a3b8');
                        _rvClearList('Học sinh này chưa có huy hiệu nào.');
                        return;
                    }
                }

                _rvRenderList(stud);
                _rvSetFind('✅ Tìm thấy ' + _rvCerts.length + ' tấm — bấm vào tấm cần thu hồi.', '#10b981');

            } catch(e) {
                _rvSetFind('❌ ' + _rvEsc((e.reason || e.message || 'Lỗi').substring(0, 70)), '#ef4444');
                _rvClearList('Không đọc được dữ liệu.');
            }
        }

        function _rvRenderList(stud) {
            _rvList.innerHTML = '';
            _rvCerts.forEach(function(cert) {
                var card = document.createElement('div');
                card.style.cssText = 'background:#1e293b;border:2px solid #334155;border-radius:10px;padding:8px;text-align:center;cursor:pointer;transition:0.2s;';
                var inner = cert.image
                    ? '<img src="' + cert.image + '" style="width:100%;height:70px;object-fit:cover;border-radius:6px;margin-bottom:6px;">'
                    : '<div style="font-size:26px;margin-bottom:4px;">🎓</div>';
                inner += '<div style="font-size:10px;font-weight:bold;color:#e2e8f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + _rvEsc(cert.name) + '</div>';
                inner += '<div style="font-size:9px;color:#94a3b8;margin-top:2px;">Token #' + cert.id + (cert.bal > 1 ? ' · SL ' + cert.bal : '') + '</div>';
                card.innerHTML = inner;

                card.addEventListener('mouseover', function(){ if (!_rvSelected || _rvSelected.id !== cert.id) this.style.borderColor = '#f87171'; });
                card.addEventListener('mouseout',  function(){ if (!_rvSelected || _rvSelected.id !== cert.id) this.style.borderColor = '#334155'; });
                card.addEventListener('click', function() {
                    _rvSelected = cert;
                    Array.prototype.forEach.call(_rvList.children, function(el){ el.style.borderColor = '#334155'; el.style.background = '#1e293b'; });
                    this.style.borderColor = '#ef4444';
                    this.style.background = '#2d1215';

                    _rvSelBox.style.display = 'block';
                    _rvSelBox.innerHTML = '🎯 Sắp thu hồi: <b style="color:#fff;">' + _rvEsc(cert.name) + '</b> (Token #' + cert.id + ')<br>'
                        + '<span style="font-size:10px;color:#94a3b8;">của ví ' + stud.substring(0,6) + '...' + stud.slice(-4)
                        + ' — chỉ riêng học sinh này bị ảnh hưởng</span>';

                    _rvBtn.disabled = false;
                    _rvBtn.style.background = 'linear-gradient(135deg,#ef4444,#dc2626)';
                    _rvBtn.style.color = '#fff';
                    _rvBtn.style.cursor = 'pointer';
                    _rvBtn.style.boxShadow = '0 4px 15px rgba(239,68,68,0.4)';
                    _rvBtn.innerText = '🔥 THU HỒI TOKEN #' + cert.id;
                });

                _rvList.appendChild(card);
            });
        }

        if (_rvColInput) {
            _rvColInput.addEventListener('input', function() {
                clearTimeout(_rvTimer);
                var v = this.value.trim();
                if (v.length !== 42) { _rvStd = null; _rvAddr = ''; _rvDetect.style.display = 'none'; _rvClearList(); return; }
                if (v.toLowerCase() === _rvAddr.toLowerCase()) return;
                _rvTimer = setTimeout(_rvDetectStandard, 500);
            });
        }
        if (_rvStudInput) {
            _rvStudInput.addEventListener('input', function() {
                clearTimeout(_rvFindTimer);
                _rvClearSelection();
                if (this.value.trim().length !== 42) { _rvClearList(); _rvSetFind(''); return; }
                _rvFindTimer = setTimeout(_rvFindCerts, 500);
            });
        }
        if (_rvUseMe) {
            _rvUseMe.addEventListener('click', function() {
                if (!userAddr) { toast('error', 'Hãy kết nối ví trước!'); return; }
                _rvStudInput.value = userAddr;
                _rvFindCerts();
            });
        }
        if (_rvFindBtn) _rvFindBtn.addEventListener('click', _rvFindCerts);

        async function executeRevoke() {
            if (!signer) { toast('error', 'Cần kết nối ví (🦊) trước!'); return; }
            if (!_rvStd) { toast('error', 'Chưa nhận diện được Bộ Sưu Tập!'); return; }
            if (!_rvSelected) { toast('error', 'Hãy bấm chọn tấm bằng cần thu hồi!'); return; }

            var stud = _rvStudInput.value.trim();

            if (!_rvIsOwner) {
                _rvSetStatus('❌ Bạn không phải Owner của Bộ Sưu Tập này.', '#ef4444');
                toast('error', 'Chỉ Owner mới thu hồi được!'); return;
            }
            if (_rvStd === 'erc721' && !_rvSoulbound) {
                _rvSetStatus('❌ Bộ Sưu Tập này không phải loại Chứng Chỉ (Soulbound) nên contract chặn thu hồi.', '#ef4444');
                toast('error', 'Chỉ thu hồi được NFT loại Chứng Chỉ!'); return;
            }

            var amount = 1;
            if (_rvStd === 'erc1155') {
                amount = parseInt(_rvAmtInput.value) || 1;
                if (amount < 1) { toast('error', 'Số lượng phải >= 1!'); return; }
                if (amount > parseInt(_rvSelected.bal)) { toast('error', 'Ví này chỉ có ' + _rvSelected.bal + ' cái!'); return; }
            }

            if (!confirm('Đốt vĩnh viễn "' + _rvSelected.name + '" (Token #' + _rvSelected.id + ')\\n'
                + 'của ví ' + stud.substring(0,10) + '...' + stud.slice(-6) + '?\\n\\n'
                + 'Chỉ học sinh này bị thu hồi. KHÔNG hoàn tác được.')) return;

            try {
                _rvBtn.disabled = true; _rvBtn.style.opacity = '0.5';
                _rvSetStatus('🔥 Đang gửi lệnh thu hồi... (Xác nhận trên MetaMask)', '#ef4444');

                var tx;
                if (_rvStd === 'erc721') {
                    var c = new ethers.Contract(_rvAddr, RV_ABI721, signer);
                    tx = await c.revokeCertificate(_rvSelected.id);
                } else {
                    var c2 = new ethers.Contract(_rvAddr, RV_ABI1155, signer);
                    tx = await c2.revokeBadge(stud, _rvSelected.id, amount);
                }

                _rvSetStatus('⛏️ Đang đợi Blockchain xác nhận...', '#ef4444');
                await tx.wait();

                _rvSetStatus('✅ Đã thu hồi "' + _rvSelected.name + '" (Token #' + _rvSelected.id + ') của học sinh này!', '#10b981');
                toast('success', '🔥 Thu hồi thành công Token #' + _rvSelected.id);

                _rvClearSelection();
                await _rvFindCerts();   // tải lại danh sách, tấm vừa đốt sẽ biến mất

            } catch (e) {
                var msg = e.reason || e.message || 'Lỗi không xác định';
                if (msg.indexOf('user rejected') !== -1)           msg = 'Bạn đã từ chối giao dịch!';
                else if (msg.indexOf('nonexistent') !== -1)        msg = 'Token này không tồn tại hoặc đã bị đốt!';
                else if (msg.indexOf('Soulbound') !== -1)          msg = 'Chỉ thu hồi được NFT loại Chứng Chỉ (Soulbound)!';
                else if (msg.indexOf('Unauthorized') !== -1)       msg = 'Bạn không phải Owner của Bộ Sưu Tập này!';
                else if (msg.indexOf('execution reverted') !== -1) msg = 'Giao dịch bị chặn — kiểm tra lại quyền Owner.';
                _rvSetStatus('❌ ' + msg.substring(0, 90), '#ef4444');
                toast('error', 'Thu hồi thất bại: ' + msg.substring(0, 60));
            } finally {
                _rvBtn.style.opacity = '1';
                if (_rvSelected) _rvBtn.disabled = false;
            }
        }
    `,
    bindings: [
        { btn: "revoke-btn", fn: "executeRevoke" }
    ]
}
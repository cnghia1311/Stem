import { FACTORY_ADDRESSES } from '../contracts/contractFactorys.js';

// ==================== KHỐI: MỞ RƯƠNG NFT RANDOM (GACHA) ====================
export default {
    id: "mint-erc721-random",
    name: "🎰 Mở Rương NFT",
    desc: "Học sinh mở rương nhận NFT random theo tỉ lệ (weight) từ mẫu giáo viên đã cài. Dùng chung StemFreeMint721.",
    color: "#f59e0b",
    label: "Mở Rương NFT Random",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#f59e0b;">
        <div class="khoi-title" style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:24px;">🎰</span>
            <span style="background:linear-gradient(135deg,#f59e0b,#fbbf24);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:16px;letter-spacing:1px;">MỞ RƯƠNG NFT</span>
        </div>

        <!-- Địa chỉ collection -->
        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:15px;margin-bottom:12px;">
            <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:6px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">Địa chỉ Bộ Sưu Tập NFT (Giáo viên cấp)</label>
            <div style="display:flex;gap:8px;margin-bottom:8px;">
                <input type="text" id="gc-collection" placeholder="0x... (ERC-721)" style="flex:1;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;">
                <button id="gc-load-btn" style="padding:10px 14px;border-radius:8px;border:1px solid #f59e0b44;background:#1e293b;color:#f59e0b;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;">🔄 Tải</button>
            </div>
            <div id="gc-load-status" style="font-size:11px;color:#64748b;">💡 Nhập địa chỉ rồi bấm 🔄 Tải để xem danh sách vật phẩm.</div>
        </div>

        <!-- Danh sách mẫu từ contract (readonly) -->
        <div id="gc-templates-box" style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:15px;margin-bottom:12px;display:none;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <label style="font-size:11px;color:#94a3b8;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;margin:0;">Vật Phẩm trong Rương</label>
                <span id="gc-total-weight" style="font-size:10px;color:#64748b;"></span>
            </div>
            <div id="gc-template-list" style="display:flex;flex-direction:column;gap:6px;"></div>
        </div>

        <!-- Gacha animation window -->
        <div id="gc-window" style="background:#07111f;border:1px solid #334155;border-radius:12px;height:110px;overflow:hidden;position:relative;margin-bottom:12px;display:none;">
            <div style="overflow:hidden;position:absolute;top:0;left:0;right:0;bottom:0;">
                <div id="gc-track" style="display:flex;align-items:center;height:110px;will-change:transform;white-space:nowrap;"></div>
            </div>
            <div style="position:absolute;top:50%;left:0;right:0;height:2px;background:#f59e0b;transform:translateY(-50%);z-index:10;box-shadow:0 0 8px #f59e0b;"></div>
        </div>

        <!-- Kết quả -->
        <div id="gc-result" style="background:#07111f;border:1px solid #334155;border-radius:12px;padding:14px;text-align:center;display:none;margin-bottom:12px;">
            <div id="gc-res-name" style="font-size:16px;font-weight:800;color:#f59e0b;margin-bottom:4px;">-</div>
            <div id="gc-res-id" style="font-size:11px;color:#64748b;margin-bottom:6px;font-family:monospace;">Template ID: -</div>
            <span id="gc-res-badge" style="display:inline-block;padding:2px 10px;border-radius:20px;font-size:10px;font-weight:700;">-</span>
            <div id="gc-res-token" style="font-size:11px;color:#10b981;margin-top:8px;display:none;">🎁 Token ID nhận được: <strong id="gc-res-token-id">-</strong></div>
        </div>

        <!-- Nút xem thử và mở thật -->
        <button id="gc-spin-btn" style="width:100%;padding:14px;border-radius:12px;border:none;background:linear-gradient(135deg,#475569,#334155);color:#e2e8f0;font-size:14px;font-weight:700;cursor:pointer;letter-spacing:1px;margin-bottom:10px;">🎲 Xem Thử (Demo — Không Tốn Gas)</button>
        <button id="gc-open-btn" style="width:100%;padding:16px;border-radius:12px;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:#0a0f1a;font-size:15px;font-weight:900;cursor:pointer;letter-spacing:1px;text-transform:uppercase;box-shadow:0 4px 20px rgba(245,158,11,0.4);">🎰 MỞ RƯƠNG NGAY (Nhận NFT Thật)</button>

        <div id="gc-status" style="margin-top:12px;font-size:12px;text-align:center;color:#94a3b8;min-height:20px;"></div>

        <div id="gc-success-box" style="display:none;margin-top:12px;background:#0a1f15;border:1px solid #10b981;border-radius:12px;padding:15px;">
            <div style="font-size:14px;font-weight:bold;color:#10b981;margin-bottom:8px;">🎉 Chúc mừng! Bạn đã nhận được NFT!</div>
            <div style="font-size:11px;color:#94a3b8;margin-bottom:4px;">Địa chỉ Bộ Sưu Tập:</div>
            <div id="gc-success-addr" style="font-family:monospace;background:#0f172a;padding:6px 10px;border-radius:6px;font-size:11px;color:#38bdf8;word-break:break-all;margin-bottom:8px;"></div>
            <div style="font-size:11px;color:#94a3b8;margin-bottom:4px;">Token ID của bạn:</div>
            <div id="gc-success-token" style="font-size:28px;font-weight:900;color:#f59e0b;text-align:center;margin-bottom:8px;"></div>
            <div style="font-size:10px;color:#64748b;background:#1e293b;padding:8px;border-radius:6px;">💡 Mở MetaMask → tab NFTs → Import NFT → nhập địa chỉ và Token ID ở trên để xem NFT trong ví!</div>
        </div>
    </div>`,

    engineCode: () => `
        // ==================== GACHA BLOCK ENGINE ====================
        var _GC_FREE_MINT_ADDR = '${FACTORY_ADDRESSES.FREE_MINT_721}';
        var _GC_FREE_MINT_ABI  = [
            "function claimNFT(address collection, uint256 templateId) public returns (uint256)"
        ];
        var _GC_COLL_ABI = [
            "function getAllTemplates() view returns (uint256[] memory ids, string[] memory uris, uint256[] memory weights)",
            "function totalSupply() view returns (uint256)"
        ];

        var _gcTemplates = [];
        var _gcSpinning  = false;

        var _gcList         = document.getElementById('gc-template-list');
        var _gcTemplatesBox = document.getElementById('gc-templates-box');
        var _gcTotalWeight  = document.getElementById('gc-total-weight');
        var _gcLoadBtn      = document.getElementById('gc-load-btn');
        var _gcLoadStatus   = document.getElementById('gc-load-status');
        var _gcSpinBtn      = document.getElementById('gc-spin-btn');
        var _gcOpenBtn      = document.getElementById('gc-open-btn');
        var _gcStatus       = document.getElementById('gc-status');
        var _gcWindow       = document.getElementById('gc-window');
        var _gcTrack        = document.getElementById('gc-track');
        var _gcResult       = document.getElementById('gc-result');
        var _gcSuccessBox   = document.getElementById('gc-success-box');

        // ---- Rarity helpers ----
        var _CARD_ICONS = ['🥉','🥈','🥇','💎','⭐','🔥','🌟','🏆','💡','🎁'];
        var _RARITY_STYLES = {
            common:    'background:#151e2e;border:2px solid #334155;color:#94a3b8;',
            rare:      'background:#0d1e36;border:2px solid #2563eb;color:#93c5fd;',
            epic:      'background:#1a0d35;border:2px solid #7c3aed;color:#c4b5fd;',
            legendary: 'background:#251300;border:2px solid #f59e0b;color:#fcd34d;box-shadow:0 0 12px rgba(245,158,11,0.3);'
        };
        var _RARITY_RESULT = {
            common:    { bg:'#1e293b', color:'#94a3b8', label:'⚪ Common' },
            rare:      { bg:'#1e3a5f', color:'#60a5fa', label:'🔵 Rare' },
            epic:      { bg:'#2d1b4e', color:'#a78bfa', label:'🟣 Epic' },
            legendary: { bg:'#2d1f00', color:'#fbbf24', label:'🟡 Legendary' }
        };

        function _gcGetRarity(t) {
            var total = _gcTemplates.reduce(function(s,x){ return s + (x.weight||1); }, 0);
            var pct   = total > 0 ? (t.weight||1) / total * 100 : 0;
            if (pct >= 30) return 'common';
            if (pct >= 15) return 'rare';
            if (pct >= 6)  return 'epic';
            return 'legendary';
        }

        function _gcWeightedRandom(items) {
            var total = items.reduce(function(s, t){ return s + (t.weight || 1); }, 0);
            var r = Math.random() * total;
            for (var i = 0; i < items.length; i++) {
                r -= (items[i].weight || 1);
                if (r <= 0) return items[i];
            }
            return items[items.length - 1];
        }

        function _gcSetStatus(msg, color) {
            _gcStatus.innerHTML = '<span style="color:' + color + '">' + msg + '</span>';
        }

        // ---- Build & run animation ----
        function _gcBuildTrack(winnerIdx, count) {
            count = count || 40;
            _gcTrack.innerHTML = '';
            var pool = [];
            for (var i = 0; i < count - 1; i++) pool.push(_gcWeightedRandom(_gcTemplates));
            var insertAt = Math.floor(count * 0.7);
            pool.splice(insertAt, 0, _gcTemplates[winnerIdx]);

            pool.forEach(function(t) {
                var rarity  = _gcGetRarity(t);
                var icon    = t.icon || _CARD_ICONS[t.templateId % _CARD_ICONS.length];
                var card    = document.createElement('div');
                card.style.cssText = 'flex-shrink:0;width:90px;height:90px;margin:0 5px;border-radius:10px;' +
                    'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;text-align:center;' +
                    (_RARITY_STYLES[rarity] || _RARITY_STYLES.common);
                card.innerHTML = '<span style="font-size:28px;">' + icon + '</span>' +
                    '<span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:0 4px;line-height:1.2;color:inherit;">' +
                    (t.name||'NFT').substring(0,14) + '</span>';
                _gcTrack.appendChild(card);
            });
            return insertAt;
        }

        function _gcRunAnimation(winnerIdx, onDone) {
            _gcWindow.style.display = 'block';
            _gcResult.style.display = 'none';
            var winnerSlot = _gcBuildTrack(winnerIdx);
            var cardW   = 100;
            var windowW = _gcWindow.offsetWidth || 500;
            var target  = winnerSlot * cardW - (windowW / 2 - cardW / 2);

            _gcTrack.style.transition = 'none';
            _gcTrack.style.transform  = 'translateX(0)';

            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    _gcTrack.style.transition = 'transform 4.2s cubic-bezier(0.05,0.9,0.4,1)';
                    _gcTrack.style.transform  = 'translateX(-' + target + 'px)';
                });
            });

            setTimeout(function() {
                var winner = _gcTemplates[winnerIdx];
                var rarity = _gcGetRarity(winner);
                var rc     = _RARITY_RESULT[rarity] || _RARITY_RESULT.common;
                document.getElementById('gc-res-name').textContent = winner.name || 'NFT';
                document.getElementById('gc-res-id').textContent = 'Template ID: ' + winner.templateId + '  |  Weight: ' + winner.weight;
                var badge = document.getElementById('gc-res-badge');
                badge.textContent = rc.label;
                badge.style.cssText = 'display:inline-block;padding:2px 10px;border-radius:20px;font-size:10px;font-weight:700;background:' + rc.bg + ';color:' + rc.color + ';border:1px solid ' + rc.color + '44;';
                document.getElementById('gc-res-token').style.display = 'none';
                _gcResult.style.display = 'block';
                if (onDone) onDone(winner);
            }, 4400);
        }

        // ---- Render template list (readonly) ----
        function _gcRenderTemplates() {
            _gcList.innerHTML = '';
            var totalW = _gcTemplates.reduce(function(s,t){ return s + (t.weight||1); }, 0);
            _gcTemplates.forEach(function(t) {
                var pct    = totalW > 0 ? ((t.weight||1) / totalW * 100).toFixed(1) : 0;
                var rarity = _gcGetRarity(t);
                var colors = { common:'#94a3b8', rare:'#60a5fa', epic:'#a78bfa', legendary:'#fbbf24' };
                var row    = document.createElement('div');
                row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;background:#1e293b;border:1px solid #334155;';
                row.innerHTML =
                    '<span style="font-size:18px;">' + (t.icon||'🎴') + '</span>' +
                    '<span style="flex:1;font-size:12px;font-weight:700;color:#e2e8f0;">' + (t.name||'NFT') + '</span>' +
                    '<span style="font-size:10px;color:#64748b;font-family:monospace;">ID #' + t.templateId + '</span>' +
                    '<span style="font-size:11px;font-weight:700;color:' + (colors[rarity]||'#94a3b8') + ';background:#0f172a;padding:2px 8px;border-radius:20px;">' + pct + '%</span>';
                _gcList.appendChild(row);
            });
        }

        // ---- Load templates from contract ----
        async function _gcLoadFromContract() {
            var collAddr = document.getElementById('gc-collection').value.trim();
            if (!collAddr || collAddr.length !== 42) {
                _gcLoadStatus.innerHTML = '<span style="color:#ef4444">❌ Địa chỉ không hợp lệ!</span>';
                return;
            }
            _gcLoadBtn.disabled = true;
            _gcLoadBtn.textContent = '⏳...';
            _gcLoadStatus.innerHTML = '<span style="color:#f59e0b">⏳ Đang đọc từ blockchain...</span>';

            try {
                var _prov = provider ? provider : new ethers.providers.Web3Provider(window.ethereum);
                var coll  = new ethers.Contract(collAddr, _GC_COLL_ABI, _prov);
                var res   = await coll.getAllTemplates();
                var ids = res[0], uris = res[1], weights = res[2];

                if (!ids || ids.length === 0) {
                    _gcLoadStatus.innerHTML = '<span style="color:#f59e0b">⚠️ Chưa có mẫu nào. Giáo viên cần dùng khối 🎨 Tạo Mẫu NFT trước.</span>';
                    _gcLoadBtn.disabled = false; _gcLoadBtn.textContent = '🔄 Tải';
                    return;
                }

                _gcLoadStatus.innerHTML = '<span style="color:#f59e0b">🔄 Đang lấy tên mẫu từ IPFS...</span>';

                var GATEWAYS = ['https://gateway.pinata.cloud/ipfs/', 'https://ipfs.io/ipfs/', 'https://cloudflare-ipfs.com/ipfs/'];
                async function _fetchName(uri) {
                    if (!uri) return null;
                    var cid = uri.replace('ipfs://', '');
                    for (var g = 0; g < GATEWAYS.length; g++) {
                        try {
                            var r = await fetch(GATEWAYS[g] + cid, { signal: AbortSignal.timeout(5000) });
                            if (!r.ok) continue;
                            var j = await r.json();
                            return j.name || null;
                        } catch(e) {}
                    }
                    return null;
                }

                _gcTemplates = [];
                var ICONS = ['🥉','🥈','🥇','💎','⭐','🔥','🌟','🏆','💡','🎁'];
                var ps = Array.from(ids).map(function(id, i) {
                    return _fetchName(uris[i]).then(function(name) {
                        var w = weights[i] ? weights[i].toNumber() : 1;
                        _gcTemplates.push({ templateId: id.toNumber(), name: name || ('Mẫu #' + id.toNumber()), weight: w, icon: ICONS[i % ICONS.length] });
                    });
                });
                await Promise.allSettled(ps);
                _gcTemplates.sort(function(a,b){ return a.templateId - b.templateId; });

                _gcRenderTemplates();
                _gcTemplatesBox.style.display = 'block';
                var tw = _gcTemplates.reduce(function(s,t){ return s + t.weight; }, 0);
                _gcTotalWeight.textContent = ids.length + ' vật phẩm | Tổng weight: ' + tw;
                _gcLoadStatus.innerHTML = '<span style="color:#10b981">✅ Đã tải ' + ids.length + ' vật phẩm!</span>';

            } catch(e) {
                _gcLoadStatus.innerHTML = '<span style="color:#ef4444">❌ ' + (e.reason||e.message||'Lỗi').substring(0,80) + '</span>';
            } finally {
                _gcLoadBtn.disabled = false;
                _gcLoadBtn.textContent = '🔄 Tải';
            }
        }

        if (_gcLoadBtn) _gcLoadBtn.addEventListener('click', _gcLoadFromContract);
        var _gcCollInput = document.getElementById('gc-collection');
        if (_gcCollInput) {
            _gcCollInput.addEventListener('input', function() {
                if (this.value.trim().length === 42) _gcLoadFromContract();
            });
        }

        // ---- Demo spin (không mint) ----
        if (_gcSpinBtn) {
            _gcSpinBtn.addEventListener('click', function() {
                if (_gcSpinning) return;
                if (_gcTemplates.length === 0) { _gcSetStatus('❌ Chưa tải vật phẩm! Bấm 🔄 Tải trước.', '#ef4444'); return; }
                _gcSpinning = true;
                _gcSpinBtn.disabled = true;
                _gcSuccessBox.style.display = 'none';
                var winner    = _gcWeightedRandom(_gcTemplates);
                var winnerIdx = _gcTemplates.indexOf(winner);
                _gcRunAnimation(winnerIdx, function() {
                    _gcSpinning = false;
                    _gcSpinBtn.disabled = false;
                    _gcSetStatus('🎲 Demo — không tốn gas. Bấm MỞ RƯƠNG để nhận thật.', '#64748b');
                });
            });
        }

        // ---- Mở rương thật → FreeMintMachine.claimNFT ----
        if (_gcOpenBtn) {
            _gcOpenBtn.addEventListener('click', async function() {
                if (_gcSpinning) return;
                if (_gcTemplates.length === 0) { _gcSetStatus('❌ Chưa tải vật phẩm! Bấm 🔄 Tải trước.', '#ef4444'); return; }
                if (!signer) { toast('error', 'Cần kết nối ví (🦊) trước!'); return; }
                if (!_GC_FREE_MINT_ADDR || _GC_FREE_MINT_ADDR.length !== 42) {
                    toast('error', 'Admin chưa cài đặt StemFreeMint721! Liên hệ giáo viên.'); return;
                }

                var collAddr = document.getElementById('gc-collection').value.trim();
                if (!collAddr || collAddr.length !== 42) { _gcSetStatus('❌ Địa chỉ bộ sưu tập không hợp lệ!', '#ef4444'); return; }

                _gcSpinning = true;
                _gcOpenBtn.disabled = true;
                _gcOpenBtn.style.opacity = '0.5';
                _gcSuccessBox.style.display = 'none';

                // Chọn ngẫu nhiên theo weight
                var winner    = _gcWeightedRandom(_gcTemplates);
                var winnerIdx = _gcTemplates.indexOf(winner);

                // Chạy animation song song với tx
                _gcRunAnimation(winnerIdx, null);
                _gcSetStatus('⏳ Đang xác nhận trên MetaMask...', '#f59e0b');

                try {
                    var machine  = new ethers.Contract(_GC_FREE_MINT_ADDR, _GC_FREE_MINT_ABI, signer);
                    var tx       = await machine.claimNFT(collAddr, winner.templateId);
                    _gcSetStatus('⛏️ Đang chờ blockchain xác nhận...', '#f59e0b');
                    var receipt  = await tx.wait();

                    // Đọc Token ID vừa đúc (totalSupply - 1)
                    var mintedId = '?';
                    try {
                        var collC  = new ethers.Contract(collAddr, _GC_COLL_ABI, signer);
                        var total  = await collC.totalSupply();
                        var totalB = typeof total === 'bigint' ? total : BigInt(total.toString());
                        mintedId   = (totalB - 1n).toString();
                    } catch(e2) {}

                    // Hiện kết quả sau animation
                    setTimeout(function() {
                        document.getElementById('gc-res-token').style.display = 'block';
                        document.getElementById('gc-res-token-id').textContent = mintedId;

                        document.getElementById('gc-success-addr').textContent  = collAddr;
                        document.getElementById('gc-success-token').textContent = '#' + mintedId;
                        _gcSuccessBox.style.display = 'block';

                        _gcSetStatus('✅ Nhận NFT thành công! [' + winner.name + '] Token #' + mintedId, '#10b981');
                        toast('success', '🎁 Đã nhận: ' + winner.name + ' (Token #' + mintedId + ')');

                        _gcSpinning = false;
                        _gcOpenBtn.disabled = false;
                        _gcOpenBtn.style.opacity = '1';
                    }, 4400);

                } catch(e) {
                    var msg = e.reason || e.message || 'Lỗi không xác định';
                    if (msg.includes('user rejected')) msg = 'Bạn đã từ chối giao dịch!';
                    if (msg.includes('Not authorized')) msg = 'Bộ sưu tập chưa cấp quyền cho Máy Phát! Giáo viên cần dùng khối Grant Minter.';
                    if (msg.includes('Template does not exist')) msg = 'Mẫu NFT không tồn tại trong contract!';

                    setTimeout(function() {
                        _gcSetStatus('❌ ' + msg.substring(0, 100), '#ef4444');
                        toast('error', msg.substring(0, 60));
                        _gcSpinning = false;
                        _gcOpenBtn.disabled = false;
                        _gcOpenBtn.style.opacity = '1';
                    }, 4400);
                }
            });
        }
    `,
    bindings: []
}
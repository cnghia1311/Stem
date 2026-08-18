import { FACTORY_ADDRESSES } from "../contracts/contractFactorys.js";

// ==================== KHỐI: BẢNG ĐIỀU KHIỂN QUỸ (MULTISIG DASHBOARD) ====================
export default {
  id: "multisig-dashboard",
  name: "✍️ Bảng Điều Khiển Quỹ Lớp",
  desc: "Quản lý Quỹ: Tạo đề xuất rút tiền, ký duyệt, thực thi lệnh giải ngân",
  color: "#f59e0b",
  label: "Bảng Điều Khiển Quỹ",

  // ⬇️ MỚI: hiện ra ở panel "Thuộc Tính Khối" → mục Cấu Hình Hợp Đồng
  contractFields: [
    {
      key: "displayToken",
      label: "🪙 Token hiển thị số dư quỹ",
      placeholder: "0x... (để trống = chỉ hiện ETH)",
      type: "text",
    },
  ],

  exportHtml: (tk, cfg) => {
    const conf =
      cfg && typeof cfg === "object" && !Array.isArray(cfg) ? cfg : {};
    const displayToken = conf.displayToken || "";
    return `
    <div class="khoi" style="border-left-color:#f59e0b;">
        <input type="hidden" id="msdb-display-token" value="${displayToken}">
        <div class="khoi-title" style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:24px;">✍️</span>
            <span style="background:linear-gradient(135deg,#f59e0b,#eab308);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:16px;letter-spacing:1px;">BẢNG ĐIỀU KHIỂN QUỸ</span>
        </div>

        <!-- Nhập địa chỉ quỹ -->
        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:15px;margin-bottom:12px;">
            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">🏛️ Địa chỉ Quỹ Lớp</label>
            <div style="display:flex;gap:6px;margin-bottom:8px;">
                <input type="text" id="msdb-fund-addr" placeholder="0x... (Paste địa chỉ Quỹ)" style="flex:1;padding:8px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;outline:none;font-family:monospace;">
                <button id="msdb-load-btn" style="background:linear-gradient(135deg,#f59e0b,#eab308);border:none;color:#0f172a;padding:6px 14px;border-radius:6px;font-size:12px;cursor:pointer;font-weight:bold;white-space:nowrap;">📡 Tải Dữ Liệu</button>
            </div>

            <!-- Header thông tin quỹ -->
            <div id="msdb-header" style="display:none;">
                <div style="background:#1e293b;padding:10px;border-radius:8px;margin-bottom:8px;">
                    <div id="msdb-token-row" style="display:none;justify-content:space-between;align-items:center;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #334155;">
                        <span style="font-size:11px;color:#94a3b8;">💰 Quỹ lớp đang có:</span>
                        <span id="msdb-token-balance" style="font-size:17px;font-weight:bold;color:#10b981;">0</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                        <span id="msdb-eth-label" style="font-size:11px;color:#94a3b8;">💎 Số dư ETH:</span>
                        <span id="msdb-balance" style="font-size:16px;font-weight:bold;color:#10b981;">0 ETH</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                        <span style="font-size:11px;color:#94a3b8;">👥 Ban Quản Trị:</span>
                        <span id="msdb-owners-info" style="font-size:11px;color:#a5b4fc;">-</span>
                    </div>
                    <div id="msdb-owners-list-display" style="font-size:10px;color:#64748b;margin-bottom:6px;"></div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                        <span style="font-size:11px;color:#94a3b8;">🔐 Yêu cầu:</span>
                        <span id="msdb-required-info" style="font-size:12px;font-weight:bold;color:#f59e0b;">-</span>
                    </div>
                    <div id="msdb-role-badge" style="text-align:center;padding:4px 8px;border-radius:6px;font-size:11px;font-weight:bold;margin-top:4px;"></div>
                </div>
            </div>
        </div>

        <!-- Tạo Đề Xuất -->
        <div id="msdb-submit-section" style="display:none;background:#0f172a;border:1px solid #334155;border-radius:12px;padding:15px;margin-bottom:12px;">
            <div style="font-size:13px;font-weight:bold;color:#f59e0b;margin-bottom:10px;">📝 Tạo Đề Xuất Rút Tiền</div>

            <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:4px;">💱 Loại tiền rút</label>
            <select id="msdb-withdraw-type" style="width:100%;padding:8px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;outline:none;margin-bottom:8px;">
                <option value="native">⬡ Coin Mạng (ETH)</option>
                <option value="erc20">🪙 Token ERC-20</option>
            </select>

            <div id="msdb-erc20-input" style="display:none;margin-bottom:8px;">
                <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:4px;">📄 Địa chỉ Token</label>
                <input type="text" id="msdb-token-addr" placeholder="0x..." style="width:100%;padding:8px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;outline:none;font-family:monospace;">
            </div>

            <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:4px;">📬 Ví người nhận</label>
            <input type="text" id="msdb-to-addr" placeholder="0x..." style="width:100%;padding:8px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;outline:none;font-family:monospace;margin-bottom:8px;">

            <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:4px;">💎 Số lượng</label>
            <input type="text" id="msdb-withdraw-amount" placeholder="0.01" style="width:100%;padding:8px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;outline:none;margin-bottom:8px;">

            <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:4px;">📋 Ghi chú / Lý do rút</label>
            <input type="text" id="msdb-note" placeholder="Mua phần thưởng cuối kỳ..." maxlength="200" style="width:100%;padding:8px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;outline:none;margin-bottom:10px;">

            <button id="msdb-submit-btn" style="width:100%;padding:12px;border-radius:8px;border:none;background:linear-gradient(135deg,#f59e0b,#eab308);color:#0f172a;font-size:13px;font-weight:800;cursor:pointer;">📝 TẠO ĐỀ XUẤT</button>
            <div id="msdb-submit-status" style="margin-top:6px;font-size:11px;text-align:center;color:#94a3b8;min-height:16px;"></div>
        </div>

        <!-- Danh sách lệnh -->
        <div id="msdb-txns-section" style="display:none;">
            <div style="font-size:13px;font-weight:bold;color:#f59e0b;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;">
                <span>📜 Danh Sách Đề Xuất</span>
                <button id="msdb-refresh-btn" style="background:none;border:1px solid #334155;color:#94a3b8;padding:3px 8px;border-radius:6px;font-size:10px;cursor:pointer;">🔄 Làm mới</button>
            </div>
            <div id="msdb-txns-list" style="font-size:11px;color:#94a3b8;"></div>
        </div>
    </div>`;
  },

  engineCode: () => `
        const MULTISIG_FULL_ABI = [
            "function submitTransaction(address to, uint256 value, address token, uint256 tokenAmount, string note)",
            "function confirmTransaction(uint256 txId)",
            "function revokeConfirmation(uint256 txId)",
            "function executeTransaction(uint256 txId)",
            "function getTransaction(uint256 txId) view returns (address to, uint256 value, address token, uint256 tokenAmount, bool executed, uint256 numConfirmations)",
            "function getTransactionCount() view returns (uint256)",
            "function getOwners() view returns (address[])",
            "function required() view returns (uint256)",
            "function isOwner(address) view returns (bool)",
            "function confirmed(uint256, address) view returns (bool)",
            "function getERC20Balance(address token) view returns (uint256)",
            "event SubmitTransaction(address indexed creator, uint256 indexed txId, address to, uint256 value, address token, uint256 tokenAmount, string note)",
            "event ConfirmTransaction(address indexed owner, uint256 indexed txId)",
            "event RevokeConfirmation(address indexed owner, uint256 indexed txId)",
            "event ExecuteTransaction(address indexed owner, uint256 indexed txId)"
        ];
    
        const ERC20_VIEW_ABI = [
            "function symbol() view returns (string)",
            "function decimals() view returns (uint8)"
        ];
        const ZERO_ADDR = '0x0000000000000000000000000000000000000000';

        var _msdbFundAddr = null;
        var _msdbOwners = [];
        var _msdbRequired = 0;
        var _msdbIsOwner = false;
        var _msdbContract = null;

        // Cache token info
        var _tokenCache = {};
        async function _getTokenInfo(addr) {
            if (_tokenCache[addr]) return _tokenCache[addr];
            try {
                var t = new ethers.Contract(addr, ERC20_VIEW_ABI, provider);
                var sym = await t.symbol();
                var dec = await t.decimals();
                _tokenCache[addr] = { symbol: sym, decimals: dec };
                return _tokenCache[addr];
            } catch(e) { return { symbol: '???', decimals: 18 }; }
        }

        // Short address
        function _shortAddr(a) { return a.substring(0,6) + '...' + a.substring(38); }

        // ---- Token lớp do giáo viên cấu hình trong panel Thuộc Tính Khối ----
        var _msdbDisplayEl = document.getElementById('msdb-display-token');
        var MSDB_TOKEN = _msdbDisplayEl ? (_msdbDisplayEl.value || '').trim() : '';
        var MSDB_HAS_TOKEN = MSDB_TOKEN.length === 42;

        if (MSDB_HAS_TOKEN) {
            // ETH lùi xuống thành dòng phụ, chỉ còn vai trò trả phí gas
            var _msdbEthLabel = document.getElementById('msdb-eth-label');
            var _msdbEthVal   = document.getElementById('msdb-balance');
            if (_msdbEthLabel) { _msdbEthLabel.style.color = '#64748b'; _msdbEthLabel.textContent = '💎 ETH (chỉ để trả phí gas):'; }
            if (_msdbEthVal)   { _msdbEthVal.style.fontSize = '11px'; _msdbEthVal.style.color = '#64748b'; }

            // Mặc định rút bằng token lớp, điền sẵn địa chỉ
            var _msdbTokInp = document.getElementById('msdb-token-addr');
            if (_msdbTokInp) _msdbTokInp.value = MSDB_TOKEN;
            var _msdbWType = document.getElementById('msdb-withdraw-type');
            if (_msdbWType) {
                _msdbWType.value = 'erc20';
                document.getElementById('msdb-erc20-input').style.display = 'block';
            }
        }

        async function _msdbRefreshTokenBalance() {
            if (!MSDB_HAS_TOKEN || !_msdbContract) return;
            var row = document.getElementById('msdb-token-row');
            var out = document.getElementById('msdb-token-balance');
            if (!row || !out) return;
            row.style.display = 'flex';
            out.textContent = '⏳ ...';
            try {
                var info = await _getTokenInfo(MSDB_TOKEN);
                var bal  = await _msdbContract.getERC20Balance(MSDB_TOKEN);
                var num  = parseFloat(ethers.utils.formatUnits(bal, info.decimals));
                out.textContent = num.toLocaleString('vi-VN', { maximumFractionDigits: 4 }) + ' ' + info.symbol;
                out.style.color = '#10b981';
            } catch(e) {
                out.textContent = '❌ không đọc được';
                out.style.color = '#ef4444';
            }
        }

        // Tải danh sách lệnh
        async function _msdbLoadTxns() {
            var listEl = document.getElementById('msdb-txns-list');
            if (!_msdbContract) return;
            listEl.innerHTML = '<span style="color:#f59e0b;">⏳ Đang tải danh sách đề xuất...</span>';

            try {
                var count = await _msdbContract.getTransactionCount();
                var total = Number(count);

                if (total === 0) {
                    listEl.innerHTML = '<div style="text-align:center;padding:20px;color:#64748b;">Chưa có đề xuất nào.</div>';
                    return;
                }

                // Lấy notes từ events
                var noteMap = {};
                try {
                    var filter = _msdbContract.filters.SubmitTransaction();
                    var events = await _msdbContract.queryFilter(filter);
                    for (var e = 0; e < events.length; e++) {
                        noteMap[Number(events[e].args.txId)] = events[e].args.note || '';
                    }
                } catch(e) {}

                var html = '';
                // Hiển thị mới nhất trước
                for (var i = total - 1; i >= 0; i--) {
                    var txn = await _msdbContract.getTransaction(i);
                    var isNative = txn.token === ZERO_ADDR;
                    var amountStr = '';
                    var typeLabel = '';

                    if (isNative) {
                        amountStr = parseFloat(ethers.utils.formatEther(txn.value)).toFixed(6) + ' ETH';
                        typeLabel = '⬡ ETH';
                    } else {
                        var info = await _getTokenInfo(txn.token);
                        amountStr = parseFloat(ethers.utils.formatUnits(txn.tokenAmount, info.decimals)).toFixed(4) + ' ' + info.symbol;
                        typeLabel = '🪙 ' + info.symbol;
                    }

                    var note = noteMap[i] || '';
                    var progress = Number(txn.numConfirmations);
                    var progressPct = Math.round((progress / _msdbRequired) * 100);
                    var isExecuted = txn.executed;
                    var isDone = progress >= _msdbRequired;

                    // Status badge
                    var statusBadge = '';
                    if (isExecuted) {
                        statusBadge = '<span style="background:#10b981;color:white;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:bold;">✅ Đã Thực Thi</span>';
                    } else if (isDone) {
                        statusBadge = '<span style="background:#f59e0b;color:#0f172a;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:bold;animation:pulse 2s infinite;">🚀 Sẵn sàng Thực Thi</span>';
                    } else {
                        statusBadge = '<span style="background:#334155;color:#94a3b8;padding:2px 8px;border-radius:4px;font-size:10px;">⏳ Chờ ký (' + progress + '/' + _msdbRequired + ')</span>';
                    }

                    // Progress bar
                    var barColor = isExecuted ? '#10b981' : (isDone ? '#f59e0b' : '#6366f1');
                    var progressBar = '<div style="background:#1e293b;border-radius:4px;height:6px;margin:6px 0;overflow:hidden;">'
                        + '<div style="background:' + barColor + ';height:100%;width:' + Math.min(progressPct, 100) + '%;border-radius:4px;transition:width 0.3s;"></div></div>';

                    // Owner confirm status
                    var ownerBadges = '';
                    for (var o = 0; o < _msdbOwners.length; o++) {
                        var isConf = false;
                        try { isConf = await _msdbContract.confirmed(i, _msdbOwners[o]); } catch(e) {}
                        var badge = isConf
                            ? '<span style="color:#10b981;font-size:9px;">✅ ' + _shortAddr(_msdbOwners[o]) + '</span>'
                            : '<span style="color:#64748b;font-size:9px;">⏳ ' + _shortAddr(_msdbOwners[o]) + '</span>';
                        ownerBadges += badge + ' ';
                    }

                    // Action buttons (chỉ hiện nếu chưa thực thi)
                    var actions = '';
                    if (!isExecuted && _msdbIsOwner) {
                        var userConfirmed = false;
                        try { userConfirmed = await _msdbContract.confirmed(i, userAddr); } catch(e) {}

                        if (!userConfirmed) {
                            actions += '<button onclick="_msdbConfirm(' + i + ')" style="background:#6366f1;color:white;border:none;padding:6px 12px;border-radius:6px;font-size:11px;cursor:pointer;font-weight:bold;margin-right:4px;">✍️ Ký Duyệt</button>';
                        } else {
                            actions += '<button onclick="_msdbRevoke(' + i + ')" style="background:#64748b;color:white;border:none;padding:6px 12px;border-radius:6px;font-size:11px;cursor:pointer;margin-right:4px;">↩️ Rút Chữ Ký</button>';
                        }
                        if (isDone) {
                            actions += '<button onclick="_msdbExecute(' + i + ')" style="background:linear-gradient(135deg,#10b981,#34d399);color:white;border:none;padding:6px 14px;border-radius:6px;font-size:11px;cursor:pointer;font-weight:bold;animation:pulse 2s infinite;">🚀 Thực Thi</button>';
                        }
                    }

                    html += '<div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:12px;margin-bottom:8px;">';
                    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
                    html += '<span style="color:#f59e0b;font-weight:bold;font-size:13px;">Đề Xuất #' + i + '</span>';
                    html += statusBadge;
                    html += '</div>';
                    html += '<div style="display:flex;gap:12px;margin-bottom:4px;flex-wrap:wrap;">';
                    html += '<span style="color:#a5b4fc;font-size:11px;">' + typeLabel + '</span>';
                    html += '<span style="color:#e2e8f0;font-size:11px;font-weight:bold;">' + amountStr + '</span>';
                    html += '<span style="color:#94a3b8;font-size:11px;">→ ' + _shortAddr(txn.to) + '</span>';
                    html += '</div>';
                    if (note) {
                        html += '<div style="color:#64748b;font-size:10px;margin-bottom:4px;font-style:italic;">📋 ' + note + '</div>';
                    }
                    html += progressBar;
                    html += '<div style="margin-bottom:8px;">' + ownerBadges + '</div>';
                    if (actions) {
                        html += '<div style="display:flex;gap:4px;flex-wrap:wrap;">' + actions + '</div>';
                    }
                    html += '</div>';
                }
                listEl.innerHTML = html;

            } catch(e) {
                listEl.innerHTML = '<span style="color:#ef4444;">❌ Lỗi tải danh sách: ' + (e.message||'').substring(0,80) + '</span>';
            }
        }

        // Ký duyệt
        window._msdbConfirm = async function(txId) {
            if (!signer || !_msdbContract) return;
            try {
                toast('info', '⏳ Đang ký duyệt Đề Xuất #' + txId + '...');
                var ms = _msdbContract.connect(signer);
                var tx = await ms.confirmTransaction(txId);
                await tx.wait();
                toast('success', '✅ Đã ký duyệt Đề Xuất #' + txId + '!');
                _msdbLoadTxns();
            } catch(e) {
                var msg = e.reason || e.message || '';
                if (msg.includes('user rejected')) msg = 'Bạn đã từ chối!';
                toast('error', '❌ ' + msg.substring(0,60));
            }
        };

        // Rút chữ ký
        window._msdbRevoke = async function(txId) {
            if (!signer || !_msdbContract) return;
            try {
                toast('info', '⏳ Đang rút chữ ký Đề Xuất #' + txId + '...');
                var ms = _msdbContract.connect(signer);
                var tx = await ms.revokeConfirmation(txId);
                await tx.wait();
                toast('success', '↩️ Đã rút chữ ký Đề Xuất #' + txId + '!');
                _msdbLoadTxns();
            } catch(e) {
                var msg = e.reason || e.message || '';
                if (msg.includes('user rejected')) msg = 'Bạn đã từ chối!';
                toast('error', '❌ ' + msg.substring(0,60));
            }
        };

        // Thực thi lệnh
        window._msdbExecute = async function(txId) {
            if (!signer || !_msdbContract) return;
            try {
                toast('info', '🚀 Đang thực thi Đề Xuất #' + txId + '...');
                var ms = _msdbContract.connect(signer);
                var tx = await ms.executeTransaction(txId);
                await tx.wait();
                toast('success', '🎉 Đã thực thi Đề Xuất #' + txId + ' thành công! Tiền đã giải ngân!');
                _msdbLoadTxns();
                // Refresh balance
                // Refresh balance
                try {
                    var bal = await provider.getBalance(_msdbFundAddr);
                    document.getElementById('msdb-balance').textContent = parseFloat(ethers.utils.formatEther(bal)).toFixed(6) + ' ETH';
                    await _msdbRefreshTokenBalance();
                } catch(e) {}
            } catch(e) {
                var msg = e.reason || e.message || '';
                if (msg.includes('user rejected')) msg = 'Bạn đã từ chối!';
                if (msg.includes('Chua du chu ky')) msg = 'Chưa đủ chữ ký để thực thi!';
                if (msg.includes('khong du so du')) msg = 'Quỹ không đủ số dư để giải ngân!';
                toast('error', '❌ ' + msg.substring(0,80));
            }
        };

        // Toggle ERC-20 input
        var _msdbWithdrawType = document.getElementById('msdb-withdraw-type');
        if (_msdbWithdrawType) {
            _msdbWithdrawType.addEventListener('change', function() {
                document.getElementById('msdb-erc20-input').style.display = this.value === 'erc20' ? 'block' : 'none';
            });
        }

        // Tải dữ liệu quỹ
        var _msdbLoadBtn = document.getElementById('msdb-load-btn');
        if (_msdbLoadBtn) {
            _msdbLoadBtn.addEventListener('click', async function() {
                if (!signer) { toast('error', 'Cần kết nối ví (🦊) trước!'); return; }
                var addr = document.getElementById('msdb-fund-addr').value.trim();
                if (!addr || addr.length !== 42) { toast('error', 'Nhập địa chỉ Quỹ hợp lệ!'); return; }

                _msdbFundAddr = addr;
                _msdbLoadBtn.disabled = true; _msdbLoadBtn.textContent = '⏳ Đang tải...';

                try {
                    _msdbContract = new ethers.Contract(addr, MULTISIG_FULL_ABI, provider);
                    var bal = await provider.getBalance(addr);
                    _msdbOwners = await _msdbContract.getOwners();
                    _msdbRequired = Number(await _msdbContract.required());
                    _msdbIsOwner = await _msdbContract.isOwner(userAddr);

                    // Header
                    document.getElementById('msdb-balance').textContent = parseFloat(ethers.utils.formatEther(bal)).toFixed(6) + ' ETH';
                    await _msdbRefreshTokenBalance();
                    document.getElementById('msdb-owners-info').textContent = _msdbOwners.length + ' Owner';
                    document.getElementById('msdb-required-info').textContent = _msdbRequired + '/' + _msdbOwners.length + ' chữ ký';

                    var ownersHtml = '';
                    for (var i = 0; i < _msdbOwners.length; i++) {
                        var isSelf = _msdbOwners[i].toLowerCase() === userAddr.toLowerCase();
                        ownersHtml += '<span style="color:' + (isSelf ? '#a5b4fc' : '#64748b') + ';margin-right:6px;">' + (isSelf ? '🦊 ' : '• ') + _shortAddr(_msdbOwners[i]) + '</span>';
                    }
                    document.getElementById('msdb-owners-list-display').innerHTML = ownersHtml;

                    // Role badge
                    var roleBadge = document.getElementById('msdb-role-badge');
                    if (_msdbIsOwner) {
                        roleBadge.innerHTML = '✅ Bạn là Owner (Ban Quản Trị)';
                        roleBadge.style.cssText = 'text-align:center;padding:4px 8px;border-radius:6px;font-size:11px;font-weight:bold;margin-top:4px;background:#0f2a1a;color:#10b981;border:1px solid #10b981;';
                    } else {
                        roleBadge.innerHTML = '👁️ Bạn đang ở chế độ Xem (không phải Owner)';
                        roleBadge.style.cssText = 'text-align:center;padding:4px 8px;border-radius:6px;font-size:11px;font-weight:bold;margin-top:4px;background:#1e293b;color:#94a3b8;border:1px solid #334155;';
                    }

                    document.getElementById('msdb-header').style.display = 'block';
                    document.getElementById('msdb-submit-section').style.display = 'block';
                    document.getElementById('msdb-txns-section').style.display = 'block';

                    toast('success', '📡 Đã tải dữ liệu quỹ!');

                    // Load transactions
                    _msdbLoadTxns();
                } catch(e) {
                    toast('error', 'Không tải được! Kiểm tra lại địa chỉ quỹ.');
                    document.getElementById('msdb-header').style.display = 'none';
                    document.getElementById('msdb-submit-section').style.display = 'none';
                    document.getElementById('msdb-txns-section').style.display = 'none';
                } finally {
                    _msdbLoadBtn.disabled = false; _msdbLoadBtn.textContent = '📡 Tải Dữ Liệu';
                }
            });
        }

        // Tạo đề xuất rút tiền
        var _msdbSubmitBtn = document.getElementById('msdb-submit-btn');
        if (_msdbSubmitBtn) {
            _msdbSubmitBtn.addEventListener('click', async function() {
                if (!signer || !_msdbContract) { toast('error', 'Cần tải dữ liệu quỹ trước!'); return; }

                var to = document.getElementById('msdb-to-addr').value.trim();
                var amount = document.getElementById('msdb-withdraw-amount').value.trim();
                var note = document.getElementById('msdb-note').value.trim() || 'Khong co ghi chu';
                var isERC20 = _msdbWithdrawType.value === 'erc20';

                if (!to || to.length !== 42) { toast('error', 'Nhập ví người nhận hợp lệ!'); return; }
                if (!amount || isNaN(amount) || parseFloat(amount) <= 0) { toast('error', 'Nhập số lượng hợp lệ!'); return; }

                var submitStatus = document.getElementById('msdb-submit-status');
                try {
                    _msdbSubmitBtn.disabled = true; _msdbSubmitBtn.style.opacity = '0.5';

                    var ms = _msdbContract.connect(signer);
                    var tx;

                    if (isERC20) {
                        var tokenAddr = document.getElementById('msdb-token-addr').value.trim();
                        if (!tokenAddr || tokenAddr.length !== 42) { toast('error', 'Nhập địa chỉ Token hợp lệ!'); return; }
                        var info = await _getTokenInfo(tokenAddr);
                        var amountWei = ethers.utils.parseUnits(amount, info.decimals);
                        submitStatus.innerHTML = '<span style="color:#f59e0b;">⏳ Đang tạo đề xuất rút ' + amount + ' ' + info.symbol + '...</span>';
                        tx = await ms.submitTransaction(to, 0, tokenAddr, amountWei, note);
                    } else {
                        var amountWei = ethers.utils.parseEther(amount);
                        submitStatus.innerHTML = '<span style="color:#f59e0b;">⏳ Đang tạo đề xuất rút ' + amount + ' ETH...</span>';
                        tx = await ms.submitTransaction(to, amountWei, ZERO_ADDR, 0, note);
                    }

                    await tx.wait();
                    submitStatus.innerHTML = '<span style="color:#10b981;">✅ Đề xuất đã được tạo thành công!</span>';
                    toast('success', '📝 Đã tạo đề xuất rút tiền!');

                    // Clear form
                    document.getElementById('msdb-to-addr').value = '';
                    document.getElementById('msdb-withdraw-amount').value = '';
                    document.getElementById('msdb-note').value = '';

                    // Refresh list
                    _msdbLoadTxns();
                } catch(e) {
                    var msg = e.reason || e.message || '';
                    if (msg.includes('user rejected')) msg = 'Bạn đã từ chối giao dịch!';
                    submitStatus.innerHTML = '<span style="color:#ef4444;">❌ ' + msg.substring(0, 80) + '</span>';
                    toast('error', 'Thất bại: ' + msg.substring(0, 50));
                } finally {
                    _msdbSubmitBtn.disabled = false; _msdbSubmitBtn.style.opacity = '1';
                }
            });
        }

        // Refresh button
        var _msdbRefreshBtn = document.getElementById('msdb-refresh-btn');
        if (_msdbRefreshBtn) {
            _msdbRefreshBtn.addEventListener('click', function() {
                if (_msdbContract) {
                    _msdbLoadTxns();
                    // Refresh balance too
                    provider.getBalance(_msdbFundAddr).then(function(bal) {
                        document.getElementById('msdb-balance').textContent = parseFloat(ethers.utils.formatEther(bal)).toFixed(6) + ' ETH';
                    }).catch(function(){});
                }
            });
        }
    `,
  bindings: [],
};

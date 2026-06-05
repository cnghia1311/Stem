import { FACTORY_ADDRESSES } from '../contracts/contractFactorys.js';

// ==================== KHỐI: KHỞI TẠO QUỸ LỚP (MULTISIG FACTORY) ====================
export default {
    id: "multisig-factory",
    name: "🏛️ Khởi Tạo Quỹ Lớp (Đa Chữ Ký)",
    desc: "Tạo Quỹ lớp mới với nhiều người quản lý, cần đủ chữ ký mới rút được tiền",
    color: "#6366f1",
    label: "Tạo Quỹ Lớp",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#6366f1;">
        <div class="khoi-title" style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:24px;">🏛️</span>
            <span style="background:linear-gradient(135deg,#6366f1,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:16px;letter-spacing:1px;">KHỞI TẠO QUỸ LỚP</span>
        </div>

        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:15px;margin-bottom:12px;">
            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">📋 Danh sách ví Ban Quản Trị (Owner)</label>
            <div id="msf-owners-list" style="margin-bottom:8px;">
                <div style="display:flex;gap:6px;margin-bottom:6px;">
                    <input type="text" class="msf-owner-input" placeholder="0x... (Ví Owner 1)" style="flex:1;padding:8px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;outline:none;font-family:monospace;">
                </div>
                <div style="display:flex;gap:6px;margin-bottom:6px;">
                    <input type="text" class="msf-owner-input" placeholder="0x... (Ví Owner 2)" style="flex:1;padding:8px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;outline:none;font-family:monospace;">
                </div>
            </div>
            <div style="display:flex;gap:6px;margin-bottom:10px;">
                <button id="msf-add-owner" style="flex:1;background:none;border:1px dashed #334155;color:#94a3b8;padding:6px 12px;border-radius:6px;font-size:11px;cursor:pointer;">➕ Thêm Owner</button>
                <button id="msf-add-me" style="flex:1;background:none;border:1px dashed #6366f1;color:#a5b4fc;padding:6px 12px;border-radius:6px;font-size:11px;cursor:pointer;">🦊 Thêm Ví Của Tôi</button>
            </div>

            <div id="msf-owners-preview" style="display:none;background:#1e293b;padding:8px;border-radius:8px;margin-bottom:10px;font-size:11px;color:#94a3b8;"></div>

            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">🔐 Số chữ ký yêu cầu (M-of-N)</label>
            <input type="number" id="msf-required" placeholder="2" min="1" style="width:80px;padding:8px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:14px;outline:none;text-align:center;font-weight:bold;">
            <div id="msf-required-preview" style="font-size:11px;color:#a5b4fc;margin-top:4px;min-height:16px;"></div>
        </div>

        <button id="msf-create-btn" style="width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;font-size:15px;font-weight:800;cursor:pointer;letter-spacing:1px;">🏛️ TẠO QUỸ LỚP</button>

        <div id="msf-status" style="margin-top:10px;font-size:12px;text-align:center;color:#94a3b8;min-height:20px;"></div>

        <div id="msf-result" style="display:none;margin-top:12px;background:#0f2a1a;border:1px solid #10b981;border-radius:12px;padding:15px;">
            <div style="font-size:14px;font-weight:bold;color:#10b981;margin-bottom:8px;">🎉 Quỹ Lớp đã được tạo thành công!</div>
            <div style="font-size:11px;color:#94a3b8;margin-bottom:8px;">Địa chỉ Contract Quỹ Lớp:</div>
            <div id="msf-result-address" style="background:#1e293b;padding:10px;border-radius:8px;font-size:12px;color:#a5b4fc;word-break:break-all;cursor:pointer;text-align:center;font-family:monospace;" title="Bấm để copy"></div>
            <div style="text-align:center;margin-top:8px;">
                <a id="msf-result-link" href="#" target="_blank" style="color:#06b6d4;font-size:11px;text-decoration:underline;">🔗 Xem trên Etherscan</a>
            </div>
            <div style="margin-top:10px;padding:8px;background:#1e293b;border-radius:8px;font-size:10px;color:#f59e0b;text-align:center;">
                💡 Copy địa chỉ này → Dán vào khối <strong>Đóng Quỹ</strong> hoặc <strong>Bảng Điều Khiển Quỹ</strong> để sử dụng!
            </div>
        </div>

        <div id="msf-history" style="margin-top:12px;">
            <div style="font-size:12px;color:#64748b;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;">
                <span>📜 Quỹ Lớp bạn đã tạo / tham gia:</span>
                <button id="msf-load-history" style="background:none;border:1px solid #334155;color:#94a3b8;padding:3px 8px;border-radius:6px;font-size:10px;cursor:pointer;">Tải lịch sử</button>
            </div>
            <div id="msf-history-list" style="font-size:11px;color:#94a3b8;"></div>
        </div>
    </div>`,

    engineCode: () => `
        const MULTISIG_FACTORY_ADDR = '${FACTORY_ADDRESSES.MULTISIG_FACTORY}';
        const MULTISIG_FACTORY_ABI = [
            "function createMultisig(address[] owners, uint256 required) external returns (address)",
            "function getMultisigs() external view returns (address[])",
            "function getMultisigsByOwner(address owner) external view returns (address[])",
            "function getTotalMultisigs() external view returns (uint256)",
            "event MultisigCreated(address indexed creator, address multisigAddress, address[] owners, uint256 required)"
        ];
        const MINI_MULTISIG_ABI = [
            "function required() view returns (uint256)",
            "function getOwners() view returns (address[])"
        ];

        const _msfBtn = document.getElementById('msf-create-btn');
        const _msfRequired = document.getElementById('msf-required');
        const _msfStatus = document.getElementById('msf-status');
        const _msfResult = document.getElementById('msf-result');
        const _msfAddOwner = document.getElementById('msf-add-owner');
        const _msfAddMe = document.getElementById('msf-add-me');
        const _msfLoadHist = document.getElementById('msf-load-history');
        const _msfOwnersPreview = document.getElementById('msf-owners-preview');
        const _msfRequiredPreview = document.getElementById('msf-required-preview');

        function _msfGetOwners() {
            var inputs = document.querySelectorAll('.msf-owner-input');
            var list = [];
            for (var i = 0; i < inputs.length; i++) {
                var v = inputs[i].value.trim();
                if (v && v.length === 42 && v.startsWith('0x')) list.push(v);
            }
            return list;
        }

        function _msfUpdatePreview() {
            var owners = _msfGetOwners();
            var req = parseInt(_msfRequired.value) || 0;
            if (owners.length > 0) {
                var html = '<div style="font-weight:bold;color:#a5b4fc;margin-bottom:4px;">👥 ' + owners.length + ' Owner hợp lệ:</div>';
                for (var i = 0; i < owners.length; i++) {
                    html += '<div style="color:#e2e8f0;font-family:monospace;font-size:10px;">• ' + owners[i].substring(0,6) + '...' + owners[i].substring(38) + '</div>';
                }
                _msfOwnersPreview.innerHTML = html;
                _msfOwnersPreview.style.display = 'block';
            } else {
                _msfOwnersPreview.style.display = 'none';
            }
            if (req > 0 && owners.length > 0) {
                _msfRequiredPreview.innerHTML = '🔐 Cần <strong>' + req + ' / ' + owners.length + '</strong> người đồng ý để giải ngân';
            } else {
                _msfRequiredPreview.innerHTML = '';
            }
        }

        if (_msfBtn) {
            // Live preview khi nhập
            document.getElementById('msf-owners-list').addEventListener('input', _msfUpdatePreview);
            _msfRequired.addEventListener('input', _msfUpdatePreview);

            // Thêm ô Owner mới
            _msfAddOwner.addEventListener('click', function() {
                var list = document.getElementById('msf-owners-list');
                var count = list.querySelectorAll('.msf-owner-input').length + 1;
                var div = document.createElement('div');
                div.style.cssText = 'display:flex;gap:6px;margin-bottom:6px;';
                div.innerHTML = '<input type="text" class="msf-owner-input" placeholder="0x... (Ví Owner ' + count + ')" style="flex:1;padding:8px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;outline:none;font-family:monospace;"><button onclick="this.parentElement.remove()" style="background:#ef4444;color:white;border:none;padding:4px 8px;border-radius:6px;font-size:11px;cursor:pointer;">✕</button>';
                list.appendChild(div);
            });

            // Thêm ví đang kết nối
            _msfAddMe.addEventListener('click', function() {
                if (!userAddr) { toast('error', 'Cần kết nối ví (🦊) trước!'); return; }
                // Kiểm tra trùng
                var inputs = document.querySelectorAll('.msf-owner-input');
                for (var i = 0; i < inputs.length; i++) {
                    if (inputs[i].value.trim().toLowerCase() === userAddr.toLowerCase()) {
                        toast('error', 'Ví của bạn đã có trong danh sách!');
                        return;
                    }
                }
                // Tìm ô trống hoặc thêm mới
                var filled = false;
                for (var i = 0; i < inputs.length; i++) {
                    if (!inputs[i].value.trim()) {
                        inputs[i].value = userAddr;
                        filled = true;
                        break;
                    }
                }
                if (!filled) {
                    _msfAddOwner.click();
                    setTimeout(function() {
                        var allInputs = document.querySelectorAll('.msf-owner-input');
                        allInputs[allInputs.length - 1].value = userAddr;
                        _msfUpdatePreview();
                    }, 50);
                }
                _msfUpdatePreview();
                toast('success', '🦊 Đã thêm ví của bạn!');
            });

            // Copy address khi click
            document.getElementById('msf-result-address').addEventListener('click', function() {
                navigator.clipboard.writeText(this.innerText).then(function(){
                    toast('success', '📋 Đã copy địa chỉ Quỹ Lớp!');
                });
            });

            // Tạo Quỹ
            _msfBtn.addEventListener('click', async function() {
                if (!signer) { toast('error', 'Cần kết nối ví (🦊) trước!'); return; }

                var owners = _msfGetOwners();
                var req = parseInt(_msfRequired.value) || 0;

                if (owners.length < 1) { toast('error', 'Cần ít nhất 1 Owner hợp lệ!'); return; }
                if (req < 1 || req > owners.length) { toast('error', 'Số chữ ký phải từ 1 đến ' + owners.length + '!'); return; }

                // Kiểm tra trùng
                var seen = {};
                for (var i = 0; i < owners.length; i++) {
                    var lower = owners[i].toLowerCase();
                    if (seen[lower]) { toast('error', 'Có Owner bị trùng địa chỉ!'); return; }
                    seen[lower] = true;
                }

                try {
                    _msfBtn.disabled = true; _msfBtn.style.opacity = '0.5';
                    _msfStatus.innerHTML = '<span style="color:#a5b4fc;">⏳ Đang gửi giao dịch tạo Quỹ Lớp... (Xác nhận trên MetaMask)</span>';
                    _msfResult.style.display = 'none';

                    var factory = new ethers.Contract(MULTISIG_FACTORY_ADDR, MULTISIG_FACTORY_ABI, signer);
                    var tx = await factory.createMultisig(owners, req);
                    _msfStatus.innerHTML = '<span style="color:#a5b4fc;">⛏️ Đang đợi Blockchain xác nhận...</span>';

                    var receipt = await tx.wait();

                    // Lấy địa chỉ Quỹ mới từ event
                    var multisigAddr = null;
                    for (var j = 0; j < receipt.logs.length; j++) {
                        try {
                            var parsed = factory.interface.parseLog(receipt.logs[j]);
                            if (parsed.name === 'MultisigCreated') {
                                multisigAddr = parsed.args.multisigAddress;
                                break;
                            }
                        } catch(e) {}
                    }

                    if (!multisigAddr) {
                        var userMs = await factory.getMultisigsByOwner(userAddr);
                        multisigAddr = userMs[userMs.length - 1];
                    }

                    var scanBase = 'https://sepolia.etherscan.io/address/';
                    document.getElementById('msf-result-address').innerText = multisigAddr;
                    document.getElementById('msf-result-link').href = scanBase + multisigAddr;
                    _msfResult.style.display = 'block';

                    _msfStatus.innerHTML = '<span style="color:#10b981;">✅ Hoàn tất! Quỹ Lớp đã sẵn sàng với ' + owners.length + ' Owner, cần ' + req + ' chữ ký!</span>';
                    toast('success', '🎉 Đã tạo Quỹ Lớp thành công!');
                } catch(e) {
                    var msg = e.reason || e.message || 'Lỗi không xác định';
                    if (msg.includes('user rejected')) msg = 'Bạn đã từ chối giao dịch trên MetaMask!';
                    _msfStatus.innerHTML = '<span style="color:#ef4444;">❌ ' + msg.substring(0, 100) + '</span>';
                    toast('error', 'Thất bại: ' + msg.substring(0, 50));
                } finally {
                    _msfBtn.disabled = false; _msfBtn.style.opacity = '1';
                }
            });

            // Tải lịch sử
            _msfLoadHist.addEventListener('click', async function() {
                if (!signer) { toast('error', 'Cần kết nối ví trước!'); return; }
                var histList = document.getElementById('msf-history-list');
                histList.innerHTML = '<span style="color:#a5b4fc;">⏳ Đang tải...</span>';
                try {
                    var factory = new ethers.Contract(MULTISIG_FACTORY_ADDR, MULTISIG_FACTORY_ABI, provider);
                    var multisigs = await factory.getMultisigsByOwner(userAddr);

                    if (multisigs.length === 0) {
                        histList.innerHTML = '<span style="color:#64748b;">Bạn chưa tạo hoặc tham gia Quỹ Lớp nào.</span>';
                        return;
                    }
                    var html = '';
                    for (var i = 0; i < multisigs.length; i++) {
                        var addr = multisigs[i];
                        var info = '?/?';
                        try {
                            var ms = new ethers.Contract(addr, MINI_MULTISIG_ABI, provider);
                            var owners = await ms.getOwners();
                            var req = await ms.required();
                            info = req.toString() + '/' + owners.length;
                        } catch(e) {}
                        var bal = '?';
                        try { bal = ethers.utils.formatEther(await provider.getBalance(addr)); } catch(e) {}
                        html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px;background:#1e293b;border-radius:6px;margin-bottom:4px;">';
                        html += '<div style="display:flex;align-items:center;gap:6px;">';
                        html += '<span style="color:#a5b4fc;font-weight:bold;">🏛️ Quỹ #' + (i+1) + '</span>';
                        html += '<span style="color:#64748b;font-size:9px;">(' + info + ' chữ ký)</span>';
                        html += '<span style="color:#10b981;font-size:9px;">' + parseFloat(bal).toFixed(4) + ' ETH</span>';
                        html += '</div>';
                        html += '<a href="https://sepolia.etherscan.io/address/' + addr + '" target="_blank" style="color:#06b6d4;font-size:10px;font-family:monospace;">' + addr.substring(0,6) + '...' + addr.substring(38) + '</a>';
                        html += '</div>';
                    }
                    histList.innerHTML = html;
                } catch(e) {
                    histList.innerHTML = '<span style="color:#ef4444;">❌ Lỗi: ' + (e.message||'').substring(0,60) + '</span>';
                }
            });
        }
    `,
    bindings: []
}

import { FACTORY_ADDRESSES } from '../contracts/contractFactorys.js';

// ==================== KHỐI: LẬP NGÂN HÀNG TIẾT KIỆM (STAKING FACTORY) ====================
export default {
    id: "staking-factory",
    name: "🏦 Lập Ngân Hàng",
    desc: "Tạo Ngân Hàng Tiết Kiệm chung cho cả lớp. Học sinh gửi Coin lấy lãi theo ngày.",
    color: "#059669",
    label: "Lập Ngân Hàng",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#059669;">
        <div class="khoi-title" style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
            <span style="font-size:24px;">🏦</span>
            <span style="background:linear-gradient(135deg,#059669,#10b981);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:16px;letter-spacing:1px;">LẬP NGÂN HÀNG TIẾT KIỆM</span>
        </div>
        <p style="font-size:11px;color:#cbd5e1;margin-bottom:12px;line-height:1.5;">Tạo một "Ngân Hàng" Smart Contract cho cả lớp. Học sinh gửi Coin vào sẽ được nhận lãi suất mỗi ngày!</p>

        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:15px;margin-bottom:10px;display:grid;gap:10px;">
            <div>
                <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:4px;font-weight:bold;">🏷️ Tên Ngân Hàng</label>
                <input type="text" id="skf-name" placeholder="Ví dụ: Ngân Hàng Lớp 10A1" maxlength="48" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;">
            </div>
            <div>
                <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:4px;font-weight:bold;">💰 Địa chỉ Coin tiết kiệm (ERC-20)</label>
                <input type="text" id="skf-token" placeholder="0x... (ví dụ: ClassCoin)" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;outline:none;">
            </div>
            <div>
                <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:4px;font-weight:bold;">📈 Lãi suất (Coin / ngày / 100 Coin gửi)</label>
                <input type="text" id="skf-rate" placeholder="Ví dụ: 5 (tức 5% / ngày)" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;">
            </div>
            <div>
                <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:4px;font-weight:bold;">🔒 Thời gian khóa gốc (Phút)</label>
                <input type="text" id="skf-lock" placeholder="Ví dụ: 5" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;">
                <div style="font-size:10px;color:#10b981;margin-top:4px;">💡 Thời gian tối thiểu học sinh phải gửi mới được rút gốc. Gửi thêm sẽ đếm lại từ đầu.</div>
            </div>
        </div>

        <button id="skf-create-btn" style="width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#059669,#10b981);color:white;font-size:15px;font-weight:800;cursor:pointer;letter-spacing:1px;">🏦 TẠO NGÂN HÀNG</button>
        <div id="skf-status" style="margin-top:10px;font-size:12px;text-align:center;color:#94a3b8;min-height:20px;"></div>

        <div id="skf-result" style="display:none;margin-top:12px;background:#0f2a1a;border:1px solid #10b981;border-radius:12px;padding:15px;">
            <div style="font-size:14px;font-weight:bold;color:#10b981;margin-bottom:8px;">🎉 Ngân Hàng đã khai trương!</div>
            <div style="font-size:11px;color:#94a3b8;margin-bottom:4px;">Tên: <span id="skf-result-name" style="color:#e2e8f0;font-weight:bold;"></span></div>
            <div style="font-size:11px;color:#94a3b8;margin-bottom:8px;">Địa chỉ Ngân Hàng:</div>
            <div id="skf-result-address" style="background:#1e293b;padding:10px;border-radius:8px;font-size:12px;color:#10b981;word-break:break-all;cursor:pointer;text-align:center;" title="Bấm để copy"></div>
            <div style="text-align:center;margin-top:6px;">
                <a id="skf-result-link" href="#" target="_blank" style="color:#10b981;font-size:11px;text-decoration:underline;">🔗 Xem trên Etherscan</a>
            </div>

            <div style="margin-top:14px;padding:12px;background:#1e293b;border-radius:10px;border:1px solid #334155;">
                <div style="font-size:12px;color:#fbbf24;font-weight:bold;margin-bottom:8px;">⚠️ BƯỚC 2: NẠP QUỸ DỰ TRỮ TRẢ LÃI</div>
                <p style="font-size:10px;color:#94a3b8;margin-bottom:8px;line-height:1.4;">Hãy nạp Coin vào Ngân Hàng để hệ thống có tiền trả lãi cho học sinh. Nếu quỹ hết, học sinh sẽ không rút được lãi!</p>
                <div style="display:flex;gap:8px;">
                    <input type="text" id="skf-fund-amount" placeholder="Số Coin nạp (VD: 10000)" style="flex:1;background:#0f172a;color:#fff;border:1px solid #334155;padding:10px;border-radius:8px;font-size:12px;">
                    <button id="skf-fund-btn" style="background:linear-gradient(135deg,#f59e0b,#d97706);color:white;border:none;padding:10px 16px;border-radius:8px;font-size:12px;font-weight:bold;cursor:pointer;white-space:nowrap;">💰 NẠP QUỸ</button>
                </div>
                <div id="skf-fund-status" style="margin-top:6px;font-size:11px;text-align:center;color:#94a3b8;"></div>
                <div style="margin-top:8px;font-size:11px;color:#94a3b8;">Quỹ dự trữ hiện tại: <b id="skf-pool-balance" style="color:#10b981;">---</b> Coin</div>
            </div>

            <div style="margin-top:10px;padding:8px;background:#1e293b;border-radius:8px;font-size:10px;color:#6ee7b7;text-align:center;">
                💡 Copy địa chỉ Ngân Hàng gửi cho học sinh → Dán vào khối <strong>Sổ Tiết Kiệm</strong> để bắt đầu gửi Coin!
            </div>
        </div>

        <div id="skf-history" style="margin-top:12px;">
            <div style="font-size:12px;color:#64748b;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;">
                <span>📜 Ngân Hàng đã tạo trước đó:</span>
                <button id="skf-load-history" style="background:none;border:1px solid #334155;color:#94a3b8;padding:3px 8px;border-radius:6px;font-size:10px;cursor:pointer;">Tải lịch sử</button>
            </div>
            <div id="skf-history-list" style="font-size:11px;color:#94a3b8;"></div>
        </div>
    </div>`,

    engineCode: () => `
        const STAKING_FACTORY_ADDR = '${FACTORY_ADDRESSES.STAKING_FACTORY || '0x0000000000000000000000000000000000000000'}';
        const STAKING_FACTORY_ABI = [
            "function createStaking(string _name, address _stakingToken, uint256 _rewardRatePerDay, uint256 _minLockTime) external returns (address)",
            "event StakingCreated(address indexed stakingAddress, string name, address indexed owner, address stakingToken, uint256 rewardRate, uint256 minLockTime)"
        ];
        const STAKING_ABI_FUND = [
            "function fundRewards(uint256 _amount) external",
            "function getRewardBalance() view returns (uint256)"
        ];

        let _skfBankAddr = null;

        const _skfBtn = document.getElementById('skf-create-btn');
        const _skfStatus = document.getElementById('skf-status');
        const _skfResult = document.getElementById('skf-result');

        if (_skfBtn) {
            document.getElementById('skf-result-address').addEventListener('click', function() {
                navigator.clipboard.writeText(this.innerText).then(function(){
                    toast('success', '📋 Đã copy địa chỉ Ngân Hàng!');
                });
            });

            _skfBtn.addEventListener('click', async function() {
                if (!signer) { toast('error', 'Kết nối ví trước!'); return; }
                var name = document.getElementById('skf-name').value.trim();
                var tokenAddr = document.getElementById('skf-token').value.trim();
                var rateStr = document.getElementById('skf-rate').value.trim();
                var lockMinStr = document.getElementById('skf-lock').value.trim();

                if (!name) { toast('error', 'Nhập tên Ngân Hàng!'); return; }
                if (!tokenAddr || tokenAddr.length !== 42) { toast('error', 'Nhập địa chỉ Coin ERC-20 hợp lệ!'); return; }
                if (!rateStr || isNaN(rateStr) || parseFloat(rateStr) <= 0) { toast('error', 'Nhập lãi suất hợp lệ (> 0)!'); return; }
                if (!lockMinStr || isNaN(lockMinStr) || parseInt(lockMinStr) < 0) { toast('error', 'Nhập thời gian khóa hợp lệ (>= 0)!'); return; }

                try {
                    _skfBtn.disabled = true; _skfBtn.style.opacity = '0.5';
                    _skfStatus.innerHTML = '<span style="color:#10b981;">⏳ Đang tạo Ngân Hàng... (Xác nhận MetaMask)</span>';
                    _skfResult.style.display = 'none';

                    var rateWei = ethers.utils.parseEther(rateStr);
                    var lockSec = parseInt(lockMinStr) * 60;
                    var factory = new ethers.Contract(STAKING_FACTORY_ADDR, STAKING_FACTORY_ABI, signer);
                    var tx = await factory.createStaking(name, tokenAddr, rateWei, lockSec);
                    _skfStatus.innerHTML = '<span style="color:#10b981;">⛏️ Đang đợi Blockchain xác nhận...</span>';
                    var receipt = await tx.wait();

                    var bankAddr = null;
                    for (var i = 0; i < receipt.logs.length; i++) {
                        try {
                            var parsed = factory.interface.parseLog(receipt.logs[i]);
                            if (parsed.name === 'StakingCreated') {
                                bankAddr = parsed.args.stakingAddress;
                                break;
                            }
                        } catch(e) {}
                    }
                    if (!bankAddr) throw new Error('Không tìm thấy địa chỉ Ngân Hàng trong transaction.');

                    _skfBankAddr = bankAddr;
                    var scanBase = 'https://sepolia.etherscan.io/address/';
                    document.getElementById('skf-result-name').innerText = name;
                    document.getElementById('skf-result-address').innerText = bankAddr;
                    document.getElementById('skf-result-link').href = scanBase + bankAddr;
                    _skfResult.style.display = 'block';
                    _skfStatus.innerHTML = '<span style="color:#10b981;">✅ Ngân Hàng <strong>' + name + '</strong> đã khai trương!</span>';
                    toast('success', '🎉 Tạo thành công Ngân Hàng Tiết Kiệm!');
                } catch(e) {
                    var msg = e.reason || e.message || 'Lỗi';
                    if (msg.includes('user rejected')) msg = 'Bạn đã từ chối giao dịch!';
                    _skfStatus.innerHTML = '<span style="color:#ef4444;">❌ ' + msg.substring(0,80) + '</span>';
                } finally {
                    _skfBtn.disabled = false; _skfBtn.style.opacity = '1';
                }
            });

            // Nút nạp quỹ dự trữ
            document.getElementById('skf-fund-btn').addEventListener('click', async function() {
                if (!signer) { toast('error', 'Kết nối ví trước!'); return; }
                var bankAddr = _skfBankAddr || document.getElementById('skf-result-address').innerText;
                if (!bankAddr || bankAddr.length !== 42) { toast('error', 'Tạo Ngân Hàng trước!'); return; }
                var amt = document.getElementById('skf-fund-amount').value.trim();
                if (!amt || isNaN(amt) || parseFloat(amt) <= 0) { toast('error', 'Nhập số Coin hợp lệ!'); return; }

                var btn = this; var fundStatus = document.getElementById('skf-fund-status');
                try {
                    btn.disabled = true;
                    // Bước 1: Approve
                    btn.innerText = '🔑 Approve...';
                    fundStatus.innerHTML = '<span style="color:#f59e0b;">Ủy quyền Coin...</span>';
                    var tokenAddr = document.getElementById('skf-token').value.trim();
                    var token = new ethers.Contract(tokenAddr, [
                        "function approve(address, uint256)",
                        "function allowance(address, address) view returns (uint256)"
                    ], signer);
                    var amtWei = ethers.utils.parseEther(amt);
                    var user = await signer.getAddress();
                    var allowed = await token.allowance(user, bankAddr);
                    if (allowed.lt(amtWei)) {
                        var txA = await token.approve(bankAddr, amtWei);
                        await txA.wait();
                    }
                    // Bước 2: Fund
                    btn.innerText = '⏳ Nạp quỹ...';
                    fundStatus.innerHTML = '<span style="color:#f59e0b;">Đang nạp vào quỹ dự trữ...</span>';
                    var bank = new ethers.Contract(bankAddr, STAKING_ABI_FUND, signer);
                    var tx = await bank.fundRewards(amtWei);
                    await tx.wait();

                    // Cập nhật quỹ
                    var pool = await bank.getRewardBalance();
                    document.getElementById('skf-pool-balance').innerText = ethers.utils.formatEther(pool);

                    fundStatus.innerHTML = '<span style="color:#10b981;">✅ Đã nạp ' + amt + ' Coin vào quỹ!</span>';
                    toast('success', '💰 Nạp quỹ thành công!');
                    btn.innerText = '💰 NẠP QUỸ'; btn.disabled = false;
                } catch(e) {
                    btn.innerText = '💰 NẠP QUỸ'; btn.disabled = false;
                    fundStatus.innerHTML = '<span style="color:#ef4444;">❌ ' + (e.reason||e.message||'Lỗi').substring(0,60) + '</span>';
                }
            });

            // Tải lịch sử
            document.getElementById('skf-load-history').addEventListener('click', async function() {
                if (!signer) { toast('error', 'Kết nối ví trước!'); return; }
                var histList = document.getElementById('skf-history-list');
                histList.innerHTML = '<span style="color:#10b981;">⏳ Đang quét...</span>';
                try {
                    var factory = new ethers.Contract(STAKING_FACTORY_ADDR, STAKING_FACTORY_ABI, provider);
                    var filter = factory.filters.StakingCreated(null, null, userAddr);
                    var events = await factory.queryFilter(filter, 0, 'latest');
                    if (events.length === 0) {
                        histList.innerHTML = '<span style="color:#64748b;">Chưa tạo Ngân Hàng nào.</span>'; return;
                    }
                    var html = '';
                    for (var i = 0; i < events.length; i++) {
                        var ev = events[i];
                        var addr = ev.args.stakingAddress;
                        var n = ev.args.name || '???';
                        html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 8px;background:#1e293b;border-radius:6px;margin-bottom:4px;">';
                        html += '<span style="color:#10b981;font-weight:bold;">🏦 ' + n + '</span>';
                        html += '<a href="https://sepolia.etherscan.io/address/' + addr + '" target="_blank" style="color:#6ee7b7;font-size:10px;">' + addr.substring(0,8) + '...' + addr.substring(36) + '</a>';
                        html += '</div>';
                    }
                    histList.innerHTML = html;
                } catch(e) {
                    histList.innerHTML = '<span style="color:#ef4444;">❌ ' + (e.message||'').substring(0,50) + '</span>';
                }
            });
        }
    `,
    bindings: []
}

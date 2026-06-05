// ==================== KHỐI: SỔ TIẾT KIỆM (STAKING DASHBOARD) ====================
export default {
    id: "staking-dashboard",
    name: "💰 Sổ Tiết Kiệm",
    desc: "Gửi Coin vào Ngân Hàng lấy lãi mỗi ngày. Thu hoạch lãi hoặc rút gốc bất cứ lúc nào.",
    color: "#10b981",
    label: "Sổ Tiết Kiệm",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#10b981;">
        <div class="khoi-title" style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
            <span style="font-size:24px;">💰</span>
            <span style="background:linear-gradient(135deg,#10b981,#34d399);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:16px;letter-spacing:1px;">SỔ TIẾT KIỆM</span>
        </div>
        <p style="font-size:11px;color:#cbd5e1;margin-bottom:12px;line-height:1.5;">Gửi Coin vào Ngân Hàng để nhận lãi suất mỗi ngày. Rút gốc hoặc thu hoạch lãi bất cứ lúc nào!</p>

        <div style="display:flex;gap:8px;margin-bottom:12px;">
            <input type="text" id="skd-bank" placeholder="🏦 Mã Ngân Hàng (0x...)" style="flex:1;background:#0f172a;color:#fff;border:1px solid #334155;padding:10px;border-radius:6px;font-size:11px;">
            <button id="skd-load-btn" style="background:#10b981;color:white;border:none;padding:10px 16px;border-radius:8px;font-size:12px;font-weight:bold;cursor:pointer;white-space:nowrap;">🔄 TẢI</button>
        </div>

        <div id="skd-info" style="display:none;">
            <div style="background:linear-gradient(135deg,#064e3b,#0f2a1a);border:1px solid #10b981;border-radius:14px;padding:16px;margin-bottom:12px;">
                <div style="font-size:13px;color:#6ee7b7;font-weight:bold;margin-bottom:10px;">🏦 <span id="skd-bank-name">---</span></div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
                    <div style="background:#0f172a;border-radius:8px;padding:10px;text-align:center;">
                        <div style="font-size:9px;color:#94a3b8;margin-bottom:4px;">💎 Loại Coin</div>
                        <div id="skd-coin-name" style="font-size:12px;color:#e2e8f0;font-weight:bold;">---</div>
                    </div>
                    <div style="background:#0f172a;border-radius:8px;padding:10px;text-align:center;">
                        <div style="font-size:9px;color:#94a3b8;margin-bottom:4px;">📈 Lãi suất</div>
                        <div id="skd-rate" style="font-size:12px;color:#fbbf24;font-weight:bold;">---</div>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
                    <div style="background:#0f172a;border-radius:8px;padding:10px;text-align:center;">
                        <div style="font-size:9px;color:#94a3b8;margin-bottom:4px;">🔒 Gốc đang gửi</div>
                        <div id="skd-staked" style="font-size:16px;color:#10b981;font-weight:900;">0</div>
                    </div>
                    <div style="background:#0f172a;border-radius:8px;padding:10px;text-align:center;">
                        <div style="font-size:9px;color:#94a3b8;margin-bottom:4px;">🌱 Lãi tích lũy</div>
                        <div id="skd-reward" style="font-size:16px;color:#fbbf24;font-weight:900;">0</div>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
                    <div style="background:#0f172a;border-radius:8px;padding:8px;text-align:center;">
                        <div style="font-size:9px;color:#94a3b8;margin-bottom:2px;">🏛️ Quỹ dự trữ</div>
                        <div id="skd-pool" style="font-size:11px;color:#64748b;font-weight:bold;">---</div>
                    </div>
                    <div style="background:#0f172a;border-radius:8px;padding:8px;text-align:center;">
                        <div style="font-size:9px;color:#94a3b8;margin-bottom:2px;">⏱️ Khóa gốc</div>
                        <div id="skd-lock-time" style="font-size:11px;color:#ef4444;font-weight:bold;">---</div>
                    </div>
                </div>
            </div>

            <div style="display:flex;gap:6px;margin-bottom:10px;border-bottom:1px solid #334155;padding-bottom:8px;">
                <button id="skd-tab-stake" class="skd-tab" style="flex:1;background:none;border:none;color:#10b981;font-size:11px;font-weight:bold;padding:6px;border-bottom:2px solid #10b981;cursor:pointer;">📥 GỬI</button>
                <button id="skd-tab-unstake" class="skd-tab" style="flex:1;background:none;border:none;color:#64748b;font-size:11px;font-weight:bold;padding:6px;border-bottom:2px solid transparent;cursor:pointer;">📤 RÚT GỐC</button>
            </div>

            <div id="skd-panel-stake">
                <div style="display:flex;gap:8px;margin-bottom:8px;">
                    <input type="text" id="skd-stake-amt" placeholder="Nhập số Coin muốn gửi..." style="flex:1;background:#0f172a;color:#fff;border:1px solid #334155;padding:10px;border-radius:8px;font-size:12px;">
                    <button id="skd-stake-btn" style="background:linear-gradient(135deg,#059669,#10b981);color:white;border:none;padding:10px 16px;border-radius:8px;font-size:12px;font-weight:bold;cursor:pointer;white-space:nowrap;">📥 GỬI</button>
                </div>
            </div>

            <div id="skd-panel-unstake" style="display:none;">
                <div id="skd-unstake-locked" style="display:none;background:#7f1d1d;border:1px solid #ef4444;border-radius:8px;padding:10px;text-align:center;margin-bottom:8px;">
                    <div style="font-size:11px;color:#fca5a5;margin-bottom:4px;">🔒 Gốc đang bị khóa. Bạn có thể rút sau:</div>
                    <div id="skd-unstake-countdown" style="font-size:16px;color:#f87171;font-weight:bold;letter-spacing:2px;">00:00</div>
                </div>
                <div id="skd-unstake-form" style="display:flex;gap:8px;margin-bottom:8px;">
                    <input type="text" id="skd-unstake-amt" placeholder="Nhập số Coin muốn rút..." style="flex:1;background:#0f172a;color:#fff;border:1px solid #334155;padding:10px;border-radius:8px;font-size:12px;">
                    <button id="skd-unstake-btn" style="background:linear-gradient(135deg,#dc2626,#ef4444);color:white;border:none;padding:10px 16px;border-radius:8px;font-size:12px;font-weight:bold;cursor:pointer;white-space:nowrap;">📤 RÚT</button>
                </div>
            </div>

            <div style="display:flex;gap:6px;margin-top:4px;">
                <button id="skd-claim-btn" style="flex:1;padding:12px;border-radius:10px;border:none;background:linear-gradient(135deg,#f59e0b,#fbbf24);color:#1e293b;font-size:13px;font-weight:900;cursor:pointer;letter-spacing:1px;">🌾 THU HOẠCH</button>
                <button id="skd-compound-btn" style="flex:1;padding:12px;border-radius:10px;border:none;background:linear-gradient(135deg,#8b5cf6,#a855f7);color:#fff;font-size:13px;font-weight:900;cursor:pointer;letter-spacing:1px;">♻️ GỘP LÃI</button>
            </div>

            <div style="background:#1e293b;border-radius:10px;padding:10px;margin-top:8px;border:1px solid #334155;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <span style="font-size:12px;color:#e2e8f0;font-weight:bold;">🤖 Bật Bot Tự Gộp Lãi</span>
                    <label class="switch" style="position:relative;display:inline-block;width:34px;height:20px;">
                        <input type="checkbox" id="skd-bot-toggle" style="opacity:0;width:0;height:0;">
                        <span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s;border-radius:34px;"></span>
                        <style>
                            .switch input:checked + span { background-color: #10b981; }
                            .switch span:before { position:absolute;content:"";height:14px;width:14px;left:3px;bottom:3px;background-color:white;transition:.4s;border-radius:50%; }
                            .switch input:checked + span:before { transform: translateX(14px); }
                        </style>
                    </label>
                </div>
                <div id="skd-bot-settings" style="display:none;gap:6px;align-items:center;">
                    <input type="text" id="skd-bot-interval" placeholder="Phút..." value="5" style="width:50px;background:#0f172a;color:#fff;border:1px solid #475569;border-radius:6px;padding:6px;font-size:11px;text-align:center;">
                    <div style="font-size:10px;color:#94a3b8;flex:1;line-height:1.4;">Phút. Tự động gọi lệnh sau mỗi <span id="skd-bot-txt">5</span> phút (Cần xác nhận)</div>
                </div>
                <div id="skd-bot-countdown" style="display:none;font-size:11px;color:#8b5cf6;text-align:center;margin-top:6px;font-weight:bold;">⏳ Đang chờ chạy Bot... 00:00</div>
            </div>

            <div id="skd-action-status" style="margin-top:8px;font-size:11px;text-align:center;color:#94a3b8;min-height:18px;"></div>
        </div>
    </div>`,

    engineCode: () => `
    const STAKING_DASH_ABI = [
        "function getStakingInfo() view returns (string _bankName, address _stakingToken, uint256 _rewardRatePerDay, uint256 _totalStaked, uint256 _rewardPool, uint256 _minLockTime, address _owner)",
        "function stakedBalance(address) view returns (uint256)",
        "function earned(address) view returns (uint256)",
        "function stake(uint256 _amount) external",
        "function withdraw(uint256 _amount) external",
        "function claimReward() external",
        "function compoundReward() external",
        "function getRewardBalance() view returns (uint256)",
        "function rewardRatePerDay() view returns (uint256)",
        "function depositTime(address) view returns (uint256)"
    ];
    const ERC20_INFO_ABI = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function approve(address, uint256)",
        "function allowance(address, address) view returns (uint256)"
    ];

    let _skdRewardTimer = null;
    let _skdBankAddr = '';
    let _skdTokenAddr = '';
    let _skdRate = ethers.BigNumber.from(0);
    let _skdMyStaked = ethers.BigNumber.from(0);
    let _skdLastEarned = 0;
    let _skdLastEarnedTime = 0;
    let _skdLockTimer = null;

    // Tab switching
    const tabStake = document.getElementById('skd-tab-stake');
    const tabUnstake = document.getElementById('skd-tab-unstake');
    if (tabStake && tabUnstake) {
        tabStake.addEventListener('click', function() {
            this.style.color = '#10b981'; this.style.borderBottomColor = '#10b981';
            tabUnstake.style.color = '#64748b'; tabUnstake.style.borderBottomColor = 'transparent';
            document.getElementById('skd-panel-stake').style.display = '';
            document.getElementById('skd-panel-unstake').style.display = 'none';
        });
        tabUnstake.addEventListener('click', function() {
            this.style.color = '#10b981'; this.style.borderBottomColor = '#10b981';
            tabStake.style.color = '#64748b'; tabStake.style.borderBottomColor = 'transparent';
            document.getElementById('skd-panel-stake').style.display = 'none';
            document.getElementById('skd-panel-unstake').style.display = '';
        });
    }

    async function loadStakingDash() {
        if(!signer){toast('error','Kết nối Ví trước!');return;}
        var bankAddr = document.getElementById('skd-bank').value.trim();
        if(!bankAddr || bankAddr.length !== 42) { toast('error','Nhập mã Ngân Hàng hợp lệ!'); return; }
        _skdBankAddr = bankAddr;
        var loadBtn = document.getElementById('skd-load-btn');

        try {
            loadBtn.disabled = true; loadBtn.innerText = '⏳ Tải...';
            var bank = new ethers.Contract(bankAddr, STAKING_DASH_ABI, signer);
            var info = await bank.getStakingInfo();

            // Lấy tên Coin
            var coinName = '???';
            _skdTokenAddr = info._stakingToken;
            try {
                var tokenC = new ethers.Contract(info._stakingToken, ERC20_INFO_ABI, signer);
                coinName = await tokenC.symbol();
            } catch(e) { coinName = info._stakingToken.substring(0,8) + '...'; }

            // Hiển thị thông tin ngân hàng
            document.getElementById('skd-bank-name').innerText = info._bankName;
            document.getElementById('skd-coin-name').innerText = coinName;
            var rateNum = parseFloat(ethers.utils.formatEther(info._rewardRatePerDay));
            _skdRate = info._rewardRatePerDay;
            document.getElementById('skd-rate').innerText = rateNum + ' ' + coinName + ' / ngày / 100';
            document.getElementById('skd-pool').innerText = parseFloat(ethers.utils.formatEther(info._rewardPool)).toFixed(2) + ' ' + coinName;
            
            var lockSecs = info._minLockTime.toNumber();
            document.getElementById('skd-lock-time').innerText = lockSecs > 0 ? (lockSecs/60) + ' phút' : 'Không khóa';

            // Lấy thông tin cá nhân
            var myAddr = await signer.getAddress();
            var staked = await bank.stakedBalance(myAddr);
            var earned = await bank.earned(myAddr);
            var depTime = await bank.depositTime(myAddr);
            
            _skdMyStaked = staked;
            _skdLastEarned = parseFloat(ethers.utils.formatEther(earned));
            _skdLastEarnedTime = Date.now();

            document.getElementById('skd-staked').innerText = parseFloat(ethers.utils.formatEther(staked)).toFixed(4);

            // Đồng hồ khóa gốc
            if (_skdLockTimer) clearInterval(_skdLockTimer);
            if (staked.gt(0) && lockSecs > 0) {
                _skdLockTimer = setInterval(function() {
                    var nowSec = Math.floor(Date.now() / 1000);
                    var unlockTime = depTime.toNumber() + lockSecs;
                    var diff = unlockTime - nowSec;
                    if (diff > 0) {
                        document.getElementById('skd-unstake-locked').style.display = '';
                        document.getElementById('skd-unstake-form').style.display = 'none';
                        var m = Math.floor(diff / 60);
                        var s = diff % 60;
                        document.getElementById('skd-unstake-countdown').innerText = (m<10?'0'+m:m) + ':' + (s<10?'0'+s:s);
                    } else {
                        document.getElementById('skd-unstake-locked').style.display = 'none';
                        document.getElementById('skd-unstake-form').style.display = 'flex';
                        clearInterval(_skdLockTimer);
                    }
                }, 1000);
            } else {
                document.getElementById('skd-unstake-locked').style.display = 'none';
                document.getElementById('skd-unstake-form').style.display = 'flex';
            }

            // Bắt đầu đồng hồ đếm lãi (nhảy số liên tục)
            if (_skdRewardTimer) clearInterval(_skdRewardTimer);
            _skdRewardTimer = setInterval(function() {
                var elapsed = (Date.now() - _skdLastEarnedTime) / 1000; // giây
                var stakedFloat = parseFloat(ethers.utils.formatEther(_skdMyStaked));
                var rateFloat = parseFloat(ethers.utils.formatEther(_skdRate));
                var newReward = _skdLastEarned + (stakedFloat * rateFloat * elapsed) / (100 * 86400);
                document.getElementById('skd-reward').innerText = newReward.toFixed(6);
            }, 100); // Cập nhật 10 lần / giây cho mượt

            document.getElementById('skd-info').style.display = '';
            loadBtn.innerText = '🔄 TẢI'; loadBtn.disabled = false;
            toast('success', '✅ Đã tải sổ tiết kiệm!');
        } catch(e) {
            loadBtn.innerText = '🔄 TẢI'; loadBtn.disabled = false;
            toast('error', e.reason || e.message || 'Lỗi tải dữ liệu!');
        }
    }

    // GỬI (Stake)
    document.getElementById('skd-stake-btn').addEventListener('click', async function() {
        if(!signer){toast('error','Kết nối Ví!');return;}
        if(!_skdBankAddr) { toast('error','Tải dữ liệu Ngân Hàng trước!'); return; }
        var amt = document.getElementById('skd-stake-amt').value.trim();
        if(!amt || isNaN(amt) || parseFloat(amt) <= 0) { toast('error','Nhập số Coin hợp lệ!'); return; }
        var btn = this; var status = document.getElementById('skd-action-status');
        try {
            btn.disabled = true;
            var amtWei = ethers.utils.parseEther(amt);

            // Approve
            btn.innerText = '🔑 Approve...';
            status.innerHTML = '<span style="color:#f59e0b;">Ủy quyền Coin...</span>';
            var token = new ethers.Contract(_skdTokenAddr, ERC20_INFO_ABI, signer);
            var user = await signer.getAddress();
            var allowed = await token.allowance(user, _skdBankAddr);
            if(allowed.lt(amtWei)) {
                var txA = await token.approve(_skdBankAddr, amtWei);
                await txA.wait();
            }

            // Stake
            btn.innerText = '⏳ Gửi...';
            status.innerHTML = '<span style="color:#10b981;">Đang gửi Coin vào Ngân Hàng...</span>';
            var bank = new ethers.Contract(_skdBankAddr, STAKING_DASH_ABI, signer);
            var tx = await bank.stake(amtWei);
            await tx.wait();

            toast('success', '📥 Đã gửi ' + amt + ' Coin vào Ngân Hàng!');
            status.innerHTML = '<span style="color:#10b981;">✅ Gửi thành công!</span>';
            btn.innerText = '📥 GỬI'; btn.disabled = false;
            document.getElementById('skd-stake-amt').value = '';
            await loadStakingDash();
        } catch(e) {
            btn.innerText = '📥 GỬI'; btn.disabled = false;
            status.innerHTML = '<span style="color:#ef4444;">❌ ' + (e.reason||e.message||'Lỗi').substring(0,60) + '</span>';
        }
    });

    // RÚT GỐC (Withdraw)
    document.getElementById('skd-unstake-btn').addEventListener('click', async function() {
        if(!signer){toast('error','Kết nối Ví!');return;}
        if(!_skdBankAddr) { toast('error','Tải dữ liệu Ngân Hàng trước!'); return; }
        var amt = document.getElementById('skd-unstake-amt').value.trim();
        if(!amt || isNaN(amt) || parseFloat(amt) <= 0) { toast('error','Nhập số Coin hợp lệ!'); return; }
        var btn = this; var status = document.getElementById('skd-action-status');
        try {
            btn.disabled = true; btn.innerText = '⏳ Rút...';
            status.innerHTML = '<span style="color:#f59e0b;">Đang rút gốc...</span>';
            var amtWei = ethers.utils.parseEther(amt);
            var bank = new ethers.Contract(_skdBankAddr, STAKING_DASH_ABI, signer);
            var tx = await bank.withdraw(amtWei);
            await tx.wait();

            toast('success', '📤 Đã rút ' + amt + ' Coin gốc về ví!');
            status.innerHTML = '<span style="color:#10b981;">✅ Rút gốc thành công!</span>';
            btn.innerText = '📤 RÚT'; btn.disabled = false;
            document.getElementById('skd-unstake-amt').value = '';
            await loadStakingDash();
        } catch(e) {
            btn.innerText = '📤 RÚT'; btn.disabled = false;
            status.innerHTML = '<span style="color:#ef4444;">❌ ' + (e.reason||e.message||'Lỗi').substring(0,60) + '</span>';
        }
    });

    // THU HOẠCH LÃI (Claim)
    document.getElementById('skd-claim-btn').addEventListener('click', async function() {
        if(!signer){toast('error','Kết nối Ví!');return;}
        if(!_skdBankAddr) { toast('error','Tải dữ liệu Ngân Hàng trước!'); return; }
        var btn = this; var status = document.getElementById('skd-action-status');
        try {
            btn.disabled = true; btn.innerText = '⏳ Thu hoạch...';
            status.innerHTML = '<span style="color:#fbbf24;">Đang thu hoạch lãi...</span>';
            var bank = new ethers.Contract(_skdBankAddr, STAKING_DASH_ABI, signer);
            var tx = await bank.claimReward();
            await tx.wait();

            toast('success', '🌾 Thu hoạch lãi thành công! Coin đã về ví!');
            status.innerHTML = '<span style="color:#10b981;">✅ Thu hoạch thành công!</span>';
            btn.innerText = '🌾 THU HOẠCH'; btn.disabled = false;
            await loadStakingDash();
        } catch(e) {
            btn.innerText = '🌾 THU HOẠCH'; btn.disabled = false;
            var msg = e.reason || e.message || 'Lỗi';
            if (msg.includes('Quy du tru')) msg = 'Quỹ dự trữ Ngân Hàng hết rồi! Báo Giáo viên nạp thêm!';
            if (msg.includes('Chua co lai')) msg = 'Chưa có lãi để thu hoạch! Hãy gửi Coin trước.';
            status.innerHTML = '<span style="color:#ef4444;">❌ ' + msg.substring(0,80) + '</span>';
        }
    });

    // GỘP LÃI VÀO GỐC (Compound)
    document.getElementById('skd-compound-btn').addEventListener('click', async function() {
        if(!signer){toast('error','Kết nối Ví!');return;}
        if(!_skdBankAddr) { toast('error','Tải dữ liệu Ngân Hàng trước!'); return; }
        var btn = this; var status = document.getElementById('skd-action-status');
        try {
            btn.disabled = true; btn.innerText = '⏳ Gộp...';
            status.innerHTML = '<span style="color:#8b5cf6;">Đang gộp lãi vào gốc...</span>';
            var bank = new ethers.Contract(_skdBankAddr, STAKING_DASH_ABI, signer);
            var tx = await bank.compoundReward();
            await tx.wait();

            toast('success', '♻️ Gộp lãi thành công! Lãi kép bắt đầu đẻ!');
            status.innerHTML = '<span style="color:#10b981;">✅ Gộp lãi thành công!</span>';
            btn.innerText = '♻️ GỘP LÃI'; btn.disabled = false;
            await loadStakingDash();
        } catch(e) {
            btn.innerText = '♻️ GỘP LÃI'; btn.disabled = false;
            var msg = e.reason || e.message || 'Lỗi';
            if (msg.includes('Quy du tru')) msg = 'Quỹ dự trữ Ngân Hàng hết! Báo GV nạp thêm!';
            if (msg.includes('Chua co lai')) msg = 'Chưa có lãi để gộp!';
            status.innerHTML = '<span style="color:#ef4444;">❌ ' + msg.substring(0,80) + '</span>';
        }
    });

    // BOT JS TỰ ĐỘNG GỘP
    let _skdBotTimer = null;
    let _skdBotIntervalSec = 0;
    let _skdBotTimeLeft = 0;

    document.getElementById('skd-bot-toggle').addEventListener('change', function(e) {
        if(e.target.checked) {
            document.getElementById('skd-bot-settings').style.display = 'flex';
            var min = parseInt(document.getElementById('skd-bot-interval').value) || 5;
            document.getElementById('skd-bot-txt').innerText = min;
            _skdBotIntervalSec = min * 60;
            _skdBotTimeLeft = _skdBotIntervalSec;
            document.getElementById('skd-bot-countdown').style.display = 'block';
            
            _skdBotTimer = setInterval(function() {
                if(!_skdBankAddr) return;
                _skdBotTimeLeft--;
                var m = Math.floor(_skdBotTimeLeft / 60);
                var s = _skdBotTimeLeft % 60;
                document.getElementById('skd-bot-countdown').innerText = '⏳ Tự gộp sau: ' + (m<10?'0'+m:m) + ':' + (s<10?'0'+s:s);
                
                if(_skdBotTimeLeft <= 0) {
                    _skdBotTimeLeft = _skdBotIntervalSec; // reset timer immediately
                    document.getElementById('skd-bot-countdown').innerText = '🤖 Bot đang chạy lệnh gộp...';
                    document.getElementById('skd-compound-btn').click(); // Auto click compound
                }
            }, 1000);
            toast('info', '🤖 Đã bật Bot Gộp Lãi Tự Động!');
        } else {
            document.getElementById('skd-bot-settings').style.display = 'none';
            document.getElementById('skd-bot-countdown').style.display = 'none';
            if(_skdBotTimer) clearInterval(_skdBotTimer);
            toast('info', 'Đã tắt Bot!');
        }
    });

    document.getElementById('skd-bot-interval').addEventListener('input', function(e) {
        var min = parseInt(e.target.value) || 5;
        document.getElementById('skd-bot-txt').innerText = min;
        if(document.getElementById('skd-bot-toggle').checked) {
            _skdBotIntervalSec = min * 60;
            _skdBotTimeLeft = _skdBotIntervalSec;
        }
    });
    `,
    bindings: [{ btn: "skd-load-btn", fn: "loadStakingDash" }]
}

// ==================== KHỐI: CỔNG ĐẦU TƯ QUỸ (LIQUID STAKING) ====================
export default {
    id: "liquid-dashboard",
    name: "💸 Cổng Đầu Tư Quỹ",
    desc: "Mua Chứng Chỉ Quỹ (sCoin) bằng Coin Cơ Sở. Chờ tỷ giá tăng và bán lại để chốt lời (Chuẩn ERC-4626).",
    color: "#6366f1",
    label: "Cổng Đầu Tư Quỹ",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#6366f1;">
        <div class="khoi-title" style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
            <span style="font-size:24px;">💸</span>
            <span style="background:linear-gradient(135deg,#6366f1,#818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:16px;letter-spacing:1px;">CỔNG ĐẦU TƯ</span>
        </div>
        <p style="font-size:11px;color:#cbd5e1;margin-bottom:12px;line-height:1.5;">Gửi Coin để mua Chứng Chỉ Quỹ. Càng nhiều lợi nhuận đổ vào Quỹ, Chứng Chỉ của bạn càng có giá!</p>

        <div style="display:flex;gap:8px;margin-bottom:12px;">
            <input type="text" id="lqd-vault" placeholder="🏛️ Mã Quỹ Đầu Tư (0x...)" style="flex:1;background:#0f172a;color:#fff;border:1px solid #334155;padding:10px;border-radius:6px;font-size:11px;">
            <button id="lqd-load-btn" style="background:#6366f1;color:white;border:none;padding:10px 16px;border-radius:8px;font-size:12px;font-weight:bold;cursor:pointer;white-space:nowrap;">🔄 TẢI</button>
        </div>

        <div id="lqd-info" style="display:none;">
            <!-- WALL STREET DISPLAY -->
            <div style="background:linear-gradient(135deg,#1e1b4b,#312e81);border:2px solid #6366f1;border-radius:14px;padding:16px;margin-bottom:12px;text-align:center;box-shadow:0 4px 15px rgba(99,102,241,0.2);">
                <div style="font-size:11px;color:#a5b4fc;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px;" id="lqd-vault-name">TÊN QUỸ</div>
                <div style="font-size:24px;color:#fff;font-weight:900;margin-bottom:8px;text-shadow:0 2px 4px rgba(0,0,0,0.5);">1 <span id="lqd-sym1" style="color:#818cf8;">sCOIN</span> = <span id="lqd-rate" style="color:#10b981;">1.00</span> <span id="lqd-base1" style="color:#fbbf24;">COIN</span></div>
                <div style="font-size:10px;color:#818cf8;background:#3730a3;padding:4px 8px;border-radius:12px;display:inline-block;">📈 Tỷ giá tự động cập nhật khi Quỹ có lãi</div>
            </div>

            <!-- SỐ DƯ -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
                <div style="background:#0f172a;border-radius:8px;padding:10px;text-align:center;border:1px solid #1e293b;">
                    <div style="font-size:9px;color:#94a3b8;margin-bottom:4px;">💰 Ví chứa (Coin)</div>
                    <div id="lqd-bal-base" style="font-size:14px;color:#fbbf24;font-weight:bold;">0.00</div>
                </div>
                <div style="background:#0f172a;border-radius:8px;padding:10px;text-align:center;border:1px solid #1e293b;">
                    <div style="font-size:9px;color:#94a3b8;margin-bottom:4px;">📜 Bạn đang sở hữu</div>
                    <div style="font-size:14px;color:#818cf8;font-weight:bold;"><span id="lqd-bal-shares">0.00</span> <span id="lqd-sym2" style="font-size:10px;">sCOIN</span></div>
                </div>
            </div>

            <div style="background:#0f172a;border-radius:8px;padding:8px;text-align:center;margin-bottom:12px;border:1px solid #1e293b;">
                <div style="font-size:9px;color:#94a3b8;margin-bottom:2px;">Tổng quy đổi hiện tại:</div>
                <div style="font-size:12px;color:#10b981;font-weight:bold;"><span id="lqd-worth">0.00</span> <span id="lqd-base2">COIN</span></div>
            </div>

            <!-- TABS -->
            <div style="display:flex;gap:6px;margin-bottom:10px;border-bottom:1px solid #334155;padding-bottom:8px;">
                <button id="lqd-tab-deposit" style="flex:1;background:none;border:none;color:#6366f1;font-size:11px;font-weight:bold;padding:6px;border-bottom:2px solid #6366f1;cursor:pointer;">📥 MUA CHỨNG CHỈ</button>
                <button id="lqd-tab-redeem" style="flex:1;background:none;border:none;color:#64748b;font-size:11px;font-weight:bold;padding:6px;border-bottom:2px solid transparent;cursor:pointer;">📤 BÁN CHỨNG CHỈ</button>
            </div>

            <!-- MUA CHỨNG CHỈ (Deposit) -->
            <div id="lqd-panel-deposit">
                <div style="font-size:10px;color:#94a3b8;margin-bottom:4px;">Nhập số <span id="lqd-base3" style="color:#fbbf24">Coin</span> muốn nộp vào Quỹ:</div>
                <div style="display:flex;gap:8px;margin-bottom:8px;">
                    <input type="text" id="lqd-amt-dep" placeholder="Ví dụ: 100" style="flex:1;background:#0f172a;color:#fff;border:1px solid #334155;padding:10px;border-radius:8px;font-size:12px;">
                    <button id="lqd-btn-dep" style="background:linear-gradient(135deg,#4f46e5,#6366f1);color:white;border:none;padding:10px 16px;border-radius:8px;font-size:12px;font-weight:bold;cursor:pointer;white-space:nowrap;">📥 MUA</button>
                </div>
            </div>

            <!-- BÁN CHỨNG CHỈ (Redeem) -->
            <div id="lqd-panel-redeem" style="display:none;">
                <div id="lqd-lock-warning" style="display:none;background:#7f1d1d;color:#fca5a5;padding:8px;border-radius:8px;font-size:11px;text-align:center;margin-bottom:8px;border:1px solid #ef4444;">
                    ⏳ Chứng Chỉ đang bị khóa! Vui lòng chờ: <span id="lqd-lock-countdown" style="font-weight:bold;color:#fff;">00:00</span>
                </div>
                <div style="font-size:10px;color:#94a3b8;margin-bottom:4px;">Nhập số lượng <span id="lqd-sym3" style="color:#818cf8">Chứng Chỉ</span> muốn bán lại:</div>
                <div style="display:flex;gap:8px;margin-bottom:8px;">
                    <input type="text" id="lqd-amt-red" placeholder="Ví dụ: 50" style="flex:1;background:#0f172a;color:#fff;border:1px solid #334155;padding:10px;border-radius:8px;font-size:12px;">
                    <button id="lqd-btn-red" style="background:linear-gradient(135deg,#dc2626,#ef4444);color:white;border:none;padding:10px 16px;border-radius:8px;font-size:12px;font-weight:bold;cursor:pointer;white-space:nowrap;">📤 BÁN RÚT TIỀN</button>
                </div>
            </div>

            <div id="lqd-action-status" style="margin-top:8px;font-size:11px;text-align:center;color:#94a3b8;min-height:18px;"></div>
        </div>
    </div>`,

    engineCode: () => `
    var LQD_VAULT_ABI = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function asset() view returns (address)",
        "function balanceOf(address account) view returns (uint256)",
        "function convertToShares(uint256 assets) view returns (uint256)",
        "function convertToAssets(uint256 shares) view returns (uint256)",
        "function deposit(uint256 assets, address receiver) external returns (uint256)",
        "function redeem(uint256 shares, address receiver, address owner) external returns (uint256)",
        "function depositTime(address) view returns (uint256)",
        "function minLockTime() view returns (uint256)"
    ];
    var ERC20_INFO_ABI = [
        "function symbol() view returns (string)",
        "function balanceOf(address) view returns (uint256)",
        "function approve(address, uint256)",
        "function allowance(address, address) view returns (uint256)"
    ];

    var _lqdVaultAddr = '';
    var _lqdAssetAddr = '';
    var _lqdTimer = null;

    const tDep = document.getElementById('lqd-tab-deposit');
    const tRed = document.getElementById('lqd-tab-redeem');
    if (tDep && tRed) {
        tDep.addEventListener('click', function() {
            this.style.color = '#6366f1'; this.style.borderBottomColor = '#6366f1';
            tRed.style.color = '#64748b'; tRed.style.borderBottomColor = 'transparent';
            document.getElementById('lqd-panel-deposit').style.display = '';
            document.getElementById('lqd-panel-redeem').style.display = 'none';
        });
        tRed.addEventListener('click', function() {
            this.style.color = '#ef4444'; this.style.borderBottomColor = '#ef4444';
            tDep.style.color = '#64748b'; tDep.style.borderBottomColor = 'transparent';
            document.getElementById('lqd-panel-deposit').style.display = 'none';
            document.getElementById('lqd-panel-redeem').style.display = '';
        });
    }

    async function loadLiquidDash() {
        if(!signer){toast('error','Kết nối Ví trước!');return;}
        var vaultAddr = document.getElementById('lqd-vault').value.trim();
        if(!vaultAddr || vaultAddr.length !== 42) { toast('error','Nhập mã Quỹ hợp lệ!'); return; }
        _lqdVaultAddr = vaultAddr;
        var loadBtn = document.getElementById('lqd-load-btn');

        try {
            loadBtn.disabled = true; loadBtn.innerText = '⏳ Tải...';
            var vault = new ethers.Contract(vaultAddr, LQD_VAULT_ABI, signer);
            
            var vName = await vault.name();
            var vSym = await vault.symbol();
            _lqdAssetAddr = await vault.asset();

            var token = new ethers.Contract(_lqdAssetAddr, ERC20_INFO_ABI, signer);
            var bSym = await token.symbol();

            document.getElementById('lqd-vault-name').innerText = vName;
            
            // Cập nhật text UI
            ['lqd-sym1', 'lqd-sym2', 'lqd-sym3'].forEach(id => {
                if(document.getElementById(id)) document.getElementById(id).innerText = vSym;
            });
            ['lqd-base1', 'lqd-base2', 'lqd-base3'].forEach(id => {
                if(document.getElementById(id)) document.getElementById(id).innerText = bSym;
            });

            // Lấy tỷ giá 1 sCoin = ? Coin
            var oneShare = ethers.utils.parseEther("1");
            var rateWei = await vault.convertToAssets(oneShare);
            document.getElementById('lqd-rate').innerText = parseFloat(ethers.utils.formatEther(rateWei)).toFixed(4);

            // Số dư
            var myAddr = await signer.getAddress();
            var myBase = await token.balanceOf(myAddr);
            var myShares = await vault.balanceOf(myAddr);
            var myWorth = await vault.convertToAssets(myShares);

            document.getElementById('lqd-bal-base').innerText = parseFloat(ethers.utils.formatEther(myBase)).toFixed(2);
            document.getElementById('lqd-bal-shares').innerText = parseFloat(ethers.utils.formatEther(myShares)).toFixed(4);
            document.getElementById('lqd-worth').innerText = parseFloat(ethers.utils.formatEther(myWorth)).toFixed(4);

            // Xử lý đếm ngược
            var dTime = await vault.depositTime(myAddr);
            var mLock = await vault.minLockTime();
            var unlockTime = dTime.toNumber() + mLock.toNumber();
            
            if (_lqdTimer) clearInterval(_lqdTimer);
            _lqdTimer = setInterval(function() {
                var now = Math.floor(Date.now() / 1000);
                if (now < unlockTime) {
                    var left = unlockTime - now;
                    var m = Math.floor(left / 60);
                    var s = left % 60;
                    document.getElementById('lqd-lock-warning').style.display = 'block';
                    document.getElementById('lqd-lock-countdown').innerText = (m<10?'0'+m:m) + ':' + (s<10?'0'+s:s);
                    document.getElementById('lqd-btn-red').disabled = true;
                    document.getElementById('lqd-btn-red').style.opacity = '0.5';
                } else {
                    document.getElementById('lqd-lock-warning').style.display = 'none';
                    document.getElementById('lqd-btn-red').disabled = false;
                    document.getElementById('lqd-btn-red').style.opacity = '1';
                }
            }, 1000);

            document.getElementById('lqd-info').style.display = '';
            loadBtn.innerText = '🔄 TẢI LẠI'; loadBtn.disabled = false;
            toast('success', '✅ Đã tải thông tin Quỹ!');
        } catch(e) {
            loadBtn.innerText = '🔄 TẢI LẠI'; loadBtn.disabled = false;
            toast('error', 'Lỗi: ' + (e.reason || e.message).substring(0, 50));
        }
    }

    // MUA CHỨNG CHỈ (Deposit)
    document.getElementById('lqd-btn-dep').addEventListener('click', async function() {
        if(!signer){toast('error','Kết nối Ví!');return;}
        var amt = document.getElementById('lqd-amt-dep').value.trim();
        if(!amt || isNaN(amt) || parseFloat(amt) <= 0) { toast('error','Nhập số lượng hợp lệ!'); return; }
        
        var btn = this; var status = document.getElementById('lqd-action-status');
        try {
            btn.disabled = true;
            var amtWei = ethers.utils.parseEther(amt);

            // Approve
            btn.innerText = '🔑 Approve...';
            status.innerHTML = '<span style="color:#f59e0b;">Ủy quyền Coin Cơ Sở...</span>';
            var token = new ethers.Contract(_lqdAssetAddr, ERC20_INFO_ABI, signer);
            var user = await signer.getAddress();
            var allowed = await token.allowance(user, _lqdVaultAddr);
            if(allowed.lt(amtWei)) {
                var txA = await token.approve(_lqdVaultAddr, amtWei);
                await txA.wait();
            }

            // Deposit
            btn.innerText = '⏳ Đang Mua...';
            status.innerHTML = '<span style="color:#6366f1;">Đang gửi Coin để mua Chứng Chỉ...</span>';
            var vault = new ethers.Contract(_lqdVaultAddr, LQD_VAULT_ABI, signer);
            var tx = await vault.deposit(amtWei, user);
            await tx.wait();

            toast('success', '📥 Mua Chứng Chỉ thành công!');
            status.innerHTML = '<span style="color:#10b981;">✅ Giao dịch thành công!</span>';
            btn.innerText = '📥 MUA'; btn.disabled = false;
            document.getElementById('lqd-amt-dep').value = '';
            await loadLiquidDash();
        } catch(e) {
            btn.innerText = '📥 MUA'; btn.disabled = false;
            status.innerHTML = '<span style="color:#ef4444;">❌ ' + (e.reason||e.message||'Lỗi').substring(0,60) + '</span>';
        }
    });

    // BÁN CHỨNG CHỈ (Redeem)
    document.getElementById('lqd-btn-red').addEventListener('click', async function() {
        if(!signer){toast('error','Kết nối Ví!');return;}
        var amt = document.getElementById('lqd-amt-red').value.trim();
        if(!amt || isNaN(amt) || parseFloat(amt) <= 0) { toast('error','Nhập số lượng hợp lệ!'); return; }
        
        var btn = this; var status = document.getElementById('lqd-action-status');
        try {
            btn.disabled = true; btn.innerText = '⏳ Đang Bán...';
            status.innerHTML = '<span style="color:#ef4444;">Đang trả Chứng Chỉ để rút Coin...</span>';
            var amtWei = ethers.utils.parseEther(amt);
            
            var vault = new ethers.Contract(_lqdVaultAddr, LQD_VAULT_ABI, signer);
            var user = await signer.getAddress();
            var tx = await vault.redeem(amtWei, user, user);
            await tx.wait();

            toast('success', '📤 Đã Bán Chứng Chỉ chốt lời thành công!');
            status.innerHTML = '<span style="color:#10b981;">✅ Rút tiền thành công!</span>';
            btn.innerText = '📤 BÁN RÚT TIỀN'; btn.disabled = false;
            document.getElementById('lqd-amt-red').value = '';
            await loadLiquidDash();
        } catch(e) {
            btn.innerText = '📤 BÁN RÚT TIỀN'; btn.disabled = false;
            status.innerHTML = '<span style="color:#ef4444;">❌ ' + (e.reason||e.message||'Lỗi').substring(0,60) + '</span>';
        }
    });
    `,
    bindings: [{ btn: "lqd-load-btn", fn: "loadLiquidDash" }]
}

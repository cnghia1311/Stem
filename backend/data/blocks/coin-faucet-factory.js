import { FACTORY_ADDRESSES } from '../contracts/contractFactorys.js';

export default {
    id: "coin-faucet-factory",
    name: "🏭 Tạo Két Sắt Bài Thi",
    desc: "Tạo Máy Phát Lương Coin cho bài thi Trắc nghiệm. Cho phép giới hạn danh sách học sinh nhận.",
    color: "#eab308",
    label: "Tạo Két Sắt (Faucet)",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#eab308;">
        <div class="khoi-title" style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:24px;">🏭</span>
            <span style="background:linear-gradient(135deg,#eab308,#ca8a04);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:16px;letter-spacing:1px;">TẠO KÉT SẮT TRẮC NGHIỆM</span>
        </div>
        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:15px;margin-bottom:12px;">
            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Địa chỉ Tiền Ảo (ERC-20 Coin)</label>
            <input type="text" id="cff-token" placeholder="0x..." style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;margin-bottom:12px;">

            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Phần thưởng 1 lần (Số lượng Coin)</label>
            <input type="number" id="cff-amount" placeholder="Ví dụ: 10" value="10" min="1" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;margin-bottom:12px;">

            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Danh sách trắng (Địa chỉ ví học sinh được phép thi)</label>
            <textarea id="cff-whitelist" placeholder="0x123...\\n0x456...\\n(Mỗi địa chỉ 1 dòng, tối đa 100 địa chỉ)" rows="4" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#a5b4fc;font-size:11px;outline:none;font-family:monospace;resize:vertical;"></textarea>
            <div style="font-size:10px;color:#f59e0b;margin-top:6px;">Lưu ý: Chỉ những ví trong danh sách này mới có thể rút tiền từ Két sắt (Chống hack/gian lận ví ảo).</div>
        </div>

        <button id="cff-create-btn" style="width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#eab308,#ca8a04);color:white;font-size:15px;font-weight:800;cursor:pointer;letter-spacing:1px;margin-bottom:10px;">🔐 ĐÚC KÉT SẮT</button>

        <div id="cff-tx-status" style="margin-top:10px;font-size:12px;text-align:center;color:#94a3b8;min-height:20px;"></div>

        <div id="cff-result" style="display:none;margin-top:12px;background:#0f2a1a;border:1px solid #10b981;border-radius:12px;padding:15px;">
            <div style="font-size:14px;font-weight:bold;color:#10b981;margin-bottom:8px;text-align:center;">🎉 KÉT SẮT ĐÃ SẴN SÀNG!</div>
            <div style="font-size:11px;color:#94a3b8;margin-bottom:8px;text-align:center;">Địa chỉ Két Sắt (Copy dán vào khối Trắc Nghiệm):</div>
            <div id="cff-result-addr" style="background:#1e293b;padding:10px;border-radius:8px;font-size:12px;color:#06b6d4;word-break:break-all;cursor:pointer;text-align:center;font-weight:bold;" title="Bấm để copy"></div>
            
            <div style="margin-top:12px;padding:10px;background:#1e293b;border-radius:8px;border-left:3px solid #eab308;">
                <div style="font-size:12px;color:#fcd34d;font-weight:bold;margin-bottom:6px;">⚠️ BƯỚC TIẾP THEO (QUAN TRỌNG)</div>
                <div style="font-size:11px;color:#cbd5e1;line-height:1.4;">
                    Két sắt hiện đang <strong>TRỐNG RỖNG</strong>. Bạn cần dùng khối <strong>Chuyển Tiền</strong> để nạp số lượng lớn Coin vào Địa chỉ Két Sắt trên trước khi cho học sinh làm bài thi!
                </div>
            </div>
            
            <div style="margin-top:12px;border-top:1px dashed #334155;padding-top:12px;">
                <div style="font-size:11px;color:#94a3b8;margin-bottom:6px;text-align:center;">Chức năng Quản trị viên (Chủ két sắt)</div>
                <button id="cff-withdraw-btn" style="width:100%;padding:10px;border-radius:8px;border:1px solid #ef4444;background:transparent;color:#ef4444;font-size:12px;font-weight:bold;cursor:pointer;">🔙 THU HỒI TIỀN THỪA (HẾT GIỜ THI)</button>
            </div>
        </div>

        <!-- NẠP COIN VÀO KÉT -->
        <div style="margin-top:16px;background:#0f172a;border:1px solid #f59e0b;border-radius:12px;padding:15px;">
            <div style="font-size:13px;color:#fcd34d;font-weight:bold;margin-bottom:10px;text-align:center;">💰 NẠP COIN VÀO KÉT SẮT</div>

            <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:4px;font-weight:bold;">Địa chỉ Két Sắt cần nạp</label>
            <div style="display:flex;gap:6px;margin-bottom:8px;">
                <input type="text" id="cff-fund-addr" placeholder="0x... (tự điền sau khi đúc két)" style="flex:1;min-width:0;width:auto;padding:8px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;outline:none;font-family:monospace;">
                <button id="cff-fund-check" style="width:auto;flex:0 0 auto;padding:8px 12px;border-radius:6px;border:1px solid #f59e0b;background:transparent;color:#fcd34d;font-size:11px;font-weight:bold;cursor:pointer;white-space:nowrap;">🔍 Kiểm tra</button>
            </div>

            <div id="cff-fund-info" style="display:none;background:#1e293b;padding:10px;border-radius:8px;margin-bottom:8px;font-size:11px;line-height:1.7;"></div>

            <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:4px;font-weight:bold;">Số lượng Coin muốn nạp</label>
            <input type="text" id="cff-fund-amount" placeholder="VD: 1000" style="width:100%;padding:10px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:14px;outline:none;font-weight:bold;margin-bottom:10px;">

            <button id="cff-fund-btn" style="width:100%;padding:12px;border-radius:8px;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:white;font-size:14px;font-weight:800;cursor:pointer;">💰 NẠP COIN VÀO KÉT</button>
            <div id="cff-fund-status" style="margin-top:8px;font-size:11px;text-align:center;color:#94a3b8;min-height:16px;"></div>
        </div>
        
        <div style="margin-top:20px;border-top:1px dashed #334155;padding-top:15px;">
            <div style="font-size:12px;color:#a5b4fc;font-weight:bold;margin-bottom:8px;text-align:center;">🛠️ QUẢN LÝ KÉT SẮT CŨ</div>
            <button id="cff-load-history-btn" style="width:100%;padding:8px;border-radius:8px;border:1px solid #3b82f6;background:transparent;color:#3b82f6;font-size:12px;font-weight:bold;cursor:pointer;margin-bottom:8px;">🔄 XEM LỊCH SỬ KÉT SẮT</button>
            <div id="cff-history-list" style="margin-bottom:8px;font-size:11px;color:#a5b4fc;max-height:80px;overflow-y:auto;text-align:center;"></div>
            <input type="text" id="cff-manage-addr" placeholder="Nhập Mã Két Sắt cũ..." style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;outline:none;margin-bottom:8px;text-align:center;">
            <button id="cff-manage-withdraw-btn" style="width:100%;padding:10px;border-radius:8px;border:1px solid #ef4444;background:transparent;color:#ef4444;font-size:12px;font-weight:bold;cursor:pointer;">🔙 RÚT TIỀN THỪA (TỪ KÉT NÀY)</button>
            <div style="font-size:11px;color:#94a3b8;margin-top:8px;text-align:center;">💡 <i>Mẹo: Để nạp tiền vào két, bạn hãy dùng khối "Chuyển Tiền" (Bài 1).</i></div>
        </div>
    </div>`,

    engineCode: () => `
        const FAUCET_FACTORY_ADDR = '${FACTORY_ADDRESSES.FAUCET_FACTORY || '0x3785Aaf3C6EFD41450136D193C0605653d3f150c'}';
        const FAUCET_FACTORY_ABI = [
            "function createFaucet(address _token, uint256 _rewardAmount, address[] calldata _whitelistedUsers) external returns (address)",
            "function getFaucetsByOwner(address _owner) external view returns (address[] memory)",
            "event FaucetCreated(address indexed creator, address faucetAddress, address token, uint256 rewardAmount, uint256 whitelistCount)"
        ];
        const FAUCET_ABI = [
            "function claim() external",
            "function withdrawRemaining() external"
        ];

        var _cffToken = document.getElementById('cff-token');
        var _cffAmount = document.getElementById('cff-amount');
        var _cffWhitelist = document.getElementById('cff-whitelist');
        var _cffBtn = document.getElementById('cff-create-btn');
        var _cffStatus = document.getElementById('cff-tx-status');
        var _cffResult = document.getElementById('cff-result');
        var _cffAddr = document.getElementById('cff-result-addr');
        var _cffWithdrawBtn = document.getElementById('cff-withdraw-btn');
        var currentFaucetAddr = "";
        const FAUCET_INFO_ABI = [
            "function token() view returns (address)",
            "function rewardAmount() view returns (uint256)",
            "function owner() view returns (address)"
        ];
        const ERC20_FUND_ABI = [
            "function transfer(address to, uint256 amount) returns (bool)",
            "function balanceOf(address) view returns (uint256)",
            "function decimals() view returns (uint8)",
            "function symbol() view returns (string)"
        ];

        var _cffFundAddr   = document.getElementById('cff-fund-addr');
        var _cffFundCheck  = document.getElementById('cff-fund-check');
        var _cffFundInfo   = document.getElementById('cff-fund-info');
        var _cffFundAmount = document.getElementById('cff-fund-amount');
        var _cffFundBtn    = document.getElementById('cff-fund-btn');
        var _cffFundStatus = document.getElementById('cff-fund-status');

        function _cffProvider() {
            if (provider) return provider;
            if (window.ethereum) return new ethers.providers.Web3Provider(window.ethereum);
            return null;
        }

        // Đọc két: số dư còn lại, mức thưởng, còn đủ trả cho bao nhiêu em
        async function _cffCheckFaucet() {
            if (!_cffFundAddr) return null;
            var addr = _cffFundAddr.value.trim();
            if (!addr || addr.length !== 42) { _cffFundInfo.style.display = 'none'; return null; }

            var prov = _cffProvider();
            if (!prov) { toast('error', 'Cần cài MetaMask!'); return null; }

            _cffFundInfo.style.display = 'block';
            _cffFundInfo.innerHTML = '<span style="color:#94a3b8;">⏳ Đang đọc két sắt...</span>';

            try {
                var f = new ethers.Contract(addr, FAUCET_INFO_ABI, prov);
                var tokenAddr = await f.token();
                var reward = await f.rewardAmount();

                var t = new ethers.Contract(tokenAddr, ERC20_FUND_ABI, prov);
                var dec = 18;    try { dec = await t.decimals(); } catch(e) {}
                var sym = 'Coin';try { sym = await t.symbol(); }   catch(e) {}
                var bal = await t.balanceOf(addr);

                var rewardNum = parseFloat(ethers.utils.formatUnits(reward, dec));
                var balNum    = parseFloat(ethers.utils.formatUnits(bal, dec));
                var slots     = rewardNum > 0 ? Math.floor(balNum / rewardNum) : 0;

                _cffFundInfo.innerHTML =
                    '💎 Số dư két: <b style="color:#10b981;">' + balNum.toLocaleString('vi-VN', {maximumFractionDigits:4}) + ' ' + sym + '</b><br>'
                  + '🎁 Thưởng mỗi em: <b style="color:#fcd34d;">' + rewardNum + ' ' + sym + '</b><br>'
                  + (slots > 0
                        ? '👥 Đủ trả cho <b style="color:#10b981;">' + slots + '</b> học sinh nữa'
                        : '<b style="color:#ef4444;">⚠️ KÉT TRỐNG — học sinh làm đúng cũng KHÔNG nhận được coin!</b>');

                return { tokenAddr: tokenAddr, dec: dec, sym: sym };
            } catch(e) {
                _cffFundInfo.innerHTML = '<span style="color:#ef4444;">❌ Không đọc được — địa chỉ này có đúng là Két Sắt không?</span>';
                return null;
            }
        }

        if (_cffFundCheck) _cffFundCheck.addEventListener('click', _cffCheckFaucet);
        if (_cffFundAddr) {
            var _cffFundTimer = null;
            _cffFundAddr.addEventListener('input', function() {
                clearTimeout(_cffFundTimer);
                if (this.value.trim().length !== 42) { _cffFundInfo.style.display = 'none'; return; }
                _cffFundTimer = setTimeout(_cffCheckFaucet, 500);
            });
        }

        if (_cffFundBtn) {
            _cffFundBtn.addEventListener('click', async function() {
                if (!signer) { toast('error', 'Cần kết nối ví (🦊) trước!'); return; }

                var addr = _cffFundAddr.value.trim();
                if (!addr || addr.length !== 42) { toast('error', 'Nhập địa chỉ Két Sắt hợp lệ!'); return; }
                var amt = _cffFundAmount.value.trim();
                if (!amt || isNaN(amt) || parseFloat(amt) <= 0) { toast('error', 'Nhập số lượng hợp lệ!'); return; }

                var info = await _cffCheckFaucet();
                if (!info) { toast('error', 'Không đọc được Két Sắt!'); return; }

                try {
                    _cffFundBtn.disabled = true; _cffFundBtn.style.opacity = '0.5';
                    _cffFundStatus.innerHTML = '<span style="color:#f59e0b;">⏳ Đang chuyển Coin vào két... (Xác nhận trên MetaMask)</span>';

                    var t   = new ethers.Contract(info.tokenAddr, ERC20_FUND_ABI, signer);
                    var wei = ethers.utils.parseUnits(amt, info.dec);

                    var myBal = await t.balanceOf(userAddr);
                    if (myBal.lt(wei)) {
                        toast('error', 'Ví bạn không đủ ' + info.sym + '!');
                        _cffFundStatus.innerHTML = '';
                        return;
                    }

                    // Nạp két = chuyển thẳng coin cho contract, không cần approve
                    var tx = await t.transfer(addr, wei);
                    _cffFundStatus.innerHTML = '<span style="color:#f59e0b;">⛏️ Đang chờ Blockchain xác nhận...</span>';
                    await tx.wait();

                    _cffFundStatus.innerHTML = '<span style="color:#10b981;">✅ Đã nạp ' + amt + ' ' + info.sym + ' vào két!</span>';
                    toast('success', '💰 Nạp két thành công!');
                    _cffFundAmount.value = '';
                    await _cffCheckFaucet();

                } catch(e) {
                    var msg = e.reason || e.message || 'Lỗi không xác định';
                    if (msg.includes('user rejected')) msg = 'Bạn đã từ chối giao dịch!';
                    _cffFundStatus.innerHTML = '<span style="color:#ef4444;">❌ ' + msg.substring(0, 80) + '</span>';
                    toast('error', msg.substring(0, 50));
                } finally {
                    _cffFundBtn.disabled = false; _cffFundBtn.style.opacity = '1';
                }
            });
        }
        if (_cffBtn) {
            _cffAddr.addEventListener('click', function() {
                navigator.clipboard.writeText(this.innerText).then(() => {
                    toast('success', '📋 Đã copy địa chỉ Két Sắt!');
                });
            });

            _cffBtn.addEventListener('click', async function() {
                if (!signer) { toast('error', 'Cần kết nối ví (🦊) trước!'); return; }
                
                var tokenAddr = _cffToken.value.trim();
                var rewardAmt = parseInt(_cffAmount.value);
                var wlText = _cffWhitelist.value.trim();

                if (!tokenAddr || tokenAddr.length !== 42) { toast('error', 'Địa chỉ Coin không hợp lệ!'); return; }
                if (isNaN(rewardAmt) || rewardAmt <= 0) { toast('error', 'Số lượng thưởng không hợp lệ!'); return; }
                
                var whitelistArray = [];
                if (wlText) {
                    var lines = wlText.split('\\n');
                    for (var i=0; i<lines.length; i++) {
                        var addr = lines[i].trim();
                        if (addr && addr.length === 42 && addr.startsWith('0x')) {
                            whitelistArray.push(addr);
                        }
                    }
                }
                
                try {
                    _cffBtn.disabled = true; _cffBtn.style.opacity = '0.5';
                    _cffStatus.innerHTML = '<span style="color:#f59e0b;">⏳ Đang tạo Két sắt... Xác nhận trên MetaMask!</span>';
                    
                    const factory = new ethers.Contract(FAUCET_FACTORY_ADDR, FAUCET_FACTORY_ABI, signer);
                    const parsedReward = ethers.utils.parseEther(rewardAmt.toString());
                    
                    const tx = await factory.createFaucet(tokenAddr, parsedReward, whitelistArray);
                    
                    _cffStatus.innerHTML = '<span style="color:#f59e0b;">⛏️ Đang đợi Blockchain xác nhận Đúc Két sắt...</span>';
                    const receipt = await tx.wait();
                    
                    // Parse the FaucetCreated event to get the new address
                    let newFaucetAddr = null;
                    for (let i = 0; i < receipt.logs.length; i++) {
                        try {
                            const parsedLog = factory.interface.parseLog(receipt.logs[i]);
                            if (parsedLog.name === 'FaucetCreated') {
                                newFaucetAddr = parsedLog.args.faucetAddress;
                                break;
                            }
                        } catch (e) {}
                    }
                    
                    if (newFaucetAddr) {
                        currentFaucetAddr = newFaucetAddr;
                    } else {
                        throw new Error("Could not find FaucetAddress in receipt logs");
                    }

                    _cffAddr.innerText = currentFaucetAddr;
                    _cffResult.style.display = 'block';

                    // Đưa thẳng địa chỉ két mới xuống khung nạp tiền
                    if (_cffFundAddr) { _cffFundAddr.value = currentFaucetAddr; _cffCheckFaucet(); }
                    
                    _cffStatus.innerHTML = '<span style="color:#10b981;">✅ Hoàn tất! Két sắt đã được đúc thành công!</span>';
                    toast('success', '🎉 Tạo Két sắt thành công!');
                } catch(e) {
                    var msg = e.reason || e.message || 'Lỗi không xác định';
                    if (msg.includes('user rejected')) msg = 'Đã hủy giao dịch!';
                    _cffStatus.innerHTML = '<span style="color:#ef4444;">❌ ' + msg.substring(0, 100) + '</span>';
                    toast('error', 'Tạo Két thất bại!');
                } finally {
                    _cffBtn.disabled = false; _cffBtn.style.opacity = '1';
                }
            });
            
            _cffWithdrawBtn.addEventListener('click', async function() {
                if (!currentFaucetAddr) return;
                if (!signer) { toast('error', 'Cần kết nối ví!'); return; }
                try {
                    _cffWithdrawBtn.innerText = '⏳ ĐANG RÚT...';
                    const faucet = new ethers.Contract(currentFaucetAddr, FAUCET_ABI, signer);
                    const tx = await faucet.withdrawRemaining();
                    toast('success', 'Đang đợi Blockchain xác nhận...');
                    await tx.wait();
                    toast('success', '✅ Đã thu hồi toàn bộ tiền thừa về ví!');
                    _cffWithdrawBtn.innerText = '✅ ĐÃ THU HỒI XONG';
                    _cffWithdrawBtn.style.color = '#10b981';
                    _cffWithdrawBtn.style.borderColor = '#10b981';
                } catch(e) {
                    var msg = e.reason || e.message || 'Lỗi';
                    toast('error', 'Thu hồi thất bại: ' + msg.substring(0, 50));
                    _cffWithdrawBtn.innerText = '🔙 THU HỒI TIỀN THỪA (HẾT GIỜ THI)';
                }
            });
            
            var _cffManageAddr = document.getElementById('cff-manage-addr');
            var _cffManageWithdrawBtn = document.getElementById('cff-manage-withdraw-btn');
            var _cffLoadHistoryBtn = document.getElementById('cff-load-history-btn');
            var _cffHistoryList = document.getElementById('cff-history-list');
            
            if (_cffLoadHistoryBtn) {
                _cffLoadHistoryBtn.addEventListener('click', async function() {
                    if (!signer) { toast('error', 'Cần kết nối ví!'); return; }
                    try {
                        _cffLoadHistoryBtn.innerText = '⏳ ĐANG TẢI...';
                        const factory = new ethers.Contract(FAUCET_FACTORY_ADDR, FAUCET_FACTORY_ABI, signer);
                        const signerAddr = await signer.getAddress();
                        const faucets = await factory.getFaucetsByOwner(signerAddr);
                        
                        if(faucets.length === 0) {
                            _cffHistoryList.innerHTML = '<span style="color:#ef4444;">Bạn chưa tạo Két sắt nào!</span>';
                        } else {
                            _cffHistoryList.innerHTML = faucets.map((f, i) => 
                                '<div style="margin-bottom:4px;cursor:pointer;background:#0f172a;padding:4px;border-radius:4px;" onclick="document.getElementById(\\'cff-manage-addr\\').value=\\''+f+'\\'; toast(\\'success\\', \\'Đã chọn Két sắt!\\')">Két '+(i+1)+': <span style="color:#10b981;">' + f.substring(0,6) + '...' + f.substring(38) + '</span></div>'
                            ).join('');
                        }
                        _cffLoadHistoryBtn.innerText = '🔄 XEM LỊCH SỬ KÉT SẮT';
                    } catch(e) {
                        toast('error', 'Không thể tải lịch sử!');
                        _cffLoadHistoryBtn.innerText = '🔄 XEM LỊCH SỬ KÉT SẮT';
                    }
                });
            }
            
            if (_cffManageWithdrawBtn) {
                _cffManageWithdrawBtn.addEventListener('click', async function() {
                    var addr = _cffManageAddr.value.trim();
                    if (!addr || addr.length !== 42) { toast('error', 'Mã Két Sắt không hợp lệ!'); return; }
                    if (!signer) { toast('error', 'Cần kết nối ví!'); return; }
                    
                    try {
                        _cffManageWithdrawBtn.innerText = '⏳ ĐANG RÚT...';
                        const faucet = new ethers.Contract(addr, FAUCET_ABI, signer);
                        const tx = await faucet.withdrawRemaining();
                        toast('success', 'Đang đợi Blockchain xác nhận...');
                        await tx.wait();
                        toast('success', '✅ Đã thu hồi toàn bộ tiền thừa về ví!');
                        _cffManageWithdrawBtn.innerText = '✅ ĐÃ THU HỒI XONG';
                        _cffManageWithdrawBtn.style.color = '#10b981';
                        _cffManageWithdrawBtn.style.borderColor = '#10b981';
                    } catch(e) {
                        var msg = e.reason || e.message || 'Lỗi';
                        if (msg.includes('Only owner')) msg = 'Ví bạn đang dùng KHÔNG PHẢI là chủ két sắt này!';
                        if (msg.includes('No balance')) msg = 'Két sắt này đã trống rỗng!';
                        toast('error', 'Thu hồi thất bại: ' + msg.substring(0, 80));
                        _cffManageWithdrawBtn.innerText = '🔙 RÚT TIỀN THỪA (TỪ KÉT NÀY)';
                    }
                });
            }
        }
    `,
    bindings: []
}

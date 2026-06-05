import { FACTORY_ADDRESSES } from '../contracts/contractFactorys.js';

// ==================== KHỐI: LẬP QUỸ ĐẦU TƯ (ERC-4626) ====================
export default {
    id: "liquid-factory",
    name: "🏛️ Lập Quỹ Đầu Tư",
    desc: "Tạo Quỹ Chuẩn ERC-4626 (Money Legos). Giáo viên có thể Rút quỹ đi đầu tư và Bơm lợi nhuận vào quỹ để làm tăng giá trị chứng chỉ sCoin.",
    color: "#0f766e",
    label: "Lập Quỹ Đầu Tư",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#0f766e;">
        <div class="khoi-title" style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
            <span style="font-size:24px;">🏛️</span>
            <span style="background:linear-gradient(135deg,#0f766e,#2dd4bf);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:16px;letter-spacing:1px;">LẬP QUỸ ĐẦU TƯ</span>
        </div>
        <p style="font-size:11px;color:#cbd5e1;margin-bottom:12px;line-height:1.5;">Tạo Chứng Chỉ Quỹ (ERC-4626). Chức năng Vay/Trả của Giáo viên giúp vận hành hệ thống Bank Run thực tế.</p>

        <!-- TẠO QUỸ MỚI -->
        <div style="background:#0f172a;border-radius:12px;padding:12px;border:1px solid #1e293b;margin-bottom:12px;">
            <div style="font-size:12px;color:#2dd4bf;font-weight:bold;margin-bottom:8px;border-bottom:1px solid #1e293b;padding-bottom:6px;">1. TẠO QUỸ MỚI</div>
            <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px;">
                <div>
                    <input type="text" id="lqf-name" placeholder="Tên Quỹ..." style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;">
                </div>
                <div>
                    <input type="text" id="lqf-symbol" placeholder="Symbol Chứng Chỉ..." style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;">
                </div>
                <div>
                    <input type="text" id="lqf-token" placeholder="Địa chỉ Coin Cơ Sở (0x...)" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;">
                </div>
                <div>
                    <input type="number" id="lqf-lock" placeholder="Thời gian khóa (Phút)" value="5" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;">
                </div>
            </div>
            <button id="lqf-create-btn" style="width:100%;padding:12px;border-radius:8px;border:none;background:linear-gradient(135deg,#0d9488,#14b8a6);color:white;font-size:13px;font-weight:bold;cursor:pointer;">🚀 LẬP QUỸ</button>
            <div id="lqf-create-status" style="margin-top:8px;font-size:11px;text-align:center;color:#94a3b8;min-height:16px;"></div>
            
            <div id="lqf-result" style="display:none;margin-top:12px;background:#064e3b;border:1px solid #10b981;border-radius:8px;padding:12px;text-align:center;">
                <div style="font-size:11px;color:#6ee7b7;margin-bottom:4px;">🎉 Đã tạo Quỹ thành công! Mã Quỹ:</div>
                <div id="lqf-address" style="font-size:11px;color:#fff;background:#022c22;padding:6px;border-radius:4px;word-break:break-all;user-select:all;"></div>
                <div style="font-size:10px;color:#a7f3d0;margin-top:6px;">Hãy copy mã này cho học sinh!</div>
            </div>
        </div>

        <div style="display:flex;gap:8px;margin-bottom:8px;">
            <input type="text" id="lqf-fund-addr" placeholder="Mã Quỹ (0x...)" style="flex:1;padding:10px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#e2e8f0;font-size:12px;outline:none;">
            <button id="lqf-load-btn" style="background:#334155;color:white;border:none;padding:10px;border-radius:8px;font-size:12px;cursor:pointer;">🔄 TẢI</button>
        </div>

        <div id="lqf-dashboard" style="display:none;">
            <div style="background:#0f172a;border-radius:12px;padding:12px;border:1px solid #1e293b;margin-bottom:12px;">
                <div style="font-size:11px;color:#94a3b8;margin-bottom:8px;text-align:center;">--- Tình trạng Thanh Khoản Quỹ ---</div>
                <div style="display:flex;justify-content:space-around;text-align:center;">
                    <div>
                        <div style="font-size:10px;color:#94a3b8;">Tiền trong Két</div>
                        <div id="lqf-info-bal" style="font-size:14px;color:#10b981;font-weight:bold;">0</div>
                    </div>
                    <div>
                        <div style="font-size:10px;color:#94a3b8;">Giáo viên Đang Nợ</div>
                        <div id="lqf-info-borrow" style="font-size:14px;color:#ef4444;font-weight:bold;">0</div>
                    </div>
                </div>
            </div>

            <!-- VAY TIỀN QUỸ -->
            <div style="background:#0f172a;border-radius:12px;padding:12px;border:1px solid #1e293b;margin-bottom:12px;">
                <div style="font-size:12px;color:#ef4444;font-weight:bold;margin-bottom:8px;border-bottom:1px solid #1e293b;padding-bottom:6px;">2. RÚT TIỀN QUỸ ĐI ĐẦU TƯ</div>
                <div style="display:flex;gap:8px;margin-bottom:12px;">
                    <input type="text" id="lqf-borrow-amt" placeholder="Số Coin vay..." style="flex:1;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;outline:none;">
                    <button id="lqf-borrow-btn" style="background:linear-gradient(135deg,#dc2626,#ef4444);color:white;border:none;padding:10px 16px;border-radius:8px;font-size:12px;font-weight:bold;cursor:pointer;">📉 VAY TỪ QUỸ</button>
                </div>
                <div id="lqf-borrow-status" style="font-size:11px;text-align:center;color:#94a3b8;min-height:16px;"></div>
            </div>

            <!-- TRẢ NỢ VÀ BƠM LÃI -->
            <div style="background:#0f172a;border-radius:12px;padding:12px;border:1px solid #1e293b;">
                <div style="font-size:12px;color:#10b981;font-weight:bold;margin-bottom:8px;border-bottom:1px solid #1e293b;padding-bottom:6px;">3. TRẢ NỢ & BƠM LỢI NHUẬN</div>
                <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px;">
                    <div>
                        <label style="font-size:10px;color:#94a3b8;">Số Gốc trả Quỹ:</label>
                        <input type="text" id="lqf-repay-principal" placeholder="VD: 100" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;outline:none;margin-top:4px;">
                    </div>
                    <div>
                        <label style="font-size:10px;color:#94a3b8;">Bơm thêm Lãi (Làm tăng tỷ giá!):</label>
                        <input type="text" id="lqf-repay-interest" placeholder="VD: 20" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;outline:none;margin-top:4px;">
                    </div>
                </div>
                <button id="lqf-repay-btn" style="width:100%;padding:12px;border-radius:8px;border:none;background:linear-gradient(135deg,#059669,#10b981);color:white;font-size:13px;font-weight:bold;cursor:pointer;">💸 TRẢ NỢ & BƠM LÃI</button>
                <div id="lqf-repay-status" style="margin-top:8px;font-size:11px;text-align:center;color:#94a3b8;min-height:16px;"></div>
            </div>
            </div>

            <!-- KHAI BÁO THUA LỖ -->
            <div style="background:#0f172a;border-radius:12px;padding:12px;border:1px solid #1e293b;margin-top:12px;">
                <div style="font-size:12px;color:#f43f5e;font-weight:bold;margin-bottom:8px;border-bottom:1px solid #1e293b;padding-bottom:6px;">4. KHAI BÁO THUA LỖ (CẮT MÁU)</div>
                <div style="font-size:10px;color:#94a3b8;margin-bottom:8px;line-height:1.4;">Xóa bỏ khoản nợ xấu mà bạn đã làm mất. Hành động này sẽ chia đều khoản lỗ cho tất cả Chứng chỉ (Làm GIẢM tỷ giá ngay lập tức).</div>
                <div style="display:flex;gap:8px;margin-bottom:12px;">
                    <input type="text" id="lqf-loss-amt" placeholder="Số Coin mất trắng..." style="flex:1;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;outline:none;">
                    <button id="lqf-loss-btn" style="background:linear-gradient(135deg,#9f1239,#e11d48);color:white;border:none;padding:10px 16px;border-radius:8px;font-size:12px;font-weight:bold;cursor:pointer;">📉 XÓA NỢ XẤU</button>
                </div>
                <div id="lqf-loss-status" style="font-size:11px;text-align:center;color:#94a3b8;min-height:16px;"></div>
            </div>
        </div>
    </div>`,

    engineCode: () => `
        var LIQUID_FACTORY_ADDR = '${FACTORY_ADDRESSES.LIQUID_FACTORY || '0x0000000000000000000000000000000000000000'}';
        
        var LIQUID_FACTORY_ABI = [
            "function createLiquidStaking(address _assetToken, string _vaultName, string _vaultSymbol, uint256 _minLockTime) external returns (address)",
            "event LiquidStakingCreated(address indexed creator, address indexed vaultAddress, string name, string symbol, address assetToken)"
        ];
        
        var LQF_VAULT_ABI = [
            "function borrow(uint256 amount) external",
            "function repay(uint256 principal, uint256 interest) external",
            "function declareLoss(uint256 lostAmount) external",
            "function totalBorrowed() view returns (uint256)",
            "function asset() view returns (address)"
        ];

        var ERC20_ABI = [
            "function approve(address spender, uint256 amount) external",
            "function allowance(address owner, address spender) view returns (uint256)",
            "function balanceOf(address) view returns (uint256)"
        ];

        var _lqfVault = '';
        var _lqfAsset = '';

        // 1. LẬP QUỸ
        document.getElementById('lqf-create-btn').addEventListener('click', async function() {
            if (!signer) { toast('error', 'Kết nối Ví trước!'); return; }
            if (LIQUID_FACTORY_ADDR === '0x0000000000000000000000000000000000000000') {
                toast('error', 'Chưa cấu hình địa chỉ Liquid Factory!'); return;
            }

            var name = document.getElementById('lqf-name').value.trim();
            var sym = document.getElementById('lqf-symbol').value.trim();
            var tokenAddr = document.getElementById('lqf-token').value.trim();
            var lockTime = document.getElementById('lqf-lock').value.trim();

            if (!name || !sym) { toast('error', 'Nhập Tên và Symbol!'); return; }
            if (!tokenAddr || tokenAddr.length !== 42) { toast('error', 'Nhập địa chỉ Coin Cơ Sở!'); return; }
            if (!lockTime) lockTime = 0;

            var btn = this; var status = document.getElementById('lqf-create-status');
            try {
                btn.disabled = true; btn.style.opacity = '0.5';
                status.innerHTML = '<span style="color:#2dd4bf;">⏳ Đang tạo Quỹ... (Xác nhận MetaMask)</span>';
                document.getElementById('lqf-result').style.display = 'none';

                var factory = new ethers.Contract(LIQUID_FACTORY_ADDR, LIQUID_FACTORY_ABI, signer);
                var tx = await factory.createLiquidStaking(tokenAddr, name, sym, lockTime);
                status.innerHTML = '<span style="color:#2dd4bf;">⛏️ Đang đợi Blockchain xác nhận...</span>';
                var receipt = await tx.wait();

                var event = receipt.events.find(e => e.event === 'LiquidStakingCreated');
                var vaultAddr = event.args.vaultAddress;

                status.innerHTML = '<span style="color:#10b981;">✅ Tạo Quỹ thành công!</span>';
                document.getElementById('lqf-address').innerText = vaultAddr;
                document.getElementById('lqf-result').style.display = 'block';
                
                document.getElementById('lqf-fund-addr').value = vaultAddr;

                btn.disabled = false; btn.style.opacity = '1';
                toast('success', 'Đã tạo Quỹ Đầu Tư!');
            } catch(e) {
                btn.disabled = false; btn.style.opacity = '1';
                status.innerHTML = '<span style="color:#ef4444;">❌ ' + (e.reason || e.message || 'Lỗi').substring(0, 50) + '</span>';
            }
        });

        // 2. TẢI THÔNG TIN QUỸ
        document.getElementById('lqf-load-btn').addEventListener('click', async function() {
            if(!signer) return toast('error', 'Kết nối ví!');
            var addr = document.getElementById('lqf-fund-addr').value.trim();
            if(addr.length !== 42) return toast('error', 'Địa chỉ quỹ không hợp lệ');
            _lqfVault = addr;

            try {
                var vault = new ethers.Contract(_lqfVault, LQF_VAULT_ABI, signer);
                _lqfAsset = await vault.asset();
                var token = new ethers.Contract(_lqfAsset, ERC20_ABI, signer);
                
                var cash = await token.balanceOf(_lqfVault);
                var borrowed = await vault.totalBorrowed();

                document.getElementById('lqf-info-bal').innerText = parseFloat(ethers.utils.formatEther(cash)).toFixed(2);
                document.getElementById('lqf-info-borrow').innerText = parseFloat(ethers.utils.formatEther(borrowed)).toFixed(2);
                document.getElementById('lqf-dashboard').style.display = 'block';
            } catch(e) {
                toast('error', 'Lỗi: ' + (e.reason || e.message).substring(0, 50));
            }
        });

        // 3. VAY TIỀN
        document.getElementById('lqf-borrow-btn').addEventListener('click', async function() {
            if(!signer) return toast('error', 'Kết nối ví!');
            var amt = document.getElementById('lqf-borrow-amt').value.trim();
            if(!amt || isNaN(amt) || parseFloat(amt) <= 0) return toast('error', 'Nhập số tiền hợp lệ');
            
            var btn = this; var status = document.getElementById('lqf-borrow-status');
            try {
                btn.disabled = true; btn.style.opacity = '0.5';
                status.innerHTML = '<span style="color:#ef4444;">⏳ Đang rút tiền từ Quỹ...</span>';
                
                var vault = new ethers.Contract(_lqfVault, LQF_VAULT_ABI, signer);
                var tx = await vault.borrow(ethers.utils.parseEther(amt));
                await tx.wait();

                status.innerHTML = '<span style="color:#10b981;">✅ Rút tiền thành công!</span>';
                document.getElementById('lqf-borrow-amt').value = '';
                document.getElementById('lqf-load-btn').click();
                btn.disabled = false; btn.style.opacity = '1';
                toast('success', 'Rút tiền đầu tư thành công!');
            } catch(e) {
                btn.disabled = false; btn.style.opacity = '1';
                status.innerHTML = '<span style="color:#ef4444;">❌ ' + (e.reason || e.message || 'Lỗi').substring(0, 50) + '</span>';
            }
        });

        // 4. TRẢ NỢ VÀ BƠM LÃI
        document.getElementById('lqf-repay-btn').addEventListener('click', async function() {
            if(!signer) return toast('error', 'Kết nối ví!');
            var pAmt = document.getElementById('lqf-repay-principal').value.trim() || '0';
            var iAmt = document.getElementById('lqf-repay-interest').value.trim() || '0';
            
            if(pAmt === '0' && iAmt === '0') return toast('error', 'Vui lòng nhập Gốc hoặc Lãi');
            
            var btn = this; var status = document.getElementById('lqf-repay-status');
            try {
                btn.disabled = true; btn.style.opacity = '0.5';
                status.innerHTML = '<span style="color:#f59e0b;">⏳ Đang ủy quyền...</span>';
                
                var pWei = ethers.utils.parseEther(pAmt);
                var iWei = ethers.utils.parseEther(iAmt);
                var totalWei = pWei.add(iWei);

                var vault = new ethers.Contract(_lqfVault, LQF_VAULT_ABI, signer);
                var token = new ethers.Contract(_lqfAsset, ERC20_ABI, signer);
                var user = await signer.getAddress();
                
                var allowed = await token.allowance(user, _lqfVault);
                if (allowed.lt(totalWei)) {
                    var txA = await token.approve(_lqfVault, totalWei);
                    await txA.wait();
                }

                status.innerHTML = '<span style="color:#f59e0b;">💸 Đang chuyển tiền vào Quỹ...</span>';
                var txF = await vault.repay(pWei, iWei);
                await txF.wait();

                status.innerHTML = '<span style="color:#10b981;">✅ Đã Trả Nợ / Bơm Lãi thành công! Tỷ giá Chứng chỉ vừa TĂNG!</span>';
                document.getElementById('lqf-repay-principal').value = '';
                document.getElementById('lqf-repay-interest').value = '';
                document.getElementById('lqf-load-btn').click();
                btn.disabled = false; btn.style.opacity = '1';
                toast('success', 'Thanh toán thành công!');
            } catch(e) {
                btn.disabled = false; btn.style.opacity = '1';
                status.innerHTML = '<span style="color:#ef4444;">❌ ' + (e.reason || e.message || 'Lỗi').substring(0, 50) + '</span>';
            }
        });

        // 5. KHAI BÁO THUA LỖ
        if (document.getElementById('lqf-loss-btn')) {
            document.getElementById('lqf-loss-btn').addEventListener('click', async function() {
                if(!signer) return toast('error', 'Kết nối ví!');
                var amt = document.getElementById('lqf-loss-amt').value.trim();
                if(!amt || isNaN(amt) || parseFloat(amt) <= 0) return toast('error', 'Nhập số tiền hợp lệ');
                
                if(!confirm("CẢNH BÁO: Việc khai báo thua lỗ sẽ làm sụt giảm Tỷ Giá ngay lập tức! Bạn có chắc chắn muốn XÓA NỢ XẤU này?")) return;

                var btn = this; var status = document.getElementById('lqf-loss-status');
                try {
                    btn.disabled = true; btn.style.opacity = '0.5';
                    status.innerHTML = '<span style="color:#e11d48;">⏳ Đang gửi yêu cầu cắt máu...</span>';
                    
                    var vault = new ethers.Contract(_lqfVault, LQF_VAULT_ABI, signer);
                    var tx = await vault.declareLoss(ethers.utils.parseEther(amt));
                    await tx.wait();

                    status.innerHTML = '<span style="color:#10b981;">✅ Khai báo thua lỗ thành công! Tỷ giá đã giảm!</span>';
                    document.getElementById('lqf-loss-amt').value = '';
                    document.getElementById('lqf-load-btn').click();
                    btn.disabled = false; btn.style.opacity = '1';
                    toast('success', 'Đã ghi nhận khoản lỗ!');
                } catch(e) {
                    btn.disabled = false; btn.style.opacity = '1';
                    status.innerHTML = '<span style="color:#ef4444;">❌ ' + (e.reason || e.message || 'Lỗi').substring(0, 50) + '</span>';
                }
            });
        }
    `,
    bindings: []
}

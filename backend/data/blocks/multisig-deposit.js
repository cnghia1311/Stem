import { FACTORY_ADDRESSES } from '../contracts/contractFactorys.js';

// ==================== KHỐI: ĐÓNG QUỸ / NẠP TIỀN (MULTISIG DEPOSIT) ====================
export default {
    id: "multisig-deposit",
    name: "💰 Đóng Quỹ / Nạp Tiền",
    desc: "Nạp ETH hoặc Token ERC-20 vào Quỹ Lớp đa chữ ký",
    color: "#10b981",
    label: "Đóng Quỹ",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#10b981;">
        <div class="khoi-title" style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:24px;">💰</span>
            <span style="background:linear-gradient(135deg,#10b981,#34d399);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:16px;letter-spacing:1px;">ĐÓNG QUỸ / NẠP TIỀN</span>
        </div>

        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:15px;margin-bottom:12px;">
            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">🏛️ Địa chỉ Quỹ Lớp</label>
            <div style="display:flex;gap:6px;margin-bottom:8px;">
                <input type="text" id="md-fund-addr" placeholder="0x... (Paste địa chỉ Quỹ từ khối Tạo Quỹ)" style="flex:1;padding:8px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;outline:none;font-family:monospace;">
                <button id="md-load-info" style="background:#10b981;border:none;color:white;padding:6px 12px;border-radius:6px;font-size:11px;cursor:pointer;font-weight:bold;white-space:nowrap;">📡 Tải</button>
            </div>

            <div id="md-fund-info" style="display:none;background:#1e293b;padding:10px;border-radius:8px;margin-bottom:10px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <span style="font-size:11px;color:#94a3b8;">Số dư ETH trong quỹ:</span>
                    <span id="md-fund-balance" style="font-size:14px;font-weight:bold;color:#10b981;">0 ETH</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:11px;color:#94a3b8;">Ban Quản Trị:</span>
                    <span id="md-fund-owners" style="font-size:11px;color:#a5b4fc;">-</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;">
                    <span style="font-size:11px;color:#94a3b8;">Yêu cầu:</span>
                    <span id="md-fund-required" style="font-size:11px;color:#f59e0b;">-</span>
                </div>
            </div>

            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">💱 Loại tiền nạp</label>
            <select id="md-deposit-type" style="width:100%;padding:8px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;outline:none;margin-bottom:10px;">
                <option value="native">⬡ Coin Mạng (ETH / BNB...)</option>
                <option value="erc20">🪙 Token ERC-20</option>
            </select>

            <div id="md-erc20-section" style="display:none;margin-bottom:10px;">
                <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">📄 Địa chỉ Contract Token</label>
                <input type="text" id="md-token-addr" placeholder="0x... (Địa chỉ Token ERC-20)" style="width:100%;padding:8px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;outline:none;font-family:monospace;margin-bottom:6px;">
                <div id="md-token-info" style="display:none;font-size:11px;color:#94a3b8;background:#1e293b;padding:6px 8px;border-radius:6px;margin-bottom:6px;">
                    <span id="md-token-name" style="color:#a5b4fc;"></span>
                    <span style="margin:0 4px;">|</span>
                    <span>Số dư: <span id="md-token-bal" style="color:#10b981;"></span></span>
                </div>
            </div>

            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">💎 Số lượng nạp</label>
            <input type="text" id="md-amount" placeholder="0.01" style="width:100%;padding:10px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:14px;outline:none;font-weight:bold;">
        </div>

        <button id="md-deposit-btn" style="width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#10b981,#34d399);color:white;font-size:15px;font-weight:800;cursor:pointer;letter-spacing:1px;">💰 ĐÓNG QUỸ NGAY</button>

        <div id="md-status" style="margin-top:10px;font-size:12px;text-align:center;color:#94a3b8;min-height:20px;"></div>
    </div>`,

    engineCode: () => `
        const MULTISIG_DEPOSIT_ABI = [
            "function deposit() payable",
            "function depositERC20(address token, uint256 amount)",
            "function required() view returns (uint256)",
            "function getOwners() view returns (address[])",
            "function getERC20Balance(address token) view returns (uint256)",
            "event Deposit(address indexed sender, uint256 amount)",
            "event DepositERC20(address indexed sender, address indexed token, uint256 amount)"
        ];
        const ERC20_MINI_ABI = [
            "function approve(address spender, uint256 amount) public returns (bool)",
            "function allowance(address owner, address spender) public view returns (uint256)",
            "function balanceOf(address account) public view returns (uint256)",
            "function symbol() public view returns (string)",
            "function name() public view returns (string)",
            "function decimals() public view returns (uint8)"
        ];

        const _mdBtn = document.getElementById('md-deposit-btn');
        const _mdFundAddr = document.getElementById('md-fund-addr');
        const _mdLoadInfo = document.getElementById('md-load-info');
        const _mdDepositType = document.getElementById('md-deposit-type');
        const _mdTokenAddr = document.getElementById('md-token-addr');
        const _mdAmount = document.getElementById('md-amount');
        const _mdStatus = document.getElementById('md-status');

        // Tải thông tin quỹ
        if (_mdLoadInfo) {
            _mdLoadInfo.addEventListener('click', async function() {
                if (!provider || !signer) { toast('error', 'Cần kết nối ví (🦊) trước!'); return; }
                var addr = _mdFundAddr.value.trim();
                if (!addr || addr.length !== 42) { toast('error', 'Nhập địa chỉ Quỹ hợp lệ!'); return; }
                try {
                    _mdLoadInfo.disabled = true; _mdLoadInfo.textContent = '⏳...';
                    var ms = new ethers.Contract(addr, MULTISIG_DEPOSIT_ABI, provider);
                    var bal = await provider.getBalance(addr);
                    var owners = await ms.getOwners();
                    var req = await ms.required();

                    document.getElementById('md-fund-balance').textContent = parseFloat(ethers.utils.formatEther(bal)).toFixed(6) + ' ETH';
                    document.getElementById('md-fund-owners').textContent = owners.length + ' Owner';
                    document.getElementById('md-fund-required').textContent = req.toString() + '/' + owners.length + ' chữ ký';
                    document.getElementById('md-fund-info').style.display = 'block';
                    toast('success', '📡 Đã tải thông tin quỹ!');
                } catch(e) {
                    console.error("Load Info Error:", e);
                    var msg = e.reason || e.message || 'Lỗi không xác định';
                    toast('error', 'Lỗi: ' + msg.substring(0, 50));
                    document.getElementById('md-fund-info').style.display = 'none';
                } finally {
                    _mdLoadInfo.disabled = false; _mdLoadInfo.textContent = '📡 Tải';
                }
            });
        }

        // Toggle ERC-20 section
        if (_mdDepositType) {
            _mdDepositType.addEventListener('change', function() {
                document.getElementById('md-erc20-section').style.display = this.value === 'erc20' ? 'block' : 'none';
            });
        }

        // Auto load token info
        if (_mdTokenAddr) {
            var _mdTokenTimeout = null;
            _mdTokenAddr.addEventListener('input', function() {
                clearTimeout(_mdTokenTimeout);
                _mdTokenTimeout = setTimeout(async function() {
                    var addr = _mdTokenAddr.value.trim();
                    if (!addr || addr.length !== 42) return;
                    try {
                        var token = new ethers.Contract(addr, ERC20_MINI_ABI, provider);
                        var name = await token.name();
                        var symbol = await token.symbol();
                        var decimals = await token.decimals();
                        var bal = await token.balanceOf(userAddr);
                        document.getElementById('md-token-name').textContent = name + ' (' + symbol + ')';
                        document.getElementById('md-token-bal').textContent = ethers.utils.formatUnits(bal, decimals) + ' ' + symbol;
                        document.getElementById('md-token-info').style.display = 'block';
                    } catch(e) {
                        document.getElementById('md-token-info').style.display = 'none';
                    }
                }, 500);
            });
        }

        // Nạp tiền
        if (_mdBtn) {
            _mdBtn.addEventListener('click', async function() {
                if (!signer) { toast('error', 'Cần kết nối ví (🦊) trước!'); return; }
                var fundAddr = _mdFundAddr.value.trim();
                if (!fundAddr || fundAddr.length !== 42) { toast('error', 'Nhập địa chỉ Quỹ hợp lệ!'); return; }

                var amount = _mdAmount.value.trim();
                if (!amount || isNaN(amount) || parseFloat(amount) <= 0) { toast('error', 'Nhập số lượng hợp lệ!'); return; }

                var isERC20 = _mdDepositType.value === 'erc20';

                try {
                    _mdBtn.disabled = true; _mdBtn.style.opacity = '0.5';
                    var ms = new ethers.Contract(fundAddr, MULTISIG_DEPOSIT_ABI, signer);

                    if (isERC20) {
                        var tokenAddr = _mdTokenAddr.value.trim();
                        if (!tokenAddr || tokenAddr.length !== 42) { toast('error', 'Nhập địa chỉ Token hợp lệ!'); return; }

                        var token = new ethers.Contract(tokenAddr, ERC20_MINI_ABI, signer);
                        var decimals = await token.decimals();
                        var amountWei = ethers.utils.parseUnits(amount, decimals);

                        // Bước 1: Kiểm tra allowance
                        var allowance = await token.allowance(userAddr, fundAddr);
                        if (allowance < amountWei) {
                            _mdStatus.innerHTML = '<span style="color:#f59e0b;">⏳ Bước 1/2: Đang Approve Token... (Xác nhận trên MetaMask)</span>';
                            var approveTx = await token.approve(fundAddr, amountWei);
                            await approveTx.wait();
                            _mdStatus.innerHTML = '<span style="color:#10b981;">✅ Bước 1/2: Approve thành công!</span>';
                        }

                        // Bước 2: Deposit
                        _mdStatus.innerHTML = '<span style="color:#f59e0b;">⏳ Bước 2/2: Đang nạp Token vào Quỹ... (Xác nhận trên MetaMask)</span>';
                        var depositTx = await ms.depositERC20(tokenAddr, amountWei);
                        await depositTx.wait();

                        _mdStatus.innerHTML = '<span style="color:#10b981;">✅ Đã nạp ' + amount + ' Token vào Quỹ thành công!</span>';
                        toast('success', '🎉 Đã đóng quỹ ' + amount + ' Token!');
                    } else {
                        // Native Coin
                        _mdStatus.innerHTML = '<span style="color:#f59e0b;">⏳ Đang nạp ETH vào Quỹ... (Xác nhận trên MetaMask)</span>';
                        var amountWei = ethers.utils.parseEther(amount);
                        var tx = await ms.deposit({ value: amountWei });
                        await tx.wait();

                        _mdStatus.innerHTML = '<span style="color:#10b981;">✅ Đã nạp ' + amount + ' ETH vào Quỹ thành công!</span>';
                        toast('success', '🎉 Đã đóng quỹ ' + amount + ' ETH!');
                    }

                    // Refresh balance
                    _mdLoadInfo.click();
                } catch(e) {
                    var msg = e.reason || e.message || 'Lỗi không xác định';
                    if (msg.includes('user rejected')) msg = 'Bạn đã từ chối giao dịch trên MetaMask!';
                    if (msg.includes('insufficient')) msg = 'Số dư ví không đủ!';
                    _mdStatus.innerHTML = '<span style="color:#ef4444;">❌ ' + msg.substring(0, 100) + '</span>';
                    toast('error', 'Thất bại: ' + msg.substring(0, 50));
                } finally {
                    _mdBtn.disabled = false; _mdBtn.style.opacity = '1';
                }
            });
        }
    `,
    bindings: []
}

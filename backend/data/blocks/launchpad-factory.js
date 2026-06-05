import { FACTORY_ADDRESSES } from '../contracts/contractFactorys.js';

// ==================== KHỐI: BỆ PHÓNG DỰ ÁN (LAUNCHPAD FACTORY) ====================
export default {
    id: "launchpad-factory",
    name: "🚀 Tạo Bệ Phóng (IDO)",
    desc: "Tạo sự kiện gọi vốn cộng đồng cho Dự án Startup. Bán Token B lấy Token A (ClassCoin).",
    color: "#e11d48",
    label: "Lập Dự Án Gọi Vốn",
    exportHtml: () => `
    <div style="font-family:'Inter',sans-serif;background:#0f172a;color:#fff;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.5);width:340px;overflow:hidden;border:1px solid #1e293b;position:relative;">
        <div style="background:linear-gradient(135deg, #e11d48, #9f1239);padding:16px;text-align:center;">
            <h2 style="margin:0;font-size:16px;font-weight:900;letter-spacing:1px;display:flex;align-items:center;justify-content:center;gap:8px;">
                🚀 LẬP BỆ PHÓNG DỰ ÁN
            </h2>
            <div style="font-size:11px;color:#fecdd3;margin-top:6px;line-height:1.4;">
                Huy động vốn từ cộng đồng (IDO) cho Startup
            </div>
        </div>
        
        <div style="padding:16px;">
            <div style="background:#1e293b;border-radius:12px;padding:12px;border:1px solid #334155;margin-bottom:12px;">
                <div style="font-size:12px;color:#fb7185;font-weight:bold;margin-bottom:12px;border-bottom:1px solid #334155;padding-bottom:6px;">1. THÔNG SỐ GỌI VỐN</div>
                
                <div style="display:flex;flex-direction:column;gap:10px;">
                    <div>
                        <label style="font-size:10px;color:#94a3b8;">Địa chỉ Token Của Bạn (Sắp Bán):</label>
                        <input type="text" id="lpf-project-token" placeholder="0x..." style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#e2e8f0;font-size:12px;outline:none;margin-top:4px;">
                    </div>
                    <div>
                        <label style="font-size:10px;color:#94a3b8;">Địa chỉ Token Gọi Vốn (Ví dụ: ClassCoin):</label>
                        <input type="text" id="lpf-payment-token" placeholder="0x..." style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#e2e8f0;font-size:12px;outline:none;margin-top:4px;">
                    </div>
                    <div style="display:flex;gap:8px;">
                        <div style="flex:1;">
                            <label style="font-size:10px;color:#94a3b8;">Tỷ Giá (1 Mua Mấy):</label>
                            <input type="number" id="lpf-rate" placeholder="VD: 10" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#e2e8f0;font-size:12px;outline:none;margin-top:4px;">
                        </div>
                        <div style="flex:1;">
                            <label style="font-size:10px;color:#94a3b8;">Thời Gian (Phút):</label>
                            <input type="number" id="lpf-duration" placeholder="VD: 15" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#e2e8f0;font-size:12px;outline:none;margin-top:4px;">
                        </div>
                    </div>
                    <div style="display:flex;gap:8px;">
                        <div style="flex:1;">
                            <label style="font-size:10px;color:#94a3b8;">Soft Cap (Tối thiểu):</label>
                            <input type="number" id="lpf-softcap" placeholder="VD: 2000" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#e2e8f0;font-size:12px;outline:none;margin-top:4px;">
                        </div>
                        <div style="flex:1;">
                            <label style="font-size:10px;color:#94a3b8;">Hard Cap (Tối đa):</label>
                            <input type="number" id="lpf-hardcap" placeholder="VD: 5000" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#e2e8f0;font-size:12px;outline:none;margin-top:4px;">
                        </div>
                    </div>
                </div>

                <button id="lpf-create-btn" style="width:100%;padding:12px;border-radius:8px;border:none;background:linear-gradient(135deg,#f43f5e,#be123c);color:white;font-size:13px;font-weight:bold;cursor:pointer;margin-top:12px;">🚀 TẠO BỆ PHÓNG</button>
                <div id="lpf-create-status" style="margin-top:8px;font-size:11px;text-align:center;color:#94a3b8;min-height:16px;"></div>

                <div id="lpf-result-box" style="display:none;margin-top:12px;padding:12px;background:#064e3b;border:1px solid #047857;border-radius:8px;text-align:center;">
                    <div style="font-size:11px;color:#34d399;margin-bottom:4px;">🎉 Bệ Phóng Thành Công! Mã IDO:</div>
                    <div id="lpf-result-address" style="font-family:monospace;font-size:11px;color:#fff;word-break:break-all;background:#022c22;padding:6px;border-radius:4px;user-select:all;"></div>
                    <div style="font-size:10px;color:#6ee7b7;margin-top:6px;">Hãy Copy Mã Này Phát Cho Học Sinh!</div>
                </div>
            </div>

            <!-- CHỐT SỔ HOẶC RÚT TIỀN (FINALIZER) -->
            <div style="background:#1e293b;border-radius:12px;padding:12px;border:1px solid #334155;">
                <div style="font-size:12px;color:#facc15;font-weight:bold;margin-bottom:8px;border-bottom:1px solid #334155;padding-bottom:6px;">2. CHỐT SỔ GỌI VỐN (FOUNDER)</div>
                <div style="font-size:10px;color:#94a3b8;margin-bottom:10px;line-height:1.4;">Chủ dự án nhập Mã IDO vào đây để bấm CHỐT SỔ khi hết thời gian (hoặc đầy HardCap) và RÚT TIỀN VỐN về ví.</div>
                
                <input type="text" id="lpf-manage-addr" placeholder="Mã IDO (0x...)" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#e2e8f0;font-size:12px;outline:none;margin-bottom:8px;">
                
                <div style="display:flex;gap:8px;">
                    <!-- Nút nạp hàng (Tránh quên) -->
                    <button id="lpf-fund-btn" style="flex:1;background:#3b82f6;color:white;border:none;padding:10px;border-radius:8px;font-size:11px;font-weight:bold;cursor:pointer;">📥 NẠP HÀNG (TOKEN)</button>
                    <!-- Nút chốt sổ -->
                    <button id="lpf-finalize-btn" style="flex:1;background:#eab308;color:black;border:none;padding:10px;border-radius:8px;font-size:11px;font-weight:bold;cursor:pointer;">🏆 CHỐT SỔ & RÚT</button>
                </div>
                <div id="lpf-manage-status" style="margin-top:8px;font-size:11px;text-align:center;color:#94a3b8;min-height:16px;"></div>
            </div>
        </div>
    </div>`,

    engineCode: () => `
        var LPF_FACTORY_ADDR = '${FACTORY_ADDRESSES.LAUNCHPAD_FACTORY || '0x00'}';
        
        var LPF_FACTORY_ABI = [
            "function createLaunchpad(address _projectToken, address _paymentToken, uint256 _rate, uint256 _softCap, uint256 _hardCap, uint256 _durationMinutes) external returns (address)",
            "event LaunchpadCreated(address indexed creator, address indexed launchpadAddress, address projectToken, address paymentToken, uint256 hardCap)"
        ];
        
        var LPF_IDO_ABI = [
            "function finalize() external",
            "function isFinalized() view returns (bool)",
            "function isSuccessful() view returns (bool)"
        ];

        var LPF_ERC20_ABI = [
            "function transfer(address to, uint256 amount) external returns (bool)",
            "function balanceOf(address) view returns (uint256)",
            "function decimals() view returns (uint8)"
        ];

        // 1. TẠO BỆ PHÓNG
        document.getElementById('lpf-create-btn').addEventListener('click', async function() {
            if(!signer) return toast('error', 'Vui lòng kết nối ví!');
            if(LPF_FACTORY_ADDR === '0x00' || !LPF_FACTORY_ADDR) return toast('error', 'Chưa cấu hình LaunchpadFactory!');
            
            var pToken = document.getElementById('lpf-project-token').value.trim();
            var mToken = document.getElementById('lpf-payment-token').value.trim();
            var rate = document.getElementById('lpf-rate').value.trim();
            var dura = document.getElementById('lpf-duration').value.trim();
            var sCap = document.getElementById('lpf-softcap').value.trim();
            var hCap = document.getElementById('lpf-hardcap').value.trim();

            if(!ethers.utils.isAddress(pToken) || !ethers.utils.isAddress(mToken)) return toast('error', 'Địa chỉ Token không hợp lệ');
            if(!rate || !dura || !sCap || !hCap) return toast('error', 'Vui lòng điền đủ thông số');

            var btn = this; var status = document.getElementById('lpf-create-status');
            try {
                btn.disabled = true; btn.style.opacity = '0.5';
                status.innerHTML = '<span style="color:#fb7185;">⏳ Đang xin phép Bộ Xây Dựng (Blockchain)...</span>';
                
                var factory = new ethers.Contract(LPF_FACTORY_ADDR, LPF_FACTORY_ABI, signer);
                var tx = await factory.createLaunchpad(
                    pToken, mToken, 
                    parseInt(rate), 
                    ethers.utils.parseEther(sCap), 
                    ethers.utils.parseEther(hCap), 
                    parseInt(dura)
                );
                
                status.innerHTML = '<span style="color:#fb7185;">⏳ Chờ xác nhận giao dịch...</span>';
                var receipt = await tx.wait();
                
                var event = receipt.events.find(e => e.event === 'LaunchpadCreated');
                var idoAddr = event.args.launchpadAddress;

                status.innerHTML = '<span style="color:#10b981;">✅ Đã cất nóc Bệ Phóng thành công!</span>';
                document.getElementById('lpf-result-address').innerText = idoAddr;
                document.getElementById('lpf-result-box').style.display = 'block';
                document.getElementById('lpf-manage-addr').value = idoAddr;

                toast('success', 'Tạo Bệ Phóng thành công!');
                btn.innerText = '🚀 TẠO XONG';
            } catch(e) {
                btn.disabled = false; btn.style.opacity = '1';
                status.innerHTML = '<span style="color:#ef4444;">❌ ' + (e.reason || e.message).substring(0, 50) + '</span>';
            }
        });

        // 2. NẠP HÀNG VÀO BỆ PHÓNG
        document.getElementById('lpf-fund-btn').addEventListener('click', async function() {
            if(!signer) return toast('error', 'Vui lòng kết nối ví!');
            var idoAddr = document.getElementById('lpf-manage-addr').value.trim();
            var pTokenAddr = document.getElementById('lpf-project-token').value.trim();
            var hCap = document.getElementById('lpf-hardcap').value.trim();
            var rate = document.getElementById('lpf-rate').value.trim();

            if(!ethers.utils.isAddress(idoAddr) || !ethers.utils.isAddress(pTokenAddr)) return toast('error', 'Cần tạo dự án trước');
            if(!hCap || !rate) return toast('error', 'Nhập Hard Cap và Tỷ Giá ở trên để tính Toán lượng cần nạp!');

            // Tính số lượng Hàng (Token B) cần nạp = Hard Cap (Token A) * Rate
            var neededTokens = parseFloat(hCap) * parseFloat(rate);
            
            var btn = this; var status = document.getElementById('lpf-manage-status');
            try {
                btn.disabled = true; btn.style.opacity = '0.5';
                status.innerHTML = '<span style="color:#3b82f6;">⏳ Đang chuyển ' + neededTokens + ' Token vào Kho...</span>';
                
                var token = new ethers.Contract(pTokenAddr, LPF_ERC20_ABI, signer);
                var amountWei = ethers.utils.parseEther(neededTokens.toString());
                var tx = await token.transfer(idoAddr, amountWei);
                await tx.wait();

                status.innerHTML = '<span style="color:#10b981;">✅ Đã nhập đủ Hàng vào Kho! Chờ mở bán.</span>';
                btn.disabled = false; btn.style.opacity = '1';
                toast('success', 'Bơm hàng thành công!');
            } catch(e) {
                btn.disabled = false; btn.style.opacity = '1';
                status.innerHTML = '<span style="color:#ef4444;">❌ ' + (e.reason || e.message).substring(0, 50) + '</span>';
            }
        });

        // 3. CHỐT SỔ GỌI VỐN
        document.getElementById('lpf-finalize-btn').addEventListener('click', async function() {
            if(!signer) return toast('error', 'Kết nối ví!');
            var idoAddr = document.getElementById('lpf-manage-addr').value.trim();
            if(!ethers.utils.isAddress(idoAddr)) return toast('error', 'Nhập Mã IDO!');

            var btn = this; var status = document.getElementById('lpf-manage-status');
            try {
                btn.disabled = true; btn.style.opacity = '0.5';
                status.innerHTML = '<span style="color:#eab308;">⏳ Đang kiểm tra điều kiện chốt sổ...</span>';
                
                var ido = new ethers.Contract(idoAddr, LPF_IDO_ABI, signer);
                var tx = await ido.finalize();
                await tx.wait();

                var isSucc = await ido.isSuccessful();
                if(isSucc) {
                    status.innerHTML = '<span style="color:#10b981;">✅ GỌI VỐN THÀNH CÔNG! Đã rút tiền mặt (Coin A) về ví!</span>';
                } else {
                    status.innerHTML = '<span style="color:#ef4444;">❌ THẤT BẠI! Đã rút Token Ế về ví (Người mua sẽ tự rút lại vốn).</span>';
                }
                
                btn.disabled = false; btn.style.opacity = '1';
                toast('success', 'Chốt sổ xong!');
            } catch(e) {
                btn.disabled = false; btn.style.opacity = '1';
                status.innerHTML = '<span style="color:#ef4444;">❌ Lỗi: (Có thể chưa hết giờ hoặc chưa lấp đầy HardCap)</span>';
            }
        });
    `,
    bindings: []
}

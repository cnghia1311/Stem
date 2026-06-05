// ==================== KHỐI: CỔNG ĐẦU TƯ BỆ PHÓNG ====================
export default {
    id: "launchpad-dashboard",
    name: "🦈 Cổng Gọi Vốn (Shark)",
    desc: "Nơi học sinh bơm tiền góp vốn mua Token Dự án với giá ưu đãi (IDO).",
    color: "#be123c",
    label: "Đầu Tư Dự Án Startup",
    exportHtml: () => `
    <div style="font-family:'Inter',sans-serif;background:#0f172a;color:#fff;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.5);width:340px;overflow:hidden;border:1px solid #1e293b;position:relative;">
        <!-- Header -->
        <div style="background:linear-gradient(135deg, #be123c, #881337);padding:16px;text-align:center;position:relative;">
            <h2 style="margin:0;font-size:16px;font-weight:900;letter-spacing:1px;display:flex;align-items:center;justify-content:center;gap:8px;">
                🦈 CỔNG GỌI VỐN
            </h2>
            <div style="font-size:11px;color:#fecdd3;margin-top:6px;line-height:1.4;">
                Đầu tư sớm (Presale) vào các dự án rủi ro siêu lợi nhuận!
            </div>
            
            <div style="margin-top:12px;background:rgba(0,0,0,0.2);border-radius:8px;padding:10px;display:flex;align-items:center;">
                <input type="text" id="lpd-addr" placeholder="Nhập Mã Dự Án (0x...)" style="flex:1;background:transparent;border:none;color:#fff;font-size:11px;outline:none;">
                <button id="lpd-load-btn" style="background:#f43f5e;color:white;border:none;border-radius:4px;padding:6px 12px;font-size:11px;font-weight:bold;cursor:pointer;">🔄 TẢI</button>
            </div>
        </div>

        <div id="lpd-content" style="padding:16px;display:none;">
            <!-- Progress & Stats -->
            <div style="background:#1e293b;border-radius:12px;padding:12px;border:1px solid #334155;margin-bottom:12px;text-align:center;">
                <div style="font-size:13px;font-weight:bold;color:#fca5a5;" id="lpd-status-text">🟢 ĐANG MỞ BÁN</div>
                
                <div style="font-size:24px;font-weight:900;color:#10b981;margin:10px 0;" id="lpd-progress-pct">0%</div>
                
                <!-- Progress Bar -->
                <div style="width:100%;height:8px;background:#0f172a;border-radius:4px;overflow:hidden;margin-bottom:10px;border:1px solid #334155;">
                    <div id="lpd-progress-bar" style="height:100%;width:0%;background:linear-gradient(90deg, #10b981, #34d399);border-radius:4px;transition:width 0.5s;"></div>
                </div>

                <div style="display:flex;justify-content:space-between;font-size:10px;color:#94a3b8;">
                    <span id="lpd-raised">Đã gọi: 0</span>
                    <span id="lpd-hardcap-text">Tối đa: 0</span>
                </div>
            </div>

            <!-- Rate & Time -->
            <div style="display:flex;gap:8px;margin-bottom:12px;">
                <div style="flex:1;background:#1e293b;border-radius:8px;padding:10px;text-align:center;border:1px solid #334155;">
                    <div style="font-size:10px;color:#94a3b8;margin-bottom:4px;">Tỷ Giá Ưu Đãi</div>
                    <div style="font-size:12px;font-weight:bold;color:#fb7185;"><span id="lpd-rate-text">1 : 10</span></div>
                </div>
                <div style="flex:1;background:#1e293b;border-radius:8px;padding:10px;text-align:center;border:1px solid #334155;">
                    <div style="font-size:10px;color:#94a3b8;margin-bottom:4px;">Hạn Chót</div>
                    <div style="font-size:12px;font-weight:bold;color:#f59e0b;" id="lpd-time-left">Đang tải...</div>
                </div>
            </div>

            <!-- Action Area (Invest / Claim / Refund) -->
            <div style="background:#0f172a;border-radius:12px;padding:12px;border:1px solid #334155;text-align:center;">
                <div style="font-size:11px;color:#cbd5e1;margin-bottom:8px;">Số Vốn Của Bạn (Shark): <strong style="color:#38bdf8;" id="lpd-user-invest">0</strong></div>
                
                <!-- INVEST FORM -->
                <div id="lpd-invest-box">
                    <input type="text" id="lpd-invest-amt" placeholder="Số lượng góp vốn..." style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;outline:none;margin-bottom:8px;text-align:center;">
                    <button id="lpd-invest-btn" style="width:100%;background:linear-gradient(135deg,#2563eb,#3b82f6);color:white;border:none;padding:12px;border-radius:8px;font-size:13px;font-weight:bold;cursor:pointer;">💸 CHUYỂN TIỀN GÓP VỐN</button>
                </div>

                <!-- CLAIM/REFUND FORM -->
                <div id="lpd-claim-box" style="display:none;">
                    <div style="font-size:11px;color:#94a3b8;margin-bottom:8px;" id="lpd-claim-msg">Bệ phóng đã đóng cửa!</div>
                    <button id="lpd-claim-btn" style="width:100%;background:linear-gradient(135deg,#059669,#10b981);color:white;border:none;padding:12px;border-radius:8px;font-size:13px;font-weight:bold;cursor:pointer;">🏆 NHẬN TOKEN (CLAIM)</button>
                    <button id="lpd-refund-btn" style="width:100%;background:linear-gradient(135deg,#9f1239,#e11d48);color:white;border:none;padding:12px;border-radius:8px;font-size:13px;font-weight:bold;cursor:pointer;display:none;">📉 DỰ ÁN SỤP! RÚT LẠI VỐN</button>
                </div>

                <div id="lpd-action-status" style="margin-top:8px;font-size:11px;text-align:center;color:#94a3b8;min-height:16px;"></div>
            </div>
        </div>
    </div>`,

    engineCode: () => `
        var LPD_IDO_ABI = [
            "function invest(uint256 amount) external",
            "function claimOrRefund() external",
            "function totalRaised() view returns (uint256)",
            "function hardCap() view returns (uint256)",
            "function softCap() view returns (uint256)",
            "function rate() view returns (uint256)",
            "function endTime() view returns (uint256)",
            "function isFinalized() view returns (bool)",
            "function isSuccessful() view returns (bool)",
            "function paymentToken() view returns (address)",
            "function contributions(address) view returns (uint256)",
            "function hasClaimed(address) view returns (bool)"
        ];

        var LPD_ERC20_ABI = [
            "function approve(address spender, uint256 amount) external",
            "function allowance(address owner, address spender) view returns (uint256)"
        ];

        var _lpdAddr = '';
        var _lpdPaymentAddr = '';
        var _lpdTimer = null;

        document.getElementById('lpd-load-btn').addEventListener('click', async function() {
            if(!signer) return toast('error', 'Chưa kết nối ví!');
            var addr = document.getElementById('lpd-addr').value.trim();
            if(!ethers.utils.isAddress(addr)) return toast('error', 'Địa chỉ IDO không hợp lệ');

            var btn = this;
            try {
                btn.innerText = '⏳...'; btn.disabled = true;
                _lpdAddr = addr;
                var ido = new ethers.Contract(_lpdAddr, LPD_IDO_ABI, signer);
                
                var hardCapWei = await ido.hardCap();
                var softCapWei = await ido.softCap();
                var raisedWei = await ido.totalRaised();
                var rate = await ido.rate();
                var endTime = await ido.endTime();
                var isFin = await ido.isFinalized();
                var isSucc = false;
                if(isFin) isSucc = await ido.isSuccessful();
                _lpdPaymentAddr = await ido.paymentToken();
                
                var userAddr = await signer.getAddress();
                var myContWei = await ido.contributions(userAddr);
                var hasClaimed = await ido.hasClaimed(userAddr);

                var hCap = parseFloat(ethers.utils.formatEther(hardCapWei));
                var raised = parseFloat(ethers.utils.formatEther(raisedWei));
                var myCont = parseFloat(ethers.utils.formatEther(myContWei));

                document.getElementById('lpd-raised').innerText = 'Đã gọi: ' + raised;
                document.getElementById('lpd-hardcap-text').innerText = 'Max: ' + hCap;
                document.getElementById('lpd-rate-text').innerText = '1 : ' + rate.toString();
                document.getElementById('lpd-user-invest').innerText = myCont;

                var pct = hCap > 0 ? (raised / hCap) * 100 : 0;
                if(pct > 100) pct = 100;
                document.getElementById('lpd-progress-pct').innerText = pct.toFixed(1) + '%';
                document.getElementById('lpd-progress-bar').style.width = pct + '%';

                // Setup Status
                var investBox = document.getElementById('lpd-invest-box');
                var claimBox = document.getElementById('lpd-claim-box');
                var claimBtn = document.getElementById('lpd-claim-btn');
                var refBtn = document.getElementById('lpd-refund-btn');
                var statusTxt = document.getElementById('lpd-status-text');
                var claimMsg = document.getElementById('lpd-claim-msg');

                if(isFin) {
                    statusTxt.innerText = '🔴 ĐÃ CHỐT SỔ';
                    statusTxt.style.color = '#ef4444';
                    investBox.style.display = 'none';
                    claimBox.style.display = 'block';
                    
                    if(hasClaimed) {
                        claimMsg.innerText = 'Bạn đã rút tiền xong!';
                        claimBtn.style.display = 'none';
                        refBtn.style.display = 'none';
                    } else if(myCont > 0) {
                        claimMsg.innerText = isSucc ? 'Dự án THÀNH CÔNG! Chúc mừng bạn x10 tài sản!' : 'Dự án XỊT (Không đủ vốn tối thiểu). Bạn được hoàn 100% tiền!';
                        if(isSucc) {
                            claimBtn.style.display = 'block';
                            refBtn.style.display = 'none';
                        } else {
                            claimBtn.style.display = 'none';
                            refBtn.style.display = 'block';
                        }
                    } else {
                        claimMsg.innerText = 'Bạn không tham gia dự án này.';
                        claimBtn.style.display = 'none';
                        refBtn.style.display = 'none';
                    }
                } else {
                    statusTxt.innerText = '🟢 ĐANG MỞ BÁN (IDO)';
                    statusTxt.style.color = '#10b981';
                    investBox.style.display = 'block';
                    claimBox.style.display = 'none';
                }

                // Timer
                if(_lpdTimer) clearInterval(_lpdTimer);
                _lpdTimer = setInterval(() => {
                    var now = Math.floor(Date.now() / 1000);
                    var end = parseInt(endTime.toString());
                    var diff = end - now;
                    if(diff <= 0) {
                        document.getElementById('lpd-time-left').innerText = 'Hết Giờ!';
                        document.getElementById('lpd-time-left').style.color = '#ef4444';
                        if(!isFin) {
                            statusTxt.innerText = '🟠 CHỜ CHỦ DỰ ÁN CHỐT SỔ';
                            investBox.style.display = 'none';
                        }
                    } else {
                        var m = Math.floor(diff / 60);
                        var s = diff % 60;
                        document.getElementById('lpd-time-left').innerText = m + 'p ' + s + 's';
                        document.getElementById('lpd-time-left').style.color = '#f59e0b';
                    }
                }, 1000);

                document.getElementById('lpd-content').style.display = 'block';
                btn.innerText = '🔄 TẢI'; btn.disabled = false;
            } catch(e) {
                btn.innerText = '🔄 TẢI'; btn.disabled = false;
                toast('error', 'Lỗi tải IDO!');
            }
        });

        // ĐẦU TƯ
        document.getElementById('lpd-invest-btn').addEventListener('click', async function() {
            if(!signer) return toast('error', 'Kết nối ví!');
            var amt = document.getElementById('lpd-invest-amt').value.trim();
            if(!amt || isNaN(amt) || parseFloat(amt) <= 0) return toast('error', 'Nhập số tiền hợp lệ');
            
            var btn = this; var status = document.getElementById('lpd-action-status');
            try {
                btn.disabled = true; btn.style.opacity = '0.5';
                var amtWei = ethers.utils.parseEther(amt);
                
                status.innerHTML = '<span style="color:#f59e0b;">⏳ Đang ủy quyền (Approve)...</span>';
                var token = new ethers.Contract(_lpdPaymentAddr, LPD_ERC20_ABI, signer);
                var userAddr = await signer.getAddress();
                var allowed = await token.allowance(userAddr, _lpdAddr);
                
                if(allowed.lt(amtWei)) {
                    var txA = await token.approve(_lpdAddr, ethers.constants.MaxUint256); // Approve MAX cho lẹ
                    await txA.wait();
                }

                status.innerHTML = '<span style="color:#3b82f6;">⏳ Đang chuyển tiền Góp Vốn...</span>';
                var ido = new ethers.Contract(_lpdAddr, LPD_IDO_ABI, signer);
                var tx = await ido.invest(amtWei);
                await tx.wait();

                status.innerHTML = '<span style="color:#10b981;">✅ Đã đầu tư thành công! Chờ dự án chốt sổ nhé.</span>';
                btn.disabled = false; btn.style.opacity = '1';
                document.getElementById('lpd-invest-amt').value = '';
                document.getElementById('lpd-load-btn').click();
                toast('success', 'Đầu tư thành công!');
            } catch(e) {
                btn.disabled = false; btn.style.opacity = '1';
                status.innerHTML = '<span style="color:#ef4444;">❌ ' + (e.reason || e.message).substring(0, 50) + '</span>';
            }
        });

        // CLAIM / REFUND (Chung 1 hàm)
        async function doClaimOrRefund(btnId) {
            if(!signer) return toast('error', 'Kết nối ví!');
            var btn = document.getElementById(btnId);
            var status = document.getElementById('lpd-action-status');
            try {
                btn.disabled = true; btn.style.opacity = '0.5';
                status.innerHTML = '<span style="color:#3b82f6;">⏳ Đang giao tiếp với Hợp đồng...</span>';
                
                var ido = new ethers.Contract(_lpdAddr, LPD_IDO_ABI, signer);
                var tx = await ido.claimOrRefund();
                await tx.wait();

                status.innerHTML = '<span style="color:#10b981;">✅ Giao dịch thành công! Kiểm tra ví của bạn!</span>';
                document.getElementById('lpd-load-btn').click();
                toast('success', 'Đã rút tiền/token thành công!');
            } catch(e) {
                btn.disabled = false; btn.style.opacity = '1';
                status.innerHTML = '<span style="color:#ef4444;">❌ ' + (e.reason || e.message).substring(0, 50) + '</span>';
            }
        }

        document.getElementById('lpd-claim-btn').addEventListener('click', function() { doClaimOrRefund('lpd-claim-btn'); });
        document.getElementById('lpd-refund-btn').addEventListener('click', function() { doClaimOrRefund('lpd-refund-btn'); });
    `,
    bindings: []
}

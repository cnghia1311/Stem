import { FACTORY_ADDRESSES } from '../contracts/contractFactorys.js';

// ==================== KHỐI: ĐI BỘ NHẬN THƯỞNG (MOVE TO EARN) ====================
export default {
    id: "move-to-earn",
    name: "🏃‍♂️ Đi Bộ Nhận Thưởng",
    desc: "Đo khoảng cách chạy bộ GPS, học sinh hoàn thành cự ly sẽ được mở khóa đúc NFT",
    color: "#22c55e",
    label: "Move-to-Earn",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#22c55e;">
        <div class="khoi-title" style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
            <span style="font-size:24px;">🏃‍♂️</span>
            <span style="background:linear-gradient(135deg,#22c55e,#16a34a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:16px;letter-spacing:1px;">ĐI BỘ NHẬN THƯỞNG (M2E)</span>
        </div>

        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:15px;margin-bottom:12px;">
            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Địa chỉ Contract Bộ Sưu Tập</label>
            <input type="text" id="m2e-col-addr" placeholder="0x..." style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;margin-bottom:12px;">

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <div>
                    <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Mã Phần Thưởng</label>
                    <input type="number" id="m2e-token-id" placeholder="VD: 0" min="0" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:14px;outline:none;">
                </div>
                <div>
                    <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Mục Tiêu (Mét)</label>
                    <input type="number" id="m2e-target-dist" value="500" min="10" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:14px;outline:none;color:#fcd34d;font-weight:bold;">
                </div>
            </div>
            <div style="font-size:10px;color:#64748b;margin-top:8px;">💡 Có thể gian lận bằng cách chỉnh số mét? Không lo, ở sự kiện thật bạn ẩn ô này đi là xong!</div>
        </div>
        <!-- BƯỚC 1: CẤP QUYỀN GPS -->
        <div id="m2e-gps-gate" style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:14px;margin-bottom:12px;">
            <div style="font-size:12px;color:#94a3b8;font-weight:bold;margin-bottom:8px;">🛰️ Bước 1 — Cho phép truy cập Vị trí</div>
            <button id="m2e-gps-btn" style="width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(135deg,#0ea5e9,#0284c7);color:white;font-size:14px;font-weight:800;cursor:pointer;letter-spacing:0.5px;">🛰️ KẾT NỐI GPS</button>
            <div id="m2e-gps-perm" style="margin-top:8px;font-size:11px;color:#94a3b8;text-align:center;line-height:1.5;">Chưa kết nối — bấm nút trên để cấp quyền Vị trí.</div>
        </div>
        <div style="text-align:center;padding:20px;background:#1e293b;border-radius:12px;margin-bottom:15px;border:2px dashed #22c55e;">
            <div style="font-size:12px;color:#cbd5e1;margin-bottom:10px;font-weight:bold;">TIẾN ĐỘ HOÀN THÀNH</div>
            <div style="font-size:36px;font-weight:900;color:#22c55e;margin-bottom:10px;" id="m2e-progress-text">0 / 500m</div>
            
            <div style="width:100%;height:14px;background:#0f172a;border-radius:7px;overflow:hidden;margin-bottom:10px;border:1px solid #334155;">
                <div id="m2e-progress-bar" style="height:100%;width:0%;background:linear-gradient(90deg,#22c55e,#4ade80);transition:width 0.5s ease;"></div>
            </div>
            
            <div id="m2e-gps-status" style="font-size:11px;color:#94a3b8;">🛑 Đang chờ bắt đầu...</div>
        </div>

        <button id="m2e-start-btn" disabled style="width:100%;padding:14px;border-radius:10px;border:none;background:#475569;color:#94a3b8;font-size:15px;font-weight:800;cursor:not-allowed;letter-spacing:1px;margin-bottom:10px;">🏃 BẮT ĐẦU CHẠY BỘ</button>
        
        <button id="m2e-claim-btn" style="width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#ec4899,#be185d);color:white;font-size:15px;font-weight:800;cursor:pointer;letter-spacing:1px;display:none;box-shadow:0 4px 15px rgba(236,72,153,0.4);animation: pulse 1.5s infinite;">🎁 ĐÚC NFT PHẦN THƯỞNG</button>
        
        <div id="m2e-status" style="margin-top:10px;font-size:12px;text-align:center;color:#94a3b8;min-height:20px;"></div>
        
        <style>
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.02); }
                100% { transform: scale(1); }
            }
        </style>
    </div>`,
    
    engineCode: () => `
        var FC1155_ADDR = '${FACTORY_ADDRESSES.FREE_MINT_1155}';
        var FC1155_ABI = [
            "function claimBadge(address collection, uint256 tokenId, uint256 amount) public"
        ];

        var m2eColInput = document.getElementById('m2e-col-addr');
        var m2eIdInput = document.getElementById('m2e-token-id');
        var m2eTargetInput = document.getElementById('m2e-target-dist');
        var m2eStartBtn = document.getElementById('m2e-start-btn');
        var m2eClaimBtn = document.getElementById('m2e-claim-btn');
        var m2eProgressText = document.getElementById('m2e-progress-text');
        var m2eProgressBar = document.getElementById('m2e-progress-bar');
        var m2eGpsStatus = document.getElementById('m2e-gps-status');
        var m2eTxStatus = document.getElementById('m2e-status');
        var m2eGpsBtn  = document.getElementById('m2e-gps-btn');
        var m2eGpsPerm = document.getElementById('m2e-gps-perm');
        var gpsReady = false;

        function m2eSetPerm(msg, color) {
            if (m2eGpsPerm) m2eGpsPerm.innerHTML = '<span style="color:' + (color || '#94a3b8') + '">' + msg + '</span>';
        }

        function m2eUnlockStart(ok) {
            gpsReady = ok;
            if (!m2eStartBtn) return;
            m2eStartBtn.disabled = !ok;
            m2eStartBtn.style.background = ok ? 'linear-gradient(135deg,#3b82f6,#2563eb)' : '#475569';
            m2eStartBtn.style.color      = ok ? '#fff' : '#94a3b8';
            m2eStartBtn.style.cursor     = ok ? 'pointer' : 'not-allowed';
            m2eStartBtn.style.boxShadow  = ok ? '0 4px 15px rgba(59,130,246,0.3)' : 'none';
        }

        function m2eGpsOk(accuracy) {
            m2eUnlockStart(true);
            if (m2eGpsBtn) {
                m2eGpsBtn.innerText = '✅ GPS ĐÃ SẴN SÀNG';
                m2eGpsBtn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
            }
            m2eSetPerm('✅ Đã cấp quyền Vị trí'
                + (accuracy ? ' (sai số ~' + Math.round(accuracy) + 'm)' : '')
                + ' — bấm BẮT ĐẦU CHẠY BỘ ở dưới.', '#10b981');
        }

        // Kiểm tra điều kiện ngay khi mở trang
        (function m2eCheckGps() {
            if (!('geolocation' in navigator)) {
                m2eSetPerm('❌ Trình duyệt này không hỗ trợ GPS.', '#ef4444');
                return;
            }
            if (!window.isSecureContext) {
                m2eSetPerm('❌ Trang đang chạy HTTP nên trình duyệt CHẶN GPS.<br>Phải mở bằng <b>https://</b> hoặc <b>localhost</b>.', '#ef4444');
                return;
            }
            if (navigator.permissions && navigator.permissions.query) {
                navigator.permissions.query({ name: 'geolocation' }).then(function(st) {
                    if (st.state === 'granted') m2eGpsOk();
                    else if (st.state === 'denied') m2eSetPerm('🚫 Bạn đã CHẶN quyền Vị trí. Bấm ổ khoá 🔒 trên thanh địa chỉ → bật lại Vị trí → tải lại trang.', '#ef4444');
                    st.onchange = function() { if (st.state === 'granted') m2eGpsOk(); };
                }).catch(function(){});
            }
        })();

        if (m2eGpsBtn) {
            m2eGpsBtn.addEventListener('click', function() {
                if (!('geolocation' in navigator)) { toast('error', 'Thiết bị không hỗ trợ GPS!'); return; }
                if (!window.isSecureContext) { toast('error', 'Phải mở trang bằng HTTPS mới dùng được GPS!'); return; }

                m2eGpsBtn.disabled = true;
                m2eSetPerm('⏳ Đang xin quyền và dò vệ tinh...', '#38bdf8');

                navigator.geolocation.getCurrentPosition(function(pos) {
                    m2eGpsBtn.disabled = false;
                    m2eGpsOk(pos.coords.accuracy);
                    toast('success', '🛰️ Đã kết nối GPS!');
                }, function(err) {
                    m2eGpsBtn.disabled = false;
                    var s = 'Không lấy được vị trí.';
                    if (err.code === 1) s = '🚫 Bạn đã từ chối quyền Vị trí. Bấm ổ khoá 🔒 trên thanh địa chỉ → cho phép Vị trí → thử lại.';
                    if (err.code === 2) s = '📡 Không bắt được tín hiệu. Hãy ra ngoài trời thoáng rồi thử lại.';
                    if (err.code === 3) s = '⌛ Quá thời gian chờ. Thử lại lần nữa.';
                    m2eSetPerm(s, '#ef4444');
                    toast('error', s.replace(/<[^>]+>/g, '').substring(0, 60));
                }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
            });
        }

        // Tự động điền qua URL Parameter để giáo viên tạo mã QR dễ dàng
        try {
            var urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('col') && m2eColInput) m2eColInput.value = urlParams.get('col');
            if (urlParams.get('id') && m2eIdInput) m2eIdInput.value = urlParams.get('id');
            if (urlParams.get('dist') && m2eTargetInput) m2eTargetInput.value = urlParams.get('dist');
        } catch(e) {}

        // Biến lưu trạng thái GPS
        var totalDistance = 0;
        var isTracking = false;
        var watchId = null;
        var lastLat = null;
        var lastLng = null;

        // Khôi phục dữ liệu đi bộ từ localStorage (Phòng khi lỡ tay tắt web)
        function getSaveKey() {
            var c = m2eColInput ? m2eColInput.value.trim() : 'empty';
            var t = m2eIdInput ? m2eIdInput.value.trim() : '0';
            return 'm2e_dist_' + c + '_' + t;
        }

        try {
            if(m2eColInput && m2eIdInput) {
                var savedDist = localStorage.getItem(getSaveKey());
                if(savedDist) {
                    totalDistance = parseFloat(savedDist);
                    setTimeout(updateM2EUI, 100);
                }
            }
        } catch(e){}

        function updateM2EUI() {
            if(!m2eTargetInput) return;
            var target = parseFloat(m2eTargetInput.value) || 500;
            if(target < 10) target = 10;
            
            // Không cho vượt quá 100% để hiển thị đẹp
            var displayDist = totalDistance > target ? target : totalDistance; 
            
            m2eProgressText.innerText = Math.floor(displayDist) + ' / ' + target + 'm';
            var pct = (displayDist / target) * 100;
            m2eProgressBar.style.width = pct + '%';
            
            if(totalDistance >= target) {
                // Hoàn thành mục tiêu!
                m2eStartBtn.style.display = 'none';
                m2eClaimBtn.style.display = 'block';
                m2eGpsStatus.innerHTML = '<span style="color:#10b981;font-weight:bold;">✅ ĐÃ HOÀN THÀNH MỤC TIÊU! CÓ THỂ NHẬN THƯỞNG!</span>';
                if(isTracking) stopTracking();
            } else {
                m2eStartBtn.style.display = 'block';
                m2eClaimBtn.style.display = 'none';
            }
        }

        if(m2eTargetInput) {
            m2eTargetInput.addEventListener('input', updateM2EUI);
        }

        // Công thức chuẩn Haversine để tính khoảng cách giữa 2 tọa độ GPS (Đơn vị: Mét)
        function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
            var R = 6371; 
            var dLat = (lat2-lat1) * (Math.PI/180);
            var dLon = (lon2-lon1) * (Math.PI/180); 
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * 
                    Math.sin(dLon/2) * Math.sin(dLon/2); 
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            return R * c * 1000;
        }

        function stopTracking() {
            if(watchId !== null) navigator.geolocation.clearWatch(watchId);
            isTracking = false;
            m2eStartBtn.innerText = '🏃 TIẾP TỤC CHẠY BỘ';
            m2eStartBtn.style.background = 'linear-gradient(135deg,#3b82f6,#2563eb)';
            
            if(m2eTargetInput && totalDistance < (parseFloat(m2eTargetInput.value)||500)) {
                m2eGpsStatus.innerHTML = '<span style="color:#f59e0b;">⏸️ Đã tạm dừng tracking GPS.</span>';
            }
        }

        if(m2eStartBtn) {
            m2eStartBtn.addEventListener('click', function() {
                if(!isTracking) {
                    // BẮT ĐẦU CHẠY — chỉ chạy được sau khi đã cấp quyền GPS ở Bước 1
                    if (!gpsReady) {
                        toast('error', 'Hãy bấm 🛰️ KẾT NỐI GPS ở trên trước!');
                        return;
                    }
                    isTracking = true;
                    m2eStartBtn.innerText = '⏸️ TẠM DỪNG CHẠY';
                    m2eStartBtn.style.background = '#ef4444';
                    m2eGpsStatus.innerHTML = '<span style="color:#38bdf8;">📡 Đang dò tìm vệ tinh GPS... Hãy cầm điện thoại và di chuyển!</span>';
                    lastLat = null;
                    lastLng = null;
                    
                    updateM2EUI();

                    watchId = navigator.geolocation.watchPosition(function(position) {
                        var lat = position.coords.latitude;
                        var lng = position.coords.longitude;
                        
                        if(lastLat !== null && lastLng !== null) {
                            var d = getDistanceFromLatLonInM(lastLat, lastLng, lat, lng);
                            
                            // BỘ LỌC THÔNG MINH CHỐNG GIAN LẬN
                            // - Bỏ qua nếu dịch chuyển dưới 1.5m (Do sai số GPS khi đứng im)
                            // - Bỏ qua nếu dịch chuyển quá 40m trong vài giây (Do lên xe máy phóng nhanh)
                            if(d > 1.5 && d < 40) {
                                totalDistance += d;
                                try { localStorage.setItem(getSaveKey(), totalDistance.toString()); } catch(e){}
                                updateM2EUI();
                            }
                        }
                        
                        lastLat = lat;
                        lastLng = lng;
                        m2eGpsStatus.innerHTML = '<span style="color:#10b981;">🛰️ Bắt được GPS. Đang ghi nhận bước chạy... (Cập nhật 3s/lần)</span>';
                        
                    }, function(error) {
                        var errStr = 'Lỗi không xác định';
                        if(error.code === 1) errStr = 'Bạn đã TỪ CHỐI cấp quyền Vị trí (GPS)! Hãy F5 và Cho Phép.';
                        if(error.code === 2) errStr = 'Không thể xác định vị trí hiện tại.';
                        toast('error', errStr);
                        m2eGpsStatus.innerHTML = '<span style="color:#ef4444;">❌ ' + errStr + '</span>';
                        stopTracking();
                    }, {
                        enableHighAccuracy: true,  // Yêu cầu GPS độ chính xác cao nhất
                        maximumAge: 0,
                        timeout: 10000
                    });
                    
                } else {
                    // TẠM DỪNG
                    stopTracking();
                }
            });
        }

        // Logic Đúc NFT sau khi hoàn thành
        if(m2eClaimBtn) {
            m2eClaimBtn.addEventListener('click', async function() {
                if (!signer) { toast('error', 'Cần kết nối ví (🦊) trước!'); return; }
                
                var colAddr = m2eColInput.value.trim();
                var tokenId = m2eIdInput.value.trim();
                
                if (!colAddr || !colAddr.startsWith('0x') || colAddr.length !== 42) {
                    toast('error', 'Địa chỉ Bộ Sưu Tập không hợp lệ!'); return;
                }
                
                try {
                    m2eClaimBtn.disabled = true; m2eClaimBtn.style.opacity = '0.5';
                    m2eTxStatus.innerHTML = '<span style="color:#ec4899;">⏳ Đang xin Nhận Thưởng... (Xác nhận trên MetaMask)</span>';
                    
                    var freeMintMachine = new ethers.Contract(FC1155_ADDR, FC1155_ABI, signer);
                    var tx = await freeMintMachine.claimBadge(colAddr, parseInt(tokenId), 1);
                    
                    m2eTxStatus.innerHTML = '<span style="color:#ec4899;">⛏️ Đang chờ Blockchain xác nhận...</span>';
                    await tx.wait();
                    
                    m2eTxStatus.innerHTML = '<span style="color:#10b981;font-size:14px;font-weight:bold;">✅ Tuyệt vời! Bạn đã nhận thành công Huy Chương!</span>';
                    toast('success', '🎁 Nhận phần thưởng thành công!');
                    
                    // Reset tiến độ về 0 nếu muốn chạy vòng 2 (tuỳ chọn)
                    // totalDistance = 0; localStorage.setItem(getSaveKey(), "0");
                    
                } catch(e) {
                    var msg = e.reason || e.message || 'Lỗi không xác định';
                    if (msg.includes('user rejected')) msg = 'Bạn đã từ chối giao dịch trên MetaMask!';
                    if (msg.includes('Not authorized')) msg = 'Bộ sưu tập này chưa cấp quyền cho Máy Phát Quà!';
                    m2eTxStatus.innerHTML = '<span style="color:#ef4444;">❌ ' + msg.substring(0, 100) + '</span>';
                    toast('error', 'Nhận thất bại: ' + msg.substring(0, 50));
                } finally {
                    m2eClaimBtn.disabled = false; m2eClaimBtn.style.opacity = '1';
                }
            });
        }
    `,
    bindings: []
}

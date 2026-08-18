import { FACTORY_ADDRESSES } from '../contracts/contractFactorys.js';

// ==================== KHỐI: TÌM KHO BÁU NFT (TREASURE HUNT) ====================
export default {
    id: "treasure-hunt",
    name: "🗺️ Tìm Kho Báu NFT",
    desc: "Giấu NFT tại một tọa độ GPS thực tế. Học sinh dò Radar để tìm và khai quật kho báu.",
    color: "#f59e0b", // Amber
    label: "Tìm Kho Báu",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#f59e0b;">
        <div class="khoi-title" style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
            <span style="font-size:24px;">🗺️</span>
            <span style="background:linear-gradient(135deg,#f59e0b,#d97706);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:16px;letter-spacing:1px;">TÌM KHO BÁU (TREASURE HUNT)</span>
        </div>

        <!-- CẤU HÌNH CHO GIÁO VIÊN (Sẽ bị ẩn khi xuất bản nếu dùng CSS, nhưng hiện tại cứ để hiển thị để hs xem nếu cần, hoặc giáo viên set cứng) -->
        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:15px;margin-bottom:12px;">
            <div style="display:grid;grid-template-columns:1fr;gap:12px;margin-bottom:12px;">
                <div>
                    <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Địa chỉ Contract Bộ Sưu Tập</label>
                    <input type="text" id="th-col-addr" placeholder="0x..." style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;">
                </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
                <div>
                    <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Mã Huy Hiệu</label>
                    <input type="number" id="th-token-id" placeholder="0" min="0" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:14px;outline:none;">
                </div>
                <div>
                    <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Chế độ chơi</label>
                    <select id="th-mode" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#fcd34d;font-size:13px;outline:none;font-weight:bold;">
                        <option value="radar">📡 Hiện khoảng cách (Radar)</option>
                        <option value="riddle">🕵️ Ẩn khoảng cách (Giải đố)</option>
                    </select>
                </div>
            </div>

            <div style="background:#1e293b;padding:10px;border-radius:8px;border:1px solid #475569;">
                <label style="display:block;font-size:12px;color:#f59e0b;margin-bottom:8px;font-weight:bold;text-align:center;">TỌA ĐỘ GIẤU KHO BÁU</label>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
                    <input type="text" id="th-lat" placeholder="Vĩ độ (Lat)" style="width:100%;padding:8px;border-radius:6px;border:1px solid #334155;background:#0f172a;color:#94a3b8;font-size:11px;outline:none;">
                    <input type="text" id="th-lng" placeholder="Kinh độ (Lng)" style="width:100%;padding:8px;border-radius:6px;border:1px solid #334155;background:#0f172a;color:#94a3b8;font-size:11px;outline:none;">
                </div>
                <div style="display:flex;gap:8px;">
                    <input type="number" id="th-radius" value="15" placeholder="Bán kính (m)" style="width:70px;padding:8px;border-radius:6px;border:1px solid #334155;background:#0f172a;color:#e2e8f0;font-size:12px;outline:none;text-align:center;" title="Bán kính cho phép (mét)">
                    <button id="th-set-gps-btn" style="flex:1;padding:8px;border-radius:6px;border:none;background:#f59e0b;color:white;font-size:11px;font-weight:bold;cursor:pointer;">📍 CHỐT VỊ TRÍ ĐANG ĐỨNG</button>
                </div>
            </div>
            <div style="font-size:10px;color:#64748b;margin-top:8px;text-align:center;">Giáo viên có thể cài đặt thông số qua Link URL để phát cho học sinh</div>
        </div>

        <!-- MÀN HÌNH CHƠI CHO HỌC SINH -->
        <div style="text-align:center;padding:20px;background:#1e293b;border-radius:12px;margin-bottom:15px;border:2px solid #334155;position:relative;overflow:hidden;">
            <!-- Animation Radar Background -->
            <div id="th-radar-anim" style="display:none;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:200px;height:200px;border-radius:50%;border:2px solid rgba(245,158,11,0.2);background:radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%);">
                <div style="position:absolute;top:0;left:50%;width:2px;height:50%;background:linear-gradient(to bottom, transparent, #f59e0b);transform-origin:bottom center;animation: radarScan 2s linear infinite;"></div>
            </div>

            <div style="position:relative;z-index:2;">
                <div id="th-distance-display" style="font-size:42px;font-weight:900;color:#94a3b8;margin-bottom:5px;font-family:monospace;text-shadow:0 0 10px rgba(0,0,0,0.5);">--- m</div>
                <div id="th-status-msg" style="font-size:13px;color:#cbd5e1;font-weight:bold;margin-bottom:15px;">Chưa bắt đầu dò tìm</div>
                
                <button id="th-start-btn" style="width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#0ea5e9,#0284c7);color:white;font-size:15px;font-weight:800;cursor:pointer;letter-spacing:1px;box-shadow:0 4px 15px rgba(14,165,233,0.3);">🧭 BẬT RADAR TÌM KIẾM</button>
                
                <button id="th-claim-btn" style="width:100%;padding:16px;border-radius:10px;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:white;font-size:16px;font-weight:900;cursor:pointer;letter-spacing:1px;display:none;box-shadow:0 4px 20px rgba(245,158,11,0.5);animation: thPulse 1s infinite;">🎁 KHAI QUẬT KHO BÁU!</button>
            </div>
        </div>

        <div id="th-tx-status" style="margin-top:10px;font-size:12px;text-align:center;color:#94a3b8;min-height:20px;"></div>
        
        <style>
            @keyframes radarScan { 100% { transform: rotate(360deg); } }
            @keyframes thPulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        </style>
    </div>`,
    
    engineCode: () => `
        var FC1155_ADDR = '${FACTORY_ADDRESSES.FREE_MINT_1155}';
        var FC1155_ABI = [
            "function claimBadge(address collection, uint256 tokenId, uint256 amount) public"
        ];

        var thColInput = document.getElementById('th-col-addr');
        var thIdInput = document.getElementById('th-token-id');
        var thModeSelect = document.getElementById('th-mode');
        var thLatInput = document.getElementById('th-lat');
        var thLngInput = document.getElementById('th-lng');
        var thRadiusInput = document.getElementById('th-radius');
        var thSetGpsBtn = document.getElementById('th-set-gps-btn');
        
        var thDistDisplay = document.getElementById('th-distance-display');
        var thStatusMsg = document.getElementById('th-status-msg');
        var thStartBtn = document.getElementById('th-start-btn');
        var thClaimBtn = document.getElementById('th-claim-btn');
        var thRadarAnim = document.getElementById('th-radar-anim');
        var thTxStatus = document.getElementById('th-tx-status');

        // Parse URL params for easy setup
        try {
            var urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('col') && thColInput) thColInput.value = urlParams.get('col');
            if (urlParams.get('id') && thIdInput) thIdInput.value = urlParams.get('id');
            if (urlParams.get('lat') && thLatInput) thLatInput.value = urlParams.get('lat');
            if (urlParams.get('lng') && thLngInput) thLngInput.value = urlParams.get('lng');
            if (urlParams.get('rad') && thRadiusInput) thRadiusInput.value = urlParams.get('rad');
            if (urlParams.get('mode') && thModeSelect) thModeSelect.value = urlParams.get('mode');
            
            // Bypass ngầm (Đã mã hóa cơ bản để chống học sinh đoán được chữ found=1)
            var secretCode = btoa("stem_treasure_unlocked"); // Tạo ra chuỗi c3RlbV90cmVhc3VyZV91bmxvY2tlZA==
            if (urlParams.get('_proof') === secretCode) {
                setTimeout(() => {
                    thStartBtn.style.display = 'none';
                    thClaimBtn.style.display = 'block';
                    thDistDisplay.innerText = "0 m";
                    thDistDisplay.style.color = '#10b981';
                    thStatusMsg.innerHTML = '<span style="color:#10b981;font-size:16px;">🎉 ĐÃ TÌM THẤY! BẤM KHAI QUẬT THÔI!</span>';
                }, 500);
            }
        } catch(e) {}

        // Haversine formula
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

        // Logic "Chốt vị trí" cho Giáo viên
        if(thSetGpsBtn) {
            thSetGpsBtn.addEventListener('click', function() {
                if (!navigator.geolocation) { toast('error', 'Trình duyệt không hỗ trợ GPS'); return; }
                thSetGpsBtn.innerText = "Đang lấy...";
                navigator.geolocation.getCurrentPosition(function(pos) {
                    thLatInput.value = pos.coords.latitude;
                    thLngInput.value = pos.coords.longitude;
                    thSetGpsBtn.innerText = "📍 ĐÃ CHỐT";
                    setTimeout(() => thSetGpsBtn.innerText = "📍 CHỐT VỊ TRÍ ĐANG ĐỨNG", 2000);
                    toast('success', 'Đã lưu tọa độ hiện tại làm Kho Báu!');
                }, function(err) {
                    thSetGpsBtn.innerText = "Lỗi GPS";
                    toast('error', 'Không thể lấy GPS. Vui lòng cấp quyền.');
                }, { enableHighAccuracy: true });
            });
        }

        // Logic Tìm kiếm cho Học sinh
        var thWatchId = null;
        var thIsTracking = false;

        function thStopTracking() {
            if(thWatchId !== null) navigator.geolocation.clearWatch(thWatchId);
            thIsTracking = false;
            thStartBtn.innerText = '🧭 BẬT RADAR TÌM KIẾM';
            thStartBtn.style.background = 'linear-gradient(135deg,#0ea5e9,#0284c7)';
            thRadarAnim.style.display = 'none';
        }

        if(thStartBtn) {
            thStartBtn.addEventListener('click', function() {
                if(!thIsTracking) {
                    var targetLat = parseFloat(thLatInput.value);
                    var targetLng = parseFloat(thLngInput.value);
                    var radius = parseFloat(thRadiusInput.value) || 15;
                    var mode = thModeSelect.value;
                    
                    if(isNaN(targetLat) || isNaN(targetLng)) {
                        toast('error', 'Giáo viên chưa cài đặt tọa độ Kho Báu!'); return;
                    }
                    if (!navigator.geolocation) {
                        toast('error', 'Điện thoại không hỗ trợ GPS!'); return;
                    }

                    thIsTracking = true;
                    thStartBtn.innerText = '⏸️ TẮT RADAR';
                    thStartBtn.style.background = '#64748b';
                    thRadarAnim.style.display = 'block';
                    
                    thStatusMsg.innerHTML = '<span style="color:#fcd34d;">📡 Đang quét vệ tinh khu vực...</span>';
                    thDistDisplay.style.color = '#94a3b8';

                    thWatchId = navigator.geolocation.watchPosition(function(position) {
                        var myLat = position.coords.latitude;
                        var myLng = position.coords.longitude;
                        
                        var dist = getDistanceFromLatLonInM(myLat, myLng, targetLat, targetLng);
                        
                        if(dist <= radius) {
                            // TÌM THẤY!
                            thStopTracking();
                            thStartBtn.style.display = 'none';
                            thClaimBtn.style.display = 'block';
                            thDistDisplay.innerText = "0 m";
                            thDistDisplay.style.color = '#10b981';
                            thStatusMsg.innerHTML = '<span style="color:#10b981;font-size:16px;">🎉 KHO BÁU NGAY DƯỚI CHÂN BẠN!</span>';
                            
                            // Gắn mác đã tìm thấy vào URL để có thể nhảy sang MetaMask an toàn
                            try {
                                var newUrl = new URL(window.location.href);
                                newUrl.searchParams.set('_proof', btoa("stem_treasure_unlocked"));
                                window.history.replaceState(null, '', newUrl.toString());
                            } catch(e){}

                            // Hiệu ứng ăn mừng — bám theo chính khối này thay vì tìm id không tồn tại
                            try {
                                var thBox = thStartBtn.closest('.khoi');
                                if (thBox) {
                                    thBox.style.borderColor = '#10b981';
                                    thBox.style.boxShadow = '0 0 30px rgba(16,185,129,0.3)';
                                }
                            } catch(e) {}
                        } else {
                            // ĐANG TÌM
                            if(mode === 'radar') {
                                thDistDisplay.innerText = Math.floor(dist) + ' m';
                                if(dist > 100) thDistDisplay.style.color = '#ef4444'; // Red = Far
                                else if(dist > 40) thDistDisplay.style.color = '#f59e0b'; // Yellow = Warm
                                else thDistDisplay.style.color = '#84cc16'; // Lime = Close
                                
                                thStatusMsg.innerHTML = '<span style="color:#38bdf8;">Đang cập nhật vị trí... Hãy di chuyển!</span>';
                            } else {
                                // Riddle mode
                                thDistDisplay.innerText = "??? m";
                                thDistDisplay.style.color = '#6366f1';
                                thStatusMsg.innerHTML = '<span style="color:#a5b4fc;">🕵️ Vẫn chưa tới nơi. Hãy giải mã mật thư!</span>';
                            }
                        }
                        
                    }, function(error) {
                        thStopTracking();
                        toast('error', 'Lỗi GPS: ' + error.message);
                        thStatusMsg.innerHTML = '<span style="color:#ef4444;">❌ Mất tín hiệu GPS (' + error.message + ')</span>';
                    }, { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 });
                    
                } else {
                    thStopTracking();
                    thStatusMsg.innerHTML = 'Đã tắt Radar';
                }
            });
        }

        // Đào kho báu (Mint NFT)
        if(thClaimBtn) {
            thClaimBtn.addEventListener('click', async function() {
                if (!signer) { toast('error', 'Cần kết nối ví (🦊) trước!'); return; }
                
                var colAddr = thColInput.value.trim();
                var tokenId = thIdInput.value.trim();
                
                if (!colAddr || colAddr.length !== 42) { toast('error', 'Địa chỉ Bộ Sưu Tập không hợp lệ!'); return; }
                
                try {
                    thClaimBtn.disabled = true; thClaimBtn.style.opacity = '0.5';
                    thTxStatus.innerHTML = '<span style="color:#f59e0b;">⏳ Đang xin Khai quật... (Xác nhận trên MetaMask)</span>';
                    
                    var freeMintMachine = new ethers.Contract(FC1155_ADDR, FC1155_ABI, signer);
                    var tx = await freeMintMachine.claimBadge(colAddr, parseInt(tokenId), 1);
                    
                    thTxStatus.innerHTML = '<span style="color:#f59e0b;">⛏️ Đang đào... Chờ Blockchain xác nhận...</span>';
                    await tx.wait();
                    
                    thTxStatus.innerHTML = '<span style="color:#10b981;font-size:14px;font-weight:bold;">✅ TUYỆT VỜI! Kho báu đã vào ví của bạn!</span>';
                    toast('success', '🎁 Đào kho báu thành công!');
                    thClaimBtn.innerText = "✅ ĐÃ LẤY KHO BÁU";
                } catch(e) {
                    var msg = e.reason || e.message || 'Lỗi không xác định';
                    if (msg.includes('user rejected')) msg = 'Đã hủy giao dịch!';
                    if (msg.includes('Not authorized')) msg = 'Kho báu chưa được mở khóa (Lỗi phân quyền)!';
                    thTxStatus.innerHTML = '<span style="color:#ef4444;">❌ ' + msg.substring(0, 100) + '</span>';
                    toast('error', 'Thất bại: ' + msg.substring(0, 50));
                } finally {
                    thClaimBtn.disabled = false; thClaimBtn.style.opacity = '1';
                }
            });
        }
    `,
    bindings: []
}

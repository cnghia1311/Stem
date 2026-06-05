import { FACTORY_ADDRESSES } from '../contracts/contractFactorys.js';

// ==================== KHỐI: MÁY TẠO MÃ QR (QR GENERATOR) ====================
export default {
    id: "qr-generator",
    name: "🖨️ Máy Tạo Mã QR",
    desc: "Tạo nhanh mã QR chứa sẵn địa chỉ Bộ sưu tập và Mã Huy Hiệu để in ra dán ở sự kiện",
    color: "#8b5cf6",
    label: "Tạo Mã QR",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#8b5cf6;">
        <div class="khoi-title" style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
            <span style="font-size:24px;">🖨️</span>
            <span style="background:linear-gradient(135deg,#8b5cf6,#6d28d9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:16px;letter-spacing:1px;">MÁY TẠO MÃ QR TỰ ĐỘNG</span>
        </div>
        
        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:15px;margin-bottom:12px;">
            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Link gốc của trang Nhận Quà (Web App của bạn)</label>
            <input type="text" id="qrg-base-url" placeholder="VD: http://stem.app/apps/app-abc.html" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;margin-bottom:12px;">

            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Địa chỉ Bộ Sưu Tập (Contract NFT/Huy hiệu)</label>
            <input type="text" id="qrg-col-addr" placeholder="0x..." style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;margin-bottom:12px;">

            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Mã Huy Hiệu (Token ID) / Mã Mẫu</label>
            <input type="number" id="qrg-token-id" placeholder="VD: 0" min="0" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:14px;outline:none;">
        </div>

        <button id="qrg-btn" style="width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:white;font-size:15px;font-weight:800;cursor:pointer;letter-spacing:1px;margin-bottom:15px;box-shadow:0 4px 15px rgba(139,92,246,0.3);">🖨️ TẠO MÃ QR NGAY</button>

        <div id="qrg-result-container" style="display:none;background:#1e293b;border:2px dashed #8b5cf6;border-radius:12px;padding:15px;text-align:center;">
            <div style="font-size:13px;color:#a5b4fc;margin-bottom:10px;font-weight:bold;">🎉 Mã QR của bạn đã sẵn sàng!</div>
            
            <div id="qrg-image-container" style="display:flex;justify-content:center;padding:10px;background:white;border-radius:8px;width:fit-content;margin:0 auto;border:4px solid white;"></div>
            
            <div style="font-size:12px;color:#fcd34d;margin-top:15px;background:#334155;padding:8px;border-radius:6px;display:inline-block;">
                💡 <b>Mẹo:</b> Click chuột phải (hoặc chạm giữ) vào ảnh -> Chọn <b>Save image as...</b> (Lưu hình ảnh thành...) để tải về máy đem đi in!
            </div>
            
            <div style="font-size:10px;color:#64748b;margin-top:12px;word-break:break-all;background:#0f172a;padding:8px;border-radius:6px;border:1px solid #334155;">
                Link đã gộp đầy đủ: <br><span id="qrg-final-link" style="color:#2dd4bf;font-weight:bold;font-size:11px;"></span>
            </div>
        </div>
    </div>`,
    
    engineCode: () => `
        function generateQR() {
            var base = document.getElementById('qrg-base-url').value.trim();
            var col = document.getElementById('qrg-col-addr').value.trim();
            var tid = document.getElementById('qrg-token-id').value.trim();
            
            if(!base) { toast('error', 'Vui lòng nhập Link gốc của trang web Nhận Quà!'); return; }
            if(!col || col.length !== 42 || !col.startsWith('0x')) { toast('error', 'Địa chỉ Bộ sưu tập không hợp lệ (Phải dài 42 ký tự và bắt đầu bằng 0x)!'); return; }
            if(tid === '') { toast('error', 'Vui lòng nhập Mã Huy Hiệu!'); return; }
            
            if(base.includes('?')) base = base.split('?')[0];
            
            var finalUrl = base + '?col=' + col + '&id=' + tid + '&tpl=' + tid;
            
            if (typeof QRCode === 'undefined') {
                toast('error', 'Đang tải thư viện tạo QR... Vui lòng bấm lại!');
                var script = document.createElement('script');
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
                document.head.appendChild(script);
                return;
            }

            try {
                var container = document.getElementById('qrg-image-container');
                container.innerHTML = ""; // Xoá QR cũ
                
                new QRCode(container, {
                    text: finalUrl,
                    width: 250,
                    height: 250,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
                
                document.getElementById('qrg-final-link').innerText = finalUrl;
                document.getElementById('qrg-result-container').style.display = 'block';
                toast('success', '🖨️ Tạo mã QR thành công!');
            } catch(e) {
                toast('error', 'Lỗi tạo QR: ' + e.message);
            }
        }

        var btnGen = document.getElementById('qrg-btn');
        if(btnGen) {
            btnGen.addEventListener('click', generateQR);
        }

        if (typeof QRCode === 'undefined') {
            var script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
            document.head.appendChild(script);
        }
    `,
    bindings: []
}

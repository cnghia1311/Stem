// ==================== KHỐI: CĂN CƯỚC VÍ (QR WALLET) ====================
export default {
    id: "qr-wallet",
    name: "🪪 Căn Cước Ví",
    desc: "Tạo thẻ QR Code cho địa chỉ ví của bạn để người khác dễ dàng quét và chuyển tiền.",
    color: "#3b82f6",
    label: "Thẻ QR Ví",
    preview: () => `
        <div style="text-align:center;">
            <div style="font-size:30px;margin-bottom:6px;">🪪</div>
            <div style="font-size:10px;color:#94a3b8;">Thẻ Nhận Tiền (QR Code)</div>
            <div style="width:100px;height:100px;background:#cbd5e1;margin:10px auto;border-radius:8px;"></div>
        </div>
    `,
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#3b82f6;text-align:center;">
        <div class="khoi-title" style="color:#60a5fa;margin-bottom:12px;">🪪 CĂN CƯỚC VÍ (THẺ NHẬN TIỀN)</div>
        <p style="font-size:11px;color:#cbd5e1;margin-bottom:15px;line-height:1.5;">Đưa mã QR này cho bạn bè để họ dùng tính năng 📷 Quét QR chuyển tiền/NFT/Huy Hiệu cho bạn!</p>
        
        <div style="background:#0f172a;border:2px dashed #3b82f6;border-radius:12px;padding:20px;display:inline-block;margin-bottom:15px;width:100%;box-sizing:border-box;">
            <div id="qrw-image" style="background:white;padding:10px;border-radius:8px;border:4px solid white;display:inline-block;width:200px;height:200px;line-height:180px;color:#94a3b8;font-size:12px;margin:0 auto;">Chưa kết nối ví</div>
            <div id="qrw-address" style="margin-top:12px;font-size:11px;color:#60a5fa;font-family:monospace;word-break:break-all;font-weight:bold;"></div>
        </div>
        
        <div style="display:flex;gap:8px;">
            <button id="qrw-copy-btn" style="flex:1;padding:12px;border-radius:8px;border:none;background:linear-gradient(135deg,#3b82f6,#2563eb);color:white;font-size:13px;font-weight:bold;cursor:pointer;box-shadow:0 4px 15px rgba(59,130,246,0.3);display:none;">📋 COPY VÍ</button>
            <button id="qrw-download-btn" style="flex:1;padding:12px;border-radius:8px;border:none;background:linear-gradient(135deg,#10b981,#059669);color:white;font-size:13px;font-weight:bold;cursor:pointer;box-shadow:0 4px 15px rgba(16,185,129,0.3);display:none;">⬇️ TẢI ẢNH</button>
        </div>
        <button id="qrw-render-btn" style="width:100%;padding:12px;border-radius:8px;border:1px solid #3b82f6;background:transparent;color:#60a5fa;font-size:13px;font-weight:bold;cursor:pointer;margin-top:8px;">🔄 HIỂN THỊ MÃ QR</button>
    </div>`,
    
    engineCode: (prefix) => `
        function renderWalletQR() {
            var imgContainer = document.getElementById('${prefix}qrw-image');
            var addrContainer = document.getElementById('${prefix}qrw-address');
            var copyBtn = document.getElementById('${prefix}qrw-copy-btn');
            var dlBtn = document.getElementById('${prefix}qrw-download-btn');
            
            if(!signer) {
                toast('error', 'Vui lòng kết nối ví trước!');
                return;
            }
            
            if (typeof QRCode === 'undefined') {
                toast('info', 'Đang tải bộ tạo mã QR...');
                var script = document.createElement('script');
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
                script.onload = () => generateQR(imgContainer, addrContainer, copyBtn, dlBtn);
                document.head.appendChild(script);
            } else {
                generateQR(imgContainer, addrContainer, copyBtn, dlBtn);
            }
        }
        
        async function generateQR(img, addrCont, btn, dlBtn) {
            try {
                const addr = await signer.getAddress();
                img.innerHTML = "";
                new QRCode(img, {
                    text: 'ethereum:' + addr,
                    width: 180,
                    height: 180,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
                addrCont.innerText = addr;
                btn.style.display = 'block';
                dlBtn.style.display = 'block';
                document.getElementById('${prefix}qrw-render-btn').style.display = 'none';
                
                btn.onclick = () => {
                    navigator.clipboard.writeText(addr);
                    toast('success', 'Đã copy địa chỉ ví!');
                };
                
                dlBtn.onclick = () => {
                    let canvas = img.querySelector('canvas');
                    let image = img.querySelector('img');
                    let url = '';
                    if (image && image.src && image.src.startsWith('data:')) url = image.src;
                    else if (canvas) url = canvas.toDataURL("image/png");
                    
                    if (url) {
                        let a = document.createElement('a');
                        a.href = url;
                        a.download = 'Ma_QR_Vi_' + addr.substring(0,6) + '.png';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        toast('success', 'Đã tải ảnh QR về máy!');
                    } else {
                        toast('error', 'Chưa tạo được ảnh QR!');
                    }
                };
            } catch(e) {
                toast('error', 'Lỗi tạo QR!');
            }
        }
        
        // Thử tự động hiển thị nếu ví đã kết nối sẵn
        setTimeout(() => {
            if(signer) renderWalletQR();
        }, 1500);
    `,
    bindings: [{ btn: "qrw-render-btn", fn: "renderWalletQR" }]
}

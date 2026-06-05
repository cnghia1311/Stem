import { FACTORY_ADDRESSES } from '../contracts/contractFactorys.js';

// ==================== KHỐI: MÁY QUÉT MÃ QR (QR SCANNER) ====================
export default {
    id: "qr-scanner",
    name: "📷 Máy Quét Mã QR",
    desc: "Sử dụng camera điện thoại/laptop để quét mã QR địa chỉ ví, hữu ích để điểm danh sự kiện",
    color: "#14b8a6",
    label: "Quét Mã QR",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#14b8a6;">
        <div class="khoi-title" style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
            <span style="font-size:24px;">📷</span>
            <span style="background:linear-gradient(135deg,#14b8a6,#0f766e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:16px;letter-spacing:1px;">MÁY QUÉT MÃ QR</span>
        </div>

        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:15px;margin-bottom:12px;">
            <div id="qr-reader" style="width:100%;margin:0 auto;border-radius:8px;overflow:hidden;background:#1e293b;border:2px dashed #14b8a6;min-height:200px;"></div>
            
            <div id="qr-result-container" style="display:none;margin-top:15px;background:#1e1b4b;padding:12px;border-radius:8px;border:1px solid #14b8a6;">
                <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;">Kết quả quét (Click để copy):</label>
                <div id="qr-result" style="font-family:monospace;font-size:13px;color:#2dd4bf;word-break:break-all;cursor:pointer;padding:10px;background:#0f172a;border:1px solid #334155;border-radius:6px;text-align:center;font-weight:bold;"></div>
            </div>
        </div>
        <div style="font-size:11px;color:#64748b;text-align:center;">💡 Ghi chú: Yêu cầu cấp quyền sử dụng Camera trên trình duyệt.</div>
    </div>`,
    
    engineCode: () => `
        function initQR() {
            var resultDiv = document.getElementById('qr-result');
            var resultContainer = document.getElementById('qr-result-container');
            
            // Xoá nội dung cũ nếu có để tránh lỗi khi render lại
            document.getElementById('qr-reader').innerHTML = '';

            var html5QrcodeScanner = new Html5QrcodeScanner(
                "qr-reader",
                { fps: 10, qrbox: {width: 250, height: 250} },
                false);
            
            html5QrcodeScanner.render(function(decodedText, decodedResult) {
                // Bỏ tiền tố ethereum: nếu có (chuẩn của MetaMask QR)
                if(decodedText.startsWith('ethereum:')) {
                    decodedText = decodedText.replace('ethereum:', '').split('?')[0];
                }
                
                resultDiv.innerText = decodedText;
                resultContainer.style.display = 'block';
                toast('success', '📷 Đã quét thành công!');
                
                // Tự động điền vào các khối Mint nếu có trên cùng trang
                var mint721 = document.getElementById('col-mint-to'); // Khối Mint NFT 721
                if(mint721) { 
                    mint721.value = decodedText; 
                    toast('success', '✨ Đã tự động điền địa chỉ vào khối Mint!'); 
                }
                
                var mint1155 = document.getElementById('m1155-mint-to'); // Khối Mint 1155
                if(mint1155) { 
                    mint1155.value = decodedText; 
                    toast('success', '✨ Đã tự động điền địa chỉ vào khối Mint!'); 
                }
                
                var msfOwnerInput = document.querySelectorAll('.msf-owner-input'); // Khối Tạo Quỹ Đa Chữ Ký
                if(msfOwnerInput && msfOwnerInput.length > 0) {
                    for(var i=0; i<msfOwnerInput.length; i++) {
                        if(msfOwnerInput[i].value === '') {
                            msfOwnerInput[i].value = decodedText;
                            toast('success', '✨ Đã thêm địa chỉ vào danh sách Owner Quỹ!');
                            // Kích hoạt sự kiện input để update preview
                            msfOwnerInput[i].dispatchEvent(new Event('input', { bubbles: true }));
                            break;
                        }
                    }
                }
                
                // Tạm dừng quét 3 giây để chống quét liên tục
                html5QrcodeScanner.pause(true);
                setTimeout(() => html5QrcodeScanner.resume(), 3000);
                
            }, function(error) {
                // Bỏ qua các lỗi frame không quét được
            });

            if (resultDiv) {
                resultDiv.addEventListener('click', function() {
                    navigator.clipboard.writeText(this.innerText).then(function(){
                        toast('success', '📋 Đã copy địa chỉ ví!');
                    });
                });
            }
        }

        // Tải thư viện quét QR từ CDN một cách tự động
        if (typeof Html5QrcodeScanner === 'undefined') {
            var script = document.createElement('script');
            script.src = "https://unpkg.com/html5-qrcode";
            script.onload = initQR;
            document.head.appendChild(script);
        } else {
            initQR();
        }
    `,
    bindings: []
}

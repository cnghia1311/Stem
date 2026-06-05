// ==================== KHỐI: TẠO HUY HIỆU (UPLOAD ERC-1155) ====================
export default {
    id: "update-erc1155",
    name: "🎨 Tạo Huy Hiệu (Upload 1155)",
    desc: "Kéo thả ảnh và Tạo / Mint Huy hiệu mới chuẩn ERC-1155",
    color: "#6366f1",
    label: "Tạo Huy Hiệu",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#6366f1;">
        <div class="khoi-title" style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:24px;">🎨</span>
            <span style="background:linear-gradient(135deg,#6366f1,#4f46e5);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:16px;letter-spacing:1px;">TẠO HUY HIỆU (UPLOAD 1155)</span>
        </div>

        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:15px;margin-bottom:12px;">
            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Địa chỉ Contract Bộ Sưu Tập (ERC-1155)</label>
            <input type="text" id="u1155-contract-addr" placeholder="0x... (Dán địa chỉ từ 🏅 Máy Tạo BST Huy Hiệu)" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;margin-bottom:12px;">

            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">📷 Hình Ảnh Huy Hiệu</label>
            <div id="u1155-upload-zone" style="border:2px dashed #334155;border-radius:10px;padding:24px 16px;text-align:center;cursor:pointer;margin-bottom:12px;transition:all 0.2s;">
                <input type="file" id="u1155-file-input" accept="image/*" style="display:none;">
                <div id="u1155-upload-icon" style="font-size:36px;margin-bottom:8px;">🖼️</div>
                <div id="u1155-upload-text" style="font-size:12px;color:#94a3b8;">Bấm để chọn ảnh hoặc kéo thả vào đây<br><span style="font-size:10px;color:#475569;">(PNG, JPG, GIF, SVG — tối đa 10MB)</span></div>
                <img id="u1155-preview-img" src="" style="display:none;max-width:180px;max-height:180px;border-radius:10px;margin-top:12px;box-shadow:0 4px 15px rgba(99,102,241,0.3);">
            </div>

            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Tên Huy Hiệu</label>
            <input type="text" id="u1155-name" placeholder="Ví dụ: Chiến Binh Robot Hạng Vàng" maxlength="64" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:14px;outline:none;margin-bottom:12px;">

            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Mô Tả (tuỳ chọn)</label>
            <textarea id="u1155-desc" placeholder="Ví dụ: Huy hiệu dành cho học sinh hoàn thành xuất sắc..." maxlength="256" rows="2" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;resize:vertical;margin-bottom:12px;"></textarea>

            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Mã Huy Hiệu (Token ID)</label>
            <input type="number" id="u1155-token-id" placeholder="Ví dụ: 1" min="0" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:14px;outline:none;margin-bottom:12px;">

            <div style="font-size:10px;color:#64748b;">💡 Ảnh & Metadata được tải tự động lên IPFS (phi tập trung, vĩnh viễn)</div>
        </div>

        <button id="u1155-create-btn" style="width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#6366f1,#4f46e5);color:white;font-size:15px;font-weight:800;cursor:pointer;letter-spacing:1px;">🚀 TẠO MẪU HUY HIỆU</button>

        <div id="u1155-status" style="margin-top:10px;font-size:12px;text-align:center;color:#94a3b8;min-height:20px;"></div>

        <div id="u1155-result" style="display:none;margin-top:12px;background:#0f1a2e;border:1px solid #6366f1;border-radius:12px;padding:15px;">
            <div style="font-size:14px;font-weight:bold;color:#6366f1;margin-bottom:10px;">🎉 Tạo Mẫu Huy Hiệu thành công!</div>
            <div style="text-align:center;margin-bottom:12px;">
                <img id="u1155-result-img" src="" style="max-width:120px;max-height:120px;border-radius:10px;box-shadow:0 4px 20px rgba(99,102,241,0.4);">
            </div>
            <div style="font-size:11px;color:#94a3b8;margin-bottom:4px;">Tên: <span id="u1155-result-name" style="color:#e2e8f0;font-weight:bold;"></span></div>
            <div style="font-size:11px;color:#94a3b8;margin-bottom:8px;">Token ID: <span id="u1155-result-tokenid" style="color:#6366f1;font-weight:bold;"></span></div>
            <div style="text-align:center;">
                <a id="u1155-result-link" href="#" target="_blank" style="color:#06b6d4;font-size:11px;text-decoration:underline;">🔗 Xem giao dịch trên Etherscan</a>
            </div>
            <div style="margin-top:10px;padding:8px;background:#1e293b;border-radius:8px;font-size:10px;color:#10b981;text-align:center;">
                💡 Hãy dùng khối <strong>🎖️ Đúc Huy Hiệu (Mint)</strong> để đúc số lượng cho mẫu huy hiệu này!
            </div>
        </div>
    </div>`,

    engineCode: () => `
        const U1155_PINATA_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiNTE1M2M0Yy1hMzg3LTRmZDEtODI0My1mZjM0MzU5YTM3MjYiLCJlbWFpbCI6ImNuZ2hpYTEzMTFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjBkZTFmNmJmODdiNzc5NTAzYTJlIiwic2NvcGVkS2V5U2VjcmV0IjoiZWIwNmNlMTZhNzEwYjJjYTk2MTU4ZGZkYjUyZGJlMTI1MjQwYzJlOGI3NjA2ODY0YmI5OWNkOTU1NzliMjg5NCIsImV4cCI6MTgwODY3MjE5NH0.VGKX8Fh2z49FpeyhVMCpIYrkwXoz4TfDRLDzyUSYFSM';
        const U1155_PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

        const U1155_ABI = [
            "function setTokenURI(uint256 tokenId, string memory newuri) public",
            "function setTokenURI(uint256 tokenId, string memory newuri) public",
            "function owner() view returns (address)"
        ];

        const _u1155Btn = document.getElementById('u1155-create-btn');
        const _u1155FileInput = document.getElementById('u1155-file-input');
        const _u1155Zone = document.getElementById('u1155-upload-zone');
        const _u1155Preview = document.getElementById('u1155-preview-img');
        const _u1155Icon = document.getElementById('u1155-upload-icon');
        const _u1155UploadText = document.getElementById('u1155-upload-text');
        const _u1155Status = document.getElementById('u1155-status');
        const _u1155Result = document.getElementById('u1155-result');

        var _u1155SelectedFile = null;

        if (_u1155Btn) {
            // Bấm vào vùng kéo thả để mở hộp chọn file
            _u1155Zone.addEventListener('click', function() { _u1155FileInput.click(); });

            // Drag over: đổi màu viền
            _u1155Zone.addEventListener('dragover', function(e) {
                e.preventDefault();
                _u1155Zone.style.borderColor = '#6366f1';
                _u1155Zone.style.background = 'rgba(99,102,241,0.08)';
            });
            _u1155Zone.addEventListener('dragleave', function() {
                _u1155Zone.style.borderColor = '#334155';
                _u1155Zone.style.background = 'transparent';
            });

            // Thả file vào vùng drop
            _u1155Zone.addEventListener('drop', function(e) {
                e.preventDefault();
                _u1155Zone.style.borderColor = '#334155';
                _u1155Zone.style.background = 'transparent';
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    _u1155HandleFile(e.dataTransfer.files[0]);
                }
            });

            // Chọn file qua input
            _u1155FileInput.addEventListener('change', function() {
                if (this.files && this.files[0]) { _u1155HandleFile(this.files[0]); }
            });

            function _u1155HandleFile(file) {
                if (!file.type.startsWith('image/')) {
                    toast('error', 'Chỉ chấp nhận file ảnh (PNG, JPG, GIF, SVG)!'); return;
                }
                if (file.size > 10 * 1024 * 1024) {
                    toast('error', 'Ảnh quá lớn! Tối đa 10MB.'); return;
                }
                _u1155SelectedFile = file;
                var reader = new FileReader();
                reader.onload = function(e) {
                    _u1155Preview.src = e.target.result;
                    _u1155Preview.style.display = 'block';
                    _u1155Icon.style.display = 'none';
                    _u1155UploadText.innerHTML = '<span style="color:#6366f1;font-weight:bold;">' + file.name + '</span><br><span style="font-size:10px;color:#475569;">' + (file.size / 1024).toFixed(1) + ' KB</span>';
                };
                reader.readAsDataURL(file);
            }

            // Bấm nút TẠO MẪU
            _u1155Btn.addEventListener('click', async function() {
                if (!signer) { toast('error', 'Cần kết nối ví (🦊) trước!'); return; }

                var colAddr = document.getElementById('u1155-contract-addr').value.trim();
                var badgeName = document.getElementById('u1155-name').value.trim();
                var badgeDesc = document.getElementById('u1155-desc').value.trim();
                var tokenId = document.getElementById('u1155-token-id').value.trim();
                var tokenId = document.getElementById('u1155-token-id').value.trim();

                // Validate
                if (!colAddr || !colAddr.startsWith('0x') || colAddr.length !== 42) {
                    toast('error', 'Địa chỉ Contract ERC-1155 không hợp lệ!'); return;
                }
                if (!_u1155SelectedFile) {
                    toast('error', 'Chưa chọn ảnh cho Huy Hiệu!'); return;
                }
                if (!badgeName) {
                    toast('error', 'Nhập tên Huy Hiệu!'); return;
                }
                if (tokenId === '' || isNaN(parseInt(tokenId)) || parseInt(tokenId) < 0) {
                    toast('error', 'Nhập Mã Huy Hiệu (Token ID) hợp lệ (số ≥ 0)!'); return;
                }


                try {
                    _u1155Btn.disabled = true; _u1155Btn.style.opacity = '0.5';
                    _u1155Result.style.display = 'none';

                    // ===== BƯỚC 1: Upload ảnh lên IPFS =====
                    _u1155Status.innerHTML = '<span style="color:#6366f1;">📤 Bước 1/3: Đang tải ảnh lên IPFS...</span>';
                    var imgForm = new FormData();
                    imgForm.append('file', _u1155SelectedFile);
                    imgForm.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));
                    imgForm.append('pinataMetadata', JSON.stringify({ name: 'badge-img-' + tokenId + '-' + Date.now() }));

                    var imgRes = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
                        method: 'POST',
                        headers: { 'Authorization': 'Bearer ' + U1155_PINATA_JWT },
                        body: imgForm
                    });
                    if (!imgRes.ok) throw new Error('Upload ảnh thất bại! Kiểm tra lại kết nối mạng.');
                    var imgData = await imgRes.json();
                    var imageURI = 'ipfs://' + imgData.IpfsHash;

                    // ===== BƯỚC 2: Tạo file JSON Metadata & upload =====
                    _u1155Status.innerHTML = '<span style="color:#6366f1;">📝 Bước 2/3: Đang tạo Metadata JSON...</span>';
                    var metadata = {
                        name: badgeName,
                        description: badgeDesc || ('Huy hiệu ' + badgeName + ' - Bộ sưu tập ERC-1155'),
                        image: imageURI,
                        attributes: [
                            { trait_type: 'Token ID', value: parseInt(tokenId) },
                            { trait_type: 'Standard', value: 'ERC-1155' }
                        ]
                    };
                    var metaRes = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + U1155_PINATA_JWT
                        },
                        body: JSON.stringify({
                            pinataContent: metadata,
                            pinataOptions: { cidVersion: 1 },
                            pinataMetadata: { name: 'badge-meta-id' + tokenId + '-' + Date.now() }
                        })
                    });
                    if (!metaRes.ok) throw new Error('Upload metadata thất bại!');
                    var metaData = await metaRes.json();
                    var tokenURI = 'ipfs://' + metaData.IpfsHash;

                    // ===== BƯỚC 3: setTokenURI trên Smart Contract =====
                    _u1155Status.innerHTML = '<span style="color:#6366f1;">🔗 Bước 3/3: Gắn link Metadata vào Token ID #' + tokenId + '...</span>';
                    var collection = new ethers.Contract(colAddr, U1155_ABI, signer);
                    var setUriTx = await collection.setTokenURI(parseInt(tokenId), tokenURI);
                    _u1155Status.innerHTML = '<span style="color:#6366f1;">⏳ Bước 3/3: Đang chờ xác nhận setTokenURI...</span>';
                    var receipt = await setUriTx.wait();

                    // ===== THÀNH CÔNG =====
                    document.getElementById('u1155-result-img').src = U1155_PINATA_GATEWAY + imgData.IpfsHash;
                    document.getElementById('u1155-result-name').innerText = badgeName;
                    document.getElementById('u1155-result-tokenid').innerText = '#' + tokenId;
                    document.getElementById('u1155-result-link').href = 'https://sepolia.etherscan.io/tx/' + receipt.hash;
                    _u1155Result.style.display = 'block';

                    _u1155Status.innerHTML = '<span style="color:#10b981;">✅ Hoàn tất! Đã tạo mẫu huy hiệu <strong>' + badgeName + '</strong> (#' + tokenId + ') thành công!</span>';
                    toast('success', '🎉 Tạo mẫu huy hiệu ' + badgeName + ' thành công!');

                    // Reset form
                    _u1155SelectedFile = null;
                    _u1155Preview.style.display = 'none';
                    _u1155Icon.style.display = 'block';
                    _u1155UploadText.innerHTML = 'Bấm để chọn ảnh hoặc kéo thả vào đây<br><span style="font-size:10px;color:#475569;">(PNG, JPG, GIF, SVG — tối đa 10MB)</span>';
                    document.getElementById('u1155-name').value = '';
                    document.getElementById('u1155-desc').value = '';
                    document.getElementById('u1155-token-id').value = '';

                } catch(e) {
                    var msg = e.reason || e.message || 'Lỗi không xác định';
                    if (msg.includes('user rejected')) msg = 'Bạn đã từ chối giao dịch trên MetaMask!';
                    if (msg.includes('Not authorized')) msg = 'Bạn không phải Owner của bộ sưu tập này! Chỉ Owner mới có quyền tạo huy hiệu.';
                    _u1155Status.innerHTML = '<span style="color:#ef4444;">❌ ' + msg.substring(0, 120) + '</span>';
                    toast('error', 'Thất bại: ' + msg.substring(0, 60));
                } finally {
                    _u1155Btn.disabled = false; _u1155Btn.style.opacity = '1';
                }
            });
        }
    `,
    bindings: []
}

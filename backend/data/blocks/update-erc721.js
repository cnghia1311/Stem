// ==================== KHỐI: TẠO MẪU NFT (UPDATE ERC-721 TEMPLATE) ====================
export default {
    id: "update-erc721",
    name: "🎨 Tạo Mẫu NFT",
    desc: "Giáo viên tải ảnh lên để gài sẵn Khuôn Mẫu (Template) cho học sinh đúc",
    color: "#6366f1",
    label: "Tạo Mẫu NFT",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#6366f1;">
        <div class="khoi-title" style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:24px;">🎨</span>
            <span style="background:linear-gradient(135deg,#6366f1,#4338ca);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:16px;letter-spacing:1px;">TẠO MẪU NFT</span>
        </div>
        
        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:15px;margin-bottom:12px;">
            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Địa chỉ Contract Bộ Sưu Tập</label>
            <input type="text" id="u721-collection-addr" placeholder="0x... (ERC-721)" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;margin-bottom:12px;">
            
            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Mã Khuôn Mẫu (Template ID)</label>
            <input type="number" id="u721-template-id" placeholder="Ví dụ: 1" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:14px;font-weight:bold;outline:none;margin-bottom:12px;">

            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Tên Mẫu NFT</label>
            <input type="text" id="u721-nft-name" placeholder="Ví dụ: Bằng Khen Học Sinh Giỏi" maxlength="32" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:14px;outline:none;margin-bottom:12px;">

            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Mô Tả</label>
            <textarea id="u721-nft-desc" placeholder="Ví dụ: Phần thưởng vinh danh cá nhân xuất sắc..." maxlength="256" rows="2" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;resize:vertical;margin-bottom:12px;"></textarea>

            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:4px;font-weight:bold;">Trọng Số Gacha (Weight) <span style="color:#64748b;font-weight:400;">— số càng cao càng dễ ra</span></label>
            <input type="number" id="u721-weight" value="10" min="1" max="9999" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#f59e0b;font-size:14px;font-weight:bold;outline:none;margin-bottom:4px;">
            <div style="font-size:10px;color:#64748b;margin-bottom:12px;">💡 Common: 50 | Rare: 20 | Epic: 10 | Legendary: 5</div>

            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Hình Ảnh Mẫu</label>
            <div id="u721-drop-area" style="border:2px dashed #334155;border-radius:10px;padding:20px;text-align:center;background:#0f172a;cursor:pointer;margin-bottom:4px;transition:all 0.3s ease;">
                <div style="font-size:32px;margin-bottom:8px;">🖼️</div>
                <div style="color:#94a3b8;font-size:12px;">Kéo thả ảnh vào đây hoặc click để chọn</div>
                <input type="file" id="u721-file-input" accept="image/*" style="display:none;">
            </div>
            <div id="u721-file-preview-box" style="display:none;text-align:center;margin-top:8px;">
                <img id="u721-file-preview" src="" style="max-width:80px;max-height:80px;border-radius:8px;border:1px solid #475569;">
                <div style="font-size:10px;color:#94a3b8;margin-top:4px;">Ảnh đã chọn</div>
            </div>
        </div>

        <button id="u721-upload-btn" style="width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#6366f1,#4338ca);color:white;font-size:15px;font-weight:800;cursor:pointer;letter-spacing:1px;box-shadow:0 4px 15px rgba(99,102,241,0.3);">🎨 LƯU MẪU LÊN BLOCKCHAIN</button>
        
        <div id="u721-status" style="margin-top:10px;font-size:12px;text-align:center;color:#94a3b8;min-height:20px;"></div>

        <div id="u721-result" style="display:none;margin-top:12px;background:#0f1a2e;border:1px solid #6366f1;border-radius:12px;padding:15px;">
            <div style="font-size:14px;font-weight:bold;color:#6366f1;margin-bottom:10px;">🎉 Tạo Mẫu NFT thành công!</div>
            <div style="text-align:center;margin-bottom:12px;">
                <img id="u721-result-img" src="" style="max-width:120px;max-height:120px;border-radius:10px;box-shadow:0 4px 20px rgba(99,102,241,0.4);">
            </div>
            <div style="font-size:11px;color:#94a3b8;margin-bottom:4px;">Tên Mẫu: <span id="u721-result-name" style="color:#e2e8f0;font-weight:bold;"></span></div>
            <div style="font-size:11px;color:#94a3b8;margin-bottom:8px;">Template ID: <span id="u721-result-templateid" style="color:#6366f1;font-weight:bold;"></span></div>
            <div style="margin-top:10px;padding:8px;background:#1e293b;border-radius:8px;font-size:10px;color:#10b981;text-align:center;">
                💡 Hãy dùng khối <strong>🎁 Đúc NFT Tự Do</strong> và nhập Template ID này để học sinh nhận phần thưởng!
            </div>
        </div>
    </div>`,

    engineCode: () => `
        var U721_PINATA_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiNTE1M2M0Yy1hMzg3LTRmZDEtODI0My1mZjM0MzU5YTM3MjYiLCJlbWFpbCI6ImNuZ2hpYTEzMTFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjBkZTFmNmJmODdiNzc5NTAzYTJlIiwic2NvcGVkS2V5U2VjcmV0IjoiZWIwNmNlMTZhNzEwYjJjYTk2MTU4ZGZkYjUyZGJlMTI1MjQwYzJlOGI3NjA2ODY0YmI5OWNkOTU1NzliMjg5NCIsImV4cCI6MTgwODY3MjE5NH0.VGKX8Fh2z49FpeyhVMCpIYrkwXoz4TfDRLDzyUSYFSM';
        var U721_ABI = [
            "function setTemplate(uint256 templateId, string memory uri, uint256 weight) public"
        ];

        var _u721DropArea = document.getElementById('u721-drop-area');
        var _u721FileInput = document.getElementById('u721-file-input');
        var _u721PreviewBox = document.getElementById('u721-file-preview-box');
        var _u721Preview = document.getElementById('u721-file-preview');
        var _u721UploadBtn = document.getElementById('u721-upload-btn');
        var _u721Status = document.getElementById('u721-status');
        var _u721Result = document.getElementById('u721-result');

        var _u721SelectedFile = null;

        if (_u721DropArea && _u721FileInput) {
            _u721DropArea.addEventListener('click', () => _u721FileInput.click());
            _u721DropArea.addEventListener('dragover', (e) => { e.preventDefault(); _u721DropArea.style.borderColor = '#6366f1'; _u721DropArea.style.background = '#1e293b'; });
            _u721DropArea.addEventListener('dragleave', () => { _u721DropArea.style.borderColor = '#334155'; _u721DropArea.style.background = '#0f172a'; });
            _u721DropArea.addEventListener('drop', (e) => {
                e.preventDefault(); _u721DropArea.style.borderColor = '#334155'; _u721DropArea.style.background = '#0f172a';
                if (e.dataTransfer.files.length > 0) {
                    _u721SelectedFile = e.dataTransfer.files[0];
                    _u721Preview.src = URL.createObjectURL(_u721SelectedFile);
                    _u721PreviewBox.style.display = 'block';
                }
            });
            _u721FileInput.addEventListener('change', function(e) {
                if (e.target.files.length > 0) {
                    _u721SelectedFile = e.target.files[0];
                    _u721Preview.src = URL.createObjectURL(_u721SelectedFile);
                    _u721PreviewBox.style.display = 'block';
                }
            });
        }

        if (_u721UploadBtn) {
            _u721UploadBtn.addEventListener('click', async function() {
                if (!signer) { toast('error', 'Cần kết nối ví (🦊) trước!'); return; }

                var colAddr = document.getElementById('u721-collection-addr').value.trim();
                var templateIdStr = document.getElementById('u721-template-id').value.trim();
                var nftName = document.getElementById('u721-nft-name').value.trim();
                var nftDesc = document.getElementById('u721-nft-desc').value.trim();
                var weightStr = document.getElementById('u721-weight').value.trim();

                if (!colAddr || colAddr.length !== 42) { toast('error', 'Địa chỉ Bộ Sưu Tập không hợp lệ!'); return; }
                if (!templateIdStr) { toast('error', 'Vui lòng nhập Mã Khuôn Mẫu (Template ID)!'); return; }
                if (!nftName) { toast('error', 'Vui lòng nhập Tên Mẫu NFT!'); return; }
                if (!_u721SelectedFile) { toast('error', 'Vui lòng chọn hình ảnh cho Mẫu!'); return; }

                var templateId = parseInt(templateIdStr);
                var weight = parseInt(weightStr) || 10;
                if (weight < 1) { toast('error', 'Trọng số phải >= 1!'); return; }

                try {
                    _u721UploadBtn.disabled = true; _u721UploadBtn.style.opacity = '0.5';
                    _u721Result.style.display = 'none';

                    // Bước 1: Upload ảnh
                    _u721Status.innerHTML = '<span style="color:#6366f1;">📤 Bước 1/3: Đang tải ảnh lên IPFS...</span>';
                    var imgForm = new FormData();
                    imgForm.append('file', _u721SelectedFile);
                    imgForm.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));
                    
                    var imgRes = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
                        method: 'POST',
                        headers: { 'Authorization': 'Bearer ' + U721_PINATA_JWT },
                        body: imgForm
                    });
                    if (!imgRes.ok) throw new Error('Không thể upload ảnh lên Pinata');
                    var imgData = await imgRes.json();
                    var imageURI = 'ipfs://' + imgData.IpfsHash;

                    // Bước 2: Upload JSON
                    _u721Status.innerHTML = '<span style="color:#6366f1;">📝 Bước 2/3: Đang tạo Metadata JSON...</span>';
                    var metadata = { name: nftName, description: nftDesc || ('Mẫu ' + nftName), image: imageURI };

                    var metaRes = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + U721_PINATA_JWT },
                        body: JSON.stringify({ pinataContent: metadata, pinataMetadata: { name: nftName + '_template.json' } })
                    });
                    if (!metaRes.ok) throw new Error('Không thể upload metadata JSON');
                    var metaData = await metaRes.json();
                    var tokenURI = 'ipfs://' + metaData.IpfsHash;

                    // Bước 3: Ghi vào Smart Contract
                    _u721Status.innerHTML = '<span style="color:#6366f1;">⏳ Bước 3/3: Đang lưu vào Smart Contract...</span>';
                    var collection = new ethers.Contract(colAddr, U721_ABI, signer);
                    var tx = await collection.setTemplate(templateId, tokenURI, weight);

                    _u721Status.innerHTML = '<span style="color:#6366f1;">⛏️ Đang chờ Blockchain xác nhận...</span>';
                    await tx.wait();

                    _u721Status.innerHTML = '<span style="color:#10b981;">✅ Đã lưu Mẫu NFT thành công!</span>';
                    
                    document.getElementById('u721-result-img').src = 'https://gateway.pinata.cloud/ipfs/' + imgData.IpfsHash;
                    document.getElementById('u721-result-name').innerText = nftName;
                    document.getElementById('u721-result-templateid').innerText = templateId;
                    _u721Result.style.display = 'block';

                    toast('success', 'Tạo Mẫu NFT thành công!');
                } catch(e) {
                    var msg = e.reason || e.message || 'Lỗi không xác định';
                    if (msg.includes('user rejected')) msg = 'Bạn đã từ chối giao dịch!';
                    if (msg.includes('Not authorized') || msg.includes('OwnableUnauthorizedAccount')) msg = 'Bạn không phải Owner của bộ sưu tập này!';
                    _u721Status.innerHTML = '<span style="color:#ef4444;">❌ ' + msg.substring(0, 100) + '</span>';
                    toast('error', 'Tạo mẫu thất bại: ' + msg.substring(0, 50));
                } finally {
                    _u721UploadBtn.disabled = false; _u721UploadBtn.style.opacity = '1';
                }
            });
        }
    `,
    bindings: []
}

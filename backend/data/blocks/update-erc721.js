// ==================== KHỐI: TẠO MẪU NFT HÀNG LOẠT (UPDATE ERC-721 TEMPLATE) ====================
export default {
    id: "update-erc721",
    name: "🎨 Tạo Mẫu NFT",
    desc: "Chọn nhiều ảnh một lúc, điền thông tin 1 lần rồi nạp lần lượt lên blockchain",
    color: "#6366f1",
    label: "Tạo Mẫu NFT",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#6366f1;">
        <div class="khoi-title" style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:24px;">🎨</span>
            <span style="background:linear-gradient(135deg,#6366f1,#4338ca);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:16px;letter-spacing:1px;">TẠO MẪU NFT HÀNG LOẠT</span>
        </div>

        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:15px;margin-bottom:12px;">
            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Địa chỉ Contract Bộ Sưu Tập</label>
            <input type="text" id="u721-collection-addr" placeholder="0x... (ERC-721)" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;margin-bottom:12px;">

            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:6px;font-weight:bold;">Ảnh các mẫu NFT <span style="color:#6366f1;font-weight:400;">— chọn nhiều ảnh cùng lúc</span></label>
            <div id="u721-drop-area" style="border:2px dashed #334155;border-radius:10px;padding:20px;text-align:center;background:#0f172a;cursor:pointer;transition:all 0.3s ease;">
                <div style="font-size:32px;margin-bottom:8px;">🖼️</div>
                <div style="color:#94a3b8;font-size:12px;">Kéo thả <b style="color:#6366f1;">nhiều ảnh</b> vào đây hoặc click để chọn</div>
                <div style="color:#64748b;font-size:10px;margin-top:4px;">Tên file sẽ thành tên mẫu (sửa lại được)</div>
                <input type="file" id="u721-file-input" accept="image/*" multiple style="display:none;">
            </div>
        </div>

        <div id="u721-table-box" style="display:none;background:#0f172a;border:1px solid #334155;border-radius:12px;padding:12px;margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span style="font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Danh sách mẫu</span>
                <span id="u721-total-weight" style="font-size:10px;color:#64748b;"></span>
            </div>
                        <div id="u721-rows" style="display:flex;flex-direction:column;gap:8px;min-height:120px;max-height:300px;overflow-y:auto;padding-right:4px;"></div>
            <div style="font-size:10px;color:#64748b;margin-top:8px;">💡 Weight gợi ý — Common: 50 | Rare: 20 | Epic: 10 | Legendary: 5</div>
            <button id="u721-clear-btn" style="width:auto;margin-top:8px;padding:6px 12px;border-radius:6px;border:1px solid #475569;background:transparent;color:#94a3b8;font-size:11px;cursor:pointer;">🗑️ Xoá hết danh sách</button>
        </div>

        <div style="background:#1e1b3a;border:1px solid #4338ca;border-radius:8px;padding:8px 10px;margin-bottom:10px;font-size:10px;color:#a5b4fc;line-height:1.5;">
            ℹ️ Mỗi mẫu là <b>1 giao dịch riêng</b>, nên MetaMask sẽ hỏi xác nhận nhiều lần — có bao nhiêu mẫu thì bấy nhiêu lần. Cứ bấm Confirm liên tục. Nếu lỡ tay bấm Reject, các mẫu đã lưu vẫn giữ nguyên, bấm nút lại là gửi tiếp phần còn thiếu.
        </div>

        <button id="u721-upload-btn" style="width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#6366f1,#4338ca);color:white;font-size:15px;font-weight:800;cursor:pointer;letter-spacing:1px;box-shadow:0 4px 15px rgba(99,102,241,0.3);">🚀 ĐẨY TẤT CẢ LÊN BLOCKCHAIN</button>

        <div id="u721-status" style="margin-top:10px;font-size:12px;text-align:center;color:#94a3b8;min-height:20px;"></div>

        <div id="u721-result" style="display:none;margin-top:12px;background:#0f1a2e;border:1px solid #6366f1;border-radius:12px;padding:15px;">
            <div style="font-size:14px;font-weight:bold;color:#6366f1;margin-bottom:10px;">🎉 Đã nạp xong bộ mẫu!</div>
            <div id="u721-result-list" style="font-size:11px;color:#cbd5e1;line-height:1.7;"></div>
            <div style="margin-top:10px;padding:8px;background:#1e293b;border-radius:8px;font-size:10px;color:#10b981;text-align:center;">
                💡 Nhớ cấp <b>MINTER_ROLE</b> cho máy phát bằng khối 🔑 Phân Quyền, rồi học sinh mới mở rương được!
            </div>
        </div>
    </div>`,

    engineCode: () => `
        var U721_PINATA_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiNTE1M2M0Yy1hMzg3LTRmZDEtODI0My1mZjM0MzU5YTM3MjYiLCJlbWFpbCI6ImNuZ2hpYTEzMTFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjBkZTFmNmJmODdiNzc5NTAzYTJlIiwic2NvcGVkS2V5U2VjcmV0IjoiZWIwNmNlMTZhNzEwYjJjYTk2MTU4ZGZkYjUyZGJlMTI1MjQwYzJlOGI3NjA2ODY0YmI5OWNkOTU1NzliMjg5NCIsImV4cCI6MTgwODY3MjE5NH0.VGKX8Fh2z49FpeyhVMCpIYrkwXoz4TfDRLDzyUSYFSM';
        var U721_ABI = [
            "function setTemplate(uint256 templateId, string uri, uint256 weight)"
        ];

        // Mỗi phần tử: { file, url, name, id, weight, uri, saved, _pctEl, _tagEl, _gateway }
        var _u721Rows = [];

        var _u721DropArea  = document.getElementById('u721-drop-area');
        var _u721FileInput = document.getElementById('u721-file-input');
        var _u721TableBox  = document.getElementById('u721-table-box');
        var _u721RowsBox   = document.getElementById('u721-rows');
        var _u721TotalW    = document.getElementById('u721-total-weight');
        var _u721ClearBtn  = document.getElementById('u721-clear-btn');
        var _u721UploadBtn = document.getElementById('u721-upload-btn');
        var _u721Status    = document.getElementById('u721-status');
        var _u721Result    = document.getElementById('u721-result');
        var _u721ResultList= document.getElementById('u721-result-list');

        function _u721SetStatus(msg, color) {
            _u721Status.innerHTML = '<span style="color:' + (color || '#94a3b8') + '">' + msg + '</span>';
        }

        function _u721NextId() {
            var max = 0;
            _u721Rows.forEach(function(r){ if (r.id > max) max = r.id; });
            return max + 1;
        }

        function _u721Pending() {
            return _u721Rows.filter(function(r){ return !r.saved; });
        }

        // Đổi chữ trên nút theo tiến độ
        function _u721UpdateButton() {
            var left = _u721Pending().length;
            var done = _u721Rows.length - left;
            if (_u721Rows.length === 0)      _u721UploadBtn.textContent = '🚀 ĐẨY TẤT CẢ LÊN BLOCKCHAIN';
            else if (left === 0)             _u721UploadBtn.textContent = '✅ ĐÃ LƯU HẾT ' + _u721Rows.length + ' MẪU';
            else if (done === 0)             _u721UploadBtn.textContent = '🚀 ĐẨY ' + left + ' MẪU LÊN BLOCKCHAIN';
            else                             _u721UploadBtn.textContent = '🔁 GỬI TIẾP ' + left + ' MẪU CÒN LẠI';
        }

        // Chỉ ghi lại số %, không vẽ lại bảng — tránh mất con trỏ khi đang gõ
        function _u721UpdatePercents() {
            var totalW = _u721Rows.reduce(function(s, r){ return s + (r.weight || 0); }, 0);
            var savedN = _u721Rows.length - _u721Pending().length;
            _u721TotalW.textContent = _u721Rows.length + ' mẫu | Tổng weight: ' + totalW
                + (savedN > 0 ? ' | Đã lưu: ' + savedN : '');
            _u721Rows.forEach(function(r) {
                if (r._pctEl) {
                    r._pctEl.textContent = (totalW > 0 ? ((r.weight || 0) / totalW * 100).toFixed(1) : '0.0') + '%';
                }
            });
            _u721UpdateButton();
        }

        function _u721Render() {
            _u721RowsBox.innerHTML = '';
            if (_u721Rows.length === 0) { _u721TableBox.style.display = 'none'; _u721UpdateButton(); return; }
            _u721TableBox.style.display = 'block';

            _u721Rows.forEach(function(row) {
                var wrap = document.createElement('div');
                wrap.style.cssText = 'background:' + (row.saved ? '#0f2a1a' : '#1e293b')
                    + ';border:1px solid ' + (row.saved ? '#10b981' : '#334155') + ';border-radius:8px;padding:8px;';

                // --- Dòng 1: ảnh + tên + nút xoá ---
                var line1 = document.createElement('div');
                line1.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:6px;';

                var img = document.createElement('img');
                img.src = row.url;
                img.style.cssText = 'width:36px;height:36px;object-fit:cover;border-radius:6px;border:1px solid #475569;flex:0 0 auto;';

                var nameInp = document.createElement('input');
                nameInp.type = 'text'; nameInp.value = row.name; nameInp.maxLength = 32;
                nameInp.placeholder = 'Tên mẫu';
                nameInp.disabled = !!row.saved;
                nameInp.style.cssText = 'flex:1;min-width:0;width:auto;padding:6px 8px;border-radius:6px;border:1px solid #334155;background:#0f172a;color:'
                    + (row.saved ? '#64748b' : '#e2e8f0') + ';font-size:12px;outline:none;';
                nameInp.addEventListener('input', function(){ row.name = this.value; });

                var delBtn = document.createElement('button');
                delBtn.textContent = '✕'; delBtn.title = 'Bỏ mẫu này khỏi danh sách';
                delBtn.style.cssText = 'width:auto;flex:0 0 auto;padding:4px 9px;border-radius:6px;border:none;background:#7f1d1d;color:#fca5a5;font-size:12px;cursor:pointer;';
                delBtn.addEventListener('click', function(){
                    var i = _u721Rows.indexOf(row);
                    if (i > -1) { URL.revokeObjectURL(row.url); _u721Rows.splice(i, 1); _u721Render(); }
                });

                line1.appendChild(img); line1.appendChild(nameInp); line1.appendChild(delBtn);

                // --- Dòng 2: Template ID + Weight + % / trạng thái ---
                var line2 = document.createElement('div');
                line2.style.cssText = 'display:flex;align-items:center;gap:6px;';

                var idLbl = document.createElement('span');
                idLbl.textContent = 'ID';
                idLbl.style.cssText = 'font-size:10px;color:#64748b;flex:0 0 auto;';

                var idInp = document.createElement('input');
                idInp.type = 'number'; idInp.min = '0'; idInp.value = row.id;
                idInp.disabled = !!row.saved;
                idInp.style.cssText = 'width:56px;flex:0 0 auto;padding:5px 6px;border-radius:6px;border:1px solid #334155;background:#0f172a;color:#6366f1;font-size:12px;font-weight:bold;outline:none;';
                idInp.addEventListener('input', function(){ row.id = parseInt(this.value); });

                var wLbl = document.createElement('span');
                wLbl.textContent = 'Weight';
                wLbl.style.cssText = 'font-size:10px;color:#64748b;flex:0 0 auto;margin-left:4px;';

                var wInp = document.createElement('input');
                wInp.type = 'number'; wInp.min = '1'; wInp.max = '9999'; wInp.value = row.weight;
                wInp.disabled = !!row.saved;
                wInp.style.cssText = 'width:64px;flex:0 0 auto;padding:5px 6px;border-radius:6px;border:1px solid #334155;background:#0f172a;color:#f59e0b;font-size:12px;font-weight:bold;outline:none;';
                wInp.addEventListener('input', function(){ row.weight = parseInt(this.value) || 0; _u721UpdatePercents(); });

                var tagEl = document.createElement('span');
                tagEl.style.cssText = 'margin-left:auto;font-size:10px;font-weight:700;color:#10b981;flex:0 0 auto;';
                tagEl.textContent = row.saved ? '✅ Đã lưu' : '';
                row._tagEl = tagEl;

                var pctSpan = document.createElement('span');
                pctSpan.style.cssText = 'font-size:11px;font-weight:700;color:#10b981;background:#0f172a;padding:3px 8px;border-radius:20px;flex:0 0 auto;'
                    + (row.saved ? '' : 'margin-left:auto;');
                row._pctEl = pctSpan;

                line2.appendChild(idLbl); line2.appendChild(idInp);
                line2.appendChild(wLbl);  line2.appendChild(wInp);
                line2.appendChild(tagEl); line2.appendChild(pctSpan);

                wrap.appendChild(line1); wrap.appendChild(line2);
                _u721RowsBox.appendChild(wrap);
            });

            _u721UpdatePercents();
        }

        function _u721AddFiles(fileList) {
            var added = 0, skipped = 0;
            Array.prototype.forEach.call(fileList, function(f) {
                if (!f.type.startsWith('image/')) { skipped++; return; }
                if (f.size > 10 * 1024 * 1024) { toast('error', 'Bỏ qua "' + f.name + '" (lớn hơn 10MB)'); return; }
                var baseName = f.name.replace(/\\.[^.]+$/, '').substring(0, 32);
                _u721Rows.push({
                    file: f,
                    url: URL.createObjectURL(f),
                    name: baseName || ('Mẫu ' + _u721NextId()),
                    id: _u721NextId(),
                    weight: 10,
                    uri: null,
                    saved: false
                });
                added++;
            });
            if (added > 0) {
                _u721Render();
                _u721SetStatus('✅ Đã thêm ' + added + ' mẫu. Chỉnh Weight rồi bấm nút đẩy lên.', '#10b981');
            }
            if (skipped > 0) toast('info', 'Đã bỏ qua ' + skipped + ' file không phải ảnh.');
        }

        if (_u721DropArea && _u721FileInput) {
            _u721DropArea.addEventListener('click', function(){ _u721FileInput.click(); });
            _u721DropArea.addEventListener('dragover', function(e){
                e.preventDefault(); _u721DropArea.style.borderColor = '#6366f1'; _u721DropArea.style.background = '#1e293b';
            });
            _u721DropArea.addEventListener('dragleave', function(){
                _u721DropArea.style.borderColor = '#334155'; _u721DropArea.style.background = '#0f172a';
            });
            _u721DropArea.addEventListener('drop', function(e){
                e.preventDefault();
                _u721DropArea.style.borderColor = '#334155'; _u721DropArea.style.background = '#0f172a';
                if (e.dataTransfer.files.length > 0) _u721AddFiles(e.dataTransfer.files);
            });
            _u721FileInput.addEventListener('change', function(e){
                if (e.target.files.length > 0) _u721AddFiles(e.target.files);
                this.value = ''; // cho phép chọn lại cùng file
            });
        }

        if (_u721ClearBtn) {
            _u721ClearBtn.addEventListener('click', function(){
                _u721Rows.forEach(function(r){ URL.revokeObjectURL(r.url); });
                _u721Rows = [];
                _u721Render();
                _u721Result.style.display = 'none';
                _u721SetStatus('', '#94a3b8');
            });
        }

        // Đẩy 1 mẫu lên IPFS, trả về tokenURI. Đã đẩy rồi thì dùng lại, không tải lại.
        async function _u721EnsureUploaded(row) {
            if (row.uri) return row.uri;

            var imgForm = new FormData();
            imgForm.append('file', row.file);
            imgForm.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));
            var imgRes = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + U721_PINATA_JWT },
                body: imgForm
            });
            if (!imgRes.ok) throw new Error('Tải ảnh "' + row.name + '" thất bại (' + imgRes.status + ')');
            var imgData = await imgRes.json();

            var metadata = { name: row.name, description: 'Mẫu ' + row.name, image: 'ipfs://' + imgData.IpfsHash };
            var metaRes = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + U721_PINATA_JWT },
                body: JSON.stringify({
                    pinataContent: metadata,
                    pinataMetadata: { name: row.name + '_template.json' },
                    pinataOptions: { cidVersion: 1 }
                })
            });
            if (!metaRes.ok) throw new Error('Tải metadata "' + row.name + '" thất bại (' + metaRes.status + ')');
            var metaData = await metaRes.json();

            row._gateway = 'https://gateway.pinata.cloud/ipfs/' + imgData.IpfsHash;
            row.uri = 'ipfs://' + metaData.IpfsHash;
            return row.uri;
        }

        function _u721ShowResult() {
            var saved = _u721Rows.filter(function(r){ return r.saved; });
            if (saved.length === 0) { _u721Result.style.display = 'none'; return; }
            var totalW = saved.reduce(function(s, r){ return s + r.weight; }, 0);
            var html = '';
            saved.forEach(function(r) {
                var pct = totalW > 0 ? (r.weight / totalW * 100).toFixed(1) : '0.0';
                html += '<div style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid #1e293b;">'
                      + (r._gateway ? '<img src="' + r._gateway + '" style="width:28px;height:28px;object-fit:cover;border-radius:4px;">' : '')
                      + '<span style="flex:1;color:#e2e8f0;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + r.name + '</span>'
                      + '<span style="color:#64748b;font-family:monospace;">#' + r.id + '</span>'
                      + '<span style="color:#10b981;font-weight:700;">' + pct + '%</span>'
                      + '</div>';
            });
            _u721ResultList.innerHTML = html;
            _u721Result.style.display = 'block';
            setTimeout(function(){ _u721Result.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 100);
        }

        if (_u721UploadBtn) {
            _u721UploadBtn.addEventListener('click', async function() {
                if (!signer) { toast('error', 'Cần kết nối ví (🦊) trước!'); return; }

                var colAddr = document.getElementById('u721-collection-addr').value.trim();
                if (!colAddr || colAddr.length !== 42) { toast('error', 'Địa chỉ Bộ Sưu Tập không hợp lệ!'); return; }
                if (_u721Rows.length === 0) { toast('error', 'Chưa chọn ảnh mẫu nào!'); return; }

                var pending = _u721Pending();
                if (pending.length === 0) { toast('info', 'Tất cả mẫu đã được lưu rồi!'); return; }

                // Kiểm tra toàn bộ danh sách trước khi tốn công upload
                var seen = {};
                for (var v = 0; v < _u721Rows.length; v++) {
                    var r = _u721Rows[v];
                    if (!r.name || !r.name.trim())  { toast('error', 'Mẫu thứ ' + (v+1) + ' chưa có tên!'); return; }
                    if (isNaN(r.id) || r.id < 0)    { toast('error', 'Mẫu "' + r.name + '" có Template ID không hợp lệ!'); return; }
                    if (seen[r.id])                 { toast('error', 'Trùng Template ID #' + r.id + '! Mỗi mẫu phải có ID riêng.'); return; }
                    seen[r.id] = true;
                    if (!r.weight || r.weight < 1)  { toast('error', 'Mẫu "' + r.name + '" phải có Weight >= 1!'); return; }
                }

                var collection = new ethers.Contract(colAddr, U721_ABI, signer);
                var total = pending.length;
                var okCount = 0;

                _u721UploadBtn.disabled = true; _u721UploadBtn.style.opacity = '0.5';

                try {
                    for (var i = 0; i < total; i++) {
                        var row = pending[i];
                        var pos = '(' + (i+1) + '/' + total + ')';

                        if (!row.uri) {
                            _u721SetStatus('📤 ' + pos + ' Đang tải "' + row.name + '" lên IPFS...', '#6366f1');
                            await _u721EnsureUploaded(row);
                        }

                        _u721SetStatus('⛏️ ' + pos + ' Đang lưu "' + row.name + '" — <b>xác nhận trên MetaMask</b>', '#f59e0b');
                        var tx = await collection.setTemplate(row.id, row.uri, row.weight);

                        _u721SetStatus('⏳ ' + pos + ' Đang chờ Blockchain xác nhận "' + row.name + '"...', '#6366f1');
                        await tx.wait();

                        row.saved = true;
                        okCount++;
                        _u721Render();       // đổi dòng sang màu xanh "✅ Đã lưu"
                        _u721ShowResult();
                    }

                    _u721SetStatus('✅ Hoàn tất! Đã lưu ' + _u721Rows.filter(function(r){return r.saved;}).length + '/' + _u721Rows.length + ' mẫu.', '#10b981');
                    toast('success', 'Đã nạp xong ' + okCount + ' mẫu vào rương!');

                } catch(e) {
                    var msg = e.reason || e.message || 'Lỗi không xác định';
                    if (msg.indexOf('user rejected') !== -1) msg = 'Bạn đã từ chối giao dịch';
                    if (msg.indexOf('Not authorized') !== -1 || msg.indexOf('OwnableUnauthorizedAccount') !== -1) msg = 'Bạn không phải Owner của bộ sưu tập này';

                    var left = _u721Pending().length;
                    _u721Render();
                    _u721ShowResult();
                    _u721SetStatus('⚠️ ' + msg.substring(0, 80) + '. Đã lưu được ' + okCount + ' mẫu, còn ' + left + ' mẫu — bấm nút để gửi tiếp.', '#f59e0b');
                    toast('error', msg.substring(0, 60));

                } finally {
                    _u721UploadBtn.disabled = false; _u721UploadBtn.style.opacity = '1';
                    _u721UpdateButton();
                }
            });
        }
    `,
    bindings: []
}
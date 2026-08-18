// ==================== KHỐI 4: TRANSFER (MULTI-TOKEN) ====================
export default {
    id: "transfer",
    name: "🚀 Chuyển Tài Sản",
    desc: "Gửi Coin, NFT hoặc Huy Hiệu cho người khác.",
    color: "#8b5cf6",
    label: "Chuyển tiền/NFT",
    multiToken: true,
    preview: (tk) => `
        <div style="display:flex;gap:4px;margin-bottom:6px;">
            <div style="flex:1;background:#8b5cf6;color:white;font-size:10px;text-align:center;padding:4px;border-radius:4px;">🪙 Coin</div>
            <div style="flex:1;background:transparent;color:#94a3b8;font-size:10px;text-align:center;padding:4px;border-radius:4px;">🖼️ NFT</div>
            <div style="flex:1;background:transparent;color:#94a3b8;font-size:10px;text-align:center;padding:4px;border-radius:4px;">🏅 Huy Hiệu</div>
        </div>
        <select style="width:100%;padding:4px;border-radius:4px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:11px;margin-bottom:6px;">
            <option>🪙 ${tk}</option><option>➕ Thêm lạ...</option>
        </select>
        <div class="pv-input">Ví nhận (0x...)</div>
        <div class="pv-input">Số lượng...</div>
        <div class="pv-btn" style="background:#8b5cf6;">🚀 Chuyển Ngay</div>`,
    exportHtml: (tk, tokenList) => {
        const tokens = Array.isArray(tokenList) ? tokenList : [];
        const options = tokens.length > 0
            ? tokens.map(t => `<option value="${t}" data-name="${t.substring(0, 6)}...">${t.substring(0, 6)}...</option>`).join('')
            : `<option value="">-- Chọn contract có sẵn --</option>`;
            
        const fullOptions = options + `<option value="custom">➕ Thêm Contract lạ...</option>`;

        return `
    <div class="khoi" style="border-left-color:#8b5cf6;" id="tf-block-container">
        <div class="khoi-title" style="margin-bottom:12px;">🚀 Chuyển Đa Tài Sản</div>
        
        <!-- TABS -->
        <div style="display:flex;border-radius:8px;background:#1e293b;padding:4px;margin-bottom:12px;">
            <div id="tf-tab-erc20" style="flex:1;text-align:center;padding:6px;font-size:12px;font-weight:bold;cursor:pointer;border-radius:6px;background:#8b5cf6;color:white;transition:0.3s;">🪙 Coin</div>
            <div id="tf-tab-erc721" style="flex:1;text-align:center;padding:6px;font-size:12px;font-weight:bold;cursor:pointer;border-radius:6px;color:#94a3b8;transition:0.3s;">🖼️ NFT</div>
            <div id="tf-tab-erc1155" style="flex:1;text-align:center;padding:6px;font-size:12px;font-weight:bold;cursor:pointer;border-radius:6px;color:#94a3b8;transition:0.3s;">🏅 Huy Hiệu</div>
        </div>
        
        <!-- HIDDEN TYPE -->
        <input type="hidden" id="tf-type" value="erc20">

        <!-- CONTRACT SELECT & CUSTOM INPUT -->
        <select id="tf-select" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:rgba(0,0,0,0.3);color:inherit;font-size:13px;margin-bottom:8px;cursor:pointer;">
            ${fullOptions}
        </select>
        <div id="tf-custom-group" style="display:flex;gap:6px;margin-bottom:8px;">
            <input id="tf-custom-contract" type="text" placeholder="Dán địa chỉ Contract (0x...)" style="flex:1;min-width:0;width:auto;padding:10px;border-radius:8px;border:1px dashed #8b5cf6;background:#0f172a;color:#a5b4fc;font-size:12px;outline:none;">
            <button id="tf-add-btn" style="width:auto;flex:0 0 auto;padding:10px 15px;border-radius:8px;border:none;background:#8b5cf6;color:white;font-weight:bold;cursor:pointer;font-size:13px;">Lưu</button>
        </div>
        
        <!-- GALLERY CONTAINER -->
        <div id="tf-gallery-container" style="display:none;margin-bottom:8px;">
            <button id="tf-load-gallery-btn" style="width:100%;padding:8px;border-radius:8px;border:1px dashed #10b981;background:transparent;color:#10b981;font-size:12px;font-weight:bold;cursor:pointer;margin-bottom:8px;transition:0.3s;">🔄 TẢI KHO ĐỒ (TÌM ẢNH)</button>
            <div id="tf-gallery-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:6px;max-height:200px;overflow-y:auto;padding-right:4px;"></div>
        </div>

        <!-- ID (FOR NFT/1155) -->
        <input id="tf-token-id" type="number" placeholder="Hoặc nhập tay ID NFT / Huy Hiệu" style="display:none;width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;margin-bottom:4px;outline:none;">

        <!-- BALANCE DISPLAY (NEW) -->
        <div id="tf-balance-display" style="font-size:11px;color:#10b981;margin-bottom:8px;font-weight:bold;text-align:right;display:none;"></div>

        <!-- AMOUNT (FOR ERC20/1155) -->
        <input id="tf-amount" type="number" placeholder="Số lượng chuyển..." style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;margin-bottom:12px;outline:none;">

        <!-- TO ADDRESS -->
        <div style="display:flex;gap:6px;margin-bottom:8px;">
            <input id="tf-address" type="text" placeholder="Địa chỉ ví người nhận (0x...)" style="flex:1;min-width:0;width:auto;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;">
            <button id="tf-scan-btn" style="width:auto;flex:0 0 auto;padding:10px 12px;border-radius:8px;border:none;background:#334155;color:#38bdf8;cursor:pointer;font-size:18px;line-height:1;" title="Quét mã QR">📷</button>
        </div>
        
        <!-- SCANNER CONTAINER -->
        <div id="tf-scanner-container" style="display:none;margin-bottom:8px;background:#0f172a;border-radius:8px;padding:8px;text-align:center;">
            <div id="tf-reader" style="width:100%;margin-bottom:8px;"></div>
            <div style="display:flex;gap:6px;justify-content:center;">
                <label style="padding:6px 12px;border-radius:6px;border:none;background:#3b82f6;color:white;cursor:pointer;font-size:11px;">
                    📁 Tải ảnh QR lên
                    <input type="file" id="tf-qr-file" accept="image/*" style="display:none;">
                </label>
                <button id="tf-close-scan-btn" style="padding:6px 12px;border-radius:6px;border:none;background:#ef4444;color:white;cursor:pointer;font-size:11px;">Đóng Camera</button>
            </div>
        </div>
        
        <button id="tf-btn" style="width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:white;font-size:14px;font-weight:bold;cursor:pointer;box-shadow:0 4px 15px rgba(139,92,246,0.3);">🚀 CHUYỂN NGAY</button>
    </div>`;
    },
    globalCode: () => `
    function __GlobalTf_init(prefix) {
        var t20 = document.getElementById(prefix+'tf-tab-erc20');
        var t721 = document.getElementById(prefix+'tf-tab-erc721');
        var t1155 = document.getElementById(prefix+'tf-tab-erc1155');
        var typeInp = document.getElementById(prefix+'tf-type');
        var idInp = document.getElementById(prefix+'tf-token-id');
        var amtInp = document.getElementById(prefix+'tf-amount');
        var sel = document.getElementById(prefix+'tf-select');
        var custGroup = document.getElementById(prefix+'tf-custom-group');
        var cust = document.getElementById(prefix+'tf-custom-contract');
        var addBtn = document.getElementById(prefix+'tf-add-btn');
        var balDisp = document.getElementById(prefix+'tf-balance-display');
        var galCont = document.getElementById(prefix+'tf-gallery-container');
        var galBtn = document.getElementById(prefix+'tf-load-gallery-btn');
        var galGrid = document.getElementById(prefix+'tf-gallery-grid');
        var scanBtn = document.getElementById(prefix+'tf-scan-btn');
        var closeScanBtn = document.getElementById(prefix+'tf-close-scan-btn');
        var scanCont = document.getElementById(prefix+'tf-scanner-container');
        var qrFile = document.getElementById(prefix+'tf-qr-file');
        
        if(!t20) return;
        
        let html5QrcodeScanner;
        let isScanning = false;
        
        function startScanner() {
            if(isScanning) return;
            scanCont.style.display = 'block';
            if(!html5QrcodeScanner) {
                html5QrcodeScanner = new Html5Qrcode(prefix+"tf-reader");
            }
            html5QrcodeScanner.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: {width: 250, height: 250} },
                (decodedText) => {
                    let addr = decodedText;
                    if(addr.startsWith('ethereum:')) addr = addr.replace('ethereum:','');
                    if(addr.includes('@')) addr = addr.split('@')[0];
                    if(addr.startsWith('0x') && addr.length >= 42) {
                        document.getElementById(prefix+'tf-address').value = addr.substring(0,42);
                        toast('success', 'Đã quét được địa chỉ ví!');
                        stopScanner();
                    }
                },
                (err) => {} // ignore stream errors
            ).then(() => { isScanning = true; }).catch(err => {
                toast('error', 'Không thể mở Camera! Vui lòng cấp quyền hoặc dùng tính năng tải ảnh.');
                // Không ẩn scanCont để user vẫn có thể bấm nút Chọn ảnh
            });
        }
        
        function stopScanner() {
            if(html5QrcodeScanner && isScanning) {
                html5QrcodeScanner.stop().then(() => {
                    isScanning = false;
                    scanCont.style.display = 'none';
                });
            } else {
                scanCont.style.display = 'none';
            }
        }
        
        if(scanBtn) {
            scanBtn.onclick = () => {
                if(typeof Html5Qrcode === 'undefined') {
                    toast('info', 'Đang tải công cụ Camera...');
                    var script = document.createElement('script');
                    script.src = "https://unpkg.com/html5-qrcode";
                    script.onload = startScanner;
                    document.head.appendChild(script);
                } else {
                    startScanner();
                }
            };
        }
        if(closeScanBtn) closeScanBtn.onclick = stopScanner;
        
        if (qrFile) {
            qrFile.addEventListener('change', e => {
                if (e.target.files.length == 0) return;
                const imageFile = e.target.files[0];
                
                if(typeof Html5Qrcode === 'undefined') {
                    toast('error', 'Chưa tải xong công cụ quét, vui lòng thử lại!');
                    return;
                }
                
                // Nếu camera đang mở thì tắt đi trước khi quét ảnh để tránh xung đột
                if (isScanning && html5QrcodeScanner) {
                    html5QrcodeScanner.stop().then(() => { isScanning = false; scanImage(imageFile); }).catch(()=>scanImage(imageFile));
                } else {
                    scanImage(imageFile);
                }
                
                function scanImage(file) {
                    let tempScanner = new Html5Qrcode(prefix+"tf-reader");
                    tempScanner.scanFile(file, true)
                    .then(decodedText => {
                        let addr = decodedText;
                        if(addr.startsWith('ethereum:')) addr = addr.replace('ethereum:','');
                        if(addr.includes('@')) addr = addr.split('@')[0];
                        if(addr.startsWith('0x') && addr.length >= 42) {
                            document.getElementById(prefix+'tf-address').value = addr.substring(0,42);
                            toast('success', 'Đã quét mã QR từ ảnh thành công!');
                            scanCont.style.display = 'none'; // Ẩn luôn toàn bộ khung
                        } else {
                            toast('error', 'Mã QR không hợp lệ!');
                        }
                        qrFile.value = '';
                    })
                    .catch(err => {
                        toast('error', 'Không tìm thấy mã QR trong ảnh này!');
                        qrFile.value = '';
                    });
                }
            });
        }
        
        const savedOptions = {
            erc20: [],
            erc721: [],
            erc1155: []
        };
        
        // Trích xuất các option cấu hình sẵn đưa vào TẤT CẢ các tab vì ta chưa biết chuẩn của nó là gì
        Array.from(sel.options).forEach(o => {
            if(o.value && o.value !== 'custom') {
                savedOptions.erc20.push({val: o.value, text: o.text});
                savedOptions.erc721.push({val: o.value, text: o.text});
                savedOptions.erc1155.push({val: o.value, text: o.text});
            }
        });
        
        function renderOptions() {
            const currentType = typeInp.value;
            sel.innerHTML = '';
            if (savedOptions[currentType].length === 0) {
                sel.innerHTML += '<option value="">-- Chưa có Contract (dán ở ô dưới) --</option>';
            } else {
                savedOptions[currentType].forEach(opt => {
                    sel.innerHTML += '<option value="'+opt.val+'">'+opt.text+'</option>';
                });
            }
            sel.innerHTML += '<option value="custom">➕ Nhập Contract lạ...</option>';
            // Ô nhập contract giờ LUÔN hiện, không ẩn nữa
            custGroup.style.display = 'flex';
        }
        
        function setTab(type) {
            typeInp.value = type;
            t20.style.background = type==='erc20' ? '#8b5cf6' : 'transparent';
            t20.style.color = type==='erc20' ? 'white' : '#94a3b8';
            t721.style.background = type==='erc721' ? '#8b5cf6' : 'transparent';
            t721.style.color = type==='erc721' ? 'white' : '#94a3b8';
            t1155.style.background = type==='erc1155' ? '#8b5cf6' : 'transparent';
            t1155.style.color = type==='erc1155' ? 'white' : '#94a3b8';
            
            if(type==='erc20') { idInp.style.display='none'; amtInp.style.display='block'; galCont.style.display='none'; }
            if(type==='erc721') { idInp.style.display='block'; amtInp.style.display='none'; galCont.style.display='block'; }
            if(type==='erc1155') { idInp.style.display='block'; amtInp.style.display='block'; galCont.style.display='block'; }
            
            renderOptions();
            updateBalance();
            if(galGrid) galGrid.innerHTML = ''; // reset gallery when tab changes
        }
        
        t20.onclick = () => setTab('erc20');
        t721.onclick = () => setTab('erc721');
        t1155.onclick = () => setTab('erc1155');
        
        function getContractAddr() {
            const v = sel.value;
            if (v && v !== 'custom' && v.length === 42) return v;
            return (cust.value || '').trim();
        }
            
        async function updateBalance() {
            if(!signer) { balDisp.style.display = 'none'; return; }
            const currentType = typeInp.value;
            const contractAddr = getContractAddr();
            const tId = idInp.value.trim();
            
            if(!contractAddr || contractAddr.length !== 42) { balDisp.style.display = 'none'; return; }
            
            try {
                const signerAddr = await signer.getAddress();
                if (currentType === 'erc20') {
                    const c = new ethers.Contract(contractAddr, ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)", "function symbol() view returns (string)"], signer);
                    const bal = await c.balanceOf(signerAddr);
                    let dec = 18; try { dec = await c.decimals(); } catch(e){}
                    let sym = 'Coin'; try { sym = await c.symbol(); } catch(e){}
                    const formattedBal = ethers.utils.formatUnits(bal, dec);
                    balDisp.innerText = 'Số dư: ' + formattedBal + ' ' + sym;
                    balDisp.style.color = '#10b981';
                    balDisp.style.display = 'block';
                } 
                else if (currentType === 'erc1155' && tId !== '') {
                    const c = new ethers.Contract(contractAddr, ["function balanceOf(address,uint256) view returns (uint256)"], signer);
                    const bal = await c.balanceOf(signerAddr, tId);
                    balDisp.innerText = 'Bạn đang có: ' + bal.toString() + ' Huy Hiệu (ID ' + tId + ')';
                    balDisp.style.color = '#10b981';
                    balDisp.style.display = 'block';
                }
                else if (currentType === 'erc721' && tId !== '') {
                    const c = new ethers.Contract(contractAddr, ["function ownerOf(uint256) view returns (address)"], signer);
                    try {
                        const owner = await c.ownerOf(tId);
                        if (owner.toLowerCase() === signerAddr.toLowerCase()) {
                            balDisp.innerText = 'Bạn đang sở hữu NFT này ✅';
                            balDisp.style.color = '#10b981';
                        } else {
                            balDisp.innerText = 'Bạn KHÔNG sở hữu NFT này ❌';
                            balDisp.style.color = '#ef4444';
                        }
                    } catch(e) {
                        balDisp.innerText = 'NFT chưa được đúc hoặc sai ID ❓';
                        balDisp.style.color = '#f59e0b';
                    }
                    balDisp.style.display = 'block';
                }
                else {
                    balDisp.style.display = 'none';
                }
            } catch(e) {
                balDisp.style.display = 'none';
            }
        }
        
        sel.onchange = () => {
            custGroup.style.display = 'flex';
            if (sel.value && sel.value !== 'custom') cust.value = '';
            updateBalance();
        };
        
        cust.addEventListener('input', updateBalance);
        idInp.addEventListener('input', updateBalance);
        
        if(galBtn) {
            galBtn.onclick = async () => {
                if(!signer) { toast('error', 'Hãy kết nối ví trước!'); return; }
                const currentType = typeInp.value;
                const contractAddr = sel.value === 'custom' ? cust.value.trim() : sel.value;
                if(!contractAddr || contractAddr.length !== 42) { toast('error', 'Chưa chọn Contract hợp lệ!'); return; }
                
                galBtn.innerText = '⏳ ĐANG QUÉT TRONG VÍ...';
                galBtn.disabled = true;
                galGrid.innerHTML = '';
                
                try {
                    const signerAddr = await signer.getAddress();
                    let foundItems = [];
                    let c;
                    
                    if(currentType === 'erc721') {
                        c = new ethers.Contract(contractAddr, ["function ownerOf(uint256) view returns (address)"], signer);
                    } else if (currentType === 'erc1155') {
                        c = new ethers.Contract(contractAddr, ["function balanceOf(address,uint256) view returns (uint256)"], signer);
                    }
                    
                    // Quét ID từ 0 đến 40 (chia làm 4 cục nhỏ để tránh Rate Limit RPC)
                    for (let i = 0; i <= 40; i += 10) {
                        const chunk = [];
                        for (let j = 0; j < 10 && (i+j) <= 40; j++) {
                            let id = i + j;
                            if (currentType === 'erc721') {
                                chunk.push(c.ownerOf(id).then(o => { if(o.toLowerCase()===signerAddr.toLowerCase()) foundItems.push({id:id.toString(), bal:1}); }).catch(()=>null));
                            } else {
                                chunk.push(c.balanceOf(signerAddr, id).then(b => { if(b.gt(0)) foundItems.push({id:id.toString(), bal:b.toString()}); }).catch(()=>null));
                            }
                        }
                        await Promise.all(chunk);
                    }
                    foundItems.sort((a,b) => parseInt(a.id) - parseInt(b.id));
                    
                    if(foundItems.length === 0) {
                        galGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#ef4444;font-size:11px;padding:10px;">Không tìm thấy vật phẩm nào trong ví của bạn (từ ID 0-40)!</div>';
                    } else {
                        galGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#fcd34d;font-size:11px;padding:10px;">⏳ Đang tải hình ảnh từ IPFS...</div>';
                        let html = '';
                        const metaContract = new ethers.Contract(contractAddr, ["function tokenURI(uint256) view returns (string)", "function uri(uint256) view returns (string)"], signer);
                        
                        for(let item of foundItems) {
                            let imgUrl = '';
                            let nameStr = 'ID: ' + item.id;
                            try {
                                let rawUri = currentType === 'erc721' ? await metaContract.tokenURI(item.id) : await metaContract.uri(item.id);
                                rawUri = rawUri.replace('ipfs://', 'https://ipfs.io/ipfs/').replace('{id}', item.id);
                                const res = await fetch(rawUri);
                                const meta = await res.json();
                                if(meta.image) imgUrl = meta.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
                                if(meta.name) nameStr = meta.name;
                            } catch(e) {} // Bỏ qua nếu ko tải dc metadata
                            
                            html += \`
                            <div onclick="document.getElementById('\${prefix}tf-token-id').value='\${item.id}'; document.getElementById('\${prefix}tf-token-id').dispatchEvent(new Event('input'));" style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:6px;cursor:pointer;text-align:center;transition:0.2s;" onmouseover="this.style.borderColor='#10b981'" onmouseout="this.style.borderColor='#334155'">
                                \${imgUrl ? \`<img src="\${imgUrl}" style="width:100%;height:80px;object-fit:cover;border-radius:6px;margin-bottom:6px;">\` : \`<div style="width:100%;height:80px;background:#0f172a;border-radius:6px;margin-bottom:6px;display:flex;align-items:center;justify-content:center;font-size:24px;">📦</div>\`}
                                <div style="font-size:11px;font-weight:bold;color:#e2e8f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">\${nameStr}</div>
                                \${currentType==='erc1155' ? \`<div style="font-size:10px;color:#10b981;margin-top:2px;">SL hiện có: \${item.bal}</div>\` : ''}
                            </div>\`;
                        }
                        galGrid.innerHTML = html;
                    }
                } catch(e) {
                    console.error(e);
                    toast('error', 'Lỗi kết nối khi quét kho đồ!');
                    galGrid.innerHTML = '';
                } finally {
                    galBtn.innerText = '🔄 TẢI KHO ĐỒ (TÌM ẢNH)';
                    galBtn.disabled = false;
                }
            };
        }
        
        if(addBtn) {
            addBtn.onclick = async () => {
                var addr = cust.value.trim();
                if(addr && addr.startsWith('0x') && addr.length === 42) {
                    if (!signer) { toast('error', 'Hãy kết nối ví trước!'); return; }
                    addBtn.innerText = '⏳...';
                    addBtn.disabled = true;
                    try {
                        let nameStr = addr.substring(0,6) + '...';
                        const currentType = typeInp.value;
                        
                        if (currentType === 'erc20') {
                            const c = new ethers.Contract(addr, ["function symbol() view returns (string)", "function decimals() view returns (uint8)"], signer);
                            try { await c.decimals(); } catch(e) { throw new Error("NOT_ERC20"); }
                            try { nameStr = await c.symbol(); } catch(e){}
                        } else if (currentType === 'erc721') {
                            const c = new ethers.Contract(addr, ["function name() view returns (string)", "function supportsInterface(bytes4) view returns (bool)"], signer);
                            try {
                                const is721 = await c.supportsInterface("0x80ac58cd");
                                if(!is721) throw new Error("NOT_ERC721");
                            } catch(e) { throw new Error("NOT_ERC721"); }
                            try { nameStr = await c.name(); } catch(e){}
                        } else if (currentType === 'erc1155') {
                            const c = new ethers.Contract(addr, ["function name() view returns (string)", "function supportsInterface(bytes4) view returns (bool)"], signer);
                            try {
                                const is1155 = await c.supportsInterface("0xd9b67a26");
                                if(!is1155) throw new Error("NOT_ERC1155");
                            } catch(e) { throw new Error("NOT_ERC1155"); }
                            try { nameStr = await c.name(); } catch(e){ nameStr = 'Huy Hiệu'; }
                        }
                        
                        // Cập nhật danh sách của tab hiện tại
                        savedOptions[currentType].push({val: addr, text: nameStr + " (" + addr.substring(0,6) + "...)"});
                        renderOptions();
                        sel.value = addr; // Auto select new option
                        cust.value = '';
                        toast('success', 'Đã lưu: ' + nameStr);
                        updateBalance();
                    } catch(e) {
                        console.error(e);
                        let msg = 'Không thể kiểm tra Contract! Có thể sai mạng.';
                        if(e.message === 'NOT_ERC20') msg = 'Địa chỉ này KHÔNG PHẢI là Coin (ERC-20)!';
                        if(e.message === 'NOT_ERC721') msg = 'Địa chỉ này KHÔNG PHẢI là NFT (ERC-721)!';
                        if(e.message === 'NOT_ERC1155') msg = 'Địa chỉ này KHÔNG PHẢI là Huy Hiệu (ERC-1155)!';
                        toast('error', msg);
                    } finally {
                        addBtn.innerText = 'Lưu';
                        addBtn.disabled = false;
                    }
                } else {
                    toast('error', 'Địa chỉ ví không hợp lệ (phải bắt đầu bằng 0x và dài 42 ký tự)!');
                }
            };
        }
        
        // Ensure reader gets id applied properly by prefixing HTML but html5-qrcode expects exactly the id passed
        document.getElementById(prefix+'tf-reader').id = prefix+'tf-reader';
        
        // Khởi tạo ban đầu
        renderOptions();
    }
    
    async function __GlobalTf_transfer(prefix) {
        if(!signer){toast('error','Hãy kết nối ví trước!');return;}
        const type = document.getElementById(prefix+'tf-type').value;
        const sel = document.getElementById(prefix+'tf-select');
        const ai = document.getElementById(prefix+'tf-address');
        const mi = document.getElementById(prefix+'tf-amount');
        const idInp = document.getElementById(prefix+'tf-token-id');
        
        let contractAddr = sel.value;
        if(contractAddr === 'custom' || !contractAddr || contractAddr.length !== 42) {
            const custEl = document.getElementById(prefix+'tf-custom-contract');
            contractAddr = custEl ? custEl.value.trim() : '';
        }
        if(!contractAddr||contractAddr.length!==42){toast('error','Chưa nhập địa chỉ Contract hợp lệ!');return;}

        const toAddr = ai.value.trim();
        if(!toAddr){toast('error','Chưa nhập địa chỉ ví người nhận!');return;}
        if(/^(bc1|tb1)/i.test(toAddr)){toast('error','Đây là địa chỉ BITCOIN! Ví Ethereum phải bắt đầu bằng 0x.');return;}
        if(!toAddr.startsWith('0x')){toast('error','Địa chỉ ví phải bắt đầu bằng 0x (bạn đang nhập "'+toAddr.substring(0,6)+'...")');return;}
        if(toAddr.length!==42){toast('error','Địa chỉ ví phải đúng 42 ký tự — hiện có '+toAddr.length+' ký tự.');return;}
        if(!/^0x[a-fA-F0-9]{40}$/.test(toAddr)){toast('error','Địa chỉ ví chứa ký tự lạ (chỉ được dùng số 0-9 và chữ a-f).');return;}
        
        try{
            toast('info','Đang chuẩn bị giao dịch...');
            const signerAddr = await signer.getAddress();
            let tx;
            
            if(type === 'erc20') {
                const amt = mi.value.trim();
                if(!amt||isNaN(amt)||Number(amt)<=0){toast('error','Số lượng phải lớn hơn 0!');return;}
                const c = new ethers.Contract(contractAddr,["function transfer(address,uint256) returns (bool)","function decimals() view returns (uint8)"],signer);
                let dec = 18; try{dec = await c.decimals();}catch(e){}
                tx = await c.transfer(toAddr, ethers.utils.parseUnits(amt, dec));
            } 
            else if(type === 'erc721') {
                const tId = idInp.value.trim();
                if(!tId||isNaN(tId)){toast('error','ID NFT không hợp lệ!');return;}
                const c = new ethers.Contract(contractAddr,["function safeTransferFrom(address,address,uint256)"],signer);
                tx = await c.safeTransferFrom(signerAddr, toAddr, tId);
            }
            else if(type === 'erc1155') {
                const tId = idInp.value.trim();
                const amt = mi.value.trim();
                if(!tId||isNaN(tId)){toast('error','ID Huy Hiệu không hợp lệ!');return;}
                if(!amt||isNaN(amt)||Number(amt)<=0){toast('error','Số lượng phải lớn hơn 0!');return;}
                const c = new ethers.Contract(contractAddr,["function safeTransferFrom(address,address,uint256,uint256,bytes)"],signer);
                tx = await c.safeTransferFrom(signerAddr, toAddr, tId, amt, "0x");
            }
            
            toast('success','Đang chờ Blockchain xác nhận...');
            const btn = document.getElementById(prefix+'tf-btn');
            const oldText = btn.innerText;
            btn.innerText = '⏳ ĐANG XỬ LÝ...';
            btn.disabled = true;
            
            await tx.wait();
            
            btn.innerText = oldText;
            btn.disabled = false;
            toast('success','✅ Chuyển tài sản thành công!');
            ai.value=''; mi.value=''; idInp.value='';
        }catch(e){
            console.error(e);
            const btn = document.getElementById(prefix+'tf-btn');
            if(btn) { btn.innerText = '🚀 CHUYỂN NGAY'; btn.disabled = false; }
            let msg = e.reason || e.message || 'Lỗi giao dịch';
            if(msg.includes('insufficient balance')) msg = 'Số dư không đủ!';
            if(msg.includes('not approved') || msg.includes('transfer caller is not owner')) msg = 'Không có quyền sở hữu tài sản này!';
            if(msg.includes('user rejected')) msg = 'Đã hủy giao dịch!';
            toast('error','Thất bại: '+msg.substring(0, 60));
        }
    }`,
    engineCode: (pfx) => `
    __GlobalTf_init('${pfx}');
    function transferToken() { return __GlobalTf_transfer('${pfx}'); }
    `,
    bindings: [{ btn: "tf-btn", fn: "transferToken" }]
}

// ==================== KHỐI: SÀN ĐẤU GIÁ (AUCTION BIDDING DASHBOARD) ====================
export default {
    id: "auction-bid",
    name: "⚖️ Sàn Đấu Giá",
    desc: "Xem các phiên đấu giá, bỏ thầu bằng Coin, chốt đơn và rút tiền thừa",
    color: "#8b5cf6",
    label: "Sàn Đấu Giá",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#8b5cf6;">
        <div class="khoi-title" style="color:#a78bfa;margin-bottom:12px;">⚖️ SÀN ĐẤU GIÁ NFT</div>
        <p style="font-size:11px;color:#cbd5e1;margin-bottom:12px;line-height:1.5;">Xem tất cả phiên đấu giá đang diễn ra. Bỏ thầu bằng Coin để giành Top 1!</p>
        <div style="display:flex;gap:8px;margin-bottom:12px;">
            <input type="text" id="ab-house" placeholder="🏛️ Mã Sàn Đấu Giá (0x...)" style="flex:1;background:#0f172a;color:#fff;border:1px solid #334155;padding:10px;border-radius:6px;font-size:11px;">
            <button id="ab-load-btn" style="background:#8b5cf6;color:white;border:none;padding:10px 16px;border-radius:8px;font-size:12px;font-weight:bold;cursor:pointer;white-space:nowrap;">🔄 TẢI</button>
        </div>
        <div style="display:flex;gap:10px;margin-bottom:12px;border-bottom:1px solid #334155;">
            <button id="ab-tab-active" style="flex:1;background:none;border:none;color:#a78bfa;font-size:12px;font-weight:bold;padding:8px;border-bottom:2px solid #a78bfa;cursor:pointer;transition:all 0.2s;">🟢 Đang diễn ra</button>
            <button id="ab-tab-history" style="flex:1;background:none;border:none;color:#64748b;font-size:12px;font-weight:bold;padding:8px;border-bottom:2px solid transparent;cursor:pointer;transition:all 0.2s;">📜 Lịch sử</button>
        </div>
        <div id="ab-grid" style="display:grid;grid-template-columns:1fr;gap:10px;">
            <div style="text-align:center;color:#64748b;font-size:12px;padding:20px;">Dán Mã Sàn rồi bấm "Tải" để xem phiên đấu giá...</div>
        </div>
    </div>`,
    engineCode: () => `
    const AUCTION_HOUSE_ABI_BID = [
        "function totalAuctions() view returns (uint256)",
        "function getAuction(uint256 _auctionId) view returns (address seller, address nftContract, uint256 tokenId, address paymentToken, uint256 startingPrice, uint256 highestBid, address highestBidder, uint256 endTime, bool ended, bool cancelled)",
        "function bid(uint256 _auctionId, uint256 _amount) external",
        "function endAuction(uint256 _auctionId) external",
        "function withdraw(uint256 _auctionId) external",
        "function pendingReturns(uint256, address) view returns (uint256)"
    ];

    let _abCountdowns = [];
    window._abAuctionsData = [];
    window._abHouseAddr = '';
    window._abCurrentTab = 'active';

    const tabActiveBtn = document.getElementById('ab-tab-active');
    const tabHistoryBtn = document.getElementById('ab-tab-history');

    if(tabActiveBtn && tabHistoryBtn) {
        tabActiveBtn.addEventListener('click', function() {
            window._abCurrentTab = 'active';
            this.style.color = '#a78bfa'; this.style.borderBottomColor = '#a78bfa';
            tabHistoryBtn.style.color = '#64748b'; tabHistoryBtn.style.borderBottomColor = 'transparent';
            if(window._abAuctionsData.length > 0) renderAuctions();
        });
        tabHistoryBtn.addEventListener('click', function() {
            window._abCurrentTab = 'history';
            this.style.color = '#a78bfa'; this.style.borderBottomColor = '#a78bfa';
            tabActiveBtn.style.color = '#64748b'; tabActiveBtn.style.borderBottomColor = 'transparent';
            if(window._abAuctionsData.length > 0) renderAuctions();
        });
    }

    async function loadAuctions() {
        if(!signer){toast('error','Kết nối Ví trước!');return;}
        const houseAddr = document.getElementById('ab-house').value.trim();
        const grid = document.getElementById('ab-grid');
        const loadBtn = document.getElementById('ab-load-btn');
        if(!houseAddr || houseAddr.length !== 42) { toast('error','Nhập Mã Sàn hợp lệ!'); return; }
        try {
            loadBtn.disabled = true; loadBtn.innerText = '⏳ Tải...';
            grid.innerHTML = '<div style="text-align:center;color:#a78bfa;font-size:12px;">⏳ Đang quét Sàn Đấu Giá...</div>';
            _abCountdowns.forEach(t => clearInterval(t)); _abCountdowns = [];

            const house = new ethers.Contract(houseAddr, AUCTION_HOUSE_ABI_BID, signer);
            const total = (await house.totalAuctions()).toNumber();

            if(total === 0) {
                grid.innerHTML = '<div style="text-align:center;color:#94a3b8;font-size:12px;padding:20px;">Chưa có phiên đấu giá nào!</div>';
                loadBtn.innerText = '🔄 TẢI'; loadBtn.disabled = false; return;
            }

            let allItems = [];
            let fetchCount = 0;
            const MAX_FETCH = 50; // Giới hạn tải 50 phiên gần nhất để tránh lag

            for(let i = total; i >= 1 && fetchCount < MAX_FETCH; i--) { // Lấy từ mới nhất xuống
                try {
                    const a = await house.getAuction(i);
                    allItems.push({ id: i, ...a });
                    fetchCount++;
                } catch(e) {}
            }

            if(allItems.length === 0) {
                grid.innerHTML = '<div style="text-align:center;color:#94a3b8;font-size:12px;padding:20px;">Không có phiên nào.</div>';
                loadBtn.innerText = '🔄 TẢI'; loadBtn.disabled = false; return;
            }

            window._abAuctionsData = allItems;
            window._abHouseAddr = houseAddr;
            await renderAuctions();

            toast('success', 'Đã tải dữ liệu Sàn đấu giá!');
            loadBtn.innerText = '🔄 TẢI'; loadBtn.disabled = false;
        } catch(e) {
            const loadBtn = document.getElementById('ab-load-btn');
            loadBtn.innerText = '🔄 TẢI'; loadBtn.disabled = false;
            document.getElementById('ab-grid').innerHTML = '<div style="text-align:center;color:#ef4444;font-size:12px;padding:20px;">Lỗi: ' + (e.reason || e.message || 'Không rõ') + '</div>';
        }
    }

    async function renderAuctions() {
        const grid = document.getElementById('ab-grid');
        grid.innerHTML = '<div style="text-align:center;color:#a78bfa;font-size:12px;">⏳ Đang hiển thị...</div>';
        _abCountdowns.forEach(t => clearInterval(t)); _abCountdowns = [];

        const myAddr = await signer.getAddress();
        const houseAddr = window._abHouseAddr;
        const house = new ethers.Contract(houseAddr, AUCTION_HOUSE_ABI_BID, signer);
        
        let filtered = window._abAuctionsData.filter(item => {
            const isEnded = item.ended;
            const isCancelled = item.cancelled;
            if (window._abCurrentTab === 'active') return !isEnded && !isCancelled;
            return isEnded && !isCancelled; // Không hiển thị các phiên đã hủy
        });

        if(filtered.length === 0) {
            grid.innerHTML = '<div style="text-align:center;color:#94a3b8;font-size:12px;padding:20px;">Không có dữ liệu trong tab này.</div>';
            return;
        }

        grid.innerHTML = '';

        for(const item of filtered) {
                const endTimeSec = item.endTime.toNumber();
                const isExpired = Date.now()/1000 >= endTimeSec;
                const priceStr = ethers.utils.formatEther(item.startingPrice);
                const highBidStr = item.highestBid.gt(0) ? ethers.utils.formatEther(item.highestBid) : 'Chưa có';
                const payLabel = item.paymentToken.substring(0,6) + '...' + item.paymentToken.substring(38);
                const isEnded = item.ended;
                const isCancelled = item.cancelled;
                const iAmTopBidder = item.highestBidder.toLowerCase() === myAddr.toLowerCase();

                let statusColor = '#10b981'; let statusText = '🟢 Đang diễn ra';
                if(isEnded) { statusColor = '#64748b'; statusText = '✅ Đã chốt'; }
                else if(isCancelled) { statusColor = '#ef4444'; statusText = '❌ Đã hủy'; }
                else if(isExpired) { statusColor = '#fbbf24'; statusText = '⏰ Hết giờ (chờ chốt)'; }

                // Load NFT image
                let imgUrl = ''; let name = 'NFT #' + item.tokenId.toString();
                try {
                    const nft = new ethers.Contract(item.nftContract, ["function tokenURI(uint256) view returns (string)"], signer);
                    const rawUri = await nft.tokenURI(item.tokenId);
                    const ipfsUri = rawUri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
                    const res = await fetch(ipfsUri);
                    const metadata = await res.json();
                    imgUrl = metadata.image ? metadata.image.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/') : '';
                    name = metadata.name || name;
                } catch(e) {}

                // Check pendingReturns cho user
                let pendingAmt = ethers.BigNumber.from(0);
                try { pendingAmt = await house.pendingReturns(item.id, myAddr); } catch(e) {}

                const card = document.createElement('div');
                card.style.cssText = 'background:#1e293b;border-radius:12px;overflow:hidden;border:1px solid #334155;';
                card.innerHTML = \`
                    <div style="display:flex;gap:12px;padding:12px;">
                        <div style="width:100px;height:100px;background:#0f172a;border-radius:8px;overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;">
                            \${imgUrl ? '<img src="'+imgUrl+'" style="width:100%;height:100%;object-fit:cover;">' : '<span style="font-size:30px;">🖼️</span>'}
                        </div>
                        <div style="flex:1;min-width:0;">
                            <div style="font-size:13px;font-weight:bold;color:#f8fafc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">\${name}</div>
                            <div style="font-size:10px;color:\${statusColor};font-weight:bold;margin:4px 0;">\${statusText}</div>
                            <div style="font-size:10px;color:#94a3b8;">Giá khởi điểm: <b style="color:#fbbf24;">\${priceStr}</b> <span style="color:#64748b;">\${payLabel}</span></div>
                            <div style="font-size:10px;color:#94a3b8;margin-top:2px;">Giá cao nhất: <b style="color:#10b981;">\${highBidStr}</b></div>
                            <div style="font-size:10px;color:#94a3b8;margin-top:2px;">Top 1: <span style="color:\${iAmTopBidder ? '#10b981' : '#64748b'};">\${item.highestBidder === '0x0000000000000000000000000000000000000000' ? 'Chưa ai' : (iAmTopBidder ? '⭐ BẠN!' : item.highestBidder.substring(0,6)+'...'+item.highestBidder.substring(38))}</span></div>
                            <div id="ab-timer-\${item.id}" style="font-size:11px;color:#fbbf24;font-weight:bold;margin-top:4px;"></div>
                        </div>
                    </div>
                    \${!isEnded && !isCancelled ? \`
                    <div style="padding:0 12px 12px;display:flex;gap:6px;flex-wrap:wrap;">
                        \${!isExpired ? \`
                        <input type="text" id="ab-bid-amt-\${item.id}" placeholder="Nhập số Coin..." style="flex:1;min-width:80px;background:#0f172a;color:#fff;border:1px solid #334155;padding:8px;border-radius:6px;font-size:11px;">
                        <button onclick="placeBid('\${houseAddr}',\${item.id},'\${item.paymentToken}',this)" style="background:#8b5cf6;color:white;border:none;padding:8px 12px;border-radius:6px;font-size:11px;font-weight:bold;cursor:pointer;">⚡ BỎ THẦU</button>
                        \` : ''}
                        \${isExpired ? \`<button onclick="endAuct('\${houseAddr}',\${item.id},this)" style="background:#10b981;color:white;border:none;padding:8px 12px;border-radius:6px;font-size:11px;font-weight:bold;cursor:pointer;flex:1;">🤝 CHỐT ĐƠN</button>\` : ''}
                        \${pendingAmt.gt(0) ? \`<button onclick="withdrawBid('\${houseAddr}',\${item.id},this)" style="background:#f59e0b;color:white;border:none;padding:8px 10px;border-radius:6px;font-size:10px;cursor:pointer;">💰 Rút \${ethers.utils.formatEther(pendingAmt)}</button>\` : ''}
                    </div>
                    \` : ''}
                \`;
                grid.appendChild(card);

                if(!isEnded && !isCancelled) {
                    const timerEl = card.querySelector('#ab-timer-'+item.id);
                    const interval = setInterval(() => {
                        const now = Math.floor(Date.now()/1000);
                        const diff = endTimeSec - now;
                        if(diff <= 0) { timerEl.innerHTML = '⏰ HẾT GIỜ!'; timerEl.style.color = '#ef4444'; clearInterval(interval); return; }
                        const m = Math.floor(diff/60); const s = diff % 60;
                        timerEl.innerHTML = '⏱️ Còn ' + m + ' phút ' + s + ' giây';
                    }, 1000);
                    _abCountdowns.push(interval);
                }
            }
    }

    async function placeBid(houseAddr, auctionId, payToken, btn) {
        if(!signer){toast('error','Kết nối Ví trước!');return;}
        const amtInput = document.getElementById('ab-bid-amt-' + auctionId);
        const amt = amtInput ? amtInput.value.trim() : '';
        if(!amt || isNaN(amt)) { toast('error','Nhập số Coin hợp lệ!'); return; }
        const origText = btn.innerText;
        try {
            btn.disabled = true;
            const amtWei = ethers.utils.parseEther(amt);

            // Approve Coin cho Sàn Đấu Giá
            btn.innerText = '🔑 Approve...'; toast('info', 'Ủy quyền Coin cho Sàn...');
            const token = new ethers.Contract(payToken, [
                "function approve(address spender, uint256 amount)",
                "function allowance(address owner, address spender) view returns (uint256)"
            ], signer);
            const buyer = await signer.getAddress();
            const allowed = await token.allowance(buyer, houseAddr);
            if(allowed.lt(amtWei)) {
                const txA = await token.approve(houseAddr, amtWei);
                await txA.wait();
                toast('success', 'Ủy quyền Coin thành công!');
            }

            // Bỏ thầu
            btn.innerText = '⏳ Đang bỏ thầu...'; toast('info', 'Đang gửi lệnh bỏ thầu...');
            const house = new ethers.Contract(houseAddr, AUCTION_HOUSE_ABI_BID, signer);
            const tx = await house.bid(auctionId, amtWei);
            await tx.wait();

            toast('success', '⚡ BỎ THẦU THÀNH CÔNG! Bạn đang dẫn đầu!');
            btn.innerText = '✅ ĐÃ BỎ THẦU'; btn.style.background = '#10b981';
            setTimeout(() => loadAuctions(), 2000);
        } catch(e) {
            btn.disabled = false; btn.innerText = origText;
            toast('error', e.reason || e.message || 'Lỗi bỏ thầu!');
        }
    }
    window.placeBid = placeBid;

    async function endAuct(houseAddr, auctionId, btn) {
        if(!signer){toast('error','Kết nối Ví trước!');return;}
        const origText = btn.innerText;
        try {
            btn.disabled = true; btn.innerText = '⏳ Đang chốt...';
            const house = new ethers.Contract(houseAddr, AUCTION_HOUSE_ABI_BID, signer);
            const tx = await house.endAuction(auctionId);
            await tx.wait();
            toast('success', '🤝 Chốt đơn thành công! NFT đã được chuyển cho người thắng!');
            btn.innerText = '✅ ĐÃ CHỐT'; btn.style.background = '#64748b';
            setTimeout(() => loadAuctions(), 2000);
        } catch(e) {
            btn.disabled = false; btn.innerText = origText;
            toast('error', e.reason || e.message || 'Lỗi chốt đơn!');
        }
    }
    window.endAuct = endAuct;

    async function withdrawBid(houseAddr, auctionId, btn) {
        if(!signer){toast('error','Kết nối Ví trước!');return;}
        const origText = btn.innerText;
        try {
            btn.disabled = true; btn.innerText = '⏳ Rút...';
            const house = new ethers.Contract(houseAddr, AUCTION_HOUSE_ABI_BID, signer);
            const tx = await house.withdraw(auctionId);
            await tx.wait();
            toast('success', '💰 Đã rút lại Coin thành công!');
            btn.innerText = '✅ Đã rút'; btn.style.background = '#64748b';
            setTimeout(() => loadAuctions(), 2000);
        } catch(e) {
            btn.disabled = false; btn.innerText = origText;
            toast('error', e.reason || e.message || 'Không thể rút!');
        }
    }
    window.withdrawBid = withdrawBid;
    `,
    bindings: [{ btn: "ab-load-btn", fn: "loadAuctions" }]
}

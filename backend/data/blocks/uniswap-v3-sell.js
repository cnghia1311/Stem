// ==================== KHỐI 5: GIAO DỊCH UNISWAP V3 ====================
export default {
    id: "uniswap-v3-sell",
    name: "🦄 Trạm Hoán Đổi (Swap V3)",
    desc: "Giao diện Swap đa mạng với Uniswap V3. Hỗ trợ hoán đổi Native Token và ERC-20.",
    color: "#1e293b",
    label: "DeFi - Thanh Khoản",
    preview: (tk) => `
        <div style="padding:15px;background:#0f172a;border-radius:10px;border-left:4px solid #ec4899;box-shadow:0 4px 15px rgba(236,72,153,0.2);">
            <div style="color:#f472b6;font-size:12px;font-weight:bold;margin-bottom:10px;display:flex;align-items:center;">
                <span style="font-size:16px;margin-right:5px;">🦄</span> TRẠM HOÁN ĐỔI UNISWAP V3
            </div>
            <button class="pv-btn" disabled style="background:#ec4899;padding:6px;width:100%;font-size:10px;">🚀 SWAP</button>
        </div>`,
    exportHtml: (tk) => `
    <div class="khoi" style="border-left-color:#ec4899;background:rgba(236,72,153,0.05);padding:20px;max-width:450px;margin:0 auto;">
        <div class="khoi-title" style="color:#f472b6;font-size:14px;display:flex;align-items:center;margin-bottom:15px;justify-content:center;">
            <span style="font-size:22px;margin-right:8px;">🦄</span> TRẠM HOÁN ĐỔI V3
        </div>
        <div style="display:flex;gap:10px;margin-bottom:15px;">
            <select id="swap-network-sel" style="flex:1;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;">
                <option value="sepolia">Sepolia Testnet (ETH)</option>
                <option value="ethereum">Ethereum Mainnet (ETH)</option>
                <option value="base">Base (ETH)</option>
                <option value="bsc">BNB Smart Chain (BNB)</option>
                <option value="polygon">Polygon POS (MATIC)</option>
                <option value="arbitrum">Arbitrum (ETH)</option>
            </select>
            <select id="swap-fee-sel" style="width:110px;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;">
                <option value="500">0.05%</option>
                <option value="3000" selected>0.3%</option>
                <option value="10000">1%</option>
            </select>
        </div>
        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:15px;margin-bottom:10px;position:relative;">
            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:8px;font-weight:bold;">Đồng bạn bán (Token IN)</label>
            <div style="display:flex;gap:15px;margin-bottom:10px;">
                <label style="font-size:13px;color:#e2e8f0;display:flex;align-items:center;cursor:pointer;">
                    <input type="radio" name="token_in_type" value="native" checked style="margin-right:5px;accent-color:#ec4899;"> Native Token
                </label>
                <label style="font-size:13px;color:#e2e8f0;display:flex;align-items:center;cursor:pointer;">
                    <input type="radio" name="token_in_type" value="erc20" style="margin-right:5px;accent-color:#ec4899;"> ERC-20
                </label>
            </div>
            <input type="text" id="swap-in-addr" disabled placeholder="Native Token (Tự động)" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;margin-bottom:10px;opacity:0.6;">
            <input type="number" id="swap-amount" placeholder="0.0" style="width:100%;padding:12px;border-radius:8px;border:1px solid #ec4899;background:#1e293b;color:white;font-size:18px;font-weight:bold;outline:none;">
        </div>
        <div style="text-align:center;margin:-15px 0;position:relative;z-index:10;">
            <div style="display:inline-flex;background:#1e293b;border:4px solid #0f172a;border-radius:50%;padding:8px;color:#94a3b8;cursor:pointer;">⬇️</div>
        </div>
        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:15px;margin-bottom:20px;">
            <label style="display:block;font-size:12px;color:#94a3b8;margin-bottom:8px;font-weight:bold;">Đồng bạn mua (Token OUT)</label>
            <div style="display:flex;gap:15px;margin-bottom:10px;">
                <label style="font-size:13px;color:#e2e8f0;display:flex;align-items:center;cursor:pointer;">
                    <input type="radio" name="token_out_type" value="native" style="margin-right:5px;accent-color:#ec4899;"> Native Token
                </label>
                <label style="font-size:13px;color:#e2e8f0;display:flex;align-items:center;cursor:pointer;">
                    <input type="radio" name="token_out_type" value="erc20" checked style="margin-right:5px;accent-color:#ec4899;"> ERC-20
                </label>
            </div>
            <input type="text" id="swap-out-addr" placeholder="Địa chỉ Token ERC-20 (0x...)" value="0x6AECC697301E8867052C2D8fB03F68ef809a1A40" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;">
        </div>
                <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;">
            <label style="font-size:12px;color:#94a3b8;font-weight:bold;flex:0 0 auto;">🛡️ Trượt giá tối đa</label>
            <select id="swap-slippage" style="flex:1;min-width:0;width:auto;padding:8px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:13px;outline:none;">
                <option value="50">0.5% — chặt, dễ bị huỷ</option>
                <option value="100" selected>1% — khuyên dùng</option>
                <option value="300">3% — pool ít thanh khoản</option>
                <option value="500">5% — lỏng, dễ bị ép giá</option>
            </select>
        </div>
        <div id="swap-quote" style="background:rgba(16,185,129,0.08);border:1px solid #334155;border-radius:10px;padding:12px;margin-bottom:6px;text-align:center;min-height:44px;display:flex;align-items:center;justify-content:center;gap:8px;">
            <span style="color:#94a3b8;font-size:12px;">💱 Ước tính nhận:</span>
            <span id="swap-quote-value" style="color:#10b981;font-weight:bold;font-size:16px;">---</span>
        </div>
        <div id="swap-minout" style="font-size:11px;color:#64748b;text-align:center;margin-bottom:15px;min-height:16px;line-height:1.4;"></div>
        <button id="swap-execute-btn" style="background:linear-gradient(45deg, #ec4899, #f43f5e);width:100%;padding:14px;border:none;border-radius:10px;font-size:16px;font-weight:bold;cursor:pointer;color:white;transition:all 0.2s;box-shadow:0 4px 15px rgba(236,72,153,0.3);">🚀 THỰC HIỆN SWAP</button>
        <div id="swap-status" style="margin-top:15px;font-size:12px;text-align:center;color:#94a3b8;min-height:20px;"></div>
    </div>`,
        engineCode: (pfx) => {
        return `
    {
        // Đổi thành true nếu muốn ủy quyền VÔ HẠN (đỡ phải ký approve mỗi lần, nhưng kém an toàn).
        // Mặc định false = chỉ ủy quyền đúng số cần dùng cho lần swap này.
        const SWAP_INFINITE_APPROVE = false;

        const NETWORKS = {
            "sepolia":  { r: "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E", w: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14" },
            "ethereum": { r: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45", w: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" },
            "base":     { r: "0x2626664c2603336E57B271c5C0b26F421741e481", w: "0x4200000000000000000000000000000000000006" },
            "bsc":      { r: "0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2", w: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" },
            "polygon":  { r: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45", w: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270" },
            "arbitrum": { r: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45", w: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1" }
        };
        const QUOTERS = {
            "sepolia":  "0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3",
            "ethereum": "0x61fFE014bA17989E743c5F6cB21bF9697530B21e",
            "base":     "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a",
            "bsc":      "0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997",
            "polygon":  "0x61fFE014bA17989E743c5F6cB21bF9697530B21e",
            "arbitrum": "0x61fFE014bA17989E743c5F6cB21bF9697530B21e"
        };
        const _nativeSym = {sepolia:'ETH',ethereum:'ETH',base:'ETH',bsc:'BNB',polygon:'MATIC',arbitrum:'ETH'};

        const QUOTER_ABI = ["function quoteExactInputSingle(tuple(address tokenIn,address tokenOut,uint256 amountIn,uint24 fee,uint160 sqrtPriceLimitX96)) public returns(uint256 amountOut,uint160,uint32,uint256)"];
        const ERC20_ABI = [
            "function approve(address,uint256) returns(bool)",
            "function allowance(address,address) view returns(uint256)",
            "function decimals() view returns(uint8)",
            "function symbol() view returns(string)"
        ];

        const execBtn = document.getElementById('swap-execute-btn');

        if (execBtn) {
            const container  = execBtn.closest('.khoi');
            const inRadios   = container.querySelectorAll('input[name="token_in_type"]');
            const outRadios  = container.querySelectorAll('input[name="token_out_type"]');
            const inAddr     = container.querySelector('#swap-in-addr');
            const outAddr    = container.querySelector('#swap-out-addr');
            const amtInp     = container.querySelector('#swap-amount');
            const netSel     = container.querySelector('#swap-network-sel');
            const feeSel     = container.querySelector('#swap-fee-sel');
            const slipSel    = container.querySelector('#swap-slippage');
            const stt        = container.querySelector('#swap-status');
            const quoteEl    = container.querySelector('#swap-quote-value');
            const minOutEl   = container.querySelector('#swap-minout');

            function updateInputs() {
                const isEqIn  = [...inRadios].find(r=>r.checked).value;
                const isEqOut = [...outRadios].find(r=>r.checked).value;
                if (isEqIn === 'native') { inAddr.disabled = true; inAddr.placeholder = "Native Token (Tự động Wrap)"; inAddr.style.opacity = '0.6'; }
                else { inAddr.disabled = false; inAddr.placeholder = "Địa chỉ Token ERC-20 (0x...)"; inAddr.style.opacity = '1'; }
                if (isEqOut === 'native') { outAddr.disabled = true; outAddr.placeholder = "Native Token (Tự động Unwrap)"; outAddr.style.opacity = '0.6'; }
                else { outAddr.disabled = false; outAddr.placeholder = "Địa chỉ Token ERC-20 (0x...)"; outAddr.style.opacity = '1'; }
            }
            inRadios.forEach(r => r.addEventListener('change', updateInputs));
            outRadios.forEach(r => r.addEventListener('change', updateInputs));
            updateInputs();

            // ---- Lấy báo giá thô, dùng chung cho cả hiển thị lẫn lúc gửi giao dịch ----
            async function _quoteRaw() {
                if (!signer) return null;
                const amtVal = amtInp.value.trim();
                if (!amtVal || isNaN(amtVal) || Number(amtVal) <= 0) return null;

                const _isIn  = [...inRadios].find(r=>r.checked).value;
                const _isOut = [...outRadios].find(r=>r.checked).value;
                if (_isIn==='native' && _isOut==='native') return null;

                const _net = netSel.value;
                if (!NETWORKS[_net] || !QUOTERS[_net]) return null;
                const _WETH = NETWORKS[_net].w;
                const _FEE  = parseInt(feeSel.value);

                const _tIn  = _isIn==='native'  ? _WETH : inAddr.value.trim();
                const _tOut = _isOut==='native' ? _WETH : outAddr.value.trim();
                if (!_tIn || _tIn.length!==42 || !_tOut || _tOut.length!==42) return null;

                let _dIn = 18;
                if (_isIn!=='native') { try { _dIn = await new ethers.Contract(_tIn, ERC20_ABI, signer).decimals(); } catch(e){} }
                const _amtIn = ethers.utils.parseUnits(amtVal, _dIn);

                const _q   = new ethers.Contract(QUOTERS[_net], QUOTER_ABI, signer);
                const _res = await _q.callStatic.quoteExactInputSingle({ tokenIn:_tIn, tokenOut:_tOut, amountIn:_amtIn, fee:_FEE, sqrtPriceLimitX96:0 });

                let _dOut = 18, _sym = '';
                if (_isOut!=='native') {
                    try { const _c = new ethers.Contract(_tOut, ERC20_ABI, signer); _dOut = await _c.decimals(); _sym = await _c.symbol(); }
                    catch(e){ _sym = 'Token'; }
                } else { _sym = _nativeSym[_net] || 'ETH'; }

                return {
                    raw: (_res.amountOut || _res[0]),
                    dec: _dOut, sym: _sym,
                    amtIn: _amtIn, decIn: _dIn,
                    tokenIn: _tIn, tokenOut: _tOut,
                    isIn: _isIn, isOut: _isOut,
                    net: _net, fee: _FEE, weth: _WETH, router: NETWORKS[_net].r
                };
            }

            // Mức nhận tối thiểu = báo giá trừ đi % trượt giá cho phép
            function _applySlippage(raw) {
                const bps = parseInt(slipSel.value) || 100;
                return raw.mul(10000 - bps).div(10000);
            }

            let _qTimer = null;
            const getQuote = async () => {
                if (!quoteEl) return;
                if (!signer) { quoteEl.innerText = 'Kết nối ví trước'; minOutEl.innerText = ''; return; }
                try {
                    quoteEl.innerText = '⏳ ...'; quoteEl.style.color = '#94a3b8'; minOutEl.innerText = '';
                    const q = await _quoteRaw();
                    if (!q) { quoteEl.innerText = '---'; return; }

                    const fmtd = parseFloat(ethers.utils.formatUnits(q.raw, q.dec));
                    quoteEl.innerText = '≈ ' + fmtd.toLocaleString('en-US',{maximumFractionDigits:6}) + ' ' + q.sym;
                    quoteEl.style.color = '#10b981';

                    const minFmt = parseFloat(ethers.utils.formatUnits(_applySlippage(q.raw), q.dec));
                    minOutEl.innerHTML = '🛡️ Nhận tối thiểu <b style="color:#fbbf24;">'
                        + minFmt.toLocaleString('en-US',{maximumFractionDigits:6}) + ' ' + q.sym
                        + '</b> — thấp hơn mức này giao dịch tự huỷ, tiền vẫn còn nguyên';
                } catch(e) {
                    quoteEl.innerText = 'Pool chưa khả dụng'; quoteEl.style.color = '#f59e0b'; minOutEl.innerText = '';
                }
            };
            const triggerQuote = () => { if(_qTimer) clearTimeout(_qTimer); _qTimer = setTimeout(getQuote, 600); };
            amtInp.addEventListener('input', triggerQuote);
            inRadios.forEach(r => r.addEventListener('change', triggerQuote));
            outRadios.forEach(r => r.addEventListener('change', triggerQuote));
            netSel.addEventListener('change', triggerQuote);
            feeSel.addEventListener('change', triggerQuote);
            slipSel.addEventListener('change', triggerQuote);
            inAddr.addEventListener('input', triggerQuote);
            outAddr.addEventListener('input', triggerQuote);

            // ---- Chỉ approve khi allowance thực sự thiếu ----
            async function _ensureAllowance(tokenAddr, spender, needed, label) {
                const c = new ethers.Contract(tokenAddr, ERC20_ABI, signer);
                const owner = await signer.getAddress();
                const cur = await c.allowance(owner, spender);
                if (cur.gte(needed)) {
                    stt.innerHTML = '<span style="color:#10b981;">✅ ' + label + ' đã ủy quyền sẵn — bỏ qua bước Approve.</span>';
                    return false;
                }
                stt.innerText = 'Đang xin quyền chuyển ' + label + ' (Approve)... (1/2)';
                const amt = SWAP_INFINITE_APPROVE ? ethers.constants.MaxUint256 : needed;
                const tx = await c.approve(spender, amt);
                await tx.wait();
                return true;
            }

            execBtn.addEventListener('click', async () => {
                if(!signer){ toast('error', 'Cần Kết Nối Ví (🦊) trước!'); return; }
                try {
                    execBtn.disabled = true; execBtn.style.opacity = "0.5";

                    // Lấy báo giá MỚI ngay trước khi gửi, để mức bảo vệ luôn khớp giá hiện tại
                    stt.innerText = "Đang lấy báo giá mới nhất...";
                    const q = await _quoteRaw();
                    if (!q) throw new Error('Không lấy được báo giá — kiểm tra mức phí, mạng và địa chỉ token!');
                    if (q.raw.isZero()) throw new Error('Pool không có thanh khoản!');

                    const minOut  = _applySlippage(q.raw);
                    const minFmt  = parseFloat(ethers.utils.formatUnits(minOut, q.dec));
                    const V3_ROUTER = q.router;
                    const iface = new ethers.utils.Interface([
                        "function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96) params) payable returns (uint256 amountOut)",
                        "function unwrapWETH9(uint256 amountMinimum, address recipient) payable",
                        "function multicall(uint256 deadline, bytes[] data) payable returns (bytes[] results)"
                    ]);
                    const router = new ethers.Contract(V3_ROUTER, [
                        "function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96) params) payable returns (uint256 amountOut)",
                        "function unwrapWETH9(uint256 amountMinimum, address recipient) payable",
                        "function multicall(uint256 deadline, bytes[] data) payable returns (bytes[] results)"
                    ], signer);
                    const me = await signer.getAddress();

                    stt.innerHTML = '<span style="color:#94a3b8;">🛡️ Bảo vệ trượt giá: nhận tối thiểu ' + minFmt.toLocaleString('en-US',{maximumFractionDigits:6}) + ' ' + q.sym + '</span>';

                    if (q.isIn === 'native') {
                        const ethBal = await provider.getBalance(me);
                        if (ethBal.lt(q.amtIn)) throw new Error('Không đủ số dư Native Token!');
                        stt.innerHTML = '<span style="color:#3b82f6;">Chờ ký xác nhận Swap trên MetaMask...</span>';
                        const tx = await router.exactInputSingle({
                            tokenIn: q.weth, tokenOut: q.tokenOut, fee: q.fee, recipient: me,
                            amountIn: q.amtIn, amountOutMinimum: minOut, sqrtPriceLimitX96: 0
                        }, { value: q.amtIn });
                        stt.innerText = 'Đợi Blockchain xác nhận...'; await tx.wait();
                        stt.innerHTML = '<span style="color:#10b981;">🎉 SWAP THÀNH CÔNG!</span>';
                        toast('success', 'Swap Native Token thành công!');

                    } else if (q.isOut === 'native') {
                        await _ensureAllowance(q.tokenIn, V3_ROUTER, q.amtIn, 'Token IN');
                        stt.innerHTML = '<span style="color:#3b82f6;">Chờ ký giao dịch Swap + Unwrap... (2/2)</span>';
                        const callSwap = iface.encodeFunctionData('exactInputSingle', [{
                            tokenIn: q.tokenIn, tokenOut: q.weth, fee: q.fee, recipient: V3_ROUTER,
                            amountIn: q.amtIn, amountOutMinimum: minOut, sqrtPriceLimitX96: 0
                        }]);
                        const callUnwrap = iface.encodeFunctionData('unwrapWETH9', [minOut, me]);
                        const deadline = Math.floor(Date.now()/1000) + 600;
                        const txS = await router.multicall(deadline, [callSwap, callUnwrap]);
                        stt.innerText = 'Đợi Blockchain xác nhận...'; await txS.wait();
                        stt.innerHTML = '<span style="color:#10b981;">🎉 SWAP THÀNH CÔNG! Đã nhận Native Token.</span>';
                        toast('success', 'Swap nhận Native Token thành công!');

                    } else {
                        await _ensureAllowance(q.tokenIn, V3_ROUTER, q.amtIn, 'Token IN');
                        stt.innerHTML = '<span style="color:#3b82f6;">Chờ ký giao dịch Swap... (2/2)</span>';
                        const tx = await router.exactInputSingle({
                            tokenIn: q.tokenIn, tokenOut: q.tokenOut, fee: q.fee, recipient: me,
                            amountIn: q.amtIn, amountOutMinimum: minOut, sqrtPriceLimitX96: 0
                        });
                        stt.innerText = 'Đợi Blockchain xác nhận...'; await tx.wait();
                        stt.innerHTML = '<span style="color:#10b981;">🎉 SWAP THÀNH CÔNG!</span>';
                        toast('success', 'Swap Token ERC-20 thành công!');
                    }

                    if(window.stemEvents) window.stemEvents.dispatchEvent(new Event('GIAO_DICH_THANH_CONG'));
                    triggerQuote();

                } catch (e) {
                    let msg = e.reason || e.message || 'Lỗi không xác định';
                    if(msg.includes('user rejected')) msg = "Bạn đã từ chối ký giao dịch!";
                    else if(msg.includes('Too little received') || msg.includes('STF') || msg.includes('slippage'))
                        msg = "Giá đã đổi quá mức bạn cho phép — giao dịch tự huỷ, tiền vẫn còn nguyên. Thử nới mức trượt giá.";
                    else if(msg.includes('TF')) msg = "Pool không tồn tại hoặc hết thanh khoản!";
                    stt.innerHTML = '<span style="color:#ef4444;">❌ ' + msg.substring(0,110) + '</span>';
                    toast('error', msg.substring(0, 70));
                } finally { execBtn.disabled = false; execBtn.style.opacity = "1"; }
            });
        }
    }`;
    }
}

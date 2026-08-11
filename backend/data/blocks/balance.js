// ==================== KHỐI 2: SỐ DƯ (MULTI-TOKEN DROPDOWN) ====================

// Danh sách coin dựng sẵn trên mạng Sepolia.
// ⚠️ Địa chỉ token testnet có thể đổi — nên kiểm tra lại trên sepolia.etherscan.io.
// Muốn thêm/bớt coin cho học sinh chọn thì sửa DUY NHẤT mảng này.
const SEPOLIA_COINS = [
    { value: 'native',                                      label: '⧫ ETH (Sepolia — coin gốc)', symbol: 'ETH'  },
    { value: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',  label: '🪙 WETH',                    symbol: 'WETH' },
    { value: '0x779877A7B0D9E8603169DdbD7836e478b4624789',  label: '🪙 LINK (Chainlink)',         symbol: 'LINK' },
    { value: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',  label: '🪙 USDC (Circle)',            symbol: 'USDC' },
    { value: '0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357',  label: '🪙 DAI (Aave faucet)',        symbol: 'DAI'  }
]

const COIN_SYMBOL = {}
SEPOLIA_COINS.forEach(c => { COIN_SYMBOL[c.value.toLowerCase()] = c.symbol })

export default {
    id: "balance",
    name: "💰 Hiện Số Dư Token",
    desc: "Chọn coin từ danh sách sổ xuống",
    color: "#10b981",
    label: "Số dư tài khoản (Live)",
    multiToken: true,

    // ⬇️ MỚI: hiện ra ở panel "Thuộc Tính Khối" bên phải
    contractFields: [
        {
            key: "tokens",
            label: "Coin hiển thị trong dropdown",
            placeholder: "",
            type: "token-checklist",
            options: SEPOLIA_COINS.map(c => ({ value: c.value, label: c.label }))
        }
    ],

    preview: (tk) => `
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px;">
            <select style="flex:1;padding:4px 6px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:11px;">
                <option>🪙 ${tk}</option><option>⧫ ETH</option>
            </select>
        </div>
        <p style="font-size:28px;font-weight:800;margin:4px 0;">2,500 <span style="font-size:14px;color:#64748b;">${tk}</span></p>
        <div style="font-size:10px;color:#10b981;margin-bottom:6px;">🟢 Tự cập nhật mỗi 15 giây</div>
        <div class="pv-btn" style="background:#10b981;font-size:12px;">🔄 Làm Mới</div>`,

    exportHtml: (tk, tokenList) => {
        const tokens = Array.isArray(tokenList) ? tokenList.filter(Boolean) : []
        const options = tokens.length > 0
            ? tokens.map(t => {
                const key = String(t).toLowerCase()
                const isNative = key === 'native'
                const sym = COIN_SYMBOL[key] || (String(t).substring(0, 6) + '...')
                const icon = isNative ? '⧫ ' : '🪙 '
                return `<option value="${t}" data-name="${sym}">${icon}${sym}</option>`
              }).join('')
            : `<option value="">-- Chưa thêm coin (dán ở ô dưới) --</option>`

        return `
    <div class="khoi" style="border-left-color:#10b981;">
        <div class="khoi-title">Số dư tài khoản <span style="color:#10b981;font-size:9px;">● LIVE</span></div>
        <select id="bal-select" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:rgba(0,0,0,0.3);color:inherit;font-size:13px;margin-bottom:8px;cursor:pointer;">
            ${options}
        </select>
        <div style="display:flex;gap:6px;margin-bottom:10px;">
            <input id="bal-custom-contract" type="text" placeholder="Dán địa chỉ coin (0x...)" style="flex:1;min-width:0;width:auto;padding:10px;border-radius:8px;border:1px dashed #10b981;background:#0f172a;color:#6ee7b7;font-size:12px;outline:none;">
            <button id="bal-add-btn" style="width:auto;flex:0 0 auto;padding:10px 15px;border-radius:8px;border:none;background:#10b981;color:white;font-weight:bold;cursor:pointer;font-size:13px;">Lưu</button>
        </div>
        <p style="font-size:32px;font-weight:800;margin:5px 0;"><span id="bal-value">0</span> <span id="bal-token-name" style="font-size:16px;color:#64748b;">${tk}</span></p>
        <p id="bal-status" style="font-size:11px;color:#64748b;margin-bottom:8px;">⏳ Chưa kết nối</p>
        <button id="bal-check" style="background:#10b981;">🔄 Làm Mới</button>
    </div>`;
    },

    globalCode: () => `
    window._balInstances = window._balInstances || {};
    window._balRegistry = window._balRegistry || {};
    if(!window._globalPollerStarted) {
        window._globalPollerStarted = true;
        window._globalPollerTasks = window._globalPollerTasks || {};
        setInterval(() => {
            Object.values(window._globalPollerTasks).forEach(fn => { try{fn();}catch(e){} });
        }, 15000);
    }

    // 'native' = coin gốc của mạng (Sepolia ETH), 42 ký tự = contract ERC-20
    function __GlobalBal_isValid(v){ return v === 'native' || (v && v.length === 42); }

    async function __GlobalBal_syncWallet(prefix) {
        const stt = document.getElementById(prefix+'bal-status');
        if(!stt) return false;
        if(!signer){
            stt.innerText = '⏳ Chưa kết nối ví';
            stt.style.color = '#64748b';
            return false;
        }
        try{
            const a = await signer.getAddress();
            stt.innerText = '🟢 Ví: ' + a.substring(0,6) + '...' + a.slice(-4);
            stt.style.color = '#10b981';
            return true;
        }catch(e){ return false; }
    }

    function __GlobalBal_init(prefix) {
        const sel = document.getElementById(prefix+'bal-select');
        if(!sel) return;
        const cust = document.getElementById(prefix+'bal-custom-contract');
        const addBtn = document.getElementById(prefix+'bal-add-btn');

        window._balRegistry[prefix] = true;

        // BUG CŨ: select không có handler change -> đổi coin không làm gì cả
        sel.addEventListener('change', () => __GlobalBal_change(prefix));

        if(addBtn){
            addBtn.onclick = async () => {
                const addr = (cust.value || '').trim();
                if(!addr.startsWith('0x') || addr.length !== 42){ toast('error','Địa chỉ coin không hợp lệ!'); return; }
                if(!signer){ toast('error','Hãy kết nối ví trước!'); return; }
                for(let i = 0; i < sel.options.length; i++){
                    if(sel.options[i].value.toLowerCase() === addr.toLowerCase()){
                        sel.selectedIndex = i; cust.value = '';
                        toast('info','Coin này đã có trong danh sách');
                        __GlobalBal_change(prefix); return;
                    }
                }
                addBtn.innerText = '⏳'; addBtn.disabled = true;
                try{
                    const c = new ethers.Contract(addr, ["function symbol() view returns (string)","function decimals() view returns (uint8)"], signer);
                    await c.decimals();
                    let sym = 'Token'; try{ sym = await c.symbol(); }catch(e){}
                    for(let i = sel.options.length - 1; i >= 0; i--){ if(!sel.options[i].value) sel.remove(i); }
                    const opt = document.createElement('option');
                    opt.value = addr; opt.text = '🪙 ' + sym; opt.setAttribute('data-name', sym);
                    sel.add(opt); sel.value = addr;
                    cust.value = '';
                    toast('success','Đã thêm coin: ' + sym);
                    __GlobalBal_change(prefix);
                }catch(e){
                    toast('error','Địa chỉ này không phải Coin (ERC-20) hoặc sai mạng!');
                }finally{
                    addBtn.innerText = 'Lưu'; addBtn.disabled = false;
                }
            };
        }

        __GlobalBal_syncWallet(prefix);

        // Tự bắt thời điểm học sinh bấm "Kết Nối MetaMask" -> auto nạp số dư
        if(!window._balWalletWatcher){
            window._balWalletWatcher = setInterval(() => {
                if(signer){
                    clearInterval(window._balWalletWatcher);
                    window._balWalletWatcher = null;
                    Object.keys(window._balRegistry).forEach(p => {
                        __GlobalBal_syncWallet(p);
                        __GlobalBal_refresh(p);
                    });
                }
            }, 800);
        }
    }

    function __GlobalBal_startPolling(prefix){
        if(!window._balInstances[prefix]) window._balInstances[prefix] = {};
        if(!window._balInstances[prefix].isPolling) {
            window._balInstances[prefix].isPolling = true;
            window._globalPollerTasks[prefix] = () => __GlobalBal_refresh(prefix);
        }
    }

    async function __GlobalBal_refresh(prefix) {
        const connected = await __GlobalBal_syncWallet(prefix);
        if(!connected) return;

        const sel = document.getElementById(prefix+'bal-select');
        const valEl = document.getElementById(prefix+'bal-value');
        const nameEl = document.getElementById(prefix+'bal-token-name');
        const stt = document.getElementById(prefix+'bal-status');

        if(!sel || !__GlobalBal_isValid(sel.value)){
            if(stt){ stt.innerText = '🟡 Đã kết nối ví — hãy chọn coin'; stt.style.color = '#f59e0b'; }
            return;
        }

        try{
            const me = await signer.getAddress();
            const shortMe = me.substring(0,6) + '...' + me.slice(-4);

            // ---- COIN GỐC (Sepolia ETH): dùng getBalance, KHÔNG có balanceOf ----
            if(sel.value === 'native'){
                const b = await provider.getBalance(me);
                valEl.innerText = ethers.utils.formatEther(b);
                nameEl.innerText = 'ETH';
                stt.innerText = '🟢 ' + shortMe + ' — đang tự theo dõi';
                stt.style.color = '#10b981';
                if(window._balInstances[prefix]) window._balInstances[prefix].contract = 'native';
                __GlobalBal_startPolling(prefix);
                return;
            }

            // ---- TOKEN ERC-20 ----
            const addr = sel.value;
            const c = new ethers.Contract(addr,[
                "function balanceOf(address) view returns (uint256)",
                "function symbol() view returns (string)",
                "function decimals() view returns (uint8)",
                "event Transfer(address indexed from, address indexed to, uint256 value)"
            ], signer);

            const b = await c.balanceOf(me);
            let dec = 18; try{ dec = await c.decimals(); }catch(e){}
            valEl.innerText = ethers.utils.formatUnits(b, dec);

            let name = sel.options[sel.selectedIndex].getAttribute('data-name') || '';
            if(!name || name.includes('...')){
                try{
                    name = await c.symbol();
                    sel.options[sel.selectedIndex].text = '🪙 ' + name;
                    sel.options[sel.selectedIndex].setAttribute('data-name', name);
                }catch(e){ name = 'Token'; }
            }
            nameEl.innerText = name;

            stt.innerText = '🟢 ' + shortMe + ' — đang tự theo dõi';
            stt.style.color = '#10b981';

            if(!window._balInstances[prefix]) window._balInstances[prefix] = {};
            if(window._balInstances[prefix].contract !== addr){
                window._balInstances[prefix].contract = addr;
                c.on('Transfer',(from,to,val)=>{
                    if(from.toLowerCase()===me.toLowerCase()||to.toLowerCase()===me.toLowerCase()){
                        __GlobalBal_refresh(prefix);
                    }
                });
            }
            __GlobalBal_startPolling(prefix);

        }catch(e){
            valEl.innerText = '?';
            stt.innerText = '❌ ' + (e.reason || e.message || 'Lỗi đọc số dư');
            stt.style.color = '#ef4444';
        }
    }

    async function __GlobalBal_check(prefix) {
        if(!signer){toast('error','Hãy kết nối ví trước!');return;}
        const sel=document.getElementById(prefix+'bal-select');
        if(!sel || !__GlobalBal_isValid(sel.value)){toast('error','Hãy chọn hoặc thêm coin trước!');return;}
        await __GlobalBal_refresh(prefix);
        toast('success','Đã cập nhật số dư!');
    }

    function __GlobalBal_change(prefix) {
        document.getElementById(prefix+'bal-status').innerText='⏳ Đang tải dữ liệu...';
        document.getElementById(prefix+'bal-value').innerText='...';
        if(window._balInstances[prefix]) window._balInstances[prefix].contract = null;
        __GlobalBal_refresh(prefix);
    }`,

    engineCode: (pfx) => `
    __GlobalBal_init('${pfx}');
    function refreshBalance(){ return __GlobalBal_refresh('${pfx}'); }
    function checkBalance(){ return __GlobalBal_check('${pfx}'); }
    function onTokenChange(){ return __GlobalBal_change('${pfx}'); }
    `,
    bindings: [{ btn: "bal-check", fn: "checkBalance" }]
}
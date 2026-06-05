export default {
    id: "wrap-eth",
    name: "🔄 Đổi WETH",
    desc: "Wrap ETH sang WETH hoặc ngược lại (Mạng Sepolia)",
    color: "#eab308",
    label: "Wrap/Unwrap WETH",
    preview: () => `
        <div style="display:flex;flex-direction:column;gap:8px;">
            <select style="width:100%;padding:6px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;">
                <option>Wrap (ETH ➔ WETH)</option>
                <option>Unwrap (WETH ➔ ETH)</option>
            </select>
            <div class="pv-input">Số lượng...</div>
            <div class="pv-btn" style="background:#eab308;color:#000;">🔄 Thực Hiện</div>
        </div>`,
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#eab308;">
        <div class="khoi-title" style="color:#eab308;">Wrap / Unwrap WETH</div>
        <select id="weth-action" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:rgba(0,0,0,0.3);color:inherit;font-size:13px;margin-bottom:10px;cursor:pointer;">
            <option value="wrap">Wrap (Đổi ETH ➔ WETH)</option>
            <option value="unwrap">Unwrap (Đổi WETH ➔ ETH)</option>
        </select>
        <input id="weth-amount" type="number" placeholder="Số lượng (Ví dụ: 0.01)" style="margin-bottom:10px;">
        <button id="weth-btn" style="background:#eab308;color:#000;font-weight:bold;">🔄 Thực Hiện</button>
    </div>`,
    globalCode: () => `
    async function __GlobalWeth_execute(prefix) {
        if(!signer){toast('error','Hãy kết nối ví trước!');return;}
        const action = document.getElementById(prefix+'weth-action').value;
        const amount = document.getElementById(prefix+'weth-amount').value.trim();
        
        if(!amount || isNaN(amount) || Number(amount) <= 0){
            toast('error','Vui lòng nhập số lượng hợp lệ!');
            return;
        }

        const WETH_SEPOLIA = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
        const wethAbi = [
            "function deposit() public payable",
            "function withdraw(uint wad) public"
        ];

        try {
            const wethContract = new ethers.Contract(WETH_SEPOLIA, wethAbi, signer);
            const parsedAmount = ethers.utils.parseEther(amount);

            if (action === 'wrap') {
                toast('info', 'Đang Wrap ' + amount + ' ETH sang WETH...');
                const tx = await wethContract.deposit({ value: parsedAmount });
                await tx.wait();
                toast('success', 'Wrap thành công! Bạn nhận được ' + amount + ' WETH.');
            } else {
                toast('info', 'Đang Unwrap ' + amount + ' WETH sang ETH...');
                const tx = await wethContract.withdraw(parsedAmount);
                await tx.wait();
                toast('success', 'Unwrap thành công! Bạn nhận được ' + amount + ' ETH.');
            }
            document.getElementById(prefix+'weth-amount').value = '';
        } catch(e) {
            console.error(e);
            toast('error', e.reason || e.message || 'Lỗi khi giao dịch!');
        }
    }`,
    engineCode: (pfx) => `
    function executeWeth() { return __GlobalWeth_execute('${pfx}'); }
    `,
    bindings: [
        { btn: "weth-btn", fn: "executeWeth" }
    ]
}

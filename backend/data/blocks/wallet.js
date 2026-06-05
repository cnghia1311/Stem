// ==================== KHỐI 1: VÍ ====================
export default {
    id: "wallet",
    name: "🦊 Kết Nối Ví",
    desc: "Nút MetaMask + Hiện địa chỉ",
    required: true,
    color: "#f59e0b",
    label: "Ví của tôi",
    preview: () => `
        <p style="font-size:12px;color:#94a3b8;margin-bottom:6px;">Địa chỉ: <strong style="color:#f59e0b;">0x1a2b...9z</strong></p>
        <div class="pv-btn" style="background:#f59e0b;">🦊 Kết Nối MetaMask</div>`,
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#f59e0b;">
        <div class="khoi-title">Ví của tôi</div>
        <p style="font-size:13px;color:#94a3b8;margin-bottom:10px;">Địa chỉ: <strong id="web3-wallet">Chưa kết nối</strong></p>
        <button id="web3-connect" style="background:#f59e0b;">🦊 Kết Nối MetaMask</button>
    </div>`,
    engineCode: () => `
    async function connectWallet(){
        if(!window.ethereum){
            var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
                var dappUrl = window.location.href.replace('https://', '').replace('http://', '');
                window.location.href = "https://metamask.app.link/dapp/" + dappUrl;
                return;
            }
            toast('error','Chưa cài MetaMask! Vào metamask.io để tải.');
            return;
        }
        try{
            // BẮT BUỘC CHUYỂN SANG MẠNG SEPOLIA (Chain ID: 11155111 -> 0xaa36a7)
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0xaa36a7' }],
                });
            } catch (switchError) {
                // Nếu ví chưa từng thêm mạng Sepolia, tự động thêm giùm học sinh
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: '0xaa36a7',
                                chainName: 'Sepolia test network',
                                rpcUrls: ['https://sepolia.infura.io/v3/'],
                                nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
                                blockExplorerUrls: ['https://sepolia.etherscan.io']
                            }]
                        });
                    } catch (addError) {
                        toast('error', 'Bạn phải thêm mạng Sepolia vào ví!');
                        return;
                    }
                } else {
                    toast('error', 'Yêu cầu chuyển sang mạng Sepolia bị từ chối!');
                    return;
                }
            }

            provider=new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts',[]);
            signer=provider.getSigner();userAddr=await signer.getAddress();
            const w=document.getElementById('web3-wallet');if(w)w.innerText=userAddr.substring(0,6)+'...'+userAddr.slice(-4);
            const btn=document.getElementById('web3-connect');if(btn){btn.innerText='✅ Đã kết nối (Sepolia)';btn.style.opacity='0.7';}
            toast('success','Kết nối ví thành công!');
            if(typeof refreshBalance==='function') refreshBalance();

            // Cảnh sát chìm: Lắng nghe nếu học sinh lén đổi mạng sau khi đã kết nối
            if (!window.hasSetupChainListener) {
                window.ethereum.on('chainChanged', (chainId) => {
                    if (chainId !== '0xaa36a7' && chainId !== '11155111') {
                        toast('error', 'Cảnh báo: Bạn vừa rời khỏi mạng Sepolia! Trang sẽ tải lại.');
                        setTimeout(() => window.location.reload(), 2000);
                    }
                });
                window.hasSetupChainListener = true;
            }

        }catch(e){toast('error','Kết nối thất bại: '+e.message);}
    }`,
    bindings: [{ btn: "web3-connect", fn: "connectWallet" }]
}

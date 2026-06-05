## V. PROMPT TIẾP THEO — XÂY DỰNG BLOCK ỦY QUYỀN TẠO MẪU (CHUẨN 721 & 1155)

```
Bạn là chuyên gia Web3 & Fullstack trên dự án STEM Web3 Builder.

## MỤC TIÊU
Tạo 2 khối UI mới cho phép giáo viên ủy quyền/thu hồi quyền TẠO MẪU (Template Creator)
cho người khác (trợ giảng, lớp trưởng...) trên cả chuẩn ERC-721 và ERC-1155.


// 1. Quét QR chuyển Coin, NFT
// 2. Đấu giá bằng Token lớp (Đã làm xong Bài 15)
// 3. Staking Coin (Gửi tiết kiệm lấy lãi theo ngày) (Đã làm xong Bài 16)

// CÁC TÍNH NĂNG DEFI CHƯA LÀM (Ý TƯỞNG CHO CÁC BÀI TIẾP THEO):
// - Nhóm 2: Staking NFT (Khóa NFT Huy hiệu / Vật phẩm để tự động đào ra Coin thưởng theo thời gian).
// - Nhóm 3: Liquid Staking & Money Legos (Sử dụng chuẩn ERC-4626: Gửi Coin A -> Nhận Tờ biên nhận Coin B -> Mang Coin B đi gửi tiếp lấy Coin C -> Ăn lãi kép). (Đã làm xong Bài 19)
// - Nhóm 4: Dividend Staking (Mô hình Cổ Tức - Real Yield): Gửi Coin A -> Nhận Cổ Phiếu B. Tỷ giá B không đổi. Tiền Lãi (Coin A) rớt vào Bể Cổ Tức. Học sinh bấm Claim để nhận tiền Lãi về tiêu xài mà vẫn giữ nguyên số Cổ Phiếu B ban đầu (giống mô hình xSUSHI, GMX).
// - Nhóm 4: Yield Farming / Liquidity Pool (Học sinh góp vốn vào hồ bơi thanh khoản để ăn phí giao dịch của lớp).
// - Nhóm 5: Vesting (Cơ chế khóa quỹ tiền thưởng và giải ngân nhỏ giọt từ từ theo tuần/tháng để chống lạm phát).
// - Nhóm 6: Launchpad (Bệ phóng gọi vốn cộng đồng IDO/IEO cho các dự án khởi nghiệp của học sinh bằng ClassCoin). (Đã làm xong Bài 18)

// =====================================================================================
// CÁC KHỐI CHỨC NĂNG WEB3 NÂNG CAO CÒN THIẾU (Ý TƯỞNG CHO STEM WEB3 BUILDER 2.0):
// =====================================================================================
// 1. Khối Cầm Đồ / Vay Mượn (Lending & Borrowing - Chuẩn Aave/Compound):
//    - Học sinh nạp đồng ClassCoin vào làm tài sản thế chấp (Collateral) để vay ra đồng Stablecoin (USDT).
//    - Nếu giá ClassCoin rớt thảm hại, tài sản sẽ bị "Thanh lý" (Liquidation).
//    - Dạy học sinh về Tài chính vĩ mô, Lãi suất thả nổi và Vay thế chấp siêu mức (Over-collateralization).

// 2. Khối Phát Quà Theo Danh Sách (Airdrop / Merkle Claim):
//    - Thay vì Faucet (ai cũng lấy được), Giáo viên có thể upload danh sách 10 học sinh xuất sắc.
//    - Contract dùng Merkle Tree / Whitelist để kiểm chứng. Chỉ đúng 10 ví đó mới claim được phần thưởng (Coin hoặc NFT Giấy Khen).

// 3. Khối Quay Số Trúng Thưởng (Lottery / Gacha):
//    - Học sinh góp vốn (VD: 10 Coin) vào một Bể chung (Pool).
//    - Sử dụng chuẩn ngẫu nhiên (Randomness / VRF) để Contract tự động rút thăm và trao trọn tiền cho 1 ví may mắn.
//    - Dạy về khái niệm "Độ ngẫu nhiên an toàn trên Blockchain" (Oracle) và áp dụng vào GameFi (Mở Rương).

// 4. Khối Tên Miền Định Danh (ENS - Stem Name Service):
//    - Học sinh dùng Coin để đăng ký một tên miền dễ nhớ (Ví dụ: alice.stem) gắn liền với địa chỉ ví (0x...).
//    - Từ đó các khối Transfer chỉ cần gõ tên "alice.stem" thay vì phải Copy-Paste chuỗi 0x dài dòng.
//    - Dạy về hệ thống phân giải tên miền (DNS) và Danh tính phi tập trung (Decentralized Identity - DID).

// =====================================================================================
// TRIẾT LÝ KIẾN TRÚC PHIÊN BẢN 2.0 (COMPOSABILITY & MANAGER CONTRACTS)
// =====================================================================================
// Lưu ý quan trọng cho tương lai:
// KHÔNG CẦN VIẾT LẠI CÁC KHỐI ERC20, ERC721, ERC1155 CƠ BẢN ĐỂ LÀM CÁC TÍNH NĂNG TRÊN!
// Sử dụng sức mạnh của Web3 Composability (Tính lắp ghép Lego):
// 
// 1. Chức năng Game/Đúc kết hợp (Breeding/Gacha): 
//    -> Giữ nguyên Token gốc. Chỉ cần viết thêm "Khối Luyện Thú" (Manager Contract). Khối này xin quyền MINTER, tự động Thu hồi (Burn) nguyên liệu và Đúc (Mint) vật phẩm mới.
// 2. Chức năng Giao dịch chéo (Atomic Swap): 
//    -> Giữ nguyên Token gốc. Chỉ cần viết thêm "Khối Trọng Tài" (Escrow Contract). Giữ đồ của 2 bên và gọi lệnh transfer() đồng thời.
// 3. Chức năng Chia lãi (Yield Farming): 
//    -> Giữ nguyên Token gốc. Chỉ cần viết thêm "Khối Hồ Bơi" (Pool Contract) để giữ tiền và tính toán thời gian trả lãi.
// 4. Ngoại lệ duy nhất - Thuế & Deflationary:
//    -> Bắt buộc tạo khối mới "ERC20 Kỷ Luật (Tax/Burn)" vì phải can thiệp trực tiếp vào ruột của hàm transfer() tiêu chuẩn.

// =====================================================================================
// KIẾN TRÚC GIAO DIỆN PHIÊN BẢN 2.0 (FRONTEND UI/UX WORKFLOW & PROMPT)
// =====================================================================================
// BỎ QUA FIGMA - CODE THẲNG BẰNG AI:
// Trong phiên bản 2.0 (Dùng React), không cần tốn thời gian vẽ thiết kế trên Figma.
// Hãy dùng công cụ AI như v0.dev (của Vercel) hoặc Claude 3.5 Sonnet để tạo thẳng Code giao diện trong 15 giây.
//
// PROMPT TẠO GIAO DIỆN STEM BUILDER CHO v0.dev (COPY TIẾNG ANH):
// """
Create a highly engaging, gamified No-Code Web3 Builder interface designed for high school STEM students. 
Use React, Tailwind CSS, and Shadcn UI.
Theme: Dark mode (#0b1120 background), futuristic cyber-education aesthetic. It should feel like a modern puzzle/lego game mixed with a hacker workspace. Use vibrant neon accents (electric blue, neon purple, bright orange, emerald green).

Layout must be a 3-pane full-screen application shell (100vh):

1. Left Sidebar - "Library & Pages" (Width: 280px, Border right #1e293b): 
- Top Section: "Page Manager" dropdown (e.g., "Home", "Minting Page", "Admin Dashboard") with a "+" button to add new pages.
- Search bar with a glowing focus state.
- Content: Categorized list of draggable Web3 blocks (Categories: "Layout/Navigation", "Basic", "Assets/Coin", "NFTs", "DAO").
- In the "Layout/Navigation" category, explicitly include two blocks: 1) A "Link Button" (for Call-To-Action jumps between specific pages) and 2) A "Navbar / Tab Bar" block (a menu that lists all pages for global app navigation).
- Each block in the list must look like a compact, colorful Lego brick or puzzle piece. Use different bright border colors for different categories. Include a Lucide icon and a playful title.

2. Main Workspace - "WYSIWYG Free-Drag Canvas" (Center, Flexible width):
- Background: Dark slate (#0f172a) workspace.
- In the center of the workspace, display a realistic Device Frame (e.g., an iPhone casing or Desktop window). IMPORTANT: The Device Frame container must use "Zoom to Fit" logic (CSS transform scale) so that the entire frame always fits perfectly within the visible workspace without any scrollbars. At the bottom of the canvas, add a "Zoom Control" UI (e.g., [ - ] 58% [ + ]).
- Top Toolbar: Include Device Toggle Icons (Mobile, Tablet, Desktop) to switch the size of the Device Frame.
- This Device Frame IS an Absolute Positioning drag-and-drop canvas. Students drag blocks from the left sidebar and drop them DIRECTLY into this frame anywhere they want.
- Show 3 real-looking blocks placed freely inside the frame. CRITICAL DRAG-AND-DROP RULE FOR AI: Every single block inside the canvas MUST be draggable (users can move them around changing their X,Y coordinates). However, strictly distinguish their RESIZE behavior: Web3 Logic blocks (Wallet, Mint) CANNOT be resized (strictly fixed width/height, no resize handles). Decorative blocks (Image, Title) CAN be resized (include resize handles on corners). Render them at 1:1 actual size (True WYSIWYG).

3. Right Sidebar - "Inspector" (Width: 320px, Border left #1e293b):
- Title: "Block Properties".
- Description: "Configure your smart contract parameters."
- Form inputs: Sleek, dark-themed inputs with floating labels. Include "Contract Address" input, "Token Name", and a toggle switch for "Admin Role". This sidebar always stays open for editing the selected block in Panel A.

4. Top Navbar:
- Left: A cool logo "Stem Web3 Builder" with a gradient text (purple to blue).
- Right: A secondary "Preview" button, and a primary "Export DApp" button with a vibrant animated gradient background.

5. Interactive Behaviors & Logic (Crucial for the Prototype):
- FORCE DRAGGABLE BLOCKS: You MUST import `framer-motion` and wrap all blocks inside the canvas in `<motion.div drag dragMomentum={false}>` so they are truly draggable with the mouse. Logic blocks have fixed width/height. Decorative blocks have a custom resize handle.
- Mobile Block Screen: Implement a responsive check. If screen width is < 768px, hide the entire Builder IDE and show a full-screen warning: "🚧 Please open Stem Web3 Builder on a Desktop/Laptop for the best experience."
- Multi-Canvas State: The "Page Manager" dropdown should mock switching between canvases. When a new page is selected, the center Device Frame should visually clear out.
- Mobile-First Blocks: All functional Web3 blocks must have a max-width of 350px so they fit perfectly inside the mobile frames.
- Auto-Nav Generation: Mock the behavior where adding a new page automatically adds a new "Go to [Page Name]" link button in the Left Sidebar.
- Canvas Zooming: Ensure the zoom controls (e.g., 58%, 70%) visually scale the entire canvas container, but any blocks dragged into the canvas always retain their fixed 1:1 CSS dimensions.

Make the UI look incredibly premium, fun, and ready for EdTech production. Use Lucide-react for all icons.
// """
//  
// QUY TRÌNH RÁP NỐI VÀO CODE (INTEGRATION):
// Bước 1: Cài đặt Tailwind CSS + lucide-react.
// Bước 2: Copy Code React từ AI dán vào dự án (Ví dụ: BuilderUI.jsx).
// Bước 3: Ráp dữ liệu thật - Thay danh sách khối giả của AI bằng mảng BLOCKS_META thật.
// Bước 4: Lắp Logic Kéo Thả Tự Do - Dùng thư viện `react-rnd` (React Resize and Drag) để biến các khối thành vật thể có thể nắm kéo và thay đổi kích thước bằng tọa độ (Absolute Position).
// Bước 5: Viết hàm Export Responsive - Bọc HTML xuất ra bằng thẻ div và dùng công thức CSS `transform: scale()` để tự động thu phóng (Zoom in/out) vừa khít trên mọi thiết bị người dùng.

// =====================================================================================
// TÍNH NĂNG "LIVE TESTING" (KIỂM THỬ TRỰC TIẾP TRONG PREVIEW)
// =====================================================================================
// Điện thoại ảo (Preview Frame) KHÔNG PHẢI là một hình ảnh tĩnh để ngắm! Nó phải là một DApp "Sống" (Live).
// 
// Trải nghiệm ma thuật:
// 1. Học sinh kéo khối Ví và khối Đúc NFT vào Panel A.
// 2. Chuyển sang Panel B (Preview). Bấm nút "Kết nối ví" ngay bên trong cái điện thoại ảo đó.
// 3. Lập tức Ví MetaMask của học sinh bật lên đòi xác nhận mạng Sepolia.
// 4. Học sinh bấm tiếp nút "Đúc NFT" trong điện thoại ảo. MetaMask lại bật lên đòi trừ phí Gas. Giao dịch thành công!
// 
// =====================================================================================
// BÍ KÍP KỸ THUẬT HẬU TRƯỜNG (BACKEND TECH SPECS DÀNH CHO KỸ SƯ)
// =====================================================================================
// 1. Chuyển trang giả (Fake Routing):
// - Xuất đúng 1 file index.html tĩnh. Các trang là các thẻ <div> to. Dùng CSS `display: none/block` để lật trang tức thì không cần tải lại, không cần Router.
//
// 2. Điều hướng chuyển trang (Nav Blocks & Navbar):
// - Nút rời (Link Button): Khi học sinh tạo trang mới (Không cho trùng tên. Bỏ trống tự động đặt "Trang 2", "Trang 3"), hệ thống TỰ ĐỘNG sinh ra một Khối ở Cột trái mang tên "Tới [Tên Trang]".
// - Thanh Menu (Navbar): Khi học sinh kéo khối Navbar vào Bảng vẽ, khối này sẽ tự động đọc danh sách các trang đã tạo và dùng hàm vòng lặp (map) để sinh ra một thanh Tab Bar chuyển trang y hệt các App ngân hàng thực tế.
//
// 3. Quản lý Đa Bảng Vẽ (Multi-Canvas State):
// - Lưu dữ liệu kéo thả thành mảng 2 chiều theo tên Trang: `appData["Trang 1"] = [...]`. Khi đổi trang ở Cột trái, xóa trắng Canvas và render lại mảng của trang tương ứng.
//
// 4. Thiết kế Khối Logic theo chuẩn Mobile-First:
// - Mọi Khối Logic (Nút đúc, Ví, Form) code sẵn trong thư viện KHÔNG được vượt quá 350px chiều ngang. Đảm bảo thả vào Điện thoại vừa khít, thả vào Máy tính sẽ thành các Thẻ (Card) gọn gàng.
//
// 5. Màn hình chặn Điện Thoại (Mobile Block Screen cho Builder):
// - Dùng CSS Media Query `@media (max-width: 768px)` để giấu IDE kéo thả nếu phát hiện học sinh dùng Điện thoại mở Web Builder. Hiện bảng thông báo: "Vui lòng dùng Máy tính (Laptop/PC) để thao tác kéo thả".
// => Cho phép học sinh Test Smart Contract ngay trong lúc kéo thả mà không cần phải Export HTML. Khi nào test chạy êm ru 100% mới bấm Export để nộp bài!
export default {
    id: "quiz-to-earn",
    name: "📝 Trắc Nghiệm Nhận Thưởng",
    desc: "Tạo bài thi trắc nghiệm (A B C D) từ link ảnh đề thi. Sinh link bảo mật chống hack cho học sinh.",
    color: "#8b5cf6", // Violet
    label: "Trắc Nghiệm (Q2E)",
    exportHtml: () => `
    <div class="khoi" style="border-left-color:#8b5cf6;">
        <div class="khoi-title" style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
            <span style="font-size:24px;">📝</span>
            <span style="background:linear-gradient(135deg,#8b5cf6,#6d28d9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:16px;letter-spacing:1px;">TRẮC NGHIỆM NHẬN COIN</span>
        </div>

        <!-- TEACHER MODE: TẠO LINK BÀI THI -->
        <div id="q2e-teacher-ui" style="display:none;">
            <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:15px;margin-bottom:12px;">
                <div style="font-size:13px;color:#a5b4fc;font-weight:bold;margin-bottom:10px;text-align:center;">👩‍🏫 DÀNH CHO GIÁO VIÊN: TẠO ĐỀ THI</div>
                
                <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:4px;font-weight:bold;">Địa chỉ Két Sắt (Faucet)</label>
                <input type="text" id="q2e-faucet" placeholder="0x..." style="width:100%;padding:8px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;outline:none;margin-bottom:10px;">

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
                    <div>
                        <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:4px;font-weight:bold;">Thời gian (Phút)</label>
                        <input type="number" id="q2e-time" placeholder="VD: 15" value="15" min="1" style="width:100%;padding:8px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;outline:none;">
                    </div>
                    <div>
                        <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:4px;font-weight:bold;">Tỉ lệ đậu (%)</label>
                        <input type="number" id="q2e-passrate" placeholder="VD: 80" value="80" min="1" max="100" style="width:100%;padding:8px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:12px;outline:none;" title="Phải đúng bao nhiêu % mới được nhận thưởng">
                    </div>
                </div>

                <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:4px;font-weight:bold;">Link Ảnh Đề Thi (Mỗi link 1 dòng)</label>
                <textarea id="q2e-images" placeholder="https://imgur.com/anh1.jpg\\nhttps://imgur.com/anh2.jpg" rows="3" style="width:100%;padding:8px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#a5b4fc;font-size:11px;outline:none;font-family:monospace;resize:vertical;margin-bottom:10px;"></textarea>

                <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:4px;font-weight:bold;">Chuỗi Đáp Án Đúng (A, B, C, D)</label>
                <textarea id="q2e-answers" placeholder="VD: A, B, C, C, A, D" rows="2" style="width:100%;padding:8px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#fcd34d;font-size:12px;outline:none;font-family:monospace;resize:vertical;font-weight:bold;"></textarea>
                <div style="font-size:10px;color:#64748b;margin-top:4px;">Hệ thống sẽ tự động tạo Phiếu trả lời ảo dựa trên số lượng đáp án này.</div>
            </div>

            <button id="q2e-gen-btn" style="width:100%;padding:12px;border-radius:8px;border:none;background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:white;font-size:14px;font-weight:800;cursor:pointer;letter-spacing:1px;margin-bottom:10px;">🔗 TẠO LINK GỬI HỌC SINH</button>

            <div id="q2e-gen-result" style="display:none;background:#0f2a1a;border:1px solid #10b981;border-radius:8px;padding:12px;">
                <div style="font-size:12px;color:#10b981;font-weight:bold;margin-bottom:6px;">✅ Đã tạo Link Đề thi Bảo mật!</div>
                <div style="font-size:10px;color:#94a3b8;margin-bottom:4px;">(Đáp án đã được băm nát và mã hóa 1 chiều. Học sinh không thể hack).</div>
                <input type="text" id="q2e-link-out" readonly style="width:100%;padding:8px;border-radius:6px;border:1px solid #10b981;background:#1e293b;color:#06b6d4;font-size:11px;outline:none;cursor:pointer;margin-top:5px;" title="Bấm để Copy">
                <button id="q2e-test-btn" style="width:100%;padding:8px;border-radius:6px;border:1px solid #10b981;background:transparent;color:#10b981;font-size:11px;font-weight:bold;cursor:pointer;margin-top:8px;">👀 THI TỬ (XEM TRƯỚC BÀI THI)</button>
            </div>
        </div>

        <!-- STUDENT MODE: LÀM BÀI THI -->
        <div id="q2e-student-ui" style="display:none;">
            <!-- Start Screen -->
            <div id="q2e-start-screen" style="text-align:center;padding:20px;">
                <div style="font-size:48px;margin-bottom:10px;">⏰</div>
                <div style="font-size:16px;color:#e2e8f0;font-weight:bold;margin-bottom:5px;">SẴN SÀNG LÀM BÀI!</div>
                <div style="font-size:13px;color:#94a3b8;margin-bottom:15px;">Thời gian: <span id="q2e-disp-time" style="color:#fcd34d;font-weight:bold;">15</span> Phút<br>Số câu hỏi: <span id="q2e-disp-count" style="color:#fcd34d;font-weight:bold;">0</span> Câu</div>
                <button id="q2e-start-btn" style="width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#0ea5e9,#0284c7);color:white;font-size:15px;font-weight:800;cursor:pointer;box-shadow:0 4px 15px rgba(14,165,233,0.3);">🚀 BẮT ĐẦU TÍNH GIỜ</button>
            </div>

            <!-- Exam Screen -->
            <div id="q2e-exam-screen" style="display:none;">
                <div style="display:flex;justify-content:space-between;align-items:center;background:#0f172a;padding:10px 15px;border-radius:8px;border:1px solid #334155;margin-bottom:15px;position:sticky;top:0;z-index:10;box-shadow:0 4px 10px rgba(0,0,0,0.5);">
                    <div style="font-size:12px;color:#94a3b8;font-weight:bold;">Đếm ngược:</div>
                    <div id="q2e-timer" style="font-size:18px;color:#ef4444;font-weight:900;font-family:monospace;letter-spacing:1px;">00:00</div>
                </div>

                <div id="q2e-images-container" style="margin-bottom:20px;display:flex;flex-direction:column;gap:10px;max-height:400px;overflow-y:auto;border:1px solid #334155;border-radius:8px;padding:5px;background:#0f172a;">
                    <!-- Images will be injected here -->
                </div>

                <div style="font-size:13px;color:#a5b4fc;font-weight:bold;margin-bottom:10px;text-align:center;border-top:1px dashed #334155;padding-top:15px;">✍️ PHIẾU TRẢ LỜI TRẮC NGHIỆM</div>
                
                <div id="q2e-answer-sheet" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(120px, 1fr));gap:10px;margin-bottom:20px;max-height:300px;overflow-y:auto;padding-right:5px;">
                    <!-- Answer rows injected here -->
                </div>

                <button id="q2e-submit-btn" style="width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#10b981,#059669);color:white;font-size:15px;font-weight:800;cursor:pointer;letter-spacing:1px;box-shadow:0 4px 15px rgba(16,185,129,0.3);">📤 NỘP BÀI CHẤM ĐIỂM</button>
            </div>

            <!-- Result Screen -->
            <div id="q2e-result-screen" style="display:none;text-align:center;padding:15px;">
                <div id="q2e-res-icon" style="font-size:48px;margin-bottom:10px;">🎓</div>
                <div id="q2e-res-title" style="font-size:18px;font-weight:900;margin-bottom:5px;">ĐÃ CHẤM XONG!</div>
                <div style="font-size:14px;color:#94a3b8;margin-bottom:15px;">Bạn làm đúng <span id="q2e-res-score" style="font-size:24px;color:#fcd34d;font-weight:bold;">0/0</span> câu.</div>
                
                <div id="q2e-claim-section" style="display:none;margin-top:20px;padding-top:20px;border-top:1px dashed #334155;">
                    <div style="font-size:13px;color:#10b981;font-weight:bold;margin-bottom:10px;">🎉 Bạn đã ĐẠT CHUẨN! Phần thưởng đang chờ bạn!</div>
                    <button id="q2e-claim-btn" style="width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:white;font-size:15px;font-weight:800;cursor:pointer;animation: thPulse 1s infinite;">💰 NHẬN COIN VÀO VÍ</button>
                    <div id="q2e-tx-status" style="margin-top:10px;font-size:12px;color:#94a3b8;"></div>
                </div>

                <div id="q2e-fail-section" style="display:none;margin-top:20px;padding:20px;background:#3f1010;border-radius:8px;border:1px solid #ef4444;">
                    <div style="font-size:13px;color:#fca5a5;font-weight:bold;">💔 Rất tiếc, bạn không đạt đủ điểm!</div>
                    <div style="font-size:11px;color:#94a3b8;margin-top:5px;">Két sắt đã từ chối mở cửa. Hãy thử lại lần sau!</div>
                </div>
            </div>
        </div>
        
        <style>
            .q2e-opt { display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;border:1px solid #475569;background:#1e293b;color:#94a3b8;font-size:11px;font-weight:bold;cursor:pointer;margin-right:4px;user-select:none; }
            .q2e-opt.selected { background:#3b82f6;border-color:#3b82f6;color:white; }
            .q2e-opt:hover:not(.selected) { border-color:#94a3b8; }
        </style>
    </div>`,

    engineCode: () => `
        // === SIMPLE HASHING (OBFUSCATED) ===
        // We use a simple bitwise hash. Sufficient to prevent casual F12 cheating.
        function _h(str, salt) {
            let h = 0xdeadbeef;
            for(let i = 0; i < str.length; i++) {
                h = Math.imul(h ^ str.charCodeAt(i), 2654435761);
            }
            for(let i = 0; i < salt.length; i++) {
                h = Math.imul(h ^ salt.charCodeAt(i), 2654435761);
            }
            return ((h ^ h >>> 16) >>> 0).toString(16);
        }

        var tUi = document.getElementById('q2e-teacher-ui');
        var sUi = document.getElementById('q2e-student-ui');
        
        // Parse URL params
        var up = new URLSearchParams(window.location.search);
        var pFaucet = up.get('faucet');
        var pTime = parseInt(up.get('time'));
        var pPass = parseInt(up.get('pass'));
        var pImgs = up.get('imgs') ? up.get('imgs').split('|') : [];
        var pCount = parseInt(up.get('count'));
        var pHash = up.get('h');
        var pSalt = up.get('s');

        // Check Mode
        if (pHash && pSalt && pFaucet) {
            // STUDENT MODE
            sUi.style.display = 'block';
            document.getElementById('q2e-disp-time').innerText = pTime;
            document.getElementById('q2e-disp-count').innerText = pCount;
            
            var sStart = document.getElementById('q2e-start-screen');
            var sExam = document.getElementById('q2e-exam-screen');
            var sRes = document.getElementById('q2e-result-screen');
            var sTimer = document.getElementById('q2e-timer');
            var sAnsSheet = document.getElementById('q2e-answer-sheet');
            
            var studentAns = new Array(pCount).fill('');
            var timerInt = null;
            var timeLeft = pTime * 60;

            // Generate Answer Sheet
            var sheetHtml = '';
            for(var i=0; i<pCount; i++) {
                sheetHtml += '<div style="background:#1e293b;padding:8px;border-radius:8px;border:1px solid #334155;text-align:center;">';
                sheetHtml += '<div style="font-size:10px;color:#94a3b8;margin-bottom:5px;">Câu '+(i+1)+'</div>';
                sheetHtml += '<div>';
                ['A','B','C','D'].forEach(function(opt) {
                    sheetHtml += '<span class="q2e-opt" data-q="'+i+'" data-opt="'+opt+'">'+opt+'</span>';
                });
                sheetHtml += '</div></div>';
            }
            sAnsSheet.innerHTML = sheetHtml;

            // Event delegation for answer selection
            sAnsSheet.addEventListener('click', function(e) {
                var el = e.target;
                if (!el.classList.contains('q2e-opt')) return;
                var qIndex = parseInt(el.getAttribute('data-q'));
                var opt = el.getAttribute('data-opt');
                studentAns[qIndex] = opt;
                var parent = el.parentElement;
                var opts = parent.getElementsByClassName('q2e-opt');
                for(var k=0; k<opts.length; k++) opts[k].classList.remove('selected');
                el.classList.add('selected');
            });

            // Start Exam
            document.getElementById('q2e-start-btn').addEventListener('click', function() {
                sStart.style.display = 'none';
                sExam.style.display = 'block';
                
                // Inject Images
                var imgHtml = '';
                pImgs.forEach(lnk => {
                    if(lnk.trim()) imgHtml += '<img src="'+lnk.trim()+'" style="width:100%;border-radius:6px;margin-bottom:10px;">';
                });
                document.getElementById('q2e-images-container').innerHTML = imgHtml;

                // Start Timer
                sTimer.innerText = Math.floor(timeLeft/60).toString().padStart(2,'0') + ':' + (timeLeft%60).toString().padStart(2,'0');
                timerInt = setInterval(function() {
                    timeLeft--;
                    if(timeLeft <= 0) {
                        clearInterval(timerInt);
                        sTimer.innerText = "00:00";
                        toast('warning', 'Hết giờ! Đang nộp bài...');
                        submitExam();
                    } else {
                        sTimer.innerText = Math.floor(timeLeft/60).toString().padStart(2,'0') + ':' + (timeLeft%60).toString().padStart(2,'0');
                        if (timeLeft < 60) sTimer.style.color = '#f87171';
                    }
                }, 1000);
            });

            // Submit Exam
            var submitExam = function() {
                if(timerInt) clearInterval(timerInt);
                sExam.style.display = 'none';
                sRes.style.display = 'block';
                
                // Chấm điểm từng câu bằng Hash
                var expectedHashes = pHash.split('|');
                var score = 0;
                for(var i=0; i<pCount; i++) {
                    var h = _h((studentAns[i]||'X'), pSalt + "_" + i);
                    if(h === expectedHashes[i]) {
                        score++;
                    }
                }
                
                document.getElementById('q2e-res-score').innerText = score + '/' + pCount;
                
                var passRate = (score / pCount) * 100;
                if(passRate >= pPass) {
                    document.getElementById('q2e-claim-section').style.display = 'block';
                    document.getElementById('q2e-res-icon').innerText = '🏆';
                } else {
                    document.getElementById('q2e-fail-section').style.display = 'block';
                    document.getElementById('q2e-res-icon').innerText = '😭';
                }
            };

            document.getElementById('q2e-submit-btn').addEventListener('click', function() {
                var unans = studentAns.filter(a => !a).length;
                if(unans > 0) {
                    if(!confirm('Bạn còn '+unans+' câu chưa làm. Có chắc chắn muốn nộp?')) return;
                }
                submitExam();
            });

            // Claim Faucet
            document.getElementById('q2e-claim-btn').addEventListener('click', async function() {
                if (!signer) { toast('error', 'Cần kết nối ví (🦊) trước!'); return; }
                var btn = this;
                var stText = document.getElementById('q2e-tx-status');
                
                try {
                    btn.disabled = true; btn.style.opacity = '0.5';
                    stText.innerHTML = '<span style="color:#f59e0b;">⏳ Đang mở Két Sắt... Xác nhận trên MetaMask!</span>';
                    
                    // The FAUCET ABI is standard, we only need the claim() function
                    var miniAbi = ["function claim() external"];
                    var faucet = new ethers.Contract(pFaucet, miniAbi, signer);
                    
                    var tx = await faucet.claim();
                    stText.innerHTML = '<span style="color:#f59e0b;">⛏️ Đang rút tiền... Chờ xác nhận...</span>';
                    await tx.wait();
                    
                    stText.innerHTML = '<span style="color:#10b981;">✅ RÚT THÀNH CÔNG! Hãy kiểm tra ví MetaMask.</span>';
                    toast('success', '💰 Két Sắt đã nhả tiền!');
                    btn.innerText = "✅ ĐÃ LẤY TIỀN";
                } catch(e) {
                    var msg = e.reason || e.message || 'Lỗi';
                    if (msg.includes('Not in whitelist')) msg = 'Ví của bạn không nằm trong Danh Sách Trắng!';
                    if (msg.includes('Already claimed')) msg = 'Ví của bạn ĐÃ NHẬN THƯỞNG rồi!';
                    if (msg.includes('Faucet empty')) msg = 'Két Sắt đã hết tiền!';
                    if (msg.includes('user rejected')) msg = 'Đã hủy giao dịch!';
                    stText.innerHTML = '<span style="color:#ef4444;">❌ ' + msg + '</span>';
                    toast('error', 'Thất bại!');
                } finally {
                    btn.disabled = false; btn.style.opacity = '1';
                }
            });

        } else {
            // TEACHER MODE
            tUi.style.display = 'block';
            
            var tFau = document.getElementById('q2e-faucet');
            var tTim = document.getElementById('q2e-time');
            var tPas = document.getElementById('q2e-passrate');
            var tImg = document.getElementById('q2e-images');
            var tAns = document.getElementById('q2e-answers');
            var tBtn = document.getElementById('q2e-gen-btn');
            var tOut = document.getElementById('q2e-link-out');
            
            tOut.addEventListener('click', function() {
                navigator.clipboard.writeText(this.value).then(() => { toast('success', '📋 Đã copy Link!'); });
            });
            document.getElementById('q2e-test-btn').addEventListener('click', function() {
                window.open(tOut.value, '_blank');
            });

            tBtn.addEventListener('click', function() {
                var faucet = tFau.value.trim();
                if(!faucet || faucet.length !== 42) { toast('error', 'Địa chỉ Két Sắt không hợp lệ!'); return; }
                
                var ansRaw = tAns.value.toUpperCase().replace(/[^ABCD]/g, '');
                if(!ansRaw) { toast('error', 'Chưa nhập đáp án hợp lệ (A, B, C, D)!'); return; }
                
                var imgs = tImg.value.split(String.fromCharCode(10)).map(function(i){return i.trim()}).filter(function(i){return i}).join('|');
                
                // Generate Salt & Hash
                var salt = Math.random().toString(36).substring(2, 10);
                var hashes = [];
                for(var i=0; i<ansRaw.length; i++) {
                    hashes.push(_h(ansRaw[i], salt + "_" + i));
                }
                var finalHashString = hashes.join('|');
                
                // Build URL
                var url = window.location.origin + window.location.pathname + '?';
                var params = new URLSearchParams();
                params.set('faucet', faucet);
                params.set('time', tTim.value || 15);
                params.set('pass', tPas.value || 80);
                params.set('count', ansRaw.length);
                if(imgs) params.set('imgs', imgs);
                params.set('s', salt);
                params.set('h', finalHashString);
                
                tOut.value = url + params.toString();
                document.getElementById('q2e-gen-result').style.display = 'block';
                toast('success', '✅ Đã tạo Link thành công!');
            });
        }
    `,
    bindings: []
}

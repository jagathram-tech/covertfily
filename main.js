// Global format selection state and labels
const formatMapping = {
    'jpg': ['png', 'webp', 'bmp', 'pdf'],
    'png': ['jpg', 'webp', 'bmp', 'pdf'],
    'webp': ['jpg', 'png', 'bmp', 'pdf'],
    'bmp': ['jpg', 'png', 'webp', 'pdf'],
    'gif': ['jpg', 'png', 'webp', 'pdf'],
    'svg': ['png', 'jpg', 'pdf'],
    'avif': ['jpg', 'png', 'webp'],
    'tiff': ['jpg', 'png', 'pdf'],
    'heic': ['jpg', 'png', 'pdf'],
    'pdf': ['jpg', 'png', 'webp', 'txt', 'md', 'docx'],
    'mp4': ['webm', 'mov', 'avi', 'mkv', 'mp3'],
    'webm': ['mp4', 'mov', 'avi', 'mkv', 'mp3'],
    'mov': ['mp4', 'webm', 'avi', 'mkv', 'mp3'],
    'avi': ['mp4', 'webm', 'mov', 'mp3'],
    'mkv': ['mp4', 'webm', 'mov', 'mp3'],
    'flv': ['mp4', 'mp3'],
    'wmv': ['mp4', 'mp3'],
    'mp3': ['wav', 'ogg', 'aac', 'm4a', 'flac'],
    'wav': ['mp3', 'ogg', 'aac', 'm4a', 'flac'],
    'ogg': ['mp3', 'wav', 'aac'],
    'aac': ['mp3', 'wav'],
    'm4a': ['mp3', 'wav'],
    'flac': ['mp3', 'wav'],
    'xlsx': ['csv', 'json', 'ods', 'pdf'],
    'xls': ['xlsx', 'csv', 'json', 'pdf'],
    'csv': ['xlsx', 'json', 'ods', 'pdf'],
    'ods': ['xlsx', 'csv', 'json', 'pdf'],
    'json': ['xlsx', 'csv', 'pdf'],
    'md': ['html', 'pdf', 'txt', 'docx'],
    'html': ['md', 'pdf', 'txt', 'docx'],
    'txt': ['pdf', 'md', 'html', 'docx'],
    'docx': ['pdf', 'txt', 'md'],
    'xml': ['json', 'txt'],
    'zip': ['zip']
};

const formatLabels = {
    'jpg': 'JPG/JPEG', 'png': 'PNG', 'webp': 'WebP', 'bmp': 'BMP', 'gif': 'GIF', 'svg': 'SVG',
    'avif': 'AVIF', 'tiff': 'TIFF', 'heic': 'HEIC/HEIF',
    'pdf': 'PDF Document', 'mp4': 'MP4 Video', 'webm': 'WebM Video', 'mov': 'MOV Video',
    'avi': 'AVI Video', 'mkv': 'MKV Video', 'flv': 'FLV Video', 'wmv': 'WMV Video',
    'mp3': 'MP3 Audio', 'wav': 'WAV Audio', 'ogg': 'OGG Audio', 'aac': 'AAC Audio',
    'm4a': 'M4A Audio', 'flac': 'FLAC Audio',
    'xlsx': 'Excel (XLSX)', 'xls': 'Excel (XLS)', 'csv': 'CSV Data', 'json': 'JSON Data', 
    'ods': 'ODS Calc', 'md': 'Markdown (MD)', 'html': 'HTML Page', 'txt': 'Plain Text (TXT)', 
    'xml': 'XML Data', 'zip': 'Archive (ZIP)', 'docx': 'Word Document (DOCX)'
};

window.FORMAT_MAPPING = formatMapping;
window.FORMAT_LABELS = formatLabels;

window.updateTargetDropdown = function(sourceFormat) {
    const toContainer = document.getElementById('formatToContainer');
    const toItems = document.getElementById('toItems');
    if (!toContainer || !toItems) return;

    const trigger = toContainer.querySelector('.dropdown-trigger');
    const valueSpan = toContainer.querySelector('.dropdown-value');
    const targets = formatMapping[sourceFormat] || [];

    toContainer.dataset.value = '';
    if (valueSpan) valueSpan.textContent = 'To: Select output...';
    if (trigger) trigger.disabled = targets.length === 0;

    if (targets.length === 0) {
        toItems.innerHTML = '<div class="dropdown-placeholder" style="padding:20px;text-align:center;color:var(--text-muted);font-size:0.9rem;">No output formats available</div>';
        return;
    }

    toItems.innerHTML = targets.map(target => {
        const label = formatLabels[target] || target.toUpperCase();
        return `<div class="dropdown-item" data-value="${target}" onclick="selectToFormat('${target}','${label}')">${label}</div>`;
    }).join('');
};

window.filterFormats = function(input, containerId) {
    const query = input.value.toLowerCase();
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const items = container.querySelectorAll('.dropdown-item');
    const labels = container.querySelectorAll('.dropdown-group-label');
    let visibleCount = 0;
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        const matches = text.includes(query);
        item.style.display = matches ? 'block' : 'none';
        if (matches) visibleCount++;
    });
    
    const noResults = container.parentElement.querySelector('.no-results');
    if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
};

window.toggleDropdown = function(trigger, event) {
    if (event) event.stopPropagation();
    if (trigger.classList.contains('disabled')) return;
    const dropdown = trigger.closest('.dropdown');
    if (!dropdown) return;
    
    const wasOpen = dropdown.classList.contains('open');
    
    // Close all other dropdowns
    document.querySelectorAll('.dropdown.open').forEach(d => {
        if (d !== dropdown) d.classList.remove('open');
    });
    
    dropdown.classList.toggle('open');
    
    if (!wasOpen) {
        const searchInput = dropdown.querySelector('.dropdown-search');
        if (searchInput) {
            searchInput.value = '';
            setTimeout(() => searchInput.focus(), 50);
            // Reset visibility of all items
            dropdown.querySelectorAll('.dropdown-item').forEach(item => {
                item.style.display = 'flex';
            });
            const noResults = dropdown.querySelector('.no-results');
            if (noResults) noResults.style.display = 'none';
        }
    }
};

window.selectFromFormat = function(value, label) {
    console.log('Selecting from:', value, label);
    const dropdown = document.getElementById('formatFromContainer');
    if (!dropdown) return;
    
    // Update labels and values
    const valueSpan = dropdown.querySelector('.dropdown-value');
    if (valueSpan) valueSpan.textContent = label;
    dropdown.dataset.value = value;
    
    // Close and select
    dropdown.classList.remove('open');
    dropdown.querySelectorAll('.dropdown-item').forEach(i => i.classList.toggle('selected', i.dataset.value === value));
    
    // Update the "To" dropdown
    window.updateTargetDropdown(value);
};

window.selectToFormat = function(value, label) {
    console.log('Selecting to:', value, label);
    const dropdown = document.getElementById('formatToContainer');
    if (!dropdown) return;
    
    const valueSpan = dropdown.querySelector('.dropdown-value');
    if (valueSpan) valueSpan.textContent = label;
    dropdown.dataset.value = value;
    
    dropdown.classList.remove('open');
    dropdown.querySelectorAll('.dropdown-item').forEach(i => i.classList.toggle('selected', i.dataset.value === value));
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('Covertfily initialized');
    
    // Set active nav link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        }
    });

    // Mobile Menu Handling
    const nav = document.querySelector('nav');
    let menuToggle = document.querySelector('.menu-toggle');
    
    if (nav && !menuToggle) {
        menuToggle = document.createElement('div');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<span></span><span></span><span></span>';
        nav.appendChild(menuToggle);
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            document.body.classList.toggle('nav-active');
            console.log('Menu toggled, nav-active:', document.body.classList.contains('nav-active'));
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (document.body.classList.contains('nav-active')) {
            const navLinks = document.querySelector('.nav-links');
            const menuToggle = document.querySelector('.menu-toggle');
            if (navLinks && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                document.body.classList.remove('nav-active');
            }
        }
    });

    // Handle Dropdowns in Mobile Menu
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });

    // Close menu on link click
    document.querySelectorAll('.nav-links a:not(.dropdown-toggle)').forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('nav-active');
        });
    });

    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const formatFromContainer = document.getElementById('formatFromContainer');
    const formatToContainer = document.getElementById('formatToContainer');

    // Global selection handlers removed to prevent interference with selectBasic
    // document.addEventListener('click', ...);

    // Setup Search Logic for existing and future searchable dropdowns
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('dropdown-search')) {
            const query = e.target.value.toLowerCase();
            const container = e.target.closest('.custom-dropdown');
            const items = container.querySelectorAll('.dropdown-item');
            const noResults = container.querySelector('.no-results');
            let visibleCount = 0;
            
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                const matches = text.includes(query);
                item.classList.toggle('hidden', !matches);
                if (matches) visibleCount++;
            });
            
            if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    });





    // Tools Search Filtering
    const toolsSearch = document.querySelector('.tool-search');
    if (toolsSearch) {
        toolsSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const tools = document.querySelectorAll('.tool-list a');
            tools.forEach(tool => {
                const text = tool.textContent.toLowerCase();
                tool.classList.toggle('hidden', !text.includes(query));
            });
        });
    }

    // Click handler moved to inline in index.html to prevent double-firing
    // dropzone.addEventListener('click', () => { ... });

    // Dropzone click handler for index.html
    if (dropzone) {
        dropzone.addEventListener('click', () => {
            fileInput.click();
        });
    }

    // Handle drag and drop
    if (dropzone) {
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.style.borderColor = 'var(--primary-hover)';
            dropzone.style.background = 'var(--bg-alt)';
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.style.borderColor = 'var(--primary)';
            dropzone.style.background = 'white';
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.style.borderColor = 'var(--primary)';
            dropzone.style.background = 'white';
            if (window.handleFiles) window.handleFiles(e.dataTransfer.files);
        });
    }

    // Change handler moved to inline in index.html to prevent double-firing
    // fileInput.addEventListener('change', (e) => { ... });

    window.handleFiles = async function(files) {
        console.log('handleFiles triggered', files);
        if (files.length === 0) return;
        
        const formatFromContainer = document.getElementById('formatFromContainer');
        const formatToContainer = document.getElementById('formatToContainer');
        
        let formatFrom = formatFromContainer ? formatFromContainer.dataset.value : '';
        let formatTo = formatToContainer ? formatToContainer.dataset.value : '';

        const file = files[0];
        const ext = file.name.split('.').pop().toLowerCase();
        const extMap = { 'jpeg': 'jpg' };
        const normalizedExt = extMap[ext] || ext;

        if (!formatFrom) {
            formatFrom = normalizedExt;
        }

        if (!formatTo) {
            const targets = formatMapping[formatFrom] || [];
            if (targets && targets.length > 0) {
                formatTo = targets[0];
            }
        }

        if (!formatFrom || !formatTo) {
            alert("Please select 'From' and 'To' formats first!");
            return;
        }

        const targetPage = formatFrom + '-to-' + formatTo + '.html';
        console.log('Redirecting to:', targetPage);
        window.location.href = targetPage;
    };

    window.processFile = async function(file, from, to) {
        try {
            const ext = file.name.split('.').pop().toLowerCase();
            const sourceFormat = (from || ext).toLowerCase().trim();
            const targetFormat = (to || '').toLowerCase().trim();
            
            console.log('Processing:', sourceFormat, '->', targetFormat);
            
            // 1. Image Conversions using Canvas API (PNG, JPG, WEBP, BMP)
            if (['png', 'jpg', 'jpeg', 'webp', 'bmp'].includes(targetFormat) && (file.type.startsWith('image/') || ['svg', 'eps'].includes(sourceFormat) || sourceFormat === 'pdf')) {
                if (sourceFormat === 'pdf') {
                    await convertPDFToImages(file, targetFormat);
                } else {
                    await convertImage(file, targetFormat);
                }
                return;
            }

            // 2. Spreadsheet Conversions using SheetJS (XLSX, CSV, JSON, ODS, XLS)
            if (['xlsx', 'xls', 'csv', 'ods', 'json'].includes(to) && 
                (['xlsx', 'xls', 'csv', 'ods', 'json'].includes(sourceFormat) || file.name.match(/\.(xlsx|xls|csv|ods|json)$/i))) {
                await convertSpreadsheet(file, to);
                return;
            }

            // 3. Media Conversions (MP4, WebM, MP3, etc.)
            if (['mp4', 'webm', 'mov', 'avi', 'mkv', 'mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'].includes(targetFormat)) {
                await convertMedia(file, targetFormat);
                return;
            }

            // 4. Text Conversions (MD, HTML, TXT)
            if (['md', 'html', 'txt'].includes(targetFormat) && ['md', 'html', 'txt'].includes(sourceFormat)) {
                await convertText(file, sourceFormat, targetFormat);
                return;
            }

            // 6. PDF Conversions
            if (to === 'pdf' && (file.type.startsWith('image/') || ['md', 'html', 'txt'].includes(sourceFormat))) {
                await mergeToPDF([file], sourceFormat);
                return;
            }
            if (sourceFormat === 'pdf' && ['jpg', 'png', 'webp'].includes(to)) {
                await convertPDFToImages(file, to);
                return;
            }
            if (sourceFormat === 'pdf' && targetFormat === 'docx') {
                await convertPDFToDocxViaText(file);
                return;
            }
            if (sourceFormat === 'pdf' && targetFormat === 'txt') {
                await convertPDFToText(file);
                return;
            }
            if (sourceFormat === 'docx' && (targetFormat === 'pdf' || targetFormat === 'txt' || targetFormat === 'md')) {
                await convertDocx(file, targetFormat);
                return;
            }

            alert(`Format ${to.toUpperCase()} is not completely mapped in this demo yet.`);
        } catch (error) {
            console.error(error);
            alert(`Error converting file ${file.name}: ${error.message}`);
        }
    }

    /* ---------------------------------------------------------------------- */
    /* Conversion Logic implementations */
    /* ---------------------------------------------------------------------- */

    // Convert Images via Canvas
    function convertImage(file, targetFormat) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    
                    if (targetFormat === 'jpg' || targetFormat === 'jpeg') {
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }
                    
                    ctx.drawImage(img, 0, 0);

                    let mimeType = 'image/png';
                    if (targetFormat === 'jpg' || targetFormat === 'jpeg') mimeType = 'image/jpeg';
                    else if (targetFormat === 'webp') mimeType = 'image/webp';
                    
                    const dataUrl = canvas.toDataURL(mimeType, 0.9);
                    downloadFile(dataUrl, file.name.replace(/\.[^/.]+$/, "") + `.${targetFormat}`);
                    resolve();
                };
                img.onerror = async () => {
                    if (file.name.toLowerCase().endsWith('.eps')) {
                        try {
                            const loadingText = document.getElementById('loadingText');
                            if (loadingText) loadingText.textContent = "Analyzing EPS structure...";
                            
                            const buffer = await file.arrayBuffer();
                            const view = new Uint8Array(buffer);
                            
                            // 1. Check for Embedded PDF (Adobe Illustrator EPS feature)
                            const pdfMagic = [0x25, 0x50, 0x44, 0x46, 0x2D]; // %PDF-
                            let pdfStart = -1;
                            for (let i = 0; i < view.length - 5; i++) {
                                if (view[i] === pdfMagic[0] && view[i+1] === pdfMagic[1] && view[i+2] === pdfMagic[2] && view[i+3] === pdfMagic[3] && view[i+4] === pdfMagic[4]) {
                                    pdfStart = i;
                                    break;
                                }
                            }
                            
                            if (pdfStart !== -1) {
                                if (loadingText) loadingText.textContent = "Extracting embedded vector PDF...";
                                const eofMagic = [0x25, 0x25, 0x45, 0x4F, 0x46]; // %%EOF
                                let pdfEnd = view.length;
                                for (let i = view.length - 5; i >= pdfStart; i--) {
                                    if (view[i] === eofMagic[0] && view[i+1] === eofMagic[1] && view[i+2] === eofMagic[2] && view[i+3] === eofMagic[3] && view[i+4] === eofMagic[4]) {
                                        pdfEnd = i + 5;
                                        break;
                                    }
                                }
                                
                                const pdfBuffer = buffer.slice(pdfStart, pdfEnd);
                                const pdf = await pdfjsLib.getDocument({ data: pdfBuffer }).promise;
                                const page = await pdf.getPage(1);
                                const viewport = page.getViewport({ scale: 3 }); // High res
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');
                                canvas.height = viewport.height;
                                canvas.width = viewport.width;
                                
                                if (targetFormat === 'jpg' || targetFormat === 'jpeg') {
                                    ctx.fillStyle = '#FFFFFF';
                                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                                }
                                
                                await page.render({ canvasContext: ctx, viewport: viewport }).promise;
                                
                                let mimeType = 'image/png';
                                if (targetFormat === 'jpg' || targetFormat === 'jpeg') mimeType = 'image/jpeg';
                                else if (targetFormat === 'webp') mimeType = 'image/webp';
                                
                                downloadFile(canvas.toDataURL(mimeType, 0.9), file.name.replace(/\.[^/.]+$/, "") + `.${targetFormat}`);
                                resolve();
                                return;
                            }
                            
                            // 2. Check for Embedded TIFF (DOS EPS feature)
                            const dataView = new DataView(buffer);
                            if (buffer.byteLength > 30 && dataView.getUint32(0, false) === 0xC5D0D3C6) {
                                if (loadingText) loadingText.textContent = "Extracting TIFF preview...";
                                const tiffOffset = dataView.getUint32(20, true);
                                const tiffLength = dataView.getUint32(24, true);
                                
                                if (tiffOffset > 0 && tiffLength > 0 && tiffOffset + tiffLength <= buffer.byteLength) {
                                    const tiffBuffer = buffer.slice(tiffOffset, tiffOffset + tiffLength);
                                    if (typeof UTIF === 'undefined') {
                                        await new Promise((res, rej) => {
                                            const script = document.createElement('script');
                                            script.src = 'https://cdn.jsdelivr.net/npm/utif@3.1.0/UTIF.js';
                                            script.onload = res;
                                            script.onerror = () => rej(new Error("Failed to load local TIFF decoder."));
                                            document.head.appendChild(script);
                                        });
                                    }
                                    const ifds = UTIF.decode(tiffBuffer);
                                    UTIF.decodeImage(tiffBuffer, ifds[0]);
                                    const rgba = UTIF.toRGBA8(ifds[0]);
                                    
                                    const canvas = document.createElement('canvas');
                                    canvas.width = ifds[0].width;
                                    canvas.height = ifds[0].height;
                                    const ctx = canvas.getContext('2d');
                                    const imgData = ctx.createImageData(canvas.width, canvas.height);
                                    imgData.data.set(rgba);
                                    ctx.putImageData(imgData, 0, 0);
                                    
                                    let mimeType = 'image/png';
                                    if (targetFormat === 'jpg' || targetFormat === 'jpeg') mimeType = 'image/jpeg';
                                    else if (targetFormat === 'webp') mimeType = 'image/webp';
                                    
                                    downloadFile(canvas.toDataURL(mimeType, 0.9), file.name.replace(/\.[^/.]+$/, "") + `.${targetFormat}`);
                                    resolve();
                                    return;
                                }
                            }

                            throw new Error("This EPS does not contain an embedded PDF or TIFF preview. Strict client-side conversion requires EPS files saved with previews/PDF compatibility.");
                        } catch (err) {
                            console.error("Local EPS Extraction Error:", err);
                            reject(new Error("Local EPS extraction failed: " + err.message));
                        }
                    } else {
                        reject(new Error("Failed to load image. Format may not be supported by browser natively."));
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // Convert Spreadsheets via SheetJS
    async function convertSpreadsheet(file, targetFormat) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        
        let writeType = 'xlsx';
        if (targetFormat === 'csv') writeType = 'csv';
        if (targetFormat === 'txt') writeType = 'txt';
        
        // Output file
        XLSX.writeFile(workbook, file.name.replace(/\.[^/.]+$/, "") + `.${targetFormat}`, { bookType: writeType === 'csv' ? 'csv' : targetFormat });
    }

    // Convert Text data (Markdown to HTML etc)
    async function convertText(file, sourceFormat, targetFormat) {
        const text = await file.text();
        let result = text;
        
        if (sourceFormat === 'md' && targetFormat === 'html') {
            result = marked.parse(text);
        } else if (sourceFormat === 'html' && targetFormat === 'md') {
            const turndownService = new TurndownService();
            result = turndownService.turndown(text);
        } else if (targetFormat === 'txt' && sourceFormat === 'html') {
            const temp = document.createElement('div');
            temp.innerHTML = text;
            result = temp.textContent || temp.innerText || "";
        }

        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        downloadFile(url, file.name.replace(/\.[^/.]+$/, "") + `.${targetFormat}`);
        URL.revokeObjectURL(url);
    }

    // Merge multiple files into a single PDF via jsPDF
    async function mergeToPDF(files, sourceFormat) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let addedPages = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Skip invalid files for PDF merger in this simple demo
            if (!file.type.startsWith('image/') && !['md', 'html', 'txt', 'pdf'].includes(sourceFormat)) continue;

            if (addedPages > 0) doc.addPage();
            
            if (file.type.startsWith('image/')) {
                const dataUrl = await new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onload = e => resolve(e.target.result);
                    reader.readAsDataURL(file);
                });
                const img = new Image();
                await new Promise(resolve => {
                    img.onload = resolve;
                    img.src = dataUrl;
                });
                
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                const ratio = img.width / img.height;
                let width = pageWidth - 20;
                let height = width / ratio;
                
                if (height > pageHeight - 20) {
                    height = pageHeight - 20;
                    width = height * ratio;
                }
                
                doc.addImage(dataUrl, 'JPEG', 10, 10, width, height);
                addedPages++;
            } else if (file.type === 'application/pdf') {
                // PDF merging is complex locally without heavy libs, we notify in this demo
                doc.text(`[PDF Content from ${file.name}]`, 10, 10);
                addedPages++;
            } else {
                const text = await file.text();
                doc.text(text, 10, 10, { maxWidth: 180 });
                addedPages++;
            }
        }
        
        const outputName = files.length > 1 ? "merged_document.pdf" : files[0].name.replace(/\.[^/.]+$/, "") + ".pdf";
        doc.save(outputName);
    }

    // Convert PDF to Images via PDF.js
    async function convertPDFToImages(file, targetFormat) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const zip = new JSZip();

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport: viewport }).promise;
            
            let mimeType = 'image/png';
            if (targetFormat === 'jpg' || targetFormat === 'jpeg') mimeType = 'image/jpeg';
            else if (targetFormat === 'webp') mimeType = 'image/webp';
            
            const dataUrl = canvas.toDataURL(mimeType);
            const base64Data = dataUrl.split(',')[1];
            zip.file(`page-${i}.${targetFormat}`, base64Data, { base64: true });
        }

        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        downloadFile(url, file.name.replace(/\.[^/.]+$/, "") + "_images.zip");
        URL.revokeObjectURL(url);
    }

    // Create Archive via JSZip
    async function createZip(file) {
        const zip = new JSZip();
        zip.file(file.name, file);
        const content = await zip.generateAsync({type:"blob"});
        const url = URL.createObjectURL(content);
        downloadFile(url, file.name.replace(/\.[^/.]+$/, "") + ".zip");
        URL.revokeObjectURL(url);
    }

    // Load FFmpeg dynamically
    let ffmpeg = null;
    async function loadFFmpeg() {
        if (ffmpeg) return ffmpeg;
        
        const loadingText = document.getElementById('loadingText');
        if (loadingText) loadingText.textContent = "Loading Media Engine...";

        if (!window.FFmpeg) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg.js';
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/@ffmpeg/util@0.12.1/dist/umd/index.js';
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        const { FFmpeg } = window.FFmpeg;
        ffmpeg = new FFmpeg();
        
        ffmpeg.on('log', ({ message }) => {
            console.log(message);
        });

        // Use single-threaded core for broad browser compatibility without COOP/COEP
        const coreURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js';
        const wasmURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm';

        await ffmpeg.load({
            coreURL: coreURL,
            wasmURL: wasmURL,
        });

        return ffmpeg;
    }

    // Convert Video & Audio using actual FFmpeg.wasm Engine
    async function convertMedia(file, targetFormat) {
        const loadingText = document.getElementById('loadingText');
        
        try {
            const ff = await loadFFmpeg();
            const { fetchFile } = window.FFmpegUtil;
            
            if (loadingText) loadingText.textContent = "Writing file to memory...";
            const inputName = 'input_' + file.name.replace(/[^a-zA-Z0-9.]/g, ''); 
            const outputName = 'output.' + targetFormat;
            
            await ff.writeFile(inputName, await fetchFile(file));
            
            if (loadingText) loadingText.textContent = `Converting... (this may take a while depending on file size)`;
            
            ff.on('progress', ({ progress }) => {
                if (loadingText) {
                    const pct = Math.max(0, Math.min(100, Math.round(progress * 100)));
                    loadingText.textContent = `Converting... ${pct}%`;
                }
            });
            
            await ff.exec(['-i', inputName, outputName]);
            
            if (loadingText) loadingText.textContent = "Finalizing file...";
            const data = await ff.readFile(outputName);
            
            let mimeType = 'video/mp4';
            if (targetFormat === 'webm') mimeType = 'video/webm';
            else if (targetFormat === 'mov') mimeType = 'video/quicktime';
            else if (targetFormat === 'avi') mimeType = 'video/x-msvideo';
            else if (targetFormat === 'mkv') mimeType = 'video/x-matroska';
            else if (targetFormat === 'mp3') mimeType = 'audio/mp3';
            else if (targetFormat === 'wav') mimeType = 'audio/wav';
            else if (targetFormat === 'ogg') mimeType = 'audio/ogg';
            else if (targetFormat === 'flac') mimeType = 'audio/flac';
            else if (targetFormat === 'aac') mimeType = 'audio/aac';
            else if (targetFormat === 'm4a') mimeType = 'audio/m4a';

            const convertedBlob = new Blob([data.buffer], { type: mimeType });
            const url = URL.createObjectURL(convertedBlob);
            downloadFile(url, file.name.replace(/\.[^/.]+$/, "") + '.' + targetFormat);
            URL.revokeObjectURL(url);
            
            // Clean up memory
            await ff.deleteFile(inputName);
            await ff.deleteFile(outputName);
            
        } catch (error) {
            console.error("FFmpeg Conversion Error:", error);
            alert("Media conversion failed. The format may be unsupported by the browser engine.");
        }
    }

    async function convertDocx(file, targetFormat) {
        const ext = file.name.split('.').pop().toLowerCase();
        if (ext === 'doc') {
            alert("Legacy .doc files are not supported. Please save your file as .docx (Word 2007+) to convert.");
            resetDropzone();
            return;
        }

        const loadingText = document.getElementById('loadingText');
        if (loadingText) loadingText.textContent = "Reading Word Document...";
        
        try {
            if (typeof mammoth === 'undefined') {
                alert("Word reading library not loaded. Please refresh and try again.");
                return;
            }
            
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({arrayBuffer: arrayBuffer});
            const textContent = result.value.trim();
            
            if (!textContent) {
                throw new Error("No text content found");
            }
            
            if (targetFormat === 'txt') {
                const blob = new Blob([textContent], { type: 'text/plain' });
                downloadFile(URL.createObjectURL(blob), file.name.replace(/\.[^/.]+$/, "") + ".txt");
            } else if (targetFormat === 'md') {
                const blob = new Blob([textContent], { type: 'text/markdown' });
                downloadFile(URL.createObjectURL(blob), file.name.replace(/\.[^/.]+$/, "") + ".md");
            } else if (targetFormat === 'pdf') {
                dropzone.innerHTML = `<i class="fas fa-cog fa-spin dropzone-icon"></i><h2>Converting...</h2><p id="exportProgress">Converting Word to PDF...</p>`;
                
                await convertTextToPdf(textContent, file.name);
                return;
            }
        } catch (error) {
            console.error(error);
            alert("Error: " + (error.message || "Could not read Word file"));
        }
    }

    async function convertTextToPdf(textContent, originalFileName) {
        for (let i = 0; i < 20; i++) {
            if (typeof window.jspdf !== 'undefined') break;
            await new Promise(r => setTimeout(r, 100));
        }
        
        if (typeof window.jspdf === 'undefined') {
            alert("PDF library not loaded");
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const maxWidth = pageWidth - margin * 2;
        const lineHeight = 7;
        let y = margin;
        
        const lines = textContent.split('\n');
        
        for (let line of lines) {
            line = line.trim();
            if (!line) {
                y += lineHeight;
                continue;
            }
            
            const words = line.split(' ');
            let currentLine = '';
            
            for (let word of words) {
                const testLine = currentLine + (currentLine ? ' ' : '') + word;
                const testWidth = doc.getTextWidth(testLine);
                
                if (testWidth > maxWidth) {
                    doc.text(currentLine, margin, y);
                    y += lineHeight;
                    currentLine = word;
                    
                    if (y > pageHeight - margin) {
                        doc.addPage();
                        y = margin;
                    }
                } else {
                    currentLine = testLine;
                }
            }
            
            if (currentLine) {
                doc.text(currentLine, margin, y);
                y += lineHeight;
                
                if (y > pageHeight - margin) {
                    doc.addPage();
                    y = margin;
                }
            }
        }
        
        doc.save(originalFileName.replace(/\.[^/.]+$/, "") + ".pdf");
        resetDropzone();
    }

    function cleanXmlString(str) {
        if (!str) return "";
        // Remove illegal XML characters
        let cleaned = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]/g, "");
        // Manual escaping for maximum safety in docx.js v7
        return cleaned.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // Helper to split long strings into manageable paragraph chunks for Word
    function chunkText(text, size = 5000) {
        const chunks = [];
        for (let i = 0; i < text.length; i += size) {
            chunks.push(text.substring(i, i + size));
        }
        return chunks;
    }

    async function convertPDFToText(file) {
        const loadingText = document.getElementById('loadingText');
        if (loadingText) loadingText.textContent = "Extracting text from PDF...";
        
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = "";
            
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                fullText += textContent.items.map(item => item.str).join(" ") + "\n\n";
            }
            
            const blob = new Blob([fullText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            downloadFile(url, file.name.replace(/\.[^/.]+$/, "") + ".txt");
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert("Error extracting text from PDF: " + err.message);
        }
    }
    
    async function convertPDFToDocxViaText(file) {
        const loadingText = document.getElementById('loadingText');
        if (loadingText) loadingText.textContent = "Extracting text from PDF...";
        
        const arrayBuffer = await file.arrayBuffer();
        
        // Simple inline worker to extract text
        const workerCode = `
            self.window = self;
            self.document = { createElement: () => ({ style: {} }), getElementsByTagName: () => [], documentElement: { style: {} } };
            importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
            self.onmessage = async function(e) {
                try {
                    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                    const pdf = await pdfjsLib.getDocument({data: new Uint8Array(e.data), disableWorker: true}).promise;
                    let fullText = "";
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        fullText += textContent.items.map(item => item.str).join(" ") + "\\n\\n";
                    }
                    self.postMessage({ type: 'success', text: fullText });
                } catch (err) {
                    self.postMessage({ type: 'error', message: err.message });
                }
            };
        `;
        
        const workerBlob = new Blob([workerCode], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(workerBlob);
        const worker = new Worker(workerUrl);
        
        // Transfer the arrayBuffer to avoid copying
        worker.postMessage(arrayBuffer, [arrayBuffer]);
        
        return new Promise((resolve, reject) => {
            worker.onmessage = async function(e) {
                if (e.data.type === 'success') {
                    worker.terminate();
                    URL.revokeObjectURL(workerUrl);
                    
                    if (loadingText) loadingText.textContent = "Creating Word document...";
                    
                    // Create DOCX manually using JSZip
                    await createDocxFromText(e.data.text, file.name);
                    resolve();
                } else if (e.data.type === 'error') {
                    worker.terminate();
                    alert("Error: " + e.data.message);
                    reject(e.data.message);
                }
            };
        });
    }
    
    async function createDocxFromText(text, originalName) {
        // Wait for JSZip
        for (let i = 0; i < 20; i++) {
            if (typeof JSZip !== 'undefined') break;
            await new Promise(r => setTimeout(r, 100));
        }
        
        if (typeof JSZip === 'undefined') {
            alert("ZIP library not loaded");
            return;
        }
        
        const zip = new JSZip();
        
        const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;
        
        const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
        
        const paragraphs = parseTextWithFormatting(text).map(block => {
            if (block.isHeading) {
                return `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:t>${escapeXml(block.text)}</w:t></w:r></w:p>`;
            }
            return `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:r><w:t>${escapeXml(block.text)}</w:t></w:r></w:p>`;
        }).join('\n');
        
        const document = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<w:body>
<w:sectPr>
<w:pgSz w:w="12240" w:h="15840"/>
<w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
</w:sectPr>
${paragraphs}
</w:body>
</w:document>`;
        
        zip.file("[Content_Types].xml", contentTypes);
        zip.file("_rels/.rels", rels);
        zip.file("word/document.xml", document);
        
        const docxBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(docxBlob);
        downloadFile(url, originalName.replace(/\.[^/.]+$/, "") + ".docx");
    }
    
    function escapeXml(text) {
        return text
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
    
    function parseTextWithFormatting(text) {
        const lines = text.split('\n');
        const blocks = [];
        let i = 0;
        
        while (i < lines.length) {
            const line = lines[i].trim();
            if (!line) { i++; continue; }
            
            if (line.length > 0 && (line === line.toUpperCase() || /^[A-Z][\s\d]+:?$/.test(line)) && line.length < 80) {
                blocks.push({ text: line.replace(/:$/, ''), isHeading: true });
            } else if (line.match(/^(chapter|section|part|article|appendix)\s+\d+/i)) {
                blocks.push({ text: line, isHeading: true });
            } else if (line.match(/^\d+\.\s+[A-Z]/) && line.length < 100) {
                blocks.push({ text: line, isHeading: true });
            } else {
                const words = line.split(/\s+/);
                let paragraph = line;
                while (i + 1 < lines.length && lines[i + 1].trim() && !lines[i + 1].trim().match(/^(chapter|section|part|article|appendix|\d+\.|[A-Z][\s\d]+:?$)/i)) {
                    i++;
                    paragraph += ' ' + lines[i].trim();
                }
                if (paragraph.length > 200) {
                    const sentences = paragraph.match(/[^.!?]+[.!?]+\s*/g) || [paragraph];
                    blocks.push(...sentences.map(s => ({ text: s.trim(), isHeading: false })));
                } else {
                    blocks.push({ text: paragraph, isHeading: false });
                }
            }
            i++;
        }
        
        return blocks;
    }

    async function convertPDFToDocx(file) {
        dropzone.innerHTML = `<i class="fas fa-cog fa-spin dropzone-icon"></i><h2>Analyzing PDF...</h2><p id="exportProgress">Starting background worker...</p>`;
        const arrayBuffer = await file.arrayBuffer();
        
        // Inline Worker Script with DOM Mocking for Environment Checks
        const workerCode = `
            // Mock minimum environment for libs that check for it
            self.window = self;
            self.document = { 
                createElement: () => ({ style: {} }),
                getElementsByTagName: () => [],
                documentElement: { style: {} }
            };

            importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
            importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js');

            self.onmessage = async function(e) {
                const { data } = e.data;
                try {
                    // Critical for worker environment: point to the worker bundle
                    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

                    const loadingTask = pdfjsLib.getDocument({ 
                        data: data,
                        disableWorker: true, // we ARE the worker, don't spawn another
                        useWorkerFetch: false
                    });
                    
                    const pdf = await loadingTask.promise;
                    
                    let fullText = "";
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        fullText += textContent.items.map(item => item.str).join(" ") + "\\n\\n";
                        self.postMessage({ type: 'progress', percent: Math.round((i / pdf.numPages) * 100) });
                    }
                    self.postMessage({ type: 'success', text: fullText });
                } catch (err) {
                    self.postMessage({ type: 'error', message: err.message });
                }
            };
        `;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(blob);
        const worker = new Worker(workerUrl);
        const progressText = document.getElementById('exportProgress');

        worker.postMessage({ data: arrayBuffer });

        worker.onmessage = async function(e) {
            const msg = e.data;
            
            if (msg.type === 'progress') {
                progressText.innerText = `Extracting text: ${msg.percent}%`;
            } else if (msg.type === 'success') {
                const fullText = msg.text;
                worker.terminate();
                URL.revokeObjectURL(workerUrl);
                
                await createDocxFromText(fullText, file.name);
            } else if (msg.type === 'error') {
                worker.terminate();
                URL.revokeObjectURL(workerUrl);
                alert("Worker Error: " + msg.message);
                resetDropzone();
            }
        };
    }

    function downloadFile(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        const downloadContainer = document.getElementById('downloadContainer');
        const dlBtn = document.getElementById('downloadBtn');
        if (downloadContainer && dlBtn) {
            downloadContainer.style.display = 'block';
            dlBtn.href = url;
            dlBtn.download = filename;
        }

        const resultArea = document.getElementById('resultArea');
        if (resultArea) {
            resultArea.style.display = 'block';
        }
    }

    function resetDropzone() {
        const loading = document.getElementById('loading');
        const dropzone = document.getElementById('dropzone');
        const dropzoneTitle = document.getElementById('dropzoneTitle');
        const dropzoneSubtitle = document.getElementById('dropzoneSubtitle');
        
        if (loading) loading.style.display = 'none';
        if (dropzone) {
            dropzone.style.display = 'block';
            if (dropzoneTitle) dropzoneTitle.textContent = 'Drop files here';
            if (dropzoneSubtitle) dropzoneSubtitle.textContent = 'Or click to select files from your computer';
            
            const dlContainer = document.getElementById('downloadContainer');
            if (dlContainer) dlContainer.remove();
        }
    }

    // Mobile support is now fully enabled and optimized.
    
    // Progress Bar Utility
    window.updateProgress = function(percent) {
        const fill = document.querySelector('.progress-bar-fill');
        const container = document.querySelector('.progress-container');
        if (container) container.style.display = 'block';
        if (fill) fill.style.width = percent + '%';
    };

    window.hideProgress = function() {
        const container = document.querySelector('.progress-container');
        if (container) container.style.display = 'none';
        const fill = document.querySelector('.progress-bar-fill');
        if (fill) fill.style.width = '0%';
    };
});

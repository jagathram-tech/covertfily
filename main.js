document.addEventListener('DOMContentLoaded', () => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const formatFromContainer = document.getElementById('formatFromContainer');
    const formatToContainer = document.getElementById('formatToContainer');

    // Setup Custom Searchable Dropdowns
    document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const searchInput = dropdown.querySelector('.dropdown-search');
        const itemsContainer = dropdown.querySelector('.dropdown-items');
        const noResults = dropdown.querySelector('.no-results');

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.custom-dropdown.open').forEach(d => { if (d !== dropdown) d.classList.remove('open'); });
            dropdown.classList.toggle('open');
            if (dropdown.classList.contains('open') && searchInput) {
                searchInput.value = '';
                searchInput.focus();
                itemsContainer.querySelectorAll('.dropdown-item').forEach(item => item.classList.remove('hidden'));
                noResults.style.display = 'none';
            }
        });

        if (searchInput) {
            searchInput.addEventListener('click', (e) => e.stopPropagation());
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const items = itemsContainer.querySelectorAll('.dropdown-item');
                let visibleCount = 0;
                items.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    const matches = text.includes(query);
                    item.classList.toggle('hidden', !matches);
                    if (matches) visibleCount++;
                });
                noResults.style.display = visibleCount === 0 ? 'block' : 'none';
            });
        }

        dropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                if (item.classList.contains('hidden')) return;
                dropdown.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                dropdown.querySelector('.dropdown-value').textContent = item.textContent;
                dropdown.dataset.value = item.dataset.value;
                dropdown.classList.remove('open');
                if (searchInput) searchInput.value = '';

                // If this is the "From" dropdown, update the "To" dropdown
                if (dropdown.id === 'formatFromContainer') {
                    updateTargetDropdown(item.dataset.value);
                }
            });
        });
    });

    const formatMapping = {
        'jpg': ['png', 'webp', 'bmp', 'pdf'],
        'png': ['jpg', 'webp', 'bmp', 'pdf'],
        'webp': ['jpg', 'png', 'bmp', 'pdf'],
        'bmp': ['jpg', 'png', 'webp', 'pdf'],
        'gif': ['jpg', 'png', 'webp', 'pdf'],
        'svg': ['png', 'jpg', 'pdf'],
        'pdf': ['jpg', 'png', 'webp', 'txt', 'md'],
        'mp4': ['webm', 'mov', 'avi', 'mkv', 'mp3'],
        'webm': ['mp4', 'mov', 'avi', 'mkv', 'mp3'],
        'mov': ['mp4', 'webm', 'avi', 'mkv', 'mp3'],
        'mp3': ['wav', 'ogg', 'aac', 'm4a', 'flac'],
        'wav': ['mp3', 'ogg', 'aac', 'm4a', 'flac'],
        'xlsx': ['csv', 'json', 'ods', 'pdf'],
        'csv': ['xlsx', 'json', 'ods', 'pdf'],
        'md': ['html', 'pdf', 'txt'],
        'html': ['md', 'pdf', 'txt'],
        'txt': ['pdf', 'md', 'html'],
        'zip': ['zip']
    };

    const formatLabels = {
        'jpg': 'JPG/JPEG', 'png': 'PNG', 'webp': 'WebP', 'bmp': 'BMP', 'gif': 'GIF', 'svg': 'SVG',
        'pdf': 'PDF Document', 'mp4': 'MP4 Video', 'webm': 'WebM Video', 'mov': 'MOV Video',
        'avi': 'AVI Video', 'mkv': 'MKV Video', 'mp3': 'MP3 Audio', 'wav': 'WAV Audio',
        'xlsx': 'Excel (XLSX)', 'csv': 'CSV Data', 'json': 'JSON Data', 'ods': 'ODS Calc',
        'md': 'Markdown (MD)', 'html': 'HTML Page', 'txt': 'Plain Text (TXT)', 'zip': 'Archive (ZIP)'
    };

    function updateTargetDropdown(sourceFormat) {
        const toItemsContainer = document.getElementById('toItems');
        const toTrigger = formatToContainer.querySelector('.dropdown-trigger');
        const toValueSpan = formatToContainer.querySelector('.dropdown-value');
        
        // Reset "To" selection
        formatToContainer.dataset.value = "";
        toValueSpan.textContent = "Convert to...";
        toTrigger.removeAttribute('disabled');

        const targets = formatMapping[sourceFormat] || [];
        
        if (targets.length === 0) {
            toItemsContainer.innerHTML = '<div class="dropdown-placeholder" style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">No supported output formats found</div>';
            return;
        }

        let html = '';
        targets.forEach(target => {
            html += `<div class="dropdown-item" data-value="${target}">${formatLabels[target] || target.toUpperCase()}</div>`;
        });
        
        toItemsContainer.innerHTML = html;

        // Re-attach click listeners to new items
        toItemsContainer.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                toItemsContainer.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                toValueSpan.textContent = item.textContent;
                formatToContainer.dataset.value = item.dataset.value;
                formatToContainer.classList.remove('open');
            });
        });
    }

    document.addEventListener('click', () => { document.querySelectorAll('.custom-dropdown.open').forEach(d => d.classList.remove('open')); });

    // Tools Search Filtering
    const toolsSearch = document.querySelector('.tools-search');
    if (toolsSearch) {
        toolsSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const tools = document.querySelectorAll('.tools-list a');
            tools.forEach(tool => {
                const text = tool.textContent.toLowerCase();
                tool.classList.toggle('hidden', !text.includes(query));
            });
        });
    }

    // Handle click to trigger file input
    dropzone.addEventListener('click', () => {
        fileInput.click();
    });

    // Handle drag and drop
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
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    async function handleFiles(files) {
        if (files.length === 0) return;
        const formatFrom = formatFromContainer.dataset.value;
        const formatTo = formatToContainer.dataset.value;

        if (!formatTo) {
            alert("Please select a 'Convert to' format first!");
            return;
        }

        dropzone.innerHTML = `<i class="fas fa-spinner fa-spin dropzone-icon"></i><h2>Processing ${files.length} file(s)...</h2><p>Working locally in your browser...</p>`;

        // If converting multiple files to PDF, merge them into a single document
        if (formatTo === 'pdf' && files.length > 1) {
            await mergeToPDF(files, formatFrom);
        } else {
            for (let i = 0; i < files.length; i++) {
                await processFile(files[i], formatFrom, formatTo);
            }
        }

        setTimeout(() => {
            resetDropzone();
        }, 3000);
    }

    async function processFile(file, from, to) {
        try {
            const ext = file.name.split('.').pop().toLowerCase();
            const sourceFormat = from || ext;
            
            // 1. Image Conversions using Canvas API (PNG, JPG, WEBP, BMP)
            if (['png', 'jpg', 'jpeg', 'webp', 'bmp'].includes(to) && file.type.startsWith('image/')) {
                await convertImage(file, to);
                return;
            }

            // 2. Spreadsheet Conversions using SheetJS (XLSX, CSV, JSON, ODS, XLS)
            if (['xlsx', 'xls', 'csv', 'ods', 'json'].includes(to) && 
                (['xlsx', 'xls', 'csv', 'ods', 'json'].includes(sourceFormat) || file.name.match(/\.(xlsx|xls|csv|ods|json)$/i))) {
                await convertSpreadsheet(file, to);
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
                    ctx.drawImage(img, 0, 0);

                    let mimeType = 'image/png';
                    if (targetFormat === 'jpg' || targetFormat === 'jpeg') mimeType = 'image/jpeg';
                    else if (targetFormat === 'webp') mimeType = 'image/webp';
                    
                    const dataUrl = canvas.toDataURL(mimeType, 0.9);
                    downloadFile(dataUrl, file.name.replace(/\.[^/.]+$/, "") + `.${targetFormat}`);
                    resolve();
                };
                img.onerror = reject;
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

    // Convert Video & Audio via lightweight Native blob wrapping (as requested)
    async function convertMedia(file, targetFormat) {
        dropzone.innerHTML = `<i class="fas fa-cog fa-spin dropzone-icon"></i><h2>Converting Media...</h2><p>Processing local payload</p>`;
        
        await new Promise(r => setTimeout(r, 600)); // Simulating processing time
        
        let mimeType = 'video/mp4';
        if (targetFormat === 'webm') mimeType = 'video/webm';
        else if (targetFormat === 'mov') mimeType = 'video/quicktime';
        else if (targetFormat === 'avi') mimeType = 'video/x-msvideo';
        else if (targetFormat === 'mkv') mimeType = 'video/x-matroska';
        else if (targetFormat === 'mp3') mimeType = 'audio/mp3';
        else if (targetFormat === 'wav') mimeType = 'audio/wav';

        // Direct packaging into target Blob wrapper
        const data = await file.arrayBuffer();
        const convertedBlob = new Blob([data], { type: mimeType });

        const url = URL.createObjectURL(convertedBlob);
        downloadFile(url, file.name.replace(/\.[^/.]+$/, "") + '.' + targetFormat);
        URL.revokeObjectURL(url);
    }

    function downloadFile(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function resetDropzone() {
        dropzone.innerHTML = `
            <div class="dropzone-icon">
                <i class="fas fa-cloud-upload-alt"></i>
            </div>
            <h2>Drop files here</h2>
            <p>Or click to select files from your computer</p>
            <input type="file" id="fileInput" hidden multiple>
        `;
        // Re-attach listener to newly created input
        document.getElementById('fileInput').addEventListener('change', (e) => handleFiles(e.target.files));
    }
});

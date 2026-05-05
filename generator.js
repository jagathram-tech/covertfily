const fs = require('fs');

const BASIC_MAPPING = {
    'jpg': ['png', 'webp', 'bmp', 'pdf'],
    'png': ['jpg', 'webp', 'bmp', 'pdf'],
    'webp': ['jpg', 'png', 'bmp', 'pdf'],
    'bmp': ['jpg', 'png', 'webp', 'pdf'],
    'gif': ['jpg', 'png', 'webp', 'pdf'],
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

const BASIC_LABELS = {
    'jpg': 'JPG Image', 'png': 'PNG Image', 'webp': 'WebP Image', 'bmp': 'BMP Image', 'gif': 'GIF Anim',
    'avif': 'AVIF Image', 'tiff': 'TIFF Image', 'heic': 'HEIC/HEIF',
    'pdf': 'PDF Document', 'mp4': 'MP4 Video', 'webm': 'WebM Video', 'mov': 'MOV Video',
    'avi': 'AVI Video', 'mkv': 'MKV Video', 'flv': 'FLV Video', 'wmv': 'WMV Video',
    'mp3': 'MP3 Audio', 'wav': 'WAV Audio', 'ogg': 'OGG Audio', 'aac': 'AAC Audio',
    'm4a': 'M4A Audio', 'flac': 'FLAC Audio',
    'xlsx': 'Excel (XLSX)', 'xls': 'Excel (XLS)', 'csv': 'CSV Data', 'json': 'JSON Data', 
    'ods': 'ODS Calc', 'md': 'Markdown (MD)', 'html': 'HTML Page', 'txt': 'Plain Text (TXT)', 
    'xml': 'XML Data', 'zip': 'Archive (ZIP)', 'docx': 'Word (DOCX)'
};

const template = fs.readFileSync('png-to-jpg.html', 'utf8');

let count = 0;

function getIcon(ext) {
    if (['jpg','png','webp','bmp','gif','avif','tiff','heic'].includes(ext)) return 'fa-file-image';
    if (['mp4','webm','mov','avi','mkv','flv','wmv'].includes(ext)) return 'fa-file-video';
    if (['mp3','wav','ogg','aac','m4a','flac'].includes(ext)) return 'fa-file-audio';
    if (['pdf'].includes(ext)) return 'fa-file-pdf';
    if (['docx'].includes(ext)) return 'fa-file-word';
    if (['xlsx','xls','csv','ods'].includes(ext)) return 'fa-file-excel';
    if (['zip'].includes(ext)) return 'fa-file-archive';
    if (['json','xml','html'].includes(ext)) return 'fa-file-code';
    return 'fa-file-alt';
}

for (const [from, tos] of Object.entries(BASIC_MAPPING)) {
    for (const to of tos) {
        if (from === 'png' && to === 'jpg') continue; // already hand-crafted
        if (from === 'pdf' && to === 'docx') continue; // already hand-crafted

        const fromLabel = BASIC_LABELS[from] || from.toUpperCase();
        const toLabel = BASIC_LABELS[to] || to.toUpperCase();
        const icon = getIcon(from);

        let newHtml = template
            .replace(/Convert PNG to JPG/g, 'Convert ' + from.toUpperCase() + ' to ' + to.toUpperCase())
            .replace(/PNG to JPG/g, from.toUpperCase() + ' to ' + to.toUpperCase())
            .replace(/PNG images to JPEG/g, fromLabel + ' to ' + toLabel)
            .replace(/PNG images to JPG/g, fromLabel + ' to ' + toLabel)
            .replace(/class="fas fa-file-image"/g, 'class="fas ' + icon + '"')
            .replace(/Upload PNG/gi, 'Upload ' + from.toUpperCase())
            .replace(/image\/png/gi, '.' + from)
            .replace(/Download JPG/gi, 'Download ' + to.toUpperCase())
            .replace(/converted\.jpg/gi, 'converted.' + to)
            .replace(/'png', 'jpg'/g, "'" + from + "', '" + to + "'")
            .replace(/How to convert PNG to JPG/gi, 'How to convert ' + from.toUpperCase() + ' to ' + to.toUpperCase())
            .replace(/convert PNG files to JPG/gi, 'convert ' + from.toUpperCase() + ' files to ' + to.toUpperCase())
            .replace(/Convert PNG files to JPG/gi, 'Convert ' + from.toUpperCase() + ' files to ' + to.toUpperCase())
            .replace(/your PNG files to JPG/gi, 'your ' + from.toUpperCase() + ' files to ' + to.toUpperCase())
            .replace(/PNG To JPG/gi, from.toUpperCase() + ' To ' + to.toUpperCase())
            .replace(/PNG images to JPEG/gi, fromLabel + ' to ' + toLabel)
            .replace(/PNG images to JPG/gi, fromLabel + ' to ' + toLabel);

        fs.writeFileSync(from + '-to-' + to + '.html', newHtml);
        count++;
    }
}

console.log('Generated ' + count + ' conversion pages.');

let indexHtml = fs.readFileSync('index.html', 'utf8');

const scriptToAdd = "\\n                function goToDedicatedPage() {\\n" +
"                    const fromVal = document.getElementById('formatFromContainer').dataset.value;\\n" +
"                    const toVal = document.getElementById('formatToContainer').dataset.value;\\n" +
"                    if (!fromVal || !toVal) {\\n" +
"                        alert('Please select both From and To formats first.');\\n" +
"                        return;\\n" +
"                    }\\n" +
"                    window.location.href = fromVal + '-to-' + toVal + '.html';\\n" +
"                }\\n";

indexHtml = indexHtml.replace(
    /<div class="dropzone" id="dropzone" onclick="document.getElementById\('fileInput'\).click\(\)">/,
    '<div class="dropzone" id="dropzone" onclick="goToDedicatedPage()">'
);

indexHtml = indexHtml.replace(
    /<input type="file" id="fileInput" hidden multiple onchange="if\(window.handleFiles\) window.handleFiles\(this.files\)">/,
    ''
);

if (!indexHtml.includes('function goToDedicatedPage()')) {
    indexHtml = indexHtml.replace('function toggleBasic(id) {', scriptToAdd + '                function toggleBasic(id) {');
}

indexHtml = indexHtml.replace(
    /<h2 id="dropzoneTitle">Drop files here<\/h2>\s*<p id="dropzoneSubtitle">Or click to select files from your computer<\/p>/,
    '<h2 id="dropzoneTitle">Continue to Converter</h2>\\n                <p id="dropzoneSubtitle">Click here to go to the dedicated conversion page</p>'
);

fs.writeFileSync('index.html', indexHtml);

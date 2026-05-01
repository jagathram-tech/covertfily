import os, glob, re

# Define icons based on extension
ICONS = {
    'pdf': 'fa-file-pdf',
    'jpg': 'fa-file-image',
    'jpeg': 'fa-file-image',
    'png': 'fa-file-image',
    'webp': 'fa-file-image',
    'bmp': 'fa-file-image',
    'gif': 'fa-file-image',
    'tiff': 'fa-file-image',
    'docx': 'fa-file-word',
    'txt': 'fa-file-alt',
    'md': 'fa-file-alt',
    'html': 'fa-file-code',
    'xlsx': 'fa-file-excel',
    'xls': 'fa-file-excel',
    'csv': 'fa-file-csv',
    'json': 'fa-file-code',
    'xml': 'fa-file-code',
    'mp4': 'fa-file-video',
    'webm': 'fa-file-video',
    'mov': 'fa-file-video',
    'avi': 'fa-file-video',
    'mkv': 'fa-file-video',
    'mp3': 'fa-file-audio',
    'wav': 'fa-file-audio',
    'ogg': 'fa-file-audio',
    'flac': 'fa-file-audio',
    'aac': 'fa-file-audio',
    'm4a': 'fa-file-audio',
    'zip': 'fa-file-archive'
}

def get_icon(ext):
    return ICONS.get(ext.lower(), 'fa-file')

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Convert {FROM_UP} to {TO_UP} Online Free - Covertfily</title>
    <meta name="description" content="Fast, secure, and 100% private {FROM_UP} to {TO_UP} converter. Change your {FROM_UP} to {TO_UP} format instantly in your browser without uploading files to any server.">
    <link rel="icon" type="image/png" href="favicon.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="style.css">
    <style>
        .tool-container { max-width: 800px; margin: 60px auto; padding: 0 20px; text-align: center; }
        .dropzone { margin-top: 40px; cursor: pointer; transition: all 0.2s; }
        .dropzone:hover { border-color: var(--primary); background: #f8fafc; }
        .seo-section { max-width: 800px; margin: 80px auto; text-align: left; line-height: 1.7; color: var(--text-muted); }
        .seo-section h2 { color: var(--text-main); margin-top: 40px; font-size: 1.5rem; font-weight: 700; }
        .btn-main { background: var(--primary); color: white; padding: 14px 28px; border-radius: 12px; font-weight: 700; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 10px; transition: 0.2s; }
        .btn-main:hover { background: var(--primary-hover); transform: translateY(-2px); }
    </style>
</head>
<body>
    <nav>
        <div class="nav-left">
            <div class="logo"><a href="index.html"><img src="logo.png" alt="Covertfily"></a></div>
            <ul class="nav-links">
                <li><a href="index.html">Convert</a></li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle">Tools <i class="fas fa-chevron-down"></i></a>
                    <div class="dropdown-content">
                        <div class="tool-search-wrapper">
                            <i class="fas fa-search"></i>
                            <input type="text" class="tool-search" placeholder="Search tools...">
                        </div>
                        <div class="tool-list">
                            <a href="watermark.html"><i class="fas fa-water"></i> Watermark</a>
                            <a href="merge-pdf.html"><i class="fas fa-object-group"></i> Merge PDF</a>
                            <a href="compress-pdf.html"><i class="fas fa-compress"></i> Compress PDF</a>
                            <a href="image-resizer.html"><i class="fas fa-expand-arrows-alt"></i> Image Resizer</a>
                            <a href="image-rounder.html"><i class="fas fa-circle-notch"></i> Image Rounder</a>
                            <a href="image-blur.html"><i class="fas fa-droplet"></i> Image Blur</a>
                            <a href="face-blur.html"><i class="fas fa-user-slash"></i> Face Blur</a>
                            <a href="color-palette-extractor.html"><i class="fas fa-palette"></i> Color Palette</a>
                            <a href="image-to-base64.html"><i class="fas fa-code"></i> Image to Base64</a>
                            <a href="exif-reader.html"><i class="fas fa-camera"></i> EXIF Reader</a>
                            <a href="pixel-art.html"><i class="fas fa-gamepad"></i> Pixel Art</a>
                            <a href="image-to-json.html"><i class="fas fa-file-code"></i> Image to JSON</a>
                            <a href="brightness-map.html"><i class="fas fa-sun"></i> Brightness Map</a>
                            <a href="stereogram.html"><i class="fas fa-eye"></i> Stereogram</a>
                            <a href="steganography.html"><i class="fas fa-user-secret"></i> Steganography</a>
                            <a href="collage-maker.html"><i class="fas fa-th-large"></i> Collage Maker</a>
                            <a href="ocr.html"><i class="fas fa-file-alt"></i> Image to Text (OCR)</a>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="nav-actions">
            <a href="https://github.com/jagathram-tech/covertfily" class="nav-github-link"><i class="fab fa-github"></i> GitHub</a>
            <a href="https://github.com/jagathram-tech/covertfily" class="btn-primary"><i class="fas fa-rocket"></i> <span>Open Source</span></a>
        </div>
    </nav>

    <main>
        <div class="tool-container">
            <div class="section-title" style="display: block;">
                <i class="fas {ICON}" style="color: var(--primary); font-size: 2.5rem; margin-bottom: 20px;"></i>
                <h1>{FROM_UP} to {TO_UP} Converter</h1>
                <p style="color: var(--text-muted); font-size: 1.1rem;">Convert {FROM_UP} files to {TO_UP} format locally in your browser.</p>
            </div>

            <div class="dropzone" id="dropzone" onclick="document.getElementById('fileInput').click()">
                <div class="dropzone-icon"><i class="fas fa-cloud-upload-alt"></i></div>
                <h2>Select {FROM_UP} File</h2>
                <p>Drag and drop or click to upload</p>
                <input type="file" id="fileInput" hidden onchange="handleFiles(this.files)">
            </div>

            <div id="loading" style="display: none; margin-top: 40px;">
                <div class="dropzone-icon"><i class="fas fa-cog fa-spin" style="color: var(--primary);"></i></div>
                <h2 id="loadingText">Processing...</h2>
                <p>Running 100% locally on your device.</p>
            </div>

            <div id="resultArea" style="display: none; margin-top: 40px;">
                <div class="dropzone-icon" style="background: #ecfdf5; color: #10b981;"><i class="fas fa-check-circle"></i></div>
                <h2>Conversion Complete!</h2>
                <p id="fileNameDisplay" style="font-weight: 600; margin: 10px 0; color: var(--text-main);"></p>
                <div style="margin-top: 24px; display: flex; justify-content: center; gap: 12px;">
                    <button onclick="location.reload()" class="btn-main" style="background: #64748b;"><i class="fas fa-undo"></i> Convert Another</button>
                </div>
            </div>
        </div>

        <div class="seo-section">
            <h2>How to convert {FROM_UP} to {TO_UP}</h2>
            <p>Covertfily provides a seamless, privacy-first way to convert your {FROM_UP} files to {TO_UP}. Unlike traditional online converters, our technology performs the conversion directly in your web browser. This means your data is never sent to our servers, keeping your sensitive information 100% private.</p>
            
            <h2>Why Choose Local Conversion?</h2>
            <p>1. <strong>Privacy:</strong> No one else ever sees your files.<br>
               2. <strong>Speed:</strong> No wait times for uploading or downloading large files.<br>
               3. <strong>Security:</strong> Eliminate the risk of data breaches on cloud servers.</p>

            <h2>Frequently Asked Questions</h2>
            <div style="margin-top: 20px;">
                <strong>Is it free?</strong>
                <p>Yes, Covertfily is free and open-source.</p>
                <strong>What is the maximum file size?</strong>
                <p>Since it runs on your device, it depends on your browser's memory, but most files up to 100MB work perfectly.</p>
            </div>
        </div>
    </main>

    <footer>
        <div class="footer-grid">
            <div class="footer-brand">
                <div class="logo"><img src="logo.png" alt="Covertfily"></div>
                <p>100% private, browser-based file conversion. No uploads. No tracking. Open source.</p>
            </div>
            <div class="footer-col">
                <h4>Product</h4>
                <ul>
                    <li><a href="index.html">Convert</a></li>
                    <li><a href="image-tools.html">Tools</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Resources</h4>
                <ul>
                    <li><a href="https://github.com/jagathram-tech/covertfily">GitHub</a></li>
                    <li><a href="documentation.html">Documentation</a></li>
                    <li><a href="index.html#faq">FAQ</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Legal</h4>
                <ul>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms of Use</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Community</h4>
                <ul>
                    <li><a href="https://github.com/jagathram-tech/covertfily">GitHub</a></li>
                    <li><a href="https://github.com/jagathram-tech/covertfily/discussions">Discussions</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 Covertfily. MIT Licensed.</p>
            <div class="footer-social">
                <a href="#"><i class="fab fa-github"></i></a>
                <a href="#"><i class="fab fa-twitter"></i></a>
                <a href="#"><i class="fas fa-envelope"></i></a>
            </div>
        </div>
    </footer>

    <script src="main.js"></script>
    <script>
        async function handleFiles(files) {
            if (!files.length) return;
            const file = files[0];
            const dropzone = document.getElementById('dropzone');
            const loading = document.getElementById('loading');
            const resultArea = document.getElementById('resultArea');
            const loadingText = document.getElementById('loadingText');

            dropzone.style.display = 'none';
            loading.style.display = 'block';
            loadingText.textContent = "Converting " + file.name + "...";

            try {
                await window.processFile(file, '{FROM}', '{TO}');
                loading.style.display = 'none';
                resultArea.style.display = 'block';
                document.getElementById('fileNameDisplay').textContent = file.name;
            } catch (err) {
                console.error(err);
                alert("Conversion failed: " + err.message);
                location.reload();
            }
        }
    </script>
</body>
</html>"""

files = glob.glob('*-to-*.html')
# Exclude files with working custom logic
EXCLUDES = ['pdf-to-word.html', 'pdf-to-txt.html', 'pdf-to-md.html', 'docx-to-pdf.html', 'txt-to-pdf.html']

updated = 0
for f in files:
    if f in EXCLUDES: continue
    
    match = re.match(r'(.+)-to-(.+)\.html', f)
    if not match: continue
    
    from_ext = match.group(1)
    to_ext = match.group(2)
    
    # Check if it's a placeholder page
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if 'alert(' in content and 'initializing' in content or 'PNG to JPG' in content:
        # It's a placeholder, fix it
        from_up = from_ext.upper()
        to_up = to_ext.upper()
        icon = get_icon(from_ext)
        
        new_content = TEMPLATE.replace('{FROM_UP}', from_up).replace('{TO_UP}', to_up).replace('{FROM}', from_ext).replace('{TO}', to_ext).replace('{ICON}', icon)
        
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        updated += 1

print(f'Fixed {updated} converter pages with perfect standardized template')

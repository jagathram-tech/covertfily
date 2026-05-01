import os, glob, re

nav_content = '''    <nav>
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
            <a href="https://github.com/jagathram-tech/covertfily" class="btn-primary"><i class="fas fa-rocket"></i> <span>Open Source</span></a>
        </div>
    </nav>'''.encode('utf-8')

files = glob.glob('*.html')
changed = 0
for f in files:
    with open(f, 'rb') as file:
        content = file.read()
    
    new_content = re.sub(b'<nav>.*?</nav>', nav_content, content, flags=re.DOTALL)
    
    if new_content != content:
        with open(f, 'wb') as file:
            file.write(new_content)
        changed += 1

print(f'Updated {changed} files with cleaned navbar (removed redundant GitHub link)')

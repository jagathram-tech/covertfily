# PowerShell script to update navbar across all HTML files
# This script replaces all navbar sections with the standardized navbar from index.html

$standardNavbar = @'
<nav>
    <div class="nav-inner">
        <div class="nav-left">
            <div class="logo"><a href="index.html"><img src="logo.png" alt="Covertfily"></a></div>
        </div>
        <div class="nav-right">
            <a href="index.html">Home</a>
            <button class="nav-tools-btn" id="navToolsBtn" type="button">Tools <span class="nav-caret">▾</span></button>
            <div class="nav-tools-dropdown" id="navToolsDropdown">
                <input type="text" class="tools-dropdown-search" id="navToolsDropdownSearch" placeholder="Search tools...">
                <div class="tools-dropdown-scroll">
                    <div class="tools-group">
                        <div class="tools-group-label">PDF Tools</div>
                        <a href="merge-pdf.html">Merge PDF</a>
                        <a href="compress-pdf.html">Compress PDF</a>
                        <a href="reorder-pdf.html">Reorder PDF Pages</a>
                        <a href="protect-pdf.html">Protect/Unlock PDF</a>
                        <a href="watermark.html">Watermark</a>
                    </div>
                    <div class="tools-group">
                        <div class="tools-group-label">Image Tools</div>
                        <a href="image-resizer.html">Image Resizer</a>
                        <a href="image-rounder.html">Image Rounder</a>
                        <a href="image-blur.html">Image Blur</a>
                        <a href="face-blur.html">Face Blur</a>
                        <a href="color-palette-extractor.html">Color Palette</a>
                        <a href="eyedropper.html">EyeDropper</a>
                        <a href="image-to-base64.html">Image to Base64</a>
                        <a href="exif-reader.html">EXIF Reader</a>
                        <a href="metadata-stripper.html">Metadata Stripper</a>
                        <a href="pixel-art.html">Pixel Art</a>
                        <a href="image-to-json.html">Image to JSON</a>
                        <a href="brightness-map.html">Brightness Map</a>
                        <a href="stereogram.html">Stereogram</a>
                        <a href="steganography.html">Steganography</a>
                        <a href="collage-maker.html">Collage Maker</a>
                        <a href="ocr.html">Image to Text (OCR)</a>
                    </div>
                    <div class="tools-group">
                        <div class="tools-group-label">Video Tools</div>
                        <a href="video-trimmer.html">Video Trimmer</a>
                        <a href="video-frame-extractor.html">Frame Extractor</a>
                        <a href="video-compressor.html">Video Compressor</a>
                        <a href="video-speed.html">Video Speed Changer</a>
                    </div>
                    <div class="tools-group">
                        <div class="tools-group-label">Audio Tools</div>
                        <a href="audio-trimmer.html">Audio Trimmer</a>
                        <a href="audio-merger.html">Audio Merger</a>
                    </div>
                    <div class="tools-group">
                        <div class="tools-group-label">Generate</div>
                        <a href="qr-code-generator.html">QR Code Generator</a>
                        <a href="barcode-generator.html">Barcode Generator</a>
                        <a href="lorem-ipsum.html">Lorem Ipsum Generator</a>
                        <a href="word-counter.html">Word & Character Counter</a>
                    </div>
                    <div class="tools-group">
                        <div class="tools-group-label">Utilities</div>
                        <a href="file-hash-checker.html">File Hash Checker</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</nav>
'@

# Get all HTML files in the current directory
$htmlFiles = Get-ChildItem -Path "." -Filter "*.html" -File

$updatedCount = 0
$skippedCount = 0

foreach ($file in $htmlFiles) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Cyan
    
    try {
        # Read file content with UTF-8 encoding
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        
        # Check if file has a navbar
        if ($content -match '<nav[\s>]') {
            # Pattern to match the entire nav section (both old and new styles)
            # This regex captures from <nav to </nav> including all content
            $navPattern = '(?s)<nav[^>]*>.*?</nav>'
            
            if ($content -match $navPattern) {
                # Replace the navbar
                $newContent = $content -replace $navPattern, $standardNavbar
                
                # Write back with UTF-8 encoding (no BOM)
                $utf8NoBom = New-Object System.Text.UTF8Encoding $false
                [System.IO.File]::WriteAllText($file.FullName, $newContent, $utf8NoBom)
                
                Write-Host "  ✓ Updated navbar in $($file.Name)" -ForegroundColor Green
                $updatedCount++
            } else {
                Write-Host "  ⚠ Could not find navbar pattern in $($file.Name)" -ForegroundColor Yellow
                $skippedCount++
            }
        } else {
            Write-Host "  - No navbar found in $($file.Name)" -ForegroundColor Gray
            $skippedCount++
        }
    }
    catch {
        Write-Host "  ✗ Error processing $($file.Name): $_" -ForegroundColor Red
        $skippedCount++
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Navbar Update Complete!" -ForegroundColor Green
Write-Host "Files updated: $updatedCount" -ForegroundColor Green
Write-Host "Files skipped: $skippedCount" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

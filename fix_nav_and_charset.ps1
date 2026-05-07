Get-ChildItem -Path . -Filter *.html -Recurse -File | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content $file -Raw
    # Ensure UTF-8 meta charset tag
    if (-not ($content -match '<meta\s+charset\s*=\s*"?UTF-8"?\s*/?>')) {
        $content = $content -replace '(?i)(<head>\s*)', '${1}<meta charset="UTF-8">`r`n'
    }
    # Replace broken characters using Unicode code points
    $bullet = [char]0x2022   # •
    $emdash = [char]0x2014   # —
    $content = $content -replace 'â€¢', $bullet -replace 'â€”', $emdash
    # Reorder navbar: Home, Tools, Blog
    $navPattern = '(?s)(<ul[^>]*>\s*<li><a href="index\.html">Home</a></li>\s*)(<li><a href="blog\.html">Blog</a></li>\s*)(<li class="dropdown">.*?</li>\s*)(</ul>)'
    $navReplacement = '${1}${3}${2}${4}'
    $content = $content -replace $navPattern, $navReplacement
    Set-Content -Path $file -Value $content -Encoding UTF8
    Write-Host "Updated: $file"
}
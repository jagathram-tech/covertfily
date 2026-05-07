Get-ChildItem -Path . -Filter *.html -Recurse -File | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content $file -Raw
    # Ensure UTF-8 meta charset tag (if missing)
    if (-not ($content -match '<meta\s+charset\s*=\s*"?UTF-8"?\s*/?>')) {
        $content = $content -replace '(?i)(<head>\s*)', '${1}<meta charset="UTF-8">`r`n'
    }
    # Reorder navbar: Home, Tools, Blog
    $navPattern = '(?s)(<ul[^>]*>\s*<li><a href="index\.html">Home</a></li>\s*)(<li><a href="blog\.html">Blog</a></li>\s*)(<li class="dropdown">.*?</li>\s*)(</ul>)'
    $navReplacement = '${1}${3}${2}${4}'
    $content = $content -replace $navPattern, $navReplacement
    Set-Content -Path $file -Value $content -Encoding UTF8
    Write-Host "Updated: $file"
}
import os, glob, re

footer_content = '''    <footer>
        <div class="footer-grid">
            <div class="footer-brand">
                <div class="logo"><img src="logo.png" alt="Covertfily"></div>
                <p>100% private, browser-based file conversion. No uploads. No tracking. Open source.</p>
            </div>
            <div class="footer-col">
                <h4>Product</h4>
                <ul>
                    <li><a href="index.html">Convert</a></li>
                    <li><a href="image-resizer.html">Image Tools</a></li>
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
                    <li><a href="privacy.html">Privacy Policy</a></li>
                    <li><a href="terms.html">Terms of Use</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 Covertfily. MIT Licensed.</p>
            <div class="footer-social">
                <a href="https://github.com/jagathram-tech/covertfily"><i class="fab fa-github"></i></a>
                <a href="#"><i class="fab fa-twitter"></i></a>
                <a href="#"><i class="fas fa-envelope"></i></a>
            </div>
        </div>
    </footer>'''.encode('utf-8')

files = glob.glob('*.html')
changed = 0
for f in files:
    with open(f, 'rb') as file:
        content = file.read()
    
    if b'<footer' in content:
        new_content = re.sub(b'<footer.*?>.*?</footer>', footer_content, content, flags=re.DOTALL)
    else:
        new_content = content.replace(b'</body>', footer_content + b'\n</body>')
    
    if new_content != content:
        with open(f, 'wb') as file:
            file.write(new_content)
        changed += 1

print(f'Updated {changed} files with Privacy and Terms links and removed Discussions')

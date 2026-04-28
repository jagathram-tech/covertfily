importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js');

self.onmessage = async function(e) {
    const { data, name } = e.data;
    
    try {
        // We need the main pdfjs object here too
        // Since we are in a worker, we might need to load the full library
        importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
        
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        
        const loadingTask = pdfjsLib.getDocument({ data: data });
        const pdf = await loadingTask.promise;
        
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText += textContent.items.map(item => item.str).join(" ") + "\n\n";
            
            // Send progress update
            self.postMessage({ type: 'progress', percent: Math.round((i / pdf.numPages) * 100) });
        }
        
        self.postMessage({ type: 'success', text: fullText });
    } catch (err) {
        self.postMessage({ type: 'error', message: err.message });
    }
};

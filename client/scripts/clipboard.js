// Polyfill for Navigator.clipboard.writeText
if (!navigator.clipboard) {
    navigator.clipboard = {
        writeText: text => {

            // A <span> contains the text to copy
            const span = document.createElement('span');
            span.textContent = text;
            span.style.whiteSpace = 'pre'; // Preserve consecutive spaces and newlines

            // Paint the span outside the viewport
            span.style.position = 'absolute';
            span.style.left = '-9999px';
            span.style.top = '-9999px';

            const win = window;
            const selection = win.getSelection();
            win.document.body.appendChild(span);

            const range = win.document.createRange();
            selection.removeAllRanges();
            range.selectNode(span);
            selection.addRange(range);

            let success = false;
            try {
                success = win.document.execCommand('copy');
            } catch (err) {
                return Promise.error();
            }

            selection.removeAllRanges();
            span.remove();

            return Promise.resolve();
        }
    }
}
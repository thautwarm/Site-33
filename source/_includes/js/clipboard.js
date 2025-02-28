// Clipboard functionality for code blocks
document.addEventListener('DOMContentLoaded', function() {
  // Find all code copy buttons
  const copyButtons = document.querySelectorAll('.code-copy-button');
  
  // Add click event listener to each button
  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Get the text to copy from the data attribute
      const textToCopy = this.getAttribute('data-clipboard-text');
      
      // Check if Clipboard API is available
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        // Use the Clipboard API to copy the text
        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            // Visual feedback that copy was successful
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="code-copy-icon" style="color: var(--color-success);">✓</span>';
            
            // Reset button after 2 seconds
            setTimeout(() => {
              this.innerHTML = originalText;
            }, 2000);
          })
          .catch(err => {
            console.error('Failed to copy text: ', err);
            
            // Fallback method for older browsers
            fallbackCopyTextToClipboard(textToCopy, this);
          });
      } else {
        // Clipboard API not available, use fallback
        fallbackCopyTextToClipboard(textToCopy, this);
      }
    });
  });
  
  // Fallback method for browsers that don't support the Clipboard API
  function fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        // Visual feedback
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="code-copy-icon" style="color: var(--color-success);">✓</span>';
        
        // Reset button after 2 seconds
        setTimeout(() => {
          button.innerHTML = originalText;
        }, 2000);
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
  }
}); 
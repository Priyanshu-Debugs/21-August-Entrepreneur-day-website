// Certificate Page JavaScript - Simple PNG Download Version

// Initialize certificate when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Certificate page loaded');
    loadCertificateData();
    setupDownloadButton();
    setupShareButton();
    addCertificateAnimations();
});

// Load and display certificate data
function loadCertificateData() {
    const completeData = JSON.parse(localStorage.getItem('completeStudentData'));
    
    if (!completeData) {
        alert('No student data found. Please complete the registration process.');
        window.location.href = 'index.html';
        return;
    }
    
    console.log('Loading certificate data:', completeData);
    
    // Populate certificate with student data
    document.getElementById('cert-name').textContent = completeData.fullName;
    document.getElementById('cert-enrollment').textContent = completeData.enrollmentNumber;
    document.getElementById('cert-semester').textContent = completeData.semester + getSemesterSuffix(completeData.semester);
    document.getElementById('cert-branch').textContent = completeData.branch;
    document.getElementById('cert-pledge-name').textContent = completeData.pledgeName;
    document.getElementById('cert-pledge-text').textContent = `"${completeData.pledgeText}"`;
    document.getElementById('cert-date').textContent = completeData.pledgeDate;
    
    // Store data for sharing
    window.certificateData = completeData;
}

// Get semester suffix
function getSemesterSuffix(semester) {
    const suf = parseInt(semester);
    if (suf === 1) return 'st';
    if (suf === 3) return 'rd';
    return 'th';
}

// Setup download button
function setupDownloadButton() {
    const downloadBtn = document.getElementById('downloadBtn');
    
    if (downloadBtn) {
        console.log('Setting up download button');
        downloadBtn.addEventListener('click', function() {
            console.log('Download button clicked');
            
            // Check if html2canvas is available, if not try to load it
            if (typeof html2canvas === 'undefined') {
                console.log('html2canvas not found, attempting to load...');
                loadHtml2CanvasAndDownload();
            } else {
                downloadCertificate();
            }
        });
    } else {
        console.error('Download button not found!');
    }
}

// Load html2canvas dynamically and then download
function loadHtml2CanvasAndDownload() {
    showLoadingOverlay('Loading required libraries...');
    
    // Try loading from multiple CDNs
    const cdnUrls = [
        'https://html2canvas.hertzen.com/dist/html2canvas.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
        'https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js',
        'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js'
    ];
    
    let currentCdnIndex = 0;
    
    function tryLoadFromCdn() {
        if (currentCdnIndex >= cdnUrls.length) {
            hideLoadingOverlay();
            showManualDownloadOptions();
            return;
        }
        
        const script = document.createElement('script');
        script.src = cdnUrls[currentCdnIndex];
        
        script.onload = function() {
            console.log('html2canvas loaded from:', cdnUrls[currentCdnIndex]);
            hideLoadingOverlay();
            setTimeout(downloadCertificate, 500); // Small delay to ensure library is ready
        };
        
        script.onerror = function() {
            console.log('Failed to load from:', cdnUrls[currentCdnIndex]);
            currentCdnIndex++;
            tryLoadFromCdn();
        };
        
        document.head.appendChild(script);
    }
    
    tryLoadFromCdn();
}

// Show manual download options when html2canvas fails
function showManualDownloadOptions() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2.5rem;
        border-radius: 20px;
        max-width: 600px;
        width: 90%;
        text-align: center;
        color: white;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: popIn 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <div style="margin-bottom: 2rem;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #FFD93D; margin-bottom: 1rem;"></i>
            <h3 style="margin: 0 0 0.5rem 0; color: white;">Certificate Download Options</h3>
            <p style="margin: 0; opacity: 0.9; font-size: 0.9rem;">The automatic download feature is having trouble loading. Here are alternative options:</p>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 15px; margin: 2rem 0;">
            <h4 style="margin: 0 0 1rem 0; color: #FFD93D;">
                <i class="fas fa-lightbulb"></i> Manual Download Methods
            </h4>
            
            <div style="text-align: left; margin: 1rem 0;">
                <p style="margin: 0.5rem 0;"><strong>Method 1 - Screenshot:</strong></p>
                <p style="margin: 0.5rem 0; font-size: 0.9rem; opacity: 0.9;">
                    • Right-click on the certificate above<br>
                    • Select "Save image as..." or "Copy image"<br>
                    • Save as PNG file
                </p>
                
                <p style="margin: 1rem 0 0.5rem 0;"><strong>Method 2 - Browser Print:</strong></p>
                <p style="margin: 0.5rem 0; font-size: 0.9rem; opacity: 0.9;">
                    • Press Ctrl+P (Windows) or Cmd+P (Mac)<br>
                    • Choose "Save as PDF" as destination<br>
                    • Save your certificate
                </p>
                
                <p style="margin: 1rem 0 0.5rem 0;"><strong>Method 3 - Mobile Screenshot:</strong></p>
                <p style="margin: 0.5rem 0; font-size: 0.9rem; opacity: 0.9;">
                    • Take a screenshot of the certificate<br>
                    • Crop and save the image<br>
                    • Share or print as needed
                </p>
            </div>
        </div>
        
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button onclick="window.print()" 
                    style="padding: 0.75rem 1.5rem; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 25px; cursor: pointer; backdrop-filter: blur(10px);">
                <i class="fas fa-print"></i> Print Certificate
            </button>
            <button onclick="tryBasicScreenshot()" 
                    style="padding: 0.75rem 1.5rem; background: linear-gradient(45deg, #FF6B6B, #4ECDC4); color: white; border: none; border-radius: 25px; cursor: pointer; font-weight: 600;">
                <i class="fas fa-camera"></i> Try Basic Capture
            </button>
            <button onclick="this.parentElement.parentElement.parentElement.remove();" 
                    style="padding: 0.75rem 1.5rem; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 25px; cursor: pointer;">
                <i class="fas fa-times"></i> Close
            </button>
        </div>
        
        <div style="margin-top: 2rem; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 10px; font-size: 0.9rem;">
            <p style="margin: 0; opacity: 0.9;">
                <i class="fas fa-info-circle"></i> 
                Don't worry! You can still get your certificate using any of the methods above. 
                Your achievement is just as valid! 🎉
            </p>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Try basic screenshot using different method
function tryBasicScreenshot() {
    if (typeof html2canvas !== 'undefined') {
        downloadCertificate();
        return;
    }
    
    // If still no html2canvas, show instructions
    showToast('📸 Please use right-click "Save image as..." on the certificate above', 'info');
    
    // Close modal
    const modal = document.querySelector('.fadeIn');
    if (modal) modal.remove();
}

// Simple PNG download certificate function
function downloadCertificate() {
    console.log('Starting certificate download...');
    
    // Check if html2canvas is loaded
    if (typeof html2canvas === 'undefined') {
        console.error('html2canvas library not loaded!');
        showErrorMessage('Required library not loaded. Please refresh the page and try again.');
        return;
    }
    
    const certificate = document.getElementById('certificate');
    
    if (!certificate) {
        console.error('Certificate element not found!');
        showErrorMessage('Certificate not found. Please refresh the page.');
        return;
    }
    
    if (!window.certificateData) {
        console.error('Certificate data not found!');
        showErrorMessage('Certificate data missing. Please go back and complete the process again.');
        return;
    }
    
    // Show loading message
    showLoadingOverlay('Generating PNG certificate...');
    
    // Configure html2canvas options for high quality PNG
    const options = {
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        scale: 2, // Reduced from 3 to 2 for better compatibility
        width: certificate.offsetWidth,
        height: certificate.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        logging: true, // Enable logging for debugging
        foreignObjectRendering: false, // Disable for better compatibility
        imageTimeout: 0, // Remove timeout
        removeContainer: false // Keep container
    };
    
    console.log('html2canvas options:', options);
    console.log('Certificate element:', certificate);
    
    html2canvas(certificate, options).then(canvas => {
        console.log('html2canvas successful, canvas:', canvas);
        
        try {
            const fileName = `VGEC_Entrepreneurship_Certificate_${window.certificateData.enrollmentNumber}`;
            
            // Create download link
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png', 1.0);
            link.download = `${fileName}.png`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log('Download triggered successfully');
            hideLoadingOverlay();
            showDownloadSuccess('PNG');
            
        } catch (error) {
            console.error('Error creating download link:', error);
            hideLoadingOverlay();
            showErrorMessage('Error creating download. Please try again.');
        }
        
    }).catch(error => {
        console.error('html2canvas error:', error);
        hideLoadingOverlay();
        showErrorMessage('Error generating certificate. Please try again or refresh the page.');
    });
}

// Show loading overlay
function showLoadingOverlay(message) {
    console.log('Showing loading overlay:', message);
    
    // Remove existing overlay if any
    const existingOverlay = document.getElementById('loadingOverlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        color: white;
        font-family: 'Poppins', sans-serif;
    `;
    
    overlay.innerHTML = `
        <div style="text-align: center;">
            <div style="margin-bottom: 2rem;">
                <i class="fas fa-cog fa-spin" style="font-size: 4rem; color: #4ECDC4;"></i>
            </div>
            <h3 style="margin: 0 0 1rem 0; font-size: 1.5rem;">${message}</h3>
            <div style="width: 300px; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; overflow: hidden;">
                <div style="width: 100%; height: 100%; background: linear-gradient(45deg, #FF6B6B, #4ECDC4); animation: pulse 2s infinite;"></div>
            </div>
            <p style="margin: 1rem 0 0 0; opacity: 0.8; font-size: 0.9rem;">Please wait while we generate your certificate...</p>
        </div>
    `;
    
    document.body.appendChild(overlay);
}

// Hide loading overlay
function hideLoadingOverlay() {
    console.log('Hiding loading overlay');
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.remove();
    }
}

// Setup share button
function setupShareButton() {
    const shareBtn = document.getElementById('shareBtn');
    
    shareBtn.addEventListener('click', function() {
        shareCertificate();
    });
}

// Share certificate
function shareCertificate() {
    const certificate = document.getElementById('certificate');
    const shareBtn = document.getElementById('shareBtn');
    
    // Show loading state
    shareBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
    shareBtn.disabled = true;
    
    const options = {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: certificate.offsetWidth,
        height: certificate.offsetHeight
    };
    
    html2canvas(certificate, options).then(canvas => {
        canvas.toBlob(blob => {
            const data = window.certificateData;
            const shareText = `🎉 I have successfully taken the ${data.pledgeName} at VGEC E-Cell! 
            
✨ Name: ${data.fullName}
🎓 Enrollment: ${data.enrollmentNumber}
📚 ${data.semester}${getSemesterSuffix(data.semester)} Semester, ${data.branch}
📅 Date: ${data.pledgeDate}

#VGECECell #Entrepreneurship #Innovation #VGEC`;
            
            // Check if Web Share API is supported
            if (navigator.share) {
                const shareData = {
                    title: 'VGEC E-Cell Entrepreneurship Certificate',
                    text: shareText,
                    files: [new File([blob], `VGEC_Certificate_${data.enrollmentNumber}.png`, { type: 'image/png' })]
                };
                
                navigator.share(shareData)
                    .then(() => {
                        console.log('Certificate shared successfully');
                        showShareSuccess();
                    })
                    .catch(err => {
                        console.log('Error sharing certificate:', err);
                        fallbackShare(shareText, blob);
                    });
            } else {
                // Fallback for browsers that don't support Web Share API
                fallbackShare(shareText, blob);
            }
            
            // Reset button
            shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> Share Certificate';
            shareBtn.disabled = false;
            
        }, 'image/png', 1.0);
        
    }).catch(error => {
        console.error('Error generating certificate for sharing:', error);
        
        // Reset button
        shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> Share Certificate';
        shareBtn.disabled = false;
        
        alert('Error preparing certificate for sharing. Please try again.');
    });
}

// Fallback share method
function fallbackShare(text, blob) {
    // Create a temporary URL for the image
    const imageUrl = URL.createObjectURL(blob);
    
    // Show share modal with options
    showShareModal(text, imageUrl);
}

// Show share modal
function showShareModal(text, imageUrl) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        animation: popIn 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <h3 style="margin-bottom: 1rem; color: #333;">Share Your Certificate</h3>
        <div style="margin-bottom: 1.5rem;">
            <img src="${imageUrl}" alt="Certificate Preview" style="max-width: 100%; height: 200px; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        </div>
        <div style="margin-bottom: 1.5rem;">
            <textarea readonly style="width: 100%; height: 100px; padding: 0.5rem; border: 1px solid #ddd; border-radius: 8px; resize: none; font-size: 0.9rem;">${text}</textarea>
        </div>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button onclick="copyToClipboard('${text.replace(/'/g, "\\'")}'); this.innerHTML='<i class=\\"fas fa-check\\"></i> Copied!'; this.style.background='#4caf50';" 
                    style="padding: 0.75rem 1.5rem; background: #667eea; color: white; border: none; border-radius: 25px; cursor: pointer; transition: all 0.3s ease;">
                <i class="fas fa-copy"></i> Copy Text
            </button>
            <a href="${imageUrl}" download="VGEC_Certificate.png" 
               style="padding: 0.75rem 1.5rem; background: #ff6b6b; color: white; text-decoration: none; border-radius: 25px; transition: all 0.3s ease;">
                <i class="fas fa-download"></i> Download Image
            </a>
            <button onclick="this.parentElement.parentElement.parentElement.remove();" 
                    style="padding: 0.75rem 1.5rem; background: #999; color: white; border: none; border-radius: 25px; cursor: pointer;">
                <i class="fas fa-times"></i> Close
            </button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    showShareSuccess();
}

// Copy text to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

// Show download success message
function showDownloadSuccess(format = 'PNG') {
    console.log('Showing download success message');
    showToast(`✅ Certificate downloaded successfully as ${format}!`, 'success');
}

// Show error message
function showErrorMessage(message) {
    console.error('Error:', message);
    showToast(`❌ ${message}`, 'error');
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    
    let backgroundColor;
    switch(type) {
        case 'success':
            backgroundColor = 'linear-gradient(45deg, #4caf50, #45a049)';
            break;
        case 'error':
            backgroundColor = 'linear-gradient(45deg, #f44336, #d32f2f)';
            break;
        case 'warning':
            backgroundColor = 'linear-gradient(45deg, #ff9800, #f57c00)';
            break;
        default:
            backgroundColor = 'linear-gradient(45deg, #2196f3, #1976d2)';
    }
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 10002;
        max-width: 350px;
        animation: slideInRight 0.3s ease;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
    `;
    
    toast.innerHTML = message;
    
    document.body.appendChild(toast);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }
    }, 4000);
    
    // Allow manual close by clicking
    toast.addEventListener('click', () => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    });
}

// Show share success message
function showShareSuccess() {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #4caf50, #45a049);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10001;
        animation: slideInRight 0.3s ease;
    `;
    
    toast.innerHTML = `
        <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
        Ready to share!
    `;
    
    document.body.appendChild(toast);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

// Add certificate animations
function addCertificateAnimations() {
    const certificate = document.getElementById('certificate');
    
    // Initial animation
    certificate.style.opacity = '0';
    certificate.style.transform = 'scale(0.9)';
    certificate.style.transition = 'all 0.8s ease';
    
    setTimeout(() => {
        certificate.style.opacity = '1';
        certificate.style.transform = 'scale(1)';
    }, 300);
    
    // Add typing animation to student name
    const studentName = document.getElementById('cert-name');
    const nameText = studentName.textContent;
    studentName.textContent = '';
    
    setTimeout(() => {
        let i = 0;
        const typeInterval = setInterval(() => {
            studentName.textContent += nameText[i];
            i++;
            if (i >= nameText.length) {
                clearInterval(typeInterval);
            }
        }, 100);
    }, 1000);
    
    // Add entrance animations to action buttons
    const actionButtons = document.querySelectorAll('.certificate-actions .btn');
    actionButtons.forEach((button, index) => {
        button.style.opacity = '0';
        button.style.transform = 'translateY(20px)';
        button.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, 1500 + (index * 200));
    });
}

// Add required CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes popIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100px); }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
    }
    
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .certificate-actions .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }
    
    .btn:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }
    
    /* Enhanced button styles for download modal */
    .download-option-btn {
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .download-option-btn:hover {
        transform: translateY(-3px) scale(1.02);
        background: rgba(255,255,255,0.3) !important;
        border-color: rgba(255,255,255,0.5) !important;
    }
    
    .download-option-btn:active {
        transform: translateY(-1px) scale(0.98);
    }
    
    /* Loading animation */
    .fa-cog {
        animation: rotate 2s linear infinite;
    }
    
    /* Certificate hover effect */
    .certificate {
        transition: all 0.3s ease;
    }
    
    .certificate:hover {
        transform: scale(1.02);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    
    /* Print styles for certificate */
    @media print {
        body * {
            visibility: hidden;
        }
        .certificate, .certificate * {
            visibility: visible;
        }
        .certificate {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            transform: none !important;
            box-shadow: none !important;
        }
        .certificate-actions {
            display: none !important;
        }
        #loadingOverlay {
            display: none !important;
        }
    }
    
    /* Mobile responsiveness for download modal */
    @media (max-width: 768px) {
        .download-modal-content {
            width: 95% !important;
            padding: 1.5rem !important;
        }
        
        .download-options-grid {
            grid-template-columns: 1fr !important;
            gap: 0.8rem !important;
        }
        
        .download-option-btn {
            padding: 0.8rem !important;
            font-size: 0.9rem !important;
        }
    }
    
    /* High contrast mode support */
    @media (prefers-contrast: high) {
        .certificate {
            border: 2px solid #000;
        }
        
        .download-option-btn {
            border: 2px solid #fff !important;
        }
    }
    
    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
        
        .certificate:hover {
            transform: none;
        }
    }
`;
document.head.appendChild(style);

// Add print functionality
function printCertificate() {
    window.print();
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S for download PNG
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        downloadCertificate();
    }
    
    // Ctrl/Cmd + Shift + S for share
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        shareCertificate();
    }
    
    // Ctrl/Cmd + P for print
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        printCertificate();
    }
});

// Add error boundary for debugging
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    console.error('Error message:', e.message);
    console.error('Error source:', e.filename, 'Line:', e.lineno);
});

// Log when the script is fully loaded
console.log('Certificate.js loaded successfully');

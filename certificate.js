// Certificate Page JavaScript

// Initialize certificate when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
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
    
    downloadBtn.addEventListener('click', function() {
        downloadCertificate();
    });
}

// Download certificate as image
function downloadCertificate() {
    const certificate = document.getElementById('certificate');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // Show loading state
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    downloadBtn.disabled = true;
    
    // Configure html2canvas options for better quality
    const options = {
        backgroundColor: '#ffffff',
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        width: certificate.offsetWidth,
        height: certificate.offsetHeight,
        scrollX: 0,
        scrollY: 0
    };
    
    html2canvas(certificate, options).then(canvas => {
        // Create download link
        const link = document.createElement('a');
        link.download = `VGEC_Entrepreneurship_Certificate_${window.certificateData.enrollmentNumber}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Reset button
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Certificate';
        downloadBtn.disabled = false;
        
        // Show success message
        showDownloadSuccess();
        
    }).catch(error => {
        console.error('Error generating certificate:', error);
        
        // Reset button
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Certificate';
        downloadBtn.disabled = false;
        
        // Show error message
        alert('Error generating certificate. Please try again.');
    });
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
function showDownloadSuccess() {
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
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
    
    .certificate-actions .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }
    
    .btn:disabled {
        cursor: not-allowed;
        opacity: 0.7;
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
        }
        .certificate-actions {
            display: none !important;
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
    // Ctrl/Cmd + S for download
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

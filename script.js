// Main JavaScript file for the E-cell website

// Student data storage
let studentData = {};

// Add contact number and email to studentData on form submit
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('studentForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value.trim();
            const enrollmentNumber = document.getElementById('enrollmentNumber').value.trim();
            const contactNumber = document.getElementById('contactNumber').value.trim();
            const email = document.getElementById('email').value.trim();
            const semester = document.getElementById('semester').value;
            const branch = document.getElementById('branch').value;

            studentData = {
                fullName,
                enrollmentNumber,
                contactNumber,
                email,
                semester,
                branch
            };
            localStorage.setItem('studentData', JSON.stringify(studentData));
            window.location.href = 'pledge-selection.html';
        });
    }
});

// Scroll to form function
function scrollToForm() {
    document.getElementById('pledge-form-section').scrollIntoView({
        behavior: 'smooth'
    });
}

// Learn more function
function learnMore() {
    alert('Welcome to VGEC E-Cell! We are dedicated to fostering entrepreneurship and innovation among students. Join us in our mission to create the next generation of successful entrepreneurs.');
}

// Real-time enrollment number validation
function validateEnrollmentNumber(input) {
    // Remove any non-digit characters
    input.value = input.value.replace(/\D/g, '');
    
    // Remove existing validation indicators
    const existingIndicator = input.parentElement.querySelector('.validation-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Create validation indicator
    const indicator = document.createElement('div');
    indicator.className = 'validation-indicator';
    indicator.style.cssText = `
        margin-top: 0.5rem;
        font-size: 0.9rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    if (input.value.length === 0) {
        // No input yet
        return;
    } else if (input.value.length < 12) {
        // Too short
        indicator.style.color = '#ff6b6b';
        indicator.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${input.value.length}/12 digits - Please enter ${12 - input.value.length} more digit(s)</span>
        `;
        input.style.borderColor = '#ff6b6b';
    } else if (input.value.length === 12) {
        // Perfect
        indicator.style.color = '#4ecdc4';
        indicator.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Perfect! 12 digits entered</span>
        `;
        input.style.borderColor = '#4ecdc4';
    }
    
    input.parentElement.appendChild(indicator);
}

// Form validation and submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('studentForm');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            studentData = {
                fullName: formData.get('fullName'),
                enrollmentNumber: formData.get('enrollmentNumber'),
                semester: formData.get('semester'),
                branch: formData.get('branch')
            };
            
            // Validate form
            if (!validateForm(studentData)) {
                return;
            }
            
            // Show loading animation for duplicate check
            showLoadingMessage('Checking enrollment number...');
            
            // Check for duplicate enrollment number
            try {
                const googleSheets = new GoogleSheetsIntegration();
                const duplicateCheck = await googleSheets.checkDuplicateEnrollment(studentData.enrollmentNumber);
                
                hideLoading();
                
                if (duplicateCheck.isDuplicate) {
                    showDuplicateError(duplicateCheck);
                    return;
                }
                
            } catch (error) {
                console.warn('Could not check for duplicates:', error);
                hideLoading();
                // Continue with registration if duplicate check fails
            }
            
            // Store data in localStorage
            localStorage.setItem('studentData', JSON.stringify(studentData));
            
            // Show loading animation
            showLoading();
            
            // Send data to Google Sheets (if configured)
            sendToGoogleSheets(studentData);
            
            // Redirect to pledge selection page
            setTimeout(() => {
                window.location.href = 'pledge-selection.html';
            }, 2000);
        });
    }
});

// Send data to Google Sheets
async function sendToGoogleSheets(data) {
    try {
        const googleSheets = new GoogleSheetsIntegration();
        await googleSheets.addRegistration(data);
        console.log('Registration data sent to Google Sheets successfully');
    } catch (error) {
        console.error('Error sending data to Google Sheets:', error);
        // Data is still saved locally, so the process can continue
    }
}

// Form validation
function validateForm(data) {
    // Check if all fields are filled
    if (!data.fullName || !data.enrollmentNumber || !data.semester || !data.branch) {
        showError('Please fill in all fields');
        return false;
    }
    
    // Validate name (should contain only letters and spaces)
    if (!/^[a-zA-Z\s]+$/.test(data.fullName.trim())) {
        showError('Please enter a valid name (letters and spaces only)');
        return false;
    }
    
    // Validate enrollment number (should be exactly 12 digits)
    if (!/^\d{12}$/.test(data.enrollmentNumber)) {
        showError('Enrollment number must be exactly 12 digits');
        return false;
    }
    
    return true;
}

// Show error message
function showError(message) {
    // Remove existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: #ffebee;
        color: #c62828;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
        border-left: 4px solid #f44336;
        box-shadow: 0 2px 10px rgba(244, 67, 54, 0.1);
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle" style="margin-right: 0.5rem;"></i>
        ${message}
    `;
    
    // Insert before the form
    const form = document.getElementById('studentForm');
    if (form && form.parentNode) {
        form.parentNode.insertBefore(errorDiv, form);
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Show loading animation
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loadingAnimation';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(102, 126, 234, 0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-family: 'Poppins', sans-serif;
    `;
    
    loadingDiv.innerHTML = `
        <div style="text-align: center;">
            <div style="margin-bottom: 2rem;">
                <i class="fas fa-rocket" style="font-size: 4rem; animation: bounce 2s infinite;"></i>
            </div>
            <h3 style="margin-bottom: 1rem;">Processing Registration...</h3>
            <div style="width: 200px; height: 4px; background: rgba(255, 255, 255, 0.3); border-radius: 2px; margin: 0 auto;">
                <div style="width: 100%; height: 100%; background: linear-gradient(45deg, #ff6b6b, #feca57); border-radius: 2px; animation: loading 2s infinite;"></div>
            </div>
            <p style="margin-top: 1rem; opacity: 0.9;">Please wait while we save your information...</p>
        </div>
    `;
    
    document.body.appendChild(loadingDiv);
}

// Show duplicate enrollment error
function showDuplicateError(duplicateInfo) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'duplicate-error-popup';
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ff4757, #ff3838);
        color: white;
        padding: 2.5rem;
        border-radius: 20px;
        box-shadow: 0 15px 40px rgba(255, 71, 87, 0.4);
        z-index: 10001;
        text-align: center;
        max-width: 500px;
        width: 90%;
        animation: shakeIn 0.6s ease;
        backdrop-filter: blur(10px);
    `;
    
    const sourceText = duplicateInfo.source === 'local' ? 'locally' : 'in our records';
    const existingData = duplicateInfo.data;
    
    errorDiv.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #FFD93D; margin-bottom: 1rem;"></i>
            <h3 style="margin: 0; font-size: 1.5rem;">Enrollment Already Registered!</h3>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 15px; margin: 1.5rem 0; text-align: left;">
            <h4 style="margin: 0 0 1rem 0; color: #FFD93D; text-align: center;">
                <i class="fas fa-user"></i> Existing Registration Found
            </h4>
            <p style="margin: 0.5rem 0;"><strong>Name:</strong> ${existingData.fullName}</p>
            <p style="margin: 0.5rem 0;"><strong>Enrollment:</strong> ${existingData.enrollmentNumber}</p>
            ${existingData.semester ? `<p style="margin: 0.5rem 0;"><strong>Semester:</strong> ${existingData.semester}</p>` : ''}
            ${existingData.branch ? `<p style="margin: 0.5rem 0;"><strong>Branch:</strong> ${existingData.branch}</p>` : ''}
            ${existingData.pledgeName ? `<p style="margin: 0.5rem 0;"><strong>Pledge:</strong> ${existingData.pledgeName}</p>` : ''}
            <p style="margin: 0.5rem 0;"><strong>Registered:</strong> ${existingData.submissionDate || 'Previously'}</p>
        </div>
        
        <div style="color: rgba(255,255,255,0.9); margin: 1.5rem 0; font-size: 0.9rem;">
            <p style="margin: 0.5rem 0;">
                <i class="fas fa-info-circle"></i> 
                This enrollment number was found ${sourceText}. Each student can only register once.
            </p>
            <p style="margin: 0.5rem 0;">
                <i class="fas fa-shield-alt"></i> 
                This prevents duplicate certificates and maintains data integrity.
            </p>
        </div>
        
        <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
            <button onclick="this.parentElement.parentElement.parentElement.remove(); if(document.querySelector('.backdrop-overlay')) document.querySelector('.backdrop-overlay').remove();" 
                    style="padding: 0.75rem 2rem; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 25px; cursor: pointer; transition: all 0.3s ease; backdrop-filter: blur(5px);">
                <i class="fas fa-times"></i> Close
            </button>
            <button onclick="location.reload();" 
                    style="padding: 0.75rem 2rem; background: linear-gradient(45deg, #4ECDC4, #44A08D); color: white; border: none; border-radius: 25px; cursor: pointer; font-weight: 600;">
                <i class="fas fa-refresh"></i> Try Different Enrollment
            </button>
        </div>
    `;
    
    // Add backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'backdrop-overlay';
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(backdrop);
    document.body.appendChild(errorDiv);
    
    // Close on backdrop click
    backdrop.addEventListener('click', function() {
        if (backdrop.parentNode) backdrop.remove();
        if (errorDiv.parentNode) errorDiv.remove();
    });
}

// Enhanced loading message function
function showLoadingMessage(message = 'Processing...') {
    const existingLoader = document.getElementById('loading-overlay');
    if (existingLoader) {
        const messageEl = existingLoader.querySelector('.loading-message');
        if (messageEl) {
            messageEl.textContent = message;
        }
        return;
    }
    
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-overlay';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10002;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    
    loadingDiv.innerHTML = `
        <div style="text-align: center; color: white;">
            <div style="margin-bottom: 2rem;">
                <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #4ECDC4;"></i>
            </div>
            <h3 class="loading-message" style="margin: 0; font-size: 1.2rem;">${message}</h3>
            <div style="width: 200px; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; margin: 1rem auto; overflow: hidden;">
                <div style="width: 100%; height: 100%; background: linear-gradient(45deg, #4ECDC4, #44A08D); animation: slide 2s infinite;"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(loadingDiv);
}

// Hide loading overlay
function hideLoading() {
    const loadingDiv = document.getElementById('loading-overlay');
    if (loadingDiv && loadingDiv.parentNode) {
        loadingDiv.remove();
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes shakeIn {
        0% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.8) rotate(-5deg);
        }
        50% { 
            transform: translate(-50%, -50%) scale(1.05) rotate(2deg);
        }
        100% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
        }
    }
    
    @keyframes slide {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-20px); }
        60% { transform: translateY(-10px); }
    }
    
    @keyframes loading {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(0); }
        100% { transform: translateX(100%); }
    }
    
    .error-message {
        animation: slideIn 0.3s ease;
    }
    
    .duplicate-error-popup button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
`;
document.head.appendChild(style);

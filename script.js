// Main JavaScript file for the E-cell website

// Student data storage
let studentData = {};

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

// Form validation and submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('studentForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
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
            
            // Store data in localStorage
            localStorage.setItem('studentData', JSON.stringify(studentData));
            
            // Show loading animation
            showLoading();
            
            // Send data to Google Sheets (if configured)
            sendToGoogleSheets(studentData);
            
            // Redirect to pledge selection page
            setTimeout(() => {
                window.location.href = 'pledge-selection.html';
            }, 1500);
        });
    }
});

// Form validation
function validateForm(data) {
    const { fullName, enrollmentNumber, semester, branch } = data;
    
    if (!fullName.trim()) {
        showError('Please enter your full name');
        return false;
    }
    
    if (!enrollmentNumber.trim()) {
        showError('Please enter your enrollment number');
        return false;
    }
    
    if (!semester) {
        showError('Please select your semester');
        return false;
    }
    
    if (!branch) {
        showError('Please select your branch');
        return false;
    }
    
    // Validate enrollment number format (basic validation)
    if (enrollmentNumber.length < 6) {
        showError('Please enter a valid enrollment number');
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
        border-left: 4px solid #c62828;
        animation: slideIn 0.3s ease;
    `;
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span style="margin-left: 0.5rem;">${message}</span>
    `;
    
    // Insert error message before the form
    const form = document.getElementById('studentForm');
    form.parentNode.insertBefore(errorDiv, form);
    
    // Remove error message after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Show loading animation
function showLoading() {
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            Processing...
        `;
        submitBtn.disabled = true;
    }
}

// Send data to Google Sheets
function sendToGoogleSheets(data) {
    // Load Google Sheets integration if not already loaded
    if (typeof googleSheets === 'undefined') {
        // Load the integration script dynamically
        const script = document.createElement('script');
        script.src = 'google-sheets-integration.js';
        script.onload = () => {
            googleSheets.sendRegistrationData(data);
        };
        document.head.appendChild(script);
    } else {
        googleSheets.sendRegistrationData(data);
    }
    
    console.log('Student data sent to Google Sheets integration:', data);
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add scroll animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    const animatedElements = document.querySelectorAll('.form-container, .pledge-card, .certificate');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', addScrollAnimations);

// Add floating animation to hero icons
document.addEventListener('DOMContentLoaded', function() {
    const floatingIcons = document.querySelectorAll('.floating-icons i');
    
    floatingIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.2}s`;
        
        // Add click interaction
        icon.addEventListener('click', function() {
            this.style.transform = 'scale(1.2) rotate(360deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 500);
        });
    });
});

// Add form field focus effects
document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('input, select');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
});

// Add success message for form submission
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message-popup';
    successDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #4caf50, #45a049);
        color: white;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        text-align: center;
        animation: popIn 0.5s ease;
    `;
    successDiv.innerHTML = `
        <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
        <h3 style="margin-bottom: 0.5rem;">Registration Successful!</h3>
        <p>Redirecting to pledge selection...</p>
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 2000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes popIn {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    .error-message {
        animation: slideIn 0.3s ease;
    }
`;
document.head.appendChild(style);

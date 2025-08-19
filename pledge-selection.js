// Pledge Selection Page JavaScript

// Define pledge data
const pledgeData = {
    innovation: {
        name: "Innovation Pledge",
        text: "I pledge to embrace creativity and innovative thinking, constantly seeking new solutions to existing problems and contributing to technological advancement.",
        icon: "fas fa-lightbulb"
    },
    sustainability: {
        name: "Sustainability Pledge",
        text: "I pledge to build businesses that prioritize environmental sustainability and social responsibility, creating a positive impact on our planet and society.",
        icon: "fas fa-leaf"
    },
    leadership: {
        name: "Leadership Pledge",
        text: "I pledge to develop strong leadership qualities, inspire teams, and create opportunities for others while building successful entrepreneurial ventures.",
        icon: "fas fa-crown"
    },
    excellence: {
        name: "Excellence Pledge",
        text: "I pledge to pursue excellence in all my endeavors, continuously learn and improve, and set high standards for quality in my entrepreneurial journey.",
        icon: "fas fa-trophy"
    },
    collaboration: {
        name: "Collaboration Pledge",
        text: "I pledge to foster collaboration, build strong partnerships, and believe in the power of collective effort to achieve entrepreneurial success.",
        icon: "fas fa-handshake"
    }
};

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadStudentData();
    setupPledgeSelection();
    addAnimations();
});

// Load and display student data
function loadStudentData() {
    const studentData = JSON.parse(localStorage.getItem('studentData'));
    
    if (!studentData) {
        // If no student data, redirect back to home
        alert('Please fill out the registration form first.');
        window.location.href = 'index.html';
        return;
    }
    
    // Display student information
    document.getElementById('studentName').textContent = studentData.fullName;
    document.getElementById('studentEnrollment').textContent = studentData.enrollmentNumber;
    document.getElementById('studentSemester').textContent = `${studentData.semester}${getSemesterSuffix(studentData.semester)}`;
    document.getElementById('studentBranch').textContent = studentData.branch;
}

// Get semester suffix (st, nd, rd, th)
function getSemesterSuffix(semester) {
    const suf = parseInt(semester);
    if (suf === 1) return 'st';
    if (suf === 3) return 'rd';
    return 'th';
}

// Setup pledge selection functionality
function setupPledgeSelection() {
    const pledgeButtons = document.querySelectorAll('.select-pledge');
    
    pledgeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const pledgeType = this.getAttribute('data-pledge');
            selectPledge(pledgeType);
        });
    });
}

// Handle pledge selection
function selectPledge(pledgeType) {
    const studentData = JSON.parse(localStorage.getItem('studentData'));
    const selectedPledge = pledgeData[pledgeType];
    
    if (!selectedPledge) {
        alert('Invalid pledge selection. Please try again.');
        return;
    }
    
    // Add pledge data to student data
    const completeData = {
        ...studentData,
        pledgeType: pledgeType,
        pledgeName: selectedPledge.name,
        pledgeText: selectedPledge.text,
        pledgeIcon: selectedPledge.icon,
        pledgeDate: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    };
    
    // Store complete data
    localStorage.setItem('completeStudentData', JSON.stringify(completeData));
    
    // Show selection animation
    showPledgeSelection(pledgeType);
    
    // Send complete data to Google Sheets
    sendCompleteDataToGoogleSheets(completeData);
    
    // Redirect to certificate page
    setTimeout(() => {
        window.location.href = 'certificate.html';
    }, 2000);
}

// Show pledge selection animation
function showPledgeSelection(pledgeType) {
    const selectedCard = document.querySelector(`[data-pledge="${pledgeType}"]`).closest('.pledge-card');
    const allCards = document.querySelectorAll('.pledge-card');
    
    // Dim other cards
    allCards.forEach(card => {
        if (card !== selectedCard) {
            card.style.opacity = '0.3';
            card.style.transform = 'scale(0.95)';
        }
    });
    
    // Highlight selected card
    selectedCard.style.transform = 'scale(1.05)';
    selectedCard.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.3)';
    selectedCard.style.border = '3px solid #667eea';
    
    // Change button text and disable
    const button = selectedCard.querySelector('.select-pledge');
    button.innerHTML = '<i class="fas fa-check"></i> Selected!';
    button.style.background = 'linear-gradient(45deg, #4caf50, #45a049)';
    button.disabled = true;
    
    // Show success message
    showPledgeSuccessMessage();
}

// Show success message for pledge selection
function showPledgeSuccessMessage() {
    const successOverlay = document.createElement('div');
    successOverlay.style.cssText = `
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
        animation: fadeIn 0.5s ease;
    `;
    
    const successMessage = document.createElement('div');
    successMessage.style.cssText = `
        background: white;
        padding: 3rem;
        border-radius: 20px;
        text-align: center;
        max-width: 400px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        animation: popIn 0.5s ease;
    `;
    
    successMessage.innerHTML = `
        <div style="color: #4caf50; font-size: 4rem; margin-bottom: 1rem;">
            <i class="fas fa-check-circle"></i>
        </div>
        <h3 style="color: #333; margin-bottom: 1rem;">Pledge Selected!</h3>
        <p style="color: #666; margin-bottom: 1.5rem;">
            Thank you for making your commitment to entrepreneurship.
        </p>
        <div style="color: #667eea;">
            <i class="fas fa-certificate" style="margin-right: 0.5rem;"></i>
            Generating your certificate...
        </div>
    `;
    
    successOverlay.appendChild(successMessage);
    document.body.appendChild(successOverlay);
    
    // Remove after 2 seconds
    setTimeout(() => {
        if (successOverlay.parentNode) {
            successOverlay.remove();
        }
    }, 2000);
}

// Send complete data to Google Sheets
function sendCompleteDataToGoogleSheets(data) {
    // Load Google Sheets integration if not already loaded
    if (typeof googleSheets === 'undefined') {
        // Load the integration script dynamically
        const script = document.createElement('script');
        script.src = 'google-sheets-integration.js';
        script.onload = () => {
            googleSheets.sendPledgeData(data);
        };
        document.head.appendChild(script);
    } else {
        googleSheets.sendPledgeData(data);
    }
    
    console.log('Complete student data sent to Google Sheets integration:', data);
}

// Add animations to pledge cards
function addAnimations() {
    const pledgeCards = document.querySelectorAll('.pledge-card');
    
    // Stagger animation for cards
    pledgeCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Add hover effects
    pledgeCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
}

// Add floating animation to pledge icons
document.addEventListener('DOMContentLoaded', function() {
    const pledgeIcons = document.querySelectorAll('.pledge-icon i');
    
    pledgeIcons.forEach((icon, index) => {
        icon.style.animation = `iconFloat 3s ease-in-out infinite`;
        icon.style.animationDelay = `${index * 0.5}s`;
    });
});

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
    
    @keyframes iconFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(10deg); }
    }
    
    .pledge-card {
        transition: all 0.3s ease;
    }
    
    .pledge-card:hover {
        transform: translateY(-5px);
    }
    
    .select-pledge:disabled {
        cursor: not-allowed;
        opacity: 1;
    }
    
    .student-details {
        animation: slideInFromTop 0.8s ease;
    }
    
    @keyframes slideInFromTop {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

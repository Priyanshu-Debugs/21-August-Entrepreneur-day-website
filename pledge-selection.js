// Pledge Selection Page JavaScript

// Define the single comprehensive pledge data
const singlePledgeData = {
    name: "World Entrepreneurship Day Pledge",
    text: "I pledge to: (1) think creatively and embrace innovation, (2) learn from failures and never give up, (3) act with honesty and responsibility in all my ideas, (4) support and respect fellow entrepreneurs, and (5) turn challenges into opportunities for growth.",
    fullText: "I pledge to think creatively and embrace innovation. I pledge to learn from failures and never give up. I pledge to act with honesty and responsibility in all my ideas. I pledge to support and respect fellow entrepreneurs. I pledge to turn challenges into opportunities for growth.",
    icon: "fas fa-rocket"
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
    const pledgeButton = document.getElementById('takePledgeBtn');
    
    if (pledgeButton) {
        pledgeButton.addEventListener('click', function() {
            takePledge();
        });
    }
}

// Handle taking the pledge
function takePledge() {
    const studentData = JSON.parse(localStorage.getItem('studentData'));
    
    // Add pledge data to student data
    const completeData = {
        ...studentData,
        contactNumber: studentData.contactNumber,
        email: studentData.email,
        pledgeType: "comprehensive",
        pledgeName: singlePledgeData.name,
        pledgeText: singlePledgeData.text,
        pledgeFullText: singlePledgeData.fullText,
        pledgeIcon: singlePledgeData.icon,
        pledgeDate: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    };
    
    // Store complete data
    localStorage.setItem('completeStudentData', JSON.stringify(completeData));
    
    // Show pledge taking animation
    showPledgeTaken();
    
    // Send complete data to Google Sheets
    sendCompleteDataToGoogleSheets(completeData);
    
    // Redirect to certificate page
    setTimeout(() => {
        window.location.href = 'certificate.html';
    }, 3000);
}

// Show pledge taken animation
function showPledgeTaken() {
    const pledgeCard = document.querySelector('.single-pledge');
    const pledgeButton = document.getElementById('takePledgeBtn');
    
    // Update button
    pledgeButton.innerHTML = '<i class="fas fa-check"></i> Pledge Taken Successfully!';
    pledgeButton.style.background = 'linear-gradient(45deg, #4caf50, #45a049)';
    pledgeButton.disabled = true;
    
    // Highlight card
    pledgeCard.style.transform = 'scale(1.02)';
    pledgeCard.style.boxShadow = '0 20px 60px rgba(76, 175, 80, 0.3)';
    pledgeCard.style.border = '3px solid #4caf50';
    
    // Show success overlay
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
        background: linear-gradient(135deg, #4caf50, #45a049);
        color: white;
        padding: 3rem;
        border-radius: 20px;
        text-align: center;
        max-width: 500px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        animation: popIn 0.5s ease;
    `;
    
    successMessage.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 1rem;">
            <i class="fas fa-hand-paper"></i>
        </div>
        <h3 style="margin-bottom: 1rem;">Pledge Taken Successfully!</h3>
        <p style="margin-bottom: 1.5rem; opacity: 0.9;">
            🎉 Congratulations! You have successfully taken the World Entrepreneurship Day Pledge.
            Your commitment to entrepreneurship has been recorded.
        </p>
        <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 10px; margin-bottom: 1.5rem;">
            <p style="margin: 0; font-size: 0.9rem;">
                <i class="fas fa-certificate" style="margin-right: 0.5rem;"></i>
                Generating your personalized certificate...
            </p>
        </div>
        <div style="font-size: 0.9rem; opacity: 0.8;">
            <i class="fas fa-clock" style="margin-right: 0.5rem;"></i>
            Please wait while we prepare your certificate
        </div>
    `;
    
    successOverlay.appendChild(successMessage);
    document.body.appendChild(successOverlay);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (successOverlay.parentNode) {
            successOverlay.remove();
        }
    }, 3000);
}

// Send complete data to Google Sheets
function sendCompleteDataToGoogleSheets(data) {
    // Load Google Sheets integration if not already loaded
    if (typeof googleSheets !== 'undefined') {
        try {
            googleSheets.sendPledgeData(data);
        } catch (error) {
            console.log('Google Sheets integration error:', error);
        }
    }
    
    console.log('Complete student data prepared for Google Sheets:', data);
}

// Add animations to the pledge card
function addAnimations() {
    const pledgeCard = document.querySelector('.single-pledge');
    const pledgePoints = document.querySelectorAll('.pledge-point');
    
    if (pledgeCard) {
        // Initial card animation
        pledgeCard.style.opacity = '0';
        pledgeCard.style.transform = 'translateY(30px)';
        pledgeCard.style.transition = 'all 0.8s ease';
        
        setTimeout(() => {
            pledgeCard.style.opacity = '1';
            pledgeCard.style.transform = 'translateY(0)';
        }, 300);
        
        // Animate pledge points
        pledgePoints.forEach((point, index) => {
            point.style.opacity = '0';
            point.style.transform = 'translateX(-20px)';
            point.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                point.style.opacity = '1';
                point.style.transform = 'translateX(0)';
            }, 800 + (index * 200));
        });
    }
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
    
    @keyframes iconFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(5deg); }
    }
    
    .single-pledge {
        transition: all 0.3s ease;
    }
    
    .single-pledge:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 40px rgba(102, 126, 234, 0.2);
    }
    
    .pledge-point {
        transition: all 0.3s ease;
    }
    
    .pledge-point:hover {
        transform: translateX(5px);
    }
    
    .point-number {
        transition: all 0.3s ease;
    }
    
    .pledge-point:hover .point-number {
        transform: scale(1.1);
        background: linear-gradient(45deg, #667eea, #764ba2);
    }
    
    .btn-large:disabled {
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
    
    .pledge-icon i {
        animation: iconFloat 3s ease-in-out infinite;
    }
`;
document.head.appendChild(style);

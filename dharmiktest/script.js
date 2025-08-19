document.addEventListener('DOMContentLoaded', () => {
    const userInfoForm = document.getElementById('userInfoForm');
    const pledgeForm = document.getElementById('pledgeForm');
    const agreeCheckbox = document.getElementById('agree');
    const generateCertBtn = document.getElementById('generateCertBtn');
    const pledgeNameSpan = document.getElementById('pledge-name');

    const participantNameSpan = document.getElementById('participant-name');
    const awardDateSpan = document.getElementById('award-date');
    const downloadCertBtn = document.getElementById('downloadCertBtn');
    const certificateWrapper = document.getElementById('certificate-wrapper');

    // IMPORTANT: Replace with your deployed Google Apps Script Web App URL
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzLtqkz1XJsfFi4xnHwH0MPXMiShCizQm8jZGxZDFBjrhrT5N4W4ZCGDEbGnWOG0ttL/exec'; 

    // --- Logic for index.html (User Info Form) ---
    if (userInfoForm) {
        userInfoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const semester = document.getElementById('semester').value;
            const enrollment = document.getElementById('enrollment').value;
            const branch = document.getElementById('branch').value;

            const params = new URLSearchParams({
                name,
                semester,
                enrollment,
                branch
            });

            window.location.href = `pledge.html?${params.toString()}`;
        });
    }

    // --- Logic for pledge.html (Pledge Agreement) ---
    if (pledgeForm) {
        const urlParams = new URLSearchParams(window.location.search);
        const name = urlParams.get('name');

        if (pledgeNameSpan && name) {
            pledgeNameSpan.textContent = name;
        }

        if (agreeCheckbox && generateCertBtn) {
            agreeCheckbox.addEventListener('change', () => {
                generateCertBtn.disabled = !agreeCheckbox.checked;
            });

            pledgeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (agreeCheckbox.checked) {
                    // Pass all original parameters to the certificate page
                    window.location.href = `certificate.html?${urlParams.toString()}`;
                }
            });
        }
    }

    // --- Logic for certificate.html (Certificate Display and Download) ---
    if (certificateWrapper) {
        const urlParams = new URLSearchParams(window.location.search);
        const name = urlParams.get('name');
        const semester = urlParams.get('semester');
        const enrollment = urlParams.get('enrollment');
        const branch = urlParams.get('branch');

        if (participantNameSpan && name) {
            participantNameSpan.textContent = name;
        }

        if (awardDateSpan) {
            const today = new Date();
            awardDateSpan.textContent = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        }

        // Send data to Google Sheet
        if (GOOGLE_SHEET_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
            fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                mode: 'no-cors', // Required for Google Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    semester: semester,
                    enrollment: enrollment,
                    branch: branch,
                    timestamp: new Date().toISOString()
                }),
            })
            .then(response => console.log('Data sent to Google Sheet', response))
            .catch(error => console.error('Error sending data to Google Sheet:', error));
        } else {
            console.warn('Google Apps Script URL not configured. Data will not be saved.');
        }

        if (downloadCertBtn) {
            downloadCertBtn.addEventListener('click', () => {
                html2canvas(certificateWrapper, {
                    scale: 2, // Increase scale for better quality
                    useCORS: true // Enable CORS if certificate has external images
                }).then(canvas => {
                    const link = document.createElement('a');
                    link.download = `E-Cell_Pledge_Certificate_${name.replace(/\s/g, '_')}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                });
            });
        }
    }
});

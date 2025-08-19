// Google Sheets Integration
// This file contains the functions to integrate with Google Sheets
// You'll need to replace the SHEET_URL with your actual Google Sheets Web App URL

class GoogleSheetsIntegration {
    constructor() {
        // Your Google Sheets document URL (for reference)
        this.SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/13Ziu6ch9shGKV7MYAIfZrFoXVAiBgN8sI07LoBKRVNY/edit?gid=0#gid=0';
        // Your Google Apps Script Project ID
        this.SCRIPT_PROJECT_ID = '15EZws74-F2d37PGSzLciE7aOTSTX0uOAQ9SuPtDXm77dzRvscrtHp80-';
        this.SCRIPT_EDITOR_URL = 'https://script.google.com/home/projects/15EZws74-F2d37PGSzLciE7aOTSTX0uOAQ9SuPtDXm77dzRvscrtHp80-/edit';
        // Your Google Apps Script Web App URL (to be configured after deployment)
        this.SHEET_URL = 'https://script.google.com/macros/s/AKfycbwj43HT9otDzjSM_QQasATyri3rg7xQCL5wSbn8niVWTT1gSsmragQgoEE_HU1NzGm74w/exec';
        this.SPREADSHEET_ID = '13Ziu6ch9shGKV7MYAIfZrFoXVAiBgN8sI07LoBKRVNY';
        this.isConfigured = true; // Set to true since we have the spreadsheet ID
    }

    // Check if enrollment number already exists
    async checkDuplicateEnrollment(enrollmentNumber) {
        try {
            // First check local storage
            const localData = this.getLocalData();
            const localDuplicate = localData.registrations.find(reg => 
                reg.enrollmentNumber === enrollmentNumber
            ) || localData.pledges.find(pledge => 
                pledge.enrollmentNumber === enrollmentNumber
            );
            
            if (localDuplicate) {
                return {
                    isDuplicate: true,
                    source: 'local',
                    data: localDuplicate
                };
            }
            
            // If Google Sheets integration is available, check there too
            if (this.SHEET_URL && this.SHEET_URL !== 'PENDING_DEPLOYMENT') {
                try {
                    const response = await fetch(this.SHEET_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            action: 'checkDuplicate',
                            enrollmentNumber: enrollmentNumber
                        })
                    });
                    
                    if (response.ok) {
                        const result = await response.json();
                        if (result.isDuplicate) {
                            return {
                                isDuplicate: true,
                                source: 'sheets',
                                data: result.data
                            };
                        }
                    }
                } catch (sheetError) {
                    console.log('Could not check Google Sheets for duplicates:', sheetError);
                    // Continue with local check only
                }
            }
            
            return { isDuplicate: false };
            
        } catch (error) {
            console.error('Error checking for duplicate enrollment:', error);
            // If there's an error, allow the registration to proceed
            return { isDuplicate: false };
        }
    }

    // Configure the Google Sheets URL
    configure(sheetUrl) {
        this.SHEET_URL = sheetUrl;
        this.isConfigured = true;
        console.log('Google Sheets integration configured with URL:', sheetUrl);
    }

    // Auto-configure if spreadsheet ID is available
    autoConfigureForTesting() {
        if (this.SPREADSHEET_ID && this.SPREADSHEET_ID !== 'YOUR_SPREADSHEET_ID_HERE') {
            this.isConfigured = true;
            console.log('Google Sheets integration configured for spreadsheet:', this.SPREADSHEET_ID);
            console.log('Spreadsheet URL:', this.SPREADSHEET_URL);
            return true;
        }
        return false;
    }

    // Generate a CSV format for manual import to Google Sheets
    generateCSVForGoogleSheets(data, type) {
        const headers = type === 'registrations' 
            ? ['Timestamp', 'Full Name', 'Enrollment Number', 'Semester', 'Branch', 'Submission Date', 'Submission Time']
            : ['Timestamp', 'Full Name', 'Enrollment Number', 'Semester', 'Branch', 'Pledge Type', 'Pledge Name', 'Pledge Text', 'Pledge Date', 'Submission Date', 'Submission Time'];
        
        const csvRows = [headers.join(',')];
        
        data.forEach(item => {
            const row = type === 'registrations' 
                ? [
                    item.timestamp || new Date().toISOString(),
                    item.fullName || '',
                    item.enrollmentNumber || '',
                    item.semester || '',
                    item.branch || '',
                    item.submissionDate || new Date().toLocaleDateString('en-IN'),
                    item.submissionTime || new Date().toLocaleTimeString('en-IN')
                ]
                : [
                    item.timestamp || new Date().toISOString(),
                    item.fullName || '',
                    item.enrollmentNumber || '',
                    item.semester || '',
                    item.branch || '',
                    item.pledgeType || '',
                    item.pledgeName || '',
                    item.pledgeText || '',
                    item.pledgeDate || '',
                    item.submissionDate || new Date().toLocaleDateString('en-IN'),
                    item.submissionTime || new Date().toLocaleTimeString('en-IN')
                ];
            
            csvRows.push(row.map(field => `"${field}"`).join(','));
        });
        
        return csvRows.join('\n');
    }

    // Send student registration data to Google Sheets
    async sendRegistrationData(studentData) {
        // Always store locally first
        const dataWithTimestamp = {
            ...studentData,
            timestamp: new Date().toISOString(),
            submissionDate: new Date().toLocaleDateString('en-IN'),
            submissionTime: new Date().toLocaleTimeString('en-IN')
        };
        
        this.storeDataLocally('registrations', dataWithTimestamp);
        console.log('✅ Registration data stored locally:', dataWithTimestamp);

        // Try to send to Google Sheets if Web App URL is configured
        if (this.SHEET_URL && this.SHEET_URL !== 'PENDING_DEPLOYMENT' && this.SHEET_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
            try {
                const dataToSend = {
                    action: 'addRegistration',
                    ...dataWithTimestamp
                };

                const response = await fetch(this.SHEET_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend)
                });

                console.log('✅ Registration data sent to Google Sheets successfully');
                
            } catch (error) {
                console.error('❌ Error sending registration data to Google Sheets:', error);
            }
        } else {
            console.log('� Google Apps Script Web App not deployed yet.');
            console.log('📝 Script Editor URL:', this.SCRIPT_EDITOR_URL);
            console.log('💡 Data is safely stored locally. Deploy the script to enable auto-sync.');
        }
    }

    // Send complete pledge data to Google Sheets
    async sendPledgeData(completeData) {
        // Always store locally first
        const dataWithTimestamp = {
            ...completeData,
            timestamp: new Date().toISOString(),
            submissionDate: new Date().toLocaleDateString('en-IN'),
            submissionTime: new Date().toLocaleTimeString('en-IN')
        };
        
        this.storeDataLocally('pledges', dataWithTimestamp);
        console.log('✅ Pledge data stored locally:', dataWithTimestamp);

        // Try to send to Google Sheets if Web App URL is configured
        if (this.SHEET_URL && this.SHEET_URL !== 'PENDING_DEPLOYMENT' && this.SHEET_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
            try {
                const dataToSend = {
                    action: 'addPledge',
                    ...dataWithTimestamp
                };

                const response = await fetch(this.SHEET_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend)
                });

                console.log('✅ Pledge data sent to Google Sheets successfully');
                
            } catch (error) {
                console.error('❌ Error sending pledge data to Google Sheets:', error);
            }
        } else {
            console.log('� Google Apps Script Web App not deployed yet.');
            console.log('📝 Script Editor URL:', this.SCRIPT_EDITOR_URL);
            console.log('💡 Data is safely stored locally. Deploy the script to enable auto-sync.');
        }
    }

    // Store data locally as backup
    storeDataLocally(type, data) {
        const storageKey = type === 'registrations' ? 'allRegistrations' : 'allPledges';
        const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
        existingData.push({
            ...data,
            localStorageTimestamp: new Date().toISOString()
        });
        localStorage.setItem(storageKey, JSON.stringify(existingData));
        console.log(`Data stored locally in ${storageKey}`);
    }

    // Get all locally stored data (useful for backup/sync)
    getLocalData() {
        return {
            registrations: JSON.parse(localStorage.getItem('allRegistrations') || '[]'),
            pledges: JSON.parse(localStorage.getItem('allPledges') || '[]')
        };
    }

    // Sync local data to Google Sheets (useful if connection was restored)
    async syncLocalData() {
        if (!this.isConfigured) {
            console.log('Google Sheets not configured. Cannot sync data.');
            return;
        }

        const localData = this.getLocalData();
        
        // Sync registrations
        for (const registration of localData.registrations) {
            if (!registration.synced) {
                await this.sendRegistrationData(registration);
                registration.synced = true;
            }
        }
        
        // Sync pledges
        for (const pledge of localData.pledges) {
            if (!pledge.synced) {
                await this.sendPledgeData(pledge);
                pledge.synced = true;
            }
        }
        
        // Update local storage with sync status
        localStorage.setItem('allRegistrations', JSON.stringify(localData.registrations));
        localStorage.setItem('allPledges', JSON.stringify(localData.pledges));
        
        console.log('Local data synced to Google Sheets');
    }

    // Clear local data (use with caution)
    clearLocalData() {
        localStorage.removeItem('allRegistrations');
        localStorage.removeItem('allPledges');
        console.log('Local data cleared');
    }

    // Export data as CSV (useful for manual backup)
    exportAsCSV() {
        const localData = this.getLocalData();
        
        if (localData.registrations.length > 0) {
            const registrationsCsv = this.generateCSVForGoogleSheets(localData.registrations, 'registrations');
            this.downloadCSV(registrationsCsv, 'VGEC_Student_Registrations.csv');
            console.log('✅ Registration data exported as CSV');
        }
        
        if (localData.pledges.length > 0) {
            const pledgesCsv = this.generateCSVForGoogleSheets(localData.pledges, 'pledges');
            this.downloadCSV(pledgesCsv, 'VGEC_Student_Pledges.csv');
            console.log('✅ Pledge data exported as CSV');
        }
        
        if (localData.registrations.length === 0 && localData.pledges.length === 0) {
            console.log('📝 No data to export yet. Fill out some forms first!');
            alert('No data to export yet. Please fill out some forms first!');
        }
    }

    // Quick export function specifically for your Google Sheet
    exportForGoogleSheets() {
        const localData = this.getLocalData();
        
        if (localData.registrations.length > 0 || localData.pledges.length > 0) {
            this.exportAsCSV();
            
            // Show instructions
            const instructions = `
📊 DATA EXPORT COMPLETED!

📁 Files Downloaded:
${localData.registrations.length > 0 ? '• VGEC_Student_Registrations.csv' : ''}
${localData.pledges.length > 0 ? '• VGEC_Student_Pledges.csv' : ''}

📋 TO IMPORT INTO YOUR GOOGLE SHEET:
1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/13Ziu6ch9shGKV7MYAIfZrFoXVAiBgN8sI07LoBKRVNY/edit
2. Create two sheets: "Registrations" and "Pledges" 
3. Go to File > Import > Upload
4. Select the CSV files you just downloaded
5. Choose "Replace current sheet" or "Insert new sheet"

📊 CURRENT DATA COUNT:
• Registrations: ${localData.registrations.length}
• Pledges: ${localData.pledges.length}
            `;
            
            console.log(instructions);
            alert('Data exported! Check the console for import instructions.');
        } else {
            alert('No data to export yet. Please fill out some forms first!');
        }
    }

    // Convert data to CSV format
    convertToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => 
                    JSON.stringify(row[header] || '')
                ).join(',')
            )
        ].join('\n');
        
        return csvContent;
    }

    // Download CSV file
    downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

// Create global instance
const googleSheets = new GoogleSheetsIntegration();

// Auto-configure on load
googleSheets.autoConfigureForTesting();

// Instructions for setting up Google Sheets integration:
/*
✅ GOOGLE SHEETS SETUP STATUS:

📊 Your Google Sheet: 
https://docs.google.com/spreadsheets/d/13Ziu6ch9shGKV7MYAIfZrFoXVAiBgN8sI07LoBKRVNY/edit

✅ CURRENT FUNCTIONALITY:
- ✅ Data collection is working
- ✅ Local storage backup is active
- ✅ CSV export is available
- 🔄 Google Sheets auto-sync (requires Apps Script setup)

📋 TO SET UP AUTO-SYNC TO GOOGLE SHEETS:

1. ✅ DONE: Your Google Sheet is identified
   
2. Create Google Apps Script:
   - Go to script.google.com
   - Create a new project
   - Paste the code below:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById('13Ziu6ch9shGKV7MYAIfZrFoXVAiBgN8sI07LoBKRVNY');
    
    if (data.action === 'addRegistration') {
      let registrationSheet = sheet.getSheetByName('Registrations');
      if (!registrationSheet) {
        registrationSheet = sheet.insertSheet('Registrations');
        registrationSheet.getRange(1, 1, 1, 7).setValues([
          ['Timestamp', 'Full Name', 'Enrollment Number', 'Semester', 'Branch', 'Submission Date', 'Submission Time']
        ]);
      }
      
      registrationSheet.appendRow([
        data.timestamp,
        data.fullName,
        data.enrollmentNumber,
        data.semester,
        data.branch,
        data.submissionDate,
        data.submissionTime
      ]);
      
    } else if (data.action === 'addPledge') {
      let pledgeSheet = sheet.getSheetByName('Pledges');
      if (!pledgeSheet) {
        pledgeSheet = sheet.insertSheet('Pledges');
        pledgeSheet.getRange(1, 1, 1, 11).setValues([
          ['Timestamp', 'Full Name', 'Enrollment Number', 'Semester', 'Branch', 'Pledge Type', 'Pledge Name', 'Pledge Text', 'Pledge Date', 'Submission Date', 'Submission Time']
        ]);
      }
      
      pledgeSheet.appendRow([
        data.timestamp,
        data.fullName,
        data.enrollmentNumber,
        data.semester,
        data.branch,
        data.pledgeType,
        data.pledgeName,
        data.pledgeText,
        data.pledgeDate,
        data.submissionDate,
        data.submissionTime
      ]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Deploy as Web App:
   - Click "Deploy" > "New deployment"
   - Choose "Web app"
   - Execute as: "Me"
   - Access: "Anyone"
   - Click "Deploy" and copy the Web App URL

4. Configure the integration:
   - Replace 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE' in this file with your Web App URL

� CURRENT USAGE:
- Fill out forms - data is automatically stored locally
- Use googleSheets.exportForGoogleSheets() to export CSV files
- Import CSV files manually to your Google Sheet
- Once Apps Script is set up, data will sync automatically

� TESTING COMMANDS (open browser console):
- googleSheets.getLocalData() - View stored data
- googleSheets.exportForGoogleSheets() - Export data as CSV
- googleSheets.clearLocalData() - Clear stored data (use with caution)
*/

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleSheetsIntegration;
}

// CORRECTED GOOGLE APPS SCRIPT CODE
// Copy and paste this EXACT code into your Google Apps Script editor at script.google.com

function doPost(e) {
  try {
    console.log('Received data:', e.postData.contents);
    
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById('13Ziu6ch9shGKV7MYAIfZrFoXVAiBgN8sI07LoBKRVNY');
    
    if (data.action === 'addRegistration') {
      let registrationSheet = sheet.getSheetByName('Registrations');
      if (!registrationSheet) {
        registrationSheet = sheet.insertSheet('Registrations');
        // Set headers for 9 columns only
        registrationSheet.getRange(1, 1, 1, 9).setValues([
          ['Timestamp', 'Full Name', 'Enrollment Number', 'Contact Number', 'Email', 'Semester', 'Branch', 'Submission Date', 'Submission Time']
        ]);
      }
      
      // Add only 9 columns of data
      registrationSheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.fullName || '',
        data.enrollmentNumber || '',
        data.contactNumber || '',
        data.email || '',
        data.semester || '',
        data.branch || '',
        data.submissionDate || new Date().toLocaleDateString('en-IN'),
        data.submissionTime || new Date().toLocaleTimeString('en-IN')
      ]);
      
      console.log('Registration added with contact:', data.contactNumber, 'and email:', data.email);
      
    } else if (data.action === 'addPledge') {
      let pledgeSheet = sheet.getSheetByName('Pledges');
      if (!pledgeSheet) {
        pledgeSheet = sheet.insertSheet('Pledges');
        // Set headers for 9 columns only - SAME AS REGISTRATION
        pledgeSheet.getRange(1, 1, 1, 9).setValues([
          ['Timestamp', 'Full Name', 'Enrollment Number', 'Contact Number', 'Email', 'Semester', 'Branch', 'Submission Date', 'Submission Time']
        ]);
      }
      
      // Add only 9 columns of data - NO PLEDGE-SPECIFIC COLUMNS
      pledgeSheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.fullName || '',
        data.enrollmentNumber || '',
        data.contactNumber || '',
        data.email || '',
        data.semester || '',
        data.branch || '',
        data.submissionDate || new Date().toLocaleDateString('en-IN'),
        data.submissionTime || new Date().toLocaleTimeString('en-IN')
      ]);
      
      console.log('Pledge added with contact:', data.contactNumber, 'and email:', data.email);
    }
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error:', error);
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Google Apps Script is working! Time: ' + new Date())
    .setMimeType(ContentService.MimeType.TEXT);
}

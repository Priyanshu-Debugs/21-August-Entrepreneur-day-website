# 🚨 URGENT FIX: Remove 4 Extra Columns from Google Sheets

## 🔍 **Problem Identified:**
Your Google Apps Script deployment still has the OLD code that includes the 4 pledge columns:
- Pledge Type
- Pledge Name  
- Pledge Text
- Pledge Date

## ✅ **IMMEDIATE SOLUTION:**

### **STEP 1: Update Your Google Apps Script** 🔧

1. **Go to**: https://script.google.com
2. **Open your existing project** (the one with deployment ID: AKfycbx5htgnA-urFIHpy0tUE3bbOmTnTrqEaXYg_5PyZhsBAOciUybHs_idrxL6_ZOMYiUy5Q)
3. **DELETE ALL existing code**
4. **Copy and paste this CORRECTED code**:

```javascript
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
```

### **STEP 2: Save and Re-deploy** 💾

1. **Save the script** (Ctrl+S)
2. **Click "Deploy" → "Manage deployments"**
3. **Click the pencil icon** next to your existing deployment
4. **Change version to "New version"**
5. **Click "Deploy"**
6. **Your Web App URL remains the same**: 
   `https://script.google.com/macros/s/AKfycbx5htgnA-urFIHpy0tUE3bbOmTnTrqEaXYg_5PyZhsBAOciUybHs_idrxL6_ZOMYiUy5Q/exec`

### **STEP 3: Clean Up Your Google Sheet** 🧹

1. **Open your Google Sheet**: https://docs.google.com/spreadsheets/d/13Ziu6ch9shGKV7MYAIfZrFoXVAiBgN8sI07LoBKRVNY/edit
2. **Go to the "Pledges" sheet**
3. **Delete columns J, K, L, M** (the 4 extra pledge columns)
4. **Ensure both sheets have EXACTLY these 9 columns**:
   - A: Timestamp
   - B: Full Name
   - C: Enrollment Number
   - D: Contact Number
   - E: Email
   - F: Semester
   - G: Branch
   - H: Submission Date
   - I: Submission Time

### **STEP 4: Test the Fix** 🧪

1. **Go to**: http://localhost:8000/test-new-deployment.html
2. **Click "Test Data Submission"**
3. **Check your Google Sheet** - should now show only 9 columns
4. **Verify contact number and email are captured**

## 🔍 **What Was Wrong:**

The issue was that your deployed Google Apps Script still contained the old code that was adding 13 columns instead of 9. The website was sending the correct 9-column data, but the Google Apps Script was still structured for the old 13-column format.

## ✅ **After This Fix:**

- ✅ Only 9 columns will be added to both sheets
- ✅ Contact numbers and emails will still be captured
- ✅ No more pledge-specific columns (Pledge Type, Name, Text, Date)
- ✅ Both Registrations and Pledges sheets will have identical structure

## 🚨 **Important:**

**YOU MUST UPDATE THE GOOGLE APPS SCRIPT CODE** - the website configuration is already correct. The problem is in your Google Apps Script deployment, not in your website files.

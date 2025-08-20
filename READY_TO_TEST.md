# ✅ READY TO TEST - Server Running!

## 🚀 **Web Server Status**: ✅ RUNNING on http://localhost:8000

## 📋 **Your Action Items** (in order):

### **1. Update Google Apps Script** (CRITICAL)
1. **Go to**: https://script.google.com
2. **Open your project** with deployment ID: `AKfycbx5htgnA-urFIHpy0tUE3bbOmTnTrqEaXYg_5PyZhsBAOciUybHs_idrxL6_ZOMYiUy5Q`
3. **Replace ALL code** with this corrected version:

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
        registrationSheet.getRange(1, 1, 1, 9).setValues([
          ['Timestamp', 'Full Name', 'Enrollment Number', 'Contact Number', 'Email', 'Semester', 'Branch', 'Submission Date', 'Submission Time']
        ]);
      }
      
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
        pledgeSheet.getRange(1, 1, 1, 9).setValues([
          ['Timestamp', 'Full Name', 'Enrollment Number', 'Contact Number', 'Email', 'Semester', 'Branch', 'Submission Date', 'Submission Time']
        ]);
      }
      
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

4. **Save** (Ctrl+S)
5. **Deploy → Manage deployments → Edit existing → New version → Deploy**

### **2. Test Integration** (after updating script)
1. **Open**: http://localhost:8000/test-new-deployment.html
2. **Click**: "Test Data Submission"
3. **Check console** for success messages
4. **Verify Google Sheet** has only 9 columns

### **3. Test Main Form**
1. **Open**: http://localhost:8000
2. **Fill registration form** with test data
3. **Complete pledge**
4. **Check Google Sheet** for data

### **4. Clean Up Google Sheet** (if needed)
1. **Delete columns J, K, L, M** from existing sheets
2. **Ensure exactly 9 columns** in both Registrations and Pledges

## 🎯 **Expected Result After Fix**:
- ✅ Only 9 columns in both sheets
- ✅ Contact numbers captured (column D)
- ✅ Email addresses captured (column E)
- ❌ No more Pledge Type, Name, Text, Date columns

## 🔍 **What to Look For**:
- **Before fix**: 13 columns in Pledges sheet
- **After fix**: 9 columns in both sheets (identical structure)

## 📞 **Ready to Test!**
Your web server is running at http://localhost:8000
Once you update the Google Apps Script, test immediately!

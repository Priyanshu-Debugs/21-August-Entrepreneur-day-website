# 📊 Google Sheets Integration - Step by Step Setup

## 🔍 DEBUGGING STEPS

### Step 1: Test Local Data Storage

1. **Open your website**: http://localhost:8000
2. **Fill out the form** with test data:
   - Full Name: Test Student
   - Enrollment: 123456789012
   - Contact Number: 9876543210
   - Email: test@example.com
   - Semester: 3rd
   - Branch: Computer Engineering

3. **Submit the form** and complete the pledge

4. **Check console** (F12 → Console):
   ```javascript
   // Run these commands in browser console:
   debugStoredData()
   localStorage.getItem('allRegistrations')
   localStorage.getItem('allPledges')
   ```

5. **Export data manually**:
   ```javascript
   // In browser console:
   googleSheets.exportForGoogleSheets()
   ```

### Step 2: Verify Data Structure

The data should contain these fields:
```javascript
{
  "fullName": "Test Student",
  "enrollmentNumber": "123456789012",
  "contactNumber": "9876543210",
  "email": "test@example.com",
  "semester": "3",
  "branch": "Computer Engineering",
  "timestamp": "2025-08-20T...",
  "submissionDate": "20/8/2025",
  "submissionTime": "..."
}
```

### Step 3: Google Apps Script Setup

1. **Go to**: https://script.google.com
2. **Create new project**
3. **Paste this EXACT code**:

```javascript
function doPost(e) {
  try {
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
        data.timestamp,
        data.fullName,
        data.enrollmentNumber,
        data.contactNumber || '',
        data.email || '',
        data.semester,
        data.branch,
        data.submissionDate,
        data.submissionTime
      ]);
      
    } else if (data.action === 'addPledge') {
      let pledgeSheet = sheet.getSheetByName('Pledges');
      if (!pledgeSheet) {
        pledgeSheet = sheet.insertSheet('Pledges');
        pledgeSheet.getRange(1, 1, 1, 13).setValues([
          ['Timestamp', 'Full Name', 'Enrollment Number', 'Contact Number', 'Email', 'Semester', 'Branch', 'Pledge Type', 'Pledge Name', 'Pledge Text', 'Pledge Date', 'Submission Date', 'Submission Time']
        ]);
      }
      
      pledgeSheet.appendRow([
        data.timestamp,
        data.fullName,
        data.enrollmentNumber,
        data.contactNumber || '',
        data.email || '',
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

function doGet(e) {
  return ContentService.createTextOutput('Google Apps Script is working!')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

### Step 4: Deploy Web App

1. **Click "Deploy" → "New Deployment"**
2. **Type**: Web app
3. **Execute as**: Me (your email)
4. **Who has access**: Anyone
5. **Click "Deploy"**
6. **Copy the Web App URL**

### Step 5: Update Website Configuration

1. **Open**: `google-sheets-integration.js`
2. **Find line**: `this.SHEET_URL = 'https://script.google.com/macros/s/...`
3. **Replace with your Web App URL**

### Step 6: Test Integration

1. **Fill out the form again**
2. **Check browser console** for:
   - "✅ Registration data sent to Google Sheets successfully"
   - "✅ Pledge data sent to Google Sheets successfully"

3. **Check your Google Sheet** for new data

## 🚨 TROUBLESHOOTING

### Issue 1: No Data in Console
- **Problem**: `debugStoredData()` shows empty arrays
- **Solution**: Check browser console for JavaScript errors during form submission

### Issue 2: Data Stored Locally but Not in Google Sheets
- **Problem**: Local storage has data, but Google Sheets is empty
- **Solutions**:
  1. Verify Web App URL is correctly configured
  2. Check Google Apps Script permissions
  3. Test Web App URL directly in browser

### Issue 3: Contact Number/Email Missing from Google Sheets
- **Problem**: Some fields appear, but contact/email are empty
- **Solutions**:
  1. Check if form fields are properly named (`contactNumber`, `email`)
  2. Verify JavaScript is capturing these fields
  3. Check Google Apps Script column mapping

### Issue 4: CORS Errors
- **Problem**: Browser blocks requests to Google Apps Script
- **Solution**: This is normal with `mode: 'no-cors'` - data still reaches Google Sheets

## 📝 MANUAL BACKUP METHOD

If automatic sync fails, you can always export data manually:

1. **Open browser console** on your website
2. **Run**: `googleSheets.exportForGoogleSheets()`
3. **Download the CSV files**
4. **Import to Google Sheets**:
   - File → Import → Upload
   - Select CSV file
   - Choose "Replace current sheet"

## ✅ VERIFICATION CHECKLIST

- [ ] Form captures all fields including contact number and email
- [ ] Data appears in browser console when using `debugStoredData()`
- [ ] Google Apps Script is deployed as Web App
- [ ] Web App URL is configured in `google-sheets-integration.js`
- [ ] Google Sheets has correct column headers
- [ ] Test submission shows success messages in console
- [ ] Data appears in Google Sheets

## ✅ CURRENT CONFIGURATION STATUS

✅ **FULLY CONFIGURED AND READY!**

- **Google Sheet URL**: https://docs.google.com/spreadsheets/d/13Ziu6ch9shGKV7MYAIfZrFoXVAiBgN8sI07LoBKRVNY/edit?gid=52018415#gid=52018415
- **Web App URL**: https://script.google.com/macros/s/AKfycbzrnWnf6a7RjkxsFiw3r973R0Hf5Rqw0F87Xlw-VjsVxBcvd3NbKGPfEagYG3bFB1pWmQ/exec
- **Deployment ID**: AKfycbzrnWnf6a7RjkxsFiw3r973R0Hf5Rqw0F87Xlw-VjsVxBcvd3NbKGPfEagYG3bFB1pWmQ
- **Integration Status**: ✅ Active and configured

## 🔗 QUICK LINKS

- **Your Google Sheet**: https://docs.google.com/spreadsheets/d/13Ziu6ch9shGKV7MYAIfZrFoXVAiBgN8sI07LoBKRVNY/edit?gid=52018415#gid=52018415
- **Google Apps Script**: https://script.google.com
- **Debug Page**: http://localhost:8000/debug.html
- **Main Website**: http://localhost:8000

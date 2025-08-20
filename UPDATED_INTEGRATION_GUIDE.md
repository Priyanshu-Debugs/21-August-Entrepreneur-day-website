# 📊 COMPLETE GOOGLE SHEETS INTEGRATION GUIDE

## ✅ UPDATED CONFIGURATION (PLEDGE COLUMNS REMOVED)

I have removed the following 4 columns from the Pledges sheet:
- ❌ Pledge Type
- ❌ Pledge Name  
- ❌ Pledge Text
- ❌ Pledge Date

## 📋 NEW GOOGLE SHEETS STRUCTURE

### **Registrations Sheet (9 columns):**
| Column | Field Name | Description |
|--------|------------|-------------|
| A | Timestamp | Auto-generated timestamp |
| B | Full Name | Student's full name (max 20 chars) |
| C | Enrollment Number | 12-digit enrollment number |
| D | Contact Number | 10-digit mobile number |
| E | Email | Student's email address |
| F | Semester | Student's current semester |
| G | Branch | Student's branch/department |
| H | Submission Date | Date of form submission |
| I | Submission Time | Time of form submission |

### **Pledges Sheet (9 columns - SAME AS REGISTRATIONS):**
| Column | Field Name | Description |
|--------|------------|-------------|
| A | Timestamp | Auto-generated timestamp |
| B | Full Name | Student's full name |
| C | Enrollment Number | 12-digit enrollment number |
| D | Contact Number | 10-digit mobile number |
| E | Email | Student's email address |
| F | Semester | Student's current semester |
| G | Branch | Student's branch/department |
| H | Submission Date | Date of pledge submission |
| I | Submission Time | Time of pledge submission |

---

## 🚀 STEP-BY-STEP INTEGRATION SETUP

### **STEP 1: UPDATE YOUR GOOGLE APPS SCRIPT** 📝

1. **Go to**: https://script.google.com
2. **Open your existing project** (or create new one)
3. **Delete all existing code**
4. **Paste this EXACT code**:

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
        data.submissionDate || '',
        data.submissionTime || ''
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
        data.submissionDate || '',
        data.submissionTime || ''
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

5. **Save the script** (Ctrl+S)
6. **Name your project**: "VGEC E-Cell Form Integration"

### **STEP 2: RE-DEPLOY THE WEB APP** 🚀

1. **Click "Deploy" → "New deployment"**
2. **Click the gear icon** next to "Type"
3. **Select "Web app"**
4. **Configuration**:
   - Execute as: **Me (your email)**
   - Who has access: **Anyone**
5. **Click "Deploy"**
6. **Copy the new Web App URL** (will be different from before)
7. **Important**: The URL should look like:
   `https://script.google.com/macros/s/NEW_DEPLOYMENT_ID/exec`

### **STEP 3: UPDATE YOUR WEBSITE CONFIGURATION** ⚙️

1. **Open**: `google-sheets-integration.js` in your code editor
2. **Find line 10**: `this.SHEET_URL = 'https://script.google.com/macros/s/...';`
3. **Replace with your NEW Web App URL** from Step 2
4. **Save the file**

### **STEP 4: CLEAN UP YOUR GOOGLE SHEET** 🧹

1. **Open your Google Sheet**: https://docs.google.com/spreadsheets/d/13Ziu6ch9shGKV7MYAIfZrFoXVAiBgN8sI07LoBKRVNY/edit
2. **Delete existing data** (optional - backup first if needed)
3. **Delete any extra columns** beyond the 9 specified above
4. **Rename sheets** to exactly "Registrations" and "Pledges"

### **STEP 5: TEST THE INTEGRATION** 🧪

1. **Go to**: http://localhost:8000/integration-test.html
2. **Click**: "Run Full Test Suite"
3. **Watch for**: ✅ SUCCESS messages
4. **Check your Google Sheet** for test data

### **STEP 6: TEST WITH REAL FORM** 📋

1. **Go to**: http://localhost:8000
2. **Fill out the form** with real data:
   - Full Name: Test Student (max 20 characters)
   - Enrollment: 123456789012 (exactly 12 digits)
   - Contact: 9876543210 (exactly 10 digits)
   - Email: test@example.com
   - Semester: Select one
   - Branch: Select one
3. **Submit form**
4. **Complete pledge**
5. **Check Google Sheet** for new data

### **STEP 7: VERIFY DATA FLOW** ✅

**In Browser Console (F12):**
```javascript
// Check stored data
debugStoredData()

// Export CSV manually if needed
googleSheets.exportForGoogleSheets()
```

**In Google Sheets:**
- **Registrations sheet** should have 1 row
- **Pledges sheet** should have 1 row  
- **Both should have contact number and email**

---

## 🔧 TROUBLESHOOTING

### **If No Data Appears in Google Sheets:**

1. **Check Web App permissions**:
   - Go to Google Apps Script
   - Click "Executions" → Look for errors
   - May need to authorize the script

2. **Test Web App directly**:
   - Paste your Web App URL in browser
   - Should show "Google Apps Script is working! Time: ..."

3. **Check browser console**:
   - Should see: "✅ Registration data sent to Google Sheets successfully"
   - Should see: "📊 Data included contact: ... and email: ..."

### **If Contact/Email Missing:**

1. **Verify form fields**:
   - Name attributes: `contactNumber`, `email`
   - JavaScript captures these fields correctly

2. **Check Google Apps Script logs**:
   - Console should show: "Registration added with contact: ... and email: ..."

### **Manual Backup Method:**

If automatic sync fails:
1. **Open browser console** at http://localhost:8000
2. **Run**: `googleSheets.exportForGoogleSheets()`
3. **Download CSV files**
4. **Import to Google Sheets manually**

---

## 📱 QUICK VERIFICATION CHECKLIST

- [ ] Google Apps Script updated with new code
- [ ] New Web App deployment created
- [ ] Website configuration updated with new URL
- [ ] Google Sheet has correct column headers (9 columns each)
- [ ] Test form submission works
- [ ] Browser console shows success messages
- [ ] Google Sheet receives data with contact & email
- [ ] Both Registrations and Pledges sheets work

---

## 🎯 FINAL RESULT

**After completing these steps, you should have:**

✅ **Simplified Google Sheets** with only essential student data
✅ **Contact numbers and emails** properly captured
✅ **Identical structure** for both Registrations and Pledges
✅ **Automatic data sync** from website to Google Sheets
✅ **Manual CSV export** as backup option

**Your Google Sheets will now have clean, organized data with contact information for all students who register and take the pledge!**

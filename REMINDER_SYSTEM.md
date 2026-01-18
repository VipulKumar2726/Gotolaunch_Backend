# 📬 REMINDER SYSTEM DOCUMENTATION

## Overview
The GoToLaunch platform has an automated reminder system that:
- ✅ Auto-creates reminders when checklist items are generated
- ✅ Runs a cron job every 5 minutes to send pending reminders
- ✅ Sends email notifications to users
- ✅ Tracks sent/unsent status

---

## ✨ Features

### 1. **Auto-Reminder Creation**
When a checklist item is auto-generated:
```javascript
Checklist created → Reminder auto-created
With message: "⏰ Reminder: [Task Title] is due on [Due Date]"
sendAt = checklist.dueDate
```

### 2. **Cron Job (Every 5 Minutes)**
```
Pattern: */5 * * * * (every 5 minutes)
Action: Check for reminders where sendAt <= now
Result: Send email to user
Mark reminder as sent: true
```

### 3. **Email Integration**
- Uses Nodemailer
- Supports Gmail and other email services
- Beautiful HTML email template
- Fallback: logs to console if email not configured

### 4. **Smart Status Tracking**
- `sent: false` - Pending reminder
- `sent: true` - Already sent
- `sentAt: Date` - Timestamp when sent

---

## 📁 Project Structure

```
src/
├── models/
│   └── Reminder.js                 # Reminder schema
├── services/
│   ├── reminder.service.js         # Email & reminder logic
│   ├── cron.service.js             # Cron job scheduling
│   └── checklist.service.js        # Updated to auto-create reminders
├── controllers/
│   └── reminderController.js       # Reminder API endpoints
└── routes/
    └── reminderRoutes.js           # Reminder endpoints
```

---

## 📊 Database Schema

```javascript
Reminder {
  _id: ObjectId,
  userId: ObjectId,              // Reference to User
  launchId: ObjectId,            // Reference to Launch
  checklistId: ObjectId,         // Reference to Checklist (optional)
  sendAt: Date,                  // When to send reminder
  message: String,               // Reminder message
  sent: Boolean,                 // Has email been sent?
  sentAt: Date,                  // When was email sent?
  createdAt: Date,               // Auto-generated
  updatedAt: Date                // Auto-updated
}
```

---

## 🔌 API Endpoints

### 1. GET /api/reminder/user
Get all reminders for authenticated user

**Response:**
```json
{
  "success": true,
  "count": 6,
  "reminders": [
    {
      "id": "67a2c3d4e5f6g7h8i9j0k1m1",
      "launchId": "67a2c3d4e5f6g7h8i9j0k1l2",
      "checklistId": "67a2c3d4e5f6g7h8i9j0k1n1",
      "message": "⏰ Reminder: Prepare PH page is due on 1/16/2026",
      "sendAt": "2026-01-16T00:00:00.000Z",
      "sent": false,
      "sentAt": null,
      "createdAt": "2026-01-16T10:35:00.000Z"
    }
  ]
}
```

---

### 2. GET /api/reminder/launch/:launchId
Get all reminders for a specific launch

**Response:**
```json
{
  "success": true,
  "launchId": "67a2c3d4e5f6g7h8i9j0k1l2",
  "count": 6,
  "reminders": [...]
}
```

---

### 3. GET /api/reminder/pending-count
Get count of pending reminders (not yet sent)

**Response:**
```json
{
  "success": true,
  "pendingCount": 3,
  "reminders": [
    {
      "id": "67a2c3d4e5f6g7h8i9j0k1m1",
      "message": "⏰ Reminder: Prepare PH page is due on 1/16/2026",
      "sendAt": "2026-01-16T00:00:00.000Z"
    }
  ]
}
```

---

### 4. POST /api/reminder/send-pending
Manually trigger pending reminder sending (for testing)

**Response:**
```json
{
  "success": true,
  "message": "Pending reminders processing completed",
  "stats": {
    "sent": 3,
    "failed": 0
  }
}
```

---

### 5. DELETE /api/reminder/:id
Delete a reminder

**Response:**
```json
{
  "success": true,
  "message": "Reminder deleted successfully"
}
```

---

## 🔒 Security & Authorization

✅ All reminder routes require authentication (Bearer token)
✅ Users can only access their own reminders
✅ Users can only delete their own reminders

---

## ⚙️ Cron Job Details

### Schedule
```
Pattern: */5 * * * *
Meaning: Every 5 minutes
```

### Execution Flow
```
1. Cron job triggers every 5 minutes
2. Query Reminders where: sent=false AND sendAt<=now
3. For each reminder:
   - Get user email
   - Send email notification
   - Mark reminder as sent: true
   - Set sentAt: current timestamp
4. Log statistics (sent count, failed count)
```

### Logs
```
⏰ [2026-01-16T10:35:00.000Z] Running reminder cron job...
📬 Found 3 pending reminders
✅ Email sent to john@example.com
✅ Email sent to jane@example.com
✅ Email sent to bob@example.com
✅ Cron job completed - 3 sent, 0 failed
```

---

## 📧 Email Configuration

### Required Environment Variables
```env
EMAIL_SERVICE=gmail  # Email service (gmail, outlook, etc.)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password  # Use app-specific password for Gmail
APP_URL=http://localhost:3000
```

### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password
3. Add to .env:
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

### Without Email Configuration
- Reminders still work
- Emails logged to console instead
- `sent: false` remains for testing purposes

---

## 📋 Reminder Flow Example

### Step 1: Create Launch
```
POST /api/launch/create
→ Launch created
→ 6 checklist items auto-generated
→ 6 reminders auto-created
```

### Step 2: Reminders Waiting
```
Reminder 1: sendAt = 2026-01-16 (Due in 30 days)
Reminder 2: sendAt = 2026-01-26 (Due in 21 days)
Reminder 3: sendAt = 2026-02-01 (Due in 14 days)
...
sent: false for all
```

### Step 3: Cron Job Runs (Every 5 Minutes)
```
⏰ 2026-01-16 10:00:00 → Check pending reminders
→ Found Reminder 1 (sendAt <= now)
→ Send email to user
→ Mark reminder.sent = true
→ Set reminder.sentAt = 2026-01-16 10:00:00
```

### Step 4: Get Reminders
```
GET /api/reminder/user
→ See 6 reminders
→ Reminder 1: sent=true, sentAt=2026-01-16 10:00:00
→ Reminders 2-6: sent=false (waiting for due date)
```

---

## 🔧 Testing Reminders

### Test 1: Create Launch
```bash
# Will auto-create 6 reminders
POST /api/launch/create
{
  "productName": "My App",
  "launchDate": "2026-02-15T10:00:00Z"
}
```

### Test 2: Check Reminders Created
```bash
GET /api/reminder/user
# Should see 6 reminders with sent=false
```

### Test 3: Manually Send Pending (for testing)
```bash
# This forces all pending reminders to send immediately
POST /api/reminder/send-pending
# Response: { "sent": 6, "failed": 0 }
```

### Test 4: Create Past-Due Checklist Item
```bash
# Create reminder with past sendAt date
POST /api/checklist/custom
{
  "launchId": "...",
  "title": "Test task",
  "dueDate": "2025-01-01"  // Past date
}
# Reminder created with sendAt=2025-01-01
```

### Test 5: Run Cron Job Manually
```bash
# Call this endpoint to manually trigger the cron job
POST /api/reminder/send-pending
# Should send the reminder immediately since sendAt < now
```

---

## 📊 Statistics & Monitoring

### Get Pending Reminders Count
```bash
GET /api/reminder/pending-count
{
  "pendingCount": 3,
  "reminders": [...]
}
```

### Monitor Cron Job
Check server logs for:
```
✅ Reminder cron job initialized - Runs every 5 minutes
⏰ [2026-01-16T10:35:00.000Z] Running reminder cron job...
✅ Cron job completed - 2 sent, 0 failed
```

---

## 🎯 Use Cases

### 1. Automatic Reminders
- Create launch → Auto-create reminders
- Wait for due dates → Cron sends emails
- No manual action needed

### 2. Team Reminders
- Share launch with team
- Each team member gets reminders for their tasks
- Track completion via checklist

### 3. Testing
- Create past-due tasks
- Call `/api/reminder/send-pending`
- Test email delivery

---

## ⚠️ Important Notes

1. **Cron Runs Every 5 Minutes**: Not every minute, so up to 5-minute delay
2. **Timezone Aware**: Compare with UTC times
3. **Email Optional**: Works without email config (logs instead)
4. **Database Queries**: Uses efficient indexes on `sendAt`, `sent`, `userId`
5. **Failure Handling**: Failed emails don't break the process
6. **No Duplicates**: Once `sent=true`, reminder won't send again

---

## 🚀 Future Enhancements

1. **SMS Reminders**: Add SMS notifications
2. **Custom Reminders**: User-created custom reminders
3. **Reminder Frequency**: Send multiple times before due date
4. **Notification Preferences**: Users choose reminder method
5. **Analytics**: Track which reminders were clicked
6. **Slack Integration**: Send to Slack instead of email
7. **Timezone Handling**: User-specific timezone conversions

---

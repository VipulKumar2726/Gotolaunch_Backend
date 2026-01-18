# Launch API Testing Guide

## Base URL
```
http://localhost:5000
```

---

## 1. REGISTER A USER (PAID PLAN)

### Request
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "timezone": "Asia/Kolkata",
  "plan": "paid"
}
```

### Expected Response (201 Created)
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "67a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "timezone": "Asia/Kolkata",
    "plan": "paid",
    "createdAt": "2026-01-16T10:30:00.000Z"
  }
}
```

**⚠️ IMPORTANT:** Save the `token` from the response - you'll need it for all Launch API requests!

---

## 2. CREATE A LAUNCH

### Request
```http
POST /api/launch/create
Content-Type: application/json
Authorization: Bearer <your_token_here>

{
  "productName": "AI Writing Assistant",
  "productUrl": "https://aiwriter.com",
  "launchDate": "2026-02-15T10:00:00Z",
  "timezone": "Asia/Kolkata"
}
```

**Alternative with cookie (if using browser/Postman with cookie):**
```http
POST /api/launch/create
Content-Type: application/json
Cookie: authToken=<token>

{
  "productName": "AI Writing Assistant",
  "productUrl": "https://aiwriter.com",
  "launchDate": "2026-02-15T10:00:00Z",
  "timezone": "Asia/Kolkata"
}
```

### Expected Response (201 Created)
```json
{
  "success": true,
  "message": "Launch created successfully",
  "launch": {
    "id": "67a2c3d4e5f6g7h8i9j0k1l2",
    "productName": "AI Writing Assistant",
    "productUrl": "https://aiwriter.com",
    "launchDate": "2026-02-15T10:00:00.000Z",
    "timezone": "Asia/Kolkata",
    "status": "upcoming",
    "createdAt": "2026-01-16T10:35:00.000Z"
  }
}
```

### Test Multiple Launches
Create 2-3 more launches with different data:

```json
{
  "productName": "Social Media Scheduler",
  "productUrl": "https://scheduler.app",
  "launchDate": "2026-03-20T14:30:00Z",
  "timezone": "America/New_York"
}
```

```json
{
  "productName": "Analytics Dashboard",
  "productUrl": "https://analytics.io",
  "launchDate": "2026-02-28T09:00:00Z",
  "timezone": "Europe/London"
}
```

---

## 3. GET ALL LAUNCHES

### Request
```http
GET /api/launch/all
Authorization: Bearer <your_token_here>
```

### Expected Response (200 OK)
```json
{
  "success": true,
  "count": 3,
  "launches": [
    {
      "id": "67a2c3d4e5f6g7h8i9j0k1l2",
      "productName": "AI Writing Assistant",
      "productUrl": "https://aiwriter.com",
      "launchDate": "2026-02-15T10:00:00.000Z",
      "timezone": "Asia/Kolkata",
      "status": "upcoming",
      "createdAt": "2026-01-16T10:35:00.000Z"
    },
    {
      "id": "67a2c3d4e5f6g7h8i9j0k1l3",
      "productName": "Social Media Scheduler",
      "productUrl": "https://scheduler.app",
      "launchDate": "2026-03-20T14:30:00.000Z",
      "timezone": "America/New_York",
      "status": "upcoming",
      "createdAt": "2026-01-16T10:36:00.000Z"
    },
    {
      "id": "67a2c3d4e5f6g7h8i9j0k1l4",
      "productName": "Analytics Dashboard",
      "productUrl": "https://analytics.io",
      "launchDate": "2026-02-28T09:00:00.000Z",
      "timezone": "Europe/London",
      "status": "upcoming",
      "createdAt": "2026-01-16T10:37:00.000Z"
    }
  ]
}
```

---

## 4. GET SINGLE LAUNCH BY ID

### Request
```http
GET /api/launch/67a2c3d4e5f6g7h8i9j0k1l2
Authorization: Bearer <your_token_here>
```

### Expected Response (200 OK)
```json
{
  "success": true,
  "launch": {
    "id": "67a2c3d4e5f6g7h8i9j0k1l2",
    "productName": "AI Writing Assistant",
    "productUrl": "https://aiwriter.com",
    "launchDate": "2026-02-15T10:00:00.000Z",
    "timezone": "Asia/Kolkata",
    "status": "upcoming",
    "createdAt": "2026-01-16T10:35:00.000Z"
  }
}
```

---

## 5. DELETE A LAUNCH

### Request
```http
DELETE /api/launch/67a2c3d4e5f6g7h8i9j0k1l2
Authorization: Bearer <your_token_here>
```

### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Launch deleted successfully"
}
```

---

## ERROR TEST CASES

### Test 1: Create Launch without Authentication
```http
POST /api/launch/create
Content-Type: application/json

{
  "productName": "Test Product",
  "productUrl": "https://test.com",
  "launchDate": "2026-02-15T10:00:00Z"
}
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

---

### Test 2: Create Launch with FREE Plan User

First, register a FREE plan user:
```json
{
  "name": "Free User",
  "email": "free@example.com",
  "password": "password123",
  "plan": "free"
}
```

Then try to create a launch with this token:

**Expected Response (403):**
```json
{
  "success": false,
  "message": "Only paid users can create launches",
  "plan": "free",
  "upgrade": "Please upgrade to paid plan to create launches"
}
```

---

### Test 3: Get Launch with Invalid ID

```http
GET /api/launch/invalid_id_12345
Authorization: Bearer <your_token_here>
```

**Expected Response (404):**
```json
{
  "success": false,
  "message": "Launch not found"
}
```

---

### Test 4: Access Another User's Launch

1. Create a launch with User A (token_a)
2. Register User B (token_b)
3. Try to get User A's launch with User B's token:

```http
GET /api/launch/user_a_launch_id
Authorization: Bearer token_b
```

**Expected Response (403):**
```json
{
  "success": false,
  "message": "Not authorized to access this launch"
}
```

---

### Test 5: Missing Required Fields

```json
{
  "productName": "Test Product",
  "launchDate": "2026-02-15T10:00:00Z"
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Please provide productName, productUrl, and launchDate"
}
```

---

## CURL COMMANDS FOR QUICK TESTING

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "timezone": "Asia/Kolkata",
    "plan": "paid"
  }'
```

### 2. Create Launch (replace TOKEN with actual token)
```bash
curl -X POST http://localhost:5000/api/launch/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "productName": "AI Writing Assistant",
    "productUrl": "https://aiwriter.com",
    "launchDate": "2026-02-15T10:00:00Z",
    "timezone": "Asia/Kolkata"
  }'
```

### 3. Get All Launches
```bash
curl -X GET http://localhost:5000/api/launch/all \
  -H "Authorization: Bearer TOKEN"
```

### 4. Get Single Launch
```bash
curl -X GET http://localhost:5000/api/launch/LAUNCH_ID \
  -H "Authorization: Bearer TOKEN"
```

### 5. Delete Launch
```bash
curl -X DELETE http://localhost:5000/api/launch/LAUNCH_ID \
  -H "Authorization: Bearer TOKEN"
```

---

## SAMPLE TEST DATA COLLECTION

**User 1 (PAID):**
- Email: john@example.com
- Password: password123
- Plan: paid
- Timezone: Asia/Kolkata

**User 2 (FREE):**
- Email: free@example.com
- Password: password123
- Plan: free
- Timezone: UTC

**Launch Products:**
1. AI Writing Assistant (https://aiwriter.com) - Launch: 2026-02-15
2. Social Media Scheduler (https://scheduler.app) - Launch: 2026-03-20
3. Analytics Dashboard (https://analytics.io) - Launch: 2026-02-28
4. Email Marketing Tool (https://emailmarketing.io) - Launch: 2026-04-10
5. Project Management App (https://projectmgmt.app) - Launch: 2026-05-01

---

## TESTING CHECKLIST

✅ Register a PAID user
✅ Register a FREE user
✅ Create launch with PAID user (should succeed)
✅ Create launch with FREE user (should fail)
✅ Get all launches
✅ Get single launch
✅ Get non-existent launch (404)
✅ Access another user's launch (403)
✅ Delete own launch (should succeed)
✅ Delete another user's launch (403)
✅ Request without token (401)
✅ Request with invalid token (401)
✅ Missing required fields (400)

---

---

# CHECKLIST API Testing Guide

## 🎯 IMPORTANT: Auto-Checklist Generation

When you create a launch, a checklist is **automatically generated** with these tasks:

| Days Before Launch | Task | Category |
|------------------|------|----------|
| Day -30 | Prepare PH page | pre |
| Day -21 | Hunter outreach | pre |
| Day -14 | Teaser content | pre |
| Day -7 | Email draft | pre |
| Day 0 | Launch live checklist | launch |
| Day +1 | Thank you post | post |

**Example:** If launch date is 2026-02-15, checklist items will be auto-created for:
- 2025-01-16 (30 days before)
- 2025-01-26 (21 days before)
- 2026-02-01 (14 days before)
- etc.

---

## 6. GET CHECKLIST FOR A LAUNCH

After creating a launch, get its auto-generated checklist:

### Request
```http
GET /api/checklist/67a2c3d4e5f6g7h8i9j0k1l2
Authorization: Bearer <your_token_here>
```

### Expected Response (200 OK)
```json
{
  "success": true,
  "launchId": "67a2c3d4e5f6g7h8i9j0k1l2",
  "stats": {
    "total": 6,
    "completed": 0,
    "pending": 6,
    "progress": "0%"
  },
  "checklists": [
    {
      "id": "67a2c3d4e5f6g7h8i9j0k1m1",
      "title": "Prepare PH page",
      "description": "Create and set up your Product Hunt page with compelling copy, visuals, and description",
      "dueDate": "2026-01-16T00:00:00.000Z",
      "category": "pre",
      "completed": false,
      "createdAt": "2026-01-16T10:35:00.000Z"
    },
    {
      "id": "67a2c3d4e5f6g7h8i9j0k1m2",
      "title": "Hunter outreach",
      "description": "Reach out to Product Hunt hunters to get early support and feedback",
      "dueDate": "2026-01-26T00:00:00.000Z",
      "category": "pre",
      "completed": false,
      "createdAt": "2026-01-16T10:35:00.000Z"
    },
    {
      "id": "67a2c3d4e5f6g7h8i9j0k1m3",
      "title": "Teaser content",
      "description": "Create and schedule teaser content on social media to build anticipation",
      "dueDate": "2026-02-01T00:00:00.000Z",
      "category": "pre",
      "completed": false,
      "createdAt": "2026-01-16T10:35:00.000Z"
    },
    {
      "id": "67a2c3d4e5f6g7h8i9j0k1m4",
      "title": "Email draft",
      "description": "Draft and prepare email announcement for your mailing list",
      "dueDate": "2026-02-08T00:00:00.000Z",
      "category": "pre",
      "completed": false,
      "createdAt": "2026-01-16T10:35:00.000Z"
    },
    {
      "id": "67a2c3d4e5f6g7h8i9j0k1m5",
      "title": "Launch live checklist",
      "description": "Final checks before going live - ensure all systems are ready",
      "dueDate": "2026-02-15T00:00:00.000Z",
      "category": "launch",
      "completed": false,
      "createdAt": "2026-01-16T10:35:00.000Z"
    },
    {
      "id": "67a2c3d4e5f6g7h8i9j0k1m6",
      "title": "Thank you post",
      "description": "Post thank you message and engage with early supporters and feedback",
      "dueDate": "2026-02-16T00:00:00.000Z",
      "category": "post",
      "completed": false,
      "createdAt": "2026-01-16T10:35:00.000Z"
    }
  ]
}
```

---

## 7. TOGGLE CHECKLIST ITEM (Mark Complete/Incomplete)

### Request
```http
PUT /api/checklist/67a2c3d4e5f6g7h8i9j0k1m1/toggle
Authorization: Bearer <your_token_here>
```

### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Checklist item marked as completed",
  "checklist": {
    "id": "67a2c3d4e5f6g7h8i9j0k1m1",
    "title": "Prepare PH page",
    "description": "Create and set up your Product Hunt page with compelling copy, visuals, and description",
    "dueDate": "2026-01-16T00:00:00.000Z",
    "category": "pre",
    "completed": true
  }
}
```

Toggle again to mark as incomplete - same endpoint!

---

## 8. CREATE CUSTOM CHECKLIST ITEM

Add your own custom task to the checklist:

### Request
```http
POST /api/checklist/custom
Content-Type: application/json
Authorization: Bearer <your_token_here>

{
  "launchId": "67a2c3d4e5f6g7h8i9j0k1l2",
  "title": "Design launch banner",
  "description": "Create eye-catching banner for website",
  "dueDate": "2026-02-10T00:00:00Z",
  "category": "pre"
}
```

### Expected Response (201 Created)
```json
{
  "success": true,
  "message": "Custom checklist item created successfully",
  "checklist": {
    "id": "67a2c3d4e5f6g7h8i9j0k1m7",
    "title": "Design launch banner",
    "description": "Create eye-catching banner for website",
    "dueDate": "2026-02-10T00:00:00.000Z",
    "category": "pre",
    "completed": false,
    "createdAt": "2026-01-16T10:40:00.000Z"
  }
}
```

---

## 9. GET CHECKLIST STATISTICS

Get completion statistics for a launch's checklist:

### Request
```http
GET /api/checklist/67a2c3d4e5f6g7h8i9j0k1l2/stats
Authorization: Bearer <your_token_here>
```

### Expected Response (200 OK)
```json
{
  "success": true,
  "launchId": "67a2c3d4e5f6g7h8i9j0k1l2",
  "stats": {
    "total": 7,
    "completed": 2,
    "pending": 5,
    "progress": "29%"
  }
}
```

---

## 10. UPDATE CHECKLIST ITEM

Update details of a checklist item:

### Request
```http
PUT /api/checklist/67a2c3d4e5f6g7h8i9j0k1m1
Content-Type: application/json
Authorization: Bearer <your_token_here>

{
  "title": "Prepare Product Hunt page (Updated)",
  "description": "Create and set up your Product Hunt page with compelling copy, visuals, and description - Include screenshots",
  "dueDate": "2026-01-15T00:00:00Z",
  "completed": true
}
```

### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Checklist item updated successfully",
  "checklist": {
    "id": "67a2c3d4e5f6g7h8i9j0k1m1",
    "title": "Prepare Product Hunt page (Updated)",
    "description": "Create and set up your Product Hunt page with compelling copy, visuals, and description - Include screenshots",
    "dueDate": "2026-01-15T00:00:00.000Z",
    "category": "pre",
    "completed": true
  }
}
```

---

## 11. DELETE CHECKLIST ITEM

### Request
```http
DELETE /api/checklist/67a2c3d4e5f6g7h8i9j0k1m1
Authorization: Bearer <your_token_here>
```

### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Checklist item deleted successfully"
}
```

---

## CHECKLIST ERROR TEST CASES

### Test 1: Get Checklist Without Authentication
```http
GET /api/checklist/67a2c3d4e5f6g7h8i9j0k1l2
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

---

### Test 2: Access Another User's Checklist

1. Create launch with User A (get launchId_a)
2. Register User B
3. Try to get User A's checklist with User B's token:

```http
GET /api/checklist/launchId_a
Authorization: Bearer user_b_token
```

**Expected Response (403):**
```json
{
  "success": false,
  "message": "Not authorized to access this launch's checklist"
}
```

---

### Test 3: Create Custom Item for Non-Existent Launch

```json
{
  "launchId": "invalid_launch_id_12345",
  "title": "Test",
  "description": "Test",
  "dueDate": "2026-02-10T00:00:00Z"
}
```

**Expected Response (404):**
```json
{
  "success": false,
  "message": "Launch not found"
}
```

---

### Test 4: Missing Required Fields for Custom Item

```json
{
  "launchId": "67a2c3d4e5f6g7h8i9j0k1l2",
  "title": "Test"
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Please provide launchId, title, and dueDate"
}
```

---

## CURL COMMANDS FOR CHECKLIST TESTING

### Get Checklist
```bash
curl -X GET http://localhost:5000/api/checklist/LAUNCH_ID \
  -H "Authorization: Bearer TOKEN"
```

### Toggle Checklist Item
```bash
curl -X PUT http://localhost:5000/api/checklist/CHECKLIST_ID/toggle \
  -H "Authorization: Bearer TOKEN"
```

### Create Custom Checklist Item
```bash
curl -X POST http://localhost:5000/api/checklist/custom \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "launchId": "LAUNCH_ID",
    "title": "Custom Task",
    "description": "Task description",
    "dueDate": "2026-02-10T00:00:00Z",
    "category": "pre"
  }'
```

### Get Checklist Statistics
```bash
curl -X GET http://localhost:5000/api/checklist/LAUNCH_ID/stats \
  -H "Authorization: Bearer TOKEN"
```

### Update Checklist Item
```bash
curl -X PUT http://localhost:5000/api/checklist/CHECKLIST_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "Updated Title",
    "completed": true
  }'
```

### Delete Checklist Item
```bash
curl -X DELETE http://localhost:5000/api/checklist/CHECKLIST_ID \
  -H "Authorization: Bearer TOKEN"
```

---

## CHECKLIST TESTING CHECKLIST

✅ Create launch (checklist auto-generates with 6 items)
✅ Get checklist for launch
✅ Get checklist statistics (0/6 completed initially)
✅ Toggle checklist item (mark complete)
✅ Get stats again (should show updated progress)
✅ Create custom checklist item
✅ Update custom item
✅ Delete custom item
✅ Try to access another user's checklist (403)
✅ Try to get checklist without token (401)
✅ Categories: pre, launch, post (verify all types exist)
✅ Due dates: Correctly calculated relative to launch date

---

---

# REMINDER SYSTEM Testing Guide

## 🎯 IMPORTANT: Auto-Reminder Creation

When you create a launch and checklist is auto-generated:
- ✅ 6 checklist items created
- ✅ 6 reminders auto-created
- ✅ Cron job runs every 5 minutes
- ✅ Reminders sent when sendAt <= now
- ✅ Email sent to user (or logged to console)

---

## 12. GET ALL REMINDERS FOR USER

### Request
```http
GET /api/reminder/user
Authorization: Bearer <your_token_here>
```

### Expected Response (200 OK)
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
    },
    {
      "id": "67a2c3d4e5f6g7h8i9j0k1m2",
      "launchId": "67a2c3d4e5f6g7h8i9j0k1l2",
      "checklistId": "67a2c3d4e5f6g7h8i9j0k1n2",
      "message": "⏰ Reminder: Hunter outreach is due on 1/26/2026",
      "sendAt": "2026-01-26T00:00:00.000Z",
      "sent": false,
      "sentAt": null,
      "createdAt": "2026-01-16T10:35:00.000Z"
    }
  ]
}
```

---

## 13. GET ALL REMINDERS FOR A LAUNCH

### Request
```http
GET /api/reminder/launch/67a2c3d4e5f6g7h8i9j0k1l2
Authorization: Bearer <your_token_here>
```

### Expected Response (200 OK)
```json
{
  "success": true,
  "launchId": "67a2c3d4e5f6g7h8i9j0k1l2",
  "count": 6,
  "reminders": [...]
}
```

---

## 14. GET PENDING REMINDERS COUNT

Check how many reminders are waiting to be sent

### Request
```http
GET /api/reminder/pending-count
Authorization: Bearer <your_token_here>
```

### Expected Response (200 OK)
```json
{
  "success": true,
  "pendingCount": 6,
  "reminders": [
    {
      "id": "67a2c3d4e5f6g7h8i9j0k1m1",
      "message": "⏰ Reminder: Prepare PH page is due on 1/16/2026",
      "sendAt": "2026-01-16T00:00:00.000Z"
    },
    {
      "id": "67a2c3d4e5f6g7h8i9j0k1m2",
      "message": "⏰ Reminder: Hunter outreach is due on 1/26/2026",
      "sendAt": "2026-01-26T00:00:00.000Z"
    }
  ]
}
```

---

## 15. MANUALLY SEND PENDING REMINDERS (Testing)

Trigger the cron job manually to send pending reminders immediately

### Request
```http
POST /api/reminder/send-pending
Authorization: Bearer <your_token_here>
```

### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Pending reminders processing completed",
  "stats": {
    "sent": 2,
    "failed": 0
  }
}
```

**Console Output:**
```
⏰ Found 2 pending reminders
✅ Email sent to john@example.com
✅ Email sent to john@example.com
✅ Reminders processed - Sent: 2, Failed: 0
```

---

## 16. DELETE A REMINDER

### Request
```http
DELETE /api/reminder/67a2c3d4e5f6g7h8i9j0k1m1
Authorization: Bearer <your_token_here>
```

### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Reminder deleted successfully"
}
```

---

## REMINDER FLOW IN ACTION

### Scenario: Create Launch with Past-Due Task

#### Step 1: Create Launch
```bash
POST /api/launch/create
{
  "productName": "My App",
  "launchDate": "2026-02-15T10:00:00Z"
}
```

#### Step 2: Check Reminders Created
```bash
GET /api/reminder/user
→ Returns 6 reminders, all with sent=false
→ sendAt dates: 1/16, 1/26, 2/1, 2/8, 2/15, 2/16
```

#### Step 3: Manually Send (testing)
```bash
POST /api/reminder/send-pending
→ Nothing sent (dates are in future)
→ stats: { sent: 0, failed: 0 }
```

#### Step 4: Create Custom Past-Due Task
```bash
POST /api/checklist/custom
{
  "launchId": "...",
  "title": "Urgent task",
  "dueDate": "2025-12-15"  // Past date!
}
→ Auto-reminder created with sendAt=2025-12-15
```

#### Step 5: Send Pending Again
```bash
POST /api/reminder/send-pending
→ ⏰ Found 1 pending reminders
→ ✅ Email sent to john@example.com
→ stats: { sent: 1, failed: 0 }
```

#### Step 6: Verify Sent Status
```bash
GET /api/reminder/user
→ One reminder with sent=true, sentAt=current time
```

---

## CRON JOB BEHAVIOR

### Automatic Execution
- ⏰ Runs every 5 minutes automatically
- 🔍 Checks for reminders where: sent=false AND sendAt<=now
- 📧 Sends email for each pending reminder
- ✅ Marks reminder.sent=true

### Console Logs Every 5 Minutes
```
⏰ [2026-01-16T10:00:00.000Z] Running reminder cron job...
📭 No pending reminders
✅ Cron job completed - 0 sent, 0 failed

⏰ [2026-01-16T10:05:00.000Z] Running reminder cron job...
📬 Found 1 pending reminders
✅ Email sent to john@example.com
✅ Cron job completed - 1 sent, 0 failed
```

---

## REMINDER ERROR TEST CASES

### Test 1: Get Reminders Without Token
```http
GET /api/reminder/user
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

---

### Test 2: Delete Another User's Reminder
1. Create launch/reminder with User A
2. Register User B
3. Try to delete User A's reminder with User B's token

**Expected Response (403):**
```json
{
  "success": false,
  "message": "Not authorized to delete this reminder"
}
```

---

### Test 3: Get Reminders for Non-Existent Launch
```http
GET /api/reminder/launch/invalid_id
Authorization: Bearer TOKEN
```

**Expected Response (404):**
```json
{
  "success": false,
  "message": "Launch not found"
}
```

---

## CURL COMMANDS FOR REMINDER TESTING

### Get User Reminders
```bash
curl -X GET http://localhost:5000/api/reminder/user \
  -H "Authorization: Bearer TOKEN"
```

### Get Launch Reminders
```bash
curl -X GET http://localhost:5000/api/reminder/launch/LAUNCH_ID \
  -H "Authorization: Bearer TOKEN"
```

### Get Pending Count
```bash
curl -X GET http://localhost:5000/api/reminder/pending-count \
  -H "Authorization: Bearer TOKEN"
```

### Manually Send Pending
```bash
curl -X POST http://localhost:5000/api/reminder/send-pending \
  -H "Authorization: Bearer TOKEN"
```

### Delete Reminder
```bash
curl -X DELETE http://localhost:5000/api/reminder/REMINDER_ID \
  -H "Authorization: Bearer TOKEN"
```

---

## REMINDER TESTING CHECKLIST

✅ Create launch → 6 reminders auto-created
✅ Get user reminders → All 6 visible with sent=false
✅ Get launch reminders → Same 6 reminders
✅ Check pending count → Should show all 6
✅ Create past-due custom checklist
✅ Manually send pending → Sends the past-due reminder
✅ Check reminder sent=true, sentAt populated
✅ Delete a reminder → Successfully deleted
✅ Try to get deleted reminder → 404 not found
✅ Cron job runs every 5 minutes (check console)
✅ No duplicate sends (sent=true prevents re-sending)
✅ Verify email configuration in .env

---

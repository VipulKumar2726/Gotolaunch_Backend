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

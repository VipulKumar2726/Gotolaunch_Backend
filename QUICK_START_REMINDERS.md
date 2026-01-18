# 🚀 QUICK START: REMINDER SYSTEM

## ONE-MINUTE SETUP

### Server Status ✅
```
✅ Running on port 5000
✅ MongoDB connected
✅ Cron job initialized (every 5 minutes)
✅ All routes ready
```

---

## TEST IN 3 STEPS

### Step 1: Create User (PAID)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@test.com",
    "password": "test123",
    "plan": "paid"
  }'
```
**Save the token!**

---

### Step 2: Create Launch
```bash
curl -X POST http://localhost:5000/api/launch/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "productName": "My App",
    "productUrl": "https://myapp.com",
    "launchDate": "2026-02-15T10:00:00Z"
  }'
```
**Auto-creates 6 checklists & 6 reminders!**

---

### Step 3: Check Reminders
```bash
curl -X GET http://localhost:5000/api/reminder/user \
  -H "Authorization: Bearer TOKEN"
```
**See all 6 reminders with sent=false**

---

## REMINDER ENDPOINTS (5 Total)

| Endpoint | Purpose |
|----------|---------|
| `GET /api/reminder/user` | Your reminders |
| `GET /api/reminder/launch/:id` | Launch's reminders |
| `GET /api/reminder/pending-count` | How many waiting |
| `POST /api/reminder/send-pending` | Force send (testing) |
| `DELETE /api/reminder/:id` | Delete reminder |

---

## AUTO-FLOW (No Code Needed!)

```
Create Launch
    ↓
Auto: 6 Checklists created
    ↓
Auto: 6 Reminders created
    ↓
Auto: Cron runs every 5 mins
    ↓
Auto: Sends email when due
    ↓
Auto: Marks sent=true
```

---

## CRON JOB IN ACTION

### Console (Every 5 minutes)
```
⏰ [HH:MM:SS] Running reminder cron job...
📬 Found X pending reminders
✅ Email sent to user@example.com
✅ Cron job completed - X sent, 0 failed
```

### No Setup Needed!
- Starts automatically
- Runs in background
- No manual trigger required

---

## QUICK TEST: PAST-DUE TASK

### Create task with past date
```bash
curl -X POST http://localhost:5000/api/checklist/custom \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "launchId": "YOUR_LAUNCH_ID",
    "title": "Test task",
    "dueDate": "2025-12-15"
  }'
```

### Manually send immediately
```bash
curl -X POST http://localhost:5000/api/reminder/send-pending \
  -H "Authorization: Bearer TOKEN"
```

### Result: Email sent! ✅

---

## EMAIL CONFIG (Optional)

### Add to .env
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_SERVICE=gmail
```

### Without Email
- Still works!
- Logs to console instead
- Use for testing

---

## REMINDERS CREATED WITH

```
Task: Prepare PH page → sendAt = -30 days
Task: Hunter outreach → sendAt = -21 days
Task: Teaser content → sendAt = -14 days
Task: Email draft → sendAt = -7 days
Task: Launch live → sendAt = 0 days
Task: Thank you post → sendAt = +1 day
```

---

## KEY FACTS

✅ 6 reminders auto-created per launch
✅ Cron runs every 5 minutes automatically
✅ Emails sent when sendAt <= now
✅ No duplicates (sent=true prevents re-send)
✅ User isolation (can't see other's reminders)
✅ Works without email config (logs instead)
✅ Delete reminders anytime

---

## MONITORING

### Check Pending
```bash
GET /api/reminder/pending-count
```
Returns: how many waiting to send

### Check All User Reminders
```bash
GET /api/reminder/user
```
Returns: all reminders (sent & pending)

### Check Launch Reminders
```bash
GET /api/reminder/launch/{launchId}
```
Returns: all reminders for that launch

---

## TROUBLESHOOTING

### No reminders created?
- Check if launch was created with PAID plan
- Check server logs for errors
- Verify MongoDB connected

### Cron not running?
- Check console: "✅ Reminder cron job initialized"
- Check every 5 minutes for "Running reminder cron job..."
- Verify server is still running

### Emails not sending?
- Check .env has EMAIL_USER and EMAIL_PASSWORD
- Use POST /api/reminder/send-pending to test
- Check console logs for email errors
- Works without email (logs instead)

---

## FILES CREATED

1. `src/models/Reminder.js` - Data model
2. `src/services/reminder.service.js` - Email & logic
3. `src/services/cron.service.js` - Cron scheduling
4. `src/controllers/reminderController.js` - API endpoints
5. `src/routes/reminderRoutes.js` - Route definitions
6. `REMINDER_SYSTEM.md` - Full documentation
7. `REMINDER_SUMMARY.md` - Complete summary
8. `API_TEST_DATA.md` - Updated with examples

---

## UPDATED FILES

1. `src/services/checklist.service.js` - Auto-creates reminders
2. `src/app.js` - Registers routes & starts cron
3. `package.json` - Added node-cron, nodemailer
4. `.env` - Email config variables

---

## NEXT: WHAT TO CHANGE

For your real app:
1. Update EMAIL_USER and EMAIL_PASSWORD in .env
2. Change APP_URL to your frontend URL
3. Customize email template in reminder.service.js
4. Add cron status endpoint if needed
5. Add notification preferences for users

---

**You now have a complete automated reminder system!** 🎉

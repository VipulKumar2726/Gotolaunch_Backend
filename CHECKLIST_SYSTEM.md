# 📋 AUTO-CHECKLIST SYSTEM DOCUMENTATION

## Overview
The GoToLaunch platform automatically generates a pre-configured checklist for every new launch. The checklist contains 6 hardcoded tasks scheduled at specific intervals relative to the launch date.

---

## ✨ Features

### 1. **Auto-Generation on Launch Creation**
- When a user creates a launch, 6 checklist items are automatically created
- Tasks are scheduled relative to the launch date (not hardcoded dates)
- User doesn't need to manually create checklist items

### 2. **Predefined Tasks (Hardcoded JSON)**
```javascript
CHECKLIST_TEMPLATE = [
  { daysBeforeLaunch: -30, title: "Prepare PH page", category: "pre" },
  { daysBeforeLaunch: -21, title: "Hunter outreach", category: "pre" },
  { daysBeforeLaunch: -14, title: "Teaser content", category: "pre" },
  { daysBeforeLaunch: -7, title: "Email draft", category: "pre" },
  { daysBeforeLaunch: 0, title: "Launch live checklist", category: "launch" },
  { daysBeforeLaunch: 1, title: "Thank you post", category: "post" },
]
```

### 3. **Categories**
- **pre**: Tasks before launch (30, 21, 14, 7 days before)
- **launch**: Tasks on launch day (day 0)
- **post**: Tasks after launch (day +1)

### 4. **Smart Statistics**
- Track total items, completed, pending
- Calculate progress percentage
- Real-time updates when tasks are toggled

---

## 📁 Project Structure

```
src/
├── models/
│   └── Checklist.js              # Checklist schema
├── services/
│   ├── launch.service.js         # Auto-generation happens here ✨
│   └── checklist.service.js      # Core checklist operations
├── controllers/
│   ├── launch.controller.js      # Launch API (calls service)
│   └── checklistController.js    # Checklist API endpoints
└── routes/
    ├── launchRoutes.js
    └── checklistRoutes.js
```

### Key Integration Points

**1. Launch Service (`launch.service.js`)**
```javascript
static async createLaunch(userId, data) {
  // Create launch
  const launch = await Launch.create({...});
  
  // 🎯 AUTO-GENERATE CHECKLIST
  await checklistService.autoGenerateChecklist(launch._id, launchDate);
  
  return launch;
}
```

**2. Checklist Service (`checklist.service.js`)**
```javascript
async autoGenerateChecklist(launchId, launchDate) {
  // Loop through CHECKLIST_TEMPLATE
  // Calculate dueDate = launchDate + daysBeforeLaunch
  // Create checklist items in bulk
}
```

---

## 🔌 API Endpoints

### 1. GET /api/checklist/:launchId
Get all checklist items for a launch with statistics

**Response includes:**
- All 6+ checklist items with details
- Statistics: total, completed, pending, progress%

---

### 2. PUT /api/checklist/:id/toggle
Toggle completion status (mark complete/incomplete)

**Toggle = Complete if pending, or Pending if completed**

---

### 3. POST /api/checklist/custom
Create custom checklist item (user-added task)

**Body:**
```json
{
  "launchId": "string",
  "title": "string",
  "description": "string",
  "dueDate": "ISO date",
  "category": "pre|launch|post"  // optional, defaults to "pre"
}
```

---

### 4. PUT /api/checklist/:id
Update checklist item details

**Body:** Any of the fields can be updated
```json
{
  "title": "string",
  "description": "string",
  "dueDate": "ISO date",
  "category": "pre|launch|post",
  "completed": boolean
}
```

---

### 5. DELETE /api/checklist/:id
Delete a checklist item

---

### 6. GET /api/checklist/:launchId/stats
Get checklist statistics only

**Response:**
```json
{
  "total": number,
  "completed": number,
  "pending": number,
  "progress": "X%"
}
```

---

## 🔒 Security & Authorization

✅ All checklist routes require authentication (Bearer token)
✅ Users can only access their own launch's checklists
✅ Trying to access another user's checklist returns 403

---

## 📊 Example Flow

### Step 1: Register User (PAID)
```
POST /api/auth/register
→ User created with plan: "paid"
```

### Step 2: Create Launch
```
POST /api/launch/create
{
  "productName": "My App",
  "launchDate": "2026-02-15T10:00:00Z"
}
→ Launch created
→ 🎯 6 checklist items auto-generated:
   - Prepare PH page (2026-01-16)
   - Hunter outreach (2026-01-26)
   - Teaser content (2026-02-01)
   - Email draft (2026-02-08)
   - Launch live checklist (2026-02-15)
   - Thank you post (2026-02-16)
```

### Step 3: Get Checklist
```
GET /api/checklist/{launchId}
→ Returns all 6 items + stats (0/6 completed)
```

### Step 4: Complete Tasks
```
PUT /api/checklist/{itemId}/toggle
→ Item marked as completed
→ Stats update (1/6 completed = 17%)
```

### Step 5: Add Custom Task
```
POST /api/checklist/custom
{
  "launchId": "...",
  "title": "Record video demo",
  "dueDate": "2026-02-12"
}
→ Now 7 checklist items
```

---

## 🛠️ Database Schema

```javascript
Checklist {
  _id: ObjectId,
  launchId: ObjectId,           // Reference to Launch
  title: String,
  description: String,
  dueDate: Date,                // Calculated from launch date
  category: String,             // pre | launch | post
  completed: Boolean,           // false by default
  createdAt: Date,              // Auto-generated
  updatedAt: Date               // Auto-updated
}
```

---

## 📈 Statistics Calculation

```javascript
async getChecklistStats(launchId) {
  total = count of all items for this launch
  completed = count of items where completed: true
  pending = total - completed
  progress = Math.round((completed / total) * 100) + "%"
  
  return { total, completed, pending, progress }
}
```

---

## 🎯 Use Cases

### 1. Product Launch Manager
- Creates launch → 6 tasks auto-appear
- Follows the timeline to stay on track
- Marks items as complete as work progresses

### 2. Team Collaboration
- One person creates launch with tasks
- Team members toggle their assigned items
- View progress with statistics

### 3. Custom Workflow
- Use auto-generated tasks as baseline
- Add 5+ custom tasks for specific needs
- Delete tasks that don't apply

### 4. Launch Timeline Visualization
- Query checklist items by category
- Create timeline view (pre, launch, post phases)
- Show progress bar for overall launch readiness

---

## 🚀 Future Enhancements

1. **Task Reassignment**: Assign tasks to team members
2. **Notifications**: Remind users of upcoming due tasks
3. **Analytics**: Track average completion time
4. **Templates**: Save custom checklists as templates
5. **Collaboration**: Share checklist with team

---

## ⚠️ Important Notes

1. **Hardcoded, Not AI**: The template is static JSON - no AI generation
2. **Relative Dates**: All dates calculated from launch date, not absolute
3. **Auto-Generation**: Happens silently during launch creation
4. **Bulk Insert**: All 6 items created in one database operation
5. **Flexible**: Users can add unlimited custom items

---

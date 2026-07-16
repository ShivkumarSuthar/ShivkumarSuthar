# Next.js Migration & MongoDB Database Schema Guide

This guide is designed to help you migrate this **Learning CMS** from its current full-stack architecture (Express + React + Vite) into a **Next.js** project, configure your local **MongoDB** database, and run it locally.

---

## 1. Database Collections (Tables) Schema
If you are running MongoDB locally or on MongoDB Atlas, you will store your information in the collections defined below. 

You can either use a **Normalized Database Structure** (multiple collections) or an **Integrated High-Performance Structure** (all user CMS data embedded in a single document for atomic updates). Below are both formats:

### Approach A: Integrated Collection (Recommended for Atomic User Profiles)
This model encapsulates the entire student workspaces, tracks, logs, streak counts, and homework grades in one document keyed by the `userId`. This guarantees zero-latency joins and ultra-safe sync.

#### **Collection Name**: `cms_data`
| Field Name | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | MongoDB unique identifier |
| `userId` | String | Unique student identifier (e.g., `'default-user'` or auth ID) (Indexed) |
| `workspaces` | Array (WorkspaceInfo) | List of workspaces (Programming, Business, AI, etc.) |
| `activeWorkspaceId` | String | Active workspace identifier |
| `studySpaces` | Array (Course) | Complete course curriculum, chapters, and lessons |
| `bookmarks` | Array (Bookmark) | Saved videos, PDFs, and notes bookmarks |
| `activityLog` | Array (ActivityLog) | Time-stamped logs of studied sessions, lessons completed, etc. |
| `mentors` | Array (Mentor) | AI and human tutor details and specialized expertise |
| `dailyStudyHours` | Object (Map) | Key-value mapping of `YYYY-MM-DD` string to number (hours studied) |
| `currentStreak` | Number | Active daily study streak count |
| `longestStreak` | Number | All-time highest streak count |
| `todaysGoalHours` | Number | Daily target hours |
| `weeklyGoalHours` | Number | Weekly target hours |
| `monthlyGoalHours` | Number | Monthly target hours |
| `studyTimeSeconds` | Number | Accrued active timer seconds |
| `achievements` | Array (Achievement) | Unlocked badges with metadata |
| `resumeState` | Object | Workspace state tracking (`lastSpaceId`, `lastLessonId`, etc.) |
| `updatedAt` | Date | Timestamp of last synchronization |

---

### Approach B: Normalized Collections (Standard Relational/SQL Style)
If you prefer separate tables, you should create the following **6 collections** in your database:

#### **1. Collection**: `workspaces`
Tracks general workspace categories.
```json
{
  "_id": "ObjectId",
  "id": "String (Unique ID)",
  "name": "String (e.g., Programming, Design)",
  "description": "String",
  "icon": "String (Lucide Icon name)"
}
```

#### **2. Collection**: `courses` (StudySpaces)
Tracks the dynamic educational curriculum, courses, modules, chapters, lessons, quizzes, and homework assignments.
```json
{
  "_id": "ObjectId",
  "id": "String (Unique ID)",
  "workspaceId": "String (Reference to workspaces.id)",
  "title": "String",
  "description": "String",
  "coverImage": "String (URL)",
  "banner": "String (URL)",
  "mentor": "String",
  "category": "String",
  "difficulty": "String ('Beginner' | 'Intermediate' | 'Advanced')",
  "estimatedHours": "Number",
  "modules": [
    {
      "id": "String",
      "title": "String",
      "description": "String",
      "chapters": [
        {
          "id": "String",
          "title": "String",
          "lessons": [
            {
              "id": "String",
              "title": "String",
              "completed": "Boolean",
              "duration": "Number",
              "notes": "String (Markdown)",
              "summary": "String",
              "resources": [
                {
                  "id": "String",
                  "title": "String",
                  "type": "String",
                  "url": "String",
                  "content": "String (Optional code/markdown text)"
                }
              ],
              "quiz": [
                {
                  "id": "String",
                  "question": "String",
                  "options": ["String"],
                  "correctIndex": "Number",
                  "explanation": "String",
                  "type": "String"
                }
              ],
              "assignments": [
                {
                  "id": "String",
                  "type": "String",
                  "title": "String",
                  "requirements": "String",
                  "submitted": "Boolean",
                  "submissionText": "String",
                  "grade": "String",
                  "feedback": "String",
                  "evaluation": "String"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "todos": [],
  "projects": []
}
```

#### **3. Collection**: `bookmarks`
Saves custom reference materials pinned by users.
```json
{
  "_id": "ObjectId",
  "id": "String",
  "title": "String",
  "url": "String",
  "type": "String",
  "studySpaceId": "String",
  "folderName": "String",
  "createdDate": "String (ISO)"
}
```

#### **4. Collection**: `activity_logs`
Enables the calendar heatmap and analytical widgets on the dashboard.
```json
{
  "_id": "ObjectId",
  "id": "String",
  "type": "String (e.g., 'complete_lesson', 'study_session')",
  "title": "String",
  "description": "String",
  "timestamp": "String (ISO)",
  "studySpaceId": "String",
  "duration": "Number"
}
```

#### **5. Collection**: `achievements`
Unlocks gamified progress rewards.
```json
{
  "_id": "ObjectId",
  "id": "String",
  "title": "String",
  "description": "String",
  "icon": "String",
  "unlockedAt": "String"
}
```

#### **6. Collection**: `user_profiles`
Holds general user details, current study streaks, and metrics.
```json
{
  "_id": "ObjectId",
  "userId": "String (Unique)",
  "currentStreak": "Number",
  "longestStreak": "Number",
  "dailyStudyHours": "Object (Map YYYY-MM-DD -> hours)",
  "weeklyGoalHours": "Number",
  "monthlyGoalHours": "Number"
}
```

---

## 2. Next.js Migration: Setup Instructions

Follow these 4 simple steps to migrate your frontend and backend endpoints over to Next.js.

### Step 1: Create a Next.js App
In your terminal, bootstrap a standard Next.js project with TypeScript, Tailwind CSS, and App Router support:
```bash
npx create-next-app@latest learning-cms --typescript --tailwind --app --src-dir
cd learning-cms
```

### Step 2: Install MongoDB Dependencies
Install Mongoose (for schemas) and MongoDB drivers locally:
```bash
npm install mongoose mongodb
```
Also ensure all necessary visual components are ported (e.g. `lucide-react`, `motion`, `recharts`, `react-markdown`).

### Step 3: Connect to MongoDB via Next.js Utility
Create `/src/lib/mongodb.ts` to manage your local mongoose database connection pool without exhausting sockets:

```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learning_cms';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside your env configuration');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
```

### Step 4: Add Next.js API Routes (App Router)
Next.js replaces the Express controllers with **Serverless API Routes**. Place this code directly into `/src/app/api/cms/data/route.ts` to implement the dynamic read/write MongoDB backend:

```typescript
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserCMSData } from '@/db/mongodb-schemas';

// GET: Retrieve user learning state
export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch state for our single default student user
    const dataDoc = await UserCMSData.findOne({ userId: 'default-user' });
    
    if (!dataDoc) {
      return NextResponse.json(null); // Return empty state to trigger defaults
    }
    
    return NextResponse.json(dataDoc.workspaces ? dataDoc : dataDoc.cmsData);
  } catch (error: any) {
    console.error('Next.js Database Fetch Error:', error);
    return NextResponse.json({ error: 'Database fetch failed: ' + error.message }, { status: 500 });
  }
}

// POST: Save and synchronize complete state
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cmsData } = body;
    
    if (!cmsData) {
      return NextResponse.json({ error: 'Missing required field [cmsData]' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Update or insert data atomically
    const updated = await UserCMSData.findOneAndUpdate(
      { userId: 'default-user' },
      { 
        $set: { 
          userId: 'default-user',
          workspaces: cmsData.workspaces,
          activeWorkspaceId: cmsData.activeWorkspaceId,
          studySpaces: cmsData.studySpaces,
          bookmarks: cmsData.bookmarks,
          activityLog: cmsData.activityLog,
          mentors: cmsData.mentors,
          dailyStudyHours: cmsData.dailyStudyHours,
          currentStreak: cmsData.currentStreak,
          longestStreak: cmsData.longestStreak,
          todaysGoalHours: cmsData.todaysGoalHours,
          weeklyGoalHours: cmsData.weeklyGoalHours,
          monthlyGoalHours: cmsData.monthlyGoalHours,
          studyTimeSeconds: cmsData.studyTimeSeconds,
          achievements: cmsData.achievements,
          resumeState: cmsData.resumeState,
          updatedAt: new Date()
        } 
      },
      { upsert: true, new: true }
    );
    
    return NextResponse.json({ success: true, updated });
  } catch (error: any) {
    console.error('Next.js Database Save Error:', error);
    return NextResponse.json({ error: 'Database synchronization failed: ' + error.message }, { status: 500 });
  }
}
```

---

## 3. Running Locally

1. **Start MongoDB locally**:
   - Ensure MongoDB community server is running on your machine:
     ```bash
     mongod
     ```
2. **Add Environment Variables**:
   - Create a file named `.env.local` inside your Next.js root folder:
     ```env
     MONGODB_URI="mongodb://localhost:27017/learning_cms"
     GEMINI_API_KEY="your-google-gemini-api-key"
     ```
3. **Launch Development Environment**:
   - Start the next server locally:
     ```bash
     npm run dev
     ```
   - Open your browser to `http://localhost:3000` to interact with your complete, fully local MongoDB learning space.

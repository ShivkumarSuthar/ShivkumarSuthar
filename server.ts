/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { MongoClient, Db } from 'mongodb';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = 3000;

// ==========================================
// MONGODB LAZY CONNECTION & FILE BACKUP HELPERS
// ==========================================

let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;

async function getDb(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI is not defined. Falling back to local filesystem storage.');
    return null;
  }
  
  if (!mongoDb) {
    try {
      console.log('Connecting to MongoDB...');
      mongoClient = new MongoClient(uri, {
        connectTimeoutMS: 5000,
        socketTimeoutMS: 5000,
      });
      await mongoClient.connect();
      const dbName = uri.split('/').pop()?.split('?')[0] || 'learning_cms';
      mongoDb = mongoClient.db(dbName);
      console.log(`Successfully connected to MongoDB database: ${dbName}`);
    } catch (err) {
      console.error('Failed to connect to MongoDB, falling back to local file backup:', err);
      return null;
    }
  }
  return mongoDb;
}

const BACKUP_FILE_PATH = path.join(process.cwd(), 'cms_backup_local.json');

function saveToLocalFile(data: any) {
  try {
    fs.writeFileSync(BACKUP_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Saved backup to local JSON file successfully.');
  } catch (err) {
    console.error('Failed to write local JSON backup file:', err);
  }
}

function loadFromLocalFile(): any | null {
  try {
    if (fs.existsSync(BACKUP_FILE_PATH)) {
      const content = fs.readFileSync(BACKUP_FILE_PATH, 'utf-8');
      console.log('Loaded backup from local JSON file successfully.');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed to read local JSON backup file:', err);
  }
  return null;
}

// Parse incoming payloads
app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Gemini client to prevent startup crashes if key is initially absent
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY is missing. Please configure it in your Settings > Secrets panel.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

/**
 * Robust wrapper to call Gemini generateContent with automatic retry and model fallback.
 * If 503/429/high demand or other transient errors occur, we retry,
 * and if retries are exhausted, we fallback to gemini-3.1-flash-lite.
 */
async function generateContentWithRetry(params: any, maxRetries = 2, delayMs = 1500) {
  const modelsToTry = [params.model || 'gemini-3.5-flash', 'gemini-3.1-flash-lite'];
  
  for (let mIdx = 0; mIdx < modelsToTry.length; mIdx++) {
    const currentModel = modelsToTry[mIdx];
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Calling Gemini with model: ${currentModel} (Attempt ${attempt + 1}/${maxRetries + 1})`);
        const ai = getAi();
        const response = await ai.models.generateContent({
          ...params,
          model: currentModel,
        });
        return response;
      } catch (error: any) {
        console.error(`Gemini call failed on model ${currentModel}, attempt ${attempt + 1}:`, error);
        
        const isUnavailable = 
          error?.status === 503 || 
          error?.status === 429 || 
          error?.code === 503 ||
          error?.code === 429 ||
          error?.statusCode === 503 ||
          error?.statusCode === 429 ||
          (error?.message && (
            error.message.includes('503') || 
            error.message.includes('429') || 
            error.message.includes('high demand') || 
            error.message.includes('UNAVAILABLE') ||
            error.message.includes('resource exhausted')
          ));

        if (isUnavailable) {
          if (attempt < maxRetries) {
            console.warn(`Retrying in ${delayMs}ms due to transient error...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            continue;
          }
          // Out of retries for this model, try next model if available
          if (mIdx < modelsToTry.length - 1) {
            console.warn(`Model ${currentModel} exhausted retries. Switching to fallback model: ${modelsToTry[mIdx + 1]}`);
            break; // Break retry loop, moves to next model in modelsToTry
          }
        }
        // If it's some other non-transient error, or we ran out of options entirely
        throw error;
      }
    }
  }
  throw new Error("All attempts and fallback models exhausted for Gemini generation.");
}

// ==========================================
// API ENDPOINTS FOR INTERACTIVE LMS WORKSPACE
// ==========================================

/**
 * 0. Retrieve and Persist Course/LMS Data (MongoDB + Local Filesystem Fallback)
 */
app.get('/api/cms/data', async (req, res) => {
  try {
    const db = await getDb();
    if (db) {
      const collection = db.collection('cms_data');
      const doc = await collection.findOne({ userId: 'default-user' });
      if (doc && doc.cmsData) {
        console.log('Successfully retrieved CMS data from MongoDB');
        return res.json(doc.cmsData);
      }
    }
    
    // Fallback to local file if MongoDB is not connected or document not found
    const fileData = loadFromLocalFile();
    if (fileData) {
      return res.json(fileData);
    }

    // No data yet, return null so frontend can init with defaults
    return res.json(null);
  } catch (error: any) {
    console.error('Error fetching CMS data from database:', error);
    res.status(500).json({ error: 'Failed to retrieve CMS data' });
  }
});

app.post('/api/cms/data', async (req, res) => {
  try {
    const { cmsData } = req.body;
    if (!cmsData) {
      return res.status(400).json({ error: 'Missing cmsData in request body' });
    }

    // Always keep a local JSON backup as a double-safety measure
    saveToLocalFile(cmsData);

    let savedToMongo = false;
    const db = await getDb();
    if (db) {
      const collection = db.collection('cms_data');
      await collection.updateOne(
        { userId: 'default-user' },
        { $set: { userId: 'default-user', cmsData, updatedAt: new Date() } },
        { upsert: true }
      );
      console.log('Successfully saved CMS data to MongoDB');
      savedToMongo = true;
    }

    res.json({
      success: true,
      persisted: savedToMongo ? 'mongodb' : 'local_file_only'
    });
  } catch (error: any) {
    console.error('Error saving CMS data to database:', error);
    res.status(500).json({ error: 'Failed to save CMS data: ' + error.message });
  }
});

/**
 * 1. Generate Lesson / Chapter Summary
 */
app.post('/api/gemini/summarize', async (req, res) => {
  try {
    const { title, notes, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Lesson title is required for generating summary.' });
    }

    const prompt = `
      You are a brilliant computer science teacher and professional mentor.
      Provide a highly-structured, comprehensive, and clear learning summary of the lesson.
      
      Lesson Title: ${title}
      Description: ${description || 'No description provided.'}
      Notes / Material Content: 
      ---
      ${notes || 'No custom notes provided yet. Synthesize summary from the title.'}
      ---

      The summary must be styled using standard Markdown and include:
      1. **Core Summary**: A 2-3 paragraph breakdown of the main objectives.
      2. **Key Concepts**: Bulleted list explaining critical takeaways, terminology, or paradigms.
      3. **Code Syntax Example** (if programming) or **Workflow/Schema Illustration**: Clear code or text diagram.
      4. **Further Learning Tips**: 2-3 actionable next steps to practice this content.
      
      Output only beautiful, high-contrast, clean Markdown. Do not include meta text or greeting lines.
    `;

    const response = await generateContentWithRetry({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    res.json({ summary: response.text });
  } catch (error: any) {
    console.error('Summarize error:', error);
    res.status(500).json({ 
      error: error?.message || 'Failed to generate summary using Gemini.',
      isMock: true,
      summary: `### Lesson Summary (AI Offline Fallback)

We couldn't connect to Gemini. Here is a baseline study guide:

* **Topic**: *${req.body.title || 'Selected Topic'}*
* **Core Takeaway**: This module is part of your custom roadmap. Focus on understand the core syntax patterns and completing your homework todos.
* **Troubleshooting**: If you are hosting this application, ensure that you have added your \`GEMINI_API_KEY\` to the application environment secrets.
`
    });
  }
});

/**
 * 2. Generate Lesson / Chapter Quiz Questions
 */
app.post('/api/gemini/quiz', async (req, res) => {
  try {
    const { title, notes, count = 5, difficulty = 'Medium', types = ['MCQ'] } = req.body;
    const qCount = Math.min(Math.max(1, Number(count)), 10);

    const prompt = `
      Create an interactive academic quiz testing a student's knowledge on: "${title}".
      Target Difficulty: ${difficulty}
      Target Question Types to include/synthesize: ${types.join(', ')}
      
      Lesson material references:
      ---
      ${notes || 'No explicit study materials provided.'}
      ---

      Generate exactly ${qCount} quiz questions. Each question must have:
      - question: The query string (clearly indicate if it's a Coding task, Scenario, Fill-in-the-blank, or MCQ)
      - options: exactly 2 options if True/False (["True", "False"]), or 4 plausible option strings for others.
      - correctIndex: 0-indexed number representing the correct choice
      - explanation: brief explanation explaining why this is correct and why other options are incorrect or suboptimal
      - type: string indicating the question type (e.g., 'MCQ', 'True/False', 'Coding', 'Scenario', 'Fill in the blanks')

      Return ONLY a JSON array matching this schema. Do not wrap in markdown code blocks or add extra text.
    `;

    const response = await generateContentWithRetry({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              type: { type: Type.STRING }
            },
            required: ['question', 'options', 'correctIndex', 'explanation', 'type']
          }
        }
      }
    });

    const jsonStr = response.text || '[]';
    res.json(JSON.parse(jsonStr));
  } catch (error: any) {
    console.error('Quiz generator error:', error);
    const mockQuiz = [
      {
        question: `[MCQ] What is the primary role of an LMS (Learning Management System) for tracking your progress on: ${req.body.title || 'Course'}?`,
        options: [
          "To automatically execute code inside the database and build your app",
          "To manage curriculum modules, organize lessons, keep study logs, and test your comprehension",
          "To host YouTube videos natively without needing an internet connection",
          "To act as a physical textbook replacement in offline classrooms"
        ],
        correctIndex: 1,
        explanation: "An LMS serves as your primary track organizer, letting you structure modules, save notes, track progress, and take evaluations.",
        type: 'MCQ'
      },
      {
        question: `[True/False] Active recall through testing and building small projects yields significantly higher retention than passive reading.`,
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Active recall is scientifically proven to reinforce memory pathways far better than passive review.",
        type: 'True/False'
      }
    ];
    res.json(mockQuiz);
  }
});

/**
 * 2b. AI Generated Study Track
 * Generates an entire modular syllabus based on topic, skill level, and goals.
 */
app.post('/api/gemini/generate-track', async (req, res) => {
  try {
    const { topic, skillLevel, goal } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required to generate study track' });
    }

    const prompt = `
      You are an elite academic syllabus designer and professional developer.
      Design a comprehensive learning roadmap for: "${topic}".
      Target Skill Level: ${skillLevel || 'Beginner'}
      Target Learning Goal: ${goal || 'Mastery and hands-on portfolio projects'}

      Create a 3-module study track structure. Each module must contain 1-2 chapters. Each chapter must contain 2-3 specific, progressive lessons.
      Make sure to populate realistic lesson notes in Markdown (formulas, initial templates, study guides, and steps) to make the lessons highly practical.

      Provide estimated lesson durations in minutes (typically 15 to 45).
      Generate realistic YouTube or video references, or PDF resource links where relevant, but always keep them structurally sound.

      Return a JSON array of Modules. Each Module must match:
      {
        "title": "Module Title",
        "description": "Module objectives summary",
        "chapters": [
          {
            "title": "Chapter Title",
            "lessons": [
              {
                "title": "Lesson Title",
                "duration": 30,
                "notes": "Rich initial Markdown learning notes, code templates, or formulas...",
                "tags": ["tag1", "tag2"],
                "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                "pdfUrl": "",
                "resourceLink": "https://developer.mozilla.org/en-US/"
              }
            ]
          }
        ]
      }

      Return ONLY the raw JSON array. No markdown wraps or extra descriptions.
    `;

    const response = await generateContentWithRetry({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              chapters: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    lessons: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          duration: { type: Type.INTEGER },
                          notes: { type: Type.STRING },
                          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                          videoUrl: { type: Type.STRING },
                          pdfUrl: { type: Type.STRING },
                          resourceLink: { type: Type.STRING }
                        },
                        required: ['title', 'duration', 'notes', 'tags']
                      }
                    }
                  },
                  required: ['title', 'lessons']
                }
              }
            },
            required: ['title', 'description', 'chapters']
          }
        }
      }
    });

    const track = JSON.parse(response.text || '[]');
    res.json(track);
  } catch (error: any) {
    console.error('Track generation error:', error);
    // Dynamic mock fallback based on user topic
    const fallbackTrack = [
      {
        title: `Module 1: Introduction to ${req.body.topic || 'Subject'}`,
        description: 'Establish core foundations, terms, and environment setup.',
        chapters: [
          {
            title: 'Foundations & Basic Concepts',
            lessons: [
              {
                title: 'Overview and Architecture',
                duration: 20,
                notes: `### Overview of ${req.body.topic || 'Subject'}\n\nWelcome! This lesson establishes crucial concepts, syntax frameworks, and key performance practices. Use your IDE or scratchpad to build along.`,
                tags: ['foundations', 'intro'],
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
              },
              {
                title: 'Practical Hands-on Setup',
                duration: 30,
                notes: `### Setting up your environment\n\n1. Install dependencies and core files.\n2. Write your first greeting program.\n3. Verify console or logging output.`,
                tags: ['setup', 'practical']
              }
            ]
          }
        ]
      },
      {
        title: 'Module 2: Advanced Integrations & Architecture',
        description: 'Optimizing and scaling layouts, databases, or algorithms.',
        chapters: [
          {
            title: 'Mastering Advanced Mechanics',
            lessons: [
              {
                title: 'Performance Tuning & Safety',
                duration: 40,
                notes: `### Optimizing Performance\n\nAvoid redundant renderings, check data indexes, and maintain clean memory bounds.`,
                tags: ['performance', 'advanced']
              }
            ]
          }
        ]
      }
    ];
    res.json(fallbackTrack);
  }
});

/**
 * 2c. Generate Lesson Notes
 * Creates flashcards, detailed notes, formulas, cheat sheets, or summaries in beautiful Markdown.
 */
app.post('/api/gemini/generate-notes', async (req, res) => {
  try {
    const { title, notes, type = 'detailed' } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const prompt = `
      You are an expert tutor in an AI-powered LMS.
      Generate a customized study note document for the lesson: "${title}".
      Target Format Type: "${type}" (e.g., short notes, detailed notes, revision notes, flashcards, important formulas, cheatsheet)
      
      Here is the available lesson context / references:
      ---
      ${notes || 'No notes provided. Use your general expertise to construct high-quality, practical notes.'}
      ---

      Based on this, generate a highly structured, beautiful, and comprehensive Markdown document.
      If "flashcards": format them beautifully using custom headers or bold text blocks like **Q: ...** and *A: ...*.
      If "formulas": write clear math formulas or syntax cheat sheets.
      If "cheatsheet": provide a quick reference table or bulleted layout.

      Return ONLY beautiful, clean Markdown text. Do not wrap in extra metadata.
    `;

    const response = await generateContentWithRetry({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    res.json({ notes: response.text });
  } catch (error: any) {
    console.error('Notes generator error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate custom notes.',
      notes: `### ${req.body.type?.toUpperCase() || 'Study Notes'} (Offline Fallback)
      
Could not connect to Gemini. Here is a baseline cheat sheet for **${req.body.title}**:

* **Important Terminology**: Understand key components and syntax structures.
* **Recall Strategy**: Repeat quizzes, build side projects, and use flashcards to reinforce knowledge.
* **Setup Warning**: Make sure your \`GEMINI_API_KEY\` is added to enable dynamic AI notes generation.`
    });
  }
});

/**
 * 2d. Course Level Test / Final Assessment
 * Generates an exam based on all progressive lessons in the course.
 */
app.post('/api/gemini/course-assessment', async (req, res) => {
  let lessons: any[] = [];
  try {
    const courseTitle = req.body.courseTitle || req.body.title || "Selected Track";
    const modules = req.body.modules || [];
    lessons = req.body.lessons || [];
    
    if (modules.length > 0 && lessons.length === 0) {
      lessons = modules.flatMap((m: any) => m.chapters?.flatMap((c: any) => c.lessons || []) || []);
    }

    const qCount = Math.min(Math.max(5, Number(req.body.count || 10)), 30);
    const difficulty = req.body.difficulty || 'Medium';

    const lessonSummary = lessons.map((l: any) => `- Lesson: "${l.title}"`).join('\n');

    const prompt = `
      You are the head of student evaluations at an AI-powered Learning Platform.
      Generate a Final AI Assessment for the course: "${courseTitle}".
      Target Difficulty: ${difficulty}
      Target Number of Questions: ${qCount}

      The course contains the following lessons:
      ---
      ${lessonSummary || 'General comprehensive curriculum.'}
      ---

      Generate a comprehensive list of ${qCount} diverse multiple-choice exam questions spanning these topics.
      Each question must map to one of the lessons listed above so that we can grade the student's performance lesson-by-lesson.

      Return exactly ${qCount} items as a JSON array. Each question object must have:
      - question: The query string (clear, academic, and rigorous)
      - options: exactly 4 plausible option strings
      - correctIndex: 0-indexed correct index
      - explanation: brief explanation explaining why this is correct
      - lessonRef: The exact title of the lesson this question belongs to (must match one of the lesson titles provided or be closely related)

      Return ONLY the JSON array matching this schema. No markdown wrappers or extra text.
    `;

    const response = await generateContentWithRetry({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              lessonRef: { type: Type.STRING }
            },
            required: ['question', 'options', 'correctIndex', 'explanation', 'lessonRef']
          }
        }
      }
    });

    const jsonStr = response.text || '[]';
    res.json(JSON.parse(jsonStr));
  } catch (error: any) {
    console.error('Course assessment error:', error);
    // Generic high-quality fallback exam
    const mockExam = [
      {
        question: `What is the most effective approach to designing scalable, maintainable architectures?`,
        options: [
          "Code everything in a single, massive file to avoid path resolution errors",
          "Adhere to modular separation of concerns, declare types early, and isolate utilities",
          "Rely entirely on browser local storage without any backing database tables",
          "Skip planning and write code immediately"
        ],
        correctIndex: 1,
        explanation: "Modular separation of concerns and clean typing ensures scalability and prevent token issues or unmanageable code bases.",
        lessonRef: lessons[0]?.title || "General Architecture"
      },
      {
        question: `How does continuous assessment help optimize learning outcomes?`,
        options: [
          "It highlights weak areas and provides target revision suggestions to optimize retention",
          "It forces students to memorize files verbatim",
          "It replaces the need to write any hands-on code",
          "It acts as a simple file upload placeholder"
        ],
        correctIndex: 0,
        explanation: "Continuous assessments provide analytics on performance, helping guide targeted revision.",
        lessonRef: lessons[1]?.title || "Progress Tracking"
      }
    ];
    res.json(mockExam);
  }
});

/**
 * 3. Chat Q&A - Ask questions about lesson material
 */
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { 
      title, 
      notes, 
      query, 
      history = [],
      videoUrl,
      pdfUrl,
      imageUrl,
      resourceLink,
      attachments = [],
      tags = []
    } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'User query/question is required.' });
    }

    const ai = getAi();
    
    // Construct robust context of lesson resources
    let resourceDetails = '';
    if (videoUrl) resourceDetails += `- Video Lesson Source URL: ${videoUrl}\n`;
    if (pdfUrl) resourceDetails += `- Embedded PDF / Document: ${pdfUrl}\n`;
    if (imageUrl) resourceDetails += `- Illustrated Diagram/Image: ${imageUrl}\n`;
    if (resourceLink) resourceDetails += `- Study Resource URL: ${resourceLink}\n`;
    if (attachments && attachments.length > 0) {
      resourceDetails += `- Supplementary Attachments:\n  ${attachments.map((a: string) => `* ${a}`).join('\n  ')}\n`;
    }
    if (tags && tags.length > 0) {
      resourceDetails += `- Relevant Tags & Concepts: ${tags.join(', ')}\n`;
    }

    const systemInstruction = `You are a world-class AI Academic Tutor specialized in explaining, providing relevant analogies, and answering questions about this lesson: "${title}".

CRITICAL DIRECTIVES:
1. Ground your explanations, analogies, and answers EXCLUSIVELY on the loaded lesson content, notes, and linked resources provided in the context.
2. If the user asks about topics completely unrelated to this lesson or its materials, politely decline to answer and guide them back to the active study syllabus.
3. Be encouraging, clear, and highly practical. Use creative analogies derived from the lesson context to explain complex details.
4. Keep explanations formatted with clear headings, bullets, and elegant, high-contrast markdown. No meta-commentary.`;

    let contextPrompt = `
--- STUDY LESSON CONTEXT ---
Lesson Title: ${title}

Available Lesson Notes & Materials:
---
${notes || 'No study notes have been compiled yet for this lesson.'}
---

Lesson Resources & Metadata:
${resourceDetails || 'No auxiliary resources linked.'}
----------------------------

Current Student Question/Query: "${query}"

Please reply according to your critical directives (grounding answers/analogies exclusively in the lesson content, or politely declining if unrelated).`;

    // Attempt to call Gemini using the primary model and fallback model if unavailable
    let replyText = '';
    const modelsToTry = ['gemini-3.5-flash', 'gemini-3.1-flash-lite'];
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        console.log(`Tutor chat calling Gemini with model: ${model}`);
        const chat = ai.chats.create({
          model: model,
          config: {
            systemInstruction: systemInstruction,
          }
        });
        const response = await chat.sendMessage({ message: contextPrompt });
        replyText = response.text || '';
        break; // Successfully got response, break out of loop
      } catch (err: any) {
        console.error(`Chat error on model ${model}:`, err);
        lastError = err;
        
        const isUnavailable = 
          err?.status === 503 || 
          err?.status === 429 || 
          err?.code === 503 ||
          err?.code === 429 ||
          err?.statusCode === 503 ||
          err?.statusCode === 429 ||
          (err?.message && (
            err.message.includes('503') || 
            err.message.includes('429') || 
            err.message.includes('high demand') || 
            err.message.includes('UNAVAILABLE') ||
            err.message.includes('resource exhausted')
          ));

        if (isUnavailable) {
          // Continue to next model
          continue;
        } else {
          // If it's a structural error (e.g. invalid query format), throw immediately
          throw err;
        }
      }
    }

    if (!replyText && lastError) {
      throw lastError;
    }

    res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Tutor chat error:', error);
    res.status(500).json({ 
      error: error?.message || 'Failed to get answer from AI Tutor.',
      isMock: true,
      reply: `### AI Assistant (Offline Mode)

I am currently running in offline mode. Here is standard guidance on **${req.body.title}**:

- **Study Strategy**: Try reviewing the material content listed above, checking off relevant todos, and testing yourself using the chapter test.
- **Troubleshooting**: Double-check that your \`GEMINI_API_KEY\` is active in the setting panel to talk live to Gemini!`
    });
  }
});

// ==========================================
// STATIC ASSET SERVING & VITE MIDDWARE
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server successfully started on http://localhost:${PORT}`);
  });
}

startServer();

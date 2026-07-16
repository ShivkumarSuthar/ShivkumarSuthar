import { NextResponse } from 'next/server';
import { Type } from '@google/genai';
import { generateContentWithRetry } from '../../../../lib/gemini';

export async function POST(request: Request) {
  let reqBody: any = {};
  try {
    reqBody = await request.json();
    const { topic, skillLevel, goal } = reqBody;
    if (!topic) {
      return NextResponse.json({ error: 'Topic is required to generate study track' }, { status: 400 });
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
    return NextResponse.json(track);
  } catch (error: any) {
    console.error('Track generation error:', error);
    // Dynamic mock fallback based on user topic
    const fallbackTrack = [
      {
        title: `Module 1: Introduction to ${reqBody?.topic || 'Subject'}`,
        description: 'Establish core foundations, terms, and environment setup.',
        chapters: [
          {
            title: 'Foundations & Basic Concepts',
            lessons: [
              {
                title: 'Overview and Architecture',
                duration: 20,
                notes: `### Overview of ${reqBody?.topic || 'Subject'}\n\nWelcome! This lesson establishes crucial concepts, syntax frameworks, and key performance practices. Use your IDE or scratchpad to build along.`,
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
    return NextResponse.json(fallbackTrack);
  }
}

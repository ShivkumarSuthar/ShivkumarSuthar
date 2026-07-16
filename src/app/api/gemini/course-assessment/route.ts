import { NextResponse } from 'next/server';
import { Type } from '@google/genai';
import { generateContentWithRetry } from '../../../../lib/gemini';

export async function POST(request: Request) {
  let reqBody: any = {};
  let lessons: any[] = [];
  try {
    reqBody = await request.json();
    const courseTitle = reqBody.courseTitle || reqBody.title || "Selected Track";
    const modules = reqBody.modules || [];
    lessons = reqBody.lessons || [];
    
    if (modules.length > 0 && lessons.length === 0) {
      lessons = modules.flatMap((m: any) => m.chapters?.flatMap((c: any) => c.lessons || []) || []);
    }

    const qCount = Math.min(Math.max(5, Number(reqBody.count || 10)), 30);
    const difficulty = reqBody.difficulty || 'Medium';

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
    return NextResponse.json(JSON.parse(jsonStr));
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
    return NextResponse.json(mockExam);
  }
}

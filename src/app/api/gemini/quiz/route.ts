import { NextResponse } from 'next/server';
import { Type } from '@google/genai';
import { generateContentWithRetry } from '../../../../lib/gemini';

export async function POST(request: Request) {
  let reqBody: any = {};
  try {
    reqBody = await request.json();
    const { title, notes, count = 5, difficulty = 'Medium', types = ['MCQ'] } = reqBody;
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
    return NextResponse.json(JSON.parse(jsonStr));
  } catch (error: any) {
    console.error('Quiz generator error:', error);
    const mockQuiz = [
      {
        question: `[MCQ] What is the primary role of an LMS (Learning Management System) for tracking your progress on: ${reqBody?.title || 'Course'}?`,
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
    return NextResponse.json(mockQuiz);
  }
}

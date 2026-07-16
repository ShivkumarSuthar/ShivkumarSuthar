import { NextResponse } from 'next/server';
import { generateContentWithRetry } from '../../../../lib/gemini';

export async function POST(request: Request) {
  let reqBody: any = {};
  try {
    reqBody = await request.json();
    const { title, notes, type = 'detailed' } = reqBody;
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
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

    return NextResponse.json({ notes: response.text });
  } catch (error: any) {
    console.error('Notes generator error:', error);
    return NextResponse.json({
      error: error?.message || 'Failed to generate custom notes.',
      notes: `### ${reqBody?.type?.toUpperCase() || 'Study Notes'} (Offline Fallback)
      
Could not connect to Gemini. Here is a baseline cheat sheet for **${reqBody?.title}**:

* **Important Terminology**: Understand key components and syntax structures.
* **Recall Strategy**: Repeat quizzes, build side projects, and use flashcards to reinforce knowledge.
* **Setup Warning**: Make sure your \`GEMINI_API_KEY\` is added to enable dynamic AI notes generation.`
    });
  }
}

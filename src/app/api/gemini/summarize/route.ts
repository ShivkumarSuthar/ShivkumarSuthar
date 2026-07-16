import { NextResponse } from 'next/server';
import { generateContentWithRetry } from '../../../../lib/gemini';

export async function POST(request: Request) {
  let reqBody: any = {};
  try {
    reqBody = await request.json();
    const { title, notes, description } = reqBody;
    if (!title) {
      return NextResponse.json({ error: 'Lesson title is required for generating summary.' }, { status: 400 });
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

    return NextResponse.json({ summary: response.text });
  } catch (error: any) {
    console.error('Summarize error:', error);
    return NextResponse.json({ 
      error: error?.message || 'Failed to generate summary using Gemini.',
      isMock: true,
      summary: `### Lesson Summary (AI Offline Fallback)

We couldn't connect to Gemini. Here is a baseline study guide:

* **Topic**: *${reqBody?.title || 'Selected Topic'}*
* **Core Takeaway**: This module is part of your custom roadmap. Focus on understand the core syntax patterns and completing your homework todos.
* **Troubleshooting**: If you are hosting this application, ensure that you have added your \`GEMINI_API_KEY\` to the application environment secrets.
`
    });
  }
}

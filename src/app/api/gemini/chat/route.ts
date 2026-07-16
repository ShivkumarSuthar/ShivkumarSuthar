import { NextResponse } from 'next/server';
import { getAi } from '../../../../lib/gemini';

export async function POST(request: Request) {
  let reqBody: any = {};
  try {
    reqBody = await request.json();
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
    } = reqBody;

    if (!query) {
      return NextResponse.json({ error: 'User query/question is required.' }, { status: 400 });
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
          continue;
        } else {
          throw err;
        }
      }
    }

    if (!replyText && lastError) {
      throw lastError;
    }

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error('Tutor chat error:', error);
    return NextResponse.json({ 
      error: error?.message || 'Failed to get answer from AI Tutor.',
      isMock: true,
      reply: `### AI Assistant (Offline Mode)

I am currently running in offline mode. Here is standard guidance on **${reqBody?.title || 'Selected Topic'}**:

- **Study Strategy**: Try reviewing the material content listed above, checking off relevant todos, and testing yourself using the chapter test.
- **Troubleshooting**: Double-check that your \`GEMINI_API_KEY\` is active in the setting panel to talk live to Gemini!`
    });
  }
}

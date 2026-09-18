import { randomUUID } from "crypto";
import { auth } from "@/auth";
import { Course, connectMongo } from "@/lib/mongodb";
import { USER_ERRORS, jsonError } from "@/lib/user-errors";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user.id;
}

export async function GET() {
  try {
    const userId = await requireUserId();
    if (!userId) return jsonError(USER_ERRORS.unauthorized, 401);

    await connectMongo();
    const courses = await Course.find({ userId }).sort({ updatedAt: -1 }).lean();
    return Response.json({
      courses: JSON.parse(JSON.stringify(courses)),
    });
  } catch (error) {
    console.error("GET /api/study/courses", error);
    return jsonError(USER_ERRORS.loadCourses, 500);
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    if (!userId) return jsonError(USER_ERRORS.unauthorized, 401);

    const body = await request.json();
    const title = String(body.title || "").trim();
    if (!title) return jsonError(USER_ERRORS.titleRequired, 400);

    await connectMongo();
    const course = await Course.create({
      userId,
      title,
      description: String(body.description || ""),
      tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
      saved: true,
      planDate: String(body.planDate || ""),
      planNotes: String(body.planNotes || ""),
      lessons: Array.isArray(body.lessons)
        ? body.lessons.map(
            (
              lesson: {
                title?: string;
                type?: string;
                contentUrl?: string;
                contentText?: string;
                practiceEnv?: string;
                order?: number;
              },
              index: number,
            ) => ({
              id: randomUUID(),
              title: String(lesson.title || `Lesson ${index + 1}`),
              type: ["video", "document", "article", "practice"].includes(
                String(lesson.type),
              )
                ? lesson.type
                : "article",
              contentUrl: lesson.contentUrl || "",
              contentText: lesson.contentText || "",
              practiceEnv: ["javascript", "react", "html-css"].includes(
                String(lesson.practiceEnv),
              )
                ? lesson.practiceEnv
                : "javascript",
              completed: false,
              order: lesson.order ?? index,
            }),
          )
        : [],
    });

    return Response.json(
      { course: JSON.parse(JSON.stringify(course)) },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/study/courses", error);
    return jsonError(USER_ERRORS.createCourse, 500);
  }
}

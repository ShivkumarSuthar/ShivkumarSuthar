import { randomUUID } from "crypto";
import { auth } from "@/auth";
import { Course, connectMongo } from "@/lib/mongodb";
import { USER_ERRORS, jsonError } from "@/lib/user-errors";

type Params = { params: Promise<{ id: string }> };

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user.id;
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const userId = await requireUserId();
    if (!userId) return jsonError(USER_ERRORS.unauthorized, 401);

    const { id } = await params;
    await connectMongo();
    const course = await Course.findOne({ _id: id, userId }).lean();
    if (!course) return jsonError(USER_ERRORS.notFound, 404);

    return Response.json({ course: JSON.parse(JSON.stringify(course)) });
  } catch (error) {
    console.error("GET course", error);
    return jsonError(USER_ERRORS.loadCourse, 500);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const userId = await requireUserId();
    if (!userId) return jsonError(USER_ERRORS.unauthorized, 401);

    const { id } = await params;
    const body = await request.json();
    await connectMongo();

    const course = await Course.findOne({ _id: id, userId });
    if (!course) return jsonError(USER_ERRORS.notFound, 404);

    if (typeof body.title === "string") course.title = body.title.trim() || course.title;
    if (typeof body.description === "string") course.description = body.description;
    if (Array.isArray(body.tags)) course.tags = body.tags.map(String);
    if (typeof body.saved === "boolean") course.saved = body.saved;
    if (typeof body.planDate === "string") course.planDate = body.planDate;
    if (typeof body.planNotes === "string") course.planNotes = body.planNotes;

    if (body.addLesson) {
      const lesson = body.addLesson;
      course.lessons.push({
        id: randomUUID(),
        title: String(lesson.title || "New lesson"),
        type: ["video", "document", "article", "practice"].includes(String(lesson.type))
          ? lesson.type
          : "article",
        contentUrl: String(lesson.contentUrl || ""),
        contentText: String(lesson.contentText || ""),
        practiceEnv: ["javascript", "react", "html-css"].includes(
          String(lesson.practiceEnv),
        )
          ? lesson.practiceEnv
          : "javascript",
        completed: false,
        order: course.lessons.length,
      });
    }

    if (body.toggleLessonId) {
      const lesson = course.lessons.find((item) => item.id === body.toggleLessonId);
      if (lesson) lesson.completed = !lesson.completed;
    }

    if (body.updateLesson) {
      const lesson = course.lessons.find((item) => item.id === body.updateLesson.id);
      if (lesson) {
        if (typeof body.updateLesson.title === "string") {
          lesson.title = body.updateLesson.title;
        }
        if (typeof body.updateLesson.contentUrl === "string") {
          lesson.contentUrl = body.updateLesson.contentUrl;
        }
        if (typeof body.updateLesson.contentText === "string") {
          lesson.contentText = body.updateLesson.contentText;
        }
        if (typeof body.updateLesson.type === "string") {
          lesson.type = body.updateLesson.type;
        }
        if (typeof body.updateLesson.practiceEnv === "string") {
          lesson.practiceEnv = body.updateLesson.practiceEnv;
        }
      }
    }

    if (body.removeLessonId) {
      course.lessons.pull({ id: body.removeLessonId });
    }

    await course.save();
    return Response.json({ course: JSON.parse(JSON.stringify(course)) });
  } catch (error) {
    console.error("PATCH course", error);
    return jsonError(USER_ERRORS.updateCourse, 500);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const userId = await requireUserId();
    if (!userId) return jsonError(USER_ERRORS.unauthorized, 401);

    const { id } = await params;
    await connectMongo();
    const result = await Course.deleteOne({ _id: id, userId });
    if (!result.deletedCount) return jsonError(USER_ERRORS.notFound, 404);

    return Response.json({ ok: true });
  } catch (error) {
    console.error("DELETE course", error);
    return jsonError(USER_ERRORS.deleteCourse, 500);
  }
}

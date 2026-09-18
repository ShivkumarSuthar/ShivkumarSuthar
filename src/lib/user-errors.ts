import { NextResponse } from "next/server";

/** Safe messages shown to end users — never mention infra, env, or stack details. */
export const USER_ERRORS = {
  generic: "Something went wrong. Please try again.",
  validationAuth: "Enter a valid email and a password with at least 6 characters.",
  emailTaken: "An account with this email already exists. Try signing in instead.",
  registerFailed: "We couldn't create your account. Please try again.",
  unauthorized: "Please sign in to continue.",
  notFound: "We couldn't find what you're looking for.",
  titleRequired: "Please add a course title.",
  loadCourses: "We couldn't load your courses. Please try again.",
  createCourse: "We couldn't create that course. Please try again.",
  loadCourse: "We couldn't open that course. Please try again.",
  updateCourse: "We couldn't save your changes. Please try again.",
  deleteCourse: "We couldn't delete that course. Please try again.",
} as const;

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

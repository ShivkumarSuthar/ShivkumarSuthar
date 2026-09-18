import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { createUser, findUserByEmail, checkNameExists, generateUsernameSuggestions } from "@/lib/mongodb";
import { USER_ERRORS, jsonError } from "@/lib/user-errors";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const identifier = String(body.email || "").trim();
    const password = String(body.password || "");

    if (!identifier || password.length < 6) {
      return jsonError(USER_ERRORS.validationAuth, 400);
    }

    let emailToSave = "";
    let nameToSave: string | null = null;

    if (identifier.includes("@")) {
      emailToSave = identifier.toLowerCase();
      if (await findUserByEmail(emailToSave)) {
        return jsonError(USER_ERRORS.emailTaken, 409);
      }
    } else {
      nameToSave = identifier;
      emailToSave = `${identifier.toLowerCase()}@study.local`;
      if (await checkNameExists(nameToSave)) {
        const suggestions = await generateUsernameSuggestions(nameToSave);
        return Response.json({
          error: "Username is already taken.",
          suggestions,
        }, { status: 409 });
      }
    }

    await createUser({
      id: randomUUID(),
      email: emailToSave,
      name: nameToSave,
      passwordHash: await bcrypt.hash(password, 10),
      provider: "credentials",
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("register", error);
    return jsonError(USER_ERRORS.registerFailed, 500);
  }
}

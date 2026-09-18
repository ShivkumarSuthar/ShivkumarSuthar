import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

declare global {
  var __mongooseConn: Promise<typeof mongoose> | undefined;
}

function resolveMongoUri() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) return "";

  // Atlas URI may omit the DB name — default to shivkumar_study.
  try {
    const parsed = new URL(uri);
    if (!parsed.pathname || parsed.pathname === "/") {
      parsed.pathname = "/shivkumar_study";
    }
    if (!parsed.searchParams.has("retryWrites")) {
      parsed.searchParams.set("retryWrites", "true");
    }
    if (!parsed.searchParams.has("w")) {
      parsed.searchParams.set("w", "majority");
    }
    return parsed.toString();
  } catch {
    return uri;
  }
}

export async function connectMongo() {
  const uri = resolveMongoUri();
  if (!uri) {
    throw new Error("Database connection is not available");
  }
  if (!global.__mongooseConn) {
    global.__mongooseConn = mongoose.connect(uri);
  }
  await global.__mongooseConn;
}

const userSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, default: null },
    passwordHash: { type: String, default: null },
    image: { type: String, default: null },
    provider: { type: String, required: true, default: "credentials" },
  },
  { timestamps: true },
);

const accountSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
  },
  { timestamps: true },
);

accountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

const lessonSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["video", "document", "article", "practice"],
      required: true,
    },
    contentUrl: String,
    contentText: String,
    practiceEnv: {
      type: String,
      enum: ["javascript", "react", "html-css"],
      default: "javascript",
    },
    completed: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const courseSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    tags: { type: [String], default: [] },
    saved: { type: Boolean, default: true },
    planDate: { type: String, default: "" },
    planNotes: { type: String, default: "" },
    lessons: { type: [lessonSchema], default: [] },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
};
export type AccountDoc = InferSchemaType<typeof accountSchema> & {
  _id: mongoose.Types.ObjectId;
};
export type LessonDoc = InferSchemaType<typeof lessonSchema>;
export type CourseDoc = InferSchemaType<typeof courseSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const User: Model<UserDoc> =
  (mongoose.models.User as Model<UserDoc>) ||
  mongoose.model<UserDoc>("User", userSchema);

export const Account: Model<AccountDoc> =
  (mongoose.models.Account as Model<AccountDoc>) ||
  mongoose.model<AccountDoc>("Account", accountSchema);

export const Course: Model<CourseDoc> =
  (mongoose.models.Course as Model<CourseDoc>) ||
  mongoose.model<CourseDoc>("Course", courseSchema);

export async function findUserByEmail(email: string) {
  await connectMongo();
  return User.findOne({ email: email.toLowerCase() }).lean();
}

export async function findUserByEmailOrName(identifier: string) {
  await connectMongo();
  return User.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { name: { $regex: new RegExp(`^${identifier}$`, 'i') } }
    ]
  }).lean();
}

export async function checkNameExists(name: string) {
  await connectMongo();
  const user = await User.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } }).lean();
  return !!user;
}

export async function generateUsernameSuggestions(baseName: string): Promise<string[]> {
  await connectMongo();
  const suggestions: string[] = [];
  const suffixes = ['123', '99', '24', '_x', '007', '_dev', '2024'];
  let attempts = 0;
  
  while (suggestions.length < 3 && attempts < 15) {
    const suffix = suffixes[attempts] || Math.floor(Math.random() * 1000).toString();
    const testName = `${baseName}${suffix}`;
    const exists = await checkNameExists(testName);
    if (!exists) {
      suggestions.push(testName);
    }
    attempts++;
  }
  return suggestions;
}

export async function createUser(input: {
  id: string;
  email: string;
  name?: string | null;
  passwordHash?: string | null;
  image?: string | null;
  provider: string;
}) {
  await connectMongo();
  await User.create({
    id: input.id,
    email: input.email.toLowerCase(),
    name: input.name ?? null,
    passwordHash: input.passwordHash ?? null,
    image: input.image ?? null,
    provider: input.provider,
  });
}

export async function linkAccount(input: {
  id: string;
  userId: string;
  provider: string;
  providerAccountId: string;
}) {
  await connectMongo();
  await Account.updateOne(
    { provider: input.provider, providerAccountId: input.providerAccountId },
    {
      $setOnInsert: {
        id: input.id,
        userId: input.userId,
        provider: input.provider,
        providerAccountId: input.providerAccountId,
      },
    },
    { upsert: true },
  );
}

export async function findAccount(provider: string, providerAccountId: string) {
  await connectMongo();
  return Account.findOne({ provider, providerAccountId }).lean();
}

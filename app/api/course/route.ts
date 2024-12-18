import { db } from "@/lib/kysely";
import { sql } from "kysely";
import { auth } from "@/auth";

const COURSE_LOAD_AMOUNT = 2;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return Response.json({
      error: "No query provided",
    }, { status: 400 });
  }

  const courseBuffer = Number(searchParams.get("page")) || 1;

  const results = await db
    .selectFrom("Course")
    .where("code", "ilike", `%${query}%`)
    .innerJoin("School", "Course.schoolId", "School.id")
    .select([
      "Course.id",
      "Course.code",
      "Course.createdAt",
      "Course.updatedAt",
      "Course.schoolId",
      "Course.authorId",
      sql`
        json_build_object('id', "School"."id", 'name', "School"."name", 'location', "School"."location")
      `.as("school"),
    ])
    .limit(COURSE_LOAD_AMOUNT)
    .offset(COURSE_LOAD_AMOUNT * (courseBuffer - 1))
    .orderBy("Course.code")
    .execute();

  return Response.json({
    message: "Success",
    data: results,
  }, { status: 200 });
}

export async function POST(req: Request) {
  const { code, schoolId }: { code: string | null, schoolId: string | null} = await req.json();
  const session = await auth();

  if (!session || !session.user) {
    return Response.json({
      error: "Not authenticated",
    }, { status: 401 });
  }

  const authorId = session.user.id;

  if (!code?.trim() || !schoolId?.trim() || !authorId?.trim()) {
    return Response.json({
      error: "Missing required fields",
    }, { status: 400 });
  }

  const courseExists = await db
    .selectFrom("Course")
    .select("id")
    .where("code", "=", code)
    .where("schoolId", "=", schoolId)
    .executeTakeFirst();

  if (courseExists != null) {
    return Response.json({
      error: "Course already exists",
      courseId: courseExists.id,
    }, { status: 400 });
  }

  const coursesAddedLastDay = await db
    .selectFrom("Course")
    .select((eb) => eb.fn.count<number>("id").as("count"))
    .where("authorId", "=", authorId)
    .where("createdAt", ">=", new Date(Date.now() - 24 * 60 * 60 * 1000))
    .executeTakeFirst();
  
  if (coursesAddedLastDay && coursesAddedLastDay.count >= 3) {
    return Response.json({
      error: "You can only add 3 courses in a 24 hour period.",
      courseId: null,
    }, { status: 400 });
  }

  const result = await db
    .insertInto("Course")
    .values({ 
      id: crypto.randomUUID(), 
      code, 
      schoolId, 
      authorId, 
      updatedAt: new Date().toISOString() 
    })
    .returningAll()
    .executeTakeFirst();
  
  return Response.json({
    message: "Success",
    data: result,
  }, { status: 200 });
}
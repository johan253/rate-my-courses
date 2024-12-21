import { db } from "@/lib/kysely";
import type { School, Rating } from "@/lib/types";
import { sql } from "kysely";

export async function GET(req: Request, { params }: { params: Promise<{ id: string}>}) {
  const id = (await params).id;

  const course = await db
    .selectFrom("Course")
    .innerJoin("School", "Course.schoolId", "School.id")
    .leftJoin("Rating", "Course.id", "Rating.courseId")
    .select([
      "Course.id",
      "Course.code",
      "Course.schoolId",
      "Course.authorId",
      "Course.createdAt",
      "Course.updatedAt",
      sql<School>`
          json_build_object('id', "School".id, 'name', "School"."name", 'location', "School"."location")
        `.as("school"),
      sql<Rating[]>`
          COALESCE(
            json_agg(
              json_build_object(
                  'id', "Rating"."id", 
                  'rating', "Rating"."rating", 
                  'review', "Rating"."review", 
                  'courseId', "Rating"."courseId",
                  'authorId', "Rating"."authorId", 
                  'createdAt', "Rating"."createdAt",
                  'updatedAt', "Rating"."updatedAt"
              )
            ) FILTER (WHERE "Rating"."id" IS NOT NULL), '[]'::json
          )
        `.as("ratings")
    ])
    .where("Course.id", "=", id)
    .groupBy("Course.id")
    .groupBy("School.id")
    .executeTakeFirst();

  if (!course) {
    return Response.json({
      error: "Course not found",
    }, { status: 404 });
  }

  return Response.json({
    message: "Course found",
    data: course,
  }, { status: 200 });
}
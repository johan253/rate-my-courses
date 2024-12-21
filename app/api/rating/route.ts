import { db } from "@/lib/kysely";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return Response.json({
      error: "Not Authenticated",
    }, { status: 401 });
  }

  const { 
    courseId, 
    authorId, 
    rating, 
    review }: { 
    courseId: string, 
    authorId: string, 
    rating: number, 
    review: string }
    = await req.json();

  if (!courseId.trim() || !authorId.trim() || !rating || !review.trim()) {
    return Response.json({
      error: "Missing required fields",
      request: { courseId, authorId, rating, review },
    }, { status: 400 });
  }

  const alreadyRated = await db
    .selectFrom("Rating")
    .select("id")
    .where("authorId", "=", authorId)
    .where("courseId", "=", courseId)
    .execute();

  if (alreadyRated.length) {
    return Response.json({
      error: "You have already rated this course",
      request: { courseId, authorId, rating, review },
    }, { status: 403 });
  }

  const result = await db
    .insertInto("Rating")
    .values({ 
      id: crypto.randomUUID(), 
      courseId, 
      authorId, 
      rating, 
      review, 
      updatedAt: new Date().toISOString()
    })
    .executeTakeFirst();

  if (!result || !result.numInsertedOrUpdatedRows) {
    return Response.json({
      error: "An error occurred while creating the rating",
      request: { courseId, authorId, rating, review },
    }, { status: 500 });
  }
  
  revalidatePath(`/course/${courseId}`);
  return Response.json({
    message: "Rating created successfully",
  }, { status : 201});
}
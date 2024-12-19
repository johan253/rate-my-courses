import { auth } from "@/auth";
import { db } from "@/lib/kysely";
import { revalidatePath } from "next/cache";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string}>}) {
  const id = (await params).id;
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return Response.json({
      error: "Unauthorized",
      request: req,
      id: id ?? null,
    }, { status: 401 });
  }

  const rating = await db
    .selectFrom("Rating")
    .select(["id", "authorId", "courseId"])
    .where("id", "=", id)
    .executeTakeFirst();

  if (!rating) {
    return Response.json({
      error: "Not Found",
    }, { status: 404 });
  }
  if (rating.authorId !== session.user.id) {
    return Response.json({
      error: "Forbidden",
    }, { status: 403 });
  }

  await db.deleteFrom("Rating").where("id", "=", id).execute();

  revalidatePath(`/course/${rating.courseId}`);

  return Response.json({
    message: "Success",
    id,
  }, { status: 200 });
}
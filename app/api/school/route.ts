import { db } from "@/lib/kysely";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return Response.json({
      error: "No query 'q' provided",
    }, { status: 400 });
  }

  if (query.trim().length <= 4) {
    return Response.json({
      error: "Query must be at least 4 characters long",
    }, { status: 400 });
  }

  const result = await db
    .selectFrom("School")
    .selectAll()
    .where("name", "ilike", `%${query}%`)
    .execute();
  
  return Response.json({
    message: "Success",
    data: result,
  }, { status: 200 });
}
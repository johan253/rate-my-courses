// pages/me.tsx (Server Component)
"use server";

import { db } from "@/lib/kysely";
import type { Course, Rating } from "@/lib/types";
import { sql } from "kysely";

import RatingCard from "@/components/RatingCard";
import Button from "@/components/Button";
import Profile from "@/components/Profile";

import { auth } from "@/auth";

export default async function MePage() {
  const session = await auth();

  if (!session?.user) {
    // If the user is not logged in, you can redirect them or show a message
    return (
      <main className="flex flex-col items-center justify-center gap-6">
        <p className="text-xl">Please log in to view your Profile and Ratings.</p>
        <a href="/api/auth/signin?callbackUrl=/me">
          <Button variant="primary">Sign In</Button>
        </a>
      </main>
    );
  }
  // @ts-ignore
  const userRatings: (Rating & {course: Course})[] = await db
    .selectFrom("Rating")
    .select([
      "Rating.id",
      "Rating.rating",
      "Rating.review",
      "Rating.createdAt",
      "Rating.updatedAt",
      "Rating.authorId",
      "Rating.courseId",
      sql<Course>`
        json_build_object('id', "Course"."id", 'code', "Course"."code")
      `.as("course"),
    ])
    .where("Rating.authorId", "=", session.user.id || "")
    .innerJoin("Course", "Rating.courseId", "Course.id")
    .orderBy("Rating.createdAt", "desc")
    .execute();

  return (
    <main className="p-8">
      <Profile user={session.user} />
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
        <h1 className="text-2xl font-bold mb-4">My Ratings</h1>
        {userRatings.length === 0 ? (
          <p className="text-md">You haven&apos;t written any ratings yet.</p>
        ) : (
          <ul className="flex flex-col gap-6">
            {
              userRatings.map((rating) => (
                <RatingCard key={rating.id} rating={rating} >
                  <a href={`/course/${rating.courseId}`}
                    className="hover:font-bold">
                    {rating.course.code}
                  </a>
                </RatingCard>
              ))
            }
          </ul>
        )}
      </div>
    </main>
  );
}

import { db } from "@/lib/kysely";
import type { Course, School } from "@/lib/types";
import { sql } from "kysely";

import CourseCard from "@/components/CourseCard";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  // @ts-ignore
  const trendingCourses: (Course & {school: School, rating_ratio: number})[] = await db
    .selectFrom("Course")
    .innerJoin("School", "Course.schoolId", "School.id")
    .innerJoin("Rating", "Course.id", "Rating.courseId")
    .select([
      "Course.id",
      "Course.code",
      "Course.updatedAt",
      "Course.createdAt",
      "Course.schoolId",
      "Course.authorId",
      sql<School>`
        json_build_object('id', "School".id, 'name', "School"."name", 'location', "School"."location")
      `.as("school"),
      sql<number>`
        avg("Rating".rating)
      `.as("rating_ratio"),
    ])
    .where("Rating.createdAt", ">", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .orderBy("rating_ratio", "desc")
    .orderBy(sql`count("Rating".id)`, "desc")
    .limit(5)
    .groupBy("Course.id")
    .groupBy("School.id")
    .execute();

  const courseCards = trendingCourses.map((course) => (
    <CourseCard key={course.id} course={course} school={course.school} />
  )) || [];

  return (
    <main className="p-12">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Top 5 trending courses in the last Week
      </h1>
      <ul className="flex flex-col gap-6">
        {courseCards.length !== 0 ?
          (courseCards) : (<p className="text-center p-4">No trending courses...</p>)
        }
      </ul>
      <p className="italic text-gray-500 text-center p-4">
        Trending courses are based on the number and ratio of good reviews
      </p>
    </main>
  );
}
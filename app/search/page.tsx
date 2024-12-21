"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/kysely";
import type { Course, School } from "@/lib/types";
import { sql } from "kysely";
import CourseCard from "@/components/CourseCard";
import Link from "next/link";

const COURSE_LOAD_AMOUNT = 10;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = (searchParams.q as string)?.toUpperCase();
  const courseBuffer = (searchParams.page as string) ? Number(searchParams.page) : 1;
  if (!query || courseBuffer < 1) redirect("/");

  let totalCount = (await db
    .selectFrom("Course")
    .select((eb) => eb.fn.count<number>("id").as("count"))
    .where("code", "ilike", `%${query}%`)
    .executeTakeFirst())?.count;

  if (!totalCount) totalCount = 0;

  const totalPages = Math.ceil(totalCount / COURSE_LOAD_AMOUNT);

  if (totalPages > 0 && courseBuffer > totalPages) redirect("/");

  // @ts-ignore
  const results: (Course & {school: School})[] = await db
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
      sql<School>`
        json_build_object('id', "School"."id", 'name', "School"."name", 'location', "School"."location")
      `.as("school"),
    ])
    .limit(COURSE_LOAD_AMOUNT)
    .offset(COURSE_LOAD_AMOUNT * (courseBuffer - 1))
    .orderBy("Course.code")
    .execute();

  const courseCards = results.map((course) => {
    return (
      <CourseCard
        key={course.id}
        course={course}
        school={course.school}
      />
    );
  });

  return (
    <main className="p-12">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Search Results for &quot;{query}&quot;
      </h1>
      <ul className="flex flex-col items-center gap-6">
        {courseCards.length === 0 ? (
          <p className="text-xl">No results found</p>
        ) : (
          courseCards
        )}
      </ul>
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <ul className="flex space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;
              return (
                <li key={page}>
                  <Link
                    href={`?q=${encodeURIComponent(query)}&page=${page}`}
                    className={
                      `px-4 py-2 border border-blue-900 rounded-lg ${
                        courseBuffer === page ? 
                          "bg-blue-900 text-white hover:bg-blue-700" 
                          :
                          "bg-white text-blue-900 hover:bg-gray-100"}`
                    }
                  >
                    {page}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div className="flex flex-col items-center mt-8 gap-6">
        <h2 className="text-xl">
          Cant find what you&apos;re looking for?
        </h2>
        <Link
          href="/addCourse"
          className="bg-blue-900 p-2 rounded-lg text-white hover:bg-blue-700"
        >
          Add a course
        </Link>
      </div>
    </main>
  );
}

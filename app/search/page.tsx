"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
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

  const totalCount = await prisma.course.count({
    where: {
      code: {
        contains: query,
      },
    },
  });

  const totalPages = Math.ceil(totalCount / COURSE_LOAD_AMOUNT);

  const results = await prisma.course.findMany({
    where: {
      code: {
        contains: query,
      },
    },
    include: {
      school: true,
    },
    take: COURSE_LOAD_AMOUNT,
    skip: COURSE_LOAD_AMOUNT * (courseBuffer - 1),
  });

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
    <main className="w-screen min-h-screen p-12">
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
    </main>
  );
}

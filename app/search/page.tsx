"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import CourseCard from "@/components/CourseCard";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = (searchParams.q as string)?.toUpperCase();
  if (!query) redirect("/");

  const results = await prisma.course.findMany({
    where: {
      code: {
        contains: query,
      },
    },
    include: {
      school: true,
    },
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
    <main className="bg-gray-100 text-gray-900 w-screen min-h-screen p-12">
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
    </main>
  );
}

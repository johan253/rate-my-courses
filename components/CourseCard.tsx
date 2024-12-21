"use server";
import { db } from "@/lib/kysely";

import Link from "next/link";
import type { Course, School } from "@/lib/types";
import StarRating from "@/components/StarRating";

export default async function CourseCard({
  course,
  school,
}: {
  course: Course;
  school: School;
}) {
  const ratings = await db
    .selectFrom("Rating")
    .selectAll()
    .where("courseId", "=", course.id)
    .groupBy("id")
    .execute();

  const averageRating =
    ratings.length > 0
      ? (ratings.reduce((acc, rating) => acc + rating.rating, 0) /
          ratings.length).toFixed(1)
      : null;

  return (
    <li className="bg-white shadow-lg w-full max-w-6xl rounded-lg p-6 transform transition-transform hover:scale-105 hover:shadow-xl">
      <Link href={`/course/${course.id}`}>
        <h2 className="text-xl font-semibold mb-2">{course.code}</h2>
        <div className="text-lg mb-2">{averageRating ? <StarRating rating={Number(averageRating)}/> : <StarRating rating={0}/>}</div>
        <p className="text-gray-700">{school.name}</p>
        <p className="text-gray-500">{school.location}</p>
      </Link>
    </li>
  );
}

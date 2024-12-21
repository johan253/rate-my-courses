"use server";

import { db } from "@/lib/kysely";
import type { Course, Rating, School } from "@/lib/types";
import { sql } from "kysely";

import { notFound } from "next/navigation";
import RatingCard from "@/components/RatingCard";
import RatingForm from "@/components/RatingForm";
import StarRating from "@/components/StarRating";
import { auth } from "@/auth";

export default async function CoursePage({ params }: { params: { id: string } }) {
  // @ts-ignore
  const course: undefined | Course & {ratings: Rating[], school: School} = await db
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
    .where("Course.id", "=", params.id)
    .groupBy("Course.id")
    .groupBy("School.id")
    .executeTakeFirst();

  if (!course) {
    return notFound();
  }

  const userId = (await auth())?.user?.id || null;

  const averageRating =
    course.ratings.length > 0
      ? (course.ratings.reduce((acc, rating) => acc + rating.rating, 0) /
          course.ratings.length).toFixed(1)
      : null;

  const ratingCards = course.ratings.map((rating) => (
    <RatingCard key={rating.id} rating={rating} />
  ));
  return (
    <main className="p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-bold mb-4">{course.code}</h1>
        <p className="text-xl mb-4">School: {course.school.name}</p>
        <p className="text-gray-700 mb-4">{course.school.location}</p>
        <div className="text-2xl font-semibold mb-4 flex items-center">Average Rating:&nbsp;{averageRating ? <StarRating rating={Number(averageRating)}/> : <StarRating rating={0}/>}</div>
        <h2 className="text-2xl font-bold mb-2">Student Reviews</h2>
        <ul className="flex flex-col items-center gap-6">
          { ratingCards.length === 0 ? 
            (
              <p>No reviews yet. Be the first to review this course!</p>
            ) : (
              ratingCards
            )
          }
        </ul>
      </div>
      <div className="max-w-6xl mx-auto shadow-lg">
        <RatingForm courseId={course.id} authorId={userId} />
      </div>
    </main>
  );
}

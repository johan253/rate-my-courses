"use server";

import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import RatingCard from "@/components/RatingCard";
import RatingForm from "@/components/RatingForm";

export default async function CoursePage({ params }: { params: { id: string } }) {
  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      school: true,
      ratings: true,
    },
  });
  if (!course) {
    return notFound();
  }

  const averageRating =
    course.ratings.length > 0
      ? (course.ratings.reduce((acc, rating) => acc + rating.rating, 0) /
          course.ratings.length).toFixed(1)
      : null;

  const ratingCards = course.ratings.map((rating) => (
    <RatingCard key={rating.id} rating={rating} />
  ));
  return (
    <main className="bg-gray-100 text-gray-900 min-h-screen p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-bold mb-4">{course.code}</h1>
        <p className="text-xl mb-4">School: {course.school.name}</p>
        <p className="text-gray-700 mb-4">{course.school.location}</p>
        <p className="text-2xl font-semibold mb-4">Average Rating: {averageRating ? `${averageRating}/5` : "N/A"}</p>

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
        <RatingForm courseId={course.id} authorId={"cm0hdhzzr0002ylfopjblzbdy"} />
      </div>
    </main>
  );
}

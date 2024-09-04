// pages/me.tsx (Server Component)
"use server";

import prisma from "@/lib/prisma";

import RatingCard from "@/components/RatingCard";
import Button from "@/components/Button";
import Profile from "@/components/Profile";

import { auth } from "@/auth";

export default async function MePage() {
  const session = await auth();

  if (!session?.user) {
    // If the user is not logged in, you can redirect them or show a message
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 gap-6">
        <p className="text-xl">Please log in to view your Profile and Ratings.</p>
        <a href="/api/auth/signin?callbackUrl=/me">
          <Button variant="primary">Sign In</Button>
        </a>
      </main>
    );
  }

  const userRatings = await prisma.rating.findMany({
    where: { authorId: session.user.id },
    include: {
      course: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="bg-gray-100 text-gray-900 min-h-screen p-8">
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

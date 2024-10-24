// "@/lib/actions.ts"
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache"; // Optionally, for ISR
import type { Rating } from "@prisma/client";
import { auth } from "@/auth";

export async function createRating(previousState: any, formData: FormData) {
  if (!isLoggedIn()) return "You must be logged in to create a rating";
  
  const courseId = formData.get("courseId") as string;
  const authorId = formData.get("authorId") as string;
  const rating = Number(formData.get("rating"));
  const review = formData.get("review") as string;
  if (!courseId || !authorId || !rating || !review) {
    return "Missing required fields";
  }
  try {
    await prisma.rating.create({
      data: {
        courseId,
        authorId,
        rating,
        review,
      },
    });

    // Optionally revalidate the course page to show the new rating immediately
  } catch (error) {
    return error;
  }
  revalidatePath(`/course/${courseId}`);
}

export async function deleteRating(previousState: any, rating: Rating) {
  if (!isLoggedIn()) return "You must be logged in to delete a rating";

  // Check if the user is the author of the rating
  const session = await auth();
  const authorId = session?.user?.id;
  if (authorId !== rating.authorId) {
    return "You can only delete your own ratings";
  }

  try {
    await prisma.rating.delete({
      where: { id: rating.id },
    });
  } catch (error) {
    return error;
  }
  revalidatePath(`/course/${rating.courseId}`);
}

export async function getSession() {
  const session = await auth();
  return session;
}
/**
 * Adds a course to the database
 * 
 * @param schoolId id of the school
 * @param code The course code
 * @returns an optional error message and the course id
 */
export async function addCourse(schoolId: string, code: string) {
  // Check if user is logged in
  const session = await auth();
  if (!session || !session.user) {
    return JSON.stringify({
      error: "You must be logged in to add a course",
      courseId: null,
    });
  }

  const authorId = session.user.id;
  if (!authorId) {
    return JSON.stringify({
      error: "Invalid user",
      courseId: null,
    });
  }

  // Validate input
  if (code.trim() === "" || schoolId.trim() === "") {
    return JSON.stringify({
      error: "Missing required fileds",
      courseId: null,
    });
  }

  // Check if user has added 3 courses in the last 24 hours
  const coursesAddedLastDay = await prisma.course.count({
    where: {
      authorId,
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // last 24 hours
      }
    }
  });

  if (coursesAddedLastDay >= 3) {
    return JSON.stringify({
      error: "You can only add 3 courses in a 24 hour period.",
      courseId: null,
    });
  }
  // Check for duplicates
  const duplicates = await prisma.course.findFirst({
    where: {
      code,
      schoolId,
    },
  });

  if (duplicates) {
    return JSON.stringify({
      error: "Course already exists",
      courseId: null,
    });
  }

  // Create the course
  let result;
  try {
    result = await prisma.course.create({
      data: {
        code,
        schoolId,
        authorId,
      },
    });
  } catch (error) {
    return JSON.stringify({
      error: "Failed to create course",
      courseId: null,
    });
  }
  // Revalidate the path to show the new course immediately and return the course id
  revalidatePath("/addCourse");
  return JSON.stringify({
    error: null,
    courseId: result.id,
  });
}

export async function getSchools(query: string) {
  const schools = await prisma.school.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    orderBy: {
      name: "asc",
    }
  });
  return schools;
}

async function isLoggedIn() {
  const session = await auth();
  return session !== null;
}
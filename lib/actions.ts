// "@/lib/actions.ts"
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache"; // Optionally, for ISR
import type { Rating } from "@prisma/client";
import { auth } from "@/auth";

/**
 * Create a rating for a course
 * 
 * @param previousState previous state of the rating
 * @param formData form data to create a rating
 * @returns an error message if the rating could not be created
 */
export async function createRating(previousState: any, formData: FormData) {
  if (!isLoggedIn()) return "You must be logged in to create a rating";
  
  const courseId = formData.get("courseId") as string;
  const authorId = formData.get("authorId") as string;
  const rating = Number(formData.get("rating"));
  const review = formData.get("review") as string;
  if (!courseId || !authorId || !rating || !review) {
    return "Missing required fields";
  }
  // Check if the user has already rated the course
  const alreadyRated = await prisma.rating.findFirst({
    where: {
      courseId,
      authorId,
    }
  });

  if (alreadyRated) {
    return "You have already rated this course";
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

/**
 * Delete a rating from a course
 * 
 * @param previousState The previous state of the rating
 * @param rating The rating to update
 * @returns The error message if the rating could not be updated
 */
export async function deleteRating(previousState: any, rating: Rating) {
  if (!isLoggedIn()) return "You must be logged in to delete a rating";

  try {
    await prisma.rating.delete({
      where: { id: rating.id },
    });
  } catch (error) {
    return error;
  }
  revalidatePath(`/course/${rating.courseId}`);
}

/**
 * Fetch the current session
 * 
 * @returns The current session
 */
export async function getSession() {
  const session = await auth();
  return session;
}

/**
 * Add a course to the database
 * 
 * @param schoolId The school id
 * @param code The course code
 * @returns An error message if the course could not be added
 */
export async function addCourse(schoolId: string, code: string) {
  if (!isLoggedIn()) return "You must be logged in to add a course";

  if (code.trim() === "" || schoolId.trim() === "") {
    return JSON.stringify({
      error: "Missing required fileds",
      courseId: null,
    });
  }
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
  let result;
  try {
    result = await prisma.course.create({
      data: {
        code,
        schoolId,
      },
    });
  } catch (error) {
    return JSON.stringify({
      error: "Failed to create course",
      courseId: null,
    });
  }
  revalidatePath("/addCourse");
  return JSON.stringify({
    error: null,
    courseId: result.id,
  });
}

/**
 * Get schools by query
 * 
 * @param query Get schools by query
 * @returns The schools that match the query
 */
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

/**
 * Check if the user is logged in
 * 
 * @returns True if the user is logged in
 */
async function isLoggedIn() {
  const session = await auth();
  return session !== null;
}

/**
 * Get the ratings for a course
 * 
 * @param courseId The course id
 * @returns The ratings for the course
 */
export async function getCourseRatings(courseId: string) {
  const ratings = await prisma.rating.findMany({
    where: {
      courseId,
    }
  });
  return ratings;
}
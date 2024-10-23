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

export async function addCourse(schoolId: string, code: string) {
  if (!isLoggedIn()) return JSON.stringify({ error: "You must be logged in to add a course", courseId: null });

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
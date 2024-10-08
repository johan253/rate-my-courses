// "@/lib/actions.ts"
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache"; // Optionally, for ISR
import type { Rating } from "@prisma/client";
import { auth } from "@/auth";

export async function createRating(previousState: any, formData: FormData) {
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

export async function addCourse(previousState: any, formData: FormData) {
  const code = formData.get("code") as string;
  const schoolId = formData.get("school") as string;
  if (!code || !schoolId) {
    return "Missing required fields";
  }
  try {
    await prisma.course.create({
      data: {
        code,
        schoolId,
      },
    });
  } catch (error) {
    return error;
  }
  revalidatePath("/addCourse");
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
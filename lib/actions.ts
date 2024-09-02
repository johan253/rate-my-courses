// "@/lib/actions.ts"
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache"; // Optionally, for ISR
import type { Rating } from "@prisma/client";

export async function createRating(previousState: any, formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
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
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
  try {
    await prisma.rating.delete({
      where: { id: rating.id },
    });
  } catch (error) {
    return error;
  }
  revalidatePath(`/course/${rating.courseId}`);
}

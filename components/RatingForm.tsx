"use client";

import { useActionState, useState, useEffect } from "react";
import { createRating } from "@/lib/actions";
import Button from "@/components/Button";
import AuthModal from "@/components/AuthModal";
import { revalidatePath } from "next/cache";

export default function RatingForm({ courseId, authorId }: { courseId: string; authorId: string | null}) {
  // Using useActionState to manage the action and loading state
  const [error, submit, isPending] = useActionState(createRating, null);
  const [isModalOpen, setIsModalOpen] = useState(!authorId);

  useEffect(() => {
    if (!authorId) {
      setIsModalOpen(true);
    }
  }, [authorId]);

  return (
    <div className="relative">
      <AuthModal isOpen={isModalOpen} message="You need to sign in to leave a review."/>
      <form action={(data) => {
        if (!authorId) return;
        data.append("courseId", courseId);
        data.append("authorId", authorId as string);
        submit(data);
      }
      } className="bg-white shadow-lg rounded-lg p-6 mt-6">
        <h3 className="text-2xl font-bold mb-4">Leave a Review</h3>
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700" htmlFor="rating">
          Rating
          </label>
          <input
            disabled={isPending || !authorId}
            type="number"
            id="rating"
            name="rating"
            min="1"
            max="5"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700" htmlFor="review">
          Review
          </label>
          <textarea
            rows={4}
            maxLength={250}
            disabled={isPending || !authorId}
            id="review"
            name="review"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <Button
          type="submit"
          disabled={isPending || !authorId}
          variant="primary"
        >
          {isPending ? "Submitting..." : "Submit Review"}
        </Button>
        {isPending && <p className="mt-2 text-red-500">Submitting...</p>}
        {error ? <p className="mt-2 text-red-500">An error occurred. Please try again later.</p> : null}
      </form>
    </div>
  );
}

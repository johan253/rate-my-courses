"use client";
import type { Rating } from "@prisma/client";
import { useActionState } from "react";
import { deleteRating } from "@/lib/actions";

export default function RatingCard({ rating }: { rating: Rating }) {
  const [error, deleteAction, isPending] = useActionState(deleteRating, null);

  const handleDelete = () => {
    deleteAction(rating);
  };
  return (
    <li className="bg-gray-50 p-4 rounded-lg shadow-sm w-full transform transition-transform hover:shadow-md">
      <div className="flex justify-between">
        <p className="text-yellow-500 font-semibold">{rating.rating}/5</p>
        <button onClick={handleDelete} disabled={isPending || error as any}>
          {
            isPending ? "Deleting..." : "X"
          }
        </button>
      </div>
      <p>{rating.review}</p>
      <p className="text-gray-500 text-sm mt-2">
        {new Date(rating.createdAt).toLocaleDateString()}
      </p>
    </li>
  );
}

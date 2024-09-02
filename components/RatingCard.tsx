"use client";
import type { Rating } from "@prisma/client";
import { useActionState } from "react";
import { deleteRating } from "@/lib/actions";
import { FaTrashCan, FaCircleNotch } from "react-icons/fa6";

export default function RatingCard({ rating }: { rating: Rating }) {
  const [error, deleteAction, isPending] = useActionState(deleteRating, null);

  const handleDelete = () => {
    deleteAction(rating);
  };
  return (
    <li className="bg-gray-50 p-4 rounded-lg shadow-sm w-full transform transition-transform hover:shadow-md">
      <div className="flex justify-between">
        <p className="text-yellow-500 font-semibold">{rating.rating}/5</p>
        <form action={handleDelete}>
          <button type="submit" disabled={isPending} className="flex">
            <FaTrashCan/> {isPending && <FaCircleNotch className="animate-spin" />}
          </button>
        </form>
      </div>
      <p>{rating.review}</p>
      <p className="text-gray-500 text-sm mt-2">
        {new Date(rating.createdAt).toLocaleDateString()}
      </p>
      {error ? <p className="text-red-500">An Error has occured deleting this rating. Please try again later.</p> : null}
    </li>
  );
}

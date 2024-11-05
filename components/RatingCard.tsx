"use client";
import type { Rating } from "@prisma/client";
import { useActionState, useState, useEffect } from "react";
import { deleteRating } from "@/lib/actions";
import { FaTrashCan, FaCircleNotch } from "react-icons/fa6";
import { getSession } from "@/lib/actions";
import { Session } from "next-auth";
import StarRating from "@/components/StarRating";

export default function RatingCard({ rating, children }: { rating: Rating; children?: React.ReactNode; }) {
  const [error, deleteAction, isPending] = useActionState(deleteRating, null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    getSession().then((res) => setSession(res));
  }, []);

  const handleDelete = () => {
    deleteAction(rating);
  };
  return (
    <li className="bg-gray-50 p-4 rounded-lg shadow-sm w-full transform transition-transform hover:shadow-md">
      {
        children
      }
      <div className="flex justify-between">
        <StarRating rating={rating.rating} />
        {session?.user && rating.authorId === session.user.id && (
          <form action={handleDelete} className="flex">
            <p className="text-xs italic text-gray-500 mx-5">You wrote this review</p>
            <button type="submit" disabled={isPending} className="flex">
              <FaTrashCan className="hover:fill-red-600"/> {isPending && <FaCircleNotch className="animate-spin" />}
            </button>
          </form>
        )}
      </div>
      <p>{rating.review}</p>
      <p className="text-gray-500 text-sm mt-2">
        {new Date(rating.createdAt).toLocaleDateString()}
      </p>
      {error ? <p className="text-red-500">An Error has occured deleting this rating. Please try again later.</p> : null}
    </li>
  );
}

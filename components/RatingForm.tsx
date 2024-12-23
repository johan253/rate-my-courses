"use client";

import type { Rating } from "@/lib/types";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import AuthModal from "@/components/AuthModal";

export default function RatingForm({ courseId, authorId }: { courseId: string; authorId: string | null}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(!authorId);
  const [alreadyRated, setAlreadyRated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authorId) {
      setIsModalOpen(true);
    }
    else {
      fetch(`/api/course/${courseId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }
          else {
            if (
              data.data.ratings.some((rating: Rating) => {
                return rating.authorId === authorId;
              })
            ) {
              setAlreadyRated(true);
            }
          }
        })
        .catch((error) => setError(error));
    }
  }, [authorId, courseId]);

  const submit = async (data: FormData) => {
    setIsPending(true);
    await fetch("/api/rating", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId,
        authorId,
        rating: data.get("rating"),
        review: data.get("review"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        }
        else {
          setAlreadyRated(true);
        }
      })
      .finally(() => {
        setIsPending(false);
        router.refresh();
      });
  };

  return (
    <div className="relative">
      <AuthModal isOpen={isModalOpen} message="You need to sign in to leave a review."/>
      {alreadyRated && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 rounded-lg">
          <div className="bg-white rounded-lg p-8 max-w-sm mx-auto text-center">
            <h2 className="text-2xl font-bold">You have already left a review for this course.</h2>
          </div>
        </div>
      )}
      <form action={(data) => {
        if (!authorId) return;
        data.append("courseId", courseId);
        data.append("authorId", authorId);
        submit(data);
      }
      } className="bg-white shadow-lg rounded-lg p-6 mt-6">
        <h3 className="text-2xl font-bold mb-4">Leave a Review</h3>
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700" htmlFor="rating">
          Rating
          </label>
          <input
            disabled={alreadyRated || isPending || !authorId}
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
            disabled={alreadyRated || isPending || !authorId}
            id="review"
            name="review"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <Button
          type="submit"
          disabled={alreadyRated || isPending || !authorId}
          variant="primary"
        >
          {isPending ? "Submitting..." : "Submit Review"}
        </Button>
        {isPending && <p className="mt-2 text-red-500">Submitting...</p>}
        {error ? <p className="mt-2 text-red-500">An error occurred. Please try again later.</p> : null}
        {error ? <p className="mt-2 text-red-500">{JSON.stringify(error)}</p> : null}
      </form>
    </div>
  );
}

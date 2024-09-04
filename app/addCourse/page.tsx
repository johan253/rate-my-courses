"use client";
import { useActionState } from "react";
import { addCourse } from "@/lib/actions";

export default function AddCoursePage() {
  const [error, submitForm, isPending] = useActionState(addCourse, null);
  return (
    <div className="p-8">
      <h1>Add a Course</h1>
      <form
        className="flex flex-col gap-4"
        action={submitForm}>
        <input
          id="code"
          name="code"
          placeholder="Course Code"
        />
        <input
          id="school"
          name="school"
          placeholder="School"
        />
        <button type="submit">
          Submit
        </button>
      </form>
      {
        isPending && <p>Submitting...</p>
      }
      {
        error ? <p className="text-red-500">An error has occured</p> : null
      }
    </div>
  );
}
"use server";
import Link from "next/link";

export default async function CourseCard() {
  return (
    <Link href="/course/1"
      className={"bg-red-400 p-6 rounded-md border border-blue-300"}>
      <h2>Course Title</h2>
      <p>Course Description</p>
    </Link>
  );
}
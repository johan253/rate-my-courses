"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/SessionContext";
import Button from "@/components/Button";
import SchoolSearchBar from "@/components/SchoolSearchBar";
import type { School } from "@/lib/types";
import { Session } from "next-auth";

export default function AddCourseForm() {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { session }: { session: Session | null } = useSession();
  const router = useRouter();

  if (!session?.user) {
    return (
      <main className="flex flex-col items-center justify-center gap-6">
        <p className="text-xl">Please log in to add a course.</p>
        <a href="/api/auth/signin?callbackUrl=/addCourse">
          <Button variant="primary">Sign In</Button>
        </a>
      </main>
    );
  }

  const handleSchoolSelect = (school: School | null) => {
    setSelectedSchool(school);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSchool) {
      alert("Please select a school");
      return;
    }
    // const result = JSON.parse(await addCourse(selectedSchool.id, code));
    const result = JSON.parse(
      await fetch("/api/course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schoolId: selectedSchool.id,
          code,
        }),
      }).then((res) => res.text())
    );
    if (result.error) {
      setError(result.error);
      return;
    } else {
      setCode("");
      setSelectedSchool(null);
      setError(null);
      router.push(`/course/${result.data.id}`);
    }
  };
  return (
    <main className="p-8">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <h1 className="text-2xl mb-4 font-bold">
          Add a New Course
        </h1>
        <label className="block mb-2 w-3/4 max-w-xl">
          School:
          <SchoolSearchBar onSelectSchool={handleSchoolSelect} />
        </label>

        <label className="block mb-2 w-3/4 max-w-xl">
        Course Name:
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            pattern="[A-Z]{2,5}[&]?[0-9]{2,4}"
            title="First 2-10 characters must be uppercase letters or '&', followed by 3 digits"
            placeholder="MATH101"
            type="text" 
            className="w-full p-2 border border-gray-300 rounded invalid:border-red-500" 
            required 
          />
        </label>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-max">
          Add Course
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
      <div
        className="flex flex-col items-center mt-8 gap-6"
      >
        <h2 className="text-xl font-semibold">
          Can&apos;t find your school, or submit your course code?
        </h2>
        <p>
          Email us&nbsp;
          <a 
            href="mailto:johan.hdzz@outlook.com" 
            className="text-blue-900 hover:text-blue-700 underline"
          >
            here
          </a>
          &nbsp;with your course code and school name.
        </p>
      </div>
    </main>
  );
}

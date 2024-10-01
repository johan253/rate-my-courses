"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SchoolSearchBar from "@/components/SchoolSearchBar";
import type { School, Course } from "@prisma/client";
import { addCourse } from "@/lib/actions";

export default function AddCourseForm() {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSchoolSelect = (school: School | null) => {
    setSelectedSchool(school);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSchool) {
      alert("Please select a school");
      return;
    }
    const result = JSON.parse(await addCourse(selectedSchool.id, code));
    if (result.error) {
      setError(result.error);
      return;
    } else {
      setCode("");
      setSelectedSchool(null);
      setError(null);
      router.push(`/course/${result.courseId}`);
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

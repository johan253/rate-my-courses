"use client";

import { useState } from "react";
import SchoolSearchBar from "@/components/SchoolSearchBar";
import type { School } from "@prisma/client";

export default function AddCourseForm() {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  const handleSchoolSelect = (school: School) => {
    setSelectedSchool(school);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Submit the course data along with the selected school
    // You can pass this to your API to save in the database using Prisma
    if (!selectedSchool) {
      alert("Please select a school.");
      return;
    } else {
      alert(`This feature is not implemented yet. Please check back later.\n\nSelected School: ${selectedSchool.name}\nCourse Name: ${(e.target as any).elements[1].value}`);
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
            pattern="[A-Z]{2,5}[&]?[0-9]{3,4}"
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

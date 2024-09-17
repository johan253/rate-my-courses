"use client";

import { useState } from "react";
import SchoolSearchBar from "@/components/SchoolSearchBar";

export default function AddCourseForm() {
  const [selectedSchool, setSelectedSchool] = useState<any>(null);

  const handleSchoolSelect = (school: string) => {
    setSelectedSchool(school);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Submit the course data along with the selected school
    // You can pass this to your API to save in the database using Prisma
    if (!selectedSchool) {
      alert("Please select a school.");
      return;
    }
    console.log("Selected School:", selectedSchool);
  };
  return (
    <form onSubmit={handleSubmit} className="p-8">
      <h1 className="text-2xl mb-4">Add a New Course</h1>

      <label className="block mb-2">
        School:
        <SchoolSearchBar onSelectSchool={handleSchoolSelect} />
      </label>

      <label className="block mb-2">
        Course Name:
        <input type="text" className="w-full p-2 border border-gray-300 rounded" required />
      </label>

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Add Course
      </button>
    </form>
  );
}

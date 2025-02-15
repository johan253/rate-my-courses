"use client";

import { useState, useEffect } from "react";
import type { School } from "@/lib/types";

// eslint-disable-next-line no-unused-vars
export default function SchoolSearchBar({ onSelectSchool }: { onSelectSchool: (school: School | null) => void }) {
  const [query, setQuery] = useState("");
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentSchool, setCurrentSchool] = useState<School | null>(null);

  // Debounce the search input (wait 500ms after user stops typing)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim() && query.length > 4 && query !== currentSchool?.name) {
        searchSchools(query);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [query, currentSchool]);

  const searchSchools = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/school?q=${query}`)
        .then((res) => res.json())
        .then((data) => data.data);
      setSchools(response);
    } catch (error) {
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSchool = (school: any) => {
    setQuery(school.name);
    setCurrentSchool(school);
    onSelectSchool(school); // Pass the selected school to the parent component
    setSchools([]); // Clear suggestions
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSelectSchool(null); // Clear the selected school
        }}
        placeholder="Search for a school..."
        className="w-full p-2 border border-gray-300 rounded"
      />
      {loading && <p className="text-sm text-gray-500">Searching...</p>}
      {schools.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-auto">
          {schools.map((school) => (
            <li
              key={school.id}
              onClick={() => handleSelectSchool(school)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {school.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          <Link href="/">
            Rate My Courses
          </Link>
        </div>
        {/* Conditionally render the search form */}
        {pathname !== "/" && (
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="MATH101..."
              className="text-black p-2 rounded-l-lg border-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-white text-blue-600 p-2 rounded-r-lg font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
            >
              Search
            </button>
          </form>
        )}
      </div>
    </nav>
  );
}

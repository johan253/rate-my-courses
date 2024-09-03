"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/actions";
import { Session } from "next-auth";
import Image from "next/image";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  useEffect(() => {
    getSession().then((res) => setSession(res));
  }, []);
  return (
    <nav className={`${pathname !== "/" ? "bg-blue-500" : "bg-gradient-to-r from-blue-500 to-purple-600"} p-4`}>
      <div className=" mx-auto flex justify-between items-center">
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
        {
          session ? (
            <div className="flex items-center text-white">
              
              <Link href="/me" className="flex items-center">
                <Image
                  className="w-8 h-8 rounded-full"
                  src={session?.user?.image || "/avatar.png"}
                  alt={session?.user?.name || "User avatar"}
                  width={1}
                  height={1}
                  unoptimized
                />
                Profile
              </Link>
              <p>{" | "}</p>
              <Link href={`/api/auth/signout?callbackUrl=${pathname}`}>
                Sign out
              </Link>
            </div>
          ) : (
            <Link href={`/api/auth/signin?callbackUrl=${pathname}`}>
              Sign in
            </Link>
          )
        }
      </div>
    </nav>
  );
}

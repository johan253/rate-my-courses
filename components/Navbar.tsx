"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/actions";
import { Session } from "next-auth";
import Image from "next/image";
import { FaUser } from "react-icons/fa6";

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
    <nav className="p-4 bg-white">
      <div className=" mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link href="/"
            className="hover:text-gray-500">
            Rate My Courses
          </Link>
        </div>
        {/* Conditionally render the search form */}
        {pathname !== "/" && (
          <form onSubmit={handleSearch} className="flex items-center border rounded-lg">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="MATH101..."
              className="text-black p-2 rounded-l-lg border-none focus:ring-2"
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
            <div className="flex items-center">
              
              <Link href="/me" className="flex items-center hover:text-gray-500">
                <Image
                  className="w-8 h-8 rounded-full mx-2"
                  src={session?.user?.image || "/avatar.png"}
                  alt={session?.user?.name || "User avatar"}
                  width={1}
                  height={1}
                  unoptimized
                />
                Profile
              </Link>
              <p className="mx-2">|</p>
              <Link href={`/api/auth/signout?callbackUrl=${pathname}`}
                className="hover:text-gray-500">
                Sign out
              </Link>
            </div>
          ) : (
            <Link href={`/api/auth/signin?callbackUrl=${pathname}`}
              className="flex items-center hover:text-gray-500">
              <FaUser className="mx-2" />
              Sign in
            </Link>
          )
        }
      </div>
    </nav>
  );
}

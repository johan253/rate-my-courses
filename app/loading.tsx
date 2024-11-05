"use client";
export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      <p className="ml-4 text-xl text-gray-700">Loading...</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <div className="text-center max-w-lg mx-auto p-8">
        <h1 className="text-5xl font-bold mb-8">Find Your Perfect Course</h1>
        <p className="text-xl mb-8">
          Search and rate courses from universities across the U.S. and help students make informed decisions.
        </p>
        <form action="/search" method="get" className="flex justify-center">
          <input
            type="text"
            name="q"
            placeholder="Search for a course..."
            className="w-full max-w-md p-3 rounded-l-lg border-none focus:ring-2 text-gray-700"
          />
          <button
            type="submit"
            className="bg-blue-900 hover:bg-blue-700 p-3 rounded-r-lg font-medium text-white"
          >
            Search
          </button>
        </form>
        <div className="mt-8">
          <a
            href="/explore"
            className="text-lg underline hover:text-blue-700"
          >
            Or explore top-rated courses
          </a>
        </div>
      </div>
    </>
  );
}

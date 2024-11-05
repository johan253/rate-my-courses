import { getTrendingCourses } from "@/lib/actions";
import CourseCard from "@/components/CourseCard";

export default async function ExplorePage() {
  const courses = await getTrendingCourses();
  const courseCards = courses.map((course) => (
    <CourseCard key={course.id} course={course} school={course.school} />
  ));

  return (
    <main className="p-12">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Top 5 trending courses in the last 24 hours
      </h1>
      <ul className="flex flex-col gap-6">
        {courseCards.length !== 0 ?
          (courseCards) : (<p className="text-center p-4">No trending courses...</p>)
        }
      </ul>
      <p className="italic text-gray-500 text-center p-4">
        Trending courses are based on the number and ratio of good reviews
      </p>
    </main>
  );
}
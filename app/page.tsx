"use server";
import prisma from "@/lib/prisma";

export default async function Home() {
  const users = await prisma.user.findMany();
  const schools = await prisma.school.findMany();
  const courses = await prisma.course.findMany();
  const ratings = await prisma.rating.findMany();

  return (
    <div className={""}>
      <h1>Home</h1>
      <p>{JSON.stringify({
        users,
        schools,
        courses,
        ratings,
      })}</p>
    </div>
  );
}

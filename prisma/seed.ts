const { PrismaClient } = require("@prisma/client");

const prs = new PrismaClient();

async function main() {
  // Create Schools
  const school1 = await prs.school.create({
    data: {
      name: "Harvard University",
      location: "Cambridge, MA",
    },
  });

  const school2 = await prs.school.create({
    data: {
      name: "Stanford University",
      location: "Stanford, CA",
    },
  });

  // Create Courses
  const course1 = await prs.course.create({
    data: {
      code: "CS50",
      schoolId: school1.id,
    },
  });

  const course2 = await prs.course.create({
    data: {
      code: "CS101",
      schoolId: school2.id,
    },
  });

  // Create Users
  const user1 = await prs.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
    },
  });

  const user2 = await prs.user.create({
    data: {
      name: "Jane Smith",
      email: "jane@example.com",
    },
  });

  // Create Ratings
  await prs.rating.create({
    data: {
      rating: 5,
      review: "Excellent course, highly recommend!",
      authorId: user1.id,
      courseId: course1.id,
    },
  });

  await prs.rating.create({
    data: {
      rating: 4,
      review: "Great course, but could be more challenging.",
      authorId: user2.id,
      courseId: course2.id,
    },
  });
}

main()
  .then(async () => {
    await prs.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prs.$disconnect();
    process.exit(1);
  });

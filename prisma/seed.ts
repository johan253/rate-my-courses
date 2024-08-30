const PrismaClient = require("@prisma/client").PrismaClient;

const prs = new PrismaClient();

async function main() {
  // Create schools
  const school1 = await prs.school.create({
    data: {
      name: "University of Example",
      location: "Example City, EX",
    },
  });

  const school2 = await prs.school.create({
    data: {
      name: "Sample Institute of Technology",
      location: "Sample Town, ST",
    },
  });

  // Create users
  const user1 = await prs.user.create({
    data: {
      email: "user1@example.com",
      passwordHash: "hashedpassword1", // In a real scenario, ensure this is a properly hashed password
      firstName: "John",
      lastName: "Doe",
      school: {
        connect: { id: school1.id },
      },
    },
  });

  const user2 = await prs.user.create({
    data: {
      email: "user2@example.com",
      passwordHash: "hashedpassword2",
      firstName: "Jane",
      lastName: "Smith",
      school: {
        connect: { id: school2.id },
      },
    },
  });

  // Create courses
  const course1 = await prs.course.create({
    data: {
      code: "CS101",
      school: {
        connect: { id: school1.id },
      },
    },
  });

  const course2 = await prs.course.create({
    data: {
      code: "IT202",
      school: {
        connect: { id: school2.id },
      },
    },
  });

  // Create ratings
  await prs.rating.create({
    data: {
      rating: 5,
      review: "Great course, highly recommend!",
      author: {
        connect: { id: user1.id },
      },
      course: {
        connect: { id: course1.id },
      },
    },
  });

  await prs.rating.create({
    data: {
      rating: 4,
      review: "Very informative, but a bit challenging.",
      author: {
        connect: { id: user2.id },
      },
      course: {
        connect: { id: course2.id },
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prs.$disconnect();
  });

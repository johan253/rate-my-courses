const { Kysely, PostgresDialect, sql }  = require("kysely");
const { v4 }  = require("uuid");
const { Pool }  = require("pg"); // Assuming SQLite for development

const db: typeof Kysely = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }), // Adjust for your database setup
  }),
});

async function createTablesIfNotExist() {
  console.log("@@@ Creating tables if they do not exist");
  await db.schema
    .createTable("User")
    .ifNotExists()
    .addColumn("id", "text", (col: any) => col.primaryKey())
    .addColumn("name", "text")
    .addColumn("email", "text", (col: any) => col.notNull())
    .addColumn("emailVerified", "timestamp")
    .addColumn("image", "text")
    .addColumn("createdAt", "timestamp", (col: any) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamp", (col: any) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();

  await db.schema
    .createTable("Account")
    .ifNotExists()
    .addColumn("userId", "text", (col: any) => col.notNull())
    .addColumn("type", "text", (col: any) => col.notNull())
    .addColumn("provider", "text", (col: any) => col.notNull())
    .addColumn("providerAccountId", "text", (col: any) => col.notNull())
    .addColumn("refresh_token", "text")
    .addColumn("access_token", "text")
    .addColumn("expires_at", "integer")
    .addColumn("token_type", "text")
    .addColumn("scope", "text")
    .addColumn("id_token", "text")
    .addColumn("session_state", "text")
    .addColumn("createdAt", "timestamp", (col: any) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamp", (col: any) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();
    
  await db.schema
    .createTable("School")
    .ifNotExists()
    .addColumn("id", "text", (col: any) => col.primaryKey())
    .addColumn("name", "text", (col: any) => col.notNull())
    .addColumn("location", "text", (col: any) => col.notNull())
    .execute();

  await db.schema
    .createTable("Course")
    .ifNotExists()
    .addColumn("id", "text", (col: any) => col.primaryKey())
    .addColumn("code", "text", (col: any) => col.notNull())
    .addColumn("createdAt", "timestamp", (col: any) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamp", (col: any) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("schoolId", "text", (col: any) => col.notNull())
    .addColumn("authorId", "text", (col: any) => col.notNull())
    .execute();

  await db.schema
    .createTable("Rating")
    .ifNotExists()
    .addColumn("id", "text", (col: any) => col.primaryKey())
    .addColumn("authorId", "text", (col: any) => col.notNull())
    .addColumn("rating", "integer", (col: any) => col.notNull())
    .addColumn("review", "text")
    .addColumn("createdAt", "timestamp", (col: any) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamp", (col: any) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("courseId", "text", (col: any) => col.notNull())
    .execute();

  await db.schema
    .createTable("Session")
    .ifNotExists()
    .addColumn("sessionToken", "text", (col: any) => col.primaryKey())
    .addColumn("userId", "text", (col: any) => col.notNull())
    .addColumn("expires", "timestamp", (col: any) => col.notNull())
    .addColumn("createdAt", "timestamp", (col: any) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamp", (col: any) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();

  await db.schema
    .createTable("VerificationToken")
    .ifNotExists()
    .addColumn("identifier", "text", (col: any) => col.notNull())
    .addColumn("token", "text", (col: any) => col.notNull())
    .addColumn("expires", "timestamp", (col: any) => col.notNull())
    .execute();

  console.log("@@@ Tables created successfully.");
}

async function seedDatabase() {
  console.log("@@@ Seeding database");
  try {
    // Clear existing data (if any)
    await db.deleteFrom("Account").execute();
    await db.deleteFrom("Course").execute();
    await db.deleteFrom("Rating").execute();
    await db.deleteFrom("School").execute();
    await db.deleteFrom("Session").execute();
    await db.deleteFrom("User").execute();
    await db.deleteFrom("VerificationToken").execute();

    // Seed Schools
    const schoolIds = [v4(), v4()];
    await db.insertInto("School").values([
      { id: schoolIds[0], name: "Harvard University", location: "Cambridge, MA" },
      { id: schoolIds[1], name: "MIT", location: "Cambridge, MA" },
    ]).execute();

    // Seed Users
    const userIds = [v4(), v4()];
    await db.insertInto("User").values([
      {
        id: userIds[0],
        name: "John Doe",
        email: "john.doe@example.com",
        emailVerified: null,
        image: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: userIds[1],
        name: "Jane Smith",
        email: "jane.smith@example.com",
        emailVerified: null,
        image: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]).execute();

    // Seed Courses
    const courseIds = [v4(), v4()];
    await db.insertInto("Course").values([
      {
        id: courseIds[0],
        code: "CS101",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        schoolId: schoolIds[0],
        authorId: userIds[0],
      },
      {
        id: courseIds[1],
        code: "MATH101",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        schoolId: schoolIds[1],
        authorId: userIds[1],
      },
    ]).execute();

    // Seed Ratings
    await db.insertInto("Rating").values([
      {
        id: v4(),
        authorId: userIds[0],
        rating: 5,
        review: "Excellent course!",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        courseId: courseIds[0],
      },
      {
        id: v4(),
        authorId: userIds[1],
        rating: 4,
        review: "Pretty good.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        courseId: courseIds[1],
      },
    ]).execute();

    // Seed Sessions
    // await db.insertInto("Session").values([
    //   {
    //     sessionToken: v4(),
    //     userId: userIds[0],
    //     expires: new Date(Date.now() + 3600 * 1000),
    //     createdAt: new Date().toISOString(),,
    //     updatedAt: new Date().toISOString(),,
    //   },
    // ]).execute();

    // Seed Accounts
    await db.insertInto("Account").values([
      {
        userId: userIds[0],
        type: "oauth",
        provider: "google",
        providerAccountId: v4(),
        refresh_token: null,
        access_token: null,
        expires_at: null,
        token_type: null,
        scope: null,
        id_token: null,
        session_state: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]).execute();

    // // Seed Verification Tokens
    // await db.insertInto("VerificationToken").values([
    //   {
    //     identifier: "john.doe@example.com",
    //     token: v4(),
    //     expires: new Date(Date.now() + 3600 * 1000),
    //   },
    // ]).execute();

    console.log("@@@ Database seeded successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await db.destroy();
    console.log("@@@ Database connection closed.");
  }
}

createTablesIfNotExist()
  .then(() => seedDatabase());

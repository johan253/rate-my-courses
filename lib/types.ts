import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Account = {
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token: string | null;
    access_token: string | null;
    expires_at: number | null;
    token_type: string | null;
    scope: string | null;
    id_token: string | null;
    session_state: string | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Course = {
    id: string;
    code: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    schoolId: string;
    authorId: string;
};
export type Rating = {
    id: string;
    authorId: string;
    rating: number;
    review: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    courseId: string;
};
export type School = {
    id: string;
    name: string;
    location: string;
};
export type Session = {
    sessionToken: string;
    userId: string;
    expires: Timestamp;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type User = {
    id: string;
    name: string | null;
    email: string;
    emailVerified: Timestamp | null;
    image: string | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type VerificationToken = {
    identifier: string;
    token: string;
    expires: Timestamp;
};
export type DB = {
    Account: Account;
    Course: Course;
    Rating: Rating;
    School: School;
    Session: Session;
    User: User;
    VerificationToken: VerificationToken;
};

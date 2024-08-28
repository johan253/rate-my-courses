"use server";

export default async function CoursePage({ params } : { params: { id: string } }) {
  return (
    <div>
      <h1>Course Page</h1>
      <p>Course ID: {params.id}</p>
    </div>
  );
  
}
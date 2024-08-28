"use server";

import { redirect } from "next/navigation";

export default async function SearchPage(
  {
    searchParams
  } : {
    searchParams: { [key: string]: string | string[] | undefined};
  }) {
  const query = searchParams.q as string;
  if (!query) redirect("/");
  // do stuff...
  return (
    <main>
      <h1>Search Results for &quot;{query}&quot;</h1>
    </main>
  );
}
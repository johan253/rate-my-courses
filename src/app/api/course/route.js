export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q"); // Extract the 'q' query parameter
    const response = await fetch(`https://us-central1-rate-my-course-0.cloudfunctions.net/searchCourses?q=${query}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        searchParams: { q: query },
    });
    return response;
}

export async function GET(request, {params}) {
    const response = await fetch(`https://us-central1-rate-my-course-0.cloudfunctions.net/getSchool?id=${params.id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response;
}
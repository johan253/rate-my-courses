export async function POST(req) {
    try {
        const body = await req.json();
        const { courseId, review, rating } = body;

        const auth = req.headers.get("Authorization");

        if (!courseId || !review || !rating || !auth) {
            return Response.json({
                error: "Missing required fields or Authorization header",
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        const payload = {
            courseId,
            review,
            rating
        };

        const response = await fetch("https://us-central1-rate-my-course-0.cloudfunctions.net/addRating", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": auth
            },
            body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        return Response.json({
            error: "An unexpected error occurred",
            status: 400
        });
    }
}
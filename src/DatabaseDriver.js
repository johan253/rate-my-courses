import axios from "axios";
import {getAuth} from "firebase/auth";

let instance;
const __API_URL = "https://us-central1-rate-my-course-0.cloudfunctions.net/";
class Driver {
    constructor() {
        if (instance) throw new Error("New instance cannot be created of Firestore Driver");
        instance = this;
    }
    /**
     * 
     * @param {string} search The search query
     * @returns Returns an array of course objects that match the search query
     */
    searchCourse = async(search) => {
        console.info("DRIVER: Searching for course: ", search);
        const results = [];
        const params = {q: search};
        try {
            const response = await axios.get(__API_URL + "searchCourses", {params});
            response.data.forEach(cls => {
                results.push(cls);
            });
        } catch (err) {
            console.error(`DRIVER: Error searching course (${search}): `, "error: " , err.response.data);
        }
        return results;
    };
    /**
     * 
     * @param {string} courseId The ID of the course to get
     * @returns The course object with the given ID or an empty object if not found
     */
    getCourse = async(courseId) => {
        console.info("DRIVER: Getting course id: ", courseId);
        const params = {id: courseId};
        try {
            const response = await axios.get(__API_URL + "getCourse", {params});
            return response.data;
        } catch (err) {
            console.error(`DRIVER: Error getting course (${courseId}): `, err);
            return {};
        };
    };
    /**
     * 
     * @param {string} schoolId The ID of the school to get
     * @returns The school object with the given ID or an empty object if not found
     */
    getSchoolFromRef = async(schoolId) => {
        console.info("DRIVER: Getting school id: ", schoolId);
        const params = {id: schoolId};
        try {
            const response = await axios.get(__API_URL + "getSchool", {params});
            return response.data;
        } catch (err) {
            console.error(`DRIVER: Error getting school (${schoolId}): `, err);
            return {};
        }
    };
    /**
     * 
     * @param {string} courseId The course ID to write the review to
     * @param {object} data The review object with the review (string) and rating (int) 
     * @returns True if the review was written successfully, false otherwise
     */
    writeReviewFromCourse = async(courseId, data) => {
        console.info("DRIVER: Writing review for course: ", courseId, "with data: ", data);
        if (!courseId || !data?.review || !data?.rating) {
            console.error("DRIVER: failed, not valid course or data");
            return false;
        }
        const user = getAuth().currentUser;
        const userIdToken = await user?.getIdToken();
        console.info("DRIVER: User ID Token: ", userIdToken);
        const body = {
            courseId: courseId,
            review: data.review,
            rating: data.rating,
        };
        try {
            const response = await fetch("/api/course/addRating", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + userIdToken
                },
                body
            });
            if (response.status === 200) {
                return true;
            }
        } catch (err) {
            console.error("DRIVER: failed to write to DB, ", err);
            return false;
        }
    };
}

const FirestoreDriver = Object.freeze(new Driver());

export default FirestoreDriver;
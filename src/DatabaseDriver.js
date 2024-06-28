import {collection, doc, getDoc, getDocs, updateDoc, getFirestore, query, where, arrayUnion} from "firebase/firestore"
import  app  from "./firebaseConfig"
import axios from "axios";

let instance;
const db = getFirestore(app);
const __API_URL = "https://us-central1-rate-my-course-0.cloudfunctions.net/"
class Driver {
    constructor() {
        if (instance) throw new Error("New instance cannot be created of Firestore Driver");
        instance = this;
    }
    // searchCourse = async (search) => {
    //     let results = [];
    //     console.log("SEARCHING course: ", search);

    //     // Construct a query to filter courses based on the search criteria
    //     const q = query(collection(db, 'courses'),
    //         where("name", ">=", search.toUpperCase()),
    //         where("name", "<=", search.toUpperCase() + '\uf8ff')
    //     );

    //     // Execute the query and retrieve matching documents
    //     await getDocs(q).then((qs) => {
    //         qs.forEach((doc) => {
    //             results.push({ ...doc.data(), id: doc.id });
    //         });
    //     });

    //     return results;
    // };
    searchCourse = async(search) => {
        const results = [];
        const params = {q: search};
        try {
            const response = await axios.get(__API_URL + "searchCourses", {params});
            response.data.forEach(cls => {
                results.push(cls)
            });
        } catch (err) {
            console.log(`Error searching course (${search}): `, "error: " , err.response.data)
        }
        return results;
    }
    getCourse = async(courseId) => {
        console.log("GETTING course id: ", courseId)
        const params = {id: courseId};
        try {
            const response = await axios.get(__API_URL + "getCourse", {params});
            return response.data;
        } catch (err) {
            console.error(`Error getting course (${courseId}): `, err)
            return {};
        };
    }
    // getSchoolFromRef = async(school) => {
    //     let out = {}
    //     console.log("inside driver, school ref is: \n", school)
    //     await getDoc(school)
    //         .then(ds => {
    //             out = ds.data()
    //         })
    //     return out
    // }
    getSchoolFromRef = async(schoolId) => {
        const result = {};
        const params = {id: schoolId};
        try {
            const response = await axios.get(__API_URL + "getSchool", {params});
            return response.data;
        } catch (err) {
            console.error(`Error getting school (${schoolId}): `, err)
            return {};
        }
    }
    // TODO: Refactor to use API
    writeReviewFromCourse = async(course, data) => {
        if (!course || !data?.review || !data?.rating) {
            console.error("WRITE TO DB: failed, not valid course or data")
            return false;
        }
        const courseRef = (await this.getCourse(course)).id
        await updateDoc(doc(db, 'courses', courseRef), {
            ratings: arrayUnion({
                review: data.review,
                rating: data.rating,
            })
        })
        return true;
    }
}

const FirestoreDriver = Object.freeze(new Driver())

export default FirestoreDriver;
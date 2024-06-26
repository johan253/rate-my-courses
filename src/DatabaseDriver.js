import {collection, doc, getDoc, getDocs, updateDoc, getFirestore, query, where, arrayUnion} from "firebase/firestore"
import  app  from "./firebaseConfig"

let instance;
const db = getFirestore(app);
class Driver {
    constructor() {
        if (instance) throw new Error("New instance cannot be created of Firestore Driver");
        instance = this;
    }
    searchCourse = async (search) => {
        let results = [];
        console.log("SEARCHING course: ", search);

        // Construct a query to filter courses based on the search criteria
        const q = query(collection(db, 'courses'),
            where("name", ">=", search.toUpperCase()),
            where("name", "<=", search.toUpperCase() + '\uf8ff')
        );

        // Execute the query and retrieve matching documents
        await getDocs(q).then((qs) => {
            qs.forEach((doc) => {
                results.push({ ...doc.data(), id: doc.id });
            });
        });

        return results;
    };
    getCourse = async(crs) => {
        console.log("GETTING course: ", crs)
        return (await this.searchCourse(crs)).pop()
    }
    getSchoolFromRef = async(school) => {
        let out = {}
        console.log("inside driver, school ref is: \n", school)
        await getDoc(school)
            .then(ds => {
                out = ds.data()
            })
        return out
    }
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
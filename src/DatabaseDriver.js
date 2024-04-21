import {collection, getDoc, getDocs, getFirestore} from "firebase/firestore"
import  app  from "./firebaseConfig"

let instance;
const db = getFirestore(app);
class Driver {
    constructor() {
        if (instance) throw new Error("New instance cannot be created of Firestore Driver");
        instance = this;
    }
    searchCourse = async(search) => {
        let results = [];

        await getDocs(collection(db, 'courses')).then((qs) => {
            qs.docs.map((doc) => ({...doc.data(), id:doc.id}))
                .filter(classDoc => classDoc.name.toLowerCase().includes(search.toLowerCase()))
                ?.forEach(course => results.push(course));
        })
        if(!results) results = [];
        return results;
    }
    getCourse = async(crs) => {
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
}

const FirestoreDriver = Object.freeze(new Driver())

export default FirestoreDriver;
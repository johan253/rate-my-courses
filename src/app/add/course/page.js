'use client'
import React, {useRef, useState} from 'react';
import {getAuth} from "firebase/auth";
import {collection, getDoc, getDocs, getFirestore} from 'firebase/firestore'
import Navbar from "@/components/Navbar";
import {app} from "@/firebaseConfig"
import Link from "next/link";
import Footer from "@/components/Footer";

const AddCourse = () => {
    const auth = getAuth(app);
    const user = auth.currentUser
    const db = getFirestore(app)
    const homeLinkRef = useRef(null)
    const [newCourseName, setCourseName] = useState("")
    const [newCourseSchool, setCourseSchool] = useState("")
    const [newCourseLocation, setCourseLocation] = useState("")

    const handleCreate = async (e) => {
        e.preventDefault()
        if(newCourseName.trim() && newCourseSchool.trim() && newCourseLocation.trim()) {
            console.log("writing...")
            const schoolRef = await getSchoolDocReference(newCourseSchool)
            const data = {
                name: newCourseName.trim().toUpperCase(),
                // WARNING: Should not instantiate with reviews, create as made
                // ratings: [{
                //     rating: Number,
                //     review: String,
                // }],
                school: schoolRef
            }
            //TODO do something with data
            console.log(data)
        } else {
            console.log("invalid!")
        }
    }
    /**
     * This method gets the Document Reference for the passes school
     * @param nameSearch the school being searched
     * @returns null|DocumentReference<DocumentData, DocumentData>
     */
    const getSchoolDocReference = async(nameSearch) => {
        const schools = await getDocs(collection(db, 'schools'))
        try{
            return schools.docs.filter(qs =>
                nameSearch.toLowerCase() === qs.data().name.toLowerCase())[0].ref
        } catch (e) {
            return null;
        }
    }
    return (
        <div className={"bg-white text-black"}>
            <Navbar/>
            <Link href={"/"} ref={homeLinkRef} className={"hidden"}/>
            <section className={"p-5"}>
                <h1 className={"text-3xl my-12 text-center"}>
                    Add a new Course:
                </h1>
                <label className={"block my-24"}>
                    Course Code:
                    <input value={newCourseName} onChange={e => setCourseName(e.target.value)}
                           className={"border-2 border-black p-1 rounded-lg"}
                           placeholder={"MATH101..."}/>
                </label>
                <label className={"block my-24"}>
                    Institution Offered At:
                    <input value={newCourseSchool} onChange={e => setCourseSchool(e.target.value)}
                           className={"border-2 border-black p-1 rounded-lg"}
                           placeholder={"Stanford, University of..."}/>
                </label>
                <label className={"block mt-24"}>
                    Location of Institution:
                    <input value={newCourseLocation} onChange={e => setCourseLocation(e.target.value)}
                           className={"border-2 border-black p-1 rounded-lg"}
                           placeholder={"Seattle, WA..."}/>
                </label>
            </section>
            <div className={"p-5 flex items-center justify-center"}>
                <button className={"bg-black text-white p-4 rounded-2xl"}
                onClick={handleCreate}>
                    Submit
                </button>
            </div>
            <Footer/>
        </div>
    );
};

export default AddCourse;
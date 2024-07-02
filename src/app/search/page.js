"use client"

import React, {useEffect, useRef, useState} from 'react';
import Navbar from "@/components/Navbar";
import {useSearchParams} from "next/navigation";
import CourseCard from "@/components/CourseCard";
import Footer from "@/components/Footer";
import Link from "next/link";

import FirestoreDriver  from "../../DatabaseDriver";


function Search(props) {
    // Loading state
    const [loading, setLoading] = useState(true)
    // Reference to the "Add Course" button
    const createRef = useRef(null)
    // Get the search query from the URL
    const search = useSearchParams().get('q');
    // State for courses
    const [courses, setCourses] = useState([])
    // Fetch courses from Firestore using the search query
    const fetchData = async () => {
        setLoading(true)
        setCourses(await FirestoreDriver.searchCourse(search));
        setLoading(false)
    }
    useEffect(() => {
        fetchData();
    }, [search]);
    // Create CourseCard components for each course
    const cards = courses.map(c =>
        <CourseCard key={c.name} course={c}/>
    )
    return (
        <main className={"bg-white"}>
            <Navbar/>
            <div className={"bg-red-800 text-white p-8 max-w-full text-3xl"}>
                Showing Results For: &quot;{search}&quot;
            </div>
            <section className={"bg-cyan-300 text-xl w-full p-4 text-black min-h-96"}>
                {
                    loading ? "loading courses..." :
                        cards.length !== 0 ? cards : "No results found"
                }
            </section>
            <section className={"bg-pink-300 text-black p-6"}>
                <p>
                    Cant find what you&rsquo;re looking for?
                </p>
                <div className={"my-6"}>
                    <Link href={{pathname:"../add", query: {q: "course"}}} className={"bg-black text-white rounded-3xl p-5"}
                        ref={createRef}>
                        Add course
                    </Link>
                </div>

            </section>
            <Footer/>
        </main>

    );
}

export default Search;
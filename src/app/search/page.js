"use client"

import React, {useEffect, useRef, useState} from 'react';
import Navbar from "@/components/Navbar";
import { db } from "@/firebaseConfig"
import { collection, addDoc, getDoc, getDocs} from "firebase/firestore"
import {useSearchParams} from "next/navigation";
import CourseCard from "@/components/CourseCard";
import Footer from "@/components/Footer";
import Link from "next/link";


function Search(props) {
    const [loading, setLoading] = useState(true)
    const createRef = useRef(null)
    const search = useSearchParams().get('q').toLowerCase();

    const [courses, setCourses] = useState([])

    const fetchData = async () => {
        await getDocs(collection(db, 'courses'))
            .then((qs) => {
                const newData = qs.docs
                    .map((doc) => ({...doc.data(), id:doc.id}))
                setCourses(newData.filter(d => d.name.toLowerCase().includes(search)));
                console.log("after getDocs in search: \n",courses, newData)

            });
        setLoading(false)
    }
    useEffect(() => {
        fetchData();
    }, [search]);
    const cards = courses.map(c => <CourseCard key={c.name} course={c}/>)
    return (
        <main className={"bg-white"}>
            <Navbar/>
            <div className={"bg-red-800 text-white p-8 max-w-full text-3xl"}>
                Showing Results For: &quot;{search}&quot;
            </div>
            <section className={"bg-cyan-300 text-xl w-screen p-4 text-black"}>
                {
                    loading ? "loading courses..." :
                        cards.length !== 0 ? cards : "No results found"
                }
                {/*cards.length !== 0 ? cards : "No results found..."*/}
            </section>
            <section className={"bg-pink-300 text-black p-6"}>
                <p className={""}>
                    Cant find what you&rsquo;re looking for?
                </p>
                <div className={"my-6"}>
                    <Link href={"../create"} className={"bg-black text-white rounded-3xl p-5"}
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
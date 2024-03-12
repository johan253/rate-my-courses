"use client"

import React, {useEffect, useState} from 'react';
import Navbar from "@/components/Navbar";
import { db } from "@/firebaseConfig"
import { collection, addDoc, getDoc, getDocs} from "firebase/firestore"
import {useSearchParams} from "next/navigation";
import CourseCard from "@/components/CourseCard";

function Search(props) {
    const search = useSearchParams().get('q').toLowerCase();

    const [courses, setCourses] = useState([])

    const fetchData = async () => {
        await getDocs(collection(db, 'courses'))
            .then((qs) => {
                const newData = qs.docs
                    .map((doc) => ({...doc.data(), id:doc.id}))
                setCourses(newData.filter(d => d.name.toLowerCase().includes(search)));
                console.log(courses, newData)
            });
        //courses.filter(c => c.name.)
    }
    useEffect(() => {
        fetchData();
    }, []);
    const cards = courses.map(c => <CourseCard key={c.name} course={c}/>)
    return (
        <main className={"bg-white"}>
            <Navbar/>
            <div className={"bg-red-800 text-white p-8 max-w-full text-3xl"}>
                Showing Results For: &quot;{search}&quot;
            </div>
            <section className={"bg-cyan-300 text-xl w-screen p-4"}>
                {cards.length !== 0 ? cards : "No results found..."}
            </section>

        </main>

    );
}

export default Search;
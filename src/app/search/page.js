"use client"

import React, {useEffect, useState} from 'react';
import Navbar from "@/components/Navbar";
import { db } from "@/firebaseConfig"
import { collection, addDoc, getDoc, getDocs} from "firebase/firestore"
import {useSearchParams} from "next/navigation";

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
    return (
        <main className={"bg-white"}>
            <Navbar/>
            <div className={"bg-red-800 text-white p-8 max-w-full"}>
                {search}
            </div>
            <div className={"bg-white text-xl text-red-700 w-32 h-32"}>
                {courses.map(c => c.name)}
            </div>

        </main>

    );
}

export default Search;
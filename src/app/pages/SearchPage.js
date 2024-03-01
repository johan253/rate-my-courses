import React, {useEffect} from 'react';
import Navbar from "@/app/components/Navbar";
import { useParams, useLocation } from 'react-router-dom';
import { db } from "@/firebaseConfig"
import { collection, addDoc, getDoc, getDocs} from "firebase/firestore"
import {useState} from "react";


function SearchPage(props) {

    const [courses, setCourses] = useState([])

    const fetchData = async () => {
        await getDocs(collection(db, 'courses'))
            .then((qs) => {
                const newData = qs.docs
                    .map((doc) => ({...doc.data(), id:doc.id}))
                setCourses(newData);
                console.log(courses, newData)
            })
    }

    useEffect(() => {
        fetchData();
    }, [])


    //const {type} = useParams();
    const stateParam = useLocation().state.query;
    console.log("PARAMETER - ", stateParam)
    return (
        <main className={"bg-white"}>
            <Navbar/>
            <div className={"bg-red-800 text-white"}>{}</div>
            <div className={"bg-blue-800 text-white"}>{stateParam}</div>
            <div className={"bg-white text-9xl text-red-700 w-32 h-32"}>
                {courses.map(c => c.name)}
            </div>

        </main>

    );
}

export default SearchPage;
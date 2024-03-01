import React from 'react';
import Navbar from "@/app/components/Navbar";
import { useParams, useLocation } from 'react-router-dom';
import { db } from "@/firebaseConfig"
import { collection, addDoc, getDoc, getDocs} from "firebase/firestore"
import {useState} from "react";

function SearchPage(props) {
    //const {type} = useParams();
    const stateParam = useLocation().state.query;
    console.log("PARAMETER - ", stateParam)
    const courses = []
    getDocs(collection(db, "courses")).then(r => {
        r.forEach(doc => {
            courses.push(doc.data().name)
        })
    });
    console.log(courses)
    return (
        <main className={"bg-white"}>
            <Navbar/>
            <div className={"bg-red-800 text-white"}>{}</div>
            <div className={"bg-blue-800 text-white"}>{stateParam}</div>
            <div className={"bg-white text-9xl text-red-700 w-32 h-32"}>
                {courses.at(0)}
            </div>

        </main>

    );
}

export default SearchPage;
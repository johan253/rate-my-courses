'use client'
import React, {useRef, useState, useEffect} from 'react';
import Navbar from "@/components/Navbar";
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import app from '@/firebaseConfig';
import {AiFillGoogleCircle} from "react-icons/ai";
import {useSearchParams} from "next/navigation";
import Footer from "@/components/Footer";
import Link from "next/link";

const Login = (props) => {
    // Reference to the Link object that will redirect the user to write the review. Hidden by default
    const linkRef = useRef(null)
    // State for loading
    const [loading, setLoading] = useState(Boolean)
    // Get provider and auth object
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);
    // State for logged in status
    const [loggedIn, setLoggedIn] = useState(getAuth(app).currentUser !== null);
    // Get the target page query parameter
    const targetPage = useSearchParams().get('q')?.toLowerCase();
    // Get the target course query parameter (may not exist if adding a course and not a review)
    const targetCourse = useSearchParams().get('course');

    const handleLogin = async() => {
        const userCred = await signInWithPopup(auth, provider);
        setLoggedIn(userCred.user !== null)
    }

    useEffect(() => {
        // If the user is logged in, redirect them to the target page
        if (loggedIn && linkRef.current) {
            linkRef.current.click()
        }
    });

    return (
        <main className={"bg-white min-h-screen text-black"}>
            <Navbar/>
            {/* TODO: May need to edit this when adding a course? */}
            <Link href={
                    targetPage !== undefined ?
                    targetCourse !== undefined ? 
                    {pathname:"/add/review", query: {q: targetCourse}}
                    : `/add/${targetPage}`
                    : "/"
                } 
                className={"hidden"} ref={linkRef}
            />
            {
                loggedIn ?
                    // Testing purposes, renavigate to create page?
                    null
                    :
                    // Display login page
                    <div className={"bg-pink-200 p-8 text-center h-screen"}>
                        <p className={"my-20 text-4xl"}>
                            You need to be logged in to add classes or write reviews.
                        </p>
                        <button onClick={handleLogin}
                                className={"shadow-lg border-2 border-black rounded-3xl text-black p-4 w-48 flex justify-around mx-auto"}>
                            Log In
                            <AiFillGoogleCircle className={"scale-150 translate-y-1"}/>
                        </button>
                    </div>
            }
            <Footer/>
        </main>
    )
};

export default Login;
'use client'
import React, {useRef, useState} from 'react';
import Navbar from "@/components/Navbar";
import { getAuth, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from 'firebase/auth';
import app from '@/firebaseConfig';
import {AiFillGoogleCircle} from "react-icons/ai";
import {useSearchParams} from "next/navigation";
import Footer from "@/components/Footer";
import Link from "next/link";

const Login = (props) => {
    const linkRef = useRef(null)
    const [loading, setLoading] = useState(Boolean)
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app)
    const [loggedIn, setLoggedIn] = useState(Boolean)
    const targetPage = useSearchParams().get('q')?.toLowerCase();
    const handleLogin = async() => {
        await signInWithRedirect(auth, provider)
        getRedirectResult(auth).then(result => {
            const user = result.user
        })
    }
    auth.onAuthStateChanged(function(user) {
        if (user) {
            setLoggedIn(true)
        } else {
            setLoggedIn(false)
        }
    })

    return (
        <main className={"bg-white min-h-screen text-black"}>
            <Navbar/>
            {
                loggedIn ?
                    // Testing purposes, renavigate to create page?
                    linkRef.current.click()
                    :
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
            <Link href={targetPage !== undefined ? `/add/${targetPage}` : "/"} className={"hidden"} ref={linkRef}/>
            <Footer/>
        </main>
    )
};

export default Login;
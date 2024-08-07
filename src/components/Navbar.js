"use client";

import {useRef, useState} from "react";
import Link from "next/link";
import app from "@/firebaseConfig";
import {getAuth} from "firebase/auth";

export default function Navbar() {
    // Ref to Link component to go to home page
    const homeLinkRef = useRef(null)
    // State constant for value in search box
    const [search, setSearch] = useState("");
    function changeSearch(e) {
        setSearch(e.target.value);
    }
    //TODO: implement autofill
    function handleSearch(e) {
        e.preventDefault()
        homeLinkRef.current.click()
    }
    //TODO: Remove when done testing
    const signOut = () => {
        getAuth(app).signOut().then(() => {
            console.info("NAVBAR: Signed out")
        }).catch((error) => {
            console.info(`NAVBAR: An error occured while signing out: \n${error}`)
        });
    }
    return(
        <header className={"bg-black flex justify-between p-3 text-white"}>
            <Link href={"/"} className={"items-center justify-center font-extrabold text-xl"}>
                <p className={"text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-400"}>
                    Rate My Courses
                </p>
            </Link>
            <form onSubmit={handleSearch} className={"justify-end w-1/2"}>
                <input className={"text-black px-2 py-1 rounded-3xl w-full"} placeholder={"Search for a course"}
                value={search} onChange={changeSearch}/>
            </form>
            {/* TODO: Remove */}
            <button onClick={signOut}>
                Sign Out
            </button>
            <Link href={{pathname: '/search', query: {q: search}}} ref={homeLinkRef}
            className={"hidden"}/>
        </header>
    )
}
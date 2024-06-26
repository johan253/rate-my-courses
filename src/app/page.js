"use client";

import React, {useRef, useState} from 'react';
import { AiOutlineMenu } from "react-icons/ai";
import Image from "next/image";
import BGImage from "../assets/home-bg.png";
import Link from "next/link";
function HomePage() {
    const linkRef = useRef(null);
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        e.preventDefault()
        linkRef.current.click()
    }
    return (
        <main className={"text-black bg-white"}>
            <nav className={" p-5 bg-red-300"}>
                <AiOutlineMenu className={"ml-auto scale-150"}/>
            </nav>
            <div className={"p-8 font-extrabold font-mono text-3xl bg-orange-200"}>
                <p className={"text-center"}>Hey there!</p>
            </div>
            <div className={"bg-cyan-200 p-3 md:h-96 relative"} >
                <Image src={BGImage} alt={"Stock photo of a campus"}
                className={"opacity-65 h-full w-full object-cover"}/>
                <div className={"opacity-50 absolute bg-lime-300 inset-0 m-3 justify-center p-10 block"}>
                    <h1 className={"w-full text-center m-5 text-5xl font-bold"}>Rate My Courses</h1>
                    <p className={"m-3"}>Browse for courses you are considering taking and write reviews for others to see!</p>
                    <form onSubmit={handleSearch} className={"bg-red-800 flex"}>
                        <input className={"h-12 w-full my-auto rounded-l-3xl p-3"}
                        placeholder={"Search for a course..."}
                        value={search}
                        onChange={e => setSearch(e.target.value)}/>
                        <Link href={{pathname: '/search', query: {q: search}}} ref={linkRef}
                            className={"bg-black p-3 text-white rounded-r-3xl"}>
                            Submit
                        </Link>
                    </form>
                </div>
            </div>
            {/* //TODO add more here later */}
            <section className={"bg-pink-200 p-5"}>
                Add more here later
            </section>
        </main>
    );
}

export default HomePage;
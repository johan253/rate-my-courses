"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CourseError({ reset }) {
    return (
        <main className={"bg-white"}>
            <Navbar/>
            <div className={"bg-red-800 text-white p-8 max-w-full text-3xl"}>
                Error: Course not found
            </div>
            <section className={"bg-cyan-300 text-xl w-full p-4 text-black min-h-96"}>
                <p>
                    The course you are looking for does not exist.
                </p>
                <button onClick={reset} className={"bg-black text-white rounded-3xl p-5"}>
                  Try again
                </button>
            </section>
            <Footer/>
        </main>
    );
}
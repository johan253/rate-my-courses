"use client";

import React, {useEffect, useRef, useState} from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {getAuth} from "firebase/auth";
import {useSearchParams} from "next/navigation";
import FirestoreDriver from "@/DatabaseDriver";

const AddReview = () => {
    // State for review text, rating, and user name
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(1);
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true);

    // State for course object and course name
    // const [courseObj, setCourseObj] = useState({});
    const [courseName, setCourseName] = useState("loading...");

    // Reference to the course page and home page
    const coursePageRef = useRef(null);
    const homeRef = useRef(null);

    // Get the course ID from the URL
    const courseId = useSearchParams().get("q");

    // Get the current auth state
    const auth = getAuth();

    useEffect(() => {
        // Redirect the user to the home page if they are not logged in
        if (!auth.currentUser) homeRef.current.click();
        // Set the user name
        setUserName(auth.currentUser?.displayName);
        // Fetch the course object
        const fetchData = async() => {
            const course = await FirestoreDriver.getCourse(courseId);
            setCourseObj(course);
            setCourseName(course.name);
        };
        fetchData();
        setLoading(false);
    }, [courseId, auth.currentUser]); // auth.currentUser could cause bugs. So could courseId
    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        // Redirect the user after submitting the review
        const success = await FirestoreDriver.writeReviewFromCourse(
            courseId,
            {review: reviewText, rating}
        );
        if (success) {
            alert("Review submitted successfully!");
            coursePageRef.current.click();
        } else {
            alert("Failed to submit review. Please try again.");
        }
        setLoading(false);
    };
    return (
        <div className={"bg-white text-black"}>
            <Navbar/>
            {loading && (
                <div className="flex justify-center items-center h-screen">
                    <h1 className="text-3xl font-bold">Loading...</h1>
                </div>
            )}
            <main className={loading && "hidden"}>
                <h1 className={"w-screen bg-blue-500 p-6 text-3xl font-bold"}>
                Hello, {userName}
                </h1>
                <div className="max-w-md mx-auto p-8 bg-neutral-100 rounded-lg shadow-lg my-12">
                    <h1 className="text-2xl font-bold mb-4 text-center">
                        Add Review for {courseName.toUpperCase()}
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="review">
                                Review:
                            </label>
                            <textarea
                                id="review"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="rating">
                                Rating:
                            </label>
                            <select
                                id="rating"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                                value={rating}
                                onChange={(e) => setRating(parseInt(e.target.value))}
                            >
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <option key={value} value={value}>{value}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:bg-blue-600 hover:bg-blue-600"
                        >
                            Submit Review
                        </button>
                    </form>
                </div>
                <Footer/>
                <Link href={"/"} ref={homeRef}/>
                <Link href={{pathname: "/course", query: {q: courseId}}} ref={coursePageRef}/>
            </main>
            
        </div>
    );
};

export default AddReview;

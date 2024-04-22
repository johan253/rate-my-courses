'use client'

import React, {useEffect, useRef, useState} from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {getAuth} from "firebase/auth";
import {app} from "/firebaseConfig"
import {useSearchParams} from "next/navigation";

const AddReview = () => {
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(1);
    const [userName, setUserName] = useState('')
    const homeRef = useRef(null)
    const courseName = useSearchParams().get('q')
    const auth = getAuth();
    useEffect(() => {
        if (!auth.currentUser) homeRef.current.click()
        setUserName(auth.currentUser?.displayName)
    }, [])
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you can add logic to submit the review, for example, sending it to a server
        console.log({ review:reviewText, rating });
        // Redirect the user after submitting the review
    };

    return (
        <div className={"bg-white text-black"}>
            <Navbar/>
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
        </div>
    );
};

export default AddReview;

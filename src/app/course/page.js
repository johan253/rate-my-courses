'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import FirestoreDriver from '../../DatabaseDriver';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StarRating from '@/components/StarRating'; // Import the StarRating component

const CoursePage = () => {
    const queue = useSearchParams().get('q').toLowerCase();
    const [course, setCourse] = useState({});
    const [school, setSchool] = useState({});
    const [ratingCards, setRatingCards] = useState([]);
    const [averageRating, setAverageRating] = useState(0); // State for average rating

    const getData = async () => {
        const fetchedCourse = await FirestoreDriver.getCourse(queue);
        setCourse(fetchedCourse);
        if (fetchedCourse.school) {
            const fetchedSchool = await FirestoreDriver.getSchoolFromRef(fetchedCourse.school);
            setSchool(fetchedSchool);
        } else {
            console.error('No school for this course was found');
        }
    };

    useEffect(() => {
        getData();
    }, [queue]);

    useEffect(() => {
        if (course && course.ratings) {
            const cards = course.ratings.map((r, index) => (
                <div key={index} className="bg-neutral-200 shadow-md p-6 rounded-lg shadow-neutral-300">
                    <StarRating rating={r.rating} /> {/* Use StarRating component */}
                    <p className="text-gray-700">{r.review}</p>
                </div>
            ));
            setRatingCards(cards);

            // Calculate average rating
            const totalRating = course.ratings.reduce((acc, curr) => acc + curr.rating, 0);
            const avgRating = totalRating / course.ratings.length;
            setAverageRating(avgRating);
        }
    }, [course]);

    const courseName = course.name || '';
    const courseSchool = school.name || '';
    const courseLocation = school.location || '';

    return (
        <div className="bg-white text-black min-h-screen flex flex-col">
            <Navbar />
            <section className="container mx-auto flex-grow mt-8">
                <h1 className="text-3xl font-bold mb-2">{courseName}</h1>
                <StarRating rating={averageRating} /> {/* Display average rating */}
                <h2 className="text-lg font-medium mb-1">{courseSchool}</h2>
                <h3 className="text-sm mb-4">{courseLocation}</h3>
            </section>
            <section className="container mx-auto flex-grow mt-8 ">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ratingCards}
                </div>
            </section>
            <div className="py-4">
                <div className="container mx-auto">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Rate this Course
                    </button>
                </div>
            </div>
            <section className="container mx-auto flex-grow mt-8">
                <h2 className="text-2xl font-semibold mb-4">Similar Classes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Placeholder for similar classes */}
                    <div className="bg-gray-200 text-black p-4 rounded">
                        Similar Class 1
                    </div>
                    <div className="bg-gray-200 text-black p-4 rounded">
                        Similar Class 2
                    </div>
                    <div className="bg-gray-200 text-black p-4 rounded">
                        Similar Class 3
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default CoursePage;

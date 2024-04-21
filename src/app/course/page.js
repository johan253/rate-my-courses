'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import FirestoreDriver from '../../DatabaseDriver';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const CoursePage = () => {
    const queue = useSearchParams().get('q').toLowerCase();
    const [course, setCourse] = useState({});
    const [school, setSchool] = useState({});
    const [ratingCards, setRatingCards] = useState([]);

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
                <div key={index} className="bg-blue-500 border-black border-2 m-1.5 p-5 rounded-md">
                    <h2 className="text-xl font-semibold">{r.rating}</h2>
                    <p className="text-gray-800">{r.review}</p>
                </div>
            ));
            setRatingCards(cards);
        }
    }, [course]);

    const courseName = course.name || '';
    const courseSchool = school.name || '';
    const courseLocation = school.location || '';

    return (
        <div className="bg-white text-black min-h-screen">
            <Navbar />
            <section className="container mx-auto mt-8">
                <h1 className="text-3xl font-semibold">{courseName}</h1>
                <h2 className="text-lg font-medium text-gray-700">{courseSchool}</h2>
                <h3 className="text-sm font-medium text-gray-500">{courseLocation}</h3>
            </section>
            <section className="container mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ratingCards}
            </section>
            <Footer />
        </div>
    );
};

export default CoursePage;

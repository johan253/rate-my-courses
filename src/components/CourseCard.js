import React, {useEffect, useState} from 'react';
import { getDoc } from "firebase/firestore";
import Link from "next/link";
import FirestoreDriver from "@/DatabaseDriver";
import StarRating from "@/components/StarRating";

function CourseCard(props) {
    const course = props.course
    const [school, setSchool] = useState({});
    async function getSchool() {
        setSchool(await FirestoreDriver.getSchoolFromRef(course.school))
    }
    const allRatings = course.ratings.map(r => r.rating);
    let average = allRatings.reduce((ps, c) => ps + c, 0)
    average /= allRatings.length;
    useEffect(() => {
        getSchool();
    }, [])
    return (
        <div className={"m-5 rounded-3xl shadow-xl max-w-screen-md border-2 border-black"}>
            <Link href={{pathname: '/course', query: {q: course.name}}}>
                <h3 className={"p-4 bg-black rounded-t-2xl text-white"}>
                    {course.name}
                    <br/>
                    Average Rating:
                    <StarRating rating={average}/>
                </h3>
                <p className={"p-4 text-black"}>
                    At {school.name}
                    <br/>
                    {school.location}
                </p>
            </Link>
        </div>
    );
}

export default CourseCard;
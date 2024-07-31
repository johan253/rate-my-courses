import React, {useEffect, useState} from "react";
import Link from "next/link";
import FirestoreDriver from "@/DatabaseDriver";
import StarRating from "@/components/StarRating";
import LoadingText from "./LoadingText";

function CourseCard(props) {
    const course = props.course;
    const [school, setSchool] = useState({});
    const [loading, setLoading] = useState(true);
    async function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function getSchool() {
        setSchool(await FirestoreDriver.getSchoolFromRef(course.school._path.segments[1]));
    }
    const allRatings = course.ratings.map(r => r.rating);
    let average = allRatings.reduce((ps, c) => ps + c, 0);
    average /= allRatings.length;
    useEffect(() => {
        setLoading(true);
        getSchool();
        timeout(1000).then(() =>
            setLoading(false)
        );
    }, []);
    return (
        <div className={"m-5 rounded-3xl shadow-xl max-w-screen-md border-2 border-black"}>
            <Link href={{pathname: "/course", query: {q: course.id}}}>
                <h3 className={"p-4 bg-black rounded-t-2xl text-white"}>
                    {course.name}
                    <br/>
                    Average Rating:
                    <StarRating rating={average}/>
                </h3>
                <div className={" text-black p-2"}>
                    <div className="flex w-full h-full p-2">
                        At&nbsp;
                        {
                            loading ? 
                                <LoadingText/> 
                                : school.name
                        }
                    </div>
                    <div className="flex w-full h-full p-2">
                        📍&nbsp;
                        {
                            loading ?
                                <LoadingText/>
                                : school.location
                        }
                    </div>
                    
                </div>
            </Link>
        </div>
    );
}

export default CourseCard;
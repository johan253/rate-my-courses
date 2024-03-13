import React, {useEffect, useState} from 'react';
import { getDoc } from "firebase/firestore";
import Link from "next/link";
function CourseCard(props) {
    const [school, setSchool] = useState({});
    async function getSchool() {
        await getDoc(props.course.school)
            .then(ds => {
                setSchool(ds.data())
                console.log("getDoc for school: \n", school)
            })
    }
    const allRatings = props.course.ratings.map(r => r.rating);
    let average = allRatings.reduce((ps, c) => ps + c, 0)
    average /= allRatings.length;
    useEffect(() => {
        getSchool();
    }, [])
    return (
        <div className={"m-5 rounded-3xl shadow-xl max-w-screen-md border-2 border-black"}>
            {/* TODO: Link to form to create course */}
            <Link href={"../"}>
                <h3 className={"p-4 bg-black rounded-t-2xl text-white"}>
                    {props.course.name}
                    <br/>
                    Average Rating: {average}
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
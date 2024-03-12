import React, {useEffect, useState} from 'react';
import { db } from '../firebaseConfig';
import {collection, getDoc, getDocs} from "firebase/firestore";
function CourseCard(props) {
    const [school, setSchool] = useState({});
    async function getSchool() {
        await getDoc(props.course.school)
            .then(ds => {
                setSchool(ds.data())
                console.log(school)
            })
    }
    const allRatings = props.course.ratings.map(r => r.rating);
    let average = allRatings.reduce((ps, c) => ps + c, 0)
    average /= allRatings.length;
    useEffect(() => {
        getSchool();
    }, [])
    return (
        <div className={"m-5 rounded-3xl shadow-xl max-w-screen-md"}>
            <h3 className={"p-4 bg-black rounded-t-3xl"}>
                {props.course.name}
                <br/>
                Average Rating: {average}
            </h3>
            <p className={"p-4 text-black"}>
                At {school.name}
                <br/>
                {school.location}
            </p>
        </div>
    );
}

export default CourseCard;
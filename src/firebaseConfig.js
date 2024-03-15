import { initializeApp } from "firebase/app";

require('dotenv').config()
const REACT_APP_API_KEY = process.env.REACT_APP_API_KEY
console.log(REACT_APP_API_KEY)

const firebaseConfig = {
    // TODO REMOVE API KEY
    // apiKey: REACT_APP_API_KEY,
    authDomain: "rate-my-course-0.firebaseapp.com",
    projectId: "rate-my-course-0",
    storageBucket: "rate-my-course-0.appspot.com",
    messagingSenderId: "947037910620",
    appId: "1:947037910620:web:c2030df1cb0eeb99559899",
    measurementId: "G-QM2LJVQMGJ"
};

const app = initializeApp(firebaseConfig);

export {app};
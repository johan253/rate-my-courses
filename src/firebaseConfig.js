import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import key from "./.env"

const firebaseConfig = {
    apiKey: key,
    authDomain: "rate-my-course-0.firebaseapp.com",
    projectId: "rate-my-course-0",
    storageBucket: "rate-my-course-0.appspot.com",
    messagingSenderId: "947037910620",
    appId: "1:947037910620:web:c2030df1cb0eeb99559899",
    measurementId: "G-QM2LJVQMGJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};
'use client'
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
// import Image from "next/image";
// import { db } from "../firebaseConfig"
// import { collection, addDoc, getDoc, getDocs} from "firebase/firestore"
// import {useState} from "react";
// import Navbar from './components/Navbar'
// import Rating from "@/app/components/Rating";
import HomePage from "@/app/components/HomePage";


export default function Home() {

  return (
    <main className={"bg-white"}>
      <Router>
          <Routes>
              <Route path={"/"} element={<HomePage/>}/>
              <Route path={"/about"} element={'About'}/>
          </Routes>
      </Router>
    </main>
  );
}

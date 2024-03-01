'use client'
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
// import Image from "next/image";
// import { db } from "../firebaseConfig"
// import { collection, addDoc, getDoc, getDocs} from "firebase/firestore"
// import {useState} from "react";
// import Navbar from './components/Navbar'
// import Rating from "@/app/components/Rating";
import HomePage from "@/app/pages/HomePage";
import SearchPage from "@/app/pages/SearchPage";


export default function Home() {

  return (
    <main className={"bg-white"}>
      <Router>
          <Routes>
              <Route path={"/"} element={<HomePage/>}/>
              <Route path={"/search/:type"} element={<SearchPage/>}/>
          </Routes>
      </Router>
    </main>
  );
}

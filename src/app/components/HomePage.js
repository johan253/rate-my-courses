import React from 'react';
import {Bs9CircleFill} from "react-icons/bs";
import {AiOutlineMenu, AiOutlineMenuFold, AiOutlineMenuUnfold} from "react-icons/ai";
import Image from "next/image";
import BGImage from "../assets/home-bg.png";

function HomePage(props) {
    return (
        <main className={"text-black"}>
            <nav className={" p-5 bg-red-300"}>
                <AiOutlineMenu className={"ml-auto scale-150"}/>
            </nav>
            <div className={"p-8 font-extrabold font-mono text-3xl bg-orange-200"}>
                <p className={"text-center"}>Hey there!</p>
            </div>
            <div className={"flex-shrink-0 bg-cyan-200 p-3 max-h-64 sm:max-h-96 md:max-h-max"}>
                <Image src={BGImage} alt={"Stock photo of a campus"}
                       className={"opacity-50 object-cover h-full w-full"}>

                </Image>
            </div>

        </main>
    );
}

export default HomePage;
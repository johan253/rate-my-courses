import React from "react";
import {AiFillFacebook, AiFillGithub, AiFillTwitterCircle} from "react-icons/ai";

function Footer() {
    return (
        <footer className={"bg-black p-10 text-white"}>
            <p className={"flex-auto"}>
                {"Questions, comments, or concerns? Email me at: "}
                <a href={"mailto:johannjo2000@gmail.com"} className={"text-gray-400"}>
                    johannjo2000@gmail.com
                </a>
            </p>
            <div className={"flex p-5 justify-around"}>
                <AiFillTwitterCircle/>
                <AiFillGithub/>
                <AiFillFacebook/>
            </div>
        </footer>
    );
}

export default Footer;
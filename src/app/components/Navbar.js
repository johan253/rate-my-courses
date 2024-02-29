import {NavLink, Route} from "react-router-dom";
import {useState} from "react";
export default function Navbar() {
    const [search, setSearch] = useState("");
    function changeSearch(e) {
        setSearch(e.target.value);
    }
    //TODO: implement course search and possibly autofill
    function handleSearch(e) {
        console.log(search);
    }
    return(
        <header className={"bg-black flex justify-between p-3"}>
            <NavLink to={"/"} className={"items-center justify-center font-extrabold text-xl"}>
                <p className={"text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-400"}>
                    Rate My Courses
                </p>
            </NavLink>
            <form action={handleSearch} className={"justify-end w-1/2"}>
                <input className={"text-black px-2 py-1 rounded-3xl w-full"} placeholder={"Search for a course"}
                       value={search} onChange={changeSearch}/>
            </form>
        </header>
    )
}
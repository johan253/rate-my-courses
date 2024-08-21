"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SearchBar = () => {
    const [search, setSearch] = useState("");
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        router.push(`/search?q=${search}`);
    };

    return (
        <form onSubmit={handleSearch} className={"bg-red-800 flex"}>
            <input className={"h-12 w-full my-auto rounded-l-3xl p-3"}
                placeholder={"Search for a course..."}
                value={search}
                onChange={e => setSearch(e.target.value)}/>
            <button type={"submit"}
                className={"bg-black p-3 text-white rounded-r-3xl"}>
                Submit
            </button>
        </form>
    );
};

export default SearchBar;
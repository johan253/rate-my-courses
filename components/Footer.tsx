import Link from "next/link";
import { FaXTwitter, FaInstagram, FaGithub } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-gray-100 p-4 text-center flex flex-col items-center">
      <ul className="flex gap-2 justify-around w-screen">
        <li><Link href="/">Help</Link></li>
        <li><Link href="mailto:johan.hdzz@outlook.com">Contact</Link></li>
        <li><Link href="/">About</Link></li>
        <li><Link href="/">Guidelines</Link></li>
        <li><Link href="/">Terms & Conditions</Link></li>
      </ul>
      <ul className="flex p-2 w-1/3 justify-around">
        <li><Link href="/"><FaXTwitter/></Link></li>
        <li><Link href="/"><FaInstagram/></Link></li>
        <li><Link href="/"><FaGithub/></Link></li>
      </ul>
      <p>&copy; {new Date().getFullYear()} Rate My Courses. All rights reserved.</p>
    </footer>
  );
}

'use client';
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./Navbar.css";
import LogoutButton from "../Signout";
import { useSession } from "next-auth/react";


const Navbar: React.FC = () => {
  const isLogin = true; // Based on authentication
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>You are not logged in</p>;

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    
    const selected = e.target.value;
    if (selected) {
      router.push(`/category/${selected}`);
    }
  };

  return (
    <div className="navbar">
      <h1 className="logo">काव्यपथ</h1>

      {isLogin && (
        <>
          <input type="checkbox" id="menu-toggle" className="menu-toggle" />
          <label htmlFor="menu-toggle" className="hamburger">
            &#9776;
          </label>
        </>
      )}

      <ul className="nav-links">
        <li>
          <Link href="/dashboard">मुखपृष्ठ</Link>
        </li>
        <li>
          <select name="category" id="category" onChange={handleCategoryChange}>
            <option value="">श्रेणी चुनें</option>
            <option value="prem">प्रेम</option>
            <option value="virah">विरह</option>
            <option value="deshbhakti">देशभक्ति</option>
            <option value="hasya">हास्य</option>
          </select>
        </li>
        <li>
          <Link href="/write-poem">कविता जोड़ें</Link>
        </li>
      </ul>

      <Link href={`/profile/${session.user?.name}`}>
      <button className="hover:cursor-pointer">
      प्रोफ़ाइल
      </button>
      </Link>
      

      
    </div>
  );
};

export default Navbar;

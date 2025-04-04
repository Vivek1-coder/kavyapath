'use client';
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const isLogin = true; // Based on authentication
  const router = useRouter();

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
          <Link href="/dashboard">Home</Link>
        </li>
        <li>
          <select name="category" id="category" onChange={handleCategoryChange}>
            <option value="">Category</option>
            <option value="prem">Prem</option>
            <option value="virah">Virah</option>
            <option value="deshbhakti">Deshbhakti</option>
            <option value="haashya">Haashya</option>
          </select>
        </li>
        <li>
          <Link href="/write-poem">Add Poem</Link>
        </li>
      </ul>

      {!isLogin && <button className="btn">Register</button>}
      {isLogin && <button className="btn">My Profile</button>}
    </div>
  );
};

export default Navbar;

"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import deshbhakti from "../../../../../public/images/deshbhakti.png";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";

interface DataProps {
  _id: string;
  imgUrl: string;
  title: string;
  author: string;
  content: string;
  category: string;
}

function Card({ data }: { data: DataProps }) {
  const { _id,imgUrl, title, author, content } = data;
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  function getFirst10Chars(htmlContent: string): string {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.slice(0, 10);
  }

  return (
    <div
      ref={ref}
      className={`mx-auto max-w-sm overflow-hidden rounded-xl border border-orange-200/40 bg-gradient-to-br from-white/40 via-orange-100/50 to-white/30 shadow-lg backdrop-blur-md transition-all duration-700 ease-in-out hover:bg-orange-50/60 ${
        inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      } `}
    >
      {/* Image Section */}
      <Image
        src={deshbhakti}
        alt="Poem Visual"
        width={500}
        className="z-1000 h-48 w-full object-cover"
      />

      {/* Poem Content */}
      <div className="p-6 w-96">
        <h2 className="mb-2 text-xl font-semibold text-orange-900">{title}</h2>
        <p className="text-sm leading-relaxed text-gray-800 italic">
          {getFirst10Chars(content.slice(0, 100))}
        </p>

        {/* Author Name */}
        <p className="mt-3 text-sm font-medium text-gray-600">
          — <span className="text-orange-700">प्रकृति</span>
        </p>

        {/* Read More Button */}
        <Link href={`/poem/${_id}`}>
        <button className="mt-4 w-full rounded-lg bg-orange-400 px-4 py-2 font-medium text-white transition-colors duration-500 hover:bg-orange-500">
          Read More
        </button>
        </Link>
        
      </div>
    </div>
  );
}

function ContentArray() {
  const [data, setData] = useState<DataProps[]>([]);

  const params = useParams();
  const category = params?.category;

  const fetchPoems = async () => {
    try {
      const response = await axios.get(
        `/api/poems/get-category-poems?category=${category}`
      );
      setData(response.data.poems);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPoems();
  }, [data]);

  return (
    <div className="pg-category login-background overflow-x-hidden">
      <Navbar />
      <div className="grid grid-cols-3 gap-10">
        {data.map((card, index) => {
          return <Card key={index} data={card}/>;
        })}
      </div>
    </div>
  );
}
// function Card() {
//   return (
//     <div className="mx-auto max-w-sm overflow-hidden rounded-xl border border-orange-200/40 bg-gradient-to-br from-white/40 via-orange-100/50 to-white/30 shadow-lg backdrop-blur-md transition-colors duration-500 ease-in-out hover:bg-orange-50/60">
//       {/* Image Section */}
//       <img
//         src="https://source.unsplash.com/400x250/?poetry,autumn"
//         alt="Poem Visual"
//         className="h-48 w-full object-cover"
//       />

//       {/* Poem Content */}
//       <div className="p-6">
//         <h2 className="mb-2 text-xl font-semibold text-orange-900">
//           The Whispering Breeze
//         </h2>
//         <p className="text-sm leading-relaxed text-gray-800 italic">
//           “The wind hums a melody, soft yet free, Dancing through valleys,
//           whispering to me...”
//         </p>

//         {/* Read More Button */}
//         <button className="mt-4 w-full rounded-lg bg-orange-400 px-4 py-2 font-medium text-white transition-colors duration-500 hover:bg-orange-500">
//           Read More
//         </button>
//       </div>
//     </div>
//   );
// }
// function Card(data) {
//   return (
//     <div className="mx-auto max-w-sm overflow-hidden rounded-xl bg-white/30 shadow-lg backdrop-blur-md transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl">
//       {/* Image Section */}
//       <img
//         src="./assets/photo.png"
//         alt="Poem Image"
//         className="h-48 w-full object-cover"
//       />

//       {/* Poem Content */}
//       <div className="p-6">
//         <h2 className="mb-2 text-xl font-bold text-gray-900">
//           The Whispering Breeze
//         </h2>
//         <p className="text-sm text-gray-700 italic">
//           "The wind hums a melody, soft yet free, Dancing through valleys,
//           whispering to me..."
//         </p>

//         {/* Read More Button */}
//         <button className="mt-4 w-full rounded-lg bg-orange-500 px-4 py-2 font-medium text-white transition-all duration-500 ease-in-out hover:bg-red-500">
//           Read More
//         </button>
//       </div>
//     </div>
//   );
// }

export default ContentArray;

/* eslint-disable no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import deshbhakti from '../../../public/images/deshbhakti.png'
import Image from "next/image";
// Interface for card props
interface DataProps {
  imgUrl: string;
  title: string;
  author: string;
  content: string;
  category: string;
}



// Card Component
function Card({ data }: { data: DataProps }){
  const {  title,content } = data;
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  function getFirst10Chars(htmlContent: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    return text.slice(0, 10);
  }

  return (
    <div
      ref={ref}
      className={`mx-auto max-w-sm overflow-hidden rounded-xl border border-orange-200/40 bg-gradient-to-br from-white/40 via-orange-100/50 to-white/30 shadow-lg backdrop-blur-md transition-all duration-700 ease-in-out hover:bg-orange-50/60 ${
        inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      {/* Image Section */}
      <Image
        src={deshbhakti}
        alt="Poem Visual"
        width={500}
        className="z-1000 h-48 w-full object-cover"
      />

      {/* Poem Content */}
      <div className="p-6">
        <h2 className="mb-2 text-xl font-semibold text-orange-900">
          {title}
        </h2>
        <p className="text-sm leading-relaxed text-gray-800 italic">
        {getFirst10Chars(content.slice(0,100))}
        </p>

        {/* Author Name */}
        {/* <p className="mt-3 text-sm font-medium text-gray-600">
          — <span className="text-orange-700">{author}</span>
        </p> */}

        {/* Read More Button */}
        <button className="mt-4 w-full rounded-lg bg-orange-400 px-4 py-2 font-medium text-white transition-colors duration-500 hover:bg-orange-500">
          Read More
        </button>
      </div>
    </div>
  );
};

// ContentArray Component
const ContentArray: React.FC = () => {
  const [data,setData] = useState<DataProps[]>([])

  const fetchPoems = async() => {
      try {
        const response = await axios.get(`/api/poems/get-poems`)
        setData(response.data.poems)
      } catch (error) {
        console.log(error)
      }
    }
  
    useEffect(() => {
      fetchPoems()
    }, [data])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-4">
      {data.map((card, index) => (
        <Card key={index} data={card} />
      ))}
    </div>
  );
};

export default ContentArray;

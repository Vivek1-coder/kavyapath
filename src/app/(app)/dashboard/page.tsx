"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar/Navbar";
import ContentArray from "@/components/Card/Card"


const categories = [
  { name: "देशभक्ति", path: "deshbhakti", color: "bg-orange-500" },
  { name: "प्रेम", path: "prem", color: "bg-red-500" },
  { name: "हास्य", path: "hasya", color: "bg-yellow-500" },
  { name: "भक्ति", path: "bhakti", color: "bg-blue-500" },
  { name: "वीर रस", path: "virras", color: "bg-green-500" },
  { name: "श्रृंगार", path: "shringar", color: "bg-purple-500" },
];


export default function Page() {

  
  return (
    <>
      <div className="dashboard absolute w-screen h-screen overflow-hidden">
        <Navbar />
        {/* bg-gradient-to-b from-orange-500 via-white to-green-600  */}
        <div className="content-box relative w-fit">
          <div className="dash-upper">
            <motion.h1
              className="dash-h1"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              काव्य श्रेणियाँ
            </motion.h1>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {categories.map((category) => (
                <Link
                  key={category.path}
                  href={`/category/${category.path}`}
                  passHref
                >
                  <motion.div
                    className={`cursor-pointer p-6 rounded-lg shadow-lg transition-transform transform ${category.color} text-white text-center text-xl font-bold`}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.001, duration: 0.4 }}
                  >
                    {category.name}
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </div>
          <ContentArray/>
        </div>
      </div>
    </>
  );
}

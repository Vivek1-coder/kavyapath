"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#ff9933] via-white to-[#138808]">
      {/* Blurry Glass Effect */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-xl"></div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 text-center p-8 bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
          className="text-5xl font-bold text-transparent py-2 bg-clip-text bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#60A5FA] drop-shadow-lg"
        >
          सुस्वागतम् काव्य पथ पर
        </motion.h1>
        <p className="mt-5 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#60A5FA] drop-shadow-lg">
          कविता की राह पर आपका हार्दिक स्वागत है।
        </p>

        {/* Button with Hover & Transition */}
        <Link href="/sign-in">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mt-6 px-6 py-3 text-lg font-semibold text-white bg-[#138808] rounded-lg shadow-md transition-all duration-300 hover:bg-[#0f6d30] hover:cursor-pointer"
        >
          
         
          आरंभ करें
        </motion.button>
        </Link>
      </motion.div>
     
    </div>
  );
}

"use client"

import Image from "next/image";
import HomeNavbar from "./(components)/home-navbar";

export default function Home() {     
  return (

    <div>
        <HomeNavbar />
        <div className="relative h-[90vh] w-full bg-gradient-to-r from-[#6f2dbd] to-[#f72585] overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 h-full flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2">
              <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight">
                Trello brings all your tasks, teammates, and tools together
              </h1>
              <p className="text-white/90 mt-4 text-lg md:w-4/5">
                Keep everything in the same place—even if your team isn’t.
              </p>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
            <Image
              src="/trellofull.png"
              width={400}
              height={300}
              alt="trello app preview"
              className="rounded-lg shadow-lg"
            />
          </div>
          </div>
            <svg
              className="absolute bottom-0 left-0 w-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 120" 
            >
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,80L48,73.3C96,67,192,53,288,54.7C384,56,480,84,576,86.7C672,89,768,65,864,51.3C960,37,1056,33,1152,40C1248,47,1344,65,1392,74.7L1440,84L1440,120L0,120Z"
              />
            </svg>
        </div>
    </div>
  );
}

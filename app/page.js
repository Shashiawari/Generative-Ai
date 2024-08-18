"use client"
import { useState, useEffect } from "react";
import Home from "./home/page";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); 
    }, 2000);

    return () => clearTimeout(timer); 
  }, []);

  return (
    <main className="dis">
      {isLoading ? (
        <div className="preloader">
          <h2>Loading...</h2>
          <p>By Shashi Awari</p>
        </div>
      ) : (
        <Home />
      )}
    </main>
  );
}

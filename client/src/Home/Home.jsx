import React from "react";
import Hero from "./Hero";
import { SpotlightBackground } from "../components/ui/SpotlightBackground";
import Setup from "../zomatoExtension/Setup";

const Home = () => {

  const handleLogin = () => {
    const login = () => {
      window.location.href = "http://localhost:5000/auth/google";
    };''
  }

  return (
    <div className="w-full border-primary border-b-4  text-white bg-black bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <SpotlightBackground />
      <Hero />

      <button onClick={handleLogin} className="bg-indigo-500 text-white">Google</button>
      <Setup />
    </div>
  );
};

export default Home;

import React from "react";
import Hero from "./Hero";
import { SpotlightBackground } from "../components/ui/SpotlightBackground";
import Setup from "../zomatoExtension/Setup";

const Home = () => {
  return (
    <div className="w-full border-primary border-b-4  text-white bg-black bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <SpotlightBackground />
      <Hero />
      <Setup />
    </div>
  );
};

export default Home;

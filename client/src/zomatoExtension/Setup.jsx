import React from "react";
import { CodeBlocks } from "../components/ui/CodeBlocks";

const Setup = () => {
  const code = `& "C:/Program Files/Google/Chrome/Application/chrome.exe" --remote-debugging-port=9222 --user-data-dir="C:/Users/Aakash/zomato-session"`;
  const localhost = `http://localhost:9222/json/version`;
  return (
    <div className="m-[100px]">
      <div className="flex justify-center items-center">
        <h1 className="text-5xl border-b-4 border-b-primary pb-2 w-[200px] flex justify-center items-center font-bold text-white mb-[40px]">
          Setup
        </h1>
      </div>

      <div>
        <h3 className="flex justify-start items-center">
          <span className="font-bold bg-primary flex justify-center items-center text-white border-primary border-2 rounded-full w-[50px] h-[50px]">
            <p>1</p>
          </span>
          <p className="ml-3 text-[20px]"> Run this Command in Terminal ! </p>
        </h3>
        <div className="mt-[32px]">
          <CodeBlocks
            language="jsx"
            filename="Launch_Browser.jsx"
            highlightLines={[9, 13, 14, 18]}
            code={code}
          />
        </div>
      </div>

      <div className="mt-[50px]">
        <h3 className="flex justify-start items-center">
          <span className="font-bold bg-primary flex justify-center items-center text-white border-primary border-2 rounded-full w-[50px] h-[50px]">
            <p>2</p>
          </span>
          <p className="ml-3 text-[20px]">
            Paste the URL into Launched Browser and copy BrowserEndPoint.
          </p>
        </h3>
        <div className="mt-[32px]">
          <CodeBlocks
            language="jsx"
            filename="localhost.jsx"
            highlightLines={[9, 13, 14, 18]}
            code={localhost}
          />
        </div>
      </div>
    </div>
  );
};

export default Setup;

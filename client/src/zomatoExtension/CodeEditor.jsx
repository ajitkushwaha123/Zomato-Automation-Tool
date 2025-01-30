import React, { useState } from "react";
import PropTypes from "prop-types";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useDispatch  , useSelector} from "react-redux";
import { updateMenuData } from "../redux/slices/productSlice";

const CodeEditor = ({ code = [] }) => {
  const [data, setData] = useState(
    Array.isArray(code) ? JSON.stringify(code, null, 2) : code
  );

  const { menuData, message, isLoading, error } = useSelector(
    (state) => state.menu
  );
  const dispatch = useDispatch();

  console.log("Code", code);

  const handleChange = (event) => {
    const input = event.target.value;
    setData(input);

    // Try to parse the input into an array, call dataChange only if successful
    try {
      const parsedArray = JSON.parse(input);
      if (Array.isArray(parsedArray)) {
        dispatch(updateMenuData(parsedArray));
        // dataChange(parsedArray); // Pass the array to the parent callback
      } else {
        console.error("Input is not an array.");
      }
    } catch (e) {
      console.error("Invalid JSON input.");
    }
  };

  return (
    <div className="p-10 w-full overflow-y-scroll h-screen mt-10 bg-slate-900 text-slate-200">
      <textarea
        value={JSON.stringify(menuData , null , 2)}
        onChange={handleChange}
        className="w-full h-3/4 p-2 bg-slate-800 text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Write your JSON array here..."
        spellCheck="false"
      />
      <div className="mt-5">
        <SyntaxHighlighter language="javascript" style={docco} wrapLines>
          {JSON.stringify(menuData , null , 2)}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

CodeEditor.propTypes = {
  code: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  dataChange: PropTypes.func.isRequired, // Callback function for data change
};

export default CodeEditor;

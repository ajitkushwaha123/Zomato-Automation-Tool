"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Search, X } from "lucide-react";
import Toast from "../../Toast/Toast";
import { loadingGif } from "../../assets";
import { updateMenuDataPortion } from "../../redux/slices/productSlice";
import axios from "axios";
import AutomationButton from "../AutomationButton";
import { handleSearchResult, openModal } from "../../redux/slices/modalSlice";
import ImageModal from "../../ImageSearch/ImageModal";

const ItemsTable = ({ filters = {} }) => {
  const API_URL = `${import.meta.env.VITE_API_URL}/api`;
  const { menuData, isLoading, error, message } = useSelector(
    (state) => state.menu
  );

  const [loading, setLoading] = useState(false);

  console.log("API_URL", API_URL);
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery("");
  };

  const filteredData = (menuData, filters) => {
    if (!Array.isArray(menuData)) {
      console.error("Data is not an array:", menuData);
      return []; // Return an empty array if menuData is invalid
    }

    const products = menuData.filter((item) => {
      return Object.keys(filters).every((key) => {
        const filterValue = filters[key];

        // Skip filtering if filter value is null, undefined, or empty string
        if (!filterValue) return true;

        // Get the item's value dynamically
        const itemValue = item[key];

        console.log("itemValue", itemValue, "filterValue", filterValue);

        // Check if itemValue exists and matches filterValue
        return (
          filterValue === "All" ||
          (itemValue !== "All" &&
            itemValue !== undefined &&
            itemValue !== null &&
            itemValue
              .toString()
              .toLowerCase()
              .includes(filterValue.toString().toLowerCase()))
        );
      });
    });

    return products;
  };

  const filterData = filteredData(menuData, filters);

  const handleAIUpdate = async (filterData, input) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/gemini/update-menu`, {
        data: filterData,
        input,
      });
      console.log("response", response?.data);
      dispatch(updateMenuDataPortion(response?.data?.data || []));
      setLoading(false);
      return response?.data?.data || [];
    } catch (err) {
      console.error("Error updating menu", err);
      setLoading(false);
    }
  };

  const handleMenuUpdate = async () => {
    console.log("Updating menu with query:", query);
    await handleAIUpdate(filterData, query);
  };

  const { resId, browserEndPoint } = useSelector((state) => state.globalValue);

  const handleImageState = (e, name, index) => {
    alert(name);
    console.log("name", index);
    dispatch(openModal({ title: name, id: index }));
    dispatch(handleSearchResult(name));
  };

  const { isOpen, images, title } = useSelector((state) => state.searchModal);

  return (
    <div>
      {isLoading || loading ? (
        <div className="w-full h-screen overflow-hidden bg-[#111111] flex items-center justify-center">
          <img src={loadingGif} />
        </div>
      ) : (
        <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg backdrop-blur-lg border border-gray-800">
          {message ? <Toast title={message} /> : null}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-200">
              🍽️ Product List
            </h2>
            <div className="flex justify-center items-center">
              <div className="justify-center mb-4 mr-4 flex items-center w-[100%] bg-gray-800 hover:bg-gray-700 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300">
                <AutomationButton
                  data={filterData}
                  browserEndPoint={browserEndPoint}
                />
              </div>
              <div className="flex mb-4 justify-center items-center bg-gray-800 border border-gray-700 rounded-md px-4 py-2 shadow-md backdrop-blur-md">
                {/* <Search className="text-gray-400 w-8 h-5 mr-2" /> */}
                <input
                  type="text"
                  value={query}
                  onChange={handleChange}
                  placeholder="Write a Prompt..."
                  className="bg-transparent flex-1 outline-none text-white placeholder-gray-500"
                />
                <button onClick={handleMenuUpdate} className="ml-2">
                  <Search className="text-gray-400 w-5 h-5 hover:text-gray-200 transition duration-300" />
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-gray-300">
                  <th className="p-4 border-b border-gray-700 text-left">
                    Image
                  </th>
                  <th className="p-4 border-b border-gray-700 text-left">
                    Name
                  </th>
                  <th className="p-4 border-b border-gray-700 text-left">
                    Category
                  </th>
                  <th className="p-4 border-b border-gray-700 text-left">
                    Subcategory
                  </th>
                  <th className="p-4 border-b border-gray-700 text-left">
                    Food Type
                  </th>
                  <th className="p-4 border-b border-gray-700 text-left">
                    Base Price
                  </th>
                  <th className="p-4 border-b border-gray-700 text-left">
                    Variants
                  </th>
                </tr>
              </thead>
              <tbody>
                {filterData?.map((product, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-gray-800 transition duration-300 ${
                      index % 2 === 0 ? "bg-gray-850" : "bg-gray-900"
                    }`}
                  >
                    <td className="p-4 border-b border-gray-700">
                      <button
                        onClick={(e) =>
                          handleImageState(e, product?.name, product?.id)
                        }
                      >
                        <img
                          src={product?.img}
                          alt={product?.name}
                          className="w-16 h-16 object-cover rounded-lg shadow-md"
                        />
                      </button>
                    </td>
                    <td className="p-4 border-b border-gray-700 text-gray-200 font-medium">
                      {product?.name}
                    </td>
                    <td className="p-4 border-b border-gray-700 text-gray-300">
                      {product?.category}
                    </td>
                    <td className="p-4 border-b border-gray-700 text-gray-400">
                      {product?.sub_category || "—"}
                    </td>
                    <td className="p-4 border-b border-gray-700">
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full shadow-md ${
                          product?.food_type === "veg"
                            ? "bg-green-500/20 text-green-400 border border-green-500"
                            : "bg-red-500/20 text-red-400 border border-red-500"
                        }`}
                      >
                        {product?.food_type}
                      </span>
                    </td>
                    <td className="p-4 border-b border-gray-700 text-gray-300 font-semibold">
                      ₹{product?.base_price}
                    </td>
                    <td className="p-4 border-b border-gray-700">
                      {product?.variants.length > 0 ? (
                        <div className="space-y-1">
                          {product?.variants[0].values.map((variant, i) => (
                            <div
                              key={i}
                              className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-md"
                            >
                              {variant.title} -{" "}
                              <span className="font-medium text-white">
                                ₹{variant.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isOpen && <ImageModal open={isOpen} />}
        </div>
      )}
    </div>
  );
};

export default ItemsTable;

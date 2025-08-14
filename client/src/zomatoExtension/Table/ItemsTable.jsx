"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Search,
  X,
  CloudUpload,
  Trash2,
  Plus,
  SearchCheck,
} from "lucide-react";
import Toast from "../../Toast/Toast";
import { loadingGif } from "../../assets";
import {
  addNewProduct,
  updateMenuData,
  updateMenuDataPortion,
} from "../../redux/slices/productSlice";
import axios from "axios";
import AutomationButton from "../AutomationButton";
import { openModal } from "../../redux/slices/modalSlice";
import ImageModal from "../../ImageSearch/ImageModal";
import Button from "../../components/Button/Button";
import Feature from "../../Project/Feature";
import Modal from "../../Modal/Modal";
import { useParams } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { motion } from "framer-motion";
import ImageUpload from "../../Project/ImageUpload";
import SearchDialog from "../SearchDialog";

const ItemsTable = ({ filters = {} }) => {
  const { projectId } = useParams();
  const {
    deletedProductsId,
    menuData,
    handleUpdateData,
    isLoading,
    message,
    bulkUpdate,
    deleteItemById,
    handleDeleteItem,
  } = useProducts(projectId);
  const API_URL = `${import.meta.env.VITE_API_URL}/api`;

  console.log("deletePros", deletedProductsId);

  const [loading, setLoading] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [imgProductId, setImageProductId] = useState("");

  const handleModalChange = (val) => {
    setShowFeatureModal(val);
  };

  console.log("API_URL", API_URL);
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const filteredData = (menuData, filters) => {
    if (!Array.isArray(menuData)) {
      console.error("Data is not an array:", menuData);
      return [];
    }

    const products = menuData.filter((item) => {
      return Object.keys(filters).every((key) => {
        const filterValue = filters[key];

        if (!filterValue) return true;

        const itemValue = item[key];

        console.log("itemValue", itemValue, "filterValue", filterValue);

        return (
          (filterValue === "All" && itemValue != "Uncategorized") ||
          (itemValue !== "All" &&
            itemValue !== undefined &&
            itemValue != "Uncategorized" &&
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

  filterData.sort((a, b) => {
    const categoryComparison = a.category.localeCompare(b.category);
    if (categoryComparison !== 0) {
      return categoryComparison;
    }
    return a.sub_category.localeCompare(b.sub_category);
  });

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

  const handleImageState = (e, name, index) => {
    alert(name);
    console.log("name", index);
    dispatch(openModal({ title: name, id: index }));
  };

  const { isOpen, images, title } = useSelector((state) => state.searchModal);

  const handleProductUpdate = (e, type, id, deleteOps = false) => {
    e.preventDefault();
    const { value } = e.target;

    if (deleteOps === true) {
      handleDeleteItem(id);
      return;
    }

    if (id) {
      handleUpdateData({ id, field: type, value });
    }
  };

  const handleNewProduct = (e, category, sub_category) => {
    e.preventDefault();

    if (!category) {
      category = "Category";
      sub_category = "Sub-category";
    }

    let product;
    if (category) {
      const product = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        name: "Item name",
        img: "https://b.zmtcdn.com/data/o2_assets/35a660a02ca6389f14bd6b1e0555fe9e1712297177.png",
        description: "",
        category: category,
        sub_category: sub_category || category,
        food_type: "veg",
        item_type: "Goods",
        base_price: 0,
        variants: [],
      };

      console.log(product);
      dispatch(addNewProduct(product));
    }
  };

  const handleVariantUpdate = (
    e,
    productId,
    variantIndex,
    key,
    deleteOps = false
  ) => {
    e.preventDefault();
    console.log(deleteOps);
    const { value } = e.target;
    const product = menuData.find((item) => item.id === productId);
    if (!product) return;

    let updatedVariants = product?.variants || [];

    if (updatedVariants.length === 0) {
      updatedVariants = [
        {
          values: [{ title: "", price: "" }],
        },
      ];
    } else {
      updatedVariants = updatedVariants?.map((variant) => {
        let values = variant.values || [];

        if (values.length === 0) {
          return {
            ...variant,
            values: [{ title: "", price: "" }],
          };
        }

        if (deleteOps === true) {
          values = values.filter((_, idx) => idx !== variantIndex);
          return { ...variant, values };
        }

        if (variantIndex === values?.length + 1) {
          return {
            ...variant,
            values: [...values, { title: "", price: "" }],
          };
        }

        return {
          ...variant,
          values: values.map((val, idx) =>
            idx === variantIndex ? { ...val, [key]: value } : val
          ),
        };
      });
    }

    console.log("updatedVariants", updatedVariants);

    handleUpdateData({
      id: productId,
      field: "variants",
      value: updatedVariants,
    });
  };

  return (
    <div>
      {loading || isLoading ? (
        <div className="w-full h-screen overflow-hidden bg-[#111111] flex items-center justify-center">
          <img src={loadingGif} />
        </div>
      ) : (
        <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg backdrop-blur-lg border border-gray-800">
          {message ? <Toast title={message} /> : null}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl flex-nowrap font-semibold mb-4 text-gray-200">
              🍽️ Product List ({filterData.length})
            </h2>
            <div className="flex justify-center items-center">
              <div className="justify-center mb-4 mr-4 flex items-center w-[100%] bg-gray-800 hover:bg-gray-700 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300">
                <motion.button
                  onClick={() => bulkUpdate()}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <CloudUpload />
                  <span>{isLoading ? "Loading..." : "Save"}</span>
                </motion.button>
              </div>
              <div className="justify-center gap-2 mb-4 mr-4 flex items-center w-[100%] bg-gray-800 hover:bg-gray-700 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300">
                <AutomationButton
                  title="Zomato"
                  data={filterData}
                  platform="zomato"
                />
              </div>
              <div className="justify-center gap-2 mb-4 mr-4 flex items-center w-[100%] bg-gray-800 hover:bg-gray-700 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300">
                <AutomationButton
                  title="Swiggy"
                  data={filterData}
                  platform="swiggy"
                />
              </div>
              <div className="flex mb-4 justify-center items-center bg-gray-800 border border-gray-700 rounded-md px-4 py-2 shadow-md backdrop-blur-md">
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
                  <th className="p-4 border-b border-gray-700 text-left">+</th>
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
                          // handleImageState(e, product?.name, product?.id)
                          {
                            setQuery(product?.name);
                            setShowSearchModal(true);
                            setShowImageModal(true);
                            setImageProductId(product.id);
                          }
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
                      <input
                        type="text"
                        value={product?.name}
                        className="outline-none bg-transparent text-white"
                        onChange={(e) =>
                          handleProductUpdate(e, "name", product.id)
                        }
                      />

                      <br />
                      {product?.description}
                    </td>
                    <td className="p-4 border-b border-gray-700 text-gray-300">
                      <input
                        type="text"
                        value={product?.category}
                        className="outline-none w-24 bg-transparent text-white"
                        onChange={(e) =>
                          handleProductUpdate(e, "category", product.id)
                        }
                      />
                    </td>
                    <td className="p-4 border-b border-gray-700 text-gray-400">
                      <input
                        type="text"
                        value={product?.sub_category}
                        className="outline-none w-28 bg-transparent text-white"
                        onChange={(e) =>
                          handleProductUpdate(e, "sub_category", product.id)
                        }
                      />
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
                      ₹
                      <input
                        type="number"
                        value={product?.base_price}
                        className="bg-transparent outline-none w-14 text-white no-arrows"
                        onChange={(e) =>
                          handleProductUpdate(e, "base_price", product.id)
                        }
                      />
                    </td>
                    <td className="p-4 border-b border-gray-700">
                      <div className="space-y-1 flex flex-col justify-center">
                        {product?.variants[0]?.values.map((variant, i) => (
                          <div
                            key={i}
                            className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-md flex gap-2 items-center"
                          >
                            <input
                              type="text"
                              name="title"
                              value={variant.title}
                              className="outline-none max-w-24 bg-transparent text-white"
                              onChange={(e) =>
                                handleVariantUpdate(e, product.id, i, "title")
                              }
                            />
                            -
                            <input
                              type="number"
                              value={variant.price}
                              name="price"
                              className="outline-none bg-transparent text-white w-8 no-arrows"
                              onChange={(e) =>
                                handleVariantUpdate(e, product.id, i, "price")
                              }
                            />
                            <button
                              onClick={(e) => {
                                handleVariantUpdate(
                                  e,
                                  product.id,
                                  i,
                                  "price",
                                  true
                                );
                              }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))}

                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            handleVariantUpdate(
                              e,
                              product.id,
                              product?.variants[0]?.values?.length + 1 || 1,
                              "price"
                            );
                          }}
                          className="text-sm cursor-pointer justify-center text-center text-gray-400 bg-gray-800 px-3 py-1 rounded-md flex gap-2 items-center"
                        >
                          <span className="font-semibold text-[20px]">+</span>
                          Add Variant
                        </motion.button>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-700">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          handleProductUpdate(e, "delete", product.id, true);
                        }}
                      >
                        <Trash2 />
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="w-full flex justify-center items-center">
              <div
                className={`hover:bg-gray-800 flex justify-center items-center w-full transition duration-300 
                    bg-gray-900
                  `}
              >
                <div className="p-4 border-b flex w-full justify-center items-center border-gray-700 text-gray-200 font-medium">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      handleNewProduct(
                        e,
                        filters?.category,
                        filters?.sub_category
                      );
                    }}
                    className="text-sm cursor-pointer justify-center text-center text-gray-400 bg-gray-800 px-3 py-1 rounded-md flex gap-2 items-center"
                  >
                    <span className="font-semibold text-[20px]">+</span>
                    Add Product
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center w-[100%]">
              {filterData?.length === 0 && (
                <div className="h-[500px] w-full flex flex-col justify-center items-center text-gray-300 rounded-lg shadow-lg">
                  <div className="flex flex-col items-center space-y-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-24 w-24 text-gray-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6l3-3h12l3 3"></path>
                      <path d="M3 6v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6"></path>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>

                    <p className="text-lg text-gray-400">No Data found.</p>
                    <p className="text-sm text-gray-500">
                      Start by scraping / uploading a menu .!
                    </p>

                    <Button
                      onSubmit={() => handleModalChange(true)}
                      title="Add Product"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {isOpen && <ImageModal open={isOpen} />}
          {showFeatureModal == true && (
            <Modal
              isOpen={showFeatureModal}
              stillOpen={(val) => handleModalChange(val)}
              content={
                <Feature
                  projectId={projectId}
                  stillOpen={(val) => handleModalChange(val)}
                />
              }
            />
          )}
          {showImageModal == true && (
            // <Modal
            //   isOpen={showImageModal}
            //   stillOpen={(val) => setShowImageModal(val)}
            //   content={
            //     <ImageUpload
            //       projectId={projectId}
            //       productId={imgProductId}
            //       stillOpen={(val) => setShowImageModal(val)}
            //     />
            //   }
            // />

            <SearchDialog
              isOpen={showSearchModal}
              onClose={() => setShowSearchModal(false)}
              query={query}
              productId={imgProductId}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ItemsTable;

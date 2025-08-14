"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Card from "./Table/Card";
import { search } from "../ImageSearch/search";

import { useDispatch } from "react-redux";
import { updateMenuData } from "../redux/slices/productSlice";

const Spinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const SearchDialog = ({ isOpen, onClose, query, productId }) => {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const observerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setSelectedImage(null);
      setError(null);
      setData([]);
      setPage(1);
      setHasNextPage(true);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const fetchData = async ({ q, page }) => {
    if (!q) return;
    setLoading(true);
    setError(null);
    try {
      const res = await search({ query: q, page });
      if (page === 1) {
        setData(res.results || []);
      } else {
        setData((prev) => [...prev, ...(res.results || [])]);
      }
      setHasNextPage(
        typeof res.hasNextPage === "boolean"
          ? res.hasNextPage
          : (res.results?.length ?? 0) > 0
      );
    } catch (err) {
      console.error("Fetch failed", err);
      setError("Failed to load images. Please try again.");
      if (page === 1) setData([]);
      setHasNextPage(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && query) {
      setPage(1);
      fetchData({ q: query, page: 1 });
    } else if (!isOpen) {
      setData([]);
      setHasNextPage(true);
      setPage(1);
      setSelectedImage(null);
      setError(null);
    }
  }, [isOpen, query]);

  useEffect(() => {
    if (page > 1 && query) {
      fetchData({ q: query, page });
    }
  }, [page, query]);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasNextPage) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    const current = observerRef.current;
    observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [loading, hasNextPage]);

  const handleSelect = (image) => {
    setSelectedImage(image);
  };

  // Dispatch directly and close modal
  const handleApply = () => {
    if (selectedImage) {
      dispatch(updateMenuData({ id: productId, field: "img", value: selectedImage.image_url }));
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-0 right-0 bottom-0 h-screen max-w-[600px] w-full bg-gray-900 text-white shadow-lg z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-dialog-title"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 flex-shrink-0">
              <h2
                id="search-dialog-title"
                className="text-xl font-bold tracking-wide truncate"
              >
                Search results for "{query}" {productId && `- ${productId}`}
              </h2>
              <button
                onClick={onClose}
                aria-label="Close search dialog"
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
              {error && (
                <p className="text-center text-red-500 mb-4">{error}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {data.map((image, i) => (
                  <div
                    key={image._id || i}
                    onClick={() => handleSelect(image)}
                    className={`cursor-pointer rounded-md border-4 transition ${
                      selectedImage === image
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleSelect(image);
                      }
                    }}
                  >
                    <Card image={image} index={i} />
                  </div>
                ))}
              </div>

              {loading && <Spinner />}

              <div ref={observerRef} className="h-12" />
            </div>

            <div className="flex-shrink-0 p-4 border-t border-gray-700 bg-gray-800">
              <button
                onClick={handleApply}
                disabled={!selectedImage}
                className={`w-full py-3 rounded-md font-semibold transition ${
                  selectedImage
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-600 cursor-not-allowed text-gray-400"
                }`}
              >
                Apply Selected Image
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchDialog;

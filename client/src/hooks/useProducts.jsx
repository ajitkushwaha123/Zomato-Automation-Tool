import { useDispatch, useSelector } from "react-redux";
import {
  BulkdeleteUsingSubCategory,
  fetchMenu,
  handleScrapeData,
  updateMenuData,
  deleteProductById,
  bulkProductUpdate,
  deleteMenuData,
} from "../redux/slices/productSlice";
import { useEffect } from "react";

export const useProducts = (projectId) => {
  const dispatch = useDispatch();
  const {
    menuData,
    isLoading,
    error,
    message,
    updatedProducts,
    deletedProductsId,
  } = useSelector((state) => state.menu);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchMenu(projectId));
    }
  }, [dispatch, projectId]);

  const handleDataScraping = (data) => {
    dispatch(handleScrapeData(data));
  };

  const deleteBySubCategory = async (data) => {
    try {
      await dispatch(BulkdeleteUsingSubCategory(data)).unwrap();
      await dispatch(fetchMenu(projectId));
    } catch (error) {
      console.error("Failed to delete sub-category:", error);
    }
  };

  const handleUpdateData = async (id, field, value) => {
    dispatch(updateMenuData(id, field, value));
  };

  const bulkUpdate = async () => {
    await dispatch(
      bulkProductUpdate({
        menuData,
        updatedProducts,
        projectId,
        deletedProductsId,
      })
    ).unwrap();
  };

  const deleteItemById = async (productId) => {
    await dispatch(deleteProductById({ id: productId, projectId })).unwrap();
  };

  const handleDeleteItem = (id) => {
    console.log(id);
    dispatch(deleteMenuData(id));
  };

  return {
    menuData,
    isLoading,
    error,
    message,
    deletedProductsId,
    handleDataScraping,
    deleteBySubCategory,
    handleUpdateData,
    updatedProducts,
    bulkUpdate,
    handleDeleteItem,
    deleteItemById,
  };
};

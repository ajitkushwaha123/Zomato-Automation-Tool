import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiRequest } from "../../../utils/api-request";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export const handleMenuUpload = createAsyncThunk(
  "product/handleMenuUpload",
  async (formData, thunkAPI) => {
    try {
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const projectId = formData.get("projectId");

      if (!projectId) {
        throw new Error("Missing required fields: projectId");
      }

      const response = await axios.post(
        `${API_URL}/gemini/upload-menu?projectId=${projectId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Response:", response.data);
      return response?.data || {};
    } catch (error) {
      console.error("Upload Error:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to upload menu"
      );
    }
  }
);

export const fetchMenu = createAsyncThunk("products/fetchMenu", async (id) => {
  return apiRequest(
    () => axios.get(`${API_URL}/products?projectId=${id}`),
    "Failed to Fetch products"
  );
});

export const BulkdeleteUsingSubCategory = createAsyncThunk(
  "products/bulkDeleteCategory",
  async (data, thunkAPI) => {
    try {
      await apiRequest(
        () =>
          axios.delete(`${API_URL}/products?projectId=${data.projectId}`, {
            data,
          }),
        "Failed to Delete Products"
      );

      return data.sub_category;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to delete products");
    }
  }
);

export const handleScrapeData = createAsyncThunk(
  "product/handleScrapeData",
  async (data) => {
    return apiRequest(
      () =>
        axios.get(
          `${API_URL}/scrape?resId=${data.resIdFrom}&projectId=${data.projectId}`
        ),
      "Failed to Scrape products"
    );
  }
);

export const handleMenuAIUpdate = createAsyncThunk(
  "product/handleMenuAIUpdate",
  async ({ productData, input }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/gemini/update-menu`, {
        data: productData,
        input,
      });
      console.log("response", response?.data);
      return response?.data?.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update menu"
      );
    }
  }
);

export const bulkProductUpdate = createAsyncThunk(
  "products/bulkUpdateProduct",
  async ({ menuData, updatedProducts, projectId, deletedProductsId }) => {
    console.log("me", menuData);
    console.log("up", updatedProducts);
    console.log("pId", projectId);

    const updatedData = menuData.filter((product) =>
      updatedProducts.includes(product.id)
    );

    return apiRequest(
      () =>
        axios.put(`${API_URL}/products/bulk-update?projectId=${projectId}`, {
          updatedData,
          deletedProductsId,
        }),
      "Failed to Bulk Update products"
    );
  }
);

export const deleteProductById = createAsyncThunk(
  "products/deleteById",
  async ({ id, projectId }) => {
    return apiRequest(
      () =>
        axios.delete(
          `${API_URL}/products/single?id=${id}&projectId=${projectId}`
        ),
      "Failed to Delete product"
    );
  }
);

// Menu slice
const menuSlice = createSlice({
  name: "menu",
  initialState: {
    menuData: [],
    message: "",
    isLoading: false,
    error: null,
    updatedProducts: [],
    deletedProductsId: [],
  },
  reducers: {
    updateMenuData: (state, action) => {
      state.menuData = state.menuData.map((product) =>
        product.id === action.payload.id
          ? { ...product, [action.payload.field]: action.payload.value }
          : product
      );

      if (!state.updatedProducts.includes(action.payload.id)) {
        state.updatedProducts.push(action.payload.id);
      }
    },

    addNewProduct: (state, action) => {
      console.log(action.payload);
      state.menuData = [...state.menuData, action.payload];
      if (!state.updatedProducts.includes(action.payload.id)) {
        state.updatedProducts.push(action.payload.id);
      }
    },
    deleteMenuData: (state, action) => {
      const id = action.payload;
      state.menuData = state.menuData.filter((item) => item.id !== id);

      state.updatedProducts = state.updatedProducts.filter(
        (itemId) => itemId !== id
      );

      if (!state.deletedProductsId.includes(id)) {
        state.deletedProductsId = [...state.deletedProductsId, id];
      }
    },

    resetDeleteProductsId: (state) => {
      state.deletedProductsId = [];
    },

    resetUpdatedProducts: (state) => {
      state.updatedProducts = [];
    },
    updateMenuDataById: (state, action) => {
      const { id, url } = action.payload;
      const index = state.menuData.findIndex((item) => item.id === id);
      if (index !== -1) state.menuData[index].img = url;
    },
    updateMenuDataPortion: (state, action) => {
      const updatedItems = action.payload;
      updatedItems?.forEach((updatedItem) => {
        const index = state.menuData.findIndex(
          (item) => item.id === updatedItem.id
        );
        if (index !== -1) {
          state.menuData[index] = { ...state.menuData[index], ...updatedItem };
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.isLoading = true;
        state.message = "";
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        const { message, error, data } = action.payload || {};
        state.isLoading = false;
        state.message = message || "";
        state.error = error || null;
        if (data) state.menuData = data;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(BulkdeleteUsingSubCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = "Category deleted successfully";

        const deletedSubCategory = action.payload?.sub_category;
        if (deletedSubCategory) {
          state.menuData = state.menuData.filter(
            (item) => item.sub_category !== deletedSubCategory
          );
        }
      })
      .addCase(BulkdeleteUsingSubCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(bulkProductUpdate.pending, (state) => {
        state.isLoading = true;
        state.message = "";
        state.error = null;
      })
      .addCase(bulkProductUpdate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message =
          action.payload?.message || "Products updated successfully!";
        state.error = null;

        if (action.payload?.data) {
          state.menuData = action.payload.data;
        }
      })
      .addCase(bulkProductUpdate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(handleMenuUpload.pending, (state) => {
        state.isLoading = true;
        state.message = "";
        state.error = null;
      })
      .addCase(handleMenuUpload.fulfilled, (state, action) => {
        const { message, error, data } = action.payload || {};
        state.isLoading = false;
        state.message = message || "";
        state.error = error || null;
        if (data) state.menuData = data;
      })
      .addCase(handleMenuUpload.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(deleteProductById.pending, (state) => {
        state.isLoading = true;
        state.message = "";
        state.error = null;
      })
      .addCase(deleteProductById.fulfilled, (state, action) => {
        const { message, error, data } = action.payload || {};
        state.isLoading = false;
        state.message = message || "";
        state.error = error || null;

        if (data) {
          state.menuData = state.menuData.filter(
            (product) => product._id !== data._id
          );
        }
      })

      .addCase(deleteProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(handleScrapeData.pending, (state) => {
        state.isLoading = true;
        state.message = "";
        state.error = null;
      })
      .addCase(handleScrapeData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.menuData = action.payload.data || [];
        state.message = "Data scraped successfully.";
      })
      .addCase(handleScrapeData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload || "Failed to scrape data";
      })
      .addCase(handleMenuAIUpdate.pending, (state) => {
        state.isLoading = true;
        state.message = "";
        state.error = null;
      })
      .addCase(handleMenuAIUpdate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = "Menu updated successfully.";
        state.menuData = action.payload || [];
      })
      .addCase(handleMenuAIUpdate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
        state.message = "Failed to update menu";
      });
  },
});

export const {
  updateMenuData,
  updateMenuDataById,
  deleteMenuData,
  updateMenuDataPortion,
  resetUpdatedProducts,
  addNewProduct,
} = menuSlice.actions;
export default menuSlice;

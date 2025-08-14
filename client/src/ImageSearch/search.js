import axios from "axios";

export const search = async ({ query, page = 1, limit = 5 }) => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const res = await axios.get(
      `http://localhost:3000/api/library/search?search=${encodedQuery}&page=${page}&limit=${limit}`,
      { withCredentials: true }
    );

    return res.data;
  } catch (error) {
    console.error("Search error:", error);

    if (error?.response) {
      throw error;
    }

    throw new Error("Failed to perform search");
  }
};

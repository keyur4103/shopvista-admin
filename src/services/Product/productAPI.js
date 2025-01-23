import { authenticatedInstance } from "../../utils/axios-instance";

export const allProducts = async ( query , page) => {
  try {
    // console.log("🚀 ~ allProducts ~ page:", page);
    console.log("🚀 ~ allProducts ~ query:", query);
    let endpoint = "product";
    // If query exists, append it to the endpoint
    if (page) {
      endpoint += `?page=${page}`;
    }
    
    if (query) {
      endpoint += `?query=${query}`;
    }


    const response = await authenticatedInstance.get(endpoint);
    console.log("🚀 ~ allProducts ~ response:", response);
    return response?.data?.data;
  } catch (error) {
    console.log("error in getting all category data: ", error);
    throw new Error(error.message);
  }
};

export const addProduct = async (data) => {
  try {
    console.log("data ", data);
    const response = await authenticatedInstance.post("product", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("🚀 ~ addProduct ~ response:", response);
    return response;
  } catch (error) {
    console.log("error in Create Product : ", error);
    throw new Error(error.message);
  }
};

export const getProductEdit = async (slug) => {
  try {
    const response = await authenticatedInstance.get(`product/${slug}`);
    console.log("🚀 ~ getProductEdit ~ response:", response);
    return response;
  } catch (error) {
    console.log("error in update product : ", error);
    throw new Error(error.message);
  }
};

export const updateProduct = async (data, slug) => {
  try {
    const response = await authenticatedInstance.put(`product/${slug}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("🚀 ~ updateProduct ~ response:", response);
    return response;
  } catch (error) {
    console.log("error in Create Category : ", error);
    throw new Error(error.message);
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await authenticatedInstance.delete(`product/${id}`);
    console.log("🚀 ~ deleteProduct ~ response:", response);
    return response;
  } catch (error) {
    console.log("error in Delete product : ", error);
    throw new Error(error.message);
  }
};

export const productFilter = async (data) => {
  try {
    // console.log("id", id);
    const response = await authenticatedInstance.post("products/search", data);
    console.log("response:", response);
    return response;
  } catch (error) {
    console.log("error in Filter Product : ", error);
    throw new Error(error.message);
  }
};

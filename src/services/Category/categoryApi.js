import { authenticatedInstance } from "../../utils/axios-instance";

export const allCategories = async () => {
  try {
    const response = await authenticatedInstance.get("category");
    // console.log("🚀 ~ allCategories ~ response:", response);
    return response?.data?.data;
  } catch (error) {
    console.log("error in getting all category data: ", error);
    throw new Error(error.message);
  }
};

export const addCategory = async (data) => {
  try {
    const response = await authenticatedInstance.post("category", data);
    // console.log("🚀 ~ addCategory ~ response:", response);
    return response;
  } catch (error) {
    console.log("error in Create Category : ", error);
    throw new Error(error.message);
  }
};

export const updateCategory = async (data, id) => {
  try {
    console.log("id", id);
    const response = await authenticatedInstance.put(`category/${id}`, data);
    // console.log("🚀 ~ updateCategory ~ response:", response);
    return response;
  } catch (error) {
    console.log("error in Create Category : ", error);
    throw new Error(error.message);
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await authenticatedInstance.delete(`category/${id}`);
    console.log("🚀 ~ deleteCategory ~ response:", response);
    return response;
  } catch (error) {
    console.log("error in Delete category : ", error);
    throw new Error(error.message);
  }
};

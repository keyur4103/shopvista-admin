import { authenticatedInstance } from "../../utils/axios-instance";

export const allfaq = async () => {
  try {
    const response = await authenticatedInstance.get("faq");
    // console.log("response: ", response);
    return response?.data?.data;
  } catch (error) {
    console.log("error in getting all faq data: ", error);
    throw new Error(error.message);
  }
};

export const addfaq = async (data) => {
  try {
    const response = await authenticatedInstance.post("faq", data);
    // console.log("response:", response);
    return response;
  } catch (error) {
    console.log("error in Create faq : ", error);
    throw new Error(error.message);
  }
};

export const updateFaq = async (id, data) => {
  try {
    const response = await authenticatedInstance.put(`faq/${id}`, data);
    console.log("🚀 ~ updateFaq ~ response:", response);
    return response;
  } catch (error) {
    console.log("error in faq update: ", error);
    throw new Error(error.response.data.errors[0].msg || error.message);
  }
};

export const getOneFaq = async (id) => {
  try {
    const response = await authenticatedInstance.get(`faq/${id}`);
    console.log("🚀 ~ updateFaq ~ response:", response);
    return response.data?.data;
  } catch (error) {
    console.log("error in faq update: ", error);
    throw new Error(error.response.data.errors[0].msg || error.message);
  }
};

export const deleteFaq = async (id) => {
  try {
    const response = await authenticatedInstance.delete(`faq/${id}`);
    // console.log("🚀 ~ deleteUser ~ response:", response)
    return response;
  } catch (error) {
    console.log("error in Delete faq : ", error);
    throw new Error(error.message);
  }
};

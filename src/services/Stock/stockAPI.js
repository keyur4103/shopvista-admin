import { authenticatedInstance } from "../../utils/axios-instance";

export const allStocks = async () => {
  try {
    const response = await authenticatedInstance.get("stock");
    console.log("🚀 ~ allStocks ~ response:", response);
    return response?.data?.data;
  } catch (error) {
    console.log("error in getting all category data: ", error);
    throw new Error(error.message);
  }
};

export const updateStock = async (data) => {
  try {
    const response = await authenticatedInstance.post("stock/update", data);
    console.log("🚀 ~ updateStock ~ response:", response);
    return response;
  } catch (error) {
    console.log("error in Create Category : ", error);
    throw new Error(error.message);
  }
};

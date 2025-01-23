import { authenticatedInstance } from "../../utils/axios-instance";

export const allOrders = async () => {
  try {
    const response = await authenticatedInstance.get("order/all");
    console.log("🚀 ~ allOrders ~ response:", response)
    return response?.data?.data;
  } catch (error) {
    console.log("error in getting all order data: ", error);
    throw new Error(error.message);
  }
};
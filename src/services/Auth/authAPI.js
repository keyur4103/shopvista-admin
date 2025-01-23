import { unauthenticatedInstance } from "../../utils/axios-instance";

export const adminLogin = async (data) => {
  try {
    const response = await unauthenticatedInstance.post("/login", data);
    // console.log("response: ", response);
    return response;
  } catch (error) {
    console.log("error in login: ", error);
    throw new Error(error.message);
  }
};

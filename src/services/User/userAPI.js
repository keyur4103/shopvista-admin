import { authenticatedInstance } from "../../utils/axios-instance";

export const allUser = async () => {
  try {
    const response = await authenticatedInstance.get("user", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    // console.log("response: ", response);
    return response?.data?.data;
  } catch (error) {
    console.log("error in getting all user data: ", error);
    throw new Error(error.message);
  }
};

export const addUser = async (data) => {
  try {
    const response = await authenticatedInstance.post("user", data);
    // console.log("response:", response);
    return response;
  } catch (error) {
    console.log("error in Create user : ", error);
    throw new Error(error.message);
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await authenticatedInstance.put(`user/${id}`, data);
    console.log("🚀 ~ updateUser ~ response:", response);
    return response;
  } catch (error) {
    console.log("error in user update: ", error);
    throw new Error(error.response.data.errors[0].msg || error.message);
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await authenticatedInstance.delete(`user/${id}`);
    // console.log("🚀 ~ deleteUser ~ response:", response)
    return response;
  } catch (error) {
    console.log("error in Delete user : ", error);
    throw new Error(error.message);
  }
};

export const verifiyUser = async (id) => {
  try {
    const response = await authenticatedInstance.post(`user/verify/${id}`);
    // console.log("🚀 ~ deleteUser ~ response:", response)
    return response;
  } catch (error) {
    console.log("error in verify user : ", error);
    throw new Error(error.message);
  }
};

export const blockUser = async (id) => {
  try {
    const response = await authenticatedInstance.post(`user/block/${id}`);
    // console.log("🚀 ~ deleteUser ~ response:", response)
    return response;
  } catch (error) {
    console.log("error in block user : ", error);
    throw new Error(error.message);
  }
};

export const profileData = async (token) => {
  try {
    console.log("🚀 ~ profileData ~ token:", token);
    const response = await authenticatedInstance.get("user/loggedin", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("🚀 ~ profileData ~ response:", response);
    return response;
  } catch (error) {
    console.log("error in profileData : ", error);
    throw new Error(error.message);
  }
};

export const profileDataUpdate = async (data, token) => {
  try {
    const response = await authenticatedInstance.post(
      "user/update/login",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("🚀 ~ profileDataUpdate ~ response:", response);
    return response;
  } catch (error) {
    console.log("error in profileDataUpdate : ", error);
    throw new Error(error.message);
  }
};

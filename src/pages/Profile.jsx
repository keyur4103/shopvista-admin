import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { profileData, profileDataUpdate } from "../services/User/userAPI";
import Spinner from "../utils/Spinner";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Profile = () => {
  const { register, handleSubmit, setValue } = useForm();
  const token = useSelector((state) => state.auth.token);
  console.log("🚀 ~ Profile ~ token:", token);
  const queryClient = useQueryClient();

  const {
    isSuccess,
    isFetching,
    data: user,
  } = useQuery({
    queryKey: ["profileUser"],
    queryFn: () => profileData(token),
    refetchOnWindowFocus: false,
    // select: (data) => data?.reverse(),
  });

  if (isSuccess) {
    console.log("data", user);
    setValue("firstName", user?.data?.data?.firstName);
    setValue("lastName", user?.data?.data?.lastName);
    // setValue("image", user?.data?.data?.image);
    // setValue("image", user?.image);
  }

  // Set default form values with user data
  // useEffect(() => {
  //   setValue("firstName", user?.firstName);
  //   setValue("lastName", user?.lastName);
  //   setValue("image", user?.image);
  // }, [user, setValue]);

  const { mutate } = useMutation({
    mutationFn: (data) => profileDataUpdate(data,token),
    onSuccess: () => {
      //   console.log("response", response);
      toast.success("Profile Updated Successfully");
      queryClient.invalidateQueries("profileUser");
    },
    onError: (error) => {
      console.log("error", error.AxiosError);
      toast.error(error.message);
    },
  });

  if (isFetching) {
    return <Spinner />;
  }

  const onSubmit = (data) => {
    // Handle form submission
    console.log("Form submitted with data:", data);
    mutate(data);
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md ">
      <h1 className="text-2xl font-semibold mb-6">User Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            htmlFor="firstName"
            className="block text-gray-700 font-semibold mb-2"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            {...register("firstName", { required: true })}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="lastName"
            className="block text-gray-700 font-semibold mb-2"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            {...register("lastName", { required: true })}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {/* <div className="mb-4">
          <label
            htmlFor="image"
            className="block text-gray-700 font-semibold mb-2"
          >
            Image
          </label>
          <input
            type="file"
            id="image"
            {...register("image", { required: true })}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div> */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;

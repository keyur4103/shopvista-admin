/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { Button, Modal } from "flowbite-react";
import { useForm } from "react-hook-form";
import {
  addUserValidation,
  deleteUserValidation,
  updateUserValidation,
} from "../validation/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const UserModal = ({
  isOpen,
  closeModal,
  actionType,
  userData,
  handleAddUser,
  handleUpdateUser,
  handleDeleteUser,
}) => {
  const validationSchema =
    actionType === "add"
      ? addUserValidation
      : actionType === "update"
      ? updateUserValidation
      : deleteUserValidation;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  console.log("🚀 ~ errors:", errors)

  useEffect(() => {
    if (userData) {
      setValue("firstName", userData?.firstName);
      setValue("lastName", userData?.lastName);
      setValue("email", userData?.email);
      setValue("role", userData?.role);
    }
  }, [setValue, userData]);

  const onSubmit = (formData) => {
    if (actionType === "add") {
      console.log("🚀 ~ onSubmit ~ formData:", formData)
      handleAddUser(formData);
    } else if (actionType === "update") {
      handleUpdateUser(userData._id, formData);
    } else if (actionType === "delete") {
      handleDeleteUser(userData._id);
    }

    closeModal();
  };

  return (
    <Modal show={isOpen} size="md" onClose={() => closeModal()} popup>
      <Modal.Header />
      {(actionType === "update" || actionType === "add") && (
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              {actionType === "add"
                ? "Add User"
                : actionType === "update"
                ? "Edit User"
                : "Delete User"}
            </h3>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label
                  htmlFor="firstName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  First Name
                </label>
                <input
                  type="text"
                  {...register("firstName", {
                    required: "First Name is required",
                  })}
                  className={`${
                    errors?.firstName ? "border-red-500" : ""
                  } bg-gray-50 border border-gray-300
                    text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  placeholder="First name"
                  required=""
                />
                {errors?.firstName && (
                  <p className="text-red-500 text-sm">
                    {errors?.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  {...register("lastName", {
                    required: "Last Name is required",
                  })}
                  className={`${
                    errors?.lastName ? "border-red-500" : ""
                  } bg-gray-50 border border-gray-300
                    text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  placeholder="Last name"
                  required=""
                />
                {errors?.lastName && (
                  <p className="text-red-500 text-sm">
                    {errors?.lastName.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Invalid email address",
                    },
                  })}
                  className={`${
                    errors?.email ? "border-red-500" : ""
                  } bg-gray-50 border border-gray-300
                    text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  placeholder="name@company.com"
                  required=""
                />
                {errors?.email && (
                  <p className="text-red-500 text-sm">
                    {errors?.email.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Role
                </label>
                <select
                  {...register("role", {
                    required: "Role is required",
                  })}
                  className={`${
                    errors?.role ? "border-red-500" : ""
                  } bg-gray-50 border border-gray-300
                    text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
                {errors?.role && (
                  <p className="text-red-500 text-sm">{errors?.role.message}</p>
                )}
              </div>
              {actionType != "update" && (
                <>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      {...register("password", {
                        required: "Password is required",
                      })}
                      className={`${
                        errors?.password ? "border-red-500" : ""
                      } bg-gray-50 border border-gray-300
                    text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                      placeholder="Password"
                      required=""
                    />
                    {errors?.password && (
                      <p className="text-red-500 text-sm">
                        {errors?.password.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      {...register("confirmPassword", {
                        required: "Confirm Password is required",
                        validate: (value) =>
                          value === register("password").value ||
                          "Passwords do not match",
                      })}
                      className={`${
                        errors?.confirmPassword ? "border-red-500" : ""
                      } bg-gray-50 border border-gray-300
                    text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                      placeholder="Confirm Password"
                      required=""
                    />
                    {errors?.confirmPassword && (
                      <p className="text-red-500 text-sm">
                        {errors?.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </>
              )}
              <div className="w-full">
                <Button
                  color="blue"
                  type="submit"
                  // disabled={formState.isSubmitting}
                >
                  {actionType === "add"
                    ? "Add User"
                    : actionType === "update"
                    ? "Update User"
                    : "Delete User"}
                </Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      )}
      {actionType === "delete" && (
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this User?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" className="bg-red-600" onClick={() => handleDeleteUser(userData._id)}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => closeModal()}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      )}
    </Modal>
  );
};

export default UserModal;

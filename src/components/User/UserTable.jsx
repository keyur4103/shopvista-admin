import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addUser,
  allUser,
  blockUser,
  deleteUser,
  updateUser,
  verifiyUser,
} from "../../services/User/userAPI";
import Spinner from "../../utils/Spinner";
import { useState } from "react";
import UserModal from "../../utils/UserModal";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const UserTable = () => {
  const queryClient = useQueryClient();
  const token = useSelector((state) => state.auth.token);

  const { isSuccess, isFetching, data } = useQuery({
    queryKey: ["allUser"],
    queryFn: () => allUser(token),
    refetchOnWindowFocus: false,
    select: (data) => data?.reverse(),
  });

  if (isSuccess) {
    console.log("data", data);
  }

  // State for managing modal
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const openModal = (action, user = null) => {
    setModalAction(action);
    setSelectedUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalAction("");
    setSelectedUser(null);
  };

  // <------------------- Add User ----------------->
  const { mutate } = useMutation({
    mutationFn: (data) => addUser(data),
    onSuccess: (response) => {
      console.log("response", response);
      toast.success("User Add Successfully");
      queryClient.invalidateQueries("allUser");
    },
    onError: (error) => {
      console.log("error", error.AxiosError);
      toast.error(error.message);
    },
  });

  // Function to handle adding a user
  const handleAddUser = async (userData) => {
    console.log("🚀 ~ handleAddUser ~ userData:", userData);
    mutate(userData);
  };

  // <------------------- Update User ----------------->
  const { mutate: updateMutate } = useMutation({
    mutationFn: (params) => {
      const { userId, userData } = params;
      updateUser(userId, userData);
    },
    onSuccess: (response) => {
      console.log("response", response);
      toast.success("User Update Successfully");
      queryClient.invalidateQueries("allUser");
    },
    onError: (error) => {
      console.log("error", error.AxiosError);
      toast.error(error.message);
    },
  });

  // Function to handle updating a user
  const handleUpdateUser = async (userId, userData) => {
    updateMutate({ userId, userData });
  };

  // <------------------- Delete User ----------------->
  const { mutate: deleteMutate } = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => {
      toast.success("User Deleted Successfully");
      queryClient.invalidateQueries("allUser");
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Function to handle deleting a user
  const handleDeleteUser = async (userId) => {
    deleteMutate(userId);
  };

  // Verify User
  const { mutate: verifyMutate } = useMutation({
    mutationFn: (id) => verifiyUser(id),
    onSuccess: (response) => {
      console.log("response", response);
      toast.success("User Successfully Verified");
      queryClient.invalidateQueries("allUser");
    },
    onError: (error) => {
      console.log("error", error.AxiosError);
      toast.error(error.message);
    },
  });

  // Block User
  const { mutate: blockMutate } = useMutation({
    mutationFn: (id) => blockUser(id),
    onSuccess: (response) => {
      console.log("response", response);
      toast.success("User Successfully Verified");
      queryClient.invalidateQueries("allUser");
    },
    onError: (error) => {
      console.log("error", error.AxiosError);
      toast.error(error.message);
    },
  });

  return (
    <>
      {!isFetching ? (
        <>
          <div className="sm:flex my-4 ml-2 w-full">
            {/* <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">
              <form className="lg:pr-3">
                <label htmlFor="users-search" className="sr-only">
                  Search
                </label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <input
                    type="text"
                    name="email"
                    id="users-search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search for users"
                    style={{
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "20px",
                      backgroundPosition: "97% center",
                      cursor: "auto",
                    }}
                    data-temp-mail-org={2}
                  />
                </div>
              </form>
              <div className="flex pl-0 mt-3 space-x-1 sm:pl-2 sm:mt-0">
                <a
                  href="#"
                  className="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </a>
              </div>
            </div> */}
            <div className="flex items-center ml-auto mr-2 space-x-2 sm:space-x-3">
              <button
                type="button"
                data-modal-toggle="add-user-modal"
                className="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={() => openModal("add")}
              >
                <svg
                  className="w-5 h-5 mr-2 -ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add user
              </button>
              {/* <a
                href="#"
                className="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              >
                <svg
                  className="w-5 h-5 mr-2 -ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                    clipRule="evenodd"
                  />
                </svg>
                Export
              </a> */}
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th
                          scope="col"
                          className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 w-2/10"
                        >
                          Name & Email
                        </th>

                        <th
                          scope="col"
                          className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 w-1/10"
                        >
                          Role
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 w-1/10"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 w-1/10"
                        >
                          Block
                        </th>
                        {/* <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 w-2/10"
                    >
                      Wishlist
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 w-2/10"
                    >
                      Addresses
                    </th> */}
                        <th
                          scope="col"
                          className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 w-2/10"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {isSuccess &&
                        data.map((user, index) => (
                          <tr
                            className="hover:bg-gray-100 dark:hover:bg-gray-700"
                            key={index}
                          >
                            <td className=" p-4  space-x-6 whitespace-nowrap">
                              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                <div className="text-base font-semibold text-gray-900 dark:text-white">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                  {user.email}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {user.role}
                            </td>
                            <td className="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white">
                              <div className="flex items-center">
                                <div />{" "}
                                {user.verified ? (
                                  <div className="flex items-center">
                                    <div className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2" />
                                    Verified
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    data-modal-toggle="edit-user-modal"
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                    onClick={() => verifyMutate(user._id)}
                                  >
                                    Verify
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white">
                              <div className="flex items-center">
                                <div />{" "}
                                {user.block ? (
                                  <button
                                    type="button"
                                    data-modal-toggle="edit-user-modal"
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                    // onClick={() => openModal("update", user)}
                                    onClick={() => blockMutate(user._id)}
                                  >
                                    Unblock
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    data-modal-toggle="edit-user-modal"
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                    onClick={() => blockMutate(user._id)}
                                  >
                                    Block
                                  </button>
                                )}
                              </div>
                            </td>
                            {/* <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {user.wishlist.length > 0
                        ? user.wishlist[0]
                        : "Empty"}
                        </td>
                        <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {user.addresses.length > 0
                        ? user.addresses[0]
                        : "Empty"}
                        </td> */}
                            <td className="p-4 space-x-2 whitespace-nowrap">
                              <button
                                type="button"
                                data-modal-toggle="edit-user-modal"
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={() => openModal("update", user)}
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                  <path
                                    fillRule="evenodd"
                                    d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Edit user
                              </button>
                              <button
                                type="button"
                                data-modal-toggle="delete-user-modal"
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                                onClick={() => openModal("delete", user)}
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Delete user
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* <div className="sticky bottom-0 right-0 items-center w-full p-4 bg-white border-t border-gray-200 sm:flex sm:justify-between dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center mb-4 sm:mb-0">
                <a
                  href="#"
                  className="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="inline-flex justify-center p-1 mr-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  Showing{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    1-20
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    2290
                  </span>
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <a
                  href="#"
                  className="inline-flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="w-5 h-5 mr-1 -ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Previous
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Next
                  <svg
                    className="w-5 h-5 ml-1 -mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div> */}
            <UserModal
              isOpen={isModalOpen}
              closeModal={closeModal}
              actionType={modalAction}
              userData={selectedUser}
              handleAddUser={handleAddUser}
              handleUpdateUser={handleUpdateUser}
              handleDeleteUser={handleDeleteUser}
            />
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default UserTable;

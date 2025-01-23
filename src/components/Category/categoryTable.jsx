import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  allCategories,
  addCategory,
  deleteCategory,
  updateCategory,
} from "../../services/Category/categoryApi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import {
  categoryAddValidation,
  categoryEditValidation,
} from "../../validation/validation";
import toast from "react-hot-toast";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";

const CategoriesTable = () => {
  const token = useSelector((state) => state.auth.token);
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [editCategoryModalOpen, setEditCategoryModalOpen] = useState({
    isOpen: false,
    id: null,
  });
  const [deleteCategoryModalOpen, setDeleteCategoryModalOpen] = useState({
    isOpen: false,
    id: null,
  });
  const queryClient = useQueryClient();

  // <-------- Get All Categories -------->
  const { isSuccess, isFetching, error, data } = useQuery({
    queryKey: ["allCategories"],
    queryFn: ()=>allCategories(token),
    refetchOnWindowFocus: false,
    // select: (data) => data?.reverse(),
  });

  // <-------- Add New Category -------->
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(categoryAddValidation),
  });

  const { mutate } = useMutation({
    mutationFn: (data) => addCategory(data),
    onSuccess: (response) => {
      //   console.log("response", response);
      toast.success("Category Add Successfully");
      queryClient.invalidateQueries("allCategories");
      onCloseAddCategoryModal();
    },
    onError: (error) => {
      console.log("error", error.AxiosError);
      toast.error(error.message);
    },
  });

  const onSubmit = (formData) => {
    // console.log("formdata", formData);
    mutate(formData);
  };

  function onCloseAddCategoryModal() {
    setAddCategoryModalOpen(false);
  }

  // <-------- Edit Category -------->
  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    setValue,
    formState: { errors: editErrors },
  } = useForm({
    resolver: yupResolver(categoryEditValidation),
  });

  const handleCategoryUserOpen = (name, id) => {
    console.log("name", name);
    setEditCategoryModalOpen({
      isOpen: true,
      id: id,
    });
    setValue("editName", name);
  };

  const handleEditCategoryClose = () => {
    setEditCategoryModalOpen({ isOpen: false, id: null });
    setValue("editName", "");
  };

  const { mutate: editMutate } = useMutation({
    mutationFn: (data) => updateCategory(data, editCategoryModalOpen.id),
    onSuccess: (response) => {
      console.log("response", response);
      toast.success("Category Updated Successfully");
      queryClient.invalidateQueries("allCategories");
      handleEditCategoryClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmitEdit = (formData) => {
    const categoryData = {
      name: formData.editName,
    };
    console.log("categoryData", categoryData);
    editMutate(categoryData);
  };

  //   <------ Delete Category -------->
  function onCloseDeleteCategoryModal() {
    setDeleteCategoryModalOpen({ isOpen: false, id: null });
  }

  const {
    mutate: deleteMutate,
  } = useMutation({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: (response) => {
      setDeleteCategoryModalOpen({ isOpen: false, id: null });
      toast.success("Category Deleted Successfully");
      queryClient.invalidateQueries("allCategories");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDeleteModal = () => {
    deleteMutate(deleteCategoryModalOpen.id);
  };

  return (
    <>
      <div className="sm:flex my-4 ml-2 w-full">
        <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">
          {/* <form className="lg:pr-3" action="#" method="GET">
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
          </div> */}
        </div>
        <div className="flex items-center ml-auto space-x-1 sm:space-x-2 m-2">
          <button
            type="button"
            data-modal-toggle="add-user-modal"
            className="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => setAddCategoryModalOpen(true)}
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
            Add Category
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
                      Name
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 w-1/10"
                    >
                      Slug
                    </th>

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
                    data.map((category, index) => (
                      <tr
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                        key={index}
                      >
                        <td className=" p-4  space-x-6 whitespace-nowrap">
                          <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            <div className="text-base font-semibold text-gray-900 dark:text-white">
                              {category.name}
                            </div>
                          </div>
                        </td>
                        <td className=" p-4  space-x-6 whitespace-nowrap">
                          <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            <div className="text-base font-semibold text-gray-900 dark:text-white">
                              {category.slug}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 space-x-2 whitespace-nowrap">
                          <button
                            type="button"
                            data-modal-toggle="edit-user-modal"
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={() =>
                              handleCategoryUserOpen(
                                category.name,
                                category._id
                              )
                            }
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
                            Edit
                          </button>
                          <button
                            type="button"
                            data-modal-toggle="delete-user-modal"
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                            onClick={() =>
                              setDeleteCategoryModalOpen({
                                isOpen: true,
                                id: category._id,
                              })
                            }
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
                            Delete
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

        {/* Add Model   */}
        <Modal
          show={addCategoryModalOpen}
          size="md"
          onClose={onCloseAddCategoryModal}
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Add User
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
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    {...register("name")}
                    className={`${
                      errors.name ? "border-red-500" : ""
                    } bg-gray-50 border border-gray-300
                    text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    placeholder="first name"
                    required=""
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <Button color="blue" type="submit">
                    Add Category
                  </Button>
                </div>
              </form>
            </div>
          </Modal.Body>
        </Modal>

        {/* Edit Model  */}
        <Modal
          show={editCategoryModalOpen.isOpen}
          size="md"
          onClose={() => handleEditCategoryClose()}
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Edit Category
              </h3>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleEditSubmit(onSubmitEdit)}
              >
                <div>
                  <label
                    htmlFor="firstName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="editName"
                    id="editName"
                    {...editRegister("editName")}
                    className={`${
                      editErrors.editName ? "border-red-500" : ""
                    } bg-gray-50 border border-gray-300
                    text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    placeholder="first name"
                    required=""
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <Button color="blue" type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </Modal.Body>
        </Modal>

        {/* Delete Model  */}
        <Modal
          show={deleteCategoryModalOpen.isOpen}
          size="md"
          onClose={() =>
            setDeleteCategoryModalOpen({ isOpen: false, id: null })
          }
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this User?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={() => handleDeleteModal()} className="bg-red-600">
                  {"Yes, I'm sure"}
                </Button>
                <Button
                  color="gray"
                  onClick={() => onCloseDeleteCategoryModal()}
                >
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default CategoriesTable;

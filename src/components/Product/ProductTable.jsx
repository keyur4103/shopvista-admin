import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  allProducts,
  deleteProduct,
  productFilter,
} from "../../services/Product/productAPI";
import { useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Button, Modal } from "flowbite-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { CSVLink } from "react-csv";

const ProductTable = () => {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState(null);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState({
    isOpen: false,
    id: null,
  });
  const [filteredData, setFilteredData] = useState(null);
  const [csvData, setCsvData] = useState([]);

  // <-------- Get All Products ---------------->
  const { isSuccess, isFetching, error, data } = useQuery({
    queryKey: ["allProducts", query, page],
    queryFn: () => allProducts(query, page),
    refetchOnWindowFocus: false,
    // select: (data) => data?.reverse(),
  });

  useEffect(() => {
    const dataToExport = data?.products.map((product) => ({
      name: product.name,
      description: product.description,
      category: product.category?.name,
      price: product.price,
      colors: product.color?.map((color) => color.name).join(", "),
      sizes: product.size?.map((size) => size.name).join(", "),
    }));
    console.log("🚀 ~ ProductTable ~ dataToExport:", dataToExport);
    setCsvData(dataToExport);
  }, [data]);

  // if (isSuccess) {
  //   // console.log(Math.floor(data?.total / 2) <= page);
  // }

  const { mutate, data: deleteData } = useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: (response) => {
      setOpenModal({ isOpen: false, id: null });
      queryClient.invalidateQueries("allProducts");
      toast.success("Product Deleted Successfully");
    },
  });

  const handleDeleteModal = () => {
    mutate(openModal.id);
  };

  // <------------- Filter -------------->
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const { mutate: mutateFilter, data: filterData } = useMutation({
    mutationFn: (data) => productFilter(data),
    onSuccess: (response) => {
      console.log("response", response);
      toast.success("Product Filtered Successfully");
      setFilteredData(response.data?.data);
      // queryClient.invalidateQueries("allProducts");
      // navigate("/admin/products");
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const onSubmit = (data) => {
    const filters = {
      price: [parseFloat(data.minPrice), parseFloat(data.maxPrice)],
    };
    const formData = { filters };

    console.log(
      "🚀 ~ file: ProductTable.jsx:67 ~ onSubmit ~ formData:",
      formData
    );
    mutateFilter(formData);
  };

  // <------------- Search ------------->

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  // <------------- Paggination ------------->
  const handlePageUp = () => {
    setPage(page + 1);
  };
  const handlePageDown = () => {
    setPage(page - 1);
  };

  // const handleExport = () => {
  //   // Data to be exported (example)
  //   const dataToExport = [
  //     ["Title", "Description", "Category", "Price", "Colors", "Sizes"],
  //     ...((filteredData || data).map(product => [
  //       product.name,
  //       product.description,
  //       product.category?.name,
  //       product.price,
  //       product.color?.map(color => color.name).join(', '),
  //       product.size?.map(size => size.name).join(', ')
  //     ]))
  //   ];
  //   console.log("🚀 ~ handleExport ~ dataToExport:", dataToExport)

  //   // Create a new Excel workbook
  //   const wb = { Sheets: {}, SheetNames: ['Products'] };
  //   console.log("🚀 ~ handleExport ~ wb:", wb)

  //   const ws = {
  //     ...writeFile(dataToExport, { header: true }),
  //     '!cols': [{ wpx: 200 }, { wpx: 300 }, { wpx: 200 }, { wpx: 100 }, { wpx: 300 }, { wpx: 300 }]
  //   };

  //   wb.Sheets['Products'] = ws;

  //   // Convert the workbook to a binary string
  //   const excelBuffer = writeFile(wb, { bookType: 'xlsx', type: 'buffer' });

  //   // Save the Excel file
  //   saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'products.xlsx');
  // };

  return (
    <>
      <div className="table-controls w-full">
        <div className="sm:flex my-4 ml-2">
          <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">
            <form className="lg:pr-3" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex space-x-2 mt-1 lg:w-64 xl:w-96">
                <input
                  type="string"
                  placeholder="Search"
                  name="search"
                  onChange={(e) => handleSearchChange(e)}
                  className="border border-slate-800 p-2 rounded-md w-96"
                />
              </div>
            </form>
          </div>
          <div className="flex items-center ml-auto space-x-3 sm:space-x-6 m-2">
            <button
              type="button"
              data-modal-toggle="add-user-modal"
              className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={() => navigate("/product/add")}
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
              Add Product
            </button>

            {csvData && (
              <CSVLink
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-4 focus:ring-blue-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                data={csvData}
                filename="products.csv"
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
              </CSVLink>
            )}
          </div>
        </div>
        {/* Table Goes Here */}
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
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Title
                    </th>

                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Price
                    </th>

                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Colors
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                      style={{ width: "200px" }}
                    >
                      Sizes
                    </th>

                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {isSuccess &&
                    data?.products.map((product, index) => (
                      <tr
                        className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        key={index}
                        // onClick={() => navigate(`/product/${product.slug}`)}
                      >
                        <td className=" p-4  space-x-6 whitespace-nowrap">
                          <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            <div className="text-base font-semibold text-gray-900 dark:text-white">
                              {product.name}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {product.description}
                        </td>
                        <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {product?.category?.name}
                        </td>
                        <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {product.price}
                        </td>

                        <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <div className="flex gap-2">
                            {product.color?.map((i, index) => (
                              <div
                                key={index}
                                style={{
                                  backgroundColor: `${i.name}`,
                                  width: "23px",
                                  height: "23px",
                                  borderRadius: "50%",
                                }}
                              ></div>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                          <div className="flex gap-2">
                            {product.size?.map((i, index) => (
                              <p key={index}>{i.name} </p>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 space-x-2 whitespace-nowrap">
                          <button
                            type="button"
                            data-modal-toggle="edit-user-modal"
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={() =>
                              navigate(`/product/update/${product.slug}`)
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
                              setOpenModal({
                                isOpen: true,
                                id: product._id,
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
        <div className="sticky bottom-0 right-0 items-center w-full p-4 bg-white border-t border-gray-200 sm:flex sm:justify-between dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <button
              className={`inline-flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-center rounded-lg focus:ring-4 dark:focus:ring-gray-700 ${
                page === 0
                  ? "cursor-not-allowed bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                  : "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 text-white"
              }`}
              onClick={handlePageDown}
              disabled={page === 0}
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
            </button>
            <button
              className={`inline-flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-center rounded-lg focus:ring-4 dark:focus:ring-gray-700 ${
                Math.floor(data?.total / 2) <= page
                  ? "cursor-not-allowed bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                  : "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 text-white"
              }`}
              onClick={handlePageUp}
              disabled={Math.floor(data?.total / 2) <= page}
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
            </button>
          </div>
        </div>

        {/* Delete Model  */}
        <Modal
          show={openModal.isOpen}
          size="md"
          onClose={() => setOpenModal({ isOpen: false })}
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this product?
              </h3>
              <div className="flex justify-center gap-4">
                <Button
                  color="failure"
                  className="bg-red-600"
                  onClick={() => handleDeleteModal()}
                >
                  {"Yes, I'm sure"}
                </Button>
                <Button
                  color="gray"
                  onClick={() => setOpenModal({ isOpen: false })}
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

export default ProductTable;

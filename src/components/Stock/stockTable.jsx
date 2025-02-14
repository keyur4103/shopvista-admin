import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { allStocks, updateStock } from "../../services/Stock/stockAPI";
import { Modal } from "flowbite-react";
import { useState } from "react";
import getAllProduct from "../../hooks/getAllProduct";
import { getProductEdit } from "../../services/Product/productAPI";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const StockTable = () => {
  const { data: productName, isSuccess: productNameGetSuccess } =
    getAllProduct();
  console.log("🚀 ~ StockTable ~ productName:", productName);
  const queryClient = useQueryClient();

  // <-------- Get All Stocks -------->
  const { isSuccess, isFetching, data } = useQuery({
    queryKey: ["allStocks"],
    queryFn: allStocks,
    refetchOnWindowFocus: false,
    select: (data) => data?.reverse(),
  });

  //<-------------- Update Stock ---------->
  const { mutate } = useMutation({
    mutationFn: (data) => updateStock(data),
    onSuccess: (response) => {
      console.log("response", response);
      toast.success("Stock Updated Successfully 🥳");
      queryClient.invalidateQueries("allStocks");
      handleModalClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [modalOpen, setModalOpen] = useState({ isOpen: false, action: null });
  const [colorOptions, setColorOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [stockUpdateDataWithId, setStockUpdateDataWithId] = useState([]);
  const [stockUpdateDataWithName, setStockUpdateDataWithName] = useState([]);

  console.log("🚀 ~ StockTable ~ colorOptions:", colorOptions);
  const {
    control,
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const selectedProduct = JSON.parse(data.selectedProductModal);
    const selectedColor = data.selectedColorModal
      ? JSON.parse(data.selectedColorModal)
      : null;
    const selectedSize = data.selectedSizeModal
      ? JSON.parse(data.selectedSizeModal)
      : null;
    const quantityChange = +data.quantityModal;

    // Find existing entry
    const existingEntryIndex = stockUpdateDataWithId.findIndex((entry) => {
      return (
        entry.productId === selectedProduct._id &&
        (!entry.colorId || entry.colorId === (selectedColor?._id || null)) &&
        (!entry.sizeId || entry.sizeId === (selectedSize?._id || null))
      );
    });

    if (existingEntryIndex !== -1) {
      // Entry exists, update quantity
      const updatedDataWithId = [...stockUpdateDataWithId];
      updatedDataWithId[existingEntryIndex].quantityChange += quantityChange;
      setStockUpdateDataWithId(updatedDataWithId);

      // Similarly, update the entry in the other array
      const updatedDataWithName = [...stockUpdateDataWithName];
      updatedDataWithName[existingEntryIndex].quantityChange += quantityChange;
      setStockUpdateDataWithName(updatedDataWithName);
    } else {
      // Entry does not exist, add a new entry
      const newRowDataWithId = {
        productId: selectedProduct._id,
        colorId: selectedColor?._id || null,
        sizeId: selectedSize?._id || null,
        quantityChange: quantityChange,
        action: modalOpen.action,
      };

      const newRowDataWithName = {
        productId: selectedProduct.name,
        colorId: selectedColor?.name || "N/A",
        sizeId: selectedSize?.name || "N/A",
        quantityChange: quantityChange,
        action: modalOpen.action,
      };

      setStockUpdateDataWithId((prevData) => [...prevData, newRowDataWithId]);
      setStockUpdateDataWithName((prevData) => [
        ...prevData,
        newRowDataWithName,
      ]);
    }

    reset();
  };

  const handleProductChange = async (product) => {
    try {
      console.log("🚀 ~ handleProductChange ~ product:", product);
      const productData = JSON.parse(product);
      console.log("🚀 ~ handleProductChange ~ productData:", productData);
      const { slug, name } = productData;
      console.log("🚀 ~ handleProductChange ~ name:", name);
      console.log("🚀 ~ handleProductChange ~ _id:", slug);
      setValue("selectedProduct", name);
      // setSelectedProduct({ id: _id, name: name });
      // Make an API call to get color and size options for the selected product
      const productDetails = await getProductEdit(slug);
      console.log(
        "🚀 ~ handleProductChange ~ productDetails:",
        productDetails.data.data
      );
      setColorOptions(productDetails.data.data.color);
      setSizeOptions(productDetails.data.data.size);
    } catch (error) {
      console.error("Error fetching product details", error);
    }
  };

  const handleModalClose = () => {
    setModalOpen({ isOpen: false, action: null });
    setStockUpdateDataWithId([]);
    setStockUpdateDataWithName([]);
    reset();
  };

  const onSubmitStock = () => {
    console.log("onsubmit");
    stockUpdateDataWithId.map((stock) => {
      mutate(stock);
    });
  };

  return (
    <>
      <div className="sm:flex my-4 ml-2 w-full">
        <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700"></div>
        <div className="flex items-center ml-auto space-x-2 sm:space-x-3 m-2">
          <button
            type="button"
            data-modal-toggle="add-user-modal"
            className="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 sm:w-auto dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            onClick={() => setModalOpen({ isOpen: true, action: "add" })}
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
            Add Stock
          </button>
          <button
            type="button"
            data-modal-toggle="add-user-modal"
            className="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 sm:w-auto dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            onClick={() => setModalOpen({ isOpen: true, action: "remove" })}
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
            Remove Stock
          </button>
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
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 w-1/10"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 w-1/10"
                    >
                      Color
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 w-2/10"
                    >
                      Size
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 w-2/10"
                    >
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {isSuccess &&
                    data.map((stock, index) => (
                      <tr
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                        key={index}
                      >
                        <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {stock.product?.name}
                        </td>
                        <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <div
                            key={index}
                            style={{
                              backgroundColor: `${stock.color?.name}`,
                              width: "23px",
                              height: "23px",
                              borderRadius: "50%",
                            }}
                          ></div>
                        </td>
                        <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <div className="bg-green-100 text-green-800 text-md font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 w-min">
                            {stock.size?.name}
                          </div>
                        </td>
                        <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {stock.quantity}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Update Modal */}
        <Modal
          show={modalOpen.isOpen}
          size="lg"
          onClose={() => handleModalClose()}
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Update Stock
              </h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-end  justify-between space-x-2 mb-2">
                  {/* Product Dropdown */}
                  <div className="w-1/5">
                    <label
                      htmlFor="product"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Product
                    </label>
                    <Controller
                      name="selectedProductModal"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <select
                          onChange={(e) => {
                            field.onChange(e);
                            handleProductChange(e.target.value);
                          }}
                          value={field.value}
                          className={`bg-gray-50 border border-gray-300
                        text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                        >
                          <option value="">Select Product</option>
                          {productNameGetSuccess &&
                            productName?.products?.map((product, index) => (
                              <option
                                key={index}
                                value={JSON.stringify(product)}
                              >
                                {product?.name}
                              </option>
                            ))}
                        </select>
                      )}
                    />
                  </div>

                  {/* Color Dropdown */}
                  <div className="w-1/5">
                    <label
                      htmlFor="color"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Color
                    </label>
                    <Controller
                      name="selectedColorModal"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <select
                          onChange={field.onChange}
                          value={field.value}
                          className={`bg-gray-50 border border-gray-300
                text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                        >
                          <option value="">Select Color</option>
                          {colorOptions.map((color, index) => (
                            <option key={index} value={JSON.stringify(color)}>
                              {color.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                  </div>

                  {/* Size Dropdown */}
                  <div className="w-1/5">
                    <label
                      htmlFor="size"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Size
                    </label>
                    <Controller
                      name="selectedSizeModal"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <select
                          onChange={field.onChange}
                          value={field.value}
                          className={`bg-gray-50 border border-gray-300
                text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                        >
                          <option value="">Select Size</option>
                          {sizeOptions.map((size, index) => (
                            <option key={index} value={JSON.stringify(size)}>
                              {size.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                  </div>

                  {/* Quantity */}
                  <div className="w-1/5">
                    <label
                      htmlFor="quantity"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Quantity
                    </label>
                    <input
                      type="number"
                      {...register("quantityModal")}
                      className={`bg-gray-50 border border-gray-300
            text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                      placeholder="Quantity"
                    />
                    {errors.quantityModal && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.quantityModal.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Add Row
                  </button>
                </div>
              </form>
              {stockUpdateDataWithName?.length > 0 && (
                <form onSubmit={handleSubmit(onSubmitStock)}>
                  <div>
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Product
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Color
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Size
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Quantity
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
                        {stockUpdateDataWithName?.map((row, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {row.productId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {row.colorId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {row.sizeId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {row.quantityChange}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-center mt-2">
                    <button
                      // onSubmit={handleStockUpdate()}
                      type="submit"
                      className="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Update Stock
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default StockTable;

import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
// import { productEditValidation } from "../../../validation/validation";
import { useForm } from "react-hook-form";
import useCategory from "../../hooks/useCategory";
import { useNavigate, useParams } from "react-router-dom";
import getEditProduct from "../../hooks/getEditProduct";
import { getProductEdit, updateProduct } from "../../services/Product/productAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Spinner from "../../utils/Spinner";
import { updateProductValidation } from "../../validation/validation";

const ProductUpdate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { slug } = useParams();
  // console.log("id", id);
  const { data: categoryData, isSuccess } = useCategory();
  const {
    data: productData,
    productGetSuccess,
    isFetching,
  } = getEditProduct(slug);
    // console.log("🚀 ~ ProductUpdate ~ productData:", productData)

  const [selectedImage, setSelectedImage] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updateProductValidation),
  });

  useEffect(() => {
    if (productGetSuccess && productData) {
      setValue("name", productData.name);
      setValue("description", productData.description);
      setValue("quantity", productData.quantity);
      setValue("price", productData.price);
      // Find the corresponding category ID in the dropdown options
      const selectedCategoryId = categoryData.find(
        (cat) => cat.name === productData.category.name
      )?._id;

      // Set the category value using its ID
      setValue("category", selectedCategoryId, { shouldValidate: true });

      const colorsString = productData.color.map((color) => color.name).join(",");
      const sizeString = productData.size.map((size) => size.name).join(",");
      setValue("color", colorsString);
      setValue("size", sizeString);
    }
  }, [productData]);

  const onImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  // <------------- Edit Product -------------->
  const { mutate } = useMutation({
    mutationFn: (data) => updateProduct(data, slug),
    onSuccess: (response) => {
      console.log("response", response);
      toast.success("Product Updated Successfully");
      queryClient.invalidateQueries("allProducts");
      navigate("/products");
    },
    onError: (error) => {
      console.log("error", error.AxiosError);
      toast.error(error.message);
    },
  });

  const onSubmit = (formData) => {
    console.log("formdata", formData);
    // const { images } = formData;
    // console.log("images", images);
    // const fileArray = Array.from(images, (file, index) => images[index]);
    // console.log("fileArray", fileArray);
    // const colorsArray = formData.colors.split(",").map((color) => color.trim());
    // console.log("colorsArray", colorsArray);

    const newData = {
      ...formData,
      coverImage: formData.coverImage[0],
      color: formData.color.split(",").map((color) => color.trim()),
      size: formData.size.split(",").map((size) => size.trim()),
    //   images: imagesArray,
    };
    console.log("newData", newData);

    mutate(newData);
  };

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
        <div className="flex items-center justify-center my-4 text-2xl font-bold">
          <h2 className="text-blue-700">Update Product</h2>
        </div>
        {isFetching ? (
          <div className="flex items-center justify-center vh-100">
            <Spinner />
          </div>
        ) : (
          <div className="flex items-center justify-center vh-100">
            <form
              style={{ maxWidth: "800px", width: "100%" }}
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="w-full my-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Product Name
                </label>
                <input
                  {...register("name")}
                  className={`appearance-none block w-full bg-white text-gray-700 border ${
                    errors.name ? "border-red-500" : "border-gray-200"
                  } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                  id="grid-first-name"
                  type="text"
                  placeholder="Name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="w-full my-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="product-description"
                >
                  Product Description
                </label>
                <textarea
                  {...register("description")}
                  className={`appearance-none block w-full bg-white text-gray-700 border ${
                    errors.description ? "border-red-500" : "border-gray-200"
                  } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                  id="product-description"
                  placeholder="Description"
                  rows="4"
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="w-full my-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="product-category"
                >
                  Category
                </label>
                <select
                  {...register("category")}
                  className={`appearance-none block w-full bg-white text-gray-700 border ${
                    errors.category ? "border-red-500" : "border-gray-200"
                  } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                  id="product-category"
                >
                  <option value="">Select Category</option>
                  {isSuccess &&
                    categoryData.map((cat, index) => (
                      <option key={index} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="w-full my-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="product-price"
                >
                  Price
                </label>
                <input
                  {...register("price")}
                  className={`appearance-none block w-full bg-white text-gray-700 border ${
                    errors.price ? "border-red-500" : "border-gray-200"
                  } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                  id="product-price"
                  type="text"
                  placeholder="Price"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price.message}</p>
                )}
              </div>

              {/* <div className="w-full my-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="product-quantity"
                >
                  Quantity
                </label>
                <input
                  {...register("quantity")}
                  className={`appearance-none block w-full bg-white text-gray-700 border ${
                    errors.quantity ? "border-red-500" : "border-gray-200"
                  } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                  id="product-quantity"
                  type="text"
                  placeholder="Quantity"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm">
                    {errors.quantity.message}
                  </p>
                )}
              </div> */}

              <div className="w-full my-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="product-colors"
                >
                  Colors (comma-separated)
                </label>
                <input
                  {...register("color")}
                  className={`appearance-none block w-full bg-white text-gray-700 border ${
                    errors.color ? "border-red-500" : "border-gray-200"
                  } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                  id="product-colors"
                  type="text"
                  placeholder="Color"
                />
                {errors.color && (
                  <p className="text-red-500 text-sm">
                    {errors.color.message}
                  </p>
                )}
              </div>

              <div className="w-full my-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="product-colors"
                >
                  Sizes (comma-separated)
                </label>
                <input
                  {...register("size")}
                  className={`appearance-none block w-full bg-white text-gray-700 border ${
                    errors.sizes ? "border-red-500" : "border-gray-200"
                  } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                  id="product-sizes"
                  type="text"
                  placeholder="Size"
                />
                {errors.sizes && (
                  <p className="text-red-500 text-sm">{errors.sizes.message}</p>
                )}
              </div>

              <div className="w-full my-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="product-image-cover"
                >
                  Image Cover (.jpg only)
                </label>
                <input
                  {...register("coverImage")}
                  className={`appearance-none block w-full bg-white text-gray-700 border ${
                    errors.coverImage ? "border-red-500" : "border-gray-200"
                  } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                  id="product-image-cover"
                  type="file"
                  accept=".jpg"
                />
                {errors.coverImage && (
                  <p className="text-red-500 text-sm">
                    {errors.coverImage.message}
                  </p>
                )}
              </div>

              {/* <div className="w-full my-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="product-images"
              >
                Images (.jpg only, multiple)
              </label>
              <input
                {...register("images")}
                className={`appearance-none block w-full bg-white text-gray-700 border ${
                  errors.images ? "border-red-500" : "border-gray-200"
                } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                id="product-images"
                type="file"
                accept=".jpg"
                multiple
              />
              {errors.images && (
                <p className="text-red-500 text-sm">{errors.images.message}</p>
              )}
            </div> */}

              <div className="flex justify-center items-center my-6">
                <button
                  className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-10 rounded "
                  type="submit"
                >
                  Update Product
                  {/* {!isPending ? "Add Blog" : <Spinner />} */}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductUpdate;

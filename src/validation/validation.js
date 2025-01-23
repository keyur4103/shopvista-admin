import * as Yup from "yup";

export const loginValidation = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .required("Required")
    .min(6, "Password must be at least 6 characters"),
});

// <------------------ User Validation --------------------->

export const addUserValidation = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  role: Yup.string().required("Role is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export const updateUserValidation = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  role: Yup.string().required("Role is required"),
});

export const deleteUserValidation = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  role: Yup.string().required("Role is required"),
});

// <------------------ Product Validation --------------------->

export const addProductValidation = Yup.object().shape({
  name: Yup.string().required("Product Name is required"),
  description: Yup.string().required("Product Description is required"),
  category: Yup.string().required("Category is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be a positive number")
    .required("Price is required"),
  color: Yup.string().required("Color is required"),
  size: Yup.string().required("Size is required"),
  coverImage: Yup.mixed()
    .test("fileFormat", "Only .jpg files are allowed", (value) => {
      return value && value[0]?.type === "image/jpeg";
    })
    .required("Cover Image is required"),
  // Uncomment the block below if you want to validate multiple images
  // images: Yup
  //   .mixed()
  //   .test("fileFormat", "Only .jpg files are allowed", (value) => {
  //     return value.every((image) => image.type === "image/jpeg");
  //   })
  //   .required("Images are required"),
});

export const updateProductValidation = Yup.object().shape({
  name: Yup.string().required("Product Name is required"),
  description: Yup.string().required("Product Description is required"),
  category: Yup.string().required("Category is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be a positive number")
    .required("Price is required"),
  color: Yup.string().required("Color is required"),
  size: Yup.string().required("Size is required"),
  // coverImage: Yup
  //   .mixed()
  //   .test("fileFormat", "Only .jpg files are allowed", (value) => {
  //     return value && value[0]?.type === "image/jpeg";
  //   })
  //   .required("Cover Image is required"),
  // Uncomment the block below if you want to validate multiple images
  // images: Yup
  //   .mixed()
  //   .test("fileFormat", "Only .jpg files are allowed", (value) => {
  //     return value.every((image) => image.type === "image/jpeg");
  //   })
  //   .required("Images are required"),
});

// <------------------ Category Validation --------------------->

export const categoryAddValidation = Yup.object().shape({
  name: Yup.string().required("Required"),
});

export const categoryEditValidation = Yup.object().shape({
  editName: Yup.string().required("Required"),
});

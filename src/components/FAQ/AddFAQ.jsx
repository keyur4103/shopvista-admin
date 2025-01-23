import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { addfaq } from "../../services/FAQ/faqAPI";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
// import { FAQValidation } from "../../../validation/validation";

const AddFAQ = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(FAQValidation),
  });

  const { mutate, data, isPending, isError } = useMutation({
    mutationFn: (data) => addfaq(data),
    onSuccess: (response) => {
      toast.success(response.data.message);
      navigate("/faq");
    },
  });

  const onSubmit = (formData) => {
    console.log("formdata", formData);
    mutate(formData);
  };

  const handleCKEditorChange = (editorData) => {
    setValue("answer", editorData);
  };

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
        <div className="flex items-center justify-center my-4 text-xl font-bold">
          <h2 className="text-blue-700">Add New FAQ</h2>
        </div>
        <div className="flex items-center justify-center vh-100 w-full">
          <form className="w-2/3" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full my-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Question
              </label>
              <input
                {...register("question")}
                className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-first-name"
                type="text"
                placeholder="Question"
                // defaultValue={firstName}
              />
              {errors.question && (
                <p className="text-red-500 text-xs italic">
                  {errors.question.message}
                </p>
              )}
            </div>
            <div className="my-6" style={{ maxWidth: "800px", width: "100%" }}>
            <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Answer
              </label>
              <CKEditor
                editor={ClassicEditor}
                onChange={(event, editor) =>
                  handleCKEditorChange(editor.getData())
                }
              />
              <input {...register("answer")} type="hidden" />
              {errors.answer && (
                <p className="text-red-500 text-xs italic">
                  {errors.answer.message}
                </p>
              )}
            </div>
            <div className="flex justify-center items-center my-6">
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-10 rounded ">
                Add FAQ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFAQ;

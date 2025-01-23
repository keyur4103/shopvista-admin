import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateFaq, getOneFaq } from "../../services/FAQ/faqAPI";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
// import { FAQValidation } from "../../../validation/validation";
import { yupResolver } from "@hookform/resolvers/yup";

const EditFAQ = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isSuccess, isFetching, error, data } = useQuery({
    queryKey: ["FAQData"],
    queryFn: () => {
      console.log(id);
      return getOneFaq(id);
    },
    refetchOnWindowFocus: false,
  });

  if (isSuccess) {
    console.log("Successfully fetched", data);
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(FAQValidation),
  });

  const {
    mutate,
    data: FAQData,
    isPending,
    isError,
  } = useMutation({
    mutationFn: (data) => updateFaq(id, data),
    onSuccess: (response) => {
      console.log("response", response);
      toast.success(response.data.message);
      navigate("/faq");
    },
  });

  const onSubmit = (formData) => {
    console.log("formdata", formData);
    mutate(formData);
  };

  useEffect(() => {
    setValue("question", data?.question);
    setValue("answer", data?.answer);
  }, [data]);

  const handleCKEditorChange = (editorData) => {
    setValue("answer", editorData);
  };

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 ">
        <div className="flex items-center justify-center my-4 text-xl font-bold">
          <h2 className="text-blue-700">Edit FAQ</h2>
        </div>
        <div className="flex items-center justify-center vh-100 w-full">
          {isFetching ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
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
                />
                {errors.question && (
                  <p className="text-red-500 text-xs italic">
                    {errors.question.message}
                  </p>
                )}
              </div>
              <div
                className="my-6"
                style={{ maxWidth: "800px", width: "100%" }}
              >
                <CKEditor
                  editor={ClassicEditor}
                  onChange={(event, editor) =>
                    handleCKEditorChange(editor.getData())
                  }
                  data={data?.answer}
                />
                <input {...register("body")} type="hidden" />
                {errors.body && (
                  <p className="text-red-500 text-xs italic">
                    {errors.body.message}
                  </p>
                )}
              </div>
              <div className="flex justify-center items-center my-6">
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-10 rounded ">
                  Save Change
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditFAQ;

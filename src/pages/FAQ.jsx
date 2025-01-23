import React from "react";
import { useNavigate } from "react-router-dom";
import FAQTable from "../components/FAQ/FAQTable";

const FAQ = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg  mt-14">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex place-items-start justify-start  h-14 rounded ">
            <div className="pb-4 bg-white">
              <div className="flex items-center justify-center my-4 text-xl font-bold">
                <h2 className="">FAQs Details</h2>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center h-14 rounded"></div>
          <div className="flex place-items-start justify-end h-14 rounded">
            <button
              onClick={() => navigate("/faq/add")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add New FAQ
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center mb-4 rounded bg-gray-50 dark:bg-gray-800 ">
          <FAQTable />
        </div>
      </div>
    </div>
  );
};

export default FAQ;

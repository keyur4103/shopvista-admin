import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { allfaq, deleteFaq } from "../../services/FAQ/faqAPI";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// import Pagination from "../../ui/Pagination";
import { Button, Modal, Spinner } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const FAQTable = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState({ isOpen: false, id: null });
  const FAQsPerPage = 3;

  const { isSuccess, isFetching, error, data } = useQuery({
    queryKey: ["allFAQ"],
    queryFn: allfaq,
    refetchOnWindowFocus: false,
    select: (data) => data?.reverse(),
  });

  if (isSuccess) {
    console.log("data", data);
  }

  const {
    mutate,
    data: deleteData,
    isPending,
    isError,
  } = useMutation({
    mutationFn: (id) => deleteFaq(id),
    onSuccess: (response) => {
      setOpenModal({ isOpen: false, id: null });
      console.log("response", response.data.message);
      queryClient.invalidateQueries("FAQData");
      toast.success(response.data.message);
    },
  });

  const handleDeleteModal = () => {
    mutate(openModal.id);
  };

  // Filter FAQ
  const filteredData = data?.filter(
    (FAQ) =>
      FAQ.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      FAQ.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination page count
  const offset = currentPage * FAQsPerPage;
  const pageCount = Math.ceil((data?.length || 0) / FAQsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
      {isFetching ? (
        <div className="flex items-center justify-center vh-100">
          <Spinner />
        </div>
      ) : (
        <div>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Questions
                </th>
                <th scope="col" className="px-6 py-3">
                  Answer
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData
                ?.slice(offset, offset + FAQsPerPage)
                .map((FAQ, i) => (
                  <tr
                    key={i}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {FAQ.question}
                    </td>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {FAQ.answer}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        onClick={() => {
                          queryClient.invalidateQueries({
                            queryKey: ["blogData"],
                          });
                          navigate(`/faq/edit/${FAQ._id}`);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                        onClick={() =>
                          setOpenModal({ isOpen: true, id: FAQ._id })
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

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
                  Are you sure you want to delete this FAQ?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button color="failure" onClick={() => handleDeleteModal()}>
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
      )}
    </div>
  );
};

export default FAQTable;

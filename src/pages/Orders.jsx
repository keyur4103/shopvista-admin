import OrderTable from "./../components/Order/OrderTable";

const Orders = () => {
  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg  mt-14">
        <div className="grid grid-cols-1 gap-4 ">
          <div className="flex items-center justify-center my-4 text-2xl font-bold text-center">
            <h2 className="">Order Details</h2>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mb-4 rounded bg-gray-50 dark:bg-gray-800">
          <OrderTable />
        </div>
      </div>
    </div>
  );
};

export default Orders;

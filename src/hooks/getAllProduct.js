import { useQuery } from "@tanstack/react-query";
import { allProducts } from "../services/Product/productAPI";

const getAllProduct = () => {
  const { isSuccess, isFetching, error, data } = useQuery({
    queryKey: ["allProduct"],
    queryFn: allProducts,
    refetchOnWindowFocus: false,
    // select: (data) => data?.reverse(),
  });

  return { isSuccess, isFetching, error, data };
};

export default getAllProduct;

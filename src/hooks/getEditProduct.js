import { useQuery } from "@tanstack/react-query";
import { getProductEdit } from "../services/Product/productAPI";

const getEditProduct = (slug) => {
  const {
    isSuccess: productGetSuccess,
    isFetching,
    error,
    data,
  } = useQuery({
    queryKey: ["editProduct"],
    queryFn: () => getProductEdit(slug),
    refetchOnWindowFocus: false,
    // select: (data) => data?.reverse(),
  });

  return { productGetSuccess, isFetching, error, data: data?.data?.data };
};

export default getEditProduct;

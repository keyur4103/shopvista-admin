import { useQuery } from "@tanstack/react-query";
import { allCategories } from "../services/Category/categoryApi";

const useCategory = () => {
  const { isSuccess, isFetching, error, data } = useQuery({
    queryKey: ["allCategories"],
    queryFn: allCategories,
    refetchOnWindowFocus: false,
    // staleTime: 1000 * 60,
    // select: (data) => data?.reverse(),
  });

  return { isSuccess, isFetching, error, data };
};

export default useCategory;

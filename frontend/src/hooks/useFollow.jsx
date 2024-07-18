import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const useFollow = () => {
  const queryClient = useQueryClient();

  const { mutate: follow, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const response = await fetch(BASE_URL + "/api/users/follow/" + userId, {
          method: "POST",
          credentials: "include",
        });
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message || "Something went wrong!");
        }
        console.log(responseData);
        return responseData;
      } catch (error) {
        throw new Error(error.message || "Something Went Wrong. ");
      }
    },
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { follow, isPending };
};

export default useFollow;

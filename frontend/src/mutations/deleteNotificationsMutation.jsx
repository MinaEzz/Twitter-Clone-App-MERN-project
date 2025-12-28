const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const deleteNotificationsMutation = async () => {
  try {
    const response = await fetch(BASE_URL + "/api/notifications", {
      method: "DELETE",
      credentials: "include",
    });
    const responseData = await response.json();
    if (!response.ok) {
      console.log(responseData);
      throw new Error(responseData.message || "Something Went Wrong.");
    }
    console.log(responseData);
    return responseData;
  } catch (error) {
    throw new Error(error.message || "Something Went Wrong.");
  }
};

export default deleteNotificationsMutation;

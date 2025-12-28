const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const UserProfileQuery = async ({ username }) => {
  try {
    const response = await fetch(BASE_URL + "/api/users/profile/" + username, {
      method: "GET",
      credentials: "include",
    });
    const responseData = await response.json();
    if (!response.ok) {
      console.log(responseData);
      throw new Error(responseData.message || "Something went wrong.");
    }
    console.log(responseData);
    return responseData;
  } catch (error) {
    throw new Error(error.message || "Something went wrong.");
  }
};

export default UserProfileQuery;

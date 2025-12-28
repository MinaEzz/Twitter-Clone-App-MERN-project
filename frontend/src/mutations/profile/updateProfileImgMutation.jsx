const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const updateProfileImgMutation = async ({ profileImg, coverImg }) => {
  try {
    const formData = new FormData();
    if (profileImg) formData.append("profileImg", profileImg);
    if (coverImg) formData.append("coverImg", coverImg);
    const response = await fetch(BASE_URL + "/api/users/update", {
      method: "PATCH",
      credentials: "include",
      body: formData,
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

export default updateProfileImgMutation;

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const createPostMutation = async ({ text, img }) => {
  try {
    const formData = new FormData();
    formData.append("text", text);
    if (img) {
      formData.append("img", img);
    }
    const response = await fetch(BASE_URL + "/api/posts/create", {
      method: "POST",
      credentials: "include",
      body: formData,
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

export default createPostMutation;

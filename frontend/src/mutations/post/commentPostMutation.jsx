const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const commentPostMutation = async ({ postId, comment }) => {
  try {
    const response = await fetch(BASE_URL + "/api/posts/comment/" + postId, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: comment }),
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

export default commentPostMutation;

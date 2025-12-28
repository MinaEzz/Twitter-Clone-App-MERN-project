const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const signupMutation = async ({ fullName, username, email, password }) => {
  try {
    const response = await fetch(BASE_URL + "/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",

      body: JSON.stringify({ fullName, username, email, password }),
    });
    const responseData = await response.json();
    if (!response.ok) {
      console.log(responseData);
      throw new Error(responseData.message || "Something Went Wrong.");
    }
    console.log(responseData);
    return responseData;
  } catch (error) {
    console.log(error.message || "Something Went Wrong.");
    throw new Error(error.message || "Something Went Wrong.");
  }
};

export default signupMutation;

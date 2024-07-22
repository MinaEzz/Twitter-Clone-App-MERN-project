const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const updateProfileMutation = async (formData) => {
  const response = await fetch(BASE_URL + "/api/users/update", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
};

export default updateProfileMutation;

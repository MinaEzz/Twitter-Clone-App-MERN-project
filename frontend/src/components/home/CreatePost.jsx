import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import createPostMutation from "../../mutations/post/createPostMutation";
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const imgRef = useRef(null);
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: createPostMutation,
    onSuccess: () => {
      setPreviewImage(null);
      setText("");
      setImg(null);
      toast.success("Post Created Successfully"),
        queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setImg(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ text, img });
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img
            src={
              !authUser?.data?.user?.profileImg ||
              authUser?.data?.user?.profileImg === "null"
                ? "/avatar-placeholder.png"
                : BASE_URL +
                  "/uploads/images/" +
                  authUser?.data?.user?.profileImg
            }
          />
        </div>
      </div>
      <form
        className="flex flex-col gap-2 w-full"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {previewImage && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setPreviewImage(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={previewImage}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input
            type="file"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
            accept="image/*"
          />
          <button
            className="btn btn-primary rounded-full btn-sm text-white px-4"
            type="submit"
          >
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && (
          <div className="text-red-500">
            {error.message || "Something went wrong"}
          </div>
        )}
      </form>
    </div>
  );
};

export default CreatePost;

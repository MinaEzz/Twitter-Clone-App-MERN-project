import XSvg from "../svgs/X";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const Sidebar = () => {
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { mutate } = useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch(BASE_URL + "/api/auth/logout", {
          method: "POST",
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => toast.error("Logged Out Failed"),
    retry: false,
  });

  const handleLogout = (e) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start">
          <XSvg className="px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900" />
        </Link>
        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <MdHomeFilled className="w-8 h-8" />
              <span className="text-lg hidden md:block">Home</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <IoNotifications className="w-6 h-6" />
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${authUser?.data?.user?.username}`}
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>
        </ul>
        {authUser?.data?.user && (
          <Link
            to={`/profile/${authUser.data?.user?.username}`}
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex">
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
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">
                  {authUser?.data?.user?.fullName}
                </p>
                <p className="text-slate-500 text-sm">
                  @{authUser?.data?.user?.username}
                </p>
              </div>
              <BiLogOut
                className="w-5 h-5 cursor-pointer"
                onClick={handleLogout}
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

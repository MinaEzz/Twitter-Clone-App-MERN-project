import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import NotificationQuery from "../../queries/NotificationsQuery";
import deleteNotificationsMutation from "../../mutations/deleteNotificationsMutation";
import toast from "react-hot-toast";
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const NotificationPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: NotificationQuery,
  });
  const { mutate: deleteNotifications } = useMutation({
    mutationFn: deleteNotificationsMutation,
    onSuccess: () => {
      toast.success("Notifications Deleted Succefully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Notifications</p>
          <div className="dropdown ">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={deleteNotifications}>Delete all notifications</a>
              </li>
            </ul>
          </div>
        </div>
        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {data?.data?.notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">No notifications 🤔</div>
        )}
        {data?.data?.notifications?.map((notification) => (
          <div className="border-b border-gray-700" key={notification._id}>
            <div className="flex gap-2 p-4">
              {notification.type === "follow" && (
                <FaUser className="w-7 h-7 text-primary" />
              )}
              {notification.type === "like" && (
                <FaHeart className="w-7 h-7 text-red-500" />
              )}
              <Link to={`/profile/${notification.from.username}`}>
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={
                        !notification?.from?.profileImg ||
                        notification.from.profileImg === "null" ||
                        notification.from.profileImg === ""
                          ? "/avatar-placeholder.png"
                          : BASE_URL +
                            "/uploads/images/" +
                            notification.from.profileImg
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-1">
                  <span className="font-bold">
                    @{notification.from.username}
                  </span>{" "}
                  {notification.type === "follow"
                    ? "followed you"
                    : "liked your post"}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default NotificationPage;

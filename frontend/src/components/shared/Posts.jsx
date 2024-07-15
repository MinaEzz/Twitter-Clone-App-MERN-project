import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const Posts = ({ feedType }) => {
  const getPostEndPoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts";
      case "following":
        return "/api/posts/following";
      default:
        return "/api/posts";
    }
  };
  const POST_END_POINT = getPostEndPoint();

  const fetchPosts = async () => {
    try {
      const response = await fetch(BASE_URL + POST_END_POINT, {
        method: "GET",
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

  const {
    data: postsData,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    retry: false,
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && postsData?.data?.posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && postsData?.data?.posts && (
        <div>
          {postsData?.data?.posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;

import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import PostsQuery from "../../queries/PostsQuery";

const Posts = ({ feedType, userId }) => {
  const getPostEndPoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts";
      case "following":
        return "/api/posts/following";
      case "posts":
        return "/api/posts/" + userId;
      case "likes":
        return "/api/posts/likes/" + userId;
      default:
        return "/api/posts";
    }
  };
  const POST_END_POINT = getPostEndPoint();

  const {
    data: postsData,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => PostsQuery({ POST_END_POINT }),
    retry: false,
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch, userId]);

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

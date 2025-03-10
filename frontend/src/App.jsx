import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// pages
import {
  SignupPage,
  LoginPage,
  HomePage,
  NotificationPage,
  ProfilePage,
} from "./pages";
// components
import Sidebar from "./components/shared/Sidebar";
import RightPanel from "./components/shared/RightPanel";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/shared/LoadingSpinner";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const App = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const response = await fetch(BASE_URL + "/api/auth/me", {
          method: "GET",
          credentials: "include",
        });
        const responseData = await response.json();
        if (responseData.data === null) return null;
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
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <main className="flex max-w-6xl mx-auto">
      <Router>
        {authUser?.data?.user && <Sidebar />}
        <Routes>
          <Route
            path="/"
            element={
              authUser?.data?.user ? <HomePage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/login"
            element={
              !authUser?.data?.user ? <LoginPage /> : <Navigate to="/" />
            }
          />
          <Route
            path="/signup"
            element={
              !authUser?.data?.user ? <SignupPage /> : <Navigate to="/" />
            }
          />
          <Route
            path="/notifications"
            element={
              authUser?.data?.user ? (
                <NotificationPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/profile/:username"
            element={
              authUser?.data?.user ? <ProfilePage /> : <Navigate to="/login" />
            }
          />
        </Routes>
        {authUser?.data?.user && <RightPanel />}
        <Toaster />
      </Router>
    </main>
  );
};

export default App;

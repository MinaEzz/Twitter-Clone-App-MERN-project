import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

const App = () => {
  return (
    <main className="flex max-w-6xl mx-auto">
      {
        // components are from UI-Design steps
        // DONE: we need to install react router dom and react icons...
        // DONE: we need to copy and paste signup and login pages
        // DONE: we need to copy and paste the svg in X.jsx file
        // DONE: we need to copy and paste home page
        // TODO: we need to copy and paste create post component
        // DONE: we need to copy and paste sidebar component
        // REVIEW: dummy data in the utils folder
        // DONE: we need to copy and paste right panel component
        // REVIEW: skeleton components
        // DONE: we need to copy and paste posts component
        // DONE: we need to copy and paste notifications page
        // REVIEW: loading spinner component
        // DONE: we need to copy and paste profile page
        // DONE: we need to copy and paste edit profile modal
        // REVIEW: daisy ui inputs, modals, skeletons, loading spinner
        // DONE: make sure that inputs of images accept only images
        // DONE:commit the ui is done 2- UI design completed
        // REVIEW: 3:31
        //
        /*
         */
      }
      <Router>
        <Sidebar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Routes>
        <RightPanel />
      </Router>
    </main>
  );
};

export default App;

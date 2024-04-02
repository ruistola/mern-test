import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Signup from "./Signup";
import Login from "./Login";
import NotFound from "./NotFound";
import UnauthenticatedRoute from "./UnauthenticatedRoute";
// import AuthenticatedRoute from "./AuthenticatedRoute";

export default function DemRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={
        <UnauthenticatedRoute>
        <Signup />
        </UnauthenticatedRoute>
      } />
      <Route path="/login" element={
        <UnauthenticatedRoute>
        <Login />
        </UnauthenticatedRoute>
      } />
      {/* Finally, catch all unmatched routes /> */}
      <Route path="*" element={<NotFound />} />;
    </Routes>
  );
}

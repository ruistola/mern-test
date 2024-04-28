import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Signup from "./Signup";
import Login from "./Login";
import NotFound from "./NotFound";

export default function DemRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      {/* Finally, catch all unmatched routes /> */}
      <Route path="*" element={<NotFound />} />;
    </Routes>
  );
}

import { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "./AppContext";

export default function AuthenticatedRoute({ children }: { children: ReactElement; }): ReactElement {
  const { pathname, search } = useLocation();
  const { isAuthenticated } = useAppContext();

  return isAuthenticated ? children : <Navigate to={`/login?redirect=${pathname}${search}`} />;
}

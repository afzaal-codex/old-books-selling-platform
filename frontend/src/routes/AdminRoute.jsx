import {
  Navigate,
  Outlet,
} from "react-router-dom";

const AdminRoute = () => {

  const token =
    localStorage.getItem("token");

  const isAdmin =
    localStorage.getItem(
      "isAdmin"
    ) === "true";

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (!isAdmin) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
};

export default AdminRoute;
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserStore, type Role } from "../store/user.store";

type ProtectedRouteProps = {
  children: ReactNode;
  role?: Role;
};

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const currentUser = useUserStore((state) => state.currentUser);

  if (!currentUser) {
    return <Navigate replace to="/login" />;
  }

  if (role && currentUser.role !== role) {
    return <Navigate replace to="/dashboard" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

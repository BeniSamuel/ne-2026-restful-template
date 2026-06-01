import type { ReactNode } from "react";
import DashLeft from "./DashLeft";
import DashRight from "./DashRight";

type DashboardProps = {
  children: ReactNode;
};

const Dashboard = ({ children }: DashboardProps) => {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <DashLeft />
      <DashRight>{children}</DashRight>
    </div>
  );
};

export default Dashboard;

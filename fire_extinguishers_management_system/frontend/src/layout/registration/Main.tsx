import type { ReactNode } from "react";
import Left from "./Left";
import Right from "./Right";

type RegistrationLayoutProps = {
  children: ReactNode;
};

const RegistrationLayout = ({ children }: RegistrationLayoutProps) => (
  <div className="grid h-screen grid-cols-1 gap-8 overflow-hidden bg-white p-4 lg:grid-cols-[44%_1fr] lg:p-6">
    <Left />
    <Right>{children}</Right>
  </div>
);

export default RegistrationLayout;

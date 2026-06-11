import type { ReactNode } from "react";

type RightProps = {
  children: ReactNode;
};

const Right = ({ children }: RightProps) => (
  <main className="flex h-full items-start justify-center overflow-y-auto px-6 py-10">
    <div className="w-full max-w-[536px]">{children}</div>
  </main>
);

export default Right;

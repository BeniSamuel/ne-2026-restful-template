import type { ReactNode } from "react";
import { motion } from "framer-motion";

type DashboardCardProps = {
  children: ReactNode;
  className?: string;
};

const DashboardCard = ({ children, className = "" }: DashboardCardProps) => (
  <motion.section
    animate={{ opacity: 1, y: 0 }}
    className={`rounded-[28px] bg-[#f8f7f6] p-7 ${className}`}
    initial={{ opacity: 0, y: 14 }}
    transition={{ duration: 0.25 }}
  >
    {children}
  </motion.section>
);

export default DashboardCard;

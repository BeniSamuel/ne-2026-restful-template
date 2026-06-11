import { BsCalendarCheck } from "react-icons/bs";
import { FaFireExtinguisher } from "react-icons/fa";
import { FiFileText, FiTool, FiUser, FiUsers } from "react-icons/fi";
import { RiHome5Fill } from "react-icons/ri";
import type { IconType } from "react-icons";
import type { Role } from "../store/user.store";

export type NavigationItem = {
  Icon: IconType;
  label: string;
  path: string;
  roles: Role[];
};

export const navigationItems: NavigationItem[] = [
  { Icon: RiHome5Fill, label: "Dashboard", path: "/dashboard", roles: ["ADMIN", "INSPECTOR", "USER"] },
  { Icon: FaFireExtinguisher, label: "Extinguishers", path: "/extinguishers", roles: ["ADMIN", "INSPECTOR", "USER"] },
  { Icon: BsCalendarCheck, label: "Inspections", path: "/inspections", roles: ["ADMIN", "INSPECTOR", "USER"] },
  { Icon: FiTool, label: "Maintenance", path: "/maintenance", roles: ["ADMIN", "INSPECTOR"] },
  { Icon: FiFileText, label: "Reports", path: "/reports", roles: ["ADMIN", "INSPECTOR", "USER"] },
  { Icon: FiUsers, label: "Users", path: "/users", roles: ["ADMIN"] },
  { Icon: FiUser, label: "Profile", path: "/profile", roles: ["ADMIN", "INSPECTOR", "USER"] },
];

export const clientNavigationItems = navigationItems.filter((item) => item.roles.includes("USER"));
export const adminNavigationItems = navigationItems.filter((item) => item.roles.includes("ADMIN"));

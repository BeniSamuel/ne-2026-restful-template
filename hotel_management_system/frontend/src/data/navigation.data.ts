import { BsCalendarCheck } from "react-icons/bs";
import { FaHotel } from "react-icons/fa6";
import { FiFileText, FiUser, FiUsers } from "react-icons/fi";
import { RiHome5Fill } from "react-icons/ri";
import type { IconType } from "react-icons";

export type NavigationItem = {
  Icon: IconType;
  label: string;
  path: string;
};

export const clientNavigationItems: NavigationItem[] = [
  { Icon: RiHome5Fill, label: "Dashboard", path: "/dashboard" },
  { Icon: FaHotel, label: "Hotels", path: "/hotels" },
  { Icon: BsCalendarCheck, label: "My Bookings", path: "/bookings" },
  { Icon: FiUser, label: "Profile", path: "/profile" },
];

export const adminNavigationItems: NavigationItem[] = [
  { Icon: RiHome5Fill, label: "Dashboard", path: "/dashboard" },
  { Icon: FaHotel, label: "Hotels", path: "/hotels" },
  { Icon: BsCalendarCheck, label: "Bookings", path: "/bookings" },
  { Icon: FiFileText, label: "Reports", path: "/reports" },
  { Icon: FiUsers, label: "Profile", path: "/profile" },
];

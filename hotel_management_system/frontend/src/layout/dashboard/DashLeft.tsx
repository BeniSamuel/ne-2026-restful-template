import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiLogOut, FiUser } from "react-icons/fi";
import { adminNavigationItems, clientNavigationItems } from "../../data/navigation.data";
import { useThemeStore } from "../../store/theme.store";
import { useUserStore } from "../../store/user.store";
import { colors } from "../../theme/color.theme";

const DashLeft = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useUserStore((state) => state.currentUser);
  const logout = useUserStore((state) => state.logout);
  const collapsed = useThemeStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useThemeStore((state) => state.toggleSidebar);
  const navigationItems = currentUser?.role === "ADMIN" ? adminNavigationItems : clientNavigationItems;
  const displayName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Hotel User";
  const initials = currentUser ? `${currentUser.firstName[0]}${currentUser.lastName[0]}` : "HT";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside
      className={`m-[14px] flex h-[calc(100vh-28px)] shrink-0 flex-col overflow-visible rounded-[18px] px-5 py-8 text-white transition-all duration-300 ${
        collapsed ? "w-[104px] items-center" : "w-[260px]"
      }`}
      style={{ background: colors.primary }}
    >
      <Link className={`text-2xl font-semibold ${collapsed ? "text-center" : ""}`} to="/dashboard">
        {collapsed ? "HT" : "Hotel"}
      </Link>

      <nav className="mt-16 flex flex-1 flex-col gap-4">
        {navigationItems.map((item) => {
          const active = location.pathname === item.path || (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
          const ItemIcon = item.Icon;

          return (
            <Link
              aria-label={item.label}
              className={`flex h-14 items-center gap-4 rounded-full px-4 text-sm font-semibold transition ${
                active ? "bg-white/25" : "hover:bg-white/10"
              } ${collapsed ? "w-14 justify-center" : "w-full"}`}
              key={item.path}
              title={item.label}
              to={item.path}
            >
              <ItemIcon aria-hidden="true" size={24} />
              {!collapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className={`group relative flex w-full gap-3 ${collapsed ? "flex-col items-center" : "flex-row items-center"}`}>
        <div
          className={`flex min-w-0 cursor-pointer items-center gap-3 rounded-2xl bg-white/10 p-3 hover:bg-white/15 ${
            collapsed ? "flex-col justify-center" : "flex-1 flex-row"
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold" style={{ color: colors.primarySolid }}>
            {initials}
          </div>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{displayName}</p>
              <p className="text-xs font-semibold text-white/65">{currentUser?.role ?? "CLIENT"}</p>
            </div>
          ) : null}
        </div>

        <div
          className={`invisible absolute bottom-[calc(100%+10px)] z-50 w-56 translate-y-2 rounded-2xl bg-white p-2 text-black opacity-0 shadow-2xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${
            collapsed ? "left-full ml-4" : "left-0"
          }`}
        >
          <Link className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-black/5" to="/profile">
            <FiUser aria-hidden="true" size={18} />
            Profile
          </Link>
          <button
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
            onClick={handleLogout}
            type="button"
          >
            <FiLogOut aria-hidden="true" size={18} />
            Logout
          </button>
        </div>

        <button
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/80 hover:bg-white/10"
          onClick={toggleSidebar}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          type="button"
        >
          {collapsed ? <FiChevronRight aria-hidden="true" size={20} /> : <FiChevronLeft aria-hidden="true" size={20} />}
        </button>
      </div>
    </aside>
  );
};

export default DashLeft;

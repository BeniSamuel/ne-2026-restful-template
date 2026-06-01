import type { ReactNode } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import NotificationMenu from "../../components/NotificationMenu";
import { useUserStore } from "../../store/user.store";
import { useSearchStore } from "../../store/search.store";

type DashRightProps = {
  children: ReactNode;
};

const DashRight = ({ children }: DashRightProps) => {
  const currentUser = useUserStore((state) => state.currentUser);
  const query = useSearchStore((state) => state.query);
  const setQuery = useSearchStore((state) => state.setQuery);
  const name = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Beni Samuel";

  return (
    <main className="h-screen flex-1 overflow-y-auto px-8 py-12">
      <header className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto_auto]">
        <p className="text-base font-semibold text-black/45">
          Good morning <span className="text-black">{name}</span>
        </p>

        <label className="flex h-11 w-full max-w-80 items-center gap-4 rounded-[24px] bg-[#f8f7f6] px-7 lg:w-80">
          <FiSearch aria-hidden="true" size={21} />
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-black/45"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            value={query}
          />
          {query ? (
            <button aria-label="Clear search" onClick={() => setQuery("")} type="button">
              <FiX aria-hidden="true" size={18} />
            </button>
          ) : null}
        </label>

        <NotificationMenu />
      </header>

      <div className="mt-11">{children}</div>
    </main>
  );
};

export default DashRight;

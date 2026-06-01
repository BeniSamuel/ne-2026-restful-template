import { useState } from "react";
import { FiBell } from "react-icons/fi";
import { useBookingStore } from "../store/booking.store";
import { useHotelStore } from "../store/hotel.store";

const NotificationMenu = () => {
  const [open, setOpen] = useState(false);
  const hotels = useHotelStore((state) => state.hotels);
  const bookings = useBookingStore((state) => state.bookings);
  const activeBookings = bookings.filter((booking) => booking.status === "ACTIVE").length;

  return (
    <div className="relative">
      <button
        aria-label="Notifications"
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#f8f7f6] text-black"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <FiBell aria-hidden="true" size={21} />
        {activeBookings ? <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" /> : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-14 z-40 w-80 rounded-[24px] bg-white p-4 shadow-2xl">
          <h3 className="text-sm font-bold text-black">Notifications</h3>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-[#f8f7f6] p-4">
              <p className="text-sm font-bold text-black">{activeBookings} active bookings</p>
              <p className="mt-1 text-xs font-semibold text-black/45">Track current booking status from the bookings page.</p>
            </div>
            <div className="rounded-2xl bg-[#f8f7f6] p-4">
              <p className="text-sm font-bold text-black">{hotels.length} hotels available</p>
              <p className="mt-1 text-xs font-semibold text-black/45">Use search to find a hotel by name or location.</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NotificationMenu;

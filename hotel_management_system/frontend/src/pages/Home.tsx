import { useEffect } from "react";
import { bookingApi } from "../api/booking.api";
import { hotelApi } from "../api/hotel.api";
import DashboardCard from "../components/DashboardCard";
import PageTitle from "../components/PageTitle";
import Dashboard from "../layout/dashboard/Dashboard";
import { useBookingStore } from "../store/booking.store";
import { useHotelStore } from "../store/hotel.store";
import { useUserStore } from "../store/user.store";

const Home = () => {
  const hotels = useHotelStore((state) => state.hotels);
  const bookings = useBookingStore((state) => state.bookings);
  const currentUser = useUserStore((state) => state.currentUser);
  const isAdmin = currentUser?.role === "ADMIN";

  useEffect(() => {
    void hotelApi.fetchHotels();
    void (isAdmin ? bookingApi.fetchAll() : bookingApi.fetchMine());
  }, [isAdmin]);

  return (
    <Dashboard>
      <PageTitle
        subtitle={isAdmin ? "Manage hotels, bookings and reports from one place." : "Browse hotels and track your bookings."}
        title={isAdmin ? "Admin Dashboard" : "Client Dashboard"}
      />
      <div className="grid gap-6 md:grid-cols-3">
        <DashboardCard>
          <p className="text-sm font-semibold text-black/45">Hotels</p>
          <h2 className="mt-4 text-4xl font-bold text-black">{hotels.length}</h2>
        </DashboardCard>
        <DashboardCard>
          <p className="text-sm font-semibold text-black/45">{isAdmin ? "All bookings" : "My bookings"}</p>
          <h2 className="mt-4 text-4xl font-bold text-black">{bookings.length}</h2>
        </DashboardCard>
        <DashboardCard>
          <p className="text-sm font-semibold text-black/45">Active</p>
          <h2 className="mt-4 text-4xl font-bold text-black">
            {bookings.filter((booking) => booking.status === "ACTIVE").length}
          </h2>
        </DashboardCard>
      </div>
    </Dashboard>
  );
};

export default Home;

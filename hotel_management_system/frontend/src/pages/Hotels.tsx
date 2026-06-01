import { FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { bookingApi } from "../api/booking.api";
import { hotelApi } from "../api/hotel.api";
import DashboardCard from "../components/DashboardCard";
import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import PageTitle from "../components/PageTitle";
import PaginatedList from "../components/PaginatedList";
import Dashboard from "../layout/dashboard/Dashboard";
import { useHotelStore, type Hotel } from "../store/hotel.store";
import { useSearchStore } from "../store/search.store";
import { useUserStore } from "../store/user.store";
import { dateRangeIsValid, required } from "../utils/validators";

const emptyHotel = { location: "", name: "", rooms: "1" };

const Hotels = () => {
  const hotels = useHotelStore((state) => state.hotels);
  const currentUser = useUserStore((state) => state.currentUser);
  const query = useSearchStore((state) => state.query.toLowerCase());
  const isAdmin = currentUser?.role === "ADMIN";
  const [hotelForm, setHotelForm] = useState(emptyHotel);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [bookingHotelId, setBookingHotelId] = useState<number | null>(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  useEffect(() => {
    void hotelApi.fetchHotels();
  }, []);

  const filteredHotels = useMemo(
    () =>
      hotels.filter((hotel) =>
        `${hotel.id} ${hotel.name} ${hotel.location} ${hotel.rooms} ${hotel.availability}`.toLowerCase().includes(query),
      ),
    [hotels, query],
  );

  async function handleHotelSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!required(hotelForm.name) || !required(hotelForm.location) || !Number.isInteger(Number(hotelForm.rooms)) || Number(hotelForm.rooms) < 1) {
      toast.error("Fill hotel name, location and rooms correctly");
      return;
    }

    try {
      const payload = { location: hotelForm.location, name: hotelForm.name, rooms: Number(hotelForm.rooms) };
      if (editingHotel) {
        await hotelApi.updateHotel(editingHotel.id, payload);
        toast.success("Hotel updated");
      } else {
        await hotelApi.createHotel(payload);
        toast.success("Hotel created");
      }
      setEditingHotel(null);
      setHotelForm(emptyHotel);
    } catch {
      toast.error("Hotel action failed. Admin access is required.");
    }
  }

  async function handleBookHotel(hotelId: number) {
    if (!dateRangeIsValid(checkInDate, checkOutDate)) {
      toast.error("Choose valid check-in and check-out dates");
      return;
    }

    try {
      await bookingApi.createBooking({
        checkInDate: new Date(checkInDate).toISOString(),
        checkOutDate: new Date(checkOutDate).toISOString(),
        hotelId,
      });
      toast.success("Hotel booked successfully");
      setBookingHotelId(null);
      setCheckInDate("");
      setCheckOutDate("");
    } catch {
      toast.error("Booking failed");
    }
  }

  function startEdit(hotel: Hotel) {
    setEditingHotel(hotel);
    setHotelForm({ location: hotel.location, name: hotel.name, rooms: String(hotel.rooms) });
  }

  return (
    <Dashboard>
      <PageTitle subtitle={isAdmin ? "Create, update and remove hotel records." : "Search hotels and make a booking."} title="Hotels" />

      {isAdmin ? (
        <DashboardCard className="mb-8">
          <form className="grid gap-5 lg:grid-cols-[1fr_1fr_120px_180px]" onSubmit={handleHotelSubmit}>
            <FormInput label="Hotel name" onChange={(name) => setHotelForm((form) => ({ ...form, name }))} value={hotelForm.name} />
            <FormInput label="Location" onChange={(location) => setHotelForm((form) => ({ ...form, location }))} value={hotelForm.location} />
            <FormInput label="Rooms" min={1} onChange={(rooms) => setHotelForm((form) => ({ ...form, rooms }))} type="number" value={hotelForm.rooms} />
            <div className="pt-8">
              <FormButton className="h-12" type="submit">
                {editingHotel ? "Update" : "Create"}
              </FormButton>
            </div>
          </form>
        </DashboardCard>
      ) : null}

      <PaginatedList
        emptyMessage="No hotels match your search. Try another name, location or availability."
        emptyTitle="No hotels found"
        items={filteredHotels}
        renderItem={(hotel) => (
          <DashboardCard key={hotel.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-black">{hotel.name}</h2>
                <p className="mt-2 text-sm font-medium text-black/45">{hotel.location}</p>
                <p className="mt-4 text-sm font-semibold text-black">{hotel.rooms} rooms available</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-black/50">{hotel.availability}</span>
            </div>

            {isAdmin ? (
              <div className="mt-6 flex gap-3">
                <FormButton className="h-11" onClick={() => startEdit(hotel)} variant="soft">
                  Edit
                </FormButton>
                <FormButton
                  className="h-11"
                  onClick={async () => {
                    try {
                      await hotelApi.deleteHotel(hotel.id);
                      toast.success("Hotel deleted");
                    } catch {
                      toast.error("Hotel delete failed");
                    }
                  }}
                >
                  Delete
                </FormButton>
              </div>
            ) : (
              <div className="mt-6">
                {bookingHotelId === hotel.id ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormInput label="Check in" onChange={setCheckInDate} type="datetime-local" value={checkInDate} />
                    <FormInput label="Check out" onChange={setCheckOutDate} type="datetime-local" value={checkOutDate} />
                    <div className="md:col-span-2">
                      <FormButton className="h-12" onClick={() => void handleBookHotel(hotel.id)}>
                        Confirm Booking
                      </FormButton>
                    </div>
                  </div>
                ) : (
                  <FormButton className="h-12" onClick={() => setBookingHotelId(hotel.id)}>
                    Book Hotel
                  </FormButton>
                )}
              </div>
            )}
          </DashboardCard>
        )}
      />
    </Dashboard>
  );
};

export default Hotels;

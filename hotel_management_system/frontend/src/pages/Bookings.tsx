import { FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { bookingApi } from "../api/booking.api";
import ConfirmModal from "../components/ConfirmModal";
import DashboardCard from "../components/DashboardCard";
import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import PageTitle from "../components/PageTitle";
import PaginatedList from "../components/PaginatedList";
import StatusBadge from "../components/StatusBadge";
import Dashboard from "../layout/dashboard/Dashboard";
import { useBookingStore, type Booking } from "../store/booking.store";
import { useSearchStore } from "../store/search.store";
import { useUserStore } from "../store/user.store";
import { dateRangeIsValid } from "../utils/validators";

const Bookings = () => {
  const bookings = useBookingStore((state) => state.bookings);
  const currentUser = useUserStore((state) => state.currentUser);
  const query = useSearchStore((state) => state.query.toLowerCase());
  const isAdmin = currentUser?.role === "ADMIN";
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [action, setAction] = useState<"cancel" | "delete" | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  useEffect(() => {
    void (isAdmin ? bookingApi.fetchAll() : bookingApi.fetchMine());
  }, [isAdmin]);

  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) =>
        `${booking.id} ${booking.hotel.name} ${booking.user.firstName} ${booking.user.lastName} ${booking.status}`
          .concat(` ${booking.hotel.location} ${new Date(booking.checkInDate).toLocaleString()} ${new Date(booking.checkOutDate).toLocaleString()}`)
          .toLowerCase()
          .includes(query),
      ),
    [bookings, query],
  );

  function startEdit(booking: Booking) {
    setEditingBooking(booking);
    setCheckInDate(booking.checkInDate.slice(0, 16));
    setCheckOutDate(booking.checkOutDate.slice(0, 16));
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingBooking || !dateRangeIsValid(checkInDate, checkOutDate)) {
      toast.error("Choose valid booking dates");
      return;
    }

    try {
      await bookingApi.updateBooking(editingBooking.id, {
        checkInDate: new Date(checkInDate).toISOString(),
        checkOutDate: new Date(checkOutDate).toISOString(),
      });
      toast.success("Booking updated");
      setEditingBooking(null);
    } catch {
      toast.error("Booking update failed");
    }
  }

  async function confirmAction() {
    if (!selectedBooking || !action) {
      return;
    }

    try {
      if (action === "cancel") {
        await bookingApi.cancelBooking(selectedBooking.id);
        await (isAdmin ? bookingApi.fetchAll() : bookingApi.fetchMine());
        toast.success("Booking cancelled. It was not deleted.");
      } else {
        await bookingApi.deleteBooking(selectedBooking.id);
        toast.success("Booking deleted permanently");
      }
    } catch {
      toast.error("Booking action failed");
    } finally {
      setAction(null);
      setSelectedBooking(null);
    }
  }

  return (
    <Dashboard>
      <PageTitle subtitle={isAdmin ? "Review, update, cancel or delete bookings." : "Track your booking status and actions."} title="Bookings" />

      {editingBooking ? (
        <DashboardCard className="mb-8">
          <form className="grid gap-5 md:grid-cols-[1fr_1fr_180px]" onSubmit={handleUpdate}>
            <FormInput label="Check in" onChange={setCheckInDate} type="datetime-local" value={checkInDate} />
            <FormInput label="Check out" onChange={setCheckOutDate} type="datetime-local" value={checkOutDate} />
            <div className="pt-8">
              <FormButton className="h-12" type="submit">
                Save
              </FormButton>
            </div>
          </form>
        </DashboardCard>
      ) : null}

      <PaginatedList
        className="space-y-5"
        emptyMessage="No bookings match your search. Try a guest, hotel, status or date."
        emptyTitle="No bookings found"
        items={filteredBookings}
        renderItem={(booking) => (
          <DashboardCard key={booking.id}>
            <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold text-black">#{booking.id} {booking.hotel.name}</h2>
                  <StatusBadge status={booking.status} />
                </div>
                <p className="mt-3 text-sm font-medium text-black/45">
                  Guest: {booking.user.firstName} {booking.user.lastName}
                </p>
                <p className="mt-2 text-sm font-medium text-black/45">
                  {new Date(booking.checkInDate).toLocaleString()} - {new Date(booking.checkOutDate).toLocaleString()}
                </p>
              </div>

              <div className="grid min-w-72 gap-3 sm:grid-cols-2">
                {isAdmin ? (
                  <FormButton className="h-11" onClick={() => startEdit(booking)} variant="soft">
                    Edit
                  </FormButton>
                ) : null}
                {booking.status === "ACTIVE" ? (
                  <FormButton
                    className="h-11"
                    onClick={async () => {
                      try {
                        await bookingApi.checkOutBooking(booking.id);
                        await (isAdmin ? bookingApi.fetchAll() : bookingApi.fetchMine());
                        toast.success("Checked out successfully");
                      } catch {
                        toast.error("Check-out failed");
                      }
                    }}
                    variant="soft"
                  >
                    Check out
                  </FormButton>
                ) : null}
                {booking.status !== "CANCELLED" && booking.status !== "CHECKED_OUT" ? (
                  <FormButton
                    className="h-11"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setAction("cancel");
                    }}
                  >
                    Cancel
                  </FormButton>
                ) : null}
                {isAdmin ? (
                  <FormButton
                    className="h-11"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setAction("delete");
                    }}
                  >
                    Delete
                  </FormButton>
                ) : null}
              </div>
            </div>
          </DashboardCard>
        )}
      />

      <ConfirmModal
        confirmText={action === "delete" ? "Delete" : "Cancel booking"}
        message={
          action === "delete"
            ? "This permanently deletes the booking record. Use this only when the exam scenario clearly asks for delete."
            : "This changes the booking status to cancelled. The record stays available for history and reports."
        }
        onCancel={() => {
          setAction(null);
          setSelectedBooking(null);
        }}
        onConfirm={() => void confirmAction()}
        open={Boolean(action)}
        title={action === "delete" ? "Delete permanently?" : "Cancel booking?"}
      />
    </Dashboard>
  );
};

export default Bookings;

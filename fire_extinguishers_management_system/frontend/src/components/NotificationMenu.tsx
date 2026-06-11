import { useState } from "react";
import { FiBell } from "react-icons/fi";
import { useExtinguisherStore } from "../store/extinguisher.store";
import { useInspectionStore } from "../store/inspection.store";

const NotificationMenu = () => {
  const [open, setOpen] = useState(false);
  const extinguishers = useExtinguisherStore((state) => state.extinguishers);
  const inspections = useInspectionStore((state) => state.inspections);
  const scheduledInspections = inspections.filter((inspection) => inspection.inspectionStatus === "SCHEDULED").length;
  const expiredExtinguishers = extinguishers.filter((item) => item.status === "EXPIRED" || new Date(item.expiryDate) < new Date()).length;

  return (
    <div className="relative">
      <button
        aria-label="Notifications"
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#f8f7f6] text-black"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <FiBell aria-hidden="true" size={21} />
        {scheduledInspections || expiredExtinguishers ? <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" /> : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-14 z-40 w-80 rounded-[24px] bg-white p-4 shadow-2xl">
          <h3 className="text-sm font-bold text-black">Notifications</h3>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-[#f8f7f6] p-4">
              <p className="text-sm font-bold text-black">{scheduledInspections} scheduled inspections</p>
              <p className="mt-1 text-xs font-semibold text-black/45">Track inspection work from the inspections page.</p>
            </div>
            <div className="rounded-2xl bg-[#f8f7f6] p-4">
              <p className="text-sm font-bold text-black">{expiredExtinguishers} expired extinguishers</p>
              <p className="mt-1 text-xs font-semibold text-black/45">Review expired equipment from the extinguisher inventory.</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NotificationMenu;

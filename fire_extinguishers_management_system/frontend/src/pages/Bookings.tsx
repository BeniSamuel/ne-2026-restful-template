import { FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { inspectionApi } from "../api/inspection.api";
import ConfirmModal from "../components/ConfirmModal";
import DashboardCard from "../components/DashboardCard";
import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import PageTitle from "../components/PageTitle";
import PaginatedList from "../components/PaginatedList";
import StatusBadge from "../components/StatusBadge";
import Dashboard from "../layout/dashboard/Dashboard";
import { useInspectionStore, type Inspection, type InspectionStatus } from "../store/inspection.store";
import { useSearchStore } from "../store/search.store";
import { useUserStore } from "../store/user.store";
import { isTodayOrFuture, required } from "../utils/validators";

const emptyInspection = {
  extinguisherId: "44444444-4444-4444-4444-444444444444",
  inspectorId: "22222222-2222-2222-2222-222222222222",
  scheduledDate: "2026-06-10T09:00",
  inspectionStatus: "SCHEDULED" as InspectionStatus,
  notes: "",
};

const Bookings = () => {
  const inspections = useInspectionStore((state) => state.inspections);
  const currentUser = useUserStore((state) => state.currentUser);
  const query = useSearchStore((state) => state.query.toLowerCase());
  const canRecordResults = currentUser?.role === "ADMIN" || currentUser?.role === "INSPECTOR";
  const [form, setForm] = useState(emptyInspection);
  const [editing, setEditing] = useState<Inspection | null>(null);
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [filters, setFilters] = useState({
    inspectionStatus: "",
    dateFrom: "",
    dateTo: "",
    sortBy: "scheduledDate",
    sortOrder: "DESC",
  });

  useEffect(() => {
    void inspectionApi.fetchInspections();
  }, []);

  const filteredInspections = useMemo(
    () =>
      inspections.filter((inspection) =>
        `${inspection.extinguisherId} ${inspection.inspectorId} ${inspection.inspectionStatus} ${inspection.notes ?? ""}`
          .toLowerCase()
          .includes(query),
      ),
    [inspections, query],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!required(form.extinguisherId) || !required(form.inspectorId) || !required(form.scheduledDate)) {
      toast.error("Extinguisher, inspector and date are required");
      return;
    }
    if (!isTodayOrFuture(form.scheduledDate)) {
      toast.error("Scheduled date cannot be in the past");
      return;
    }

    try {
      const payload = { ...form, scheduledDate: new Date(form.scheduledDate).toISOString() };
      if (editing) {
        await inspectionApi.updateInspection(editing.id, payload);
        toast.success("Inspection updated");
      } else {
        await inspectionApi.createInspection(payload);
        toast.success("Inspection scheduled");
      }
      setEditing(null);
      setForm(emptyInspection);
    } catch {
      toast.error("Inspection action failed");
    }
  }

  async function applyFilters() {
    if (filters.dateFrom && filters.dateTo && new Date(filters.dateTo) < new Date(filters.dateFrom)) {
      toast.error("Date to cannot be before date from");
      return;
    }
    await inspectionApi.fetchInspections({
      ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value)),
      search: query,
    });
  }

  function startEdit(inspection: Inspection) {
    setEditing(inspection);
    setForm({
      extinguisherId: inspection.extinguisherId,
      inspectorId: inspection.inspectorId,
      scheduledDate: inspection.scheduledDate.slice(0, 16),
      inspectionStatus: inspection.inspectionStatus,
      notes: inspection.notes ?? "",
    });
  }

  async function confirmDelete() {
    if (!selectedInspection) return;
    try {
      await inspectionApi.deleteInspection(selectedInspection.id);
      toast.success("Inspection deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setSelectedInspection(null);
    }
  }

  return (
    <Dashboard>
      <PageTitle subtitle="Schedule inspections and capture inspection outcomes." title="Inspections" />

      <DashboardCard className="mb-8">
        <div className="grid gap-5 lg:grid-cols-5">
          <Select
            label="Status"
            onChange={(inspectionStatus) => setFilters((value) => ({ ...value, inspectionStatus }))}
            options={["", "SCHEDULED", "PASSED", "FAILED", "CANCELLED"]}
            value={filters.inspectionStatus}
          />
          <FormInput label="Date from" onChange={(dateFrom) => setFilters((value) => ({ ...value, dateFrom }))} type="datetime-local" value={filters.dateFrom} />
          <FormInput label="Date to" onChange={(dateTo) => setFilters((value) => ({ ...value, dateTo }))} type="datetime-local" value={filters.dateTo} />
          <Select label="Sort by" onChange={(sortBy) => setFilters((value) => ({ ...value, sortBy }))} options={["scheduledDate", "createdAt", "inspectionStatus"]} value={filters.sortBy} />
          <Select label="Sort order" onChange={(sortOrder) => setFilters((value) => ({ ...value, sortOrder }))} options={["DESC", "ASC"]} value={filters.sortOrder} />
          <div className="lg:col-span-5">
            <FormButton className="h-12 max-w-56" onClick={() => void applyFilters()} type="button" variant="soft">
              Apply filters
            </FormButton>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard className="mb-8">
        <form className="grid gap-5 lg:grid-cols-3" onSubmit={handleSubmit}>
          <FormInput label="Extinguisher ID" onChange={(extinguisherId) => setForm((value) => ({ ...value, extinguisherId }))} value={form.extinguisherId} />
          <FormInput label="Inspector ID" onChange={(inspectorId) => setForm((value) => ({ ...value, inspectorId }))} value={form.inspectorId} />
          <FormInput label="Scheduled date" onChange={(scheduledDate) => setForm((value) => ({ ...value, scheduledDate }))} type="datetime-local" value={form.scheduledDate} />
          {canRecordResults ? (
            <Select
              label="Status"
              onChange={(inspectionStatus) => setForm((value) => ({ ...value, inspectionStatus: inspectionStatus as InspectionStatus }))}
              options={["SCHEDULED", "PASSED", "FAILED", "CANCELLED"]}
              value={form.inspectionStatus}
            />
          ) : null}
          <FormInput label="Notes" onChange={(notes) => setForm((value) => ({ ...value, notes }))} value={form.notes} />
          <div className="pt-8">
            <FormButton className="h-12" type="submit">
              {editing ? "Update" : "Schedule"}
            </FormButton>
          </div>
        </form>
      </DashboardCard>

      <PaginatedList
        emptyMessage="No inspections match your search."
        emptyTitle="No inspections found"
        items={filteredInspections}
        renderItem={(inspection) => (
          <DashboardCard key={inspection.id}>
            <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold text-black">Inspection #{inspection.id.slice(0, 8)}</h2>
                  <StatusBadge status={inspection.inspectionStatus} />
                </div>
                <p className="mt-3 text-sm font-medium text-black/45">Extinguisher: {inspection.extinguisherId}</p>
                <p className="mt-2 text-sm font-medium text-black/45">Inspector: {inspection.inspectorId}</p>
                <p className="mt-2 text-sm font-semibold text-black">{new Date(inspection.scheduledDate).toLocaleString()}</p>
                {inspection.notes ? <p className="mt-3 text-sm font-medium text-black/60">{inspection.notes}</p> : null}
              </div>

              {canRecordResults ? (
                <div className="grid min-w-48 gap-3 sm:grid-cols-2">
                  <FormButton className="h-11" onClick={() => startEdit(inspection)} variant="soft">
                    Edit
                  </FormButton>
                  <FormButton className="h-11" onClick={() => setSelectedInspection(inspection)}>
                    Delete
                  </FormButton>
                </div>
              ) : null}
            </div>
          </DashboardCard>
        )}
      />

      <ConfirmModal
        confirmText="Delete"
        message="This permanently deletes the inspection record."
        onCancel={() => setSelectedInspection(null)}
        onConfirm={() => void confirmDelete()}
        open={Boolean(selectedInspection)}
        title="Delete inspection?"
      />
    </Dashboard>
  );
};

const Select = ({ label, onChange, options, value }: { label: string; onChange: (value: string) => void; options: string[]; value: string }) => (
  <label className="text-sm font-semibold text-black/55">
    {label}
    <select className="mt-2 h-12 w-full rounded-[24px] bg-white px-5 text-sm font-semibold outline-none" onChange={(event) => onChange(event.target.value)} value={value}>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </label>
);

export default Bookings;

import { FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { maintenanceApi } from "../api/maintenance.api";
import ConfirmModal from "../components/ConfirmModal";
import DashboardCard from "../components/DashboardCard";
import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import PageTitle from "../components/PageTitle";
import PaginatedList from "../components/PaginatedList";
import Dashboard from "../layout/dashboard/Dashboard";
import { useMaintenanceStore, type MaintenanceRecord } from "../store/maintenance.store";
import { useSearchStore } from "../store/search.store";
import { isTodayOrPast, required } from "../utils/validators";

const emptyMaintenance = {
  extinguisherId: "44444444-4444-4444-4444-444444444444",
  inspectorId: "22222222-2222-2222-2222-222222222222",
  actionTaken: "",
  conditionNoted: "",
  actionDate: "2026-06-01T10:30",
};

const Maintenance = () => {
  const records = useMaintenanceStore((state) => state.records);
  const query = useSearchStore((state) => state.query.toLowerCase());
  const [form, setForm] = useState(emptyMaintenance);
  const [editing, setEditing] = useState<MaintenanceRecord | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    sortBy: "actionDate",
    sortOrder: "DESC",
  });

  useEffect(() => {
    void maintenanceApi.fetchMaintenance();
  }, []);

  const filteredRecords = useMemo(
    () =>
      records.filter((record) =>
        `${record.extinguisherId} ${record.inspectorId} ${record.actionTaken} ${record.conditionNoted}`.toLowerCase().includes(query),
      ),
    [query, records],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!required(form.extinguisherId) || !required(form.inspectorId) || !required(form.actionTaken) || !required(form.conditionNoted)) {
      toast.error("Fill all maintenance fields");
      return;
    }
    if (!isTodayOrPast(form.actionDate)) {
      toast.error("Action date cannot be in the future");
      return;
    }

    try {
      const payload = { ...form, actionDate: new Date(form.actionDate).toISOString() };
      if (editing) {
        await maintenanceApi.updateMaintenance(editing.id, payload);
        toast.success("Maintenance updated");
      } else {
        await maintenanceApi.createMaintenance(payload);
        toast.success("Maintenance recorded");
      }
      setEditing(null);
      setForm(emptyMaintenance);
    } catch {
      toast.error("Maintenance action failed");
    }
  }

  async function applyFilters() {
    if (filters.dateFrom && filters.dateTo && new Date(filters.dateTo) < new Date(filters.dateFrom)) {
      toast.error("Date to cannot be before date from");
      return;
    }
    await maintenanceApi.fetchMaintenance({
      ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value)),
      search: query,
    });
  }

  function startEdit(record: MaintenanceRecord) {
    setEditing(record);
    setForm({
      extinguisherId: record.extinguisherId,
      inspectorId: record.inspectorId,
      actionTaken: record.actionTaken,
      conditionNoted: record.conditionNoted,
      actionDate: record.actionDate.slice(0, 16),
    });
  }

  async function confirmDelete() {
    if (!selectedRecord) return;
    try {
      await maintenanceApi.deleteMaintenance(selectedRecord.id);
      toast.success("Maintenance deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setSelectedRecord(null);
    }
  }

  return (
    <Dashboard>
      <PageTitle subtitle="Track action taken, condition noted and action date." title="Maintenance" />

      <DashboardCard className="mb-8">
        <div className="grid gap-5 lg:grid-cols-5">
          <FormInput label="Date from" onChange={(dateFrom) => setFilters((value) => ({ ...value, dateFrom }))} type="datetime-local" value={filters.dateFrom} />
          <FormInput label="Date to" onChange={(dateTo) => setFilters((value) => ({ ...value, dateTo }))} type="datetime-local" value={filters.dateTo} />
          <Select label="Sort by" onChange={(sortBy) => setFilters((value) => ({ ...value, sortBy }))} options={["actionDate", "createdAt"]} value={filters.sortBy} />
          <Select label="Sort order" onChange={(sortOrder) => setFilters((value) => ({ ...value, sortOrder }))} options={["DESC", "ASC"]} value={filters.sortOrder} />
          <div className="pt-8">
            <FormButton className="h-12" onClick={() => void applyFilters()} type="button" variant="soft">
              Apply filters
            </FormButton>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard className="mb-8">
        <form className="grid gap-5 lg:grid-cols-3" onSubmit={handleSubmit}>
          <FormInput label="Extinguisher ID" onChange={(extinguisherId) => setForm((value) => ({ ...value, extinguisherId }))} value={form.extinguisherId} />
          <FormInput label="Inspector ID" onChange={(inspectorId) => setForm((value) => ({ ...value, inspectorId }))} value={form.inspectorId} />
          <FormInput label="Action date" onChange={(actionDate) => setForm((value) => ({ ...value, actionDate }))} type="datetime-local" value={form.actionDate} />
          <FormInput label="Action taken" onChange={(actionTaken) => setForm((value) => ({ ...value, actionTaken }))} value={form.actionTaken} />
          <FormInput label="Condition noted" onChange={(conditionNoted) => setForm((value) => ({ ...value, conditionNoted }))} value={form.conditionNoted} />
          <div className="pt-8">
            <FormButton className="h-12" type="submit">
              {editing ? "Update" : "Record"}
            </FormButton>
          </div>
        </form>
      </DashboardCard>

      <PaginatedList
        emptyMessage="No maintenance records match your search."
        emptyTitle="No maintenance records found"
        items={filteredRecords}
        renderItem={(record) => (
          <DashboardCard key={record.id}>
            <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
              <div>
                <h2 className="text-xl font-bold text-black">Maintenance #{record.id.slice(0, 8)}</h2>
                <p className="mt-3 text-sm font-medium text-black/45">Extinguisher: {record.extinguisherId}</p>
                <p className="mt-2 text-sm font-medium text-black/45">Inspector: {record.inspectorId}</p>
                <p className="mt-3 text-sm font-bold text-black">{record.actionTaken}</p>
                <p className="mt-2 text-sm font-medium text-black/60">{record.conditionNoted}</p>
                <p className="mt-2 text-sm font-medium text-black/45">{new Date(record.actionDate).toLocaleString()}</p>
              </div>
              <div className="grid min-w-48 gap-3 sm:grid-cols-2">
                <FormButton className="h-11" onClick={() => startEdit(record)} variant="soft">Edit</FormButton>
                <FormButton className="h-11" onClick={() => setSelectedRecord(record)}>Delete</FormButton>
              </div>
            </div>
          </DashboardCard>
        )}
      />

      <ConfirmModal
        confirmText="Delete"
        message="This permanently deletes the maintenance record."
        onCancel={() => setSelectedRecord(null)}
        onConfirm={() => void confirmDelete()}
        open={Boolean(selectedRecord)}
        title="Delete maintenance?"
      />
    </Dashboard>
  );
};

export default Maintenance;

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

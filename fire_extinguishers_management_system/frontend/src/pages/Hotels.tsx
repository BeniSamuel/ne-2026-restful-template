import { FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { extinguisherApi } from "../api/extinguisher.api";
import DashboardCard from "../components/DashboardCard";
import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import PageTitle from "../components/PageTitle";
import PaginatedList from "../components/PaginatedList";
import StatusBadge from "../components/StatusBadge";
import Dashboard from "../layout/dashboard/Dashboard";
import { useExtinguisherStore, type Extinguisher } from "../store/extinguisher.store";
import { useSearchStore } from "../store/search.store";
import { useUserStore } from "../store/user.store";
import { expiryDateIsValid, required } from "../utils/validators";

const emptyExtinguisher: Omit<Extinguisher, "id"> = {
  serialNumber: "",
  location: "",
  type: "DRY_CHEMICAL",
  size: "5_LBS",
  installationDate: "2026-01-01",
  expiryDate: "2028-01-01",
  status: "ACTIVE",
};

const Hotels = () => {
  const extinguishers = useExtinguisherStore((state) => state.extinguishers);
  const currentUser = useUserStore((state) => state.currentUser);
  const query = useSearchStore((state) => state.query.toLowerCase());
  const canManage = currentUser?.role === "ADMIN";
  const [form, setForm] = useState(emptyExtinguisher);
  const [editing, setEditing] = useState<Extinguisher | null>(null);
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    size: "",
    expiryFrom: "",
    expiryTo: "",
    sortBy: "createdAt",
    sortOrder: "DESC",
  });

  useEffect(() => {
    void extinguisherApi.fetchExtinguishers();
  }, []);

  const filteredExtinguishers = useMemo(
    () =>
      extinguishers.filter((item) =>
        `${item.serialNumber} ${item.location} ${item.type} ${item.size} ${item.status}`.toLowerCase().includes(query),
      ),
    [extinguishers, query],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!required(form.serialNumber) || !required(form.location)) {
      toast.error("Serial number and location are required");
      return;
    }
    if (!expiryDateIsValid(form.installationDate, form.expiryDate)) {
      toast.error("Expiry date must be the same as or after installation date");
      return;
    }

    try {
      if (editing) {
        await extinguisherApi.updateExtinguisher(editing.id, form);
        toast.success("Extinguisher updated");
      } else {
        await extinguisherApi.createExtinguisher(form);
        toast.success("Extinguisher created");
      }
      setEditing(null);
      setForm(emptyExtinguisher);
    } catch {
      toast.error("Extinguisher action failed");
    }
  }

  async function applyFilters() {
    if (filters.expiryFrom && filters.expiryTo && new Date(filters.expiryTo) < new Date(filters.expiryFrom)) {
      toast.error("Expiry end date cannot be before start date");
      return;
    }
    await extinguisherApi.fetchExtinguishers({
      ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value)),
      search: query,
    });
  }

  function startEdit(item: Extinguisher) {
    setEditing(item);
    setForm({
      serialNumber: item.serialNumber,
      location: item.location,
      type: item.type,
      size: item.size,
      installationDate: item.installationDate,
      expiryDate: item.expiryDate,
      status: item.status,
    });
  }

  return (
    <Dashboard>
      <PageTitle subtitle="Create, update, search and monitor fire extinguisher records." title="Extinguishers" />

      <DashboardCard className="mb-8">
        <div className="grid gap-5 lg:grid-cols-4">
          <Select label="Status" value={filters.status} options={["", "ACTIVE", "EXPIRED", "UNDER_MAINTENANCE", "DECOMMISSIONED"]} onChange={(status) => setFilters((value) => ({ ...value, status }))} />
          <Select label="Type" value={filters.type} options={["", "WATER", "CARBON_DIOXIDE", "FOAM", "DRY_CHEMICAL"]} onChange={(type) => setFilters((value) => ({ ...value, type }))} />
          <Select label="Size" value={filters.size} options={["", "2.5_LBS", "5_LBS", "9_LBS", "12_LBS"]} onChange={(size) => setFilters((value) => ({ ...value, size }))} />
          <Select label="Sort by" value={filters.sortBy} options={["createdAt", "serialNumber", "location", "type", "size", "installationDate", "expiryDate", "status"]} onChange={(sortBy) => setFilters((value) => ({ ...value, sortBy }))} />
          <FormInput label="Expiry from" onChange={(expiryFrom) => setFilters((value) => ({ ...value, expiryFrom }))} type="date" value={filters.expiryFrom} />
          <FormInput label="Expiry to" onChange={(expiryTo) => setFilters((value) => ({ ...value, expiryTo }))} type="date" value={filters.expiryTo} />
          <Select label="Sort order" value={filters.sortOrder} options={["DESC", "ASC"]} onChange={(sortOrder) => setFilters((value) => ({ ...value, sortOrder }))} />
          <div className="pt-8">
            <FormButton className="h-12" onClick={() => void applyFilters()} type="button" variant="soft">
              Apply filters
            </FormButton>
          </div>
        </div>
      </DashboardCard>

      {canManage ? (
        <DashboardCard className="mb-8">
          <form className="grid gap-5 lg:grid-cols-4" onSubmit={handleSubmit}>
            <FormInput label="Serial number" onChange={(serialNumber) => setForm((value) => ({ ...value, serialNumber }))} value={form.serialNumber} />
            <FormInput label="Location" onChange={(location) => setForm((value) => ({ ...value, location }))} value={form.location} />
            <Select label="Type" value={form.type} options={["WATER", "CARBON_DIOXIDE", "FOAM", "DRY_CHEMICAL"]} onChange={(type) => setForm((value) => ({ ...value, type: type as Extinguisher["type"] }))} />
            <Select label="Size" value={form.size} options={["2.5_LBS", "5_LBS", "9_LBS", "12_LBS"]} onChange={(size) => setForm((value) => ({ ...value, size: size as Extinguisher["size"] }))} />
            <FormInput label="Installation date" onChange={(installationDate) => setForm((value) => ({ ...value, installationDate }))} type="date" value={form.installationDate} />
            <FormInput label="Expiry date" onChange={(expiryDate) => setForm((value) => ({ ...value, expiryDate }))} type="date" value={form.expiryDate} />
            <Select label="Status" value={form.status} options={["ACTIVE", "EXPIRED", "UNDER_MAINTENANCE", "DECOMMISSIONED"]} onChange={(status) => setForm((value) => ({ ...value, status: status as Extinguisher["status"] }))} />
            <div className="pt-8">
              <FormButton className="h-12" type="submit">
                {editing ? "Update" : "Create"}
              </FormButton>
            </div>
          </form>
        </DashboardCard>
      ) : null}

      <PaginatedList
        emptyMessage="No extinguishers match your search."
        emptyTitle="No extinguishers found"
        items={filteredExtinguishers}
        renderItem={(item) => (
          <DashboardCard key={item.id}>
            <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold text-black">{item.serialNumber}</h2>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-3 text-sm font-medium text-black/45">{item.location}</p>
                <p className="mt-2 text-sm font-semibold text-black">{item.type} | {item.size}</p>
                <p className="mt-2 text-sm font-medium text-black/45">
                  Installed {new Date(item.installationDate).toLocaleDateString()} | Expires {new Date(item.expiryDate).toLocaleDateString()}
                </p>
              </div>

              {canManage ? (
                <div className="grid min-w-48 gap-3 sm:grid-cols-2">
                  <FormButton className="h-11" onClick={() => startEdit(item)} variant="soft">
                    Edit
                  </FormButton>
                  <FormButton
                    className="h-11"
                    onClick={async () => {
                      try {
                        await extinguisherApi.deleteExtinguisher(item.id);
                        toast.success("Extinguisher deleted");
                      } catch {
                        toast.error("Delete failed");
                      }
                    }}
                  >
                    Delete
                  </FormButton>
                </div>
              ) : null}
            </div>
          </DashboardCard>
        )}
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

export default Hotels;

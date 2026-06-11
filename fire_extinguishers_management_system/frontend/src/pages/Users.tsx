import { FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { apiClient } from "../api/http";
import DashboardCard from "../components/DashboardCard";
import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import PageTitle from "../components/PageTitle";
import PaginatedList from "../components/PaginatedList";
import StatusBadge from "../components/StatusBadge";
import Dashboard from "../layout/dashboard/Dashboard";
import { useSearchStore } from "../store/search.store";
import type { User } from "../store/user.store";

type ApiResponse<T> = { data: T };

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [inspectorForm, setInspectorForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [invitationResult, setInvitationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const query = useSearchStore((state) => state.query.toLowerCase());

  async function loadUsers() {
    const response = await apiClient.get<ApiResponse<User[]>>("/users");
    setUsers(response.data.data);
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  const filteredUsers = useMemo(
    () => users.filter((user) => `${user.firstName} ${user.lastName} ${user.email} ${user.role}`.toLowerCase().includes(query)),
    [query, users],
  );

  async function createInspector(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.post("/users/create-inspector", inspectorForm);
      setInvitationResult(response.data.data ?? response.data);
      setInspectorForm({ firstName: "", lastName: "", email: "" });
      await loadUsers();
      toast.success("Inspector invitation created");
    } catch {
      toast.error("Failed to create inspector. Email may already exist or your role is unauthorized.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dashboard>
      <PageTitle subtitle="Admin view of registered system users and roles." title="Users" />

      <DashboardCard className="mb-8">
        <form className="grid gap-5 lg:grid-cols-[1fr_1fr_1.2fr_180px]" onSubmit={createInspector}>
          <FormInput label="Inspector first name" onChange={(firstName) => setInspectorForm((value) => ({ ...value, firstName }))} value={inspectorForm.firstName} />
          <FormInput label="Inspector last name" onChange={(lastName) => setInspectorForm((value) => ({ ...value, lastName }))} value={inspectorForm.lastName} />
          <FormInput label="Inspector email" onChange={(email) => setInspectorForm((value) => ({ ...value, email }))} type="email" value={inspectorForm.email} />
          <div className="pt-8">
            <FormButton className="h-12" disabled={loading} type="submit">
              {loading ? "Inviting..." : "Create Inspector"}
            </FormButton>
          </div>
        </form>
        {invitationResult?.setupUrl ? (
          <div className="mt-5 rounded-2xl bg-white p-4">
            <p className="text-sm font-bold text-black">Inspector invitation details</p>
            <div className="mt-3 space-y-2 text-xs font-semibold text-black/55">
              <p>Email: {invitationResult.inspector?.email}</p>
              <p>Temporary password: <span className="text-black">{invitationResult.temporaryPassword}</span></p>
              <p className="break-all">Setup link: {invitationResult.setupUrl}</p>
            </div>
            <p className="mt-2 text-xs font-semibold text-black/45">
              Email sent: {String(invitationResult.emailSent)}. The inspector can log in with the temporary password and change it later.
            </p>
          </div>
        ) : null}
      </DashboardCard>

      <PaginatedList
        className="grid gap-5 md:grid-cols-2"
        emptyMessage="No users match your search."
        emptyTitle="No users found"
        items={filteredUsers}
        renderItem={(user) => (
          <DashboardCard key={user.id}>
            <h2 className="text-xl font-bold text-black">{user.firstName} {user.lastName}</h2>
            <p className="mt-2 text-sm font-medium text-black/45">{user.email}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge status={user.role} />
              {user.accountStatus ? <StatusBadge status={user.accountStatus} /> : null}
            </div>
          </DashboardCard>
        )}
      />
    </Dashboard>
  );
};

export default Users;

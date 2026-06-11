import { useEffect } from "react";
import { extinguisherApi } from "../api/extinguisher.api";
import { inspectionApi } from "../api/inspection.api";
import { maintenanceApi } from "../api/maintenance.api";
import DashboardCard from "../components/DashboardCard";
import PageTitle from "../components/PageTitle";
import Dashboard from "../layout/dashboard/Dashboard";
import { useExtinguisherStore } from "../store/extinguisher.store";
import { useInspectionStore } from "../store/inspection.store";
import { useMaintenanceStore } from "../store/maintenance.store";
import { useUserStore } from "../store/user.store";

const Home = () => {
  const extinguishers = useExtinguisherStore((state) => state.extinguishers);
  const inspections = useInspectionStore((state) => state.inspections);
  const maintenance = useMaintenanceStore((state) => state.records);
  const currentUser = useUserStore((state) => state.currentUser);

  useEffect(() => {
    void extinguisherApi.fetchExtinguishers();
    void inspectionApi.fetchInspections();
    void maintenanceApi.fetchMaintenance();
  }, []);

  const expired = extinguishers.filter((item) => item.status === "EXPIRED" || new Date(item.expiryDate) < new Date()).length;
  const pending = inspections.filter((inspection) => inspection.inspectionStatus === "SCHEDULED").length;

  return (
    <Dashboard>
      <PageTitle
        subtitle="Monitor extinguishers, scheduled inspections, maintenance work and compliance reports."
        title={`${currentUser?.role ?? "User"} Dashboard`}
      />
      <div className="grid gap-6 md:grid-cols-4">
        <DashboardCard>
          <p className="text-sm font-semibold text-black/45">Extinguishers</p>
          <h2 className="mt-4 text-4xl font-bold text-black">{extinguishers.length}</h2>
        </DashboardCard>
        <DashboardCard>
          <p className="text-sm font-semibold text-black/45">Expired</p>
          <h2 className="mt-4 text-4xl font-bold text-black">{expired}</h2>
        </DashboardCard>
        <DashboardCard>
          <p className="text-sm font-semibold text-black/45">Scheduled inspections</p>
          <h2 className="mt-4 text-4xl font-bold text-black">{pending}</h2>
        </DashboardCard>
        <DashboardCard>
          <p className="text-sm font-semibold text-black/45">Maintenance records</p>
          <h2 className="mt-4 text-4xl font-bold text-black">{maintenance.length}</h2>
        </DashboardCard>
      </div>
    </Dashboard>
  );
};

export default Home;

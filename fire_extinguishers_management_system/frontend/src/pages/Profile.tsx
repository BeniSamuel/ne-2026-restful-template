import DashboardCard from "../components/DashboardCard";
import FormButton from "../components/FormButton";
import PageTitle from "../components/PageTitle";
import Dashboard from "../layout/dashboard/Dashboard";
import { useUserStore } from "../store/user.store";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const currentUser = useUserStore((state) => state.currentUser);
  const logout = useUserStore((state) => state.logout);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <Dashboard>
      <PageTitle subtitle="Current account information from the logged-in session." title="Profile" />
      <DashboardCard className="max-w-xl">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-bold text-black">
          {currentUser?.firstName[0]}
          {currentUser?.lastName[0]}
        </div>
        <h2 className="mt-6 text-2xl font-bold text-black">
          {currentUser?.firstName} {currentUser?.lastName}
        </h2>
        <p className="mt-2 text-sm font-medium text-black/45">{currentUser?.email}</p>
        <p className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold text-black/60">{currentUser?.role}</p>
        <div className="mt-8 max-w-48">
          <FormButton className="h-12" onClick={handleLogout}>
            Logout
          </FormButton>
        </div>
      </DashboardCard>
    </Dashboard>
  );
};

export default Profile;

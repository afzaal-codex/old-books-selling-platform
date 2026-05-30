import { Outlet } from "react-router-dom";

import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="flex">
        {/* =========================
            SIDEBAR
        ========================= */}
        <DashboardSidebar />

        {/* =========================
            DASHBOARD CONTENT
        ========================= */}
        <div className="flex min-h-screen flex-1 flex-col">
          {/* HEADER */}
          <DashboardHeader />

          {/* PAGE CONTENT */}
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm md:p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#f0ede8] admin-layout">
      <div className="flex">
        {/* =========================
            ADMIN SIDEBAR
        ========================= */}
        <AdminSidebar />

        {/* =========================
            ADMIN MAIN CONTENT
        ========================= */}
        <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden">
          {/* HEADER */}
          <AdminHeader />

          {/* CONTENT */}
          <main className="flex-1 p-4 md:p-5 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
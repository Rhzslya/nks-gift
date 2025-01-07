import Sidebar from "@/components/Fragments/Sidebar/Admin";
import React from "react";
import { listSidebarItem } from "@/utils/ListSidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex relative">
      <Sidebar lists={listSidebarItem} />

      <main className="flex-1">{children}</main>
    </div>
  );
};

export default AdminLayout;

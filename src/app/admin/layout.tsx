import Sidebar from "@/components/fragements/Sidebar";
import React from "react";
import { listSidebarItem } from "@/utils/ListSidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar lists={listSidebarItem} />
      {children}
    </div>
  );
};

export default AdminLayout;

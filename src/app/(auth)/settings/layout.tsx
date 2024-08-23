"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOption";
import Sidebar from "@/components/fragements/Sidebar/Settings";
import Header from "@/components/Settings/Header";
import { getServerSession } from "next-auth";
import React from "react";
import { listSidebarSettingsItem } from "@/utils/ListSidebar";
const SettingsLayout = async ({ children }: { children: React.ReactNode }) => {
  const serverSession = await getServerSession(authOptions);

  return (
    <section className="px-3 bg-gray-100">
      <div className="max-w-[1200px] mx-auto flex flex-col shadow-md h-screen bg-white">
        <Header serverSession={serverSession} />
        <div className="flex">
          <Sidebar lists={listSidebarSettingsItem} />
          {children}
        </div>
      </div>
    </section>
  );
};

export default SettingsLayout;

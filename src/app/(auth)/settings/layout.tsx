"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOption";
import Sidebar from "@/components/Fragments/Sidebar/Settings";
import Header from "@/components/Settings/Header";
import { getServerSession } from "next-auth";
import React from "react";
import { listSidebarSettingsItem } from "@/utils/ListSidebar";
const SettingsLayout = async ({ children }: { children: React.ReactNode }) => {
  const serverSession = await getServerSession(authOptions);

  return (
    <section className="px-3 max-w-[1400px] flex flex-col m-auto">
      <Header serverSession={serverSession} />
      <div className="flex">
        <Sidebar lists={listSidebarSettingsItem} />
        {children}
      </div>
    </section>
  );
};

export default SettingsLayout;

// src/components/ServerWrapper.tsx
import React, { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOption";

interface ServerWrapperProps {
  children: ReactNode;
}

export default async function ServerWrapper({ children }: ServerWrapperProps) {
  const serverSession = await getServerSession(authOptions);

  return (
    <div>
      {React.cloneElement(children as React.ReactElement, {
        serverSession,
      })}
    </div>
  );
}

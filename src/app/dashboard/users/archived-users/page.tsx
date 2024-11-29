"use client";

import React, { useState, useEffect } from "react";
import ArchivedUsersViews from "@/views/Admin/Users/ArchivedUsers";
import { useSession } from "next-auth/react";
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const { data: session } = useSession();
  const userInSession = session?.user;
  const currentUserRole = userInSession?.role;
  const accessToken = session?.accessToken;
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (accessToken) {
      const getAllArchivedUsers = async () => {
        try {
          const response = await fetch(`/api/users/get-archived-users`, {
            next: { revalidate: 1 },
            headers: {
              "Cache-Control": "no-cache",
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            method: "GET",
          });

          const data = await response.json();
          console.log(data);
          if (response.ok) {
            setUsers(data.data);
            setLoading(false);
          } else {
            setMessage(data.message);
          }
        } catch (error) {
          console.error("Failed to fetch users:", error);
        } finally {
          setLoading(false);
        }
      };
      getAllArchivedUsers();
    }
  }, [setLoading, accessToken]);

  return (
    <ArchivedUsersViews
      users={users}
      isLoading={isLoading}
      userInSession={userInSession}
      currentUserRole={currentUserRole}
      accessToken={accessToken}
      message={message}
    />
  );
};

export default UserManagement;

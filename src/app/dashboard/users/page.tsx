"use client";

import React, { useState, useEffect } from "react";
import UsersManagementViews from "@/views/Admin/Users";
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
      const getAllUsers = async () => {
        try {
          const response = await fetch(`/api/users/get-users`, {
            next: { revalidate: 1 },
            headers: {
              "Cache-Control": "no-cache",
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            method: "GET",
          });

          const data = await response.json();
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
      getAllUsers();
    }
  }, [setLoading, accessToken]);

  return (
    <UsersManagementViews
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

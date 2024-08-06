"use client";

import React, { useState, useEffect } from "react";
import UsersManagementViews from "@/views/Admin/Users";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/users?timestamp=${new Date().getTime()}`,
          {
            next: { revalidate: 1 },
            headers: {
              "Cache-Control": "no-cache",
              "Content-Type": "application/json",
            },
            method: "GET",
          }
        );
        const data = await response.json();
        setUsers(data.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllUsers();
  }, [setLoading]);

  return <UsersManagementViews users={users} loading={loading} />;
};

export default UserManagement;

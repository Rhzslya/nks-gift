"use client";

import UsersManagementViews from "@/views/Admin/Users";
import React, { useState, useEffect } from "react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/users?timestamp=${new Date().getTime()}`,
          {
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
  }, []);

  return <UsersManagementViews users={users} loading={loading} />;
};

export default UserManagement;

import React, { useState } from "react";
import { tableHeaders } from "@/utils/TableHeaders";
import { capitalizeFirst } from "@/utils/Capitalize";

interface Users {
  username: string;
  email: string;
  type: any;
  isAdmin: boolean;
  isVerified: boolean;
  createdAt: string;
  userId: number;
  profileImage?: string;
}

interface UsersManagementViewsProps {
  users: Users[];
}

const UsersManagementViews: React.FC<UsersManagementViewsProps> = ({
  users,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(users);

  return (
    <div className="w-full">
      <header className="border-b-[1px] border-gray-300 px-6 bg-white -z-10">
        <nav className="flex items-center justify-between text-base text-neutral-700 font-semi-bold h-28">
          <div className="flex">
            <h1 className="font-semibold">User Management</h1>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <i className="bx bx-search"></i>
            </span>
            <input
              type="text"
              placeholder="Search Users"
              className="px-2 py-1 border rounded text-sm pl-10 focus:border-sky-300 focus:outline-none"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </nav>
      </header>
      <div className="p-6">
        <div className="bg-gray-100 p-2 rounded-md">
          <table className="w-full border-collapse">
            <thead className="bg-white">
              <tr>
                {tableHeaders.map((header) => (
                  <th
                    key={header.key}
                    scope="col"
                    className={`px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      header.key === "username"
                        ? "border-r-8 border-gray-100"
                        : ""
                    }`}
                  >
                    {header.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredUsers.length > 0 &&
                filteredUsers.map((user) => (
                  <tr key={user.userId}>
                    <td className="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider border-r-8 border-gray-100">
                      {user.username}
                    </td>
                    <td className="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider ">
                      {user.email}
                    </td>
                    <td className="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider ">
                      {user.userId}
                    </td>
                    <td className="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider ">
                      {capitalizeFirst(user.type.join(", "))}
                    </td>
                    <td className="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider ">
                      {user.isAdmin ? "Admin" : "User"}
                    </td>
                    <td className="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider ">
                      {user.isVerified ? "Verified" : "Not Verified"}
                    </td>
                    <td className="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider ">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersManagementViews;

import React, { useState, useMemo } from "react";
import { tableHeaders } from "@/utils/TableHeaders";
import { capitalizeFirst } from "@/utils/Capitalize";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import MyPagination from "@/utils/Pagination";
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
  loading: boolean;
}

const UsersManagementViews: React.FC<UsersManagementViewsProps> = ({
  users,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;
  const totalPages = Math.ceil(users.length / usersPerPage);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");
  const [sortBy, setSortBy] = useState<
    "username" | "createdAt" | "accessLevel" | ""
  >("");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Search Users
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Sort User
  const handleSortChange = (
    order: "asc" | "desc",
    sortBy: "username" | "createdAt" | "accessLevel"
  ) => {
    setSortOrder(order);
    setSortBy(sortBy);
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === "username") {
      if (sortOrder === "asc") {
        return a.username.localeCompare(b.username);
      } else if (sortOrder === "desc") {
        return b.username.localeCompare(a.username);
      }
    } else if (sortBy === "createdAt") {
      if (sortOrder === "asc") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else if (sortOrder === "desc") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    } else if (sortBy === "accessLevel") {
      if (sortOrder === "asc") {
        return a.isAdmin === b.isAdmin ? 0 : a.isAdmin ? -1 : 1;
      } else if (sortOrder === "desc") {
        return a.isAdmin === b.isAdmin ? 0 : a.isAdmin ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredUsers = sortedUsers.filter((user) =>
    user.username.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const isActive = (
    order: "asc" | "desc",
    field: "username" | "createdAt" | "accessLevel"
  ) => sortBy === field && sortOrder === order;

  return (
    <div className="w-full">
      <header className="border-b-[1px] border-gray-300 px-6 bg-white -z-10">
        <nav className="flex items-center justify-between text-base text-neutral-700 font-semi-bold h-28">
          <div className="flex">
            <h1 className="font-semibold">User Management</h1>
            <div className="flex gap-2 justify-center items-center"></div>
          </div>
        </nav>
      </header>
      <div className="p-6">
        <div className="bg-gray-100 p-2 rounded-md ">
          <div className="relative py-2 flex items-center">
            <div className="pr-10 border-r-2 border-gray-300">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <i className="bx bx-search text-[20px] text-gray-600"></i>
              </span>
              <input
                type="text"
                placeholder="Search Users"
                className="px-2 py-1 border rounded text-sm pl-10 focus:border-sky-300 focus:outline-none"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="relative pl-10">
              <button onClick={handleToggleDropdown}>
                <i
                  className={`bx bx-filter text-[28px] text-gray-600 cursor-pointer rounded-md hover:bg-gray-300 duration-300 ${
                    isDropdownOpen && "bg-gray-300"
                  }`}
                ></i>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                  <button
                    className={`block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left ${
                      isActive("asc", "username") && "bg-gray-300"
                    }`}
                    onClick={() => handleSortChange("asc", "username")}
                  >
                    Sort by Username (A-Z)
                  </button>
                  <button
                    className={`block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left ${
                      isActive("desc", "username") && "bg-gray-300"
                    }`}
                    onClick={() => handleSortChange("desc", "username")}
                  >
                    Sort by Username (Z-A)
                  </button>
                  <button
                    className={`block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left ${
                      isActive("asc", "createdAt") && "bg-gray-300"
                    }`}
                    onClick={() => handleSortChange("asc", "createdAt")}
                  >
                    Sort by Created Date (Oldest First)
                  </button>
                  <button
                    className={`block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left ${
                      isActive("desc", "createdAt") && "bg-gray-300"
                    }`}
                    onClick={() => handleSortChange("desc", "createdAt")}
                  >
                    Sort by Created Date (Newest First)
                  </button>
                  <button
                    className={`block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left ${
                      isActive("asc", "accessLevel") && "bg-gray-300"
                    }`}
                    onClick={() => handleSortChange("asc", "accessLevel")}
                  >
                    Sort by Access Level (Admin First)
                  </button>
                  <button
                    className={`block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left ${
                      isActive("desc", "accessLevel") && "bg-gray-300"
                    }`}
                    onClick={() => handleSortChange("desc", "accessLevel")}
                  >
                    Sort by Access Level (User First)
                  </button>
                </div>
              )}
            </div>
          </div>
          <table className="w-full border-collapse ">
            <thead className="bg-white border-b-2 border-gray-100">
              <tr>
                {tableHeaders.map((header) => (
                  <th
                    key={header.key}
                    scope="col"
                    className={`px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider ${
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
              {loading
                ? Array(15)
                    .fill(null)
                    .map((_, index) => (
                      <tr key={index}>
                        {tableHeaders.map((header) => (
                          <td key={header.key} className="">
                            <Skeleton className="py-[11px]" />
                          </td>
                        ))}
                      </tr>
                    ))
                : paginatedUsers.length > 0 &&
                  paginatedUsers.map((user) => (
                    <tr key={user.userId}>
                      <td className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider border-r-8 border-gray-100">
                        {capitalizeFirst(user.username)}
                      </td>
                      <td className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider ">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider ">
                        {user.userId}
                      </td>
                      <td className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider ">
                        {capitalizeFirst(user.type.join(", "))}
                      </td>
                      <td className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider ">
                        {user.isAdmin ? "Admin" : "User"}
                      </td>
                      <td className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider ">
                        {user.isVerified ? "Verified" : "Not Verified"}
                      </td>
                      <td className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider ">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        <div className="py-2">
          <MyPagination
            currentPage={currentPage}
            pageNumbers={Array.from({ length: totalPages }, (_, i) => i + 1)}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default UsersManagementViews;

import React, {
  useState,
  useMemo,
  ReactEventHandler,
  useRef,
  useEffect,
  MouseEventHandler,
} from "react";
import { tableHeaders } from "@/utils/TableHeaders";
import { capitalizeFirst } from "@/utils/Capitalize";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import MyPagination from "@/utils/Pagination";
import Modal from "@/components/fragements/Modal";
import { useSession } from "next-auth/react";
import ModalUpdatedUser from "@/components/ModalUpdatedUser";
interface Users {
  username: string;
  email: string;
  type: any;
  role: string;
  isVerified: boolean;
  createdAt: string;
  _id: string;
  profileImage?: string;
}

interface UsersManagementViewsProps {
  users: Users[];
  loading: boolean;
}

type Role = "user" | "manager" | "admin" | "super_admin";
type RoleOrder = {
  [key in Role]: number;
};

const UsersManagementViews: React.FC<UsersManagementViewsProps> = ({
  users,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(15);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");
  const [sortBy, setSortBy] = useState<
    "username" | "createdAt" | "accessLevel" | ""
  >("");
  const [modalEditUser, setModalEditUser] = useState<string | null>(null);
  // Find the user by _id
  const editedUser = users.find((user) => user._id === modalEditUser);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const { data: session } = useSession();
  const userInSession = session?.user;
  const currentUserRole = userInSession?.role;

  const buttonDotRef = useRef();
  const menuSettingRef = useRef<HTMLDivElement | null>(null);
  // Open or close User Settings based on click
  const handleSettingToggle = (_id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveUserId((prev) => (prev === _id ? null : _id));
  };

  const handleGlobalClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const isMenuClick = menuSettingRef.current?.contains(event.target as Node);

    if (!isMenuClick && activeUserId !== null) {
      setActiveUserId(null);
    }
  };

  // open Filter
  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // open Modal Edit User
  const handleModalEditUser = (_id: string) => {
    setActiveUserId(null);
    setModalEditUser(modalEditUser === _id ? null : _id);
  };

  const handleCloseModal = () => {
    setModalEditUser(null);
  };

  // Search Users
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Sort User
  const handleSortChange = (
    order: "asc" | "desc",
    sortBy: "username" | "createdAt" | "accessLevel"
  ) => {
    setSortOrder(order);
    setSortBy(sortBy);
  };

  const handleUsersPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const roleOrder: RoleOrder = {
    user: 3,
    manager: 2,
    admin: 1,
    super_admin: 0,
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
        return roleOrder[a.role as Role] - roleOrder[b.role as Role];
      } else if (sortOrder === "desc") {
        return roleOrder[b.role as Role] - roleOrder[a.role as Role];
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

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div onClick={(e) => handleGlobalClick(e)} className="w-full">
      <header className="border-b-[1px] border-gray-300 px-6 bg-white -z-10">
        <nav className="flex items-center justify-between text-base text-gray-500 font-semi-bold h-28">
          <div className="flex">
            <h1 className="font-semibold">User Management</h1>
            <div className="flex gap-2 justify-center items-center"></div>
          </div>
        </nav>
      </header>
      <div className="p-6">
        <div className="bg-gray-100 p-2 rounded-md ">
          <div className="relative py-2 flex items-center">
            <div className="relative pr-10 border-r-2 border-gray-300">
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
                    className={`block px-4 py-2 text-xs text-gray-500 hover:bg-gray-100 w-full text-left ${
                      isActive("asc", "username") && "bg-gray-300 text-gray-700"
                    }`}
                    onClick={() => handleSortChange("asc", "username")}
                  >
                    Sort by Username (A-Z)
                  </button>
                  <button
                    className={`block px-4 py-2 text-xs text-gray-500 hover:bg-gray-100 w-full text-left ${
                      isActive("desc", "username") &&
                      "bg-gray-300 text-gray-700"
                    }`}
                    onClick={() => handleSortChange("desc", "username")}
                  >
                    Sort by Username (Z-A)
                  </button>
                  <button
                    className={`block px-4 py-2 text-xs text-gray-500 hover:bg-gray-100 w-full text-left ${
                      isActive("asc", "createdAt") &&
                      "bg-gray-300 text-gray-700"
                    }`}
                    onClick={() => handleSortChange("asc", "createdAt")}
                  >
                    Sort by Created Date (Oldest First)
                  </button>
                  <button
                    className={`block px-4 py-2 text-xs text-gray-500 hover:bg-gray-100 w-full text-left ${
                      isActive("desc", "createdAt") &&
                      "bg-gray-300 text-gray-700"
                    }`}
                    onClick={() => handleSortChange("desc", "createdAt")}
                  >
                    Sort by Created Date (Newest First)
                  </button>
                  <button
                    className={`block px-4 py-2 text-xs text-gray-500 hover:bg-gray-100 w-full text-left ${
                      isActive("asc", "accessLevel") &&
                      "bg-gray-300 text-gray-700"
                    }`}
                    onClick={() => handleSortChange("asc", "accessLevel")}
                  >
                    Sort by Access Level (Higher First)
                  </button>
                  <button
                    className={`block px-4 py-2 text-xs text-gray-500 hover:bg-gray-100 w-full text-left ${
                      isActive("desc", "accessLevel") &&
                      "bg-gray-300 text-gray-700"
                    }`}
                    onClick={() => handleSortChange("desc", "accessLevel")}
                  >
                    Sort by Access Level (Lower First)
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
                    <tr key={user._id}>
                      <td className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider border-r-8 border-gray-100">
                        {capitalizeFirst(user.username)}
                      </td>
                      <td className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider ">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider ">
                        {user._id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider ">
                        {capitalizeFirst(user.role)}
                      </td>
                      <td
                        className={`px-4 py-3 text-left text-xs font-medium tracking-wider ${
                          user.isVerified ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {user.isVerified ? "Verified" : "Not Verified"}
                      </td>
                      <td className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider ">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-left text-[20px] font-medium text-gray-500 tracking-wider ">
                        <div className="relative z-50 " ref={menuSettingRef}>
                          <button
                            onClick={(e) => {
                              handleSettingToggle(user._id, e);
                            }}
                          >
                            <i className="relative bx bx-dots-vertical-rounded "></i>
                          </button>
                          {activeUserId === user._id && (
                            <div className="absolute right-full top-0 bg-white rounded-md shadow flex flex-col">
                              <button
                                className="px-1 hover:bg-gray-100 duration-300"
                                onClick={() => handleModalEditUser(user._id)}
                              >
                                <div className="flex gap-x-2 w-[120px] py-2">
                                  <i className="bx bxs-pencil text-[16px]"></i>
                                  <p className="text-xs">Edit</p>
                                </div>
                              </button>
                              <button
                                className="px-1 hover:bg-gray-100 duration-300"
                                onClick={() => alert("Delete User")}
                              >
                                <div className="flex gap-x-2 w-[120px] py-2">
                                  <i className="bx bxs-trash text-[16px]"></i>
                                  <p className="text-xs text-red-500">Delete</p>
                                </div>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        <div className="py-2 px-2 flex justify-between items-center">
          <div className="pr-10 text-xs text-gray-500">
            <p>
              Rows per page
              <select
                value={usersPerPage}
                onChange={(e) => {
                  handleUsersPerPage(e);
                }}
                className="ml-2 border rounded text-xs"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>{" "}
              of {users.length} items
            </p>
          </div>
          <MyPagination
            currentPage={currentPage}
            pageNumbers={Array.from({ length: totalPages }, (_, i) => i + 1)}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      {modalEditUser !== null && editedUser ? (
        <ModalUpdatedUser
          roleOrder={roleOrder}
          editedUser={editedUser}
          handleCloseModal={handleCloseModal}
          currentUserRole={currentUserRole} // Pass current user role here
        />
      ) : null}
    </div>
  );
};

export default UsersManagementViews;

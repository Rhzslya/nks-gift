import React, { useState, useRef, useEffect } from "react";
import { tableHeaders } from "@/utils/TableHeaders";
import { capitalizeFirst } from "@/utils/Capitalize";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import MyPagination from "@/utils/Pagination";
import { signIn, signOut, useSession } from "next-auth/react";
import ModalUpdatedUser from "@/components/ModalUpdatedUser";
import Image from "next/image";
import UserDropDown from "@/components/UserDropDown";
import AuthButton from "@/components/Button/AuthButton";
import ModalDeleteUser from "@/components/ModalDeleteUser";
interface Users {
  username: string;
  email: string;
  type: any;
  role: string;
  isVerified: boolean;
  createdAt: string;
  _id: string;
  profileImage?: string;
  userId?: number;
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
  const [modalDeleteUser, setModalDeleteUser] = useState<string | null>(null);
  // Find the user by _id

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const { data: session, update } = useSession();
  const userInSession = session?.user;
  const currentUserRole = userInSession?.role;
  const [usersData, setUsersData] = useState<Users[]>([]);
  const isUpdatedUser = usersData.find((user) => user._id === modalEditUser);
  const isDeletedUser = usersData.find((user) => user._id === modalDeleteUser);
  const [clickedButtonId, setClickedButtonId] = useState<string | null>(null);
  useEffect(() => {
    setUsersData(users);
  }, [users]);

  const menuSettingRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const settingButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const filterButtonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownButtonRef = useRef<HTMLDivElement | null>(null);
  // Open & Close Menu Setting Start
  useEffect(() => {
    const handleCloseSettingOutside = (e: MouseEvent) => {
      if (activeUserId) {
        const menuSettingRef = menuSettingRefs.current[activeUserId];
        const settingButtonRef = settingButtonRefs.current[activeUserId];

        if (
          menuSettingRef &&
          !menuSettingRef.contains(e.target as Node) &&
          settingButtonRef &&
          !settingButtonRef.contains(e.target as Node)
        ) {
          setActiveUserId(null);
        }
      }
    };

    document.addEventListener("mousedown", handleCloseSettingOutside);

    return () => {
      document.removeEventListener("mousedown", handleCloseSettingOutside);
    };
  }, [activeUserId]);

  const handleSettingToggle = (_id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setClickedButtonId(_id);
    setActiveUserId((prev) => (prev === _id ? null : _id));

    setTimeout(() => {
      setClickedButtonId(null);
    }, 200);
  };

  console.log(usersData);
  // Open & Close Menu Setting End

  // Open & Close Filter Start
  useEffect(() => {
    const handleCloseFilterOutside = (e: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(e.target as Node) &&
        !filterButtonRef.current?.contains(e.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleCloseFilterOutside);

    return () => {
      document.removeEventListener("mousedown", handleCloseFilterOutside);
    };
  }, [filterRef, isFilterOpen]);

  const handleToggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  // Open & Close Filter End

  // Open & Close Dropdown Start
  useEffect(() => {
    const handleCloseDropdownOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !dropdownButtonRef.current?.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleCloseDropdownOutside);

    return () => {
      document.removeEventListener("mousedown", handleCloseDropdownOutside);
    };
  }, [dropdownRef, isDropdownOpen]);

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  // Open & Close Dropdown End

  // open Modal Edit User
  const handleModalEditUser = (_id: string) => {
    setActiveUserId(null);
    setModalEditUser(modalEditUser === _id ? null : _id);
  };

  // open Modal Delete User
  const handleModalDeleteUser = (_id: string) => {
    setActiveUserId(null);
    setModalDeleteUser(modalDeleteUser === _id ? null : _id);
  };

  console.log(modalDeleteUser);
  console.log(isUpdatedUser);
  const handleCloseModal = () => {
    setModalEditUser(null);
    setModalDeleteUser(null);
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

  const sortedUsers = [...usersData].sort((a, b) => {
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
    <div className="w-full">
      <header className="border-b-[1px] border-gray-300 px-6 bg-white -z-10">
        <nav className="flex items-center justify-between text-base text-gray-500 font-semi-bold h-28">
          <div className="flex">
            <h1 className="font-semibold">User Management</h1>
          </div>
          <div
            ref={dropdownButtonRef}
            className="flex pr-4 gap-2 justify-center items-center"
          >
            {userInSession && (
              <UserDropDown
                user={{
                  username: userInSession.username!,
                  email: userInSession.email!,
                  profileImage: userInSession.profileImage!,
                }}
                handleToggleDropdown={handleToggleDropdown}
                isDropdownOpen={isDropdownOpen}
                isLoading={isLoading}
                signOut={signOut}
                ref={dropdownRef}
              />
            )}
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
              <button onClick={handleToggleFilter} ref={filterButtonRef}>
                <i
                  className={`bx bx-filter text-[28px] text-gray-500 cursor-pointer rounded-md hover:bg-gray-200 duration-300 ${
                    isFilterOpen && "bg-gray-200"
                  }`}
                ></i>
              </button>

              {isFilterOpen && (
                <div
                  ref={filterRef}
                  className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50"
                >
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

            <tbody className={`bg-white`}>
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
                    <tr
                      key={user._id}
                      className={`text-gray-500 ${
                        user._id === userInSession?.id ? "bg-green-200" : ""
                      }`}
                    >
                      <td
                        className={`px-4 py-3 text-left text-xs font-medium  tracking-wider border-r-8 border-gray-100 `}
                      >
                        {capitalizeFirst(user.username)}
                      </td>
                      <td className="px-4 py-3 text-left text-xs font-medium  tracking-wider ">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-left text-xs font-medium  tracking-wider ">
                        {user.userId}
                      </td>
                      <td className="px-4 py-3 text-left text-xs font-medium  tracking-wider ">
                        {capitalizeFirst(user.role)}
                      </td>
                      <td
                        className={`px-4 py-3 text-left text-xs font-medium tracking-wider ${
                          user.isVerified ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {user.isVerified ? "Verified" : "Not Verified"}
                      </td>
                      <td className="px-4 py-3 text-left text-xs font-medium  tracking-wider ">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-left text-[20px] font-medium  tracking-wider ">
                        <div className="relative z-50 ">
                          <button
                            className={`${
                              clickedButtonId === user._id
                                ? "bg-gray-200 border-gray-500 border-[1px] "
                                : ""
                            } w-[25px] h-[25px]  flex justify-center items-center rounded-full duration-300`}
                            ref={(el) => {
                              settingButtonRefs.current[user._id] = el;
                            }}
                            onClick={(e) => {
                              handleSettingToggle(user._id, e);
                            }}
                          >
                            <i className="relative bx bx-dots-vertical-rounded  "></i>
                          </button>
                          {activeUserId === user._id && (
                            <div
                              ref={(el) => {
                                menuSettingRefs.current[user._id] = el;
                              }}
                              className="absolute right-[110%] top-0 bg-white rounded-md shadow flex flex-col"
                            >
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
                                onClick={() => handleModalDeleteUser(user._id)}
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
      {modalEditUser !== null && isUpdatedUser ? (
        <ModalUpdatedUser
          setUsersData={setUsersData}
          roleOrder={roleOrder}
          isUpdatedUser={isUpdatedUser}
          handleCloseModal={handleCloseModal}
          currentUserRole={currentUserRole}
          update={update}
          userInSession={userInSession} // Pass current user role here
        />
      ) : null}
      {modalDeleteUser !== null && isDeletedUser ? (
        <ModalDeleteUser
          handleCloseModal={handleCloseModal}
          isDeletedUser={isDeletedUser}
          setUsersData={setUsersData}
          userInSession={userInSession}
          setModalDeleteUser={setModalDeleteUser}
        />
      ) : null}
    </div>
  );
};

export default UsersManagementViews;

"use client";

import React, { useEffect, useRef, useState } from "react";
import UserDropDown from "@/components/UserDropDown";
import { tableArchivedUser } from "@/utils/TableHeaders";
import { signIn, signOut, useSession } from "next-auth/react";
import Header from "@/components/Admin/Header";
import UtilityBar from "@/components/Admin/UtilityBar";
import Table from "@/components/Admin/Table";
import PaginationToolbar from "@/components/Admin/PaginationToolbar";
import ModalDeletePermanently from "@/components/Admin/ModalDeletePermanently";
import ModalRestoreUser from "@/components/Admin/ModalRestoreUser";

interface ArchivedUsers {
  username: string;
  email: string;
  type: any;
  role: string;
  isVerified: boolean;
  createdAt: string;
  archivedAt: string;
  _id: string;
  profileImage?: string;
  userId?: number;
}

interface ArchivedUsersViewsProps {
  users: ArchivedUsers[];
  isLoading: boolean;
  userInSession: any;
  currentUserRole: any;
  accessToken: any;
  message: string;
}

type Role = "user" | "manager" | "admin" | "super_admin";
type RoleOrder = {
  [key in Role]: number;
};

const ArchivedUsersViews: React.FC<ArchivedUsersViewsProps> = ({
  users,
  isLoading,
  userInSession,
  currentUserRole,
  accessToken,
  message,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(15);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");
  const [sortBy, setSortBy] = useState<
    "username" | "createdAt" | "accessLevel" | ""
  >("");
  const [modalRestoreUser, setModalRestoreUser] = useState<string | null>(null);
  const [modalDeletePermanentlyUser, setModalDeletePermanentlyUser] = useState<
    string | null
  >(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const { data: session, update } = useSession();
  const [usersData, setUsersData] = useState<ArchivedUsers[]>([]);
  const isDeletedPermanentlyUser = usersData?.find(
    (user) => user._id === modalDeletePermanentlyUser
  );
  const isRestoredUser = usersData?.find(
    (user) => user._id === modalRestoreUser
  );

  const [clickedButtonId, setClickedButtonId] = useState<string | null>(null);
  const menuSettingRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const settingButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>(
    {}
  );
  const filterRef = useRef<HTMLDivElement | null>(null);
  const filterButtonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownButtonRef = useRef<HTMLDivElement | null>(null);

  // Always Update Data
  useEffect(() => {
    setUsersData(users);
  }, [users]);

  console.log(usersData);
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

  // open Modal Restore User

  const handleModalRestoreUser = (_id: string) => {
    setActiveUserId(null);
    setModalRestoreUser(modalRestoreUser === _id ? null : _id);
  };

  // open Modal Delete Permanently User
  const handleModalDeletePermanently = (_id: string) => {
    setActiveUserId(null);
    setModalDeletePermanentlyUser(
      modalDeletePermanentlyUser === _id ? null : _id
    );
  };

  // Close Modal
  const handleCloseModal = () => {
    setModalRestoreUser(null);
    setModalDeletePermanentlyUser(null);
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

  const sortedUsers = Array.isArray(usersData)
    ? [...usersData].sort((a, b) => {
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
      })
    : [];

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
    <div className="w-full relative">
      <Header
        dropdownButtonRef={dropdownButtonRef}
        userInSession={
          userInSession as {
            username: string;
            email: string;
            profileImage: string;
          }
        }
        handleToggleDropdown={handleToggleDropdown}
        isDropdownOpen={isDropdownOpen}
        isLoading={isLoading}
        dropdownRef={dropdownRef}
        title="Archived User"
      />

      <div className="p-6">
        <div className="bg-gray-100 p-2 rounded-md">
          <UtilityBar
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
            handleToggleFilter={handleToggleFilter}
            filterButtonRef={filterButtonRef}
            isFilterOpen={isFilterOpen}
            filterRef={filterRef}
            isActive={isActive}
            handleSortChange={handleSortChange}
          />
          <Table
            tableHeaders={tableArchivedUser}
            isLoading={isLoading}
            paginatedUsers={paginatedUsers}
            userInSession={userInSession}
            clickedButtonId={clickedButtonId}
            settingButtonRefs={settingButtonRefs}
            handleSettingToggle={handleSettingToggle}
            activeUserId={activeUserId}
            menuSettingRefs={menuSettingRefs}
            handleModalRestoreUser={handleModalRestoreUser}
            handleModalDeletePermanently={handleModalDeletePermanently}
            variant="orange"
          />
          <PaginationToolbar
            usersPerPage={usersPerPage}
            handleUsersPerPage={handleUsersPerPage}
            users={users}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
      {modalDeletePermanentlyUser !== null && isDeletedPermanentlyUser ? (
        <ModalDeletePermanently
          handleCloseModal={handleCloseModal}
          isDeletedPermanentlyUser={isDeletedPermanentlyUser}
          setUsersData={setUsersData}
          userInSession={userInSession}
          setModalDeletePermanentlyUser={setModalDeletePermanentlyUser}
          accessToken={accessToken}
        />
      ) : null}
      {modalRestoreUser !== null && isRestoredUser ? (
        <ModalRestoreUser
          handleCloseModal={handleCloseModal}
          isRestoredUser={isRestoredUser}
          setUsersData={setUsersData}
          userInSession={userInSession}
          setModalRestoreUser={setModalRestoreUser}
          accessToken={accessToken}
        />
      ) : null}
    </div>
  );
};

export default ArchivedUsersViews;

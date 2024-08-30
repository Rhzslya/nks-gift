import React, { useState, useRef, useEffect } from "react";
import { tableHeaders } from "@/utils/TableHeaders";
import "react-loading-skeleton/dist/skeleton.css";
import { useSession } from "next-auth/react";
import ModalUpdatedUser from "@/components/Admin/ModalUpdatedUser";
import ModalArchivedUser from "@/components/Admin/ModalArchivedUser";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/Admin/Header";
import Table from "@/components/Admin/Table";
import UtilityBar from "@/components/Admin/UtilityBar";
import PaginationToolbar from "@/components/Admin/PaginationToolbar";
import { userSortOptions } from "@/utils/SortOptions";

interface Users {
  username: string;
  email: string;
  type: any;
  role: string;
  isVerified: boolean;
  createdAt: string;
  _id: string;
  profileImage: string;
  userId?: number;
  numberPhone: string;
  address: {
    street: string;
    state: string;
    city: string;
    country: string;
    postalCode: string;
  };
}

interface UsersManagementViewsProps {
  users: Users[];
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

const UsersManagementViews: React.FC<UsersManagementViewsProps> = ({
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
  const [modalEditUser, setModalEditUser] = useState<string | null>(null);
  const [modalArchivedUser, setModalArchivedUser] = useState<string | null>(
    null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const { data: session, update } = useSession();
  const [usersData, setUsersData] = useState<Users[]>([]);
  const isUpdatedUser = usersData?.find((user) => user._id === modalEditUser);
  const isArchivedUser = usersData?.find(
    (user) => user._id === modalArchivedUser
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

  // open Modal Edit User
  const handleModalEditUser = (_id: string) => {
    setActiveUserId(null);
    setModalEditUser(modalEditUser === _id ? null : _id);
  };

  // open Modal Delete User
  const handleModalArchivedUser = (_id: string) => {
    setActiveUserId(null);
    setModalArchivedUser(modalArchivedUser === _id ? null : _id);
  };

  const handleCloseModal = () => {
    setModalEditUser(null);
    setModalArchivedUser(null);
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

  // Toast Notify
  useEffect(() => {
    if (message) {
      toast.error(message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  }, [message]);

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
        title="User Management"
      />

      <div className="p-6 ">
        <div className="bg-gray-100 p-2 rounded-md ">
          <UtilityBar
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
            handleToggleFilter={handleToggleFilter}
            filterButtonRef={filterButtonRef}
            isFilterOpen={isFilterOpen}
            filterRef={filterRef}
            isActive={isActive}
            sortOptions={userSortOptions}
            handleSortChange={handleSortChange}
            placeholder="User Search"
          />
          <Table
            tableHeaders={tableHeaders}
            isLoading={isLoading}
            paginatedContent={paginatedUsers}
            userInSession={userInSession}
            clickedButtonId={clickedButtonId}
            settingButtonRefs={settingButtonRefs}
            handleSettingToggle={handleSettingToggle}
            activeUserId={activeUserId}
            menuSettingRefs={menuSettingRefs}
            handleModalEditUser={handleModalEditUser}
            handleModalArchivedUser={handleModalArchivedUser}
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

      {modalEditUser !== null && isUpdatedUser ? (
        <ModalUpdatedUser
          setUsersData={setUsersData}
          roleOrder={roleOrder}
          isUpdatedUser={isUpdatedUser}
          handleCloseModal={handleCloseModal}
          currentUserRole={currentUserRole}
          update={update}
          userInSession={userInSession}
          accessToken={accessToken}
        />
      ) : null}
      {modalArchivedUser !== null && isArchivedUser ? (
        <ModalArchivedUser
          handleCloseModal={handleCloseModal}
          isArchivedUser={isArchivedUser}
          setUsersData={setUsersData}
          userInSession={userInSession}
          setModalArchivedUser={setModalArchivedUser}
          accessToken={accessToken}
        />
      ) : null}
      <div className="absolute">
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};

export default UsersManagementViews;

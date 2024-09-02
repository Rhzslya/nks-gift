import React, { useState, useRef, useEffect } from "react";
import { productsTableHeaders, tableHeaders } from "@/utils/TableHeaders";
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
import { productSortOptions } from "@/utils/SortOptions";
import ModalAddData from "@/components/Admin/ModalAddData";

interface Products {
  _id: any;
  productName: string;
  price: string;
  category: any;
  stock: string;
}

interface UsersManagementViewsProps {
  products: Products[];
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
  products,
  isLoading,
  userInSession,
  currentUserRole,
  accessToken,
  message,
}) => {
  const [searchQuery, setSearchTerm] = useState("");
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
  const [productsData, setProductsData] = useState<Products[]>([]);
  const isUpdatedUser = productsData?.find(
    (user) => user._id === modalEditUser
  );
  const isArchivedUser = productsData?.find(
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
  const [addData, setAddData] = useState(true);
  const [modalShowAddData, setShowModalAddData] = useState(false);
  // Always Update Data
  useEffect(() => {
    setProductsData(products);
  }, [products]);

  const handleProductAdded = (newProduct: Products) => {
    setProductsData((prevProducts) => [...prevProducts, newProduct]);
  };
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

  // Open Modal Add Product Start
  const handleModalAddData = () => {
    setShowModalAddData(!modalShowAddData);
  };
  // Open Modal Add Product End
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
    setShowModalAddData(false);
  };

  // Search Products
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

  const sortedUsers = Array.isArray(productsData)
    ? [...productsData].sort((a, b) => {
        if (sortBy === "username") {
          if (sortOrder === "asc") {
            return a.productName.localeCompare(b.productName);
          } else if (sortOrder === "desc") {
            return b.productName.localeCompare(a.productName);
          }
        }
        return 0;
      })
    : [];

  const filteredUsers = sortedUsers.filter((user) =>
    user.productName.toLowerCase().startsWith(searchQuery.toLowerCase())
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
        title="Products Management"
      />

      <div className="p-6 ">
        <div className="bg-gray-100 p-2 rounded-md ">
          <UtilityBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onToggleFilter={handleToggleFilter}
            filterToggleButtonRef={filterButtonRef}
            isFilterMenuOpen={isFilterOpen}
            filterMenuRef={filterRef}
            isSortOptionActive={isActive}
            sortingOptions={productSortOptions}
            onSortOptionChange={handleSortChange}
            searchPlaceholder="Product Search"
            showAddDataButton={true}
            textAddData="Add Product"
            onAddData={handleModalAddData}
            modalShowAddData={modalShowAddData}
            modalAddData={
              <ModalAddData
                handleCloseModal={handleCloseModal}
                accessToken={accessToken}
              />
            }
          />
          <Table
            tableHeaders={productsTableHeaders}
            isLoading={isLoading}
            paginatedItems={paginatedUsers}
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
            items={products}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

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

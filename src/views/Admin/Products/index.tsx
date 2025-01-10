import React, { useState, useRef, useEffect } from "react";
import { productsTableHeaders, tableHeaders } from "@/utils/TableHeaders";
import "react-loading-skeleton/dist/skeleton.css";
import { useSession } from "next-auth/react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/Admin/Header";
import Table from "@/components/Admin/Table";
import UtilityBar from "@/components/Admin/UtilityBar";
import PaginationToolbar from "@/components/Admin/PaginationToolbar";
import { productSortOptions } from "@/utils/SortOptions";
import ModalAddData from "@/components/Admin/ModalAddData";
import ModalUpdatedProduct from "@/components/Admin/ModalUpdatedProduct";
import ModalDeletePermanently from "@/components/Admin/ModalDeletePermanentlyProduct";
import ModalViewDetailsProduct from "@/components/Admin/ModalViewDetailsProduct";

interface Products {
  _id: any;
  productImage: string;
  productName: string;
  price: number | string;
  category: any;
  stock: {
    variant: string;
    quantity: string;
  }[];
  productId: string;
  createdAt: string | Date;
}

interface UsersManagementViewsProps {
  products: Products[];
  isLoading: boolean;
  userInSession: any;
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
  accessToken,
  message,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");
  const [sortBy, setSortBy] = useState<
    "productName" | "createdAt" | "price" | ""
  >("");
  const [modalEditProduct, setModalEditProduct] = useState<string | null>(null);
  const [modalDeletePermanentlyProduct, setModalDeletePermanentlyProduct] =
    useState<string | null>(null);
  const [modalViewDetailsProduct, setModalViewDetailsProduct] = useState<
    string | null
  >(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const { data: session, update } = useSession();
  const [productsData, setProductsData] = useState<Products[]>([]);
  const isUpdatedProduct = productsData?.find(
    (product) => product._id === modalEditProduct
  );
  const isDeletedPermanentlyProduct = productsData?.find(
    (product) => product._id === modalDeletePermanentlyProduct
  );
  const isViewDetailsProduct = productsData?.find(
    (product) => product._id === modalViewDetailsProduct
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
  const handleModalEditProduct = (_id: string) => {
    setActiveUserId(null);
    setModalEditProduct(modalEditProduct === _id ? null : _id);
  };

  // open Modal Delete User
  const handleModalDeletePermanently = (_id: string) => {
    setActiveUserId(null);
    setModalDeletePermanentlyProduct(
      modalDeletePermanentlyProduct === _id ? null : _id
    );
  };

  // Open Modal Views Details
  const handleModalViewDetails = (_id: string) => {
    setActiveUserId(null);
    setModalViewDetailsProduct(modalViewDetailsProduct === _id ? null : _id);
  };

  const handleCloseModal = () => {
    setModalEditProduct(null);
    setModalDeletePermanentlyProduct(null);
    setShowModalAddData(false);
    setModalViewDetailsProduct(null);
  };

  // Search Products
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Sort User
  const handleSortChange = (
    order: "asc" | "desc",
    sortBy: "productName" | "createdAt" | "price"
  ) => {
    setSortOrder(order);
    setSortBy(sortBy);
  };

  const handleUsersPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const sortedProducts = Array.isArray(productsData)
    ? [...productsData].sort((a, b) => {
        if (sortBy === "productName") {
          if (sortOrder === "asc") {
            return a.productName.localeCompare(b.productName);
          } else if (sortOrder === "desc") {
            return b.productName.localeCompare(a.productName);
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
        } else if (sortBy === "price") {
          const priceA =
            typeof a.price === "string" ? parseFloat(a.price) : a.price;
          const priceB =
            typeof b.price === "string" ? parseFloat(b.price) : b.price;

          if (sortOrder === "asc") {
            return priceA - priceB;
          } else if (sortOrder === "desc") {
            return priceB - priceA;
          }
        }
        return 0;
      })
    : [];

  const filteredProducts = sortedProducts.filter(
    (product) =>
      product.productName.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
      product.productId.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
      product.category[0].toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  const paginatedItems = filteredProducts
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const isActive = (
    order: "asc" | "desc",
    field: "productName" | "createdAt" | "price"
  ) => sortBy === field && sortOrder === order;

  const totalPages = Math.ceil(filteredProducts.length / usersPerPage);

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
    <div className="w-full">
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
                onProductAdded={handleProductAdded}
                setShowModalAddData={setShowModalAddData}
              />
            }
          />
          <Table
            tableHeaders={productsTableHeaders}
            isLoading={isLoading}
            paginatedItems={paginatedItems}
            userInSession={userInSession}
            clickedButtonId={clickedButtonId}
            settingButtonRefs={settingButtonRefs}
            handleSettingToggle={handleSettingToggle}
            activeUserId={activeUserId}
            menuSettingRefs={menuSettingRefs}
            handleModalEditProduct={handleModalEditProduct}
            handleModalDeletePermanently={handleModalDeletePermanently}
            handleModalViewDetails={handleModalViewDetails}
          />
          <PaginationToolbar
            usersPerPage={usersPerPage}
            handleUsersPerPage={handleUsersPerPage}
            items={products}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            rowsPerPageOptions={[5]}
          />
        </div>
      </div>

      {modalEditProduct !== null && isUpdatedProduct ? (
        <ModalUpdatedProduct
          handleCloseModal={handleCloseModal}
          isUpdatedProduct={isUpdatedProduct}
          accessToken={accessToken}
          setProductsData={setProductsData}
        />
      ) : null}
      {modalDeletePermanentlyProduct !== null && isDeletedPermanentlyProduct ? (
        <ModalDeletePermanently
          handleCloseModal={handleCloseModal}
          isDeletedPermanentlyProduct={isDeletedPermanentlyProduct}
          userInSession={userInSession}
          setModalDeletePermanentlyProduct={setModalDeletePermanentlyProduct}
          accessToken={accessToken}
          setProductsData={setProductsData}
        />
      ) : null}
      {modalViewDetailsProduct !== null && isViewDetailsProduct ? (
        <ModalViewDetailsProduct
          handleCloseModal={handleCloseModal}
          isViewDetailsProduct={isViewDetailsProduct}
          userInSession={userInSession}
          setModalViewDetailsProduct={setModalViewDetailsProduct}
          accessToken={accessToken}
          setProductsData={setProductsData}
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

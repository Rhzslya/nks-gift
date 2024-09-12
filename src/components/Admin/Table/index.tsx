import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { capitalizeFirst } from "@/utils/Capitalize";
import { formatPriceToIDR } from "@/utils/FormatPrice";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

interface TableProps {
  tableHeaders: { key: string; name: string }[];
  isLoading: boolean;
  paginatedItems: any[];
  userInSession: any;
  clickedButtonId: string | null;
  settingButtonRefs: React.MutableRefObject<{
    [key: string]: HTMLButtonElement | null;
  }>;
  handleSettingToggle: (userId: string, event: React.MouseEvent) => void;
  activeUserId: string | null;
  menuSettingRefs: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
  handleModalEditUser?: (userId: string) => void;
  handleModalArchivedUser?: (userId: string) => void;
  handleModalRestoreUser?: (userId: string) => void;
  handleModalViewDetails?: (userId: string) => void;
  handleModalDeletePermanently?: (userId: string) => void;
  handleModalEditProduct?: (productId: string) => void;
  variant?: string;
}

const Table: React.FC<TableProps> = ({
  tableHeaders,
  isLoading,
  paginatedItems,
  userInSession,
  clickedButtonId,
  settingButtonRefs,
  handleSettingToggle,
  activeUserId,
  menuSettingRefs,
  handleModalEditUser,
  handleModalArchivedUser,
  handleModalRestoreUser,
  handleModalViewDetails,
  handleModalDeletePermanently,
  handleModalEditProduct,
  variant = "bg-white",
}) => {
  const className: any = {
    red: "bg-red-200",
    orange: "bg-orange-200",
  };

  // Function to map the header key to the appropriate data field
  const getItemField = (item: any, key: string) => {
    const fieldMap: { [key: string]: any } = {
      productName: capitalizeFirst(item.productName || ""),
      price: formatPriceToIDR(item.price),
      productId: item.productId,
      category: capitalizeFirst(item.category || ""),
      stock: item.stock,
      variant: item.stock?.variant,
      qty: item.stock?.qty,
      username: capitalizeFirst(item.username || ""),
      email: item.email,
      userId: item.userId,
      type: item.type ? capitalizeFirst(item.type.join(", ")) : "", // Check if item.type is defined and is an array
      accessLevel: capitalizeFirst(item.role || ""),
      verifiedStatus: (
        <span className={item.isVerified ? "text-green-500" : "text-red-500"}>
          {item.isVerified ? "Verified" : "Not Verified"}
        </span>
      ),
      dateCreated: item.createdAt
        ? new Date(item.createdAt)
            .toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\//g, "-") // Mengganti '/' dengan '-'
        : "",
      deletedAt: item.deletedAt
        ? new Date(item.deletedAt)
            .toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\//g, "-") // Mengganti '/' dengan '-'
        : "",
    };
    return fieldMap[key] || null; // Return null if no mapping exists
  };

  const hasStockHeader = tableHeaders.some((header) => header.key === "stock");

  return (
    <table className="w-full border-collapse">
      <TableHeader
        tableHeaders={tableHeaders}
        hasStockHeader={hasStockHeader}
      />
      <TableRow
        paginatedItems={paginatedItems}
        tableHeaders={tableHeaders}
        isLoading={isLoading}
        getItemField={getItemField}
        handleSettingToggle={handleSettingToggle}
        userInSession={userInSession}
        clickedButtonId={clickedButtonId}
        settingButtonRefs={settingButtonRefs}
        activeUserId={activeUserId}
        menuSettingRefs={menuSettingRefs}
        handleModalEditUser={handleModalEditUser}
        handleModalEditProduct={handleModalEditProduct}
        handleModalArchivedUser={handleModalArchivedUser}
        handleModalRestoreUser={handleModalRestoreUser}
        handleModalViewDetails={handleModalViewDetails}
        handleModalDeletePermanently={handleModalDeletePermanently}
      />
    </table>
  );
};

export default Table;

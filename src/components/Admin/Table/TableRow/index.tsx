import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { capitalizeFirst } from "@/utils/Capitalize";
import { formatPriceToIDR } from "@/utils/FormatPrice";
import { ActionMenu } from "../../ActionMenu";

interface TableRowProps {
  paginatedItems: any[];
  tableHeaders: { key: string; name: string }[];
  isLoading: boolean;
  getItemField: (item: any, key: string) => React.ReactNode;
  handleSettingToggle: (userId: string, event: React.MouseEvent) => void;
  userInSession: any;
  clickedButtonId: string | null;
  settingButtonRefs: React.MutableRefObject<{
    [key: string]: HTMLButtonElement | null;
  }>;
  activeUserId: string | null;
  menuSettingRefs: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
  handleModalEditUser?: (userId: string) => void;
  handleModalArchivedUser?: (userId: string) => void;
  handleModalRestoreUser?: (userId: string) => void;
  handleModalViewDetails?: (userId: string) => void;
  handleModalDeletePermanently?: (userId: string) => void;
  variant?: string;
}

const TableRow: React.FC<TableRowProps> = ({
  paginatedItems,
  tableHeaders,
  isLoading,
  getItemField,
  handleSettingToggle,
  userInSession,
  clickedButtonId,
  settingButtonRefs,
  activeUserId,
  menuSettingRefs,
  handleModalEditUser,
  handleModalArchivedUser,
  handleModalRestoreUser,
  handleModalViewDetails,
  handleModalDeletePermanently,
  variant = "bg-white",
}) => {
  const className: Record<string, string> = {
    red: "bg-red-200",
    orange: "bg-orange-200",
  };

  // Function to render stock variants and quantity
  // Function to render stock variants and quantity
  const renderStock = (item: any) => (
    <React.Fragment key={item._id}>
      <td className="px-4 py-2 text-center text-xs font-medium tracking-wider">
        {Array.isArray(item.stock) && item.stock.length > 0 ? (
          item.stock.map(
            (
              stockItem: { variant: string; quantity: string },
              index: number
            ) => (
              <div
                key={`${item._id}-${stockItem.variant}-${index}`}
                className="px-2 py-1"
              >
                {stockItem.variant || "-"}
              </div>
            )
          )
        ) : (
          <div className="text-center">No stock data available</div>
        )}
      </td>
      <td className="px-4 py-2 text-center text-xs font-medium tracking-wider">
        {Array.isArray(item.stock) && item.stock.length > 0 ? (
          item.stock.map(
            (
              stockItem: { variant: string; quantity: string },
              index: number
            ) => (
              <div key={`${item._id}-quantity-${index}`} className="px-2 py-1">
                {stockItem.quantity || "-"}
              </div>
            )
          )
        ) : (
          <div className="text-center">No stock data available</div>
        )}
      </td>
    </React.Fragment>
  );

  // Function to render table cells based on the header key
  const renderCellContent = (item: any, headerKey: string) => {
    if (headerKey === "stock") {
      return renderStock(item);
    }
    return (
      <td
        key={headerKey}
        className={`px-4 py-2 text-center text-xs font-medium tracking-wider ${
          headerKey === "username" ? "border-r-8 border-gray-100" : ""
        }`}
      >
        {headerKey === "action" ? (
          <div
            className="relative z-50"
            ref={(el) => {
              menuSettingRefs.current[item._id] = el;
            }}
          >
            <button
              className={`${
                clickedButtonId === item._id
                  ? "bg-gray-200 border-gray-500 border-[1px]"
                  : ""
              } w-[25px] h-[25px] flex justify-center items-center rounded-full duration-300`}
              ref={(el) => {
                settingButtonRefs.current[item._id] = el;
              }}
              onClick={(e) => handleSettingToggle(item._id, e)}
            >
              <i className="relative bx bx-dots-vertical-rounded text-[20px]"></i>
            </button>
            {activeUserId === item._id && (
              <ActionMenu
                itemId={item._id}
                handleModalEditUser={handleModalEditUser}
                handleModalArchivedUser={handleModalArchivedUser}
                handleModalRestoreUser={handleModalRestoreUser}
                handleModalViewDetails={handleModalViewDetails}
                handleModalDeletePermanently={handleModalDeletePermanently}
              />
            )}
          </div>
        ) : (
          getItemField(item, headerKey)
        )}
      </td>
    );
  };

  return (
    <tbody className="bg-white">
      {isLoading ? (
        Array(15)
          .fill(null)
          .map((_, index) => (
            <tr key={index}>
              {tableHeaders.map((header, index) => (
                <td key={`${header.key}-${index}`}>
                  <Skeleton className="py-[11.5px]" />
                </td>
              ))}
            </tr>
          ))
      ) : paginatedItems.length > 0 ? (
        paginatedItems.map((item) => (
          <tr
            key={item._id}
            className={`text-gray-500 border-b-2 border-gray-100 ${
              item._id === userInSession?.id
                ? "bg-green-200"
                : className[variant]
            }`}
          >
            {tableHeaders.map((header) => renderCellContent(item, header.key))}
          </tr>
        ))
      ) : (
        <tr className="text-gray-500">
          <td colSpan={tableHeaders.length + 1} className="text-center py-4">
            No data available.
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default TableRow;

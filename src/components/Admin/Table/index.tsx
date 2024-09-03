import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { capitalizeFirst } from "@/utils/Capitalize";
import { formatPriceToIDR } from "@/utils/FormatPrice";

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
      size: item.size,
      qty: item.qty,
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
        ? new Date(item.createdAt).toLocaleDateString()
        : "",
      deletedAt: item.deletedAt
        ? new Date(item.deletedAt).toLocaleDateString()
        : "",
    };
    return fieldMap[key] || null; // Return null if no mapping exists
  };

  const hasStockHeader = tableHeaders.some((header) => header.key === "stock");

  return (
    <table className="w-full border-collapse">
      <thead className="bg-white border-b-2 border-gray-100">
        <tr>
          {tableHeaders.map((header) => (
            <th
              key={header.key}
              colSpan={header.key === "stock" ? 2 : undefined}
              rowSpan={header.key !== "stock" ? 2 : undefined}
              scope="col"
              className={`px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider ${
                header.key === "action" ? "hidden" : ""
              }`}
            >
              {header.name}
            </th>
          ))}
          <th
            rowSpan={2}
            className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
          ></th>
          {/* Kolom ekstra kosong untuk menjaga keseimbangan jika ada kolom stock */}
        </tr>
        {/* Jika ada stock header, render baris untuk Size dan Qty */}
        {hasStockHeader && (
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Size
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Qty
            </th>
          </tr>
        )}
      </thead>

      <tbody className="bg-white">
        {isLoading ? (
          Array(15)
            .fill(null)
            .map((_, index) => (
              <tr key={index}>
                {tableHeaders.map((header) => (
                  <td key={header.key}>
                    <Skeleton className="py-[11.5px]" />
                  </td>
                ))}
              </tr>
            ))
        ) : paginatedItems.length > 0 ? (
          paginatedItems.map((item) => (
            <React.Fragment key={item._id}>
              <tr
                key={item._id} // Unique key for each row
                className={`text-gray-500 ${
                  item._id === userInSession?.id
                    ? "bg-green-200"
                    : `${className[variant]}`
                }`}
              >
                {tableHeaders.map((header) =>
                  header.key === "stock" ? (
                    <React.Fragment key={`${item._id}-stock`}>
                      <td
                        key={`${item._id}-size`} // Unique key for this cell
                        className="px-4 py-2 text-left text-xs font-medium tracking-wider"
                      >
                        {item.size || "-"}
                      </td>
                      <td
                        key={`${item._id}-qty`} // Unique key for this cell
                        className="px-4 py-2 text-left text-xs font-medium tracking-wider"
                      >
                        {item.qty || "-"}
                      </td>
                    </React.Fragment>
                  ) : (
                    <td
                      key={header.key} // Unique key for each table header
                      className={`px-4 py-2 text-left text-xs font-medium tracking-wider ${
                        header.key === "username"
                          ? "border-r-8 border-gray-100"
                          : ""
                      }`}
                    >
                      {header.key === "action" ? (
                        <div className="relative z-50">
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
                            <div
                              ref={(el) => {
                                menuSettingRefs.current[item._id] = el;
                              }}
                              className="absolute right-[110%] top-0 bg-white rounded-md shadow flex flex-col"
                            >
                              {handleModalEditUser && (
                                <button
                                  className="px-1 hover:bg-gray-100 duration-300"
                                  onClick={() => handleModalEditUser(item._id)}
                                >
                                  <div className="flex gap-x-2 w-[120px] py-2">
                                    <i className="bx bxs-pencil text-[16px]"></i>
                                    <p className="text-xs">Edit</p>
                                  </div>
                                </button>
                              )}
                              {handleModalArchivedUser && (
                                <button
                                  className="px-1 hover:bg-gray-100 duration-300"
                                  onClick={() =>
                                    handleModalArchivedUser(item._id)
                                  }
                                >
                                  <div className="flex gap-x-2 w-[120px] py-2">
                                    <i className="bx bxs-archive text-[16px]"></i>
                                    <p className="text-xs text-orange-500">
                                      Archive
                                    </p>
                                  </div>
                                </button>
                              )}
                              {handleModalRestoreUser && (
                                <button
                                  className="px-1 hover:bg-gray-100 duration-300"
                                  onClick={() =>
                                    handleModalRestoreUser(item._id)
                                  }
                                >
                                  <div className="flex gap-x-2 w-[120px] py-2">
                                    <i className="bx bx-undo text-[16px]"></i>
                                    <p className="text-xs text-green-500">
                                      Restore
                                    </p>
                                  </div>
                                </button>
                              )}
                              {handleModalViewDetails && (
                                <button
                                  className="px-1 hover:bg-gray-100 duration-300"
                                  onClick={() =>
                                    handleModalViewDetails(item._id)
                                  }
                                >
                                  <div className="flex gap-x-2 w-[120px] py-2">
                                    <i className="bx bxs-info-circle text-[16px]"></i>
                                    <p className="text-xs">View Details</p>
                                  </div>
                                </button>
                              )}
                              {handleModalDeletePermanently && (
                                <button
                                  className="px-1 hover:bg-gray-100 duration-300"
                                  onClick={() =>
                                    handleModalDeletePermanently(item._id)
                                  }
                                >
                                  <div className="flex gap-x-2 w-[180px] py-2">
                                    <i className="bx bxs-trash text-[16px]"></i>
                                    <p className="text-xs text-red-500">
                                      Delete Permanently
                                    </p>
                                  </div>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        getItemField(item, header.key)
                      )}
                    </td>
                  )
                )}
              </tr>
            </React.Fragment>
          ))
        ) : (
          <tr>
            <td colSpan={tableHeaders.length} className="text-center py-4">
              No data available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;

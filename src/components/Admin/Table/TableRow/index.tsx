import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ActionMenu } from "../../ActionMenu";
import Image from "next/image";

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
  handleModalViewDetails?: (productId: string) => void;
  handleModalDeletePermanently?: (userId: string) => void;
  handleModalEditProduct?: (productId: string) => void;
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
  handleModalEditProduct,
  variant = "bg-white",
}) => {
  const className: Record<string, string> = {
    red: "bg-red-200",
    orange: "bg-orange-200",
  };

  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    setSelectedVariants((prev) => {
      const updatedVariants = { ...prev };
      paginatedItems.forEach((item) => {
        if (Array.isArray(item.stock) && item.stock.length > 0) {
          if (
            !item.stock.find(
              (s: any) => s.variant === updatedVariants[item._id]
            )
          ) {
            updatedVariants[item._id] = item.stock[0].variant;
          }
        } else {
          delete updatedVariants[item._id];
        }
      });
      return updatedVariants;
    });
  }, [paginatedItems]);

  const handleVariantChange = (itemId: string, variant: string) => {
    setSelectedVariants((prev) => ({ ...prev, [itemId]: variant }));
  };

  const renderStock = (item: any) => {
    const selectedVariant = selectedVariants[item._id];
    const stockItem =
      Array.isArray(item.stock) && selectedVariant
        ? item.stock.find((s: any) => s.variant === selectedVariant)
        : item.stock[0];

    return (
      <React.Fragment key={item._id}>
        <td className="px-4 py-2 text-center  text-xs font-medium tracking-wider">
          {Array.isArray(item.stock) && item.stock.length > 0 ? (
            item.stock.length === 1 ? (
              <div className="px-2 py-1">{item.stock[0].variant || "-"}</div>
            ) : (
              <select
                className="border rounded px-2 py-1 cursor-pointer border-none outline-none"
                value={selectedVariant || ""}
                onChange={(e) => handleVariantChange(item._id, e.target.value)}
              >
                {item.stock.map(
                  (stockItem: { variant: string }, index: number) => (
                    <option
                      key={`${item._id}-${index}`}
                      value={stockItem.variant}
                    >
                      {stockItem.variant}
                    </option>
                  )
                )}
              </select>
            )
          ) : (
            <div className="text-center">-</div>
          )}
        </td>
        <td className="px-4 py-2 text-center text-xs font-medium tracking-wider">
          {stockItem ? (
            <div className="px-2 py-1">{stockItem.quantity || "-"}</div>
          ) : (
            <div className="text-center">{stockItem?.quantity[0]}</div>
          )}
        </td>
      </React.Fragment>
    );
  };

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
            className="relative"
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
              <i className="bx bx-dots-vertical-rounded text-[20px]"></i>
            </button>
            {activeUserId === item._id && (
              <ActionMenu
                itemId={item._id}
                handleModalEditUser={handleModalEditUser}
                handleModalArchivedUser={handleModalArchivedUser}
                handleModalRestoreUser={handleModalRestoreUser}
                handleModalDeletePermanently={handleModalDeletePermanently}
                handleModalEditProduct={handleModalEditProduct}
                handleModalViewDetails={handleModalViewDetails}
              />
            )}
          </div>
        ) : headerKey === "productImage" ? (
          <Image
            src={item.productImage}
            alt={item.productName}
            className="w-24 h-24 object-cover m-auto rounded-sm border-4 border-gray-100 "
            width={100}
            height={100}
            quality={100}
            priority
          />
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

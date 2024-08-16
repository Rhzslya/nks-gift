import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { capitalizeFirst } from "@/utils/Capitalize";

interface TableProps {
  tableHeaders: { key: string; name: string }[];
  isLoading: boolean;
  paginatedUsers: any[];
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
  paginatedUsers,
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

  return (
    <table className="w-full border-collapse">
      <thead className="bg-white border-b-2 border-gray-100 ">
        <tr>
          {tableHeaders.map((header) => (
            <th
              key={header.key}
              scope="col"
              className={`px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider ${
                header.key === "action" ? "hidden" : ""
              }`}
            >
              {header.name}
            </th>
          ))}
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
            {/* Placeholder header for action column */}
          </th>
        </tr>
      </thead>

      <tbody className="bg-white">
        {isLoading
          ? Array(15)
              .fill(null)
              .map((_, index) => (
                <tr key={index}>
                  {tableHeaders.map((header) => (
                    <td key={header.key} className="">
                      <Skeleton className="py-[11.5px]" />
                    </td>
                  ))}
                </tr>
              ))
          : paginatedUsers.length > 0 &&
            paginatedUsers.map((user) => (
              <tr
                key={user._id}
                className={`text-gray-500 ${
                  user._id === userInSession?.id
                    ? "bg-green-200"
                    : `${className[variant]}`
                }`}
              >
                {tableHeaders.map((header) => (
                  <td
                    key={header.key}
                    className={`px-4 py-2 text-left text-xs font-medium tracking-wider ${
                      header.key === "username"
                        ? "border-r-8 border-gray-100"
                        : ""
                    }`}
                  >
                    {header.key === "username" &&
                      capitalizeFirst(user.username)}
                    {header.key === "email" && user.email}
                    {header.key === "userId" && user.userId}
                    {header.key === "type" &&
                      capitalizeFirst(user.type.join(", "))}

                    {header.key === "accessLevel" && capitalizeFirst(user.role)}
                    {header.key === "verifiedStatus" && (
                      <span
                        className={
                          user.isVerified ? "text-green-500" : "text-red-500"
                        }
                      >
                        {user.isVerified ? "Verified" : "Not Verified"}
                      </span>
                    )}
                    {header.key === "dateCreated" &&
                      new Date(user.createdAt).toLocaleDateString()}
                    {header.key === "deletedAt" &&
                      new Date(user.deletedAt).toLocaleDateString()}
                    {header.key === "action" && (
                      <div className="relative z-50">
                        <button
                          className={`${
                            clickedButtonId === user._id
                              ? "bg-gray-200 border-gray-500 border-[1px]"
                              : ""
                          } w-[25px] h-[25px] flex justify-center items-center rounded-full duration-300`}
                          ref={(el) => {
                            settingButtonRefs.current[user._id] = el;
                          }}
                          onClick={(e) => handleSettingToggle(user._id, e)}
                        >
                          <i className="relative bx bx-dots-vertical-rounded text-[20px]"></i>
                        </button>
                        {activeUserId === user._id && (
                          <div
                            ref={(el) => {
                              menuSettingRefs.current[user._id] = el;
                            }}
                            className="absolute right-[110%] top-0 bg-white rounded-md shadow flex flex-col"
                          >
                            {handleModalEditUser && (
                              <button
                                className="px-1 hover:bg-gray-100 duration-300"
                                onClick={() => handleModalEditUser(user._id)}
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
                                  handleModalArchivedUser(user._id)
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
                                onClick={() => handleModalRestoreUser(user._id)}
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
                                onClick={() => handleModalViewDetails(user._id)}
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
                                  handleModalDeletePermanently(user._id)
                                }
                              >
                                <div className="flex gap-x-2 w-[180px] py-2">
                                  <i className="bx bxs-trash-alt text-[16px]"></i>
                                  <p className="text-xs text-red-600">
                                    Delete Permanently
                                  </p>
                                </div>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
      </tbody>
    </table>
  );
};

export default Table;

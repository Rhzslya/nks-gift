type ActionMenuProps = {
  itemId: string;
  handleModalEditUser?: (id: string) => void;
  handleModalArchivedUser?: (id: string) => void;
  handleModalRestoreUser?: (id: string) => void;
  handleModalViewDetails?: (id: string) => void;
  handleModalDeletePermanently?: (id: string) => void;
};

export const ActionMenu: React.FC<ActionMenuProps> = ({
  itemId,
  handleModalEditUser,
  handleModalArchivedUser,
  handleModalRestoreUser,
  handleModalViewDetails,
  handleModalDeletePermanently,
}) => {
  return (
    <div className="absolute right-[110%] top-0 bg-white rounded-md shadow flex flex-col">
      {handleModalEditUser && (
        <button
          className="px-1 hover:bg-gray-100 duration-300"
          onClick={() => handleModalEditUser(itemId)}
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
          onClick={() => handleModalArchivedUser(itemId)}
        >
          <div className="flex gap-x-2 w-[120px] py-2">
            <i className="bx bxs-archive text-[16px]"></i>
            <p className="text-xs text-orange-500">Archive</p>
          </div>
        </button>
      )}
      {handleModalRestoreUser && (
        <button
          className="px-1 hover:bg-gray-100 duration-300"
          onClick={() => handleModalRestoreUser(itemId)}
        >
          <div className="flex gap-x-2 w-[120px] py-2">
            <i className="bx bx-undo text-[16px]"></i>
            <p className="text-xs text-green-500">Restore</p>
          </div>
        </button>
      )}
      {handleModalViewDetails && (
        <button
          className="px-1 hover:bg-gray-100 duration-300"
          onClick={() => handleModalViewDetails(itemId)}
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
          onClick={() => handleModalDeletePermanently(itemId)}
        >
          <div className="flex gap-x-2 w-[180px] py-2">
            <i className="bx bxs-trash text-[16px]"></i>
            <p className="text-xs text-red-500">Delete Permanently</p>
          </div>
        </button>
      )}
    </div>
  );
};

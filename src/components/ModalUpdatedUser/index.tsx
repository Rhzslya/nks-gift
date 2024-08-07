import React, { useState } from "react";
import Modal from "../fragements/Modal";
import LabelAndInput from "../Form/Label";
import Select from "../Select";
import SubmitButton from "../Button/SubmitButton";
import { authServices } from "@/lib/services/auth";
interface User {
  username: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
  _id: string; // Ubah dari number ke string
}

interface ModalUpdatedUserProps {
  editedUser: User;
  handleCloseModal: () => void;
}

const ModalUpdatedUser: React.FC<ModalUpdatedUserProps> = ({
  editedUser,
  handleCloseModal,
}) => {
  const [updatedUser, setUpdatedUser] = useState<User>(editedUser);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      isAdmin: value === "Admin",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/users/update-users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: updatedUser._id,
          updatedUser: {
            username: updatedUser.username,
            email: updatedUser.email,
            isVerified: updatedUser.isVerified,
            isAdmin: updatedUser.isAdmin,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setMessage("User updated successfully");
      } else {
        const errorData = await response.json();
        setMessage(
          `Update User Failed: ${errorData.message || response.statusText}`
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        setMessage("Update User Failed: " + error.message);
      } else {
        setMessage("Update User Failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  console.log(updatedUser);
  return (
    <Modal onClose={handleCloseModal}>
      <div className="w-[300px]">
        <div className="text-xl font-bold text-center mb-4">
          <h3>Edit User</h3>
        </div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="flex flex-col mb-4">
            <LabelAndInput
              id="username"
              type="text"
              name="username"
              text="username"
              value={updatedUser.username}
              disabled
              textStyle="text-xs font-medium"
            />
          </div>
          <div className="flex flex-col text-md mb-4">
            <LabelAndInput
              id="email"
              type="email"
              name="email"
              text="email"
              value={updatedUser.email}
              disabled
              textStyle="text-xs font-medium"
            />
          </div>
          <div className="flex flex-col text-md mb-4">
            <LabelAndInput
              id="verified"
              type="text"
              name="verified"
              text="verified status"
              value={updatedUser.isVerified ? "Verified" : "Not Verified"}
              disabled
              textStyle="text-xs font-medium"
            />
          </div>
          <div className="flex flex-col text-md mb-4">
            <Select
              id="accessLevel"
              name="accessLevel"
              options={[
                { value: "Admin", label: "Admin" },
                { value: "User", label: "User" },
              ]}
              value={updatedUser.isAdmin ? "Admin" : "User"}
              onChange={handleChange}
              textStyle="text-xs font-medium"
            />
          </div>
          <div className="mb-4">
            <SubmitButton type="submit" isLoading={isLoading} text="Save" />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalUpdatedUser;

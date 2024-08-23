import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface HandleChangeParams {
  e: ChangeEvent<HTMLInputElement>;
  setUser: Dispatch<SetStateAction<any>>;
  setErrors: Dispatch<SetStateAction<Record<string, string>>>;
  setIsModified?: Dispatch<SetStateAction<boolean>>;
}

export const handleChange = ({
  e,
  setUser,
  setErrors,
  setIsModified,
}: HandleChangeParams) => {
  const { name, value } = e.target;
  setUser((prevUser: any) => {
    // Check if the field is part of the address object
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      return {
        ...prevUser,
        address: {
          ...prevUser.address,
          [addressField]: value,
        },
      };
    }

    return {
      ...prevUser,
      [name]: value,
    };
  });

  // Remove specific error message when user starts typing
  setErrors((prevErrors: any) => ({
    ...prevErrors,
    [name]: "",
  }));
};

interface HandlePasswordChangeProps {
  e: React.ChangeEvent<HTMLInputElement>;
  setPasswordCriteria: React.Dispatch<
    React.SetStateAction<{
      length: boolean;
      combination: boolean;
      specialChar: boolean;
    }>
  >;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const handlePasswordChange = ({
  e,
  setPasswordCriteria,
  setUser,
  setErrors,
}: HandlePasswordChangeProps) => {
  const { value } = e.target;
  setPasswordCriteria({
    length: value.length >= 8,
    combination: /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/.test(value),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
  });
  handleChange({ e, setUser, setErrors });
};

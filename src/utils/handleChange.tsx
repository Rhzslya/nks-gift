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
  setUser((prevUser: any) => ({
    ...prevUser,
    [name]: value,
  }));

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

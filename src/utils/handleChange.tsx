import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface HandleChangeParams<T extends Record<string, any>> {
  e: ChangeEvent<HTMLInputElement>;
  setData: Dispatch<SetStateAction<T>>;
  setErrors: Dispatch<SetStateAction<Record<string, string>>>;
  setIsModified?: Dispatch<SetStateAction<boolean>>;
}

export const handleChange = <T extends Record<string, any>>({
  e,
  setData,
  setErrors,
  setIsModified,
}: HandleChangeParams<T>) => {
  const { name, value } = e.target;

  setData((prevData) => {
    if (name.includes(".")) {
      const keys = name.split(".");
      const [firstKey, secondKey] = keys;
      return {
        ...prevData,
        [firstKey]: {
          ...prevData[firstKey],
          [secondKey]: value,
        },
      };
    }

    return {
      ...prevData,
      [name]: value,
    };
  });

  // Remove specific error message when user starts typing
  setErrors((prevErrors) => ({
    ...prevErrors,
    [name]: "",
  }));

  // Optionally set isModified to true
  setIsModified?.(true);
};

interface HandlePasswordChangeProps<T extends Record<string, any>> {
  e: ChangeEvent<HTMLInputElement>;
  setPasswordCriteria: Dispatch<
    SetStateAction<{
      length: boolean;
      combination: boolean;
      specialChar: boolean;
    }>
  >;
  setData: Dispatch<SetStateAction<T>>;
  setErrors: Dispatch<SetStateAction<Record<string, string>>>;
}

export const handlePasswordChange = <T extends Record<string, any>>({
  e,
  setPasswordCriteria,
  setData,
  setErrors,
}: HandlePasswordChangeProps<T>) => {
  const { value, name } = e.target;

  // Validate password criteria
  setPasswordCriteria({
    length: value.length >= 8,
    combination: /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/.test(value),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
  });

  // Use handleChange to update user data and handle errors
  handleChange({
    e,
    setData,
    setErrors,
  });
};

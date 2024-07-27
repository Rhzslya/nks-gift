export const registerSubmit = async ({
  user,
  setErrors,
  setIsLoading,
  setMessage,
  validation,
  e,
  responseAPI,
  method,
}: {
  user: {
    email: string;
    password: string;
    confirmpassword: string;
    username: string;
  };
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  validation: any;
  e: any;
  responseAPI: string;
  method: string;
}) => {
  e.preventDefault();
  const validationErrors = validation(user);
  setErrors(validationErrors);

  try {
    if (Object.keys(validationErrors).length === 0) {
      const response = await fetch(responseAPI, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.status === 200) {
        e.target.reset();
        setIsLoading(false);
      }

      const data = await response.json();

      if (response.status === 400) {
        setIsLoading(false);
        setMessage(data.message);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Email Already Exist") {
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          email: error.message,
        }));
      }
    } else {
      setMessage("Signup failed");
    }
  } finally {
    setIsLoading(false);
  }
};

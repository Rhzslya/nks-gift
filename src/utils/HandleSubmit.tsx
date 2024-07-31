import { signIn } from "next-auth/react";

export const handleSignUp = async ({
  user,
  setErrors,
  setIsLoading,
  setMessage,
  validation,
  e,
  responseAPI,
  method,
  push,
}: {
  user: {
    email: string;
    password: string;
    username?: string;
  };

  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  validation: any;
  e: any;
  responseAPI: string;
  method: string;
  push: any;
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
        push("/sign-in");
      }

      const data = await response.json();

      if (response.status === 400) {
        setIsLoading(false);
        setMessage(data.message);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error instanceof Error) {
        console.log(error);
      }
    } else {
      setMessage("Signup failed");
    }
  } finally {
    setIsLoading(false);
  }
};

export const handleSignIn = async ({
  user,
  setErrors,
  setIsLoading,
  setMessage,
  validation,
  e,
  callbackUrl,
  push,
}: {
  user: {
    email: string;
    password: string;
  };
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  validation: any;
  e: any;
  callbackUrl: string;
  push: any;
}) => {
  e.preventDefault();
  const validationErrors = validation(user);
  setErrors(validationErrors);

  try {
    if (Object.keys(validationErrors).length === 0) {
      const response = await signIn("credentials", {
        redirect: false,
        email: user.email,
        password: user.password,
        callbackUrl,
      });

      if (response?.status === 200) {
        e.target.reset();
        setIsLoading(false);
        push(callbackUrl);
      }

      console.log(response);

      if (response?.status === 401) {
        setMessage(response.error || "An unknown error occurred.");
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  } finally {
    setIsLoading(false);
  }
};

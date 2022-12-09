import { useRouter } from "next/router";
import React, { useState, createContext, useEffect } from "react";
import axios from "axios";
import { userItem } from "../helpers/helper.types";

export type UserProps = {
  user: userItem;
  token?: string;
};

type IUserProps = [
  UserProps | undefined,
  React.Dispatch<React.SetStateAction<UserProps | undefined>>
];

const UserContext = createContext<IUserProps>([
  { user: {}, token: "" },
  () => null,
]);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<UserProps | undefined>({
    user: {},
    token: "",
  });

  useEffect(() => {
    setState(JSON.parse(window.localStorage.getItem("auth") || "{}"));
  }, []);

  const router = useRouter();

  const token = state?.token ? state.token : "";
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  axios.interceptors.response.use(
    function (response) {
      // Do something before request is sent
      return response;
    },
    function (error) {
      // Do something with request error
      let res = error.response;
      if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        setState(undefined);
        window.localStorage.removeItem("auth");
        router.push("/login");
      }
    }
  );

  return (
    <UserContext.Provider value={[state, setState]}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

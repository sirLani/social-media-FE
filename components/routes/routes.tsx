import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";
import { UserContext } from "../../context";

const UserRoute = ({ children }: { children: React.ReactNode }) => {
  const [ok, setOk] = useState(false);
  const router = useRouter();
  const [state] = useContext(UserContext);

  const getCurrentUser = useCallback(async () => {
    try {
      const { data } = await axios.get("/current-user", {
        headers: {
          Authorization: `Bearer ${state?.token}`,
        },
      });
      if (data.ok) setOk(true);
    } catch (err) {
      router.push("/login");
    }
  }, [state?.token, router]);

  useEffect(() => {
    if (state?.token) getCurrentUser();
  }, [state, getCurrentUser]);

  if (typeof window !== "undefined" && state === null) {
    setTimeout(() => {
      getCurrentUser();
    }, 1000);
  }

  return !ok ? (
    <SyncOutlined
      spin
      className="d-flex justify-content-center display-1 text-primary p-5"
    />
  ) : (
    <> {children}</>
  );
};

export default UserRoute;

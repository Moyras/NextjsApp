import { useContext, useEffect } from "react";
import { Context } from "../../context";
import { SyncOutlined, WindowsFilled } from "@ant-design/icons";
import axios from "axios";

const StripeCallback = () => {
  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  useEffect(async () => {
    if (user) {
      const response = await axios.post("/api/get-account-status");

      dispatch({ type: "LOGIN", payload: response.data });
      window.localStorage.setItem("user", JSON.stringify(response.data));
      window.location.href = "/instructor";
    }
  }, [user]);

  return (
    <SyncOutlined
      className="d-flex justify-content-center display-1 text-danger p-5"
      spin
    />
  );
};

export default StripeCallback;

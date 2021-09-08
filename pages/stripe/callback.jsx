import { useContext, useEffect } from "react";
import { Context } from "../../context";
import { SyncOutlined } from "@ant-design/icons";
import axios from "axios";

const StripeCallback = () => {
  const {
    state: { user },
  } = useContext(Context);

  useEffect(async () => {
    if (user) {
      const res = await axios.post("/api/get-account-status");
      console.log(res);
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

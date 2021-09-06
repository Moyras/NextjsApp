import TopNav from "../components/TopNav";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/reactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "../public/css/styles.css";

import { Provider } from "../context";

const Myapp = ({ Component, pageProps }) => {
  return (
    <Provider>
      <ToastContainer position="top-center" />
      <TopNav />
      <Component {...pageProps} />
    </Provider>
  );
};

export default Myapp;

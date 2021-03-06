import { useReducer, createContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

// initial state

const intialState = {
  user: null,
};

// create context

const Context = createContext();

// root reducer

const rootReducer = (state, actions) => {
  switch (actions.type) {
    case "LOGIN":
      return { ...state, user: actions.payload };

    case "LOGOUT":
      return { ...state, user: null };

    default:
      return state;
  }
};

// context provide

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, intialState);

  // router

  const router = useRouter();

  useEffect(() => {
    dispatch({
      type: "LOGIN",
      payload: JSON.parse(window.localStorage.getItem("user")),
    });
  }, []);

  axios.interceptors.response.use(
    (response) => {
      // any status code thtat lie within the range of 2XXcause this function
      // to trigger

      return response;
    },
    (error) => {
      // any status codes that falls outside the range of 2XX cause this function
      // to trigger

      let res = error.response;
      if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        return new Promise((resolve, reject) => {
          axios
            .get("/api/logout")
            .then((data) => {
              console.log("/401 error > logout");
              dispatch({ type: "LOGOUT" });
              window.localStorage.removeItem("user");
              router.push("/login");
            })
            .catch((err) => {
              console.log("AXIOS INTERCEPTORS ERR", err);
              reject(error);
            });
        });
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get("/api/csrf-token");
      axios.defaults.headers["X-CSRF-Token"] = data.csrfToken;
    };
    getCsrfToken();
  }, []);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export { Context, Provider };

import React, { useState, createContext, useEffect } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Header from "./Header";

import SignIn from "./SignIn";
import Box from "./Box";
import SignUp from "./SignUp";

import "./index.scss";

const Context = createContext();

let session;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnmount: false,
      refetchOnReconnect: false,
      retry: false
    }
  }
});

const categories = ["new", "all", "sent", "search"];

const App = () => {
  // defines states used for UI control
  const [viewSize, setViewSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [userInfo, setUserInfo] = useState(session);
  const [isAccountsOpen, setIsAccountsOpen] = useState(true);
  const [isWriterOpen, setIsWriterOpen] = useState(false);
  const [replyData, setReplyData] = useState({});
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setViewSize({ width: window.innerWidth, height: window.innerHeight });
    });
  }, []);

  // stores states to export with `Context`
  const contextValue = {
    viewSize,
    userInfo,
    setUserInfo,
    isAccountsOpen,
    setIsAccountsOpen,
    isWriterOpen,
    setIsWriterOpen,
    replyData,
    setReplyData,
    selectedAccount,
    setSelectedAccount,
    selectedCategory,
    setSelectedCategory,
    searchHistory,
    setSearchHistory
  };

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Context.Provider value={contextValue}>
          <BrowserRouter>
            <Header />
            <Switch>
              <Route exact path="/">
                {userInfo ? <Box /> : <Redirect to="/sign-in" />}
              </Route>
              <Route exact path="/sign-in">
                {userInfo ? <Redirect to="/" /> : <SignIn />}
              </Route>
              <Route exact path={["/sign-up", "/sign-up/:id"]}>
                {userInfo ? <Redirect to="/" /> : <SignUp />}
              </Route>
            </Switch>
          </BrowserRouter>
        </Context.Provider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

const mountApp = async () => {
  session = await fetch("/user").then((r) => r.json());
  ReactDOM.render(<App />, document.getElementById("root"));
};

mountApp();

export { Context, categories, queryClient };

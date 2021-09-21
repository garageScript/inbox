import React, { useContext } from "react";
import LeftMenu from "./components/LeftMenu";
import RightMenu from "./components/RightMenu";
import { Context } from "..";

import "./index.scss";

const Header = () => {
  const { viewSize, userInfo, selectedAccount } = useContext(Context);
  let domainName = process.env.REACT_APP_DOMAIN || "mydomain";
  const username = userInfo?.username;
  if (username) domainName = username + "." + domainName;

  const title = !selectedAccount
    ? "@" + domainName
    : viewSize.width > 750
    ? selectedAccount
    : selectedAccount.split("@")[0];

  return (
    <div id="title_bar">
      {userInfo ? <LeftMenu /> : null}
      <h1>{title}</h1>
      {userInfo ? <RightMenu /> : null}
    </div>
  );
};

export default Header;

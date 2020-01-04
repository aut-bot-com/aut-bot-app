import React from "react";
import { useDispatch } from "Utility";
import { Option } from "Utility/option";
import { User } from "Utility/types";
import { signOut } from "Store/actions";
import { useCurrentUser, useSessionStatus } from "Store/slices/session";
import { useOauthUrl } from "Components/LoginButton";
import UserDisplay from "Components/UserDisplay";
import { Dropdown } from "react-bootstrap";
import Icon from "Components/Icon";
import "./style.scss";

const SessionControl: React.FC = () => {
  const user: Option<User> = useCurrentUser();
  const isLoggingIn: boolean = useSessionStatus()[1];
  const dispatch = useDispatch();
  const oauthUrl = useOauthUrl();

  return isLoggingIn ? (
    <Dropdown className="session-dropdown">
      <Dropdown.Toggle id="session-dropdown-button">
        <UserDisplay className="mr-2" user={user.getOrElse(undefined)} />
      </Dropdown.Toggle>
      <Dropdown.Menu alignRight>
        <Dropdown.Item onClick={(): unknown => dispatch(signOut({}))}>
          <Icon name="sign-out-alt" className="mr-2" /> Sign Out
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  ) : (
    <a className="nav-link" href={oauthUrl}>
      Sign In
    </a>
  );
};

export default SessionControl;

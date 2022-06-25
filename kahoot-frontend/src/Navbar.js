import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import DropDownMenu from "./DropDownMenu";

function Navbar() {
  const [username, setUsername] = useState([]);

  useEffect(() => {
    fetch(`/api/v1/getUser`, { credentials: "include", method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.name);
        console.log(data);
      })
      .catch((err) => {
        setUsername(null);
        console.log(err.message);
      });
  }, []);

  const userBtn = {
    btn: (
      <div className="header-user-btn rounded-full w-16 h-16 p-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-14 h-14"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={0.7}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
    ),
  };

  const menuItems = [];

  if (username) {
    menuItems.push(
      {
        id: 1,
        content: (
          <Link to="/preferences" className="dropdown-menu-item">
            <span>{username}</span>
          </Link>
        ),
      },
      {
        id: 2,
        content: (
          <Link to="/create" className="dropdown-menu-item">
            <span>Create quiz</span>
          </Link>
        ),
      },
      {
        id: 3,
        content: (
          <Link to="/logout" className="dropdown-menu-item">
            <span>Log Out</span>
          </Link>
        ),
      }
    );
  } else {
    menuItems.push(
      {
        id: 1,
        content: (
          <Link to="/signin" className="dropdown-menu-item">
            <span>Sign In</span>
          </Link>
        ),
      },
      {
        id: 2,
        content: (
          <Link to="/signup" className="dropdown-menu-item">
            <span>Sign Up</span>
          </Link>
        ),
      }
    );
  }

  return (
    <div className="header-wrapper">
      <header>
        <div className="header-item">
          <div className="header-logo">
            <Link to="/">Kahoot</Link>
          </div>
        </div>
        <div className="header-item">
          <DropDownMenu content={userBtn} menuItems={menuItems} />
        </div>
      </header>
    </div>
  );
}

export default Navbar;

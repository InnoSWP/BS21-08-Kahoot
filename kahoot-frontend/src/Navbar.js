import { Link } from "react-router-dom";
import DropDownMenu from "./DropDownMenu";

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

function Navbar() {
  return (
    <div className="header-wrapper">
      <header>
        <div className="header-item">
          <div className="header-logo">
            <Link to="/">Kahoot</Link>
          </div>
        </div>
        <div className="header-item">
          <DropDownMenu content={userBtn} />
        </div>
      </header>
    </div>
  );
}

export default Navbar;

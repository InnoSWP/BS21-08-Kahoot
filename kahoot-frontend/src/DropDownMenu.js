/* This example requires Tailwind CSS v2.0+ */
import { Link } from "react-router-dom";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

function DropDownMenu({ content }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button>{content.btn}</Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {/* TODO: use Array instead */}
            <Menu.Item>
              <div className="dropdown-menu-item">
                <Link to="/signin">Sign In</Link>
              </div>
            </Menu.Item>
            <Menu.Item>
              <div className="dropdown-menu-item">
                <Link to="/signup">Sign Up</Link>
              </div>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default DropDownMenu;

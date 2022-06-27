/* eslint-disable react/react-in-jsx-scope */
/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import PropTypes from 'prop-types'

function DropDownMenu ({ content, menuItems }) {
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
            {menuItems.map(({ id, itemContent }) => (
              <Menu.Item key={id}>{itemContent}</Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
DropDownMenu.propTypes = {
  content: PropTypes.test.isRequired,
  menuItems: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    itemContent: PropTypes.string.isRequired
  }))
}

export default DropDownMenu

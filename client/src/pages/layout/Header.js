import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { LogoutOutlined } from "@ant-design/icons";

const Header = ({ onLogout }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center mb-4 justify-between px-6 py-4 text-white">
      {/* Heading */}
      <h1 className="text-2xl font-semibold">Data Crarts Decor</h1>

      {/* Right-side Button */}
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="flex items-center px-4 py-2 bg-white text-blue-500 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none">
          Admin
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={onLogout}
                    className={`${
                      active ? "bg-gray-100 text-red-500" : "text-gray-900"
                    } group flex items-center w-full px-4 py-2 text-sm`}
                  >
                    <LogoutOutlined className="mr-3" />
                    Log out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </header>
  );
};

export default Header;

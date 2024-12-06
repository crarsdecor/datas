import React from "react";
import { Tab } from "@headlessui/react";
import Stage1 from "./Stage1";
import Stage2 from "./Stage2";
import Stage3 from "./Stage3";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const WebsiteDashboard = () => {
  return (
    <div className="w-full min-h-screen px-4 py-6 sm:px-0 overflow-auto bg-gray-100">
      <Tab.Group>
        <Tab.List className="flex space-x-4 justify-center bg-blue-900/20 p-2 rounded-md">
          {["Stage1", "Stage2", "Stage3"].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                classNames(
                  "px-4 py-2 text-sm font-medium text-blue-700 leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white shadow border border-gray-200 rounded-md"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          <Tab.Panel className="w-full">
            <Stage1 />
          </Tab.Panel>
          <Tab.Panel className="w-full">
            <Stage2 />
          </Tab.Panel>
          <Tab.Panel className="w-full">
            <Stage3 />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default WebsiteDashboard;

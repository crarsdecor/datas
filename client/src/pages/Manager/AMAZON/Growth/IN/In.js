// import React from "react";
// import { Tab } from "@headlessui/react";
// import FBA from "./FBA/FBA";
// import GPL from "./GPL/GPL";


// function classNames(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// const Operations = () => {
//   return (
//     <div className="w-full min-h-screen px-4 py-6 sm:px-0 overflow-auto bg-gray-100">
//       <Tab.Group as="div" className="flex space-x-6">
//         {/* Tab List */}
//         <Tab.List className="flex flex-col space-y-4 justify-start bg-blue-900/20 p-4 rounded-md">
//           {["FBA", "GPL"].map((tab) => (
//             <Tab
//               key={tab}
//               className={({ selected }) =>
//                 classNames(
//                   "px-4 py-2 text-sm font-medium text-blue-700 leading-5",
//                   "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
//                   selected
//                     ? "bg-white shadow border border-gray-200 rounded-md"
//                     : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
//                 )
//               }
//             >
//               {tab}
//             </Tab>
//           ))}
//         </Tab.List>
        
//         {/* Tab Panels */}
//         <Tab.Panels className="flex-1 p-4 bg-white shadow rounded-md">
//           <Tab.Panel>
//             <FBA />
//           </Tab.Panel>
//           <Tab.Panel>
//             <GPL />
//           </Tab.Panel>
//         </Tab.Panels>
//       </Tab.Group>
//     </div>
//   );
// };

// export default Operations;



import React from "react";
import { Tab } from "@headlessui/react";
import FBA from "./FBA/FBA";
import GPL from "./GPL/GPL";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const In = () => {
  return (
    <div className="w-full min-h-screen px-4 py-6 sm:px-0 overflow-auto bg-gray-100">
      <Tab.Group as="div" className="flex">
        {/* Tab List */}
        <Tab.List className="flex flex-col space-y-4 justify-start bg-blue-900/20 p-4 rounded-md">
          {["FBA", "GPL"].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                classNames(
                  "flex items-center justify-center px-4 py-6 text-sm font-medium text-blue-700 leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white shadow border border-gray-200 rounded-md"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
              style={{
                writingMode: "vertical-rl",
                textOrientation: "upright",
              }}
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        
        {/* Tab Panels */}
        <Tab.Panels className="flex-1 p-4 bg-white shadow rounded-md">
          <Tab.Panel>
            <FBA />
          </Tab.Panel>
          <Tab.Panel>
            <GPL />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default In;

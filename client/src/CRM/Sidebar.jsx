import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router";

const Sidebar = ({ sidebarItems, onItemClick, onSubItemClick }) => {
  const [openItem, setOpenItem] = useState(null);
  const navigate = useNavigate();

  const handleToggle = (title) => {
    setOpenItem(openItem === title ? null : title);
  };

  return (
    <div className="h-screen overflow-y-scroll bg-gray-900 px-4 py-4 text-white">
      {sidebarItems?.map((item, index) => (
        <div key={index} className="mb-2">
          <button
            onClick={() => {
              navigate(`/${item.link}`);
              onItemClick(item.title);
              handleToggle(item.title);
            }}
            className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 px-4 py-2 w-full rounded-lg font-semibold transition-all duration-300"
          >
            <span className="truncate">{item?.title}</span>
            {openItem === item.title ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {openItem === item.title && item.subItems && (
            <div className="pl-4 mt-2 space-y-1">
              {item.subItems.length > 0 ? (
                item.subItems.map((subItem, subIndex) => (
                  <button
                    key={subIndex}
                    onClick={() => {
                      navigate(`${subItem.link}`);
                      onSubItemClick(item.title, subItem);
                    }}
                    className="bg-gray-700 flex items-center hover:bg-gray-600 px-3 py-2 w-full rounded-md font-medium transition-all duration-300 text-white"
                  >
                    <span className="truncate">{subItem.title}</span>
                  </button>
                ))
              ) : (
                <p className="text-gray-400 text-sm px-3">No sub-items</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;

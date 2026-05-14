import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FiMoreVertical } from "react-icons/fi";

interface IDropdownItem {
  label: string;
  onClick: () => void;
}

interface IDropdownMenuProps {
  items: IDropdownItem[];
}

const DropdownTableAction = ({ items }: IDropdownMenuProps) => {
  return (
    <Menu>
      <MenuButton className="p-1.5 rounded-md bg-gray-100 text-gray-500 transition cursor-pointer outline-0">
        <FiMoreVertical className="w-4 h-4" />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="w-52 origin-top-right shadow-xl text-sm/6 text-gray-700 transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0 bg-white rounded-xl border border-gray-200"
      >
        {items.map((item, index) => (
          <MenuItem key={index}>
            <button
              onClick={item.onClick}
              className="group flex w-full items-center gap-2 px-3 py-1.5 hover:bg-blue-600 hover:text-white font-medium cursor-pointer border-b last-of-type:border-b-0 border-gray-200"
            >
              {item.label}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
};

export default DropdownTableAction;

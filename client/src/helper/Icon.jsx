import React from "react";
import {
  LayoutDashboard,
  CalendarArrowUp,
  Table,
  ShoppingBag,
  Package,
  Store,
  CalendarRange,
  ChartNoAxesCombined,
  Settings,
  ContactRound,
  School,
  User,
  EthernetPort,
  Dot,
  X,
  Menu,
  SquareUserRound,
  CircleUser,
  LogOut,
  Bell,
  ShoppingBasket,
  EllipsisVertical,
  BadgeDollarSign,
  Truck,
  HandPlatter,
  Bike,
} from "lucide-react";

const Icons = {
  LayoutDashboard,
  CalendarArrowUp,
  Table,
  ShoppingBag,
  Package,
  Store,
  CalendarRange,
  ChartNoAxesCombined,
  Settings,
  ContactRound,
  School,
  User,
  EthernetPort,
  Dot,
  X,
  Menu,
  SquareUserRound,
  CircleUser,
  LogOut,
  Bell,
  ShoppingBasket,
  EllipsisVertical,
  BadgeDollarSign,
  Truck,
  HandPlatter,
  Bike,
};

const Icon = ({ name }) => {
  const IconComponent = Icons[name];

  return IconComponent ? <IconComponent /> : <span>Icon not found</span>;
};

export default Icon;

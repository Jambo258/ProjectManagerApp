import React from "react";
import { type Icon } from "react-feather";

interface IProps {
  type?: string;
  name?: string;
  icon?: Icon;
  title?: string;
  action?: () => boolean;
  isActive?: () => boolean;
}

const MenuItem = ({
  name, icon, title, action, isActive
}: IProps) => (
  <button
    className={
      `btn-text-xs p-1 h-10 w-10 flex items-center justify-center
      ${isActive?.() ? "bg-primary-200 outline outline-primary-200 hover:bg-primary-100 hover:outline-primary-100" : "bg-primary-100"}`
    }
    onClick={action}
    title={title}
  >
    {icon
      ? <>{React.createElement(icon, {})}</>
      : <>{name}</>
    }
  </button >
);

export default MenuItem;

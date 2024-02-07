import React from "react";
import { type Icon } from "react-feather";

interface IProps {
  type?: string;
  icon?: Icon;
  title?: string;
  action?: () => boolean;
  isActive?: () => boolean;
}

const MenuItem = ({
  icon, title, action, isActive
}: IProps) => (
  <button
    type="button"
    className={
      `btn-text-xs p-1 h-7 w-7 flex items-center justify-center
      ${isActive?.() ? "bg-grayscale-300 outline-none" : "bg-grayscale-0"}`
    }
    onClick={action}
    title={title}
  >
    {icon
      ? <>{React.createElement(icon, {})}</>
      : <>{title}</>
    }
  </button >
);

export default MenuItem;

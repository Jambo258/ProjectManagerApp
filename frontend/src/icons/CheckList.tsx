import { type Icon, type IconProps } from "./OrderedList";

const CheckList: Icon = ({ color = "currentColor", size = 24, ...rest }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <path d="M11 6H22"/>
      <path d="M11 12H22"/>
      <path d="M11 18H22"/>
      <path d="M7.5 4.5H2.5V9.5H7.5V4.5Z" strokeWidth="1.5"/>
      <path d="M2.5 17.65L3.85 19L8.35 14.5" strokeWidth="1.5"/>
    </svg>
  );
};

CheckList.displayName = "CheckList";

export default CheckList;

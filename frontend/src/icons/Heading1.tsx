import { type Icon, type IconProps } from "./OrderedList";

const Heading1: Icon = ({ color = "currentColor", size = 24, ...rest }: IconProps) => {
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
      <path d="M3 12V4M3 12H14M3 12V20"/>
      <path d="M14 4.06V12V19.94" strokeWidth="2.1"/>
      <path d="M19.7474 20.2439V13L17.5 14.25" strokeWidth="1.5"/>
    </svg>
  );
};

Heading1.displayName = "Heading1";

export default Heading1;

import { type Icon, type IconProps } from "./OrderedList";

const Heading2: Icon = ({ color = "currentColor", size = 24, ...rest }: IconProps) => {
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
      <path d="M17.5484 15.1756C17.5814 14.688 17.6846 14.2045 18.0525 13.8285C18.4204 13.4525 18.8588 13.25 19.4492 13.25C20.3335 13.25 20.8624 13.7955 21.0194 14.1178C21.1765 14.4401 21.2426 14.7128 21.2426 15.1756C21.2426 15.3988 21.1103 15.812 20.9781 16.0186C20.8459 16.2252 20.4409 16.7624 20.4409 16.7624L17.35 20.25H21.35" strokeWidth="1.5"/>
    </svg>
  );
};

Heading2.displayName = "Heading2";

export default Heading2;

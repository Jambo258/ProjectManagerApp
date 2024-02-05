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
      <path d="M3 12V4M3 12H14M3 12V20M14 12V20M14 12V4"/>
      <path d="M17.548 15.1756C17.581 14.688 17.6842 14.2045 18.0521 13.8285C18.42 13.4525 18.8584 13.25 19.4488 13.25C20.3331 13.25 20.862 13.7955 21.019 14.1178C21.1761 14.4401 21.2422 14.7128 21.2422 15.1756C21.2422 15.3988 21.1099 15.812 20.9777 16.0186C20.8455 16.2252 20.4405 16.7624 20.4405 16.7624L17.3496 20.25H21.3496" strokeWidth="1.5"/>
    </svg>
  );
};

Heading2.displayName = "Heading2";

export default Heading2;

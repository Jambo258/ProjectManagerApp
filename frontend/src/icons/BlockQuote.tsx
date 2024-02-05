import { type Icon, type IconProps } from "./OrderedList";

const BlockQuote: Icon = ({ color = "currentColor", size = 24, ...rest }: IconProps) => {
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
      <path d="M9 11C9 11 10.2258 9.937 10.5 9C10.7194 8.2504 10.5 7 10.5 7H9.5M14 11C14 11 15.2258 9.937 15.5 9C15.7194 8.2504 15.5 7 15.5 7H14.5"/>
      <path d="M9.59961 7H9.69961M14.5996 7H14.6996" strokeWidth="3.5"/>
    </svg>
  );
};

BlockQuote.displayName = "BlockQuote";

export default BlockQuote;

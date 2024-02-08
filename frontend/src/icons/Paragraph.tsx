import { type Icon, type IconProps } from "./OrderedList";

const Paragraph: Icon = ({ color = "currentColor", size = 24, ...rest }: IconProps) => {
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
      <path d="M7 12H14C15.0609 12 16.0783 11.5786 16.8284 10.8284C17.5786 10.0783 18 9.06087 18 8C18 6.93913 17.5786 5.92172 16.8284 5.17157C16.0783 4.42143 15.0609 4 14 4H7V12ZM7 12V20"/>
    </svg>
  );
};

Paragraph.displayName = "Paragraph";

export default Paragraph;

import { type Icon, type IconProps } from "./OrderedList";

const Strike: Icon = ({ color = "currentColor", size = 24, ...rest }: IconProps) => {
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
      <path d="M3 12L21 12"/>
      <path d="M17.5714 4H9C7.93913 4 6.92172 4.42143 6.17157 5.17157C5.42143 5.92172 5 6.93913 5 8C5 9.06087 5.42143 10.0783 6.17157 10.8284C6.92172 11.5786 7.93913 12 9 12M5 20H14.7143C15.7752 20 16.7926 19.5786 17.5427 18.8284C18.2929 18.0783 18.7143 17.0609 18.7143 16C18.7143 15.4809 18.6134 14.9721 18.4224 14.5"/>

    </svg>
  );
};

Strike.displayName = "Strike";

export default Strike;

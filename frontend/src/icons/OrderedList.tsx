import { FC, SVGAttributes } from "react";

export interface IconProps extends SVGAttributes<SVGElement> {
  color?: string;
  size?: string | number;
}

export type Icon = FC<IconProps>;

const OrderedList: Icon = ({ color = "currentColor", size = 24, ...rest }: IconProps) => {
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
      <path d="M10 6H21"/>
      <path d="M10 12H21"/>
      <path d="M10 18H21"/>
      <path d="M3.40584 15.513C3.43182 15.1299 3.51286 14.75 3.80195 14.4545C4.09104 14.1591 4.43548 14 4.89935 14C5.59416 14 6.00974 14.4286 6.13312 14.6818C6.25649 14.9351 6.30844 15.1494 6.30844 15.513C6.30844 15.6883 6.20455 16.013 6.10065 16.1753C5.99675 16.3377 5.67857 16.7597 5.67857 16.7597L3.25 19.5H6.39286" strokeWidth="1.5"/>
      <path d="M3.75 4.51704L4.99736 4V9.5" strokeWidth="1.5"/>
    </svg>
  );
};

OrderedList.displayName = "OrderedList";

export default OrderedList;

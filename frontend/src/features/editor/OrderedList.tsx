import {forwardRef, FC, SVGAttributes } from "react";

interface IconProps extends SVGAttributes<SVGElement> {
  color?: string;
  size?: string | number;
}

type Icon = FC<IconProps>;

// export const List: Icon;
// export { default as List } from "./icons/list";

const OrderedList = ({ color = "currentColor", size = 24, ...rest }:Icon) => {
  return (
    <svg
      ref={ref}
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
      <path d="M8 6H21"/>
      <path d="M8 12H21"/>
      <path d="M8 18H21"/>
      <path d="M2.48926 17.2876C2.48854 17.1872 2.50578 17.1255 2.55843 17.04C2.61343 16.9506 2.66702 16.9115 2.75925 16.8615C2.86327 16.805 2.93543 16.789 3.05378 16.7901C3.1603 16.791 3.22657 16.8001 3.31931 16.8525C3.40407 16.9004 3.44897 16.9423 3.49781 17.0266C3.54489 17.1078 3.56015 17.1648 3.56029 17.2586C3.56038 17.3205 3.55446 17.3566 3.53352 17.4148C3.5105 17.4788 3.48838 17.5126 3.44426 17.5643C3.39684 17.6199 3.36323 17.6473 3.29923 17.6826C3.21463 17.7292 3.17873 17.7294 3.17873 17.7294C3.17873 17.7294 3.19212 17.7205 3.29923 17.7696C3.39152 17.8119 3.43784 17.8545 3.50005 17.9347C3.54781 17.9963 3.56899 18.0371 3.59376 18.111C3.6198 18.1887 3.62533 18.2366 3.625 18.3185C3.62454 18.4318 3.61628 18.5021 3.56252 18.6019C3.50816 18.7028 3.45593 18.7534 3.35724 18.8116C3.25041 18.8747 3.17335 18.8873 3.04932 18.8897C2.91133 18.8924 2.82529 18.8761 2.70569 18.8072C2.59997 18.7463 2.54439 18.6937 2.48256 18.5885C2.41989 18.4819 2.39952 18.4065 2.4 18.2828" strokeWidth="0.6"/>
      <path d="M2.45666 11.3752C2.46611 11.2359 2.49558 11.0977 2.6007 10.9903C2.70583 10.8829 2.83108 10.825 2.99976 10.825C3.25241 10.825 3.40354 10.9808 3.4484 11.0729C3.49326 11.165 3.51215 11.2429 3.51215 11.3752C3.51215 11.4389 3.47437 11.557 3.43659 11.616C3.39881 11.6751 3.28311 11.8285 3.28311 11.8285L2.39999 12.825H3.54285" strokeWidth="0.65"/>
      <path d="M2.675 5.00801L3.12859 4.82V6.82" strokeWidth="0.65"/>
    </svg>
  );
};

OrderedList.displayName = "OrderedList";

export default OrderedList;

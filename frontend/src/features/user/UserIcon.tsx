import { userColor } from "./userColor";

interface UserIconProps {
  id: number,
  name: string,
  small?: boolean;
}

export const UserIcon = ({id, name, small = false}: UserIconProps) => {
  return (
    <div className={`rounded-full m-0 p-0 ${small ? "w-6 h-6 heading-xxs leading-6 mx-[1px]" : "w-8 h-8 heading-xs leading-8" } 
    ${userColor(id).textColor} text-center ${userColor(id).bg} ${userColor(id).hover} cursor-default`}>
      {name[0].toUpperCase()}
    </div>
  );
};

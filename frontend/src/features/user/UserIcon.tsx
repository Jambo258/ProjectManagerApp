import { userColor } from "./UserColor";

interface UserIconProps {
  id: number,
  name: string
}

export const UserIcon = ({id, name}: UserIconProps) => {
  return (
    <div className={"rounded-full m-0 p-0 w-8 h-8 " + userColor(id).text + " text-center heading-xs leading-8 " + userColor(id).bg + " cursor-default"}>
      {name[0].toUpperCase()}
    </div>  
  );
};

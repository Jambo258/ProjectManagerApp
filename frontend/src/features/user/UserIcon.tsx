interface UserIconProps {
  id: number,
  name: string
}

interface Color {
  bg: string,
  text: string
}

const colors: Color[] = [
  {bg: "bg-red-200", text: "text-grayscale-100"},
  {bg: "bg-purple-200", text: "text-grayscale-100"},
  {bg: "bg-blue-200", text: "font-grayscale-100"},
  {bg: "bg-success-100", text: "text-dark-font"},
  {bg: "bg-caution-100", text: "text-dark-font"},
  {bg: "bg-red-300", text: "text-grayscale-100"},
  {bg: "bg-purple-300", text: "text-grayscale-100"},
  {bg: "bg-blue-300", text: "text-grayscale-100"},
  {bg: "bg-green-300", text: "text-dark-font"},
  {bg: "bg-yellow-300", text: "text-dark-font"}
];

export const UserIcon = ({id, name}: UserIconProps) => {
  return (
    <div className={"rounded-full m-0 p-0 w-8 h-8 " + colors[id % 10].text + " text-center heading-xs leading-8 " + colors[id % 10].bg + " cursor-default"}>
      {name[0].toUpperCase()}
    </div>  
  );
};

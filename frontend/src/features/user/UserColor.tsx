interface Color {
  bg: string,
  border: string,
  textColor: string
}

const colors: Color[] = [
  {bg: "bg-red-200", border: "border-red-200",textColor: "text-grayscale-100"},
  {bg: "bg-purple-200", border: "border-purple-200", textColor: "text-grayscale-100"},
  {bg: "bg-blue-200", border: "border-blue-200", textColor: "font-grayscale-100"},
  {bg: "bg-green-200", border: "border-green-200", textColor: "text-dark-font"},
  {bg: "bg-yellow-200", border: "border-yellow-20", textColor: "text-dark-font"},
  {bg: "bg-red-300", border: "border-red-300", textColor: "text-grayscale-100"},
  {bg: "bg-purple-300", border: "border-purple-300", textColor: "text-grayscale-100"},
  {bg: "bg-blue-300", border: "border-blue-300", textColor: "text-grayscale-100"},
  {bg: "bg-green-300", border: "border-green-300", textColor: "text-dark-font"},
  {bg: "bg-yellow-300", border: "border-yellow-300", textColor: "text-dark-font"}
];

export const userColor = (id: number) => {
  return {textColor: colors[id % 10].textColor, border: colors[id % 10].border, bg: colors[id % 10].bg};
};

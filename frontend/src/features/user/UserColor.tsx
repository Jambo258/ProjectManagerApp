interface Color {
  bg: string,
  textColor: string
}

const colors: Color[] = [
  {bg: "bg-red-200", textColor: "text-grayscale-100"},
  {bg: "bg-purple-200", textColor: "text-grayscale-100"},
  {bg: "bg-blue-200", textColor: "font-grayscale-100"},
  {bg: "bg-green-200", textColor: "text-dark-font"},
  {bg: "bg-yellow-200", textColor: "text-dark-font"},
  {bg: "bg-red-300", textColor: "text-grayscale-100"},
  {bg: "bg-purple-300", textColor: "text-grayscale-100"},
  {bg: "bg-blue-300", textColor: "text-grayscale-100"},
  {bg: "bg-green-300", textColor: "text-dark-font"},
  {bg: "bg-yellow-300", textColor: "text-dark-font"}
];

export const userColor = (id: number) => {
  return {textColor: colors[id % 10].textColor, bg: colors[id % 10].bg};
};

interface Color {
  bg: string,
  text: string
}

const colors: Color[] = [
  {bg: "bg-red-200", text: "text-grayscale-100"},
  {bg: "bg-purple-200", text: "text-grayscale-100"},
  {bg: "bg-blue-200", text: "font-grayscale-100"},
  {bg: "bg-green-200", text: "text-dark-font"},
  {bg: "bg-yellow-200", text: "text-dark-font"},
  {bg: "bg-red-300", text: "text-grayscale-100"},
  {bg: "bg-purple-300", text: "text-grayscale-100"},
  {bg: "bg-blue-300", text: "text-grayscale-100"},
  {bg: "bg-green-300", text: "text-dark-font"},
  {bg: "bg-yellow-300", text: "text-dark-font"}
];

export const userColor = (id: number) => {
  return {text: colors[id % 10].text, bg: colors[id % 10].bg};
};

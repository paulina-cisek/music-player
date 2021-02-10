export const colors = [
  '#c0e185',
  '#8dd4b5',
  '#a4cbd4',
  '#e185a8',
  '#e1ac85',
  '#e1cd85',
  '#c398ea',
  '#e1858c',
  '#ac85e1',
];

export const getRandomColor = () => {
  return colors[getRandomInt(0, colors.length - 1)];
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

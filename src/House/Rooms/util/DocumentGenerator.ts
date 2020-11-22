export const generateDocument = (n) => {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 10);
  const dd = targetDate.getDate() + n * 3;
  const mm = targetDate.getMonth() + 1 + (n % 2 === 0 ? 1 : 0) + 1;
  const yyyy = targetDate.getFullYear() + 231;
  const dateString = yyyy + "" + dd + "" + mm;
  const code = "Log" + dateString;
  console.log(code, yyyy, dd, mm);
  return {
    code: code,
    color: getRandomColor(),
    solved: false,
    x: 5 + 10 * Math.round(Math.random() * 7),
    y: 10 + 5 * Math.round(Math.random() * 14),
  };
};

export function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const COLORS = ["#2d5a4b", "#8a4b3c", "#3d4e7a", "#7a6a2f", "#5b3f6e", "#33606e"];

// same title always gets the same colour
export default function coverColor(title = "") {
  let sum = 0;
  for (let i = 0; i < title.length; i++) sum += title.charCodeAt(i);
  return COLORS[sum % COLORS.length];
}

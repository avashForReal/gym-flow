export const scrollInputIntoView = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.scrollIntoView({ behavior: "smooth", block: "center" });
};

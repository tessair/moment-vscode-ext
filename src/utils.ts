export function generateFormattedDateAndFileName() {
  const date = new Date();
  const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(
    date.getMonth() + 1
  ).padStart(2, '0')}-${date.getFullYear()}`;
  const fileName = `${formattedDate}.md`;
  return { formattedDate, fileName };
}

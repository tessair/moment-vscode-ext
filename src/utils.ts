/**
 * Generates a formatted date string and a corresponding file name.
 *
 * @returns An object containing:
 * - `formattedDate`: A string representing the current date in the format "DD-MM-YYYY".
 * - `fileName`: A string representing the file name in the format "DD-MM-YYYY.md".
 */
export function generateFormattedDateAndFileName() {
  const date = new Date();
  const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(
    date.getMonth() + 1
  ).padStart(2, '0')}-${date.getFullYear()}`;
  const fileName = `${formattedDate}.md`;
  return { formattedDate, fileName };
}

import * as vscode from 'vscode';
import { generateFormattedDateAndFileName } from './utils';

/**
 * Opens the daily note file in the editor based on the configured daily notes path
 * and the current date. If the daily notes path is not set, an error message is displayed.
 *
 * The function retrieves the daily notes path from the `moment.dailyNotesPath` configuration,
 * generates the formatted date and file name, and attempts to open the corresponding file.
 * If successful, the file is displayed in the editor, and a success message is shown.
 * If any errors occur during the process, appropriate error messages are displayed.
 *
 * @returns A function that performs the operation of opening the daily note.
 *
 * @throws Will display an error message if the daily notes path is not set or if
 *         there are issues opening the file.
 */
export function openDailyNote(): (...args: any[]) => any {
  return () => {
    const folderPath = vscode.workspace
      .getConfiguration('moment')
      .get('dailyNotesPath') as string | undefined;

    if (!folderPath) {
      vscode.window.showErrorMessage('Daily notes path is not set!');
      return;
    }

    const { formattedDate, fileName } = generateFormattedDateAndFileName();

    vscode.workspace
      .openTextDocument(vscode.Uri.parse(`${folderPath}/${fileName}`))
      .then(
        (doc) => {
          vscode.window.showTextDocument(doc).then(
            () => {
              vscode.window.showInformationMessage(
                `Viewing daily note for ${formattedDate}`
              );
            },
            (err) => {
              vscode.window.showErrorMessage(err.message);
            }
          );
        },
        (err) => {
          vscode.window.showErrorMessage(err.message);
        }
      );
  };
}

/**
 * Creates a daily note file in the specified folder path using a template.
 *
 * The function generates a formatted date and file name, retrieves the daily note
 * template from the VS Code workspace configuration, and prepends the current date
 * as a header to the template content. It then creates the file in the specified
 * folder, writes the content to it, and opens the file in the editor.
 *
 * @param folderPath - The absolute path to the folder where the daily note file will be created.
 *
 * @remarks
 * - The daily note template is retrieved from the `moment.dailyNoteTemplate` configuration.
 * - If the template is not set, an error message is displayed to the user.
 * - The file is named based on the generated formatted date and file name.
 * - The function uses the VS Code API to create, write, and open the file.
 *
 * @throws Will display an error message if the daily note template is not set or if
 * there is an issue opening the created file in the editor.
 */
export function createDailyNote(folderPath: string) {
  const { formattedDate, fileName } = generateFormattedDateAndFileName();

  const fileContent = vscode.workspace
    .getConfiguration('moment')
    .get('dailyNoteTemplate') as string;

  if (!fileContent) {
    vscode.window.showErrorMessage('Daily note template is not set!');
    return;
  }

  // append a new line at the beginning of the file with the current date
  const dateLine = `# Daily note: ${formattedDate}\n\n`;

  const fileContentWithDate = dateLine + fileContent;

  // create the file
  vscode.workspace.fs.writeFile(
    vscode.Uri.parse(`${folderPath}/${fileName}`),
    new TextEncoder().encode(fileContentWithDate)
  );

  vscode.workspace
    .openTextDocument(vscode.Uri.parse(`${folderPath}/${fileName}`))
    .then((doc) => {
      vscode.window.showTextDocument(doc).then(
        () => {
          vscode.window.showInformationMessage(
            `Daily note created successfully!`
          );
        },
        (err) => {
          vscode.window.showErrorMessage(err.message);
        }
      );
    });
}

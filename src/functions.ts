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
 * Creates a daily note file in the specified folder path.
 *
 * This function generates a daily note file using a predefined template
 * and appends the current date as a header at the beginning of the file.
 * If the folder path or the daily note template is not set, it displays
 * an error message to the user.
 *
 * @param folderPath - The path to the folder where the daily note will be created.
 *                     If undefined, an error message will be shown.
 *
 * @remarks
 * - The daily note template is retrieved from the 'moment.dailyNoteTemplate'
 *   configuration in the VS Code workspace settings.
 * - The file is created with the current date as a header, followed by the
 *   template content.
 * - After creation, the file is opened in the editor, and a success message
 *   is displayed. If an error occurs during this process, an error message
 *   is shown instead.
 *
 * @throws Will display an error message if:
 * - The folder path is not provided.
 * - The daily note template is not set in the configuration.
 */
export function createDailyNote(folderPath: string | undefined): void {
  if (!folderPath) {
    vscode.window.showErrorMessage('Folder path is not set!');
    return;
  }

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

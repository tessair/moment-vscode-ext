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

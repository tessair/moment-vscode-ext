import * as vscode from 'vscode';
import { generateFormattedDateAndFileName } from './utils';

/**
 * Opens the daily note file for the current date in the configured daily notes folder.
 *
 * This function retrieves the folder path for daily notes from the user's configuration
 * and attempts to open the daily note file for the current date. If the file does not exist,
 * it triggers the creation of the daily note and reopens it. If the folder path is not set,
 * an error message is displayed to the user.
 *
 * @returns A function that, when executed, performs the operation of opening the daily note.
 *
 * @throws Will display an error message if the daily notes path is not configured.
 * @throws Will display an error message if there is an issue opening the daily note file.
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
        () => {
          manageDailyNoteCreation()();
          openDailyNote()();
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

/**
 * Manages the creation of a daily note file in a specified folder.
 *
 * This function retrieves the folder path for daily notes from the user's
 * VS Code configuration. If the folder path is not set, it prompts the user
 * to input a folder path, updates the configuration, and creates the daily note
 * in the specified folder. If the folder path is already set, it directly creates
 * the daily note in the configured folder.
 *
 * @returns A function that, when executed, handles the daily note creation process.
 */
export function manageDailyNoteCreation(): (...args: any[]) => any {
  return () => {
    let folderPath = vscode.workspace
      .getConfiguration('moment')
      .get('dailyNotesPath') as string | undefined;

    if (!folderPath) {
      // get the current workspace folder path
      folderPath = vscode.workspace.workspaceFolders
        ? vscode.workspace.workspaceFolders[0].uri.path
        : '';
      vscode.window
        .showInputBox({
          prompt: 'Enter the folder path where you want to save the file',
          value: folderPath,
        })
        .then((folderPathInput) => {
          if (folderPathInput) {
            folderPath = folderPathInput;

            // update the configuration with the new folder path
            vscode.workspace
              .getConfiguration('moment')
              .update('dailyNotesPath', folderPath, true)
              .then(
                () => {
                  createDailyNote(folderPath);
                },
                (err) => {
                  vscode.window.showErrorMessage(err.message);
                }
              );
          }
        });
    } else {
      createDailyNote(folderPath);
    }
  };
}

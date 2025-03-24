// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { generateFormattedDateAndFileName } from './utils';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const createNoteCommandHandle = vscode.commands.registerCommand(
    'moment.createDailyNote',
    () => {
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
                    const { formattedDate, fileName } =
                      generateFormattedDateAndFileName();

                    const fileContent = vscode.workspace
                      .getConfiguration('moment')
                      .get('dailyNoteTemplate') as string;

                    if (!fileContent) {
                      vscode.window.showErrorMessage(
                        'Daily note template is not set!'
                      );
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
                      .openTextDocument(
                        vscode.Uri.parse(`${folderPath}/${fileName}`)
                      )
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
                  },
                  (err) => {
                    vscode.window.showErrorMessage(err.message);
                  }
                );
            }
          });
      } else {
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
    }
  );

  context.subscriptions.push(createNoteCommandHandle);

  const viewNoteCommandHandle = vscode.commands.registerCommand(
    'moment.viewDailyNote',
    openDailyNote()
  );

  context.subscriptions.push(viewNoteCommandHandle);
}

function openDailyNote(): (...args: any[]) => any {
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

// This method is called when your extension is deactivated
export function deactivate() {}

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const createNoteCommandHandle = vscode.commands.registerCommand(
    'moment.createDailyNote',
    () => {
      // const folderPath = vscode.workspace
      //   .getConfiguration('moment')
      //   .get('dailyNotesFolder');
      // if (!folderPath) {
      //   vscode.window.showErrorMessage('Daily notes folder not set!');
      //   return;
      // }

      // create a new .md file that will have as name the current date in the format DD-MM-YYYY
      const { formattedDate, fileName } = generateFormattedDateAndFileName();

      // read the daily note template from the extension configuration

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

      vscode.workspace
        .openTextDocument(vscode.Uri.parse(`untitled:${fileName}`))
        .then((doc) => {
          vscode.window.showTextDocument(doc).then(() => {
            vscode.window.showInformationMessage('Daily note created!');

            vscode.window.activeTextEditor?.edit((editBuilder) => {
              editBuilder.insert(
                new vscode.Position(0, 0),
                fileContentWithDate
              );
            });
          });
        });
    }
  );

  context.subscriptions.push(createNoteCommandHandle);

  const viewNoteCommandHandle = vscode.commands.registerCommand(
    'moment.viewDailyNote',
    () => {
      // The code you place here will
      // be
      // executed every time your command is executed
      vscode.window.showInformationMessage('View Daily Note!');
    }
  );

  context.subscriptions.push(viewNoteCommandHandle);
}

function generateFormattedDateAndFileName() {
  const date = new Date();
  const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(
    date.getMonth() + 1
  ).padStart(2, '0')}-${date.getFullYear()}`;
  const fileName = `${formattedDate}.md`;
  return { formattedDate, fileName };
}

// This method is called when your extension is deactivated
export function deactivate() {}

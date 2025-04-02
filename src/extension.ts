// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { manageDailyNoteCreation, openDailyNote } from './functions';
import { manageTodoAdd } from './tree';
import { loadTodos, updateTreeView } from './utils';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Load todos on activation
  loadTodos();
  updateTreeView();
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const createNoteCommandHandle = vscode.commands.registerCommand(
    'moment.createDailyNote',
    manageDailyNoteCreation()
  );

  const viewNoteCommandHandle = vscode.commands.registerCommand(
    'moment.viewDailyNote',
    openDailyNote()
  );

  context.subscriptions.push(createNoteCommandHandle, viewNoteCommandHandle);
  const todoAddCommandHandle = vscode.commands.registerCommand(
    'moment.add',
    manageTodoAdd()
  );

  context.subscriptions.push(todoAddCommandHandle);
}

// This method is called when your extension is deactivated
export function deactivate() {}

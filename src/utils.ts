import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export let todoTreeView: vscode.TreeView<any> | undefined;
export let todoData: string[] = [];

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

function getWorkspaceRoot(): string | undefined {
  if (
    !vscode.workspace.workspaceFolders ||
    vscode.workspace.workspaceFolders.length === 0
  ) {
    return undefined;
  }
  return vscode.workspace.workspaceFolders[0].uri.fsPath;
}

/**
 * Loads the TODO items from a `todos.md` file located in the root of the current workspace.
 *
 * This function checks if the `todos.md` file exists in the workspace directory. If the file
 * exists, it reads its content and extracts lines that start with `- [` (indicating a TODO item).
 * If the file does not exist, it initializes an empty TODO list.
 *
 * @remarks
 * - The function assumes that the workspace root path is accessible via `vscode.workspace.rootPath`.
 * - The TODO items are expected to follow a specific format (lines starting with `- [`).
 *
 * @throws Will throw an error if the file exists but cannot be read.
 */
export function loadTodos() {
  const workspaceRoot = getWorkspaceRoot();
  if (!workspaceRoot) {
    todoData = [];
    return;
  }
  const filePath = path.join(workspaceRoot, 'todos.md');
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    todoData = fileContent.split('\n').filter((line) => line.startsWith('- ['));
  } else {
    todoData = [];
  }
}

/**
 * Saves the current list of todos to a file named `todos.md` in the root of the workspace.
 *
 * This function constructs the file path using the workspace's root directory,
 * joins the todo data into a single string separated by newlines, and writes
 * the content to the file in UTF-8 encoding.
 *
 * @throws {Error} If there is an issue writing to the file.
 */
export function saveTodos() {
  const workspaceRoot = getWorkspaceRoot();
  if (!workspaceRoot) {
    throw new Error('Workspace root path is not set.');
  }
  const filePath = path.join(workspaceRoot, 'todos.md');
  const content = todoData.join('\n');
  fs.writeFileSync(filePath, content, 'utf-8');
}

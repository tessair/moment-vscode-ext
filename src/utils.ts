import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { TodoTreeDataProvider } from './TodoTreeDataProvider';

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
  const filePath = path.join(vscode.workspace.rootPath || '', 'todos.md');
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
  const filePath = path.join(vscode.workspace.rootPath || '', 'todos.md');
  const content = todoData.join('\n');
  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * Updates the Tree View for the "todoList" in the VS Code extension.
 *
 * This function creates a new `TodoTreeDataProvider` using the current `todoData`,
 * maps the data into `TreeItem` objects, and assigns it to the Tree View. If a
 * previous instance of the Tree View exists, it disposes of it before creating a new one.
 *
 * @remarks
 * - Each `todo` item is represented as a `TreeItem` with no collapsible state.
 * - The Tree View is identified by the ID 'todoList'.
 *
 * @throws Will dispose of the existing Tree View if it is already initialized.
 */
export function updateTreeView() {
  const todoItems = todoData.map(
    (todo) => new vscode.TreeItem(todo, vscode.TreeItemCollapsibleState.None)
  );

  const todoTreeProvider = new TodoTreeDataProvider(todoItems);

  if (todoTreeView) {
    todoTreeView.dispose();
  }

  todoTreeView = vscode.window.createTreeView('todoList', {
    treeDataProvider: todoTreeProvider,
  });
}

/**
 * Toggles the completion status of a todo item at the specified index.
 * If the todo item is marked as completed (`- [x]`), it will be updated to not completed (`- [ ]`),
 * and vice versa.
 *
 * @param todoIndex - The index of the todo item in the `todoData` array to toggle.
 *
 * Side Effects:
 * - Updates the `todoData` array with the modified todo item.
 * - Calls `saveTodos()` to persist the changes.
 * - Calls `updateTreeView()` to refresh the UI representation of the todos.
 */
export function toggleTodoCompletion(todoIndex: number) {
  const line = todoData[todoIndex];
  const updatedLine = line.startsWith('- [x]')
    ? line.replace('- [x]', '- [ ]')
    : line.replace('- [ ]', '- [x]');
  todoData[todoIndex] = updatedLine;
  saveTodos();
  updateTreeView();
}

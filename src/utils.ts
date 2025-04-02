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

// This function reads the markdown file and loads todos
export function loadTodos() {
  const filePath = path.join(vscode.workspace.rootPath || '', 'todos.md');
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    todoData = fileContent.split('\n').filter((line) => line.startsWith('- ['));
  } else {
    todoData = [];
  }
}

// This function saves todos back to the markdown file
export function saveTodos() {
  const filePath = path.join(vscode.workspace.rootPath || '', 'todos.md');
  const content = todoData.join('\n');
  fs.writeFileSync(filePath, content, 'utf-8');
}

// This function updates the TreeView
export function updateTreeView() {
  const todoItems = todoData.map((todo) => ({
    label: todo,
    collapsibleState: vscode.TreeItemCollapsibleState.None,
  }));

  const todoTree = new vscode.TreeDataProvider<any>({
    getChildren: () => todoItems,
    getTreeItem: (item) => item,
  });

  if (todoTreeView) {
    todoTreeView.dispose();
  }

  todoTreeView = vscode.window.createTreeView('todoList', {
    treeDataProvider: todoTree,
  });
}

// This command toggles the completion of a todo item
export function toggleTodoCompletion(todoIndex: number) {
  const line = todoData[todoIndex];
  const updatedLine = line.startsWith('- [x]')
    ? line.replace('- [x]', '- [ ]')
    : line.replace('- [ ]', '- [x]');
  todoData[todoIndex] = updatedLine;
  saveTodos();
  updateTreeView();
}

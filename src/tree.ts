import { saveTodos, todoData, updateTreeView } from './utils';
import * as vscode from 'vscode';

/**
 * Creates a function to handle adding a new todo item.
 *
 * This function prompts the user to input a new todo item using a VS Code input box.
 * If the user provides input, the new todo is added to the `todoData` list, saved,
 * and the tree view is updated to reflect the changes.
 *
 * @returns A function that, when executed, handles the process of adding a new todo item.
 */
export function manageTodoAdd(): (...args: any[]) => any {
  return () => {
    vscode.window.showInputBox({ prompt: 'Enter a new todo' }).then((input) => {
      if (input) {
        todoData.push(`- [ ] ${input}`);
        saveTodos();
        updateTreeView();
      }
    });
  };
}

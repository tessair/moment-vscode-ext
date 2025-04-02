import {
  saveTodos,
  todoData,
  toggleTodoCompletion,
  updateTreeView,
} from './utils';
import * as vscode from 'vscode';

/**
 * Creates a function that prompts the user to input the index of a todo item
 * and toggles its completion status if the input is valid.
 *
 * @returns A function that, when executed, displays an input box for the user
 *          to specify the index of the todo item to toggle.
 *
 * @remarks
 * - The function uses `vscode.window.showInputBox` to prompt the user.
 * - The input is parsed as an integer and validated to ensure it corresponds
 *   to an existing todo item in the `todoData` array.
 * - If the input is valid, the `toggleTodoCompletion` function is called
 *   with the specified index.
 */
export function manageTodoListToggle(): (...args: any[]) => any {
  return () => {
    vscode.window
      .showInputBox({ prompt: 'Enter the number of the todo to toggle' })
      .then((input) => {
        const index = parseInt(input || '');
        if (!isNaN(index) && todoData[index]) {
          toggleTodoCompletion(index);
        }
      });
  };
}

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

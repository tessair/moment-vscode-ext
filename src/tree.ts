import { saveTodos, todoData, toggleTodoCompletion, updateTreeView } from './utils';

export function manageTodoListToggle() {
    vscode.window.showInputBox({ prompt: 'Enter the number of the todo to toggle' }).then(input => {
        const index = parseInt(input || '');
        if (!isNaN(index) && todoData[index]) {
            toggleTodoCompletion(index);
        }
    });
}

export function manageTodoAdd() {
    vscode.window.showInputBox({ prompt: 'Enter a new todo' }).then(input => {
        if (input) {
          todoData.push(`- [ ] ${input}`);
          saveTodos();
          updateTreeView();
        }
      });
}
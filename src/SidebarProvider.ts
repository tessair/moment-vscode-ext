import * as vscode from 'vscode';

export class SidebarProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;
    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };
    console.log('SidebarProvider:resolveWebviewView');

    webviewView.webview.html = this.getHtml();
  }

  private getHtml(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Todo List</title>
      </head>
      <body>
        <h2>Todo List</h2>
        <ul id="tasks"></ul>
        <input type="text" id="taskInput" placeholder="New Task">
        <button onclick="addTask()">Add</button>
        <script>
          function addTask() {
            const input = document.getElementById("taskInput");
            const list = document.getElementById("tasks");
            const li = document.createElement("li");
            li.textContent = input.value;
            list.appendChild(li);
            input.value = "";
          }
        </script>
      </body>
      </html>
    `;
  }
}

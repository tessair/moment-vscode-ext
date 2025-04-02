import * as vscode from 'vscode';

export class TodoTreeDataProvider implements vscode.TreeDataProvider<any> {
  private _onDidChangeTreeData: vscode.EventEmitter<any | undefined | void> =
    new vscode.EventEmitter<any | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<any | undefined | void> =
    this._onDidChangeTreeData.event;

  constructor(private todoItems: vscode.TreeItem[]) {}

  getChildren(): vscode.TreeItem[] {
    return this.todoItems;
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  refresh(todoItems: vscode.TreeItem[]): void {
    this.todoItems = todoItems;
    this._onDidChangeTreeData.fire(null);
  }
}

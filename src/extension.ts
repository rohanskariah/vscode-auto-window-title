// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';


function changeWindowTitle(force: boolean = false) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
        const workspaceFolder = workspaceFolders[0];  // Assumes this is a single folder workspace
        const settingsPath = path.join(workspaceFolder.uri.fsPath, '.vscode', 'settings.json');

        // Check if settings.json exists and 'window.title' is not set
        if (!fs.existsSync(settingsPath) || !fs.readFileSync(settingsPath).includes('"window.title"') || force) {
            vscode.window.showInputBox({
                prompt: 'Set a title for this project window',
                placeHolder: 'Enter your project title',
            }).then(title => {
                if (title) {
                    const vscodeDir = path.join(workspaceFolder.uri.fsPath, '.vscode');
                    if (!fs.existsSync(vscodeDir)) {
                        fs.mkdirSync(vscodeDir);
                    }

                    // Read existing settings or initialize an empty object
                    let settingsData: { [key: string]: any } = {};
                    if (fs.existsSync(settingsPath)) {
                        const existingData = fs.readFileSync(settingsPath, 'utf8');
                        settingsData = existingData ? JSON.parse(existingData) : {};
                    }
                    
                    // Set the new title
                    settingsData["window.title"] = title;

                    // Write the updated settings back to the file
                    fs.writeFileSync(settingsPath, JSON.stringify(settingsData, null, 4), 'utf8');
                    vscode.window.showInformationMessage(`Window title set to: ${title}`);
                }
            });
        }
    }
}

export function activate(context: vscode.ExtensionContext) {
	// Activate on window open
    changeWindowTitle();

    // Register the command to change window title manually
    let disposable = vscode.commands.registerCommand('auto-window-title.changeWindowTitle', () => {
        changeWindowTitle(true);
    });

    context.subscriptions.push(disposable);
}


// This method is called when your extension is deactivated
export function deactivate() {}

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "generator-alt-image" is now active!');


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const extensionName = "generator-alt-image";
	const commands = {
		getImage: `${extensionName}.getImage`,
		getAlt: `${extensionName}.getAlt`
	};
	const disposables = [
		vscode.commands.registerCommand(commands.getImage, () => {
			console.log("logic to get image");

			vscode.window.showInformationMessage('Hello World from getImage!');
		}),
		vscode.commands.registerCommand(commands.getAlt, () => {
			console.log("logic to get alt");

			vscode.window.showInformationMessage('Hello World from getAlt!');
		})
	];

	disposables.forEach((disposable) => context.subscriptions.push(disposable));
}

// This method is called when your extension is deactivated
export function deactivate() { }

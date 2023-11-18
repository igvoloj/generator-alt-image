import * as vscode from 'vscode';
import { handleChangeText } from './utils';

export function activate(context: vscode.ExtensionContext) {
	setCommands(context);
	setTriggers(context);

}

// This method is called when your extension is deactivated
export function deactivate() { }


function setCommands(context: vscode.ExtensionContext) {
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

function setTriggers(context: vscode.ExtensionContext) {
	vscode.workspace.onDidChangeTextDocument((event) => handleChangeText(event));
}

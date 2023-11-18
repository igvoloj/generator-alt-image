import * as vscode from 'vscode';
import { createFolderImageInRoot, handleChangeText, setAltInImage, setSrcInImage } from './utils';

export function activate(context: vscode.ExtensionContext) {
	setCommands(context);
	setTriggers();
}

export function deactivate() { }


function setCommands(context: vscode.ExtensionContext) {
	const extensionName = "generator-alt-image";
	const commands = {
		getImage: `${extensionName}.getImage`,
		getAlt: `${extensionName}.getAlt`,
		createImageFolder: `${extensionName}.createImageFolder`,
	};
	const disposables = [
		vscode.commands.registerCommand(commands.getImage, () => setSrcInImage()),
		vscode.commands.registerCommand(commands.getAlt, () => setAltInImage()),
		vscode.commands.registerCommand(commands.createImageFolder, () => createFolderImageInRoot()),
	];

	disposables.forEach((disposable) => context.subscriptions.push(disposable));
}

function setTriggers() {
	vscode.workspace.onDidChangeTextDocument((event) => handleChangeText(event));
}

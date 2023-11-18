import * as vscode from 'vscode';
import { handleChangeText, setAltInImage, setSrcInImage } from './utils';

export function activate(context: vscode.ExtensionContext) {
	setCommands(context);
	setTriggers();

}

export function deactivate() { }


function setCommands(context: vscode.ExtensionContext) {
	const extensionName = "generator-alt-image";
	const commands = {
		getImage: `${extensionName}.getImage`,
		getAlt: `${extensionName}.getAlt`
	};
	const disposables = [
		vscode.commands.registerCommand(commands.getImage, () => setSrcInImage()),
		vscode.commands.registerCommand(commands.getAlt, () => setAltInImage())
	];

	disposables.forEach((disposable) => context.subscriptions.push(disposable));
}

function setTriggers() {
	vscode.workspace.onDidChangeTextDocument((event) => handleChangeText(event));
}

import * as vscode from 'vscode';
import fs from 'fs';
import path from 'path';
let lineText = '';
let currentCursorPosition = 0;
export function handleChangeText(event: vscode.TextDocumentChangeEvent) {
    const tagTrigger = "<img";
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('Open a file first to manipulate text selection');
        return;
    }
    const { selection } = editor;
    const text = editor.document.lineAt(selection.active.line).text;
    if (!text.includes(tagTrigger)) {
        return;
    }
    lineText = text;
    currentCursorPosition = selection.active.character;
}

export function checkSrc(textLine: string, currentCursorPosition: number, textToReplace: string) {
    const srcPosition = textLine.indexOf("src");
    checkAttribute(textLine, currentCursorPosition, textToReplace, srcPosition);
}
export function checkAlt(textLine: string, currentCursorPosition: number, textToReplace: string) {
    const altPosition = textLine.indexOf("alt");
    checkAttribute(textLine, currentCursorPosition, textToReplace, altPosition);
}
export function getAttributeValue(attributeValidated: RegExpMatchArray | null): string | null {
    if (!attributeValidated) {
        return null;
    }
    const value = attributeValidated[0].split("=")[1];
    const valueWithoutQuotes = value.replace(/"/g, "");
    if (valueWithoutQuotes === '') {
        return null;
    }
    return valueWithoutQuotes;
}
export function checkAttribute(textLine: string, currentCursorPosition: number, textToReplace: string, attributePosition: number) {
    let toSrc = "";
    let diff = 0;
    const secondQuoteIndex = textLine.indexOf('"', attributePosition + 5);
    if (currentCursorPosition > attributePosition) {
        toSrc = "left";
        diff = Math.abs(attributePosition - currentCursorPosition) - 4;
    } else {
        toSrc = "right";
        diff = Math.abs(attributePosition - currentCursorPosition) + 4;
    }

    if (currentCursorPosition === attributePosition) {
        return;
    }
    vscode.commands.executeCommand("cursorMove", { to: toSrc, by: "character", value: diff });
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    editor.edit((editBuilder) => {
        const srcRange = new vscode.Range(
            new vscode.Position(editor.selection.active.line, attributePosition + 5),
            new vscode.Position(editor.selection.active.line, secondQuoteIndex)
        );
        editBuilder.replace(srcRange, textToReplace);
    });
}
export function setSrcInImage() {
    const src = "mockedSRC";
    checkSrc(lineText, currentCursorPosition, src);
}
export function setAltInImage() {
    const alt = "mockedAlt";
    checkAlt(lineText, currentCursorPosition, alt);
}
export async function createFolderImageInRoot() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showInformationMessage('Open a folder first to create image folder');
        return;
    }
    const rootFolder = workspaceFolders[0].uri.fsPath;
    const folderImagesName = "images";
    const folderPublicName = "public";
    const folderPublicPath = path.join(rootFolder, folderPublicName);
    const folderImagePublicPath = path.join(folderPublicPath, folderImagesName);
    if (fs.existsSync(folderImagePublicPath)) {
        vscode.window.showInformationMessage('Folder already exists');
        return;
    }
    fs.mkdirSync(folderPublicPath);
    fs.mkdirSync(folderImagePublicPath);
    vscode.window.showInformationMessage('Folder created');
}
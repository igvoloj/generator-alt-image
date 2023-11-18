import * as vscode from 'vscode';
let lineText = '';
let currentCursorPosition = 0;
export function handleChangeText(event: vscode.TextDocumentChangeEvent) {
    const tagTrigger = "<img";
    //const tagClosedRegex = /<img[^>]*>/g;
    //const documentText = event.document.getText();
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const { selection } = editor;
    const text = editor.document.lineAt(selection.active.line).text;
    if (!text.includes(tagTrigger)) {
        return;
    }
    lineText = text;
    currentCursorPosition = selection.active.character;
    /* const isClosed = documentText.match(tagClosedRegex);
    if (!isClosed) {
        return;
    } */

    //checkSrc(text, currentCursorPosition);


}

export function checkSrc(textLine: string, currentCursorPosition: number, textToReplace: string) {
    const srcRegex = /src="([^"]*)"/g;
    const hasSrc = textLine.match(srcRegex);
    const srcPosition = textLine.indexOf("src");
    let toSrc = "";
    let diff = 0;

    const secondQuoteIndex = textLine.indexOf('"', srcPosition + 5);
    if (currentCursorPosition > srcPosition) {
        toSrc = "left";
        diff = Math.abs(srcPosition - currentCursorPosition) - 4;
    } else {
        toSrc = "right";
        diff = Math.abs(srcPosition - currentCursorPosition) + 4;
    }

    if (currentCursorPosition !== srcPosition) {
        vscode.commands.executeCommand("cursorMove", { to: toSrc, by: "character", value: diff });
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        editor.edit((editBuilder) => {
            const srcRange = new vscode.Range(
                new vscode.Position(editor.selection.active.line, srcPosition + 5),
                new vscode.Position(editor.selection.active.line, secondQuoteIndex)
            );
            editBuilder.replace(srcRange, textToReplace);
        });
    }

}
function checkAlt(textLine: string, currentCursorPosition: number, textToReplace: string) {
    const altRegex = /alt="([^"]*)"/g;
    const hasAlt = textLine.match(altRegex);
    const altPosition = textLine.indexOf("alt");
    let toAlt = '';
    let diff = 0;
    const secondQuoteIndex = textLine.indexOf('"', altPosition + 5);

    if (currentCursorPosition > altPosition) {
        toAlt = "left";
        diff = Math.abs(altPosition - currentCursorPosition) - 4;
    } else {
        toAlt = "right";
        diff = Math.abs(altPosition - currentCursorPosition) + 4;
    }

    if (currentCursorPosition !== altPosition) {
        vscode.commands.executeCommand("cursorMove", { to: toAlt, by: "character", value: diff });
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        editor.edit((editBuilder) => {
            const srcRange = new vscode.Range(
                new vscode.Position(editor.selection.active.line, altPosition + 5),
                new vscode.Position(editor.selection.active.line, secondQuoteIndex)
            );
            editBuilder.replace(srcRange, textToReplace);
        });
    }
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
export function setSrcInImage() {
    const src = "mockedSRC";
    checkSrc(lineText, currentCursorPosition, src);
}
export function setAltInImage() {
    const alt = "mockedAlt";
    checkAlt(lineText, currentCursorPosition, alt);
}
import * as vscode from 'vscode';

export function handleChangeText(event: vscode.TextDocumentChangeEvent) {
    const tagTrigger = "<img";
    const tagClosedRegex = /<img[^>]*>/g;
    const altRegex = /alt="([^"]*)"/g;
    const documentText = event.document.getText();
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const { selection } = editor;
    const currentCursorPosition = selection.active.character;
    const text = editor.document.lineAt(selection.active.line).text;
    if (!text.includes(tagTrigger)) {
        return;
    }
    /* const isClosed = documentText.match(tagClosedRegex);
    if (!isClosed) {
        return;
    } */

    checkSrc(text, currentCursorPosition);


}

export function checkSrc(text: string, currentCursorPosition: number) {
    const srcRegex = /src="([^"]*)"/g;
    const hasSrc = text.match(srcRegex);
    if (!hasSrc) {
        return;
    }
    const srcValue = getAttributeValue(hasSrc);

    /* 	const srcRange = new vscode.Range(
            new vscode.Position(selection.active.line, text.indexOf("src")),
            new vscode.Position(selection.active.line, text.indexOf("src") + 4)
        ); */
    const srcPosition = text.indexOf("src");
    let toSrc = "";
    let diff = 0;
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
                new vscode.Position(editor.selection.active.line, srcPosition),
                new vscode.Position(editor.selection.active.line, srcPosition + 4)
            );
            editBuilder.replace(srcRange, '');
        });
    }

}
/* function checkAlt(params: type) {
//const hasAlt = text.match(altRegex);
    //const altValue = getAttributeValue(hasAlt);
    //const altPosition = text.indexOf("alt");
    //const toAlt = (currentCursorPosition > altPosition) ? "left" : "right";
} */
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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const openai_api_1 = require("openai-api");
// Set up your OpenAI API credentials
const openai = new openai_api_1.default('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');
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    console.log('Congratulations, your extension "test 1" is now active!');
    let disposable = vscode.commands.registerCommand('test.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from te11111st!');
    });
    let debounce = null;
    // show an alert box, when any text is highlighted in the editor
    // vscode.window.onDidChangeTextEditorSelection(event => {
    // 	const editor: any = vscode.window.activeTextEditor;
    // 	const selection: any = editor.selection;
    // 	if (editor && selection && selection.isEmpty === false) {
    // 		// debounce the event.
    // 		if (debounce) {
    // 			clearTimeout(debounce);
    // 		}
    // 		debounce = setTimeout(() => {
    // 			const text = editor.document.getText(selection);
    // 			vscode.window.showInformationMessage(`Selected text: ${text}`);
    // 			// show a message box on the right side with text selected.
    // 			// vscode.window.showInformationMessage(`Selected text: ${text}`);
    // 			// open a new tab with the selected text.
    // 			vscode.workspace.openTextDocument({ content: text }).then(doc => {
    // 				vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
    // 			});
    // 		}, 500);
    // 	}
    // }
    // );
    // register the command to be executed when the user clicks on the custom option.
    context.subscriptions.push(disposable);
}
exports.activate = activate;
;
vscode.commands.registerCommand('test.uppercase', (document, range) => {
    // get the selected text from the active editor.
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const selection = editor.selection;
        const text = editor.document.getText(selection);
        const uppercase = text.toUpperCase();
        // replace the range with the uppercase text in the active editor.
        editor.edit(editBuilder => {
            editBuilder.replace(selection, uppercase);
        });
    }
});
vscode.commands.registerCommand('test.refactorWithOpenAI', async (document, range) => {
    // get the selected text from the active editor.
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const selection = editor.selection;
        const text = editor.document.getText(selection);
        // add the prefix (Refactor and Make this efficient) to the selected text.
        const prefix = "Refactor and Make this efficient: ";
        const prompt = prefix + text;
        // use this prompt to get the refactored text from the OpenAI API.
        const responseOptions = {
            prompt: prompt,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            max_tokens: 60,
            temperature: 0.7,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            top_p: 1,
            n: 1,
            stream: false,
            logprobs: null,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            presence_penalty: 0,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            frequency_penalty: 0,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            best_of: 1
        };
        const response = await openai.complete(responseOptions);
        console.log(response);
    }
});
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
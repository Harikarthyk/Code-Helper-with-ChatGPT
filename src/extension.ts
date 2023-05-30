// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import axios from 'axios';
import * as vscode from 'vscode';

const triggerAPI = async (responseOptions: any, token: any) => {
	return await axios.post('https://api.openai.com/v1/chat/completions', responseOptions, {
		headers: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Content-Type': 'application/json',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			Authorization: `Bearer ${token}`
		}
	});
};

const vscodeProgressIndicator = (progressLoaderTitle: string, cb: any, arg: any) => {
	vscode.window.withProgress({
		location: vscode.ProgressLocation.Notification,
		title: progressLoaderTitle || "Processing your code with OpenAI ",
		cancellable: false
	}, (progress, token) => cb(progress, token, arg.token, arg.prompt));
};

const breakDownCode = async (progress: any, token: any, bearerToken: any, prompt: any) => {
	token.onCancellationRequested(() => {
		console.log("User canceled the long running operation");
	});
	progress.report({ increment: 0 });


	const responseOptions: any = {
		"model": "gpt-3.5-turbo",
		"messages": [{ "role": "user", "content": prompt }]
	};

	progress.report({ increment: 26 });
	const response: any = await triggerAPI(responseOptions, bearerToken);

	const responseJson = response.data;


	const choices = responseJson.choices;

	const choice = choices[0];

	const textToReplace = choice.message.content;

	progress.report({ increment: 80 });

	const uri = vscode.Uri.parse('untitled:' + 'breakdownCode.txt');
	vscode.workspace.openTextDocument(uri).then((a: vscode.TextDocument) => {
		vscode.window.showTextDocument(a, 1, false).then(e => {
			e.edit(edit => {
				edit.insert(new vscode.Position(0, 0), textToReplace);
			});
		});
	});
	progress.report({ increment: 100 });
};

const writeTestCase = async (progress: any, token: any, bearerToken: any, prompt: any) => {
	token.onCancellationRequested(() => {
		console.log("User canceled the long running operation");
	});
	progress.report({ increment: 0 });

	const responseOptions: any = {
		"model": "gpt-3.5-turbo",
		"messages": [{ "role": "user", "content": prompt }]
	};

	progress.report({ increment: 25 });
	const response: any = await triggerAPI(responseOptions, bearerToken);

	const responseJson = response.data;

	const choices = responseJson.choices;

	const choice = choices[0];

	const textToReplace = choice.message.content;

	progress.report({ increment: 80 });

	// open a editor with the textToReplace as the content. side by side with the active editor.
	const uri = vscode.Uri.parse('untitled:' + 'writeTestCase.txt');

	// open beside the active editor.
	vscode.workspace.openTextDocument(uri).then((a: vscode.TextDocument) => {
		vscode.window.showTextDocument(a, 1, false).then(e => {
			e.edit(edit => {
				edit.insert(new vscode.Position(0, 0), textToReplace);
			});
		});
	});
	progress.report({ increment: 100 });
};

const refactorCode = async (progress: any, token: any, bearerToken: any, prompt: any) => {
	console.log("refactorCode", prompt, token, bearerToken, progress);
	token.onCancellationRequested(() => {
		console.log("User canceled the long running operation");
	});
	progress.report({ increment: 0 });


	const responseOptions: any = {
		"model": "gpt-3.5-turbo",
		"messages": [{ "role": "user", "content": prompt }]
	};

	progress.report({ increment: 25 });
	const response: any = await triggerAPI(responseOptions, bearerToken);

	const responseJson = response.data;


	const choices = responseJson.choices;

	const choice = choices[0];

	const textToReplace = choice.message.content;

	progress.report({ increment: 80 });

	// replace the range with the uppercase text in the active editor.
	const editor: any = vscode.window.activeTextEditor;
	const selection: any = editor.selection;

	editor.edit((editBuilder: any) => {
		editBuilder.replace(selection, textToReplace);
		progress.report({ increment: 100 });
	});
};

// Add comments to the method.
const addCommentsToMethod = async (progress: any, token: any, bearerToken: any, prompt: any) => {
	token.onCancellationRequested(() => {
		console.log("User canceled the long running operation");
	});
	progress.report({ increment: 0 });


	const responseOptions: any = {
		"model": "gpt-3.5-turbo",
		"messages": [{ "role": "user", "content": prompt }],
		"temperature": 1
	};

	progress.report({ increment: 25 });
	// do a do while loop, if the response.choices[0].finish_reason === "stop" then break the loop. or else and the response.choices[0].text to the prompt along wth the previous messages and send the request again.
	let ans = "";
	do {
		const response: any = await triggerAPI(responseOptions, bearerToken);

		const responseJson = response.data;

		const choices = responseJson.choices;

		const choice = choices[0];

		ans += choice.message.content;

		// finish_reason
		const finishReason = choice.finish_reason;

		if (finishReason === "stop") {
			break;
		}

		responseOptions.messages.push({ "role": "assistant", "content": choice.text });

		responseOptions.messages.push({ "role": "user", "content": "Please share the truncated text." });

		progress.report({ increment: 80 });
	} while (true);
	const editor: any = vscode.window.activeTextEditor;
	const selection: any = editor.selection;
	editor.edit((editBuilder: any) => {
		editBuilder.replace(selection, ans);

		progress.report({ increment: 100 });
	});
};


const getAnsForComment = async (progress: any, token: any, bearerToken: any, prompt: any) => {
	token.onCancellationRequested(() => {
		console.log("User canceled the long running operation");
	});
	progress.report({ increment: 0 });

	const responseOptions: any = {
		"model": "gpt-3.5-turbo",
		"messages": [{ "role": "user", "content": prompt }]
	};

	progress.report({ increment: 25 });
	const response: any = await triggerAPI(responseOptions, bearerToken);

	const responseJson = response.data;

	const choices = responseJson.choices;

	const choice = choices[0];

	let textToReplace = choice.message.content;

	// Need to get only the code from the response.
	textToReplace = textToReplace.split('```')[1];

	if (!textToReplace) {
		textToReplace = choice.message.content;
	};

	// Add prompt to the prefix to get textToReplace.

	textToReplace = prompt + "\n" + textToReplace;


	progress.report({ increment: 80 });

	// replace the range with the uppercase text in the active editor.

	const editor: any = vscode.window.activeTextEditor;
	const selection: any = editor.selection;
	editor.edit((editBuilder: any) => {
		editBuilder.replace(selection, textToReplace);

		progress.report({ increment: 100 });
	});
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// when the app is installed ask user a prompt to enter the API key. and store that in the API Key.
	const apiKey = vscode.workspace.getConfiguration().get('codeHelper.apiKey');
	let token: string = '';
	if (!apiKey) {
		vscode.window.showInformationMessage('Please enter your OpenAI API Key. The extension will not work without the API Key.');
		// get the API Key from the user.
		const apiKey = await vscode.window.showInputBox({
			placeHolder: "Enter your OpenAI API Key",
			prompt: "Enter your OpenAI API Key",
			validateInput: (text: string) => {
				return text === '' ? 'Please enter your OpenAI API Key' : null;
			}
		});
		// store the API Key in the settings.json file..
		if (apiKey) {
			vscode.workspace.getConfiguration().update('codeHelper.apiKey', apiKey, true);
			token = apiKey;
		}
		else {
			vscode.window.showErrorMessage('Please enter your OpenAI API Key in the settings.json file. The extension will not work without the API Key.');

		}
	} else {
		// @ts-ignore
		token = apiKey;
	}

	// Breakdown Code.
	context.subscriptions.push(
		vscode.commands.registerCommand('codeHelper.breakdownCode', (document, range) => {
			// get the selected text from the active editor.
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				try {
					const selection = editor.selection;
					const text = editor.document.getText(selection);

					const prefix = "Explain the code in simple words. ";
					const prompt = `${prefix} ${text}`;

					vscodeProgressIndicator(
						"Processing your code with OpenAI ",
						breakDownCode,
						{ token, prompt }
					);
				} catch (error) {
					// Show an error message.
					vscode.window.showErrorMessage('Error while processing your code. Please try again.');
				}
			}
		})
	);

	// Write Test Case.
	context.subscriptions.push(
		vscode.commands.registerCommand('codeHelper.writeTestCase', (document, range) => {
			// get the selected text from the active editor.
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				try {
					const selection = editor.selection;
					const text = editor.document.getText(selection);
					// add the prefix (Refactor and Make this efficient) to the selected text.

					const prefix = "Write the code for test case for this code. ";
					const prompt = `${prefix} ${text}`;

					vscodeProgressIndicator(
						"Writing test case with OpenAI ",
						writeTestCase,
						{ token, prompt }
					);
				} catch (error) {
					console.log('Error in test case generation');
				}
			}
		})
	);

	// Refactor Code.
	context.subscriptions.push(
		vscode.commands.registerCommand('codeHelper.refactorWithOpenAI', async (document, range) => {

			// get the selected text from the active editor.
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				try {
					const selection = editor.selection;
					const text = editor.document.getText(selection);
					const prefix = "Refactor and Optimize this Code, also add comments to explain the code. ";
					const prompt = `${prefix} ${text}`;

					vscodeProgressIndicator(
						"Refactoring your code with OpenAI ",
						refactorCode,
						{ token, prompt }
					);

				} catch (error) {
					console.log('Error in test case generation');
				}

			}
		})
	);

	// Add Comments to the code.
	context.subscriptions.push(

		vscode.commands.registerCommand('codeHelper.addCommentsToMethod', async (document, range) => {

			// get the selected text from the active editor.
			const editor = vscode.window.activeTextEditor;
			if (editor) {


				try {
					const selection = editor.selection;
					const text = editor.document.getText(selection);
					// add the prefix (Refactor and Make this efficient) to the selected text.

					const prefix = `
						/**
						 * @route [ROUTE]
						 * @description [DESCRIPTION]
						 * @params [PARAMETERS]
						 * @return [RETURN]
						 */

						Add This type of comment before each method in the code.


						NOTE: Add the comment before the each and every method mentioned in the code and if any imports or other codes which are not methods also include them in the code.
					`;
					const prompt = `${prefix} ${text}`;
					// added a loader to show that the extension is working.
					vscodeProgressIndicator(
						"Adding comments to your code with OpenAI ",
						addCommentsToMethod,
						{ token, prompt }
					);
				} catch (error) {
					console.log('Error in test case generation');
				}
			}
		})
	);

	// Get the answer for the comment.
	context.subscriptions.push(

		vscode.commands.registerCommand('codeHelper.getAnsForComment', async (document, range) => {
			// get the selected text from the active editor.
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				try {
					const selection = editor.selection;
					const text = editor.document.getText(selection);

					// added a loader to show that the extension is working.
					vscodeProgressIndicator(
						"Getting the answer for your comment with OpenAI ",
						getAnsForComment,
						{ token, prompt: text }
					);

				} catch (error) {
					vscode.window.showErrorMessage('Error while processing your code. Please try again.');
				}

			}
		})
	);
};

// This method is called when your extension is deactivated
export function deactivate() { };
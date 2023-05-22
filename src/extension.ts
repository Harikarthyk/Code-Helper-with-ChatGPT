// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import axios from 'axios';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "test" is now active!');

	context.subscriptions.push(vscode.commands.registerCommand('test.helloWorld', () => {
	}));


	
};

vscode.commands.registerCommand('test.breakdownCode', (document, range) => {

	// get the selected text from the active editor.
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const selection = editor.selection;
		const text = editor.document.getText(selection);
		// add the prefix (Refactor and Make this efficient) to the selected text.

		const prefix = "Explain the code in simple words. ";
		const prompt = prefix + text;

		try {
			// added a loader to show that the extension is working.
			vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: "Processing your code with OpenAI ",
				cancellable: false
			}, async (progress, token) => {
				token.onCancellationRequested(() => {
					console.log("User canceled the long running operation");
				});
				progress.report({ increment: 0 });


				const responseOptions: any = {
					"model": "gpt-3.5-turbo",
					"messages": [{ "role": "user", "content": prompt }]
				}

				progress.report({ increment: 5 });
				const response: any = await axios.post('https://api.openai.com/v1/chat/completions', responseOptions, {
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + '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'
					}
				});
				progress.report({ increment: 25 });

				const responseJson = response.data;

				progress.report({ increment: 40 });

				const choices = responseJson.choices;

				const choice = choices[0];
				progress.report({ increment: 60 });

				const textToReplace = choice.message.content;

				progress.report({ increment: 80 });

				// open a editor with the textToReplace as the content. side by side with the active editor.

				const uri = vscode.Uri.parse('untitled:' + 'breakdownCode.txt');
				vscode.workspace.openTextDocument(uri).then((a: vscode.TextDocument) => {
					vscode.window.showTextDocument(a, 1, false).then(e => {
						e.edit(edit => {
							edit.insert(new vscode.Position(0, 0), textToReplace);
						});
					});
				});


				progress.report({ increment: 100 });
			});

		} catch (error) {

			console.log('')
		}

	}
});

vscode.commands.registerCommand('test.writeTestCase', (document, range) => {

	// get the selected text from the active editor.
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const selection = editor.selection;
		const text = editor.document.getText(selection);
		// add the prefix (Refactor and Make this efficient) to the selected text.

		const prefix = "Write the code for test case for this code. ";
		const prompt = prefix + text;

		try {
			// added a loader to show that the extension is working.
			vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: "Your test case is being generated.",
				cancellable: false
			}, async (progress, token) => {
				token.onCancellationRequested(() => {
					console.log("User canceled the long running operation");
				});
				progress.report({ increment: 0 });


				const responseOptions: any = {
					"model": "gpt-3.5-turbo",
					"messages": [{ "role": "user", "content": prompt }]
				}

				progress.report({ increment: 5 });
				const response: any = await axios.post('https://api.openai.com/v1/chat/completions', responseOptions, {
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + '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'
					}
				});
				progress.report({ increment: 25 });

				const responseJson = response.data;

				progress.report({ increment: 40 });

				const choices = responseJson.choices;

				const choice = choices[0];
				progress.report({ increment: 60 });

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
			});
		} catch (error) {
			console.log('Error in test case generation');
		}

	}
});

vscode.commands.registerCommand('test.refactorWithOpenAI', async (document, range) => {

	// get the selected text from the active editor.
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const selection = editor.selection;
		const text = editor.document.getText(selection);
		// add the prefix (Refactor and Make this efficient) to the selected text.

		const prefix = "Refactor and Optimize this Code, also add comments to explain the code. ";
		const prompt = prefix + text;

		// use this prompt to get the refactored text from the OpenAI API.
		// const responseOptions: any = {
		// 	prompt: prompt,
		// 	// eslint-disable-next-line @typescript-eslint/naming-convention
		// 	max_tokens: 60,
		// 	temperature: 0.7,
		// 	// eslint-disable-next-line @typescript-eslint/naming-convention
		// 	top_p: 1,
		// 	n: 1,
		// 	stream: false,
		// 	logprobs: null,
		// 	// eslint-disable-next-line @typescript-eslint/naming-convention
		// 	presence_penalty: 0,
		// 	// eslint-disable-next-line @typescript-eslint/naming-convention
		// 	frequency_penalty: 0,
		// 	// eslint-disable-next-line @typescript-eslint/naming-convention
		// 	best_of: 1
		// };

		// const response:any = await axios.post('https://api.openai.com/v1/engines/davinci/completions', responseOptions, {
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		Authorization: 'Bearer ' + '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'
		// 	}
		// });

		try {
			// added a loader to show that the extension is working.
			vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: "Refactoring with OpenAI",
				cancellable: false
			}, async (progress, token) => {
				token.onCancellationRequested(() => {
					console.log("User canceled the long running operation");
				});
				progress.report({ increment: 0 });


				const responseOptions: any = {
					"model": "gpt-3.5-turbo",
					"messages": [{ "role": "user", "content": prompt }]
				};

				progress.report({ increment: 5 });
				const response: any = await axios.post('https://api.openai.com/v1/chat/completions', responseOptions, {
					headers: {
						'Content-Type': 'application/json',
						// eslint-disable-next-line @typescript-eslint/naming-convention
						Authorization: 'Bearer ' + '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'
					}
				});
				progress.report({ increment: 25 });

				const responseJson = response.data;

				progress.report({ increment: 40 });

				const choices = responseJson.choices;

				const choice = choices[0];
				progress.report({ increment: 60 });

				const textToReplace = choice.message.content;

				progress.report({ increment: 80 });

				// replace the range with the uppercase text in the active editor.

				editor.edit(editBuilder => {
					editBuilder.replace(selection, textToReplace);

					progress.report({ increment: 100 });
				});
			});

		} catch (error) {
			console.log('Error in test case generation');
		}

	}
});

vscode.commands.registerCommand('test.addCommentsToMethod', async (document, range) => {

	// get the selected text from the active editor.
	const editor = vscode.window.activeTextEditor;
	if (editor) {
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

			Add This type of comment to the method.
		`;
		const prompt = prefix + text;

		try {
			// added a loader to show that the extension is working.
			vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: "Adding comment with OpenAI",
				cancellable: false
			}, async (progress, token) => {
				token.onCancellationRequested(() => {
					console.log("User canceled the long running operation");
				});
				progress.report({ increment: 0 });


				const responseOptions: any = {
					"model": "gpt-3.5-turbo",
					"messages": [{ "role": "user", "content": prompt }]
				};

				progress.report({ increment: 5 });
				const response: any = await axios.post('https://api.openai.com/v1/chat/completions', responseOptions, {
					headers: {
						'Content-Type': 'application/json',
						// eslint-disable-next-line @typescript-eslint/naming-convention
						Authorization: 'Bearer ' + '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'
					}
				});
				progress.report({ increment: 25 });

				const responseJson = response.data;

				progress.report({ increment: 40 });

				const choices = responseJson.choices;

				const choice = choices[0];
				progress.report({ increment: 60 });

				const textToReplace = choice.message.content;

				progress.report({ increment: 80 });

				// replace the range with the uppercase text in the active editor.

				editor.edit(editBuilder => {
					editBuilder.replace(selection, textToReplace);

					progress.report({ increment: 100 });
				});
			});

		} catch (error) {
			console.log('Error in test case generation');
		}

	}
});

vscode.commands.registerCommand('test.getAnsForComment', async (document, range) => {
	// get the selected text from the active editor.
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const selection = editor.selection;
		const text = editor.document.getText(selection);
		const prompt = text;

		try {
			// added a loader to show that the extension is working.
			vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: "Please wait...",
				cancellable: false
			}, async (progress, token) => {
				token.onCancellationRequested(() => {
					console.log("User canceled the long running operation");
				});
				progress.report({ increment: 0 });


				const responseOptions: any = {
					"model": "gpt-3.5-turbo",
					"messages": [{ "role": "user", "content": prompt }]
				};

				progress.report({ increment: 5 });
				const response: any = await axios.post('https://api.openai.com/v1/chat/completions', responseOptions, {
					headers: {
						'Content-Type': 'application/json',
						// eslint-disable-next-line @typescript-eslint/naming-convention
						Authorization: 'Bearer ' + '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'
					}
				});
				progress.report({ increment: 25 });

				const responseJson = response.data;

				progress.report({ increment: 40 });

				const choices = responseJson.choices;

				const choice = choices[0];
				progress.report({ increment: 60 });

				let textToReplace = choice.message.content;

				// Need to get only the code from the response.
				textToReplace = textToReplace.split('```')[1];

				if(!textToReplace) {
					textToReplace = choice.message.content;
				};

				// Add prompt to the prefix to get textToReplace.

				textToReplace = prompt +"\n"+ textToReplace;


				progress.report({ increment: 80 });

				// replace the range with the uppercase text in the active editor.

				editor.edit(editBuilder => {
					editBuilder.replace(selection, textToReplace);

					progress.report({ increment: 100 });
				});
			});

		} catch (error) {
			console.log('Error in test case generation');
		}

	}
});
	

// This method is called when your extension is deactivated
export function deactivate() { };
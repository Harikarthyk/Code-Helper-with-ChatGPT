// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import axios from 'axios';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function  activate(context: vscode.ExtensionContext) {

	// when the app is installed ask user a prompt to enter the API key. and store that in the API Key.
	// when the app is installed ask user a prompt to enter the API key. and store that in the API Key.
	const apiKey = vscode.workspace.getConfiguration().get('codeHelper.apiKey');
	let TOKEN: string = '';
	if (!apiKey) {
		vscode.window.showInformationMessage('Please enter your OpenAI API Key in the settings.json file. The extension will not work without the API Key.');

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
			TOKEN = apiKey;
		}
		else {
			vscode.window.showErrorMessage('Please enter your OpenAI API Key in the settings.json file. The extension will not work without the API Key.');

		}
	}else {
		// @ts-ignore
		TOKEN = apiKey;
	}

	

	context.subscriptions.push(vscode.commands.registerCommand('codeHelper.helloWorld', () => {
	}));

	context.subscriptions.push(
		vscode.commands.registerCommand('codeHelper.breakdownCode', (document, range) => {

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
								Authorization: 'Bearer ' + TOKEN
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
				}
			}
		}));

	context.subscriptions.push(vscode.commands.registerCommand('codeHelper.writeTestCase', (document, range) => {

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
							Authorization: 'Bearer ' + TOKEN
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
	}));

	context.subscriptions.push(
		vscode.commands.registerCommand('codeHelper.refactorWithOpenAI', async (document, range) => {

			// get the selected text from the active editor.
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				const selection = editor.selection;
				const text = editor.document.getText(selection);
				const prefix = "Refactor and Optimize this Code, also add comments to explain the code. ";
				const prompt = prefix + text;

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
								Authorization: 'Bearer ' + TOKEN
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
		})
	);

	context.subscriptions.push(

		vscode.commands.registerCommand('codeHelper.addCommentsToMethod', async (document, range) => {

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

			Add This type of comment before each method in the code.


			NOTE: Add the comment before the each and every method mentioned in the code and if any imports or other codes which are not methods also include them in the code.
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
							"messages": [{ "role": "user", "content": prompt }],
							"temperature": 1,
							// "stop": ["\n"]
						};

						progress.report({ increment: 5 });
						// do a do while loop, if the response.choices[0].finish_reason === "stop" then break the loop. or else and the response.choices[0].text to the prompt along wth the previous messages and send the request again.
						let ans = "";
						do {
							const response: any = await axios.post('https://api.openai.com/v1/chat/completions', responseOptions, {
								headers: {
									'Content-Type': 'application/json',
									// eslint-disable-next-line @typescript-eslint/naming-convention
									Authorization: 'Bearer ' + TOKEN
								}
							});
							progress.report({ increment: 25 });

							const responseJson = response.data;

							progress.report({ increment: 40 });


							const choices = responseJson.choices;

							const choice = choices[0];

							progress.report({ increment: 60 });

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
						editor.edit(editBuilder => {
							editBuilder.replace(selection, ans);

							progress.report({ increment: 100 });
						});
					});

				} catch (error) {
					console.log('Error in test case generation');
				}

			}
		})
	);

	context.subscriptions.push(

		vscode.commands.registerCommand('codeHelper.getAnsForComment', async (document, range) => {
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
								Authorization: 'Bearer ' + TOKEN
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

						if (!textToReplace) {
							textToReplace = choice.message.content;
						};

						// Add prompt to the prefix to get textToReplace.

						textToReplace = prompt + "\n" + textToReplace;


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
		})
	);
};

// This method is called when your extension is deactivated
export function deactivate() { };
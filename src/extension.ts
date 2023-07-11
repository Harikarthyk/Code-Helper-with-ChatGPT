// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import axios from "axios";
import { Configuration, OpenAIApi } from "openai";
import * as vscode from "vscode";

const MODEL = "gpt-3.5-turbo";
let USER_TOKEN: any = null;
// Axios call.
const triggerAPI = async (responseOptions: any, token: any) => {
  
  const configuration = new Configuration({
    apiKey: token,
  });
  
  const openai = new OpenAIApi(configuration);

  try {
    const chatCompletion = await openai.createChatCompletion(responseOptions);
    return chatCompletion;
  }catch(error){
    console.log(error);
    return;
  }
  // return await axios
  //   .post("https://api.openai.com/v1/chat/completions", responseOptions, {
  //     headers: {
  //       // eslint-disable-next-line @typescript-eslint/naming-convention
  //       "Content-Type": "application/json",
  //       // eslint-disable-next-line @typescript-eslint/naming-convention
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //   .then((res) => res)
  //   .catch((error) => {
  //     // if its un authorized show the error message.
  //     if (error.response.status === 401) {
  //       vscode.window.showErrorMessage("Please enter a valid API key.");
  //     }
  //     // if limit exceeded show the error message.
  //     if (error.response.status === 402 || error.response.status === 429) {
  //       vscode.window.showErrorMessage(
  //         "You have exceeded the API limit. Please try again after some time."
  //       );
  //     }
  //     throw error;
  //   });
};

// Loader for the progress bar.
const vscodeProgressIndicator = (
  progressLoaderTitle: string,
  cb: any,
  arg: any
) => {
  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: progressLoaderTitle || "Processing your code with OpenAI ",
      cancellable: false,
    },
    (progress, token) => cb(progress, token, arg.token, arg.prompt)
  );
};

// Breakdown code.
const breakDownCode = async (
  progress: any,
  token: any,
  bearerToken: any,
  prompt: any
) => {
  token.onCancellationRequested(() => {
    console.log("User canceled the long running operation");
  });
  progress.report({ increment: 0 });

  const responseOptions: any = {
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
  };

  progress.report({ increment: 26 });
  const response: any = await triggerAPI(responseOptions, bearerToken);

  const responseJson = response.data;

  const choices = responseJson.choices;

  const choice = choices[0];

  const textToReplace = choice?.message?.content || choice.text || '';

  progress.report({ increment: 80 });

  const uri = vscode.Uri.parse("untitled:" + "breakdownCode.txt");
  vscode.workspace.openTextDocument(uri).then((a: vscode.TextDocument) => {
    vscode.window.showTextDocument(a, 1, false).then((e) => {
      e.edit((edit) => {
        edit.insert(new vscode.Position(0, 0), textToReplace);
      });
    });
  });
  progress.report({ increment: 100 });
};

// Write test case.
const writeTestCase = async (
  progress: any,
  token: any,
  bearerToken: any,
  prompt: any
) => {
  token.onCancellationRequested(() => {
    console.log("User canceled the long running operation");
  });
  progress.report({ increment: 0 });

  const responseOptions: any = {
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
  };

  progress.report({ increment: 25 });
  const response: any = await triggerAPI(responseOptions, bearerToken);

  const responseJson = response.data;

  const choices = responseJson.choices;

  const choice = choices[0];

  const textToReplace = choice?.message?.content || choice.text || '' ;

  progress.report({ increment: 80 });

  // open a editor with the textToReplace as the content. side by side with the active editor.
  const uri = vscode.Uri.parse("untitled:" + "writeTestCase.txt");

  // open beside the active editor.
  vscode.workspace.openTextDocument(uri).then((a: vscode.TextDocument) => {
    vscode.window.showTextDocument(a, 1, false).then((e) => {
      e.edit((edit) => {
        edit.insert(new vscode.Position(0, 0), textToReplace);
      });
    });
  });
  progress.report({ increment: 100 });
};

// Refactor code.
const refactorCode = async (
  progress: any,
  token: any,
  bearerToken: any,
  prompt: any
) => {
  token.onCancellationRequested(() => {
    console.log("User canceled the long running operation");
  });
  progress.report({ increment: 0 });

  const responseOptions: any = {
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
  };

  progress.report({ increment: 25 });
  const response: any = await triggerAPI(responseOptions, bearerToken);

  const responseJson = response.data;

  const choices = responseJson.choices;

  const choice = choices[0];

  const textToReplace = choice?.message?.content || choice.text || '';

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
const addCommentsToMethod = async (
  progress: any,
  token: any,
  bearerToken: any,
  prompt: any
) => {
  token.onCancellationRequested(() => {
    console.log("User canceled the long running operation");
  });
  progress.report({ increment: 0 });

  const responseOptions: any = {
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 1,
  };

  progress.report({ increment: 25 });
  // do a do while loop, if the response.choices[0].finish_reason === "stop" then break the loop. or else and the response.choices[0].text to the prompt along wth the previous messages and send the request again.
  let ans = "";
  do {
    const response: any = await triggerAPI(responseOptions, bearerToken);

    const responseJson = response.data;

    const choices = responseJson.choices;

    const choice = choices[0];

    ans += choice?.message?.content || choice.text || '';

    // finish_reason
    const finishReason = choice.finish_reason;

    if (finishReason === "stop") {
      break;
    }

    responseOptions.messages.push({ role: "assistant", content: choice?.message?.content || choice.text || '' });

    responseOptions.messages.push({
      role: "user",
      content: "Please share the truncated text.",
    });

    progress.report({ increment: 80 });
  } while (true);
  const editor: any = vscode.window.activeTextEditor;
  const selection: any = editor.selection;
  editor.edit((editBuilder: any) => {
    editBuilder.replace(selection, ans);

    progress.report({ increment: 100 });
  });
};

// Add comments to the method.
const getAnsForComment = async (
  progress: any,
  token: any,
  bearerToken: any,
  prompt: any
) => {
  token.onCancellationRequested(() => {
    console.log("User canceled the long running operation");
  });
  progress.report({ increment: 0 });

  const responseOptions: any = {
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
  };

  progress.report({ increment: 25 });
  const response: any = await triggerAPI(responseOptions, bearerToken);

  const responseJson = response.data;

  const choices = responseJson.choices;

  const choice = choices[0];

  let textToReplace = choice?.message?.content || choice.text || '';

  // Need to get only the code from the response.
  textToReplace = textToReplace.split("```")[1];

  if (!textToReplace) {
    textToReplace = choice?.message?.content || choice.text || '';
  }

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

// Find the bugs in the code.
const findBugsInCode = async (
  progress: any,
  token: any,
  bearerToken: any,
  prompt: any
) => {
  token.onCancellationRequested(() => {
    console.log("User canceled the long running operation");
  });
  progress.report({ increment: 0 });

  const responseOptions: any = {
    model: MODEL,
    messages: [
      {
        role: "user",
        content: `
				Find the bugs in the code, if the bug exist then fix it and send the code back to the assistant.

				${prompt}
			`,
      },
    ],
  };

  progress.report({ increment: 25 });

  const response: any = await triggerAPI(responseOptions, bearerToken);

  const responseJson = response.data;

  const choices = responseJson.choices;

  const choice = choices[0];

  let textToReplace = choice?.message?.content || choice.text || '';

  // Need to get only the code from the response.

  textToReplace = textToReplace.split("```")[1];

  if (!textToReplace) {
    textToReplace = choice?.message?.content || choice.text || '';
  }

  // Add prompt to the prefix to get textToReplace.

  textToReplace = textToReplace;

  progress.report({ increment: 80 });

  // replace the range with the uppercase text in the active editor.

  const editor: any = vscode.window.activeTextEditor;

  const selection: any = editor.selection;

  editor.edit((editBuilder: any) => {
    editBuilder.replace(selection, textToReplace);

    progress.report({ increment: 100 });
  });
};

const getApiFromUser = async () => {
  // create configuration.
  const config = vscode.workspace.getConfiguration("codeHelper");
  const apiKey = await config.get("apiKey");

  // Update a setting

  let token: string = "";
  if (!apiKey || apiKey === "YOUR_API_KEY") {
    console.log("API Key not found");
    // get the API Key from the user.
    const _apiKey = await vscode.window.showInputBox({
      placeHolder: "Enter your OpenAI API Key",
      prompt: "Enter your OpenAI API Key",
      validateInput: (text: string) => {
        return text === "" ? "Please enter your OpenAI API Key" : null;
      },
    });
    // store the API Key in the settings.json file..
    if (_apiKey) {
      try {
        await config.update(
          "apiKey",
          _apiKey,
          vscode.ConfigurationTarget.Global
        );
        token = _apiKey;
        USER_TOKEN = _apiKey;
        console.log("API Key updated successfully");
        return _apiKey;
      } catch (error) {
        console.log(error);
        console.log("Error occurred while updating the API Key");
        return token;
      }
    } else {
      vscode.window.showErrorMessage("Please enter your OpenAI API Key");
    }
  } else {
    // @ts-ignore
    token = apiKey;
  }
  return token;
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // when the app is installed ask user a prompt to enter the API key. and store that in the API Key.
  getApiFromUser();

  // Breakdown Code.
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "codeHelper.breakdownCode",
      async (document, range) => {
        let token = await getApiFromUser();
        if (!token) {
          return;
        }
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
            vscode.window.showErrorMessage(
              "Error while processing your code. Please try again."
            );
          }
        }
      }
    )
  );

  // Write Test Case.
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "codeHelper.writeTestCase",
      async (document, range) => {
        let token = await getApiFromUser();
        if (!token) {
          return;
        }
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
            console.log("Error in test case generation");
          }
        }
      }
    )
  );

  // Refactor Code.
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "codeHelper.refactorWithOpenAI",
      async (document, range) => {
        let token = await getApiFromUser();
        console.info(token, "1");
        if (!token) {
          return;
        }
        // get the selected text from the active editor.
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          try {
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            const prefix =
              "Refactor and Optimize this Code, also add comments to explain the code. ";
            const prompt = `${prefix} ${text}`;

            vscodeProgressIndicator(
              "Refactoring your code with OpenAI ",
              refactorCode,
              { token, prompt }
            );
          } catch (error) {
            console.log("Error in test case generation");
          }
        }
      }
    )
  );

  // Add Comments to the code.
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "codeHelper.addCommentsToMethod",
      async (document, range) => {
        let token = await getApiFromUser();
        if (!token) {
          return;
        }
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
            console.log("Error in test case generation");
          }
        }
      }
    )
  );

  // Get the answer for the comment.
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "codeHelper.getAnsForComment",
      async (document, range) => {
        let token = await getApiFromUser();
        if (!token) {
          return;
        }
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
            vscode.window.showErrorMessage(
              "Error while processing your code. Please try again."
            );
          }
        }
      }
    )
  );

  // Find the bug in the code.
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "codeHelper.findBugs",
      async (document, range) => {
        let token = await getApiFromUser();
        if (!token) {
          return;
        }
        // get the selected text from the active editor.
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          try {
            const selection = editor.selection;
            const text = editor.document.getText(selection);

            // added a loader to show that the extension is working.
            vscodeProgressIndicator(
              "Finding the bugs in your code...",
              findBugsInCode,
              { token, prompt: text }
            );
          } catch (error) {
            vscode.window.showErrorMessage(
              "Error while processing your code. Please try again."
            );
          }
        }
      }
    )
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import axios from "axios";
import { Configuration, OpenAIApi } from "openai";
import * as vscode from "vscode";

import * as path from 'path';
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
    console.log(chatCompletion, 'chatCompletion')
    return chatCompletion;
  }catch(error){
    console.log(error);
    // show toast.

    vscode.window.showErrorMessage(
      "You have exceeded the API limit. Please try again after some time. or API key is invalid."
    );

    return {
      data: {
        choices: [
        ]

      },
    }
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
  console.log(response, '112')
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

function getWebviewContent(token: string): string {
  let body: string = `<section class="msger">
  <header class="msger-header">
    <div class="msger-header-title">
      <i class="fas fa-comment-alt"></i> 
      Code Helper
    </div>
    <div class="msger-header-options">
      <span><i class="fas fa-cog"></i></span>
    </div>
  </header>

  <main class="msger-chat">
    <div class="msg left-msg">
      <div
       class="msg-img"
       style="background-image: url(https://image.flaticon.com/icons/svg/327/327779.svg)"
      ></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">BOT</div>
          <div class="msg-info-time">12:45</div>
        </div>

        <div class="msg-text">
          Hi, welcome to Code Helper. How can I help you today?
        </div>
      </div>
    </div>
  </main>

  <form class="msger-inputarea">
    <input type="text" class="msger-input" placeholder="Enter your message...">
    <button type="submit" class="msger-send-btn">Send</button>
  </form>
</section>`;
  let css = `:root {
    --body-bg: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    --msger-bg: #fff;
    --border: 2px solid #ddd;
    --left-msg-bg: #ececec;
    --right-msg-bg: #579ffb;
  }
  
  html {
    box-sizing: border-box;
  }
  
  *,
  *:before,
  *:after {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
  }
  
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-image: var(--body-bg);
    font-family: Helvetica, sans-serif;
  }
  
  .msger {
    display: flex;
    flex-flow: column wrap;
    justify-content: space-between;
    width: 100%;
    max-width: 867px;
    margin: 25px 10px;
    height: calc(100% - 50px);
    border: var(--border);
    border-radius: 5px;
    box-shadow: 0 15px 15px -5px rgba(0, 0, 0, 0.2);
  }
  
  .msger-header {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: var(--border);
    background: #eee;
    color: #666;
  }
  
  .msger-chat {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
  }
  .msger-chat::-webkit-scrollbar {
    width: 6px;
  }
  .msger-chat::-webkit-scrollbar-track {
    background: #ddd;
  }
  .msger-chat::-webkit-scrollbar-thumb {
    background: #bdbdbd;
  }
  .msg {
    display: flex;
    align-items: flex-end;
    margin-bottom: 10px;
  }

  pre {

    -webkit-overflow-scrolling: touch;
    overflow-x: auto;
    width: 100%;
    min-width: 100px;
    padding: 0;
    color: #000 !important;
  }
  code {
    
    color: #000 !important;
  }
  .msg-text {
    width: 100%;
  }
  .msg:last-of-type {
    margin: 0;
  }
  .msg-img {
    display: none;
    width: 50px;
    height: 50px;
    margin-right: 10px;
    background: #ddd;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-radius: 50%;
  }
  .msg-bubble {
    max-width: 450px;
    padding: 15px;
    border-radius: 15px;
    background: var(--left-msg-bg);
  }
  .msg-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .msg-info-name {
    margin-right: 10px;
    font-weight: bold;
  }
  .msg-info-time {
    font-size: 0.85em;
  }
  
  .left-msg .msg-bubble {
    border-bottom-left-radius: 0;
    color: black;
  }
  
  .right-msg {
    flex-direction: row-reverse;
  }
  .right-msg .msg-bubble {
    background: var(--right-msg-bg);
    color: #fff;
    border-bottom-right-radius: 0;
  }
  .right-msg .msg-img {
    margin: 0 0 0 10px;
  }
  
  .msger-inputarea {
    display: flex;
    padding: 10px;
    border-top: var(--border);
    background: #eee;
  }
  .msger-inputarea * {
    padding: 10px;
    border: none;
    border-radius: 3px;
    font-size: 1em;
  }
  .msger-input {
    flex: 1;
    background: #ddd;
  }
  .msger-send-btn {
    margin-left: 10px;
    background: rgb(0, 196, 65);
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.23s;
  }
  .msger-send-btn:hover {
    background: rgb(0, 180, 50);
  }
  
  .msger-chat {
    background-color: #fcfcfe;
  }
  `;
  const script = `
  const msgerForm = document.querySelector(".msger-inputarea");
  const msgerInput = document.querySelector(".msger-input");
  const msgerChat = document.querySelector(".msger-chat");
  
  const BOT_MSGS = [
    "Hi, how are you?",
    "Ohh... I can't understand what you're trying to say. Sorry!",
    "I like to play games... But I don't know how to play!",
    "Sorry if my answers are not relevant. :))",
    "I feel sleepy! :("
  ];
  
  // Icons made by Freepik from www.flaticon.com
  const BOT_IMG = "https://image.flaticon.com/icons/svg/327/327779.svg";
  const PERSON_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
  const BOT_NAME = "BOT";
  const PERSON_NAME = "You";
  
  msgerForm.addEventListener("submit", event => {
    event.preventDefault();
  
    const msgText = msgerInput.value;
    if (!msgText) return;
  
    appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
    msgerInput.value = "";
    const messageChatBubbles = msgerChat.querySelectorAll(".msg");
    const messages = [];
    
    messageChatBubbles.forEach((messageBubble) => {
      const role = messageBubble.classList.contains("left-msg") ? "assistant" : "user";
      const content = messageBubble.querySelector(".msg-text").innerText;
      messages.push({role, content});
    });

    messages.push({role: "user", content: msgText});

    botResponse(messages);
  });
  
  function appendMessage(name, img, side, text) {
    const msgHTML = \`
      <div class="msg \${side}-msg">
        <div class="msg-img" style="background-image: url(\${img})"></div>
  
        <div class="msg-bubble">
          <div class="msg-info">
            <div class="msg-info-name">\${name}</div>
            <div class="msg-info-time">\${formatDate(new Date())}</div>
          </div>
  
          <div class="msg-text">  
            \${text}
          </div>
        </div>
      </div>
    \`;
  
    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
  }

  async function botResponse(messages) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ${token}",
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": messages || [{
          "role": "system", 
          "content": "You are a helpful assistant."}, 
          {"role": "user", "content": "Hello!"}
        ]
      }),
    }).then(response => response.json()).catch(error => console.error(error))
    if(response?.choices?.length > 0) {
      let content = response.choices[0]?.message?.content;

      while(content?.includes("\`\`\`")) {
        content = content.replace(/\`\`\`/g, '<pre><code>');
        content = content.replace(/\`\`\`/g, '</code></pre>');
      }
      appendMessage(BOT_NAME, BOT_IMG, "left", content?.trim());
    }
    else {
      appendMessage(BOT_NAME, BOT_IMG, "left", JSON.stringify(response));
    }
  }
  
  // Utils
  function get(selector, root = document) {
    return root.querySelector(selector);
  }
  
  function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();
  
    return \`\${h.slice(-2)}:\${m.slice(-2)}\`;
  }
  
  function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  `;  

  let htmlCode = `
    <!DOCTYPE html>
    <html>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css"
        />
        <style>
          ${css}
        </style>
      </head>
      <body>
        ${body}
      </body>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.5.3/ace.js"></script>
      <script>
        ${script}
      </script>
    </html>
  `;
  return htmlCode;
}


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {  
  context.subscriptions.push(
    vscode.commands.registerCommand('codeHelper.openChat', async () => {
      let token = await getApiFromUser();
      if (!token) {
        return;
      }
      // Load the HTML content for the chat UI
      const chatHtml = getWebviewContent(token);
      // open side bar with the chat UI
      const panel = vscode.window.createWebviewPanel(
        'codeHelperGPT', // Identifies the type of the webview. Used internally
        'Code Helper GPT', // Title of the panel displayed to the user
        vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        } // Webview options. More on these later.
      );
      panel.webview.html = chatHtml;
      
    })
  );
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
        console.log("Breakdown Code");
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

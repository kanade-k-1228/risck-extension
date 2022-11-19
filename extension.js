const vscode = require("vscode");

function hoverText(keyword) {
  switch (keyword) {
    case "addi":
      return "addi **rd** ← **rs** + **imm**";
    case "add":
      return "add **rd** ← **rs1** + **rs2**";
    case "subi":
      return "subi **rd** ← **rs** - **imm**";
    case "sub":
      return "sub **rd** ← **rs1** - **rs2**";
    case "jump":
      return "jump **ra** ← pc+1, pc ← **rs** + **lab**";
  }
}

function format(line) {
  return line;
}

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("risck.helloWorld", () => {
      vscode.window.showInformationMessage("Hello, world!");
    })
  );
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider("risck", {
      provideDocumentFormattingEdits(document) {
        const formatted = [...Array(document.lineCount)]
          .map((_, i) => format(document.lineAt(i).text))
          .reduce((p, c, i) => p + "\n" + c);
        const range = new vscode.Range(
          0,
          0,
          document.lineCount - 1,
          document.lineAt(document.lineCount - 1).text.length
        );
        return [vscode.TextEdit.replace(range, formatted)];
      },
    })
  );
  context.subscriptions.push(
    vscode.languages.registerHoverProvider("risck", {
      provideHover(document, position, token) {
        const wordRange = document.getWordRangeAtPosition(
          position,
          /[a-zA-Z0-9_]+/
        );
        if (wordRange === undefined) return Promise.reject("no word here");
        const currentWord = document
          .lineAt(position.line)
          .text.slice(wordRange.start.character, wordRange.end.character);
        return Promise.resolve(new vscode.Hover(hoverText(currentWord)));
      },
    })
  );
}

function deactivate() {
  return undefined;
}

module.exports = { activate, deactivate };

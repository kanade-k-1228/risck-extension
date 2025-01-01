const vscode = require("vscode");

function hoverText(keyword) {
  switch (keyword) {
    case "addi":
      return "`RD = RS + IMM`";
    case "add":
      return "`RD = RS1 + RS2`";
    case "subi":
      return "`RD = RS - IMM`";
    case "sub":
      return "`RD = RS1 - RS2`";
    case "andi":
      return "`RD = RS1 & IMM`";
    case "and":
      return "`RD = RS1 & RS2`";
    case "ori":
      return "`RD = RS | IMM`";
    case "or":
      return "`RD = RS1 | RS2`";
    case "xori":
      return "`RD = RS ^ IMM`";
    case "xor":
      return "`RD = RS1 ^ RS2`";
    case "not":
      return "`RD = ~RS1`";
    case "srs":
      return "`RD = RS1 >> 1 (Shift Right Signed)";
    case "sru":
      return "`RD = RS1 >> 1 (Shift Right Unsigned)";
    case "sl":
      return "`RD = RS1 << 1 (Shift Left)";
    case "eqi":
      return "`RD = RS == IMM`";
    case "eq":
      return "`RD = RS1 == RS2`";
    case "neqi":
      return "`RD = RS1 != IMM`";
    case "neq":
      return "`RD = RS1 != RS2`";
    case "ltsi":
      return "`RD = RS < IMM (Signed)`";
    case "lts":
      return "`RD = RS1 < RS2 (Signed)`";
    case "lti":
      return "`RD = RS < IMM (Unsigned)`";
    case "lt":
      return "`RD = RS1 < RS2 (Unsigned)`";
    case "lcast":
      return "`RD = RS1==0 ? 0x0000 : 0xFFFF`";

    case "nop":
      return "`(´・ω・\`)`";
    case "mov":
      return "`RD <= RS`";
    case "loadi":
      return "`RD <= IMM`";
    case "load":
      return "`RD <= RAM[RS + IMM]`";
    case "store":
        return "`RS => RAM[RS + IMM]`";
    case "if":
      return "`IF(COND==0) PC = IMM`";
    case "ifr":
      return "`IF(COND==0) PC += IMM`";
    case "jump":
      return "`PC = IMM`";
    case "jumpr":
      return "`PC += IMM`";
    case "call":
      return "`RA = PC + 1, PC = IMM`";
    case "ret":
      return "`PC = RA`";
    case "iret":
      return "`PC = IRA`";
  }
}

function format(line) {
  return line;
}

function activate(context) {
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

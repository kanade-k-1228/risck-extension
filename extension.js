const vscode = require("vscode");

function hoverText(keyword) {
  switch (keyword) {
    case "add":
      return "`rd = rs1 + rs2`";
    case "addi":
      return "`rd = rs + imm`";
    case "sub":
      return "`rd = rs1 - rs2`";
    case "subi":
      return "`rd = rs - imm`";
    case "and":
      return "`rd = rs1 & rs2`";
    case "andi":
      return "`rd = rs1 & imm`";
    case "or":
      return "`rd = rs1 | rs2`";
    case "ori":
      return "`rd = rs | imm`";
    case "xor":
      return "`rd = rs1 ^ rs2`";
    case "xori":
      return "`rd = rs ^ imm`";
    case "not":
      return "`rd = ~rs1`";
    case "sr":
      return "`rd = rs1 >> 1`";
    case "srs":
      return "`rd = rs1 >> 1 (Signed)`";
    case "srr":
      return "`rd = rs1 >> 1 (Rotate)`";
    case "sl":
      return "`rd = rs1 << 1`";
    case "slr":
      return "`rd = rs1 << 1 (Rotate)`";
    case "eq":
      return "`rd = rs1 == rs2`";
    case "eqi":
      return "`rd = rs == imm`";
    case "neq":
      return "`rd = rs1 != rs2`";
    case "neqi":
      return "`rd = rs1 != imm`";
    case "lt":
      return "`rd = rs1 < rs2 (Unsigned)`";
    case "lti":
      return "`rd = rs < imm (Unsigned)`";
    case "lts":
      return "`rd = rs1 < rs2 (Signed)`";
    case "ltsi":
      return "`rd = rs < imm (Signed)`";
    case "nop":
      return "(´・ω・`)";
    case "mov":
      return "`rd <= rs`";
    case "loadi":
      return "`rd <= imm`";
    case "load":
      return "`rd <= RAM[rs + imm]`";
    case "store":
      return "`rs => RAM[rs + imm]`";
    case "if":
      return "`IF(rs==0) PC = imm`";
    case "ifr":
      return "`IF(rs==0) PC += imm`";
    case "jump":
      return "`PC = imm`";
    case "jumpr":
      return "`PC += imm`";
    case "call":
      return "`RA = PC + 1, PC = imm`";
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

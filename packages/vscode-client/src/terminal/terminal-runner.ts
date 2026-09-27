import * as vscode from 'vscode';

export class TerminalRunner {
  private static terminalName = 'SkillForge';

  /**
   * Gets an existing SkillForge terminal or creates a new one.
   */
  public static getOrCreateTerminal(cwd?: string): vscode.Terminal {
    const existing = vscode.window.terminals.find(
      (t) => t.name === TerminalRunner.terminalName
    );
    if (existing) {
      return existing;
    }

    return vscode.window.createTerminal({
      name: TerminalRunner.terminalName,
      cwd,
    });
  }

  /**
   * Executes a shell command in the dedicated SkillForge terminal.
   */
  public static runCommand(command: string, cwd?: string): void {
    if (!command || !command.trim()) {
      return;
    }

    const terminal = TerminalRunner.getOrCreateTerminal(cwd);
    terminal.show(false); // Preserve focus in editor if desired, or true to focus terminal
    terminal.sendText(command.trim(), true);

    vscode.window.showInformationMessage(
      `[SkillForge] Sent to terminal: ${command.trim()}`
    );
  }

  /**
   * Helper to derive the default installation command for a skill given its ecosystem and package.
   */
  public static deriveInstallCommand(
    packageName: string,
    ecosystem?: string
  ): string {
    const cleanPkg = packageName.trim();
    if (!cleanPkg) return '';

    switch (ecosystem?.toLowerCase()) {
      case 'python':
        return `pip install ${cleanPkg}`;
      case 'rust':
        return `cargo add ${cleanPkg}`;
      case 'go':
        return `go get ${cleanPkg}`;
      case 'java':
        return `mvn dependency:get -Dartifact=${cleanPkg}`;
      case 'javascript':
      case 'node':
      default:
        // Default to pnpm/npm
        return `pnpm add ${cleanPkg}`;
    }
  }
}

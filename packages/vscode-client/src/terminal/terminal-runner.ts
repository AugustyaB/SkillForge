import * as vscode from 'vscode';

export class TerminalRunner {
  private static terminalName = 'SkillForge';
  private static lastCwd: string | undefined;
  private static terminalCloseListenerRegistered = false;

  /**
   * Resets internal directory tracking (useful for testing or when terminals are killed).
   */
  public static reset(): void {
    TerminalRunner.lastCwd = undefined;
  }

  /**
   * Returns the last recorded working directory for the SkillForge terminal.
   */
  public static getLastCwd(): string | undefined {
    return TerminalRunner.lastCwd;
  }

  private static ensureCloseListener(): void {
    if (
      !TerminalRunner.terminalCloseListenerRegistered &&
      typeof vscode.window?.onDidCloseTerminal === 'function'
    ) {
      TerminalRunner.terminalCloseListenerRegistered = true;
      vscode.window.onDidCloseTerminal((t) => {
        if (t.name === TerminalRunner.terminalName) {
          TerminalRunner.lastCwd = undefined;
        }
      });
    }
  }

  /**
   * Gets an existing SkillForge terminal or creates a new one.
   */
  public static getOrCreateTerminal(cwd?: string): vscode.Terminal {
    TerminalRunner.ensureCloseListener();

    const existing = vscode.window.terminals?.find(
      (t) => t.name === TerminalRunner.terminalName
    );
    if (existing) {
      return existing;
    }

    if (cwd && cwd.trim()) {
      TerminalRunner.lastCwd = cwd.trim();
    }

    return vscode.window.createTerminal({
      name: TerminalRunner.terminalName,
      cwd,
    });
  }

  /**
   * Executes a shell command in the dedicated SkillForge terminal.
   * If cwd is specified and differs from the terminal's last recorded working directory,
   * sends a `cd` command before dispatching the requested command.
   */
  public static runCommand(command: string, cwd?: string): void {
    if (!command || !command.trim()) {
      return;
    }

    const terminal = TerminalRunner.getOrCreateTerminal(cwd);
    terminal.show(false);

    if (cwd && cwd.trim() && cwd.trim() !== TerminalRunner.lastCwd) {
      const normalizedCwd = cwd.trim();
      terminal.sendText(`cd "${normalizedCwd}"`, true);
      TerminalRunner.lastCwd = normalizedCwd;
    }

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
    const cleanPkg = packageName ? packageName.trim() : '';
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

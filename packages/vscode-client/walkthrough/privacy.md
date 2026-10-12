# Local & Private by Default (with Optional BYOK AI)

Developer trust and codebase confidentiality are fundamental to SkillForge.

### Privacy First Guarantee:
- **100% Offline by Default**: Out of the box, SkillForge runs entirely on your local machine using our vetted 350+ skills catalog. No network connection is required, and zero telemetry is collected.
- **Zero Source Code Transmission**: Even if you optionally enable cloud AI reasoning (OpenAI or Google Gemini), **only your explicit query string is transmitted**. SkillForge *never* reads, scans, or sends your source code files, file paths, or Git history.
- **Secure OS Keychain API Keys**: When using Bring-Your-Own-Key (BYOK), your API keys are stored exclusively in your operating system's native keychain (Windows Credential Manager, macOS Keychain, Linux Secret Service) via VS Code `SecretStorage`. Keys are never saved in plaintext settings files or workspace folders.

### Configure Your Setup:
- Change recommendation providers anytime between **Local (Offline)**, **Google Gemini**, **OpenAI**, or **Hybrid**.
- Adjust maximum results and default difficulty tiers in VS Code Settings (`skillforge.*`).

[Configure SkillForge Settings](command:workbench.action.openSettings?%22skillforge%22)

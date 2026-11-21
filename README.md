# Wispu plugin for Claude Code and Cursor

Run your Wispu Brand from your AI assistant. Paste notes, a link or a
question, and the assistant offers two or three next steps ("Save these 3
ideas", "Draft the LinkedIn post", "Show the week") and does the one you pick.
It reads your Brand's Context, results and calendar, saves ideas, drafts and
repurposes content in your Brand voice, and prepares images, carousels and
videos. It publishes or spends credits only when you ask.

## What is inside

- **The `wispu` skill.** It starts on its own when you talk about your Brand,
  or type `/wispu:wispu`. It holds the shared rules: which Brand, approvals,
  language, and treating customer text as data.
- **Ten module guides** the skill reads only when it needs them: Context,
  Ideas, Editor, Publishing and calendar, Metrics, Media, Vault, Documents
  (images and carousels), Control Center, and Approvals.
- **Five commands** for longer flows:

| Command | Ask for |
| --- | --- |
| `/wispu:plan-week` | "Plan next week's posts." |
| `/wispu:draft` | "Write a LinkedIn post and a carousel about this idea." |
| `/wispu:repurpose` | "Turn this post into a thread and a newsletter section." |
| `/wispu:pulse` | "What worked this month, and what's next?" |
| `/wispu:publish` | "Schedule it for Tuesday at 9." Runs only when you type it. |

In clients that show MCP Apps, Wispu draws four screens itself: the week
calendar, post metrics, the post preview and the approval card.

Every flow starts with `list_brands` and passes the Brand's code as `brand`
to the other tools.

## Install

### Claude Code

```
/plugin marketplace add wispuhq/wispu-plugin
/plugin install wispu@wispu
```

The plugin connects to `https://wispu.app/api/mcp`. The first call opens
Wispu in your browser to sign in. If the tools do not show up, run `/mcp`,
choose wispu and Authenticate.

### Cursor

Add the server to `.cursor/mcp.json` (or the global one in Cursor settings):

```json
{
  "mcpServers": {
    "wispu": { "url": "https://wispu.app/api/mcp" }
  }
}
```

Then add `plugins/wispu/skills/wispu/SKILL.md` and its `guides` folder as
rules, or ask the agent to follow them.

### Claude (web and desktop)

Settings, Connectors, Add custom connector, URL `https://wispu.app/api/mcp`.
Then add `plugins/wispu/skills/wispu` (the skill and its guides) to a
Project, or ask Claude to follow it.

### ChatGPT

Settings, Connectors (developer mode), Create, URL
`https://wispu.app/api/mcp`, authentication OAuth. ChatGPT does not load
skills, so the tool descriptions guide it.

## Access and approvals

- The assistant works with your own Wispu login: it sees and does what you
  can in each Brand, and nothing more. A Brand can turn agents off in its
  settings.
- Each Brand chooses in Wispu whether its agents' changes apply at once or
  wait in [Approvals](https://wispu.app/approvals). When one waits, a reply in
  the chat is never the approval.
- Publishing, taking a post down and anything that spends credits run only
  when you ask for them in the conversation.
- Manage or revoke the connection in Wispu, Agente IA
  ([wispu.app/account/ai-agent](https://wispu.app/account/ai-agent)).

## Development

`node scripts/check-tool-names.mjs` checks every tool and argument named in
this README, the skill, its guides and the commands against
`catalog/public-mcp-tools.snapshot.json`, a copy of the public tool list. It
also fails when a public tool is named in no guide, and blocks retired and
non-public names. CI runs it on every push and pull request. When the
public tools change, a pull request updates the catalog copy.

## Support

[wispu.app/developers](https://wispu.app/developers)

# Wispu plugin for Claude Code and Cursor

Run your Wispu Brand from your AI assistant. The assistant reads your Brand
context, results and calendar, saves ideas, drafts and repurposes content in
your Brand voice, and prepares posts. Anything that changes existing work, and
every publication, waits until you approve it in Wispu.

## What it can do

| Skill | Ask for |
| --- | --- |
| `wispu-brand-pulse` | "How did LinkedIn do this month? What worked?" |
| `wispu-plan-week` | "Plan next week's posts." |
| `wispu-capture-ideas` | "Save these ideas from my notes." |
| `wispu-draft` | "Write a LinkedIn post and a carousel about this idea." |
| `wispu-variations` | "Turn this post into a thread and a newsletter section." |
| `wispu-edit-draft` | "Make the hook sharper and cut it in half." |
| `wispu-publish` | "Schedule it for Tuesday at 9." |
| `wispu-context` | "Update our offer with the new price." |
| `wispu-reader` | "Save this article to read later." |

Every skill starts with `list_brands` and passes the Brand's code as `brand`
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

Then add the files in `plugins/wispu/skills` as rules, or ask the agent to
follow them.

### Claude (web and desktop)

Settings, Connectors, Add custom connector, URL `https://wispu.app/api/mcp`.
Then add the skills from `plugins/wispu/skills` to a Project, or ask Claude to
follow them.

### ChatGPT

Settings, Connectors (developer mode), Create, URL
`https://wispu.app/api/mcp`, authentication OAuth. ChatGPT does not load
skills, so the tool descriptions guide it.

## Access and approvals

- The assistant works with your own Wispu login: it sees and does what you
  can in each Brand, and nothing more. A Brand can turn agents off in its
  settings.
- New ideas, drafts, formats and Context elements are saved directly.
- Changes to existing work, publications, AI writing that spends credits and
  page imports wait in [Approvals](https://wispu.app/approvals). A reply in
  the chat is never the approval.
- Manage or revoke the connection in Wispu, Agente IA
  ([wispu.app/account/ai-agent](https://wispu.app/account/ai-agent)).

## Development

`node scripts/check-tool-names.mjs` checks every tool and argument named in
this README and the skills against `catalog/public-mcp-tools.snapshot.json`,
a copy of the public tool list, and blocks internal names. CI runs it on every
push and pull request.

## Support

[wispu.app/developers](https://wispu.app/developers)

---
description: Turn a Wispu idea or topic into channel-ready formats in the Brand's voice.
argument-hint: "[idea, topic or link]"
---

# Draft

Follow the rules of the wispu skill. Use its Editor guide for tool details.
What to draft: $ARGUMENTS

1. Find the source: a saved idea (`list_content_ideas(search)`), an existing
   piece (`list_editorial_work(query)`), or the text the person gave. Reuse a
   piece on the same topic instead of creating a second one.
2. If there is no piece, create it with
   `create_editorial_work(title, idea_id, brief_md)`. The brief holds the
   angle, key points, audience and call to action.
3. Read the Brand: `get_brand_context(projection, keys)` for voice and
   messaging, `search_brain(query)` for facts, and
   `list_context_elements(group)` with writing-examples.
4. Ask which channels and formats if the person did not say. Default to one
   LinkedIn text post.
5. Write each format yourself and save it with
   `create_editorial_variation(work_id, expected_work_revision, content)`.
   This spends no credits. Use `request_editor_ai(request, note)` only when
   the person asks Wispu's AI to write it.
6. Show each format in full, labelled by channel and format. Offer the next
   step: more formats (`/wispu:repurpose`), an image or carousel, or
   `/wispu:publish`.

Nothing drafted is published. Never invent facts or results: use a
placeholder such as `[CLIENT RESULT]` and say what is missing.

---
description: Turn one Wispu piece into versions for other channels or formats, or write alternative hooks.
argument-hint: "[piece and target formats]"
---

# Repurpose

Follow the rules of the wispu skill. Use its Editor guide for tool details.
What to repurpose: $ARGUMENTS

1. Read the source: find the piece with `list_editorial_work(query)`, then
   `get_editorial_work(work_id)` and `list_editorial_variations(work_id)`.
2. For each target format, adapt the text yourself and save it with
   `create_editorial_variation(work_id, expected_work_revision, content)`.
   Keep the idea and the facts; change shape, length and hook to fit the
   channel. A carousel needs slides, a thread needs posts, an email needs a
   subject.
3. Alternative hooks for one format: write two or three, show them side by
   side, and save only the one the person picks with
   `update_editorial_variation(work_id, variation_id, expected_revision, expected_work_revision, content, note)`.
4. Wispu's AI (`request_editor_ai(request, note)`) spends credits: use it only
   when the person asks for it.
5. Show every result in full, labelled by channel and format.

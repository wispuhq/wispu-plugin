---
description: Preview, check and publish or schedule a Wispu format to the Brand's connected accounts.
argument-hint: "[piece, channel and time]"
disable-model-invocation: true
---

# Publish

Follow the rules of the wispu skill. Use its Publishing guide for tool
details. What to publish: $ARGUMENTS

1. Find the format: `list_editorial_work(query)`, `get_editorial_work(work_id)`
   and `list_editorial_variations(work_id)`. Keep the piece's, the format's
   and the media revisions.
2. Pick the accounts with `list_editorial_publication_accounts`, and the time
   (`now`, or a date, time and timezone). Ask if either is missing.
3. Show `preview_post(piece_id, variation_id, channel_ids, schedule, options)`.
4. Save with `create_editorial_publication_draft` and check with
   `precheck_editorial_publication`. Fix every problem it reports.
5. Ask the person to confirm: the exact text, media, accounts and time. Wait
   for a clear yes in this conversation.
6. `request_publication` with the draft and the same revisions.
   - Executed: it is published or scheduled. Confirm with
     `list_publications(from, to)`.
   - Pending: give the approval link and stop. When the person says they
     approved it, check with `get_approval(approval_id)`.

Any change to the text, accounts or time after step 3 needs a new preview.

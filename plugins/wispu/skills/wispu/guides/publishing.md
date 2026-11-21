# Publishing and calendar

A post goes out from one format of an Editor piece to one or more connected
accounts. Publish or schedule only when the person asks for it in this
conversation, after they saw the preview. `/wispu:publish` runs the whole
flow.

## Calendar

`list_publications(from, to)` lists the posts in a window of up to 45 days
with their status, text, media and revision. In clients with screens it shows
the week calendar.

## Prepare and publish

1. `list_editorial_publication_accounts` lists the Brand's connected
   accounts. If none fits the channel, say so: the person connects it in
   Wispu.
2. Read the piece with `get_editorial_work(work_id)` and the format with
   `list_editorial_variations(work_id)`. Keep the piece's revision, the
   format's revision and its media revision (0 when it has no image or
   video).
3. Network options:
   - `list_publication_destinations(connection_id, kind)` lists Pinterest
     boards, YouTube playlists or Google Business locations to name in the
     options.
   - `get_publication_tiktok_creator(connection_id, media_type)` returns a
     TikTok account's posting options.
   - Subtitles or a LinkedIn PDF: `request_publication_file_upload(kind, name, size)`,
     PUT the bytes, then name the file in the options.
     `get_publication_file_link(format, file_id, version)` opens the exact file
     a post will send.
4. `preview_post(piece_id, variation_id, channel_ids, schedule, options)` shows
   what each account will show. Nothing is saved.
5. `create_editorial_publication_draft(work_id, variation_id, expected_work_revision, expected_variation_revision, expected_media_revision, connection_ids, schedule, options)`
   saves the preparation. `schedule` is `now`, or `scheduled` with a time and
   an IANA timezone.
6. `precheck_editorial_publication(draft_id, work_id, variation_id, expected_work_revision, expected_variation_revision, expected_media_revision, connection_ids, schedule, options)`
   reports problems without saving. Fix them first.
7. Get the person's go in chat, then
   `request_publication(draft_id, work_id, variation_id, expected_work_revision, expected_variation_revision, expected_media_revision, connection_ids, schedule, options, note)`.
   Depending on the Brand, it publishes at once or waits in Approvals.
8. Report it as published or scheduled only when `list_publications` or
   `get_approval` shows it.

Drafts: `list_editorial_publication_drafts(work_id)`,
`get_editorial_publication_draft(draft_id)`,
`list_editorial_publication_draft_versions(draft_id)`, and
`cancel_editorial_publication_draft(draft_id, expected_revision, reason)` to
drop one. Any change to the text, accounts or time needs a new preparation.

## After it is sent

Read the post's revision in `list_publications` first.

- `request_publication_cancel(publication_id, expected_revision, note)`
  removes a scheduled post.
- `request_publication_unpublish(publication_id, expected_revision, note)`
  takes a published one down. Ask first.
- `request_publication_retry(publication_id, expected_revision, note)`
  retries a failed one.

## Posts published outside Wispu

A post made in the network's own app on a connected account is not a Wispu
publication. Link it to its format before anything publishes that format
again on that network.

- `list_external_posts` lists the latest such posts, with `linked` when
  someone already said which format each one is.
- `sync_external_posts(url)` reads one post by its public link (without `url`
  it reads every connected account's latest posts).
- `link_external_post(external_post_id, expected_revision, variation_id)` says
  which format the post is; `variation_id` null clears the link. Wispu then
  refuses to publish that format again on that network only. It does not
  cancel a post already scheduled: use `request_publication_cancel` for that.

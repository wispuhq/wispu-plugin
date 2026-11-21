# Media

Creatives holds the Brand's videos, images, carousels, scene-based videos
and AI generations. Images and carousels have their own guide:
[Documents](documents.md). A person reviews every new version in Wispu.

## Find what exists

- `list_media_catalog(kind, format, status, lifecycle, q)` lists every saved
  piece, most recently changed first. Follow `cursor` until it ends.
  `get_media_catalog_preview(kind, item_id)` shows one.
- `get_media_brand_kit` reads the visual identity every new piece starts
  from. A person edits it in Wispu.

## Ask for a new piece

`request_media_piece(kind, title, idea, networks, parts, source, styleId, sfx, music, who, creditCap)`
asks for a reel, video, carousel, stories, image or cuts of a long video. To
make it for an Editor format, pass `editorWorkId` and `editorVariationId`.
Then `get_media_piece_request(request_id)` returns the request and the tools
that build its plan. `list_media_piece_requests(open)` lists requests.

## Images and clips the Brand owns

- `list_media_assets(kind)` lists uploaded images or video clips;
  `get_media_asset(asset_id)` reads one with a fresh link.
  `list_media_images` lists the images a slide can show.
- Upload: `request_media_asset_upload(kind, name, type, size)`, PUT the bytes
  to the link, then `confirm_media_asset_upload(upload_id, kind, name, type, size)`.
- `archive_media_asset(asset_id)` takes one off the Vault; pieces that use it
  keep it.

## AI images and video (spends credits)

Only when the person asks. A person confirms the price in Wispu.

- `request_media_generation(kind, stage, model, prompt, params)` requests a
  draft (stage draft, a cheap model) or a final.
  `request_media_final(generation_id, model)` turns a finished draft into the
  final. `cancel_media_generation(generation_id)` withdraws a request nobody
  confirmed.
- `list_media_generations` lists them with the month's spend and cap;
  `get_media_generation(generation_id)` reads one.
- Scene-based videos: `list_media_storyboards` and
  `get_media_storyboard(storyboard_id)`. Planning them stays with people.

## Videos

- `list_media_videos` and `get_media_video(video_id)` read videos and their
  brief, status and current version.
- `create_media_video(title, kind, format, brief)` starts one.
- Bring in a recording: `import_media_tella_video(url)` for a Tella link the
  Brand connected, `import_media_drive_video(url, title)` for a public Google
  Drive link.
- Versions: `list_media_video_versions(video_id)`;
  `restore_media_video_version(video_id, version_id, baseRevision)` brings an
  earlier one back as a new version.
- Notes at an exact moment: `list_media_video_notes(video_id, version_id)` and
  `add_media_video_note(video_id, version_id, atMs, text)`. The next version
  takes every open note.
- Originals: `list_media_video_sources(video_id)`,
  `get_media_video_source_transcript(video_id, source_id)` and
  `get_media_video_source_download(video_id, source_id)`.
- Files of a version: `get_media_video_download(video_id, version_id, role)`.
- Ask for another version:
  `request_media_video_work(video_id, baseRevision, baseVersionId, instructions, adapter)`.
  `list_media_video_work(video_id)` and `get_media_video_work(video_id, work_id)`
  follow it.

## Editing a video yourself

These tools are for an agent that renders the video on the person's machine.
Read `get_media_video_guide(subtype)` first; `list_media_edit_references(subtype)`
and `list_media_video_edit_references(video_id)` show approved videos and how
they were edited.

1. Plan: `get_media_video_plan(video_id, round_id, files)`,
   `open_media_video_plan_round(video_id, kind, summary, timing, durationMs, width, height)`,
   upload each file, then
   `submit_media_video_plan_round(video_id, round_id, verification, addressedNoteIds)`.
   Notes on the plan: `add_media_video_plan_note(video_id, round_id, text)` and
   `delete_media_video_plan_note(video_id, note_id)`. Wait for the person to
   approve the plan.
2. Claim the work: `claim_media_video_work(video_id, work_id)`, and keep the
   lease alive or report a failure with
   `report_media_video_work(video_id, work_id, status)`.
3. Files: `request_media_video_upload(video_id, intent)` reserves an upload;
   `register_media_video_source(video_id, source)` adds an original;
   `get_media_video_work_audio_download(video_id, work_id, audio_id)` gets the
   chosen music or effect.
4. A scene from a still: `request_media_video_scene(video_id, work_id, model, prompt, source)`.
   It spends workspace credits and may run without a person's confirmation
   inside an approved plan, so use it only when the person asked for scenes.
5. Deliver: `complete_media_video_work(video_id, work_id, delivery, reservations)`.
   A person reviews the new version.

## Styles and sound

- Video styles: `list_media_creative_styles`, `get_media_creative_style(style_id)`
  and `get_media_creative_style_reference(style_id)` (its sample and saved
  analysis). `publish_media_creative_style(style)` saves a new version of a
  private style.
- A style's sample video:
  `request_media_creative_style_preview_upload(style_id, bytes, sha256, contentType)`,
  upload it, then `attach_media_creative_style_preview(style_id, previewId, bytes, sha256)`.
  After watching it, save what you found with
  `attach_media_creative_style_analysis(style_id, previewId, analysis)`.
- Styles saved from Vault posts: `list_media_vault_styles(family)`; see
  [Vault](vault.md).
- Music and sound effects: `list_media_creative_audio(kind)` and
  `get_media_creative_audio_download(audio_id)`. To add the Brand's own:
  `request_media_creative_audio_upload(intent)`, upload, then
  `publish_media_creative_audio(reservationId, scope, audio)`.

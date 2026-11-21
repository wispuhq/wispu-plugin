# Documents

Images and carousels made with the Brand's identity: its fonts, colors,
handle and logo from the Brand Kit (`get_media_brand_kit`). A person reviews
and approves every version.

## Read

- `list_static_documents` lists drafts with their format, status and
  revision. `get_static_document(document_id)` reads one: slides in order
  (some locked by a person), theme, versions under review, and the issues
  left.
- `list_media_images` lists the images a slide can show.

## Create and revise

1. `create_static_document(title, brief, format, slides)` creates a draft.
   The answer lists issues; those with severity error (text that does not
   fit, low contrast) must be fixed before review.
2. Optional style: `list_media_vault_styles(family)` with family static lists
   the Brand's image and carousel styles;
   `select_static_document_style(document_id, styleId)` applies one and
   `get_static_document_style(document_id)` reads it.
3. `save_static_document_revision(document_id, baseRevision, slides)` saves a
   new revision. Send every slide in its final order: `{id}` keeps a slide as
   it is, `{id, ...fields}` changes those fields, a slide without id is new,
   and a slide you leave out is removed. Keep locked slides with `{id}` only.
4. `submit_static_document_for_review(document_id, baseRevision)` freezes the
   revision and exports a PNG per slide, a ZIP and a PDF.

## Notes and files

- `list_static_document_notes(document_id)` lists notes, overall or per
  slide. `add_static_document_note(document_id, text, slideId, versionId)`
  leaves one.
- Answer open notes in a new revision, submit it, then mark them with
  `resolve_static_document_notes(document_id, versionId, noteIds)`.
- `get_static_version_downloads(document_id, version_id)` returns links to a
  submitted version's files.

## Archive

`archive_static_document(document_id, note)` takes an image or carousel off
the Brand's list. No tool brings it back, so treat it as a delete: archive
only when the person asks for that document, and tell them which one before
you do. It follows the Brand's approvals setting, and `note` tells the
approver why. Archiving one already archived changes nothing.

To use a finished image or carousel on a post, set it as the format's
creative: see [Editor](editor.md).

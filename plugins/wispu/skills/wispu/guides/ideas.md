# Ideas

The Ideas board keeps topics the Brand may write about. Saving an idea starts
no work.

## Propose and save

1. Ground new ideas first: `search_brain(query)` for the Brand's pillars,
   audience and offers, and `list_content_ideas(search, view, stage)` so you
   do not repeat a saved one.
2. `list_content_idea_options` returns the pillars, segments, lead magnets
   and members an idea can point to, with their ids.
3. Show the ideas before saving: a title the person would say out loud, one
   or two lines on the angle, and the pillar it serves.
4. Save each idea the person keeps with
   `create_content_idea(title, content_md, stage, pillar_id, segment_id, cta_id, awareness, subformats)`,
   a new `idempotency_key` each.
5. `get_idea_prior_work(idea_id)` shows earlier similar ideas and what came
   of them. A repeat of a strong piece can work with a new hook; a repeat of a
   weak one needs a new angle. The person decides.

## Change saved ideas

- Read with `get_content_idea(idea_id)` and keep its revision.
- `update_content_idea(idea_id, expected_revision, title, content_md, stage, pinned, assigned_user_id, note)`
  changes it; `archive_content_idea(idea_id, expected_revision, note)` and
  `restore_content_idea(idea_id, expected_revision, version_revision, note)`
  archive or bring it back. `list_content_idea_versions(idea_id)` lists its
  versions.

## Rules

- Titles name the subject ("Why studios lose clients to referrals"), not an
  instruction ("Write a post about referrals").
- To write an idea, move to the [Editor](editor.md) or `/wispu:draft`.

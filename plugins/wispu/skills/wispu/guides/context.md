# Context

What Wispu knows about the Brand: four Brand documents, Context elements,
Knowledge and the Brain that answers questions from all of it. Everything
Wispu writes for the Brand reads from here.

## Read

- `get_brand_context(projection, keys)` reads the Brand documents:
  `brand_voice`, `icp`, `offerings` and `messaging`. `projection` `current`
  adds the Brand's ready Context elements; `stored` (the default) is the
  document alone.
- `list_context_elements(group, search, view)` lists elements by group:
  fundamentals, pillars, segments, lead-magnets, products, writing-examples
  or sources. `get_context_element(element_id)` reads one in full,
  `get_element_provenance(element_id)` says where it came from, and
  `list_element_versions(element_id)` lists its versions.
- `search_brain(query, max_results)` answers a question from everything the
  Brand has. `search_brand_knowledge(query, kind)` searches only Knowledge.
- `list_knowledge_sources(view)` lists Knowledge sources;
  `get_knowledge_source(source_id, offset, max_chars)` reads one source page
  by page; `get_knowledge_note(note_id)` reads a note.

Quote what the tools return. Do not add facts.

## Change a Brand document

1. Read it with `get_brand_context(projection, keys)` and `projection`
   `stored`. Never send back `current` text: it would copy the Context
   elements into the document.
2. Write the complete new Markdown. Mark unknown facts instead of inventing
   them.
3. `request_brand_document_change(key, content_md, expected_updated_at, note)`
   with the `updated_at` you read (null for a document never saved).
4. A 409 means the document changed: read it again. A 413 means it is too
   long for one request: the person edits it in Wispu.

## Context elements

- `create_context_element(group, title, content_md, status, source_url, element_type, note)`
  saves a new element. Use `status` draft unless the person wants it used
  now: only ready elements go into what Wispu writes.
- `update_context_element(element_id, expected_revision, title, content_md, status, note)`,
  `archive_context_element(element_id, expected_revision, note)` and
  `restore_context_element(element_id, expected_revision, version_revision, note)`
  change one. Change one element per request and say why in `note`.

## Knowledge

- `create_knowledge_note(title, body, note)` adds a note.
  `update_knowledge_note(note_id, expected_revision, title, body, note)`
  changes one.
- `import_knowledge_source(url, kind, note)` reads one public page into
  Knowledge. `update_knowledge_source(source_id, action, expected_updated_at, note)`
  refreshes or removes a source.

## AI help with Context (spends credits)

Run these only when the person asks. Each one shows its cost before it runs.

- Brain generation: `generate_brain(customer, offer, source_ids, note)`
  drafts the Brand's Context from its customer, offer and sources.
  `list_brain_generations(run_id)` follows it;
  `retry_brain_generation_task(run_id, seq, note)` retries one failed task.
- One element: `quote_context_ai_task(request)` prices it,
  `get_context_ai_task(task_id)` and `list_context_ai_tasks` follow it,
  `generate_context_element(task_id, digest, note)` writes it, and
  `accept_context_ai_task(task_id, digest, expected_revision, note)` keeps
  the candidate.

---
description: Plan the next week of content for a Wispu Brand from its results, its calendar and its Context.
argument-hint: "[Brand or focus]"
---

# Plan the week

Follow the rules of the wispu skill (Brand, ids, approvals, customer text).
Focus from the person, if any: $ARGUMENTS

1. What is already coming: `list_publications(from, to)` for the next 14
   days, and `list_approvals(status)` with status open. Do not plan over scheduled
   posts.
2. What worked: `get_report_insights(from, to)` and
   `get_social_publication_outcomes(from, to)` for the last 30 days. The
   Metrics guide goes deeper.
3. What the Brand stands for: `search_brain(query)` for its pillars, audience
   and offers, and `get_strategy` for this quarter's goals.
4. What is saved: `list_content_ideas(search, stage)` and
   `list_editorial_work(query)`, so you do not repeat a topic.
5. Propose 3 to 5 pieces. For each: a title the person would say out loud,
   the angle, the channel and format, the day, and the evidence behind it (a
   past post, a pillar, a saved idea).
6. Save the ideas the person keeps with
   `create_content_idea(title, content_md, pillar_id, subformats)`, one call
   each. `list_content_idea_options` gives the pillar ids.
7. Offer to draft the first one now with `/wispu:draft`.

A plan is a proposal. Nothing is scheduled until the person publishes it.

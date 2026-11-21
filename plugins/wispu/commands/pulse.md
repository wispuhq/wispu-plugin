---
description: Review what worked for a Wispu Brand over a period and propose what to do next.
argument-hint: "[period, e.g. last 30 days]"
---

# Pulse

Follow the rules of the wispu skill. Use its Metrics guide for tool details.
Period: $ARGUMENTS (default: the last 30 days, against the 30 before).

1. `get_report_insights(from, to)` for the written summary per goal.
2. `get_social_brand_report(from, to, kind)` for totals with their coverage,
   and `list_post_metrics(from, to, sort_by, order)` for the best and worst
   posts.
3. For the two or three posts that stand out, read the text
   (`list_publications(from, to)` or `get_social_post_original`) and any saved
   analysis (`get_content_analysis`).
4. Report: two or three sentences on what moved and why the evidence
   suggests it, each claim tied to a post. Say when the sample is small.
5. Propose what's next: repeat a winning angle with a new hook, drop what
   did not work, and offer `/wispu:plan-week` or `/wispu:draft`.

Reads spend nothing. Do not request new captures or analyses unless the
person asks.

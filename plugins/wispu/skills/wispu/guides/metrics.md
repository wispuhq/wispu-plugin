# Metrics

These tools read what Wispu already captured. A read never captures again
and spends nothing. Dates are `YYYY-MM-DD`, and `to` is inclusive.

## The written summary

`get_report_insights(from, to, locale, granularity, sources)` returns the top
figures and one short paragraph per goal, written from the Brand's own
numbers without AI. Start here for "how are we doing?". A goal marked
unmeasured has no connected source yet; unavailable means try again later. A
figure that could not be read is left out, never shown as zero.

## Social results

- All accounts: `get_social_brand_report(from, to, kind, granularity)` for
  totals (`kind` `posts` or `followers`). Read each total with its coverage: a
  total without it may be a partial sum.
- Posts published from Wispu: `get_social_publication_outcomes(from, to)`.
- Per post across channels: `list_post_metrics(from, to, sort_by, order, networks)`
  for up to 92 days. In clients with screens it shows the post metrics.
- One account: `list_social_analytics_accounts` gives each account's
  connection id and account key. Then
  `get_social_analytics_report(connection_id, account_key, from, to, top_limit)`
  for its top posts,
  `get_social_analytics_performance(connection_id, account_key, from, to, metric)`
  for posts ranked by one metric,
  `get_social_account_analytics_report(capture_kind, connection_id, account_key, from, to)`
  for followers or daily activity,
  `get_social_account_insights_report(connection_id, account_key, from, to)`
  and `get_social_posting_patterns(connection_id, account_key)`.
- Audience: `list_social_audience_accounts(platform, metric, timeframe)` and
  `get_social_audience_report(connection_id, account_key, platform, metric, timeframe)`.
- One captured post's text and media:
  `get_social_post_original(connection_id, account_key, run_id, snapshot_id)`.

When data is old or missing, `request_social_analytics_sync(sync, note)` asks
for a new capture of one account. Ask the person first.

## Why a post worked

`get_content_analysis(kind, publication_id, connection_id, account_key, run_id, snapshot_id)`
reads a saved analysis. `request_content_analysis(analysis, note)` asks for a
new one; it spends credits, so only when the person asks.

## Metrics sections

`get_metric_sections` returns which metrics each section of the Metrics page
shows (the same for everyone on the Brand) and whether this person may change
it. `update_metric_sections(sections)` sets the sections it names; the others
keep theirs. It also takes `cards`, the cards a report shows above its chart.
The only report with cards today is in a module the public connection does
not include, so leave `cards` out. Pinned metrics on Control Center are
separate: see [Control Center](control-center.md).

## How to report

- Lead with two or three sentences: what moved, on which channel, and what
  the evidence suggests.
- Cite the post (its link and a short excerpt) for every claim.
- Keep channels separate unless the evidence covers several.
- Say when the sample is small or the data is old. Never claim a cause from
  one correlation.

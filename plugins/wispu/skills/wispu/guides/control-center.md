# Control Center

The Brand's home: what waits today, the metrics the person pinned, the
year's goals and KPIs, and the Brand's settings.

## Today

`get_control_center_today` returns the "For today" counts and which metrics
feed this year's KPIs. Each section answers on its own: ok with a value,
not_applicable when it is not this person's or this Brand's to see, or error.
Never report a section you could not read as zero. Pending approvals are not
part of it: add `list_approvals` (see [Approvals](approvals.md)).

## First steps

`get_first_steps` says which setup steps a new Brand has done: its context
in the Brain, a social account that can publish, a saved idea, and a first
post scheduled or out. Use it to suggest the next step, one at a time. When
`eligible` is false, the Brand was set up before these steps existed: answer
about a step if asked, but do not walk the person through setup. A
not_applicable step belongs to a module that is off or that this person
cannot read, so never ask them to do it. A step with error could not be read.

## Pinned metrics

`get_control_center_pins` reads the metrics this person pinned, in order.
`update_control_center_pins(metric_ids)` replaces the whole list; other
members keep theirs. A metric whose source is not connected shows nothing.

## Goals and KPIs

- `get_strategy` reads the strategy: focus, goals and their KPIs.
  `update_strategy_focus(expected_revision, focus, audience, advantage, deferred_bets)`
  and `update_strategy_settings(expected_revision, weekly_checkin_day, weekly_checkin_time, default_kpi_cadence)`
  change it.
- Measured progress: `list_strategy_kpi_links`,
  `get_strategy_metrics(year, quarter)` and the quarterly
  `get_strategy_report(year, quarter)`.
- Weekly check-ins: `get_strategy_weekly_agenda` lists what is due;
  `create_strategy_checkin(subject_id, expected_revision, date, progress, confidence)`
  records one; `create_strategy_comment(subject_id, expected_revision, body)`
  comments on a goal. `list_strategy_activity(subject_id)` shows the history.
- Records: `save_strategy_record(record_id, expected_revision, kind, record)`
  and `delete_strategy_record(record_id, kind, expected_revision)`.
- Drafting changes to a strategy element:
  `start_strategy_draft(element, expected_revision, reason)`,
  `update_strategy_draft(element, expected_revision, reason, content)`,
  `publish_strategy_draft(element, expected_revision)` or
  `cancel_strategy_draft(element, expected_revision)`.
  `list_strategy_element_versions(element)` lists versions.
- `update_revenue_models(models, expected_revision)` sets how the Brand earns
  money, which decides the metrics that apply.

## Brand and workspace

- `get_me` reads the person; `get_brand` reads the Brand's settings, such as
  its content language and timezone.
  `update_brand(name, content_language, timezone, reporting_currency, note)`
  changes them.
- `list_brand_modules` lists the Brand's modules;
  `update_brand_module(module, on, note)` turns one on or off.
- Folders group Brands in the sidebar: `list_brand_folders`,
  `create_brand_folder(name)`, `update_brand_folder(folder_id, name)`,
  `delete_brand_folder(folder_id)` and
  `move_brand_to_folder(brand_code, folder_id)`.
